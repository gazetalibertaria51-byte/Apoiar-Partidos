import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mount to the <app-root> element defined in the index.html
const rootElement = document.querySelector('app-root');
if (!rootElement) {
  throw new Error("Could not find app-root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);