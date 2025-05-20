
import React from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import HabitCard from './HabitCard';
import HabitProgressCard from './HabitProgressCard';

interface HabitsListProps {
  habits: HabitWithStats[];
  onEditHabit: (habit: HabitWithStats) => void;
}

const HabitsList: React.FC<HabitsListProps> = ({ habits, onEditHabit }) => {
  if (habits.length === 0) return null;
  
  return (
    <>
      <HabitProgressCard habits={habits} />
      
      <div className="grid grid-cols-1 gap-4">
        {habits.map(habit => (
          <HabitCard 
            key={habit.id} 
            habit={habit} 
            onEdit={onEditHabit}
          />
        ))}
      </div>
    </>
  );
};

export default HabitsList;
