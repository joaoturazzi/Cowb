
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import AddTask from './pages/AddTask';
import UpcomingTasks from './pages/UpcomingTasks';
import { AppProvider } from './contexts/AppContext';
import { Toaster as SonnerToaster } from 'sonner';
import Summary from './pages/Summary';
import Login from './pages/Login';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
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
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Router>
        
        <SonnerToaster position="top-right" />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
