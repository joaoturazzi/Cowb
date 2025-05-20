
import React from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HabitItem from './HabitItem';

interface HabitsListProps {
  habits: HabitWithStats[];
  toggleHabitCompletion: (habitId: string) => Promise<void>;
}

const HabitsList: React.FC<HabitsListProps> = ({ habits, toggleHabitCompletion }) => {
  const navigate = useNavigate();
  
  return (
    <AnimatePresence>
      <div className="space-y-2 z-10 max-h-[120px] overflow-y-auto scrollbar-hide">
        {habits.slice(0, 3).map(habit => (
          <HabitItem 
            key={habit.id} 
            habit={habit} 
            toggleHabitCompletion={toggleHabitCompletion} 
          />
        ))}
        
        {habits.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full text-xs justify-center hover:bg-muted rounded-lg h-7"
            onClick={() => navigate('/habits')}
          >
            +{habits.length - 3} mais
          </Button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default HabitsList;
