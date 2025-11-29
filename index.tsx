import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Function to mount the app
const mountApp = () => {
  // Mount to the <app-root> element defined in the index.html
  const rootElement = document.querySelector('app-root');
  
  if (!rootElement) {
    console.error("Could not find app-root element to mount to");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Ensure DOM is fully loaded before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}