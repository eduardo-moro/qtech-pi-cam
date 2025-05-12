/* eslint-disable no-constant-binary-expression */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import VideoStream from '@/components/VideoStream';
import RecordingsList, { Recording } from '@/components/RecordingsList';
import FileBrowser from '@/components/FileBrowser';
import { toast } from '@/components/ui/use-toast';
import { Video, List, Folder, Settings } from 'lucide-react';
import { startRecording, stopRecording, fetchRecordings } from '@/services/streamService';
import { Button } from '@/components/ui/button';
import InstallPWA from '@/components/InstallPWA';

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('stream');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);


  const loadRecordings = async () => {
    try {
      const data = await fetchRecordings();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        date: new Date(file.modifiedDate),
        size: file.size,
        path: file.path,
        thumbnail: file.thumbnail || null,
        duration: file.duration || null,
        extension: file.extension || null,
      }));
      setRecordings(formatted);
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load recordings",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    loadRecordings();
  }, []);

  const handleStopRecording = async () => {    
    try {
      const final_file = await stopRecording();
      
      const data = await fetchRecordings();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted = data.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        date: new Date(file.modifiedDate),
        size: file.size,
        path: file.path,
        thumbnail: file.thumbnail || null,
        duration: file.duration || null,
        extension: file.extension || null,
      }));
      setRecordings(formatted);
      
      setIsRecording(false);
      toast({
        title: `Recording Stopped ${final_file.name}`,
        description: "Video has been saved to recordings",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop recording",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  // Update recording handlers
  const handlePlayRecording = (id: string) => {
    toast({
      title: "Abrindo gravação",
      description: `Abrindo gravação: ${recordings.find(r => r.id === id)?.name}`,
    });

    const recording = recordings.find(r => r.id === id);
    if (recording) {
      window.open(`http://192.168.100.46:8888/recordings${recording.path}`, '_blank');
    }
  };

  const handleDownloadRecording = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      window.location.href = `http://192.168.100.46:8888/recordings/download${recording.path}`;
    }
    toast({
      title: "Baixando gravação",
      description: `Baixando: ${recordings.find(r => r.id === id)?.name}`,
    });
  };

  const handleDeleteRecording = async (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      try {
        const response = await fetch(`http://192.168.100.46:8888/recordings/delete${recording.path}`, {method: 'DELETE'});
        if (!response.ok) throw new Error('Gravação não encontrada!');
        toast({
          title: "Gravação apagada",
          description: `Gravação apagada: ${recordings.find(r => r.id === id)?.name}`,
        });
        loadRecordings();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao apagar gravação: " + error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Gravação não existe!",
        description: `Gravação não existe, por favor recarregue a página.`,
        variant: "destructive",
      });
    }
  };


  const handleStartRecording = async () => {
    try {
      const recordingId = await startRecording('current-stream-url');
      setCurrentRecordingId(recordingId);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Video stream recording has started",
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 bg-card">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Qcam</h1>
            <div className="flex items-center space-x-3">
              <InstallPWA />
              <Button
                variant="ghost"
                size="icon"
                onClick={goToSettings}
                className="hidden sm:flex"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container max-w-4xl space-y-6">
          <Card className="bg-background p-0 overflow-hidden">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="stream">Transmissão</TabsTrigger>
                <TabsTrigger value="recordings">Gravações</TabsTrigger>
                {false && <TabsTrigger value="files">Servidor</TabsTrigger>}
              </TabsList>
              <div className="p-4">
                <TabsContent value="stream" className="space-y-4">
                  <VideoStream 
                    isRecording={isRecording} 
                    onStartRecording={handleStartRecording} 
                    onStopRecording={handleStopRecording} 
                  />
                </TabsContent>
                <TabsContent value="recordings" className="space-y-4">
                  <RecordingsList 
                    recordings={recordings}
                    onPlay={handlePlayRecording}
                    onDownload={handleDownloadRecording}
                    onDelete={handleDeleteRecording}
                  />
                </TabsContent>
                <TabsContent value="files" className="space-y-4">
                  <FileBrowser />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
          
          <div className="fixed bottom-0 left-0 w-full p-2 bg-card border-t md:hidden">
            <div className="container max-w-4xl flex justify-around">
              <button 
                className={`flex flex-col items-center px-4 py-2 ${activeTab === 'stream' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('stream')}
              >
                <Video className="w-5 h-5" />
                <span className="text-xs mt-1">Stream</span>
              </button>
              <button 
                className={`flex flex-col items-center px-4 py-2 ${activeTab === 'recordings' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('recordings')}
              >
                <List className="w-5 h-5" />
                <span className="text-xs mt-1">Recordings</span>
              </button>
              <button 
                className={`flex flex-col items-center px-4 py-2 ${activeTab === 'files' ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('files')}
              >
                <Folder className="w-5 h-5" />
                <span className="text-xs mt-1">Files</span>
              </button>
              <button 
                className="flex flex-col items-center px-4 py-2 text-muted-foreground"
                onClick={goToSettings}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
