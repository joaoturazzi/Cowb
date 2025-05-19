
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
import Habits from './pages/Habits';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <ErrorBoundary>
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
            <Route path="/habits" element={<Habits />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
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
