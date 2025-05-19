
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Skeleton } from '../ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated, preserving the current path in the hash
  if (!isAuthenticated) {
    console.log("User not authenticated. Redirecting to login with return path:", location.pathname);
    return <Navigate to={`/login#${location.pathname}`} replace />;
  }
  
  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
