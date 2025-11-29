import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Function to mount the app
const mountApp = () => {
  // Try finding <app-root> (our custom element) or fallback to "root" (standard Vite)
  const rootElement = document.querySelector('app-root') || document.getElementById('root');
  
  if (!rootElement) {
    console.error("Fatal Error: Could not find app-root or root element to mount the application.");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Robust DOM ready check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}