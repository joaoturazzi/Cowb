
import React from 'react';
import Layout from '../components/Layout';
import ProductivityTrends from '../components/dashboard/ProductivityTrends';
import CompletionRateChart from '../components/dashboard/CompletionRateChart';
import FocusTimeDistribution from '../components/dashboard/FocusTimeDistribution';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  // Add required data for the components
  
  const sampleProductivityData = [
    { date: '2023-05-01', totalFocusTime: 120 * 60 }, // in seconds
    { date: '2023-05-02', totalFocusTime: 90 * 60 },
    { date: '2023-05-03', totalFocusTime: 180 * 60 },
    { date: '2023-05-04', totalFocusTime: 150 * 60 },
    { date: '2023-05-05', totalFocusTime: 200 * 60 },
    { date: '2023-05-06', totalFocusTime: 120 * 60 },
    { date: '2023-05-07', totalFocusTime: 160 * 60 },
  ];

  const sampleCompletionData = {
    total: 20,
    completed: 15,
    rate: 75,
  };

  const sampleSessions = [
    { type: 'work', duration: 90 * 60 },    // 90 minutes in seconds
    { type: 'break', duration: 20 * 60 },   // 20 minutes in seconds
    { type: 'work', duration: 120 * 60 },   // 120 minutes in seconds
    { type: 'break', duration: 15 * 60 },   // 15 minutes in seconds
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductivityTrends 
            data={sampleProductivityData} 
            period="week" 
            onChangePeriod={() => {}} 
          />
          <CompletionRateChart 
            data={sampleCompletionData} 
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
