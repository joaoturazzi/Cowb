
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'

// Garantir que o React está carregado antes de qualquer coisa
if (typeof React === 'undefined') {
  console.error('React não está carregado corretamente');
  document.getElementById('root')?.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Erro ao carregar a aplicação</h1>
      <p>O React não foi carregado corretamente. Por favor, atualize a página.</p>
      <button onclick="window.location.reload()" 
              style="padding: 10px 20px; margin-top: 10px; background: #0066ff; color: white; border: none; border-radius: 4px;">
        Tentar novamente
      </button>
    </div>
  `;
  throw new Error('React não está carregado corretamente');
}

// Função para inicializar a aplicação
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Elemento root não encontrado');
    }

    // Criar o root com verificação de React
    const root = createRoot(rootElement);
    
    // Renderizar com verificação de React
    if (typeof React.useState === 'function') {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      console.log('Aplicação React inicializada com sucesso');
    } else {
      throw new Error('React hooks não estão disponíveis');
    }
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    // Mostrar mensagem de erro amigável
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h1>Erro ao carregar a aplicação</h1>
          <p>Por favor, atualize a página ou tente novamente mais tarde.</p>
          <button onclick="window.location.reload()" 
                  style="padding: 10px 20px; margin-top: 10px; background: #0066ff; color: white; border: none; border-radius: 4px;">
            Tentar novamente
          </button>
        </div>
      `;
    }
  }
};

// Setup global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Setup unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
});

// Inicializar a aplicação
initializeApp();
