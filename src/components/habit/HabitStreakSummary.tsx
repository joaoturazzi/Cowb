
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Loader2, Award, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const HabitStreakSummary = () => {
  const { habits, isLoading } = useHabit();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Sequência de hábitos
          </CardTitle>
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
  
  // Calculate total current streak (sum of all active habits)
  const totalCurrentStreak = activeHabits.reduce((sum, h) => sum + h.currentStreak, 0);
  
  // Get message based on completion
  const getMessage = () => {
    if (completion === 100) return "Todos os hábitos concluídos hoje! 🎉";
    if (completion > 75) return "Quase lá! Continue assim! 💪";
    if (completion > 50) return "Bom progresso hoje! 👍";
    if (completion > 0) return "Comece completando um hábito! ✅";
    return "Nenhum hábito concluído hoje. 🔔";
  };
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="text-md flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          Sequência de hábitos
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {activeHabits.length > 0 ? (
          <>
            <div className="space-y-3 mb-3">
              <div className="flex justify-between items-center">
                <p className="text-sm">{getMessage()}</p>
                <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 rounded-full">
                  {completedToday}/{activeHabits.length}
                </span>
              </div>
              
              <Progress value={completion} className="h-1.5" />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              {longestStreakHabit && longestStreakHabit.currentStreak > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/10 p-2 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{longestStreakHabit.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {longestStreakHabit.currentStreak} dias consecutivos
                    </div>
                  </div>
                </div>
              )}
              
              {totalCurrentStreak > 0 && (
                <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Sequência total</div>
                    <div className="text-xs text-muted-foreground">
                      {totalCurrentStreak} dias combinados
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => navigate('/habits')}
            >
              <span>Ver todos os hábitos</span>
              <ArrowRight className="h-4 w-4" />
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
