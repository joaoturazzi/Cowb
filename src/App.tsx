
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { useAuth } from './contexts';

// Auth route component that redirects based on authentication status
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

// Component for the root route to handle intelligent routing
const RootRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      navigate(isAuthenticated ? '/app' : '/landing', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            {/* Root route with intelligent redirection */}
            <Route path="/" element={<RootRoute />} />
            
            {/* Public routes */}
            <Route path="/login" element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/landing" element={<Landing />} />
            
            {/* Protected routes - authenticated users only */}
            <Route path="/app" element={
              <AuthRoute>
                <Index />
              </AuthRoute>
            } />
            <Route path="/add-task" element={
              <AuthRoute>
                <AddTask />
              </AuthRoute>
            } />
            <Route path="/upcoming" element={
              <AuthRoute>
                <UpcomingTasks />
              </AuthRoute>
            } />
            <Route path="/summary" element={
              <AuthRoute>
                <Summary />
              </AuthRoute>
            } />
            <Route path="/dashboard" element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            } />
            <Route path="/settings" element={
              <AuthRoute>
                <Settings />
              </AuthRoute>
            } />
            <Route path="/habits" element={
              <AuthRoute>
                <Habits />
              </AuthRoute>
            } />
            
            {/* Error handling routes */}
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
