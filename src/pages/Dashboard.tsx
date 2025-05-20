
import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductivityTrends from '@/components/dashboard/ProductivityTrends';
import CompletionRateChart from '@/components/dashboard/CompletionRateChart';
import FocusTimeDistribution from '@/components/dashboard/FocusTimeDistribution';
import UserProfileCard from '@/components/user/UserProfileCard';

const Dashboard = () => {
  const navigate = useNavigate();
  
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
        <ProductivityTrends />
        <CompletionRateChart />
        <FocusTimeDistribution />
      </div>
    </Layout>
  );
};

export default Dashboard;
