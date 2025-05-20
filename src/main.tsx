
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make React available globally to avoid conflicts
window.React = React;

// Proper scheduler polyfill with all required methods
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
    unstable_now: () => performance.now(),
    unstable_ImmediatePriority: 1,
    unstable_UserBlockingPriority: 2,
    unstable_NormalPriority: 3,
    unstable_LowPriority: 4,
    unstable_IdlePriority: 5,
    unstable_getFirstCallbackNode: () => null,
    unstable_pauseExecution: () => {},
    unstable_continueExecution: () => {},
    unstable_forceFrameRate: () => {},
    unstable_Profiling: null,
  };
  
  console.log('React scheduler polyfill installed');
}

// Safe initialization with error handling
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Could not find root element to mount React application');
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize React application:', error);
    
    // Display a fallback error message on the page
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Erro ao inicializar aplicação</h2>
        <p>Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 16px;">
          Recarregar
        </button>
      </div>
    `;
  }
}
