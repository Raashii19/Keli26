import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    if (confirm('New version available. Reload?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
