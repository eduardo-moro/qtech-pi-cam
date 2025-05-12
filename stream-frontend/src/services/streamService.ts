
import { StreamSettings } from "../pages/Settings";

export interface StreamConnection {
  isConnected: boolean;
  streamUrl: string | null;
  error?: string;
}

/**
 * Connect to a stream using the provided settings
 * @param settings Stream connection settings
 * @returns Promise with connection status and stream URL
 */
export const connectToStream = async (settings: StreamSettings): Promise<StreamConnection> => {
  try {
    const streamUrl = `http://${settings.host}:${settings.port}${settings.path}`;
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      isConnected: true,
      streamUrl,
    };

  } catch (error) {
    return {
      isConnected: false,
      streamUrl: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Disconnect from the current stream
 * @returns Promise that resolves when disconnected
 */
export const disconnectFromStream = async (): Promise<void> => {
  // In a real implementation, this would:
  // 1. Close WebRTC peer connection or MJPEG stream
  // 2. Release resources
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Start recording a stream
 * @param streamUrl The stream URL to record
 * @returns Promise with recording ID
 */
export const startRecording = async (p0: string) => {
  const response = await fetch('http://192.168.100.46:8888/start-record', {
    method: 'POST'
  });
  
  if (!response.ok) throw new Error('Failed to start recording');
  return response.json();
};

/**
 * Stop recording a stream
 * @param recordingId The ID of the recording to stop
 * @returns Promise with recording details
 */
export const stopRecording = async (): Promise<{
  name: string;
  date: Date;
  duration: string;
  size: string;
}> => {
  const response = await fetch('http://192.168.100.46:8888/stop-record', {
    method: 'POST'
  });

  if (!response.ok) throw new Error('Failed to stop recording');

  // Generate random duration between 10s and 5min
  const seconds = Math.floor(Math.random() * 290) + 10;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Generate random file size between 5MB and 200MB
  const sizeMB = Math.floor(Math.random() * 195) + 5;

  return {
    name: `Stream Recording ${new Date().toISOString().split('T')[0]}.mp4`,
    date: new Date(),
    duration: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
    size: `${sizeMB} MB`,
  };
};

export const fetchRecordings = async () => {
  const response = await fetch('http://192.168.100.46:8888/recordings');
  if (!response.ok) throw new Error('Failed to fetch recordings');
  return response.json();
};
