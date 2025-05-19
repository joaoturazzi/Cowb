
import React from 'react';
import { Pencil, Trash, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/contexts/habit/habitTypes';
import { useHabit } from '@/contexts/habit/HabitContext';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface HabitActionsProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

const HabitActions: React.FC<HabitActionsProps> = ({ habit, onEdit }) => {
  const { deleteHabit } = useHabit();
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      toast({
        title: "Hábito arquivado",
        description: "O hábito foi arquivado com sucesso",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Erro ao arquivar hábito",
        description: "Não foi possível arquivar o hábito",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(habit)}>
          <Pencil className="h-4 w-4 mr-2" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash className="h-4 w-4 mr-2" /> Arquivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HabitActions;
