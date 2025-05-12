
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register';

// Register service worker with more verbose output
const updateSW = registerSW({
  onNeedRefresh() {
    // This is called when a new version of the app is available
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use');
  },
  onRegistered(r) {
    console.log('Service worker has been registered:', r);
  },
  onRegisterError(error) {
    console.error('Service worker registration error:', error);
  }
});

// Create root and render App
createRoot(document.getElementById("root")!).render(<App />);
