
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useHabit } from '@/contexts/habit/HabitContext';
import { useToast } from '@/hooks/use-toast';

interface HabitCheckboxProps {
  habitId: string;
  isCompleted: boolean;
  color: string;
  name: string;
  currentStreak: number;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({ 
  habitId, 
  isCompleted, 
  color, 
  name,
  currentStreak 
}) => {
  const { toggleHabitCompletion } = useHabit();
  const { toast } = useToast();

  const handleToggleCompletion = async () => {
    try {
      await toggleHabitCompletion(habitId, new Date(), !isCompleted);
      
      if (!isCompleted) {
        toast({
          title: "Hábito marcado como concluído",
          description: currentStreak > 0 ? `Sequência atual: ${currentStreak + 1} dias 🔥` : "Continue assim!",
          variant: "success",
        });
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Erro ao atualizar hábito",
        description: "Não foi possível atualizar o status do hábito",
        variant: "destructive",
      });
    }
  };

  return (
    <Checkbox
      checked={isCompleted}
      onCheckedChange={handleToggleCompletion}
      className="h-5 w-5 rounded-full"
      style={{ borderColor: color }}
      aria-label={`Marcar hábito ${name} como ${isCompleted ? 'não concluído' : 'concluído'}`}
    />
  );
};

export default HabitCheckbox;
