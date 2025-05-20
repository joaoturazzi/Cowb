
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, ChartBar, ListChecks } from 'lucide-react';
import DailySummary from '../components/DailySummary';
import HabitStreakSummary from '../components/habit/HabitStreakSummary';
import UserProfileCard from '@/components/user/UserProfileCard';
import DigitalClock from '@/components/DigitalClock';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const Summary = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Resumo do dia</h1>
          </div>
          
          <DigitalClock />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 gap-6">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">Perfil</h2>
            </div>
            <UserProfileCard />
          </section>
          
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ChartBar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">Hábitos</h2>
            </div>
            <HabitStreakSummary />
          </section>
          
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">Tarefas</h2>
            </div>
            <DailySummary />
          </section>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Summary;
