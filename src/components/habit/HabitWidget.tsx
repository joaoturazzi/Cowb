
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card } from '@/components/ui/card';
import { CheckCircle2, PlusCircle, Loader2, Calendar, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const HabitWidget = () => {
  const { habits, isLoading } = useHabit();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </Card>
    );
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return (
      <Card className="p-4 mb-4 border border-dashed hover:border-primary/50 transition-colors group" onClick={() => navigate('/habits')} role="button" tabIndex={0}>
        <div className="flex flex-col items-center justify-center py-3">
          <CheckCircle2 className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
          <p className="text-sm text-muted-foreground text-center mb-3 group-hover:text-primary transition-colors">
            Crie hábitos diários para melhorar sua rotina
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="group-hover:border-primary/50 transition-colors" 
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Criar hábito
          </Button>
        </div>
      </Card>
    );
  }
  
  const completedToday = activeHabits.filter(h => h.completedToday).length;
  const completion = activeHabits.length > 0 
    ? Math.round((completedToday / activeHabits.length) * 100) 
    : 0;
  
  // Find habit with longest streak
  const longestStreakHabit = [...activeHabits].sort((a, b) => 
    b.currentStreak - a.currentStreak
  )[0];
  
  return (
    <Card 
      className="p-4 mb-4 hover:shadow-md transition-all" 
      onClick={() => navigate('/habits')} 
      role="button" 
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">Hábitos de hoje</span>
        </div>
        <span className="text-sm bg-primary/10 px-2 py-0.5 rounded-full">
          {completedToday}/{activeHabits.length}
        </span>
      </div>
      
      <div className="space-y-1 mb-3">
        <Progress value={completion} className="h-2" />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{completion}% concluído</span>
          {longestStreakHabit?.currentStreak > 0 && (
            <div className="flex items-center">
              <Flame className="h-3 w-3 mr-1 text-orange-500" />
              <span>{longestStreakHabit.currentStreak} dias</span>
            </div>
          )}
        </div>
      </div>
      
      {activeHabits.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {activeHabits.slice(0, 3).map(habit => (
            <div 
              key={habit.id}
              className={`flex items-center gap-1.5 py-1 px-2 rounded-full text-xs ${
                habit.completedToday 
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
              style={{ 
                borderLeft: `3px solid ${habit.color}`,
              }}
            >
              {habit.completedToday ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <span className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              )}
              {habit.name}
            </div>
          ))}
          
          {activeHabits.length > 3 && (
            <div className="flex items-center py-1 px-2 rounded-full bg-muted text-xs">
              +{activeHabits.length - 3}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default HabitWidget;
