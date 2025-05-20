
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
      <Card className="p-5 h-full flex items-center justify-center bg-gradient-to-br from-card to-background border-primary/10">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </Card>
    );
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return (
      <Card 
        className="p-5 h-full border-dashed hover:border-primary/50 transition-all group flex flex-col justify-center items-center bg-gradient-to-br from-card to-background" 
        onClick={() => navigate('/habits')} 
        role="button" 
        tabIndex={0}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
          <CheckCircle2 className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
        </div>
        <p className="text-center mb-4 text-muted-foreground group-hover:text-foreground transition-colors">
          Crie hábitos diários para melhorar sua rotina
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="group-hover:border-primary/50 transition-all flex items-center gap-2" 
        >
          <PlusCircle className="h-4 w-4" />
          Criar hábito
        </Button>
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
      className="p-5 hover:shadow-md transition-all relative overflow-hidden h-full bg-gradient-to-br from-card to-background border-primary/10" 
      role="button" 
      tabIndex={0}
    >
      {/* Background decorative elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">Hábitos de hoje</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs hover:bg-primary/10 rounded-full px-3"
          onClick={() => navigate('/habits')}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="space-y-2 mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <Progress 
            value={completion} 
            className="h-2 flex-1" 
            aria-label="Progresso dos hábitos"
          />
          <span className="text-xs font-medium bg-primary/10 px-2 py-0.5 rounded-full text-primary">
            {completion}%
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{completedToday} de {activeHabits.length} hábitos</span>
          {longestStreakHabit?.currentStreak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>{longestStreakHabit.currentStreak} dias em sequência</span>
            </div>
          )}
        </div>
      </div>
      
      {activeHabits.length > 0 && (
        <AnimatePresence>
          <div className="space-y-2.5 mt-4 z-10 relative">
            {activeHabits.slice(0, 3).map(habit => (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  habit.completedToday ? "bg-primary/5" : "bg-muted/50 hover:bg-muted/80"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full w-7 h-7 p-0 flex-shrink-0",
                    animatingHabitId === habit.id && "animate-pulse",
                    habit.completedToday 
                      ? "bg-primary/20 text-primary hover:bg-primary/30" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                  style={{ borderLeft: `3px solid ${habit.color}` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleHabit(habit.id, habit.completedToday);
                  }}
                >
                  {habit.completedToday ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-3.5 w-3.5" />
                  )}
                </Button>
                <span className={cn(
                  "text-sm truncate",
                  habit.completedToday && "text-muted-foreground"
                )}>
                  {habit.name}
                </span>
                {habit.currentStreak > 3 && (
                  <div className="ml-auto bg-orange-500/10 px-1.5 py-0.5 rounded-full flex items-center">
                    <Flame className="h-3 w-3 text-orange-500 mr-0.5" />
                    <span className="text-xs font-medium text-orange-500">{habit.currentStreak}</span>
                  </div>
                )}
              </motion.div>
            ))}
            
            {activeHabits.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-xs text-center justify-center mt-1 hover:bg-muted rounded-lg py-2"
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
          className="mt-4 flex items-center justify-center gap-2 bg-primary/10 p-3 rounded-lg z-10 relative"
        >
          <Award className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">Parabéns! Todos os hábitos concluídos hoje!</span>
        </motion.div>
      )}
    </Card>
  );
};

export default HabitWidget;
