
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You are back online",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "No Connection",
        description: "You are offline. Some features may not work.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 w-full flex justify-center z-50 pointer-events-none">
      <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg pointer-events-auto">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">You are offline</span>
      </div>
    </div>
  );
};

export default NetworkStatus;
