
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Explicit React initialization to avoid scheduling conflicts
window.React = React;

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
