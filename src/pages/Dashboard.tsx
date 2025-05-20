
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductivityTrends from '@/components/dashboard/ProductivityTrends';
import CompletionRateChart from '@/components/dashboard/CompletionRateChart';
import FocusTimeDistribution from '@/components/dashboard/FocusTimeDistribution';
import UserProfileCard from '@/components/user/UserProfileCard';
import { ProductivityTrend, DailyProductivity, PomodoroSession } from '@/contexts/analytics/analyticsTypes';

const Dashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  
  // Sample data for the charts - in a real app, this would come from a backend API or context
  const [trendsData, setTrendsData] = useState<ProductivityTrend[]>([
    { period: 'Mon', focusTime: 120, completedTasks: 5 },
    { period: 'Tue', focusTime: 180, completedTasks: 7 },
    { period: 'Wed', focusTime: 150, completedTasks: 4 },
    { period: 'Thu', focusTime: 210, completedTasks: 6 },
    { period: 'Fri', focusTime: 240, completedTasks: 8 },
    { period: 'Sat', focusTime: 90, completedTasks: 3 },
    { period: 'Sun', focusTime: 60, completedTasks: 2 },
  ]);
  
  const [dailyData, setDailyData] = useState<DailyProductivity[]>([
    { date: '2025-05-13', completedTasks: 5, totalMinutes: 120 },
    { date: '2025-05-14', completedTasks: 7, totalMinutes: 180 },
    { date: '2025-05-15', completedTasks: 4, totalMinutes: 150 },
    { date: '2025-05-16', completedTasks: 6, totalMinutes: 210 },
    { date: '2025-05-17', completedTasks: 8, totalMinutes: 240 },
    { date: '2025-05-18', completedTasks: 3, totalMinutes: 90 },
    { date: '2025-05-19', completedTasks: 2, totalMinutes: 60 },
  ]);
  
  const [sessionData, setSessionData] = useState<PomodoroSession[]>([
    { 
      id: '1', 
      user_id: '1', 
      task_id: 'task1', 
      actual_duration: 1500, 
      session_type: 'work', 
      status: 'completed', 
      planned_duration: 1500, 
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    { 
      id: '2', 
      user_id: '1', 
      task_id: 'task2', 
      actual_duration: 1200, 
      session_type: 'work', 
      status: 'completed', 
      planned_duration: 1500, 
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    { 
      id: '3', 
      user_id: '1', 
      task_id: 'task3', 
      actual_duration: 900, 
      session_type: 'work', 
      status: 'completed', 
      planned_duration: 1500, 
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
  ]);
  
  const handleChangePeriod = (newPeriod: 'weekly' | 'monthly') => {
    setPeriod(newPeriod);
    // In a real app, we would fetch new data based on the period
  };
  
  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      
      <UserProfileCard />

      <div className="space-y-8">
        <ProductivityTrends 
          data={trendsData}
          period={period}
          onChangePeriod={handleChangePeriod}
        />
        <CompletionRateChart 
          data={dailyData}
        />
        <FocusTimeDistribution 
          sessions={sessionData}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
