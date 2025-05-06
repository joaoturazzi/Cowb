
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'

// Setup global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // You could send to an error reporting service here
});

// Setup unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
  // You could send to an error reporting service here
});

try {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
} catch (err) {
  console.error('Error rendering application:', err);
}
