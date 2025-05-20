
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DigitalClock from '../components/DigitalClock';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import ErrorBoundary from '../components/ErrorBoundary';
import { checkOnlineStatus } from '../utils/offlineSupport';
import { WifiOff, Wifi } from 'lucide-react';
import HabitWidget from '../components/habit/HabitWidget';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(checkOnlineStatus());
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      {/* Online status indicator */}
      <div className="fixed top-4 right-4">
        {isOnline ? (
          <div className="flex items-center text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full shadow-sm">
            <Wifi className="h-4 w-4 mr-1" />
            <span className="text-xs">Online</span>
          </div>
        ) : (
          <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full shadow-sm">
            <WifiOff className="h-4 w-4 mr-1" />
            <span className="text-xs">Modo offline</span>
          </div>
        )}
      </div>
      
      {/* Welcome & Quick Actions Section */}
      <Card className="mb-6 bg-gradient-to-br from-card to-secondary/80 shadow-md border">
        <CardContent className="pt-6 flex flex-col sm:flex-row justify-between items-center">
          <ErrorBoundary>
            <DigitalClock />
          </ErrorBoundary>
          
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 justify-center">
            <Button 
              onClick={() => navigate('/add-task')} 
              variant="default"
              className="bg-primary/90 hover:bg-primary text-white flex items-center gap-1"
              size="sm"
            >
              Nova Tarefa
            </Button>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
              className="border-primary/20 hover:border-primary/50"
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Main content area with 2-column layout on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Timer and Habits Column */}
        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-md border overflow-hidden animate-fade-in">
            <CardContent className="pt-6 relative">
              <ErrorBoundary>
                <PomodoroTimer />
              </ErrorBoundary>
            </CardContent>
          </Card>
          
          {isAuthenticated && (
            <ErrorBoundary>
              <HabitWidget />
            </ErrorBoundary>
          )}
        </div>
        
        {/* Tasks Column */}
        <div className="md:col-span-4">
          <Card className="shadow-md border overflow-hidden animate-fade-in">
            <CardContent className="pt-6">
              <ErrorBoundary>
                <TaskList />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
