
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DigitalClock from '../components/DigitalClock';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import ErrorBoundary from '../components/ErrorBoundary';
import { checkOnlineStatus } from '../utils/offlineSupport';
import { WifiOff, Wifi } from 'lucide-react';
import HabitWidget from '../components/habit/HabitWidget';
import { useAuth } from '@/contexts';
import CompletionPathIndicator from '../components/CompletionPathIndicator';
import { Card } from '@/components/ui/card';
import { useTaskList } from '@/hooks/useTaskList';

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(checkOnlineStatus());
  const { isAuthenticated } = useAuth();
  const { remainingTime, totalEstimatedTime, completedTime } = useTaskList();

  useEffect(() => {
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
        <Card className="mb-6 p-4 overflow-hidden bg-gradient-to-br from-card to-background border-primary/10 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <div className="w-full sm:w-1/2 sm:border-r sm:border-primary/10 sm:pr-4">
              <DigitalClock />
            </div>
            <div className="w-full sm:w-1/2 flex justify-center">
              <PomodoroTimer compact />
            </div>
          </div>
        </Card>
      </ErrorBoundary>
      
      {isAuthenticated && (
        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <HabitWidget />
            <CompletionPathIndicator 
              remainingTime={remainingTime}
              totalEstimatedTime={totalEstimatedTime}
              completedTime={completedTime}
            />
          </div>
        </ErrorBoundary>
      )}
      
      <ErrorBoundary>
        <TaskList />
      </ErrorBoundary>
    </Layout>
  );
};

export default Index;
