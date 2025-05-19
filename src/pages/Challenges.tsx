
import React from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChallengesList from '../components/challenges/ChallengesList';
import MilestoneTracker from '../components/milestone/MilestoneTracker';
import JourneyMap from '../components/journey/JourneyMap';

const Challenges = () => {
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
        <h1 className="text-2xl font-semibold">Desafios e Conquistas</h1>
        
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/challenge-dashboard')}
            className="gap-1"
          >
            <BarChart className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <ChallengesList />
        <MilestoneTracker />
        <JourneyMap />
      </div>
    </Layout>
  );
};

export default Challenges;
