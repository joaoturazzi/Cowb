import React from 'react';
import Layout from '../components/Layout';
import ProductivityTrends from '../components/dashboard/ProductivityTrends';
import CompletionRateChart from '../components/dashboard/CompletionRateChart';
import FocusTimeDistribution from '../components/dashboard/FocusTimeDistribution';
import { useAuth } from '@/contexts';
import { ProductivityTrend, DailyProductivity, PomodoroSession } from '@/contexts/analytics/analyticsTypes';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  
  // Create sample data with the correct types
  const sampleProductivityData: ProductivityTrend[] = [
    { period: '01-05', focusTime: 120 * 60, completedTasks: 3 },
    { period: '02-05', focusTime: 90 * 60, completedTasks: 2 },
    { period: '03-05', focusTime: 180 * 60, completedTasks: 4 },
    { period: '04-05', focusTime: 150 * 60, completedTasks: 3 },
    { period: '05-05', focusTime: 200 * 60, completedTasks: 5 },
    { period: '06-05', focusTime: 120 * 60, completedTasks: 2 },
    { period: '07-05', focusTime: 160 * 60, completedTasks: 3 },
  ];

  const sampleDailyData: DailyProductivity[] = [
    { date: '2023-05-01', totalFocusTime: 120 * 60, completedTasks: 3, totalSessions: 4 },
    { date: '2023-05-02', totalFocusTime: 90 * 60, completedTasks: 2, totalSessions: 3 },
    { date: '2023-05-03', totalFocusTime: 180 * 60, completedTasks: 5, totalSessions: 6 },
    { date: '2023-05-04', totalFocusTime: 150 * 60, completedTasks: 4, totalSessions: 5 },
    { date: '2023-05-05', totalFocusTime: 200 * 60, completedTasks: 6, totalSessions: 7 },
    { date: '2023-05-06', totalFocusTime: 120 * 60, completedTasks: 3, totalSessions: 4 },
    { date: '2023-05-07', totalFocusTime: 160 * 60, completedTasks: 4, totalSessions: 5 },
  ];

  const sampleSessions: PomodoroSession[] = [
    { 
      id: '1', 
      user_id: 'user1', 
      start_time: '2023-05-01T10:00:00Z',
      end_time: '2023-05-01T10:25:00Z',
      planned_duration: 1500,
      actual_duration: 1500,
      session_type: 'work',
      status: 'completed',
      task_id: 'task1',
      created_at: '2023-05-01T10:00:00Z'
    },
    { 
      id: '2', 
      user_id: 'user1', 
      start_time: '2023-05-01T10:30:00Z',
      end_time: '2023-05-01T10:35:00Z',
      planned_duration: 300,
      actual_duration: 300,
      session_type: 'short_break',
      status: 'completed',
      task_id: null,
      created_at: '2023-05-01T10:30:00Z'
    },
    { 
      id: '3', 
      user_id: 'user1', 
      start_time: '2023-05-01T10:40:00Z',
      end_time: '2023-05-01T11:05:00Z',
      planned_duration: 1500,
      actual_duration: 1500,
      session_type: 'work',
      status: 'completed',
      task_id: 'task2',
      created_at: '2023-05-01T10:40:00Z'
    },
    { 
      id: '4', 
      user_id: 'user1', 
      start_time: '2023-05-01T11:10:00Z',
      end_time: '2023-05-01T11:25:00Z',
      planned_duration: 900,
      actual_duration: 900,
      session_type: 'long_break',
      status: 'completed',
      task_id: null,
      created_at: '2023-05-01T11:10:00Z'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductivityTrends 
            data={sampleProductivityData} 
            period="weekly" 
            onChangePeriod={() => {}} 
          />
          <CompletionRateChart 
            data={sampleDailyData} 
          />
          <FocusTimeDistribution 
            sessions={sampleSessions} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
