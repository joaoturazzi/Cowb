
import React from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Flame, Award } from 'lucide-react';

interface HabitProgressCardProps {
  habits: HabitWithStats[];
}

const HabitProgressCard: React.FC<HabitProgressCardProps> = ({ habits }) => {
  const completedHabitsToday = habits.filter(habit => habit.completedToday).length;
  const completionPercentage = habits.length > 0 
    ? Math.round((completedHabitsToday / habits.length) * 100) 
    : 0;
  
  // Calculate longest current streak among all habits
  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.currentStreak))
    : 0;

  // Calculate total completed habits
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + (habit.logs?.filter(log => log.completed)?.length || 0), 0
  );
  
  return (
    <Card className="mb-6 p-5 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium mb-1">Progresso de hoje</h2>
          <p className="text-sm text-muted-foreground">
            {completedHabitsToday} de {habits.length} hábitos concluídos
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {longestStreak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">{longestStreak} dias</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{totalCompletions} completados</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs mb-1">
          <span>Progresso</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
    </Card>
  );
};

export default HabitProgressCard;
