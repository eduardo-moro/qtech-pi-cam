
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, List, Delete, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Recording {
  id: string;
  name: string;
  date: Date;
  duration: string;
  size: string;
  thumbnail?: string;
  path: string;
  extension?: string;
}

interface RecordingsListProps {
  recordings: Recording[];
  onPlay: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  onPlay,
  onDownload,
  onDelete,
}) => {
  if (recordings.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <List className="w-12 h-12 text-muted-foreground mb-2" />
          <h2 className="text-xl font-bold mb-2">No Recordings</h2>
          <p className="text-center text-muted-foreground">
            Start recording to save video streams
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Gravações locais</h2>
        <span className="text-sm text-muted-foreground">{recordings.length} videos</span>
      </div>
      <ScrollArea className="min-h-64 sm:min-h-80" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="space-y-2">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 rounded-md hover:bg-muted/50"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
                <div className="bg-video-dark w-16 h-9 rounded flex items-center justify-center">
                  {recording.thumbnail ? (
                    <img
                      src={recording.thumbnail}
                      alt={recording.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Play className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-medium truncate max-w-[400px]">{recording.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{recording.date.toLocaleDateString()}</span>
                    {recording.duration && <span className="mx-1">•</span>}
                    <span>{recording.duration}</span>
                    {recording.size && <span className="mx-1">•</span>}
                    <span>{recording.size}</span>
                    {recording.extension && <span className="mx-1">•</span>}
                    <span>{recording.extension}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(recording.id)}
                >
                  <Trash className="w-4 h-4" />
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPlay(recording.id)}
                >
                  <Play className="w-4 h-4" />
                  <span className="sr-only">Play</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(recording.id)}
                >
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

export default RecordingsList;
