from datetime import datetime
import os
import queue
import subprocess
import threading
import time
import wave
from flask import Flask, Response, jsonify, request
import cv2
import humanize
import numpy as np
import sounddevice as sd
from flask import send_from_directory
from werkzeug.utils import secure_filename


app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = Response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response

streaming = False
recording = False
camera = None
video_writer = None
audio_queue = queue.Queue()
frame_lock = threading.Lock()
audio_lock = threading.Lock()
last_frame_time = 0
fps = 0
frame_count = 0
last_fps_update = 0
put_fps = False
count = 0
current_video_path = None
current_audio_path = None
audio_thread = None

RECORDINGS_DIR = './recordings'
VIDEO_RESOLUTION = (640, 480)
VIDEO_FPS = 20
AUDIO_SAMPLE_RATE = 16000
AUDIO_CHANNELS = 1
AUDIO_DEVICE = None

def initialize_camera():
    global camera

    # Camera nativa
    # camera = cv2.VideoCapture(0, cv2.CAP_V4L2)

    camera = cv2.VideoCapture(0)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, VIDEO_RESOLUTION[0])
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, VIDEO_RESOLUTION[1])
    camera.set(cv2.CAP_PROP_FPS, VIDEO_FPS)

def audio_callback(indata, frames, time, status):
    """Called for each audio block from sounddevice"""
    if recording:
        with audio_lock:
            audio_queue.put(indata.copy())

def generate_frames():
    global camera, last_frame_time, fps, frame_count, last_fps_update, video_writer, count
    while streaming:
        current_time = time.time()

        # Update FPS counter
        if current_time - last_fps_update >= 1.0:
            fps = frame_count
            frame_count = 0
            last_fps_update = current_time

        with frame_lock:
            if camera is None or not camera.isOpened():
                continue

            success, frame = camera.read()
            if not success:
                continue

            frame = cv2.resize(frame, VIDEO_RESOLUTION)
            
            if put_fps:
                count += 1
                count_text = f"{count}"
                fps_text = f"{fps}"
                cv2.putText(frame, fps_text, (frame.shape[1] - 20, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 200, 0), 2)
                cv2.putText(frame, count_text, (20, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 200, 0), 2)

            if recording and video_writer is not None:
                video_writer.write(frame)

            _, buffer = cv2.imencode('.jpg', frame)
            frame_count += 1
            last_frame_time = current_time

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        
def start_recording():
    global video_writer, current_video_path, current_audio_path, RECORDINGS_DIR
    if not os.path.exists(RECORDINGS_DIR):
        os.makedirs(RECORDINGS_DIR)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_filename = os.path.join(RECORDINGS_DIR, f"recording_{timestamp}")
    
    # Video writer
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    current_video_path = f"{base_filename}.avi"
    video_writer = cv2.VideoWriter(
        current_video_path,
        fourcc,
        VIDEO_FPS,
        VIDEO_RESOLUTION
    )
    
    current_audio_path = f"{base_filename}.wav"
    return current_video_path, current_audio_path

def get_file_info(directory):
    """Scan a directory and return file information"""
    file_list = []
    
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    for idx, filename in enumerate(os.listdir(directory)):
        filepath = os.path.join(directory, filename)
        is_dir = os.path.isdir(filepath)
        stat = os.stat(filepath)
        
        file_info = {
            "id": str(idx + 1),
            "name": filename,
            "type": "directory" if is_dir else "file",
            "size": humanize.naturalsize(stat.st_size) if not is_dir else "",
            "duration": humanize.naturaldelta(stat.st_mtime - stat.st_ctime) if not is_dir else "",
            "modifiedDate": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "path": f"/{filename}",
            "extension": os.path.splitext(filename)[1].lower() if not is_dir else ""
        }
        
        file_list.append(file_info)
    
    return file_list

def combine_audio_video(video_path, audio_path):
    """Combine video and audio using ffmpeg with audio delay"""
    output_path = os.path.splitext(video_path)[0] + "_final.mp4"
    
    command = [
        'ffmpeg',
        '-y',
        '-i', video_path,      # Video input
        '-itsoffset', '3',     # Add 3-second input timestamp offset
        '-i', audio_path,      # Audio input (will be delayed)
        '-c:v', 'copy',        # Copy video stream
        '-c:a', 'aac',         # Encode audio to AAC
        '-filter_complex', '[1:a]adelay=3000|3000[delayed_audio]',  # 3-second delay
        '-map', '0:v',         # Use video from first input
        '-map', '[delayed_audio]',  # Use delayed audio
        '-shortest',           # End with the shortest stream
        output_path
    ]
    
    try:
        subprocess.run(command, check=True)
        os.remove(video_path)
        os.remove(audio_path)
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"Error combining files: {e}")
        return None


def save_audio(filename):
    """Save audio data from queue to WAV file"""
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(AUDIO_CHANNELS)
        wf.setsampwidth(2)
        wf.setframerate(AUDIO_SAMPLE_RATE)
        
        while recording or not audio_queue.empty():
            try:
                data = audio_queue.get(timeout=1)
                wf.writeframesraw((data * 32767).astype(np.int16))
            except queue.Empty:
                continue

@app.route('/recordings/<path:filename>')
def serve_recording(filename):
    return send_from_directory(RECORDINGS_DIR, filename, as_attachment=False)

@app.route('/recordings/download/<path:filename>')
def serve_recording_dowload(filename):
    return send_from_directory(RECORDINGS_DIR, filename, as_attachment=True)

@app.route('/recordings/delete/<path:filename>', methods=['DELETE'])
def delete_recording(filename):
    try:
        safe_filename = secure_filename(filename)
        file_path = os.path.join(RECORDINGS_DIR, safe_filename)
        
        if not os.path.exists(file_path):
            return jsonify({
                "error": "File not found",
                "filename": safe_filename
            }), 404
        
        if not os.path.isfile(file_path):
            return jsonify({
                "error": "Path is not a file",
                "filename": safe_filename
            }), 400

        os.remove(file_path)
        
        return jsonify({
            "message": "File deleted successfully",
            "filename": safe_filename
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "filename": safe_filename
        }), 500

@app.route('/start-record', methods=['POST'])
def start_record():
    global recording, audio_stream, audio_thread, current_video_path, current_audio_path
    if not recording:
        current_video_path, current_audio_path = start_recording()
        
        audio_stream = sd.InputStream(
            samplerate=AUDIO_SAMPLE_RATE,
            channels=AUDIO_CHANNELS,
            callback=audio_callback,
            device=AUDIO_DEVICE
        )
        audio_stream.start()
        
        audio_thread = threading.Thread(
            target=save_audio,
            args=(current_audio_path,)
        )
        audio_thread.start()
        
        recording = True
        return jsonify({
            "message": "Recording started",
            "video_file": current_video_path,
            "audio_file": current_audio_path
        })
    return jsonify({"message": "Recording already in progress"})

@app.route('/stop-record', methods=['POST'])
def stop_record():
    global recording, video_writer, audio_stream, current_video_path, current_audio_path, audio_thread, recording_start_time
    if recording:
        recording = False
        
        if video_writer is not None:
            video_writer.release()
            video_writer = None
            
        if audio_stream is not None:
            audio_stream.stop()
            audio_stream.close()
        
        if audio_thread is not None:
            audio_thread.join()
            audio_thread = None
        
        if current_video_path and current_audio_path:
            final_path = combine_audio_video(current_video_path, current_audio_path)
            current_video_path, current_audio_path = None, None
            
            file_name = os.path.basename(final_path)
            
            return jsonify({
                "message": "Recording stopped and files combined",
                "name": file_name,
                "final_file": final_path
            })
            
        return jsonify({"message": "Recording stopped but no files found"})
    return jsonify({"message": "No active recording"})

@app.route('/stop-stream', methods=['POST'])
def stop_stream():
    global streaming, camera, recording, video_writer
    streaming = False
    recording = False
    if video_writer is not None:
        video_writer.release()
        video_writer = None
    if camera:
        camera.release()
        camera = None
    return jsonify({"message": "Streaming and recording stopped"})

@app.route('/video')
def video_feed():
    global streaming, camera
    if not streaming:
        streaming = True
        initialize_camera()

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/recordings', methods=['GET'])
def list_recordings():
    recordings_dir = './recordings'
    try:
        files = get_file_info(recordings_dir)
        return jsonify({
            "path": recordings_dir,
            "files": files,
            "count": len(files),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500


@app.route('/')
def home():
    return "nada por aqui."

if __name__ == '__main__':
    if not os.path.exists(RECORDINGS_DIR):
        os.makedirs(RECORDINGS_DIR)
        
    app.run(host='0.0.0.0', port=8888, threaded=True)