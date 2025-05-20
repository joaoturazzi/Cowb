
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HabitWithStats } from '@/contexts/habit/habitTypes';

interface HabitWidgetProgressProps {
  habits: HabitWithStats[];
}

const HabitWidgetProgress: React.FC<HabitWidgetProgressProps> = ({ habits }) => {
  const completedHabitsToday = habits.filter(habit => habit.completedToday).length;
  const completion = habits.length > 0 
    ? Math.round((completedHabitsToday / habits.length) * 100) 
    : 0;
    
  return (
    <div className="space-y-2 mb-3 z-10">
      <div className="flex items-center gap-2">
        <Progress 
          value={completion} 
          className="h-1.5 flex-1" 
          aria-label="Progresso dos hábitos"
        />
        <span className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded-full text-primary">
          {completion}%
        </span>
      </div>
    </div>
  );
};

export default HabitWidgetProgress;
