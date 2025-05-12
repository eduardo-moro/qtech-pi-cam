import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, File, ArrowLeft, Download, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileItem {
  id: string;
  name: string;
  size: string;
  modifiedDate: Date;
  path: string;
}

interface FileBrowserProps {
  onFileSelect?: (file: FileItem) => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ onFileSelect }) => {
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch('http://192.168.100.46:8888/recordings');
        if (!response.ok) throw new Error('Failed to fetch recordings');
        
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const files = data.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          type: 'file' as const,
          size: file.size,
          modifiedDate: new Date(file.modifiedDate),
          path: file.path,
        }));
        
        setCurrentFiles(files);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching recordings:', err);
        setError('Failed to load recordings. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">Loading recordings...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center text-destructive">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gravações no servidor</h2>
      </div>
      <ScrollArea className="min-h-64 sm:min-h-80" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="space-y-1">
          {currentFiles.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => onFileSelect?.(item)}
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-muted-foreground" />
                <div className="space-y-1 min-w-0">
                  <p className="font-medium truncate max-w-[200px]">{item.name}</p>
                  <div className="text-xs text-muted-foreground">
                    <span>{item.size}</span>
                    <span className="mx-2">•</span>
                    <span>{item.modifiedDate.toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{item.modifiedDate.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Play className="w-4 h-4" />
                  <span className="sr-only">Play</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default FileBrowser;