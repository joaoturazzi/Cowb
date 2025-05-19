
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import AddTask from './pages/AddTask';
import UpcomingTasks from './pages/UpcomingTasks';
import { AppProvider } from './contexts/AppContext';
import { SonnerToaster } from './components/ui';
import Summary from './pages/Summary';
import Login from './pages/Login';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';

// Verificar se o React está disponível
const isReactAvailable = typeof React !== 'undefined' && typeof React.useState === 'function';

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Componente de erro
const AppErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-xl font-bold mb-4">Erro ao carregar a aplicação</h1>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Tentar novamente
    </button>
  </div>
);

function App() {
  // Verificar React novamente antes de renderizar
  if (!isReactAvailable) {
    console.error('React is not available in App component');
    return <AppErrorFallback />;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <ErrorBoundary fallback={
                <div className="flex flex-col items-center justify-center h-screen">
                  <h1 className="text-xl font-bold mb-4">Ocorreu um erro na página de login</h1>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Tentar novamente
                  </button>
                </div>
              }>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<Index />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/upcoming" element={<UpcomingTasks />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        
        {/* Use Sonner Toaster with optimized settings */}
        <SonnerToaster 
          position="top-right" 
          closeButton
          richColors
          expand={false}
          toastOptions={{
            duration: 5000,
            className: "toast-custom-class",
          }}
        />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
