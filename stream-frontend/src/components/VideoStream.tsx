
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, CircleIcon, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { connectToStream, disconnectFromStream } from "@/services/streamService";
import { StreamSettings } from "@/pages/Settings";

interface VideoStreamProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

const VideoStream: React.FC<VideoStreamProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording
}) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<StreamSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('streamSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Function to connect to stream using current settings
  const connectToStreamSource = async () => {
    if (!settings) {
      toast({
        title: "No settings found",
        description: "Please configure stream settings first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await connectToStream(settings);

      if (result.isConnected && result.streamUrl) {
        setIsConnected(true);
        setStreamUrl(result.streamUrl);
        toast({
          title: "Stream Connected",
          description: `Connected to stream on ${settings.host}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.error || "Could not connect to stream",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to disconnect from stream
  const disconnectStreamSource = async () => {
    if (isRecording) {
      onStopRecording();
    }

    setIsLoading(true);

    try {
      await disconnectFromStream();
      setIsConnected(false);
      setStreamUrl(null);
      toast({
        title: "Stream Disconnected",
        description: "The video stream has been disconnected",
      });
    } catch (error) {
      toast({
        title: "Disconnect Error",
        description: "Error disconnecting from stream",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  // Get connection details for display
  const getConnectionDetails = () => {
    if (!settings || !streamUrl) return null;

    return {
      host: settings.host,
      port: settings.port,
      path: settings.path,
    };
  };

  const connectionDetails = getConnectionDetails();

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Transmissão</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-sm mr-2">{isConnected ? 'Conectado' : 'Desconectado'}</span>
              <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </div>
          </div>
        </div>
        {connectionDetails && (
          <div className="mb-4 bg-black/20 p-2 rounded-md text-sm">
            <p><strong>Fonte:</strong> <a target="_blank" href={`http://${connectionDetails.host}:${connectionDetails.port}${connectionDetails.path}`}>{connectionDetails.host}:{connectionDetails.port}{connectionDetails.path}</a></p>
          </div>
        )}
        <div className="video-container relative bg-black/10 rounded-md min-h-64 flex items-center justify-center">
          {isConnected ? (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
              <img
                src={streamUrl || ''}
                alt="MJPEG Stream"
                style={{aspectRatio: "4/3"}}
                className="max-w-full shadow mb-4 bg-black/20 p-2 rounded-md text-sm"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <VideoOff className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-center text-muted-foreground mb-4">
                No active stream connection
              </p>
              {settings ? (
                <p className="text-xs text-center text-muted-foreground">
                  Pronto para conectar
                </p>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToSettings}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar transmissão
                </Button>
              )}
            </div>
          )}

          {isRecording && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center space-x-1 bg-red-500/80 text-white px-2 py-1 rounded-md text-xs">
                <CircleIcon className="w-3 h-3" />
                <span>REC</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {!isConnected ? (
            <Button
              variant="outline"
              className="flex-1"
              onClick={connectToStreamSource}
              disabled={!settings || isLoading}
            >
              <Video className="mr-2 h-4 w-4" />
              Conectar
            </Button>
          ) : (
            <>
              {!isRecording ? (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={onStartRecording}
                >
                  <CircleIcon className="mr-2 h-4 w-4" />
                  Iniciar gravação
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onStopRecording}
                >
                  <CircleIcon className="mr-2 h-4 w-4" />
                  Parar gravação
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={disconnectStreamSource}
                disabled={isLoading}
              >
                <VideoOff className="mr-2 h-4 w-4" />
                Desconectar
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoStream;
