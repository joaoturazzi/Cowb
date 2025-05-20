
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Explicit React initialization to avoid scheduling conflicts
window.React = React;

// Polyfill for React scheduler if it's missing
if (typeof (window as any).Scheduler === 'undefined') {
  (window as any).Scheduler = {
    unstable_scheduleCallback: (priorityLevel: any, callback: () => any) => {
      const timeoutId = setTimeout(callback, 0);
      return {
        id: timeoutId,
        cancel: () => clearTimeout(timeoutId),
      };
    },
    unstable_cancelCallback: (task: { id: number }) => {
      clearTimeout(task.id);
    },
    unstable_shouldYield: () => false,
    unstable_now: () => Date.now(),
  };
}

// Simple initialization without excessive checks
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Could not find root element');
} else {
  const root = createRoot(rootElement);
  
  // Remove StrictMode to resolve potential issues with React 18.3.1
  root.render(<App />);
  
  console.log('Application initialized successfully');
}
