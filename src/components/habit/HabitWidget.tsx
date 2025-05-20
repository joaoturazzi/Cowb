
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, PlusCircle, Loader2, Calendar, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import HabitCheckbox from './HabitCheckbox';

const HabitWidget = () => {
  const { habits, isLoading } = useHabit();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="shadow-md border animate-pulse">
        <CardContent className="pt-6">
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return (
      <Card 
        className="shadow-md border-dashed border hover:border-primary/50 transition-colors group animate-fade-in" 
        onClick={() => navigate('/habits')} 
        role="button" 
        tabIndex={0}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-4">
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
        </CardContent>
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
    <Card className="shadow-md border transition-all animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>Hábitos de hoje</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate('/habits')}
          >
            Ver todos
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-4">
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
        
        <div className="space-y-3">
          {activeHabits.slice(0, 3).map(habit => (
            <div 
              key={habit.id}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all ${
                habit.completedToday 
                  ? 'bg-primary/10' 
                  : 'hover:bg-muted/50'
              }`}
              style={{ 
                borderLeft: `3px solid ${habit.color}`,
              }}
            >
              <HabitCheckbox 
                habitId={habit.id}
                isCompleted={habit.completedToday}
                color={habit.color}
                name={habit.name}
                currentStreak={habit.currentStreak}
              />
              <span className={`text-sm ${habit.completedToday ? 'text-primary font-medium' : ''}`}>
                {habit.name}
              </span>
              {habit.currentStreak > 0 && (
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground flex items-center">
                  <Flame className="h-3 w-3 mr-0.5 text-orange-500" />
                  {habit.currentStreak}
                </span>
              )}
            </div>
          ))}
          
          {activeHabits.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/habits')}
              className="w-full text-primary/70 hover:text-primary hover:bg-primary/10 mt-1"
            >
              Ver mais {activeHabits.length - 3} hábitos
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitWidget;
