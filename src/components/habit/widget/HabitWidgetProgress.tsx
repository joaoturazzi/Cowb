
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface HabitWidgetProgressProps {
  habits: HabitWithStats[];
}

const HabitWidgetProgress: React.FC<HabitWidgetProgressProps> = ({ habits }) => {
  const completedHabitsToday = habits.filter(habit => habit.completedToday).length;
  const completion = habits.length > 0 
    ? Math.round((completedHabitsToday / habits.length) * 100) 
    : 0;
    
  // Determine status message and color based on completion percentage
  const getMessage = () => {
    if (completion === 100) return "Todos completos!";
    if (completion >= 50) return "Bom progresso!";
    if (completion > 0) return "Continue assim!";
    return "Pendentes hoje";
  };
  
  return (
    <div className="space-y-2 mb-3 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {completion === 100 ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          ) : completion > 0 ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {getMessage()}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          completion === 100 
            ? "bg-green-500/10 text-green-500" 
            : "bg-primary/10 text-primary"
        }`}>
          {completedHabitsToday}/{habits.length}
        </span>
      </div>
      
      <div className="relative pt-1">
        <Progress 
          value={completion} 
          className={`h-1.5 ${
            completion === 100 ? "bg-green-500/30" : ""
          }`}
          aria-label="Progresso dos hábitos"
        />
        
        {/* Animated completion indicator */}
        {completion > 0 && (
          <div 
            className={`absolute top-0 right-0 text-xs font-semibold ${
              completion === 100 ? "text-green-500" : "text-primary"
            }`}
            style={{ transform: 'translateY(-100%)' }}
          >
            {completion}%
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitWidgetProgress;
