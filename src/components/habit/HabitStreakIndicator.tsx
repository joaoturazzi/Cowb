
import React from 'react';
import { Flame } from 'lucide-react';

interface HabitStreakIndicatorProps {
  streak: number;
}

const HabitStreakIndicator: React.FC<HabitStreakIndicatorProps> = ({ streak }) => {
  if (streak === 0) return null;
  
  return (
    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs">
      <Flame className="h-3 w-3 text-primary" />
      <span>{streak} dias</span>
    </div>
  );
};

export default HabitStreakIndicator;
