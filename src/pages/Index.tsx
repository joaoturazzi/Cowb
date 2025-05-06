
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DigitalClock from '../components/DigitalClock';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import ErrorBoundary from '../components/ErrorBoundary';
import { checkOnlineStatus } from '../utils/offlineSupport';
import { WifiOff, Wifi } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(checkOnlineStatus());

  useEffect(() => {
    // No longer need to check for optimized list preference
    // since we've consolidated into a single optimized component
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
      {isOnline ? (
        <div className="flex items-center mb-2 text-green-500">
          <Wifi className="h-4 w-4 mr-1" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      ) : (
        <div className="flex items-center mb-2 text-amber-500">
          <WifiOff className="h-4 w-4 mr-1" />
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
        <TaskList />
      </ErrorBoundary>
    </Layout>
  );
};

export default Index;
