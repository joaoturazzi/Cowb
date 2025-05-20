
import React, { useState } from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { sonnerToast as toast } from '@/components/ui';

interface HabitItemProps {
  habit: HabitWithStats;
  toggleHabitCompletion: (habitId: string, date?: Date, completed?: boolean) => Promise<boolean>;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, toggleHabitCompletion }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleToggleHabit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    try {
      await toggleHabitCompletion(habit.id);
      
      if (!habit.completedToday) {
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
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <motion.div 
      key={habit.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-2 p-1.5 rounded-lg",
        habit.completedToday ? "bg-primary/5" : "bg-muted/50 hover:bg-muted/80"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-6 h-6 p-0 flex-shrink-0",
          isAnimating && "animate-pulse",
          habit.completedToday 
            ? "bg-primary/20 text-primary hover:bg-primary/30" 
            : "bg-muted hover:bg-muted/80"
        )}
        style={{ borderLeft: `3px solid ${habit.color}` }}
        onClick={handleToggleHabit}
      >
        {habit.completedToday ? (
          <Check className="h-3 w-3" />
        ) : (
          <span className="h-3 w-3" />
        )}
      </Button>
      <span className={cn(
        "text-xs truncate",
        habit.completedToday && "text-muted-foreground"
      )}>
        {habit.name}
      </span>
      {habit.currentStreak > 3 && (
        <div className="ml-auto bg-orange-500/10 px-1.5 py-0.5 rounded-full flex items-center">
          <Flame className="h-2.5 w-2.5 text-orange-500 mr-0.5" />
          <span className="text-[10px] font-medium text-orange-500">{habit.currentStreak}</span>
        </div>
      )}
    </motion.div>
  );
};

export default HabitItem;
