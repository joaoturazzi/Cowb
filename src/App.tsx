
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
import Challenges from './pages/Challenges';
import ChallengeDashboard from './pages/ChallengeDashboard';
import { ProtectedRoute } from './components/auth';

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
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/add-task" element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            } />
            <Route path="/upcoming" element={
              <ProtectedRoute>
                <UpcomingTasks />
              </ProtectedRoute>
            } />
            <Route path="/summary" element={
              <ProtectedRoute>
                <Summary />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/habits" element={
              <ProtectedRoute>
                <Habits />
              </ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            } />
            <Route path="/challenge-dashboard" element={
              <ProtectedRoute>
                <ChallengeDashboard />
              </ProtectedRoute>
            } />
            
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
