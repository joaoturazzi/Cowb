
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAuth } from "./contexts";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddTask from "./pages/AddTask";
import Summary from "./pages/Summary";
import Login from "./pages/Login";
import UpcomingTasks from "./pages/UpcomingTasks";
import React, { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { setupOfflineSupport } from "./utils/offlineSupport";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create QueryClient inside the component to ensure React context is available
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    },
  });

  // Set up offline support when app loads
  useEffect(() => {
    setupOfflineSupport();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state
    return <div className="p-8 flex justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render the children
  return <>{children}</>;
};

// Component for AppRoutes to access useAuth hook
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-task" 
        element={
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/summary" 
        element={
          <ProtectedRoute>
            <Summary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/upcoming" 
        element={
          <ProtectedRoute>
            <UpcomingTasks />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
