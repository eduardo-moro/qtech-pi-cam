
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NetworkStatus from "./components/NetworkStatus";
import { useEffect } from "react";
import { useToast } from "./components/ui/use-toast";

// Create a client
const queryClient = new QueryClient();

// Create a wrapper component that doesn't use useNavigate
const AppContent = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check if the app was launched in standalone mode (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      toast({
        title: "App Launched",
        description: "Running in standalone mode as a PWA",
      });
    }
  }, [toast]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <NetworkStatus />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
