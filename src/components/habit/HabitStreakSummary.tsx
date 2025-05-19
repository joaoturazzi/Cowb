
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HabitStreakSummary = () => {
  const { habits, isLoading } = useHabit();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Sequência de hábitos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return null;
  }
  
  const completedToday = activeHabits.filter(h => h.completedToday).length;
  const completion = activeHabits.length > 0 
    ? Math.round((completedToday / activeHabits.length) * 100) 
    : 0;
  
  // Find the habit with the longest streak
  const longestStreakHabit = [...activeHabits].sort((a, b) => 
    b.currentStreak - a.currentStreak
  )[0];
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Sequência de hábitos</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {activeHabits.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">
                Hoje: {completedToday}/{activeHabits.length} ({completion}%)
              </span>
              {longestStreakHabit && longestStreakHabit.currentStreak > 0 && (
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-sm font-medium">
                    {longestStreakHabit.name}: {longestStreakHabit.currentStreak} dias
                  </span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => navigate('/habits')}
            >
              Ver todos os hábitos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-2">
              Crie hábitos para acompanhar sua consistência
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/habits')}
            >
              Criar hábito
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitStreakSummary;
