import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAuth } from "./contexts";
import ErrorBoundary from "./components/ErrorBoundary";
import { setupOfflineSupport } from "./utils/offlineSupport";
import React, { useEffect, Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components for better initial load performance
const Landing = lazy(() => import("./pages/Landing"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AddTask = lazy(() => import("./pages/AddTask"));
const Summary = lazy(() => import("./pages/Summary"));
const Login = lazy(() => import("./pages/Login"));
const UpcomingTasks = lazy(() => import("./pages/UpcomingTasks"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Create a new QueryClient instance inside the component
const App = () => {
  // Create QueryClient inside the component to ensure React context is available
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Don't retry on 404s or authorization errors
          if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
            return false;
          }
          // Otherwise retry twice
          return failureCount < 2;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    },
  });

  // Set up offline support when app loads
  useEffect(() => {
    const cleanup = setupOfflineSupport();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Suspense fallback={<LoadingFallback />}>
                <AppRoutes />
              </Suspense>
            </HashRouter>
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
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
        <span className="text-sm text-muted-foreground">Carregando...</span>
      </div>
    );
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
