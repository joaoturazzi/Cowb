
import React, { useState } from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card } from '@/components/ui/card';
import { CheckCircle2, PlusCircle, Loader2, Calendar, Flame, Award, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { sonnerToast as toast } from '@/components/ui';

const HabitWidget = () => {
  const { habits, isLoading, toggleHabitCompletion } = useHabit();
  const navigate = useNavigate();
  const [animatingHabitId, setAnimatingHabitId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <Card className="p-4 h-full flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </Card>
    );
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return (
      <Card className="p-4 h-full border border-dashed hover:border-primary/50 transition-colors group" onClick={() => navigate('/habits')} role="button" tabIndex={0}>
        <div className="flex flex-col items-center justify-center py-3 h-full">
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
  
  // Handle habit completion directly from the widget
  const handleToggleHabit = async (habitId: string, currentState: boolean) => {
    setAnimatingHabitId(habitId);
    
    try {
      await toggleHabitCompletion(habitId);
      
      if (!currentState) {
        toast.success("Hábito completado!", {
          description: "Continue assim com sua rotina!"
        });
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Erro ao atualizar hábito", {
        description: "Por favor, tente novamente."
      });
    } finally {
      setTimeout(() => setAnimatingHabitId(null), 500);
    }
  };
  
  return (
    <Card 
      className="p-4 hover:shadow-md transition-all relative overflow-hidden h-full" 
      role="button" 
      tabIndex={0}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">Hábitos de hoje</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs hover:bg-muted"
          onClick={() => navigate('/habits')}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-1 mb-4">
        <Progress 
          value={completion} 
          className="h-2" 
          aria-label="Progresso dos hábitos"
        />
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
        <AnimatePresence>
          <div className="space-y-2 mt-3">
            {activeHabits.slice(0, 3).map(habit => (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full w-6 h-6 p-0 flex-shrink-0",
                    animatingHabitId === habit.id && "animate-pulse",
                    habit.completedToday ? "bg-primary/20 text-primary" : "bg-muted"
                  )}
                  style={{ borderLeft: `3px solid ${habit.color}` }}
                  onClick={() => handleToggleHabit(habit.id, habit.completedToday)}
                >
                  {habit.completedToday ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="h-3 w-3" />
                  )}
                </Button>
                <span className={cn(
                  "text-sm truncate",
                  habit.completedToday && "line-through text-muted-foreground"
                )}>
                  {habit.name}
                </span>
              </motion.div>
            ))}
            
            {activeHabits.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-xs text-center justify-center mt-1 hover:bg-muted"
                onClick={() => navigate('/habits')}
              >
                +{activeHabits.length - 3} mais hábitos
              </Button>
            )}
          </div>
        </AnimatePresence>
      )}
      
      {completion === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-center bg-primary/10 p-2 rounded-lg"
        >
          <Award className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm text-primary font-medium">Parabéns! Todos os hábitos concluídos hoje!</span>
        </motion.div>
      )}
    </Card>
  );
};

export default HabitWidget;
