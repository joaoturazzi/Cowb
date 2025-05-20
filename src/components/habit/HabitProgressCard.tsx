
import React from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Flame, Award, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HabitProgressCardProps {
  habits: HabitWithStats[];
}

const HabitProgressCard: React.FC<HabitProgressCardProps> = ({ habits }) => {
  const { isDarkMode } = useTheme();
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
  
  // Get background color based on completion and theme
  const getCardBg = () => {
    if (completionPercentage === 100) {
      return isDarkMode 
        ? "bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/20" 
        : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50";
    }
    return isDarkMode
      ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
      : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20";
  };
  
  return (
    <Card className={`mb-6 p-5 ${getCardBg()}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium mb-1 flex items-center gap-2">
            {completionPercentage === 100 ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
            Progresso de hoje
          </h2>
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
          <span className="font-medium">Progresso</span>
          <span className={`font-semibold ${completionPercentage === 100 ? "text-green-500" : "text-primary"}`}>
            {completionPercentage}%
          </span>
        </div>
        <Progress 
          value={completionPercentage} 
          className={`h-2 ${completionPercentage === 100 ? "bg-green-500/30" : ""}`} 
        />
      </div>
    </Card>
  );
};

export default HabitProgressCard;
