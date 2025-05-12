
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true
    ) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("Install prompt captured!");
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
      toast({
        title: "App Installed",
        description: "Stream Stash Pi has been successfully installed",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Installation Started",
        description: "The app is being installed",
      });
    } else {
      toast({
        title: "Installation Cancelled",
        description: "You can install the app later from the menu",
      });
    }

    setInstallPrompt(null);
  };

  if (isAppInstalled || !installPrompt) {
    return null;
  }

  return (
    <Button 
      variant="ghost"
      size="sm" 
      className="flex items-center space-x-2" 
      onClick={handleInstallClick}
    >
      <Download className="w-4 h-4" />
    </Button>
  );
};

export default InstallPWA;
