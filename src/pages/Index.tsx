
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DigitalClock from '../components/DigitalClock';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import OptimizedTaskList from '../components/OptimizedTaskList';
import ErrorBoundary from '../components/ErrorBoundary';
import { checkOnlineStatus } from '../utils/offlineSupport';
import { Loader2 } from 'lucide-react';

const Index = () => {
  // We'll use our OptimizedTaskList for large collections and normal TaskList for smaller ones
  const [useOptimized, setUseOptimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(checkOnlineStatus());

  // Determine which task list to use based on performance needs
  useEffect(() => {
    // Check if the user has more than 20 tasks (could get this from context)
    // For now, we'll use localStorage as a preference
    const shouldUseOptimized = localStorage.getItem('use_optimized_list') === 'true';
    setUseOptimized(shouldUseOptimized);
    setIsLoading(false);
    
    // Monitor online status
    const handleOnlineStatus = () => {
      setIsOnline(checkOnlineStatus());
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <Layout>
      {isOnline && (
        <div className="flex items-center mb-2">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      )}
      {!isOnline && (
        <div className="flex items-center mb-2">
          <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
          <span className="text-xs text-muted-foreground">Offline - Modo limitado</span>
        </div>
      )}
      
      <ErrorBoundary>
        <DigitalClock />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <PomodoroTimer />
      </ErrorBoundary>
      
      <ErrorBoundary>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : useOptimized ? (
          <OptimizedTaskList />
        ) : (
          <TaskList />
        )}
      </ErrorBoundary>
    </Layout>
  );
};

export default Index;
