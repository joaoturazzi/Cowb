
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DailySummary from '../components/DailySummary';
import HabitStreakSummary from '../components/habit/HabitStreakSummary';
import MilestoneTracker from '../components/milestone/MilestoneTracker';
import ChallengesList from '../components/challenges/ChallengesList';
import ConfettiCelebration from '../components/animations/ConfettiCelebration';

const Summary = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Show confetti when first opening summary page
  React.useEffect(() => {
    // Only show once
    setShowConfetti(true);
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <ConfettiCelebration show={showConfetti} />
      
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Resumo do dia</h1>
        
        <div className="ml-auto">
          <Button 
            variant="outline"
            onClick={() => navigate('/challenges')}
          >
            Ver Desafios
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <HabitStreakSummary />
        <DailySummary />
        <ChallengesList />
      </div>
    </Layout>
  );
};

export default Summary;
