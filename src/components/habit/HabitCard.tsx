
import React from 'react';
import { Habit, HabitWithStats } from '@/contexts/habit/habitTypes';
import { CheckCircle, CheckCircle2, MoreVertical, Pencil, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useHabit } from '@/contexts/habit/HabitContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const { toggleHabitCompletion, deleteHabit } = useHabit();
  const { toast } = useToast();

  const handleToggleCompletion = async () => {
    try {
      await toggleHabitCompletion(habit.id, new Date(), !habit.completedToday);
      
      if (!habit.completedToday) {
        toast({
          title: "Hábito marcado como concluído",
          description: habit.currentStreak > 0 ? `Sequência atual: ${habit.currentStreak + 1} dias 🔥` : "Continue assim!",
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

  // Get streak emoji based on streak count
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "✨";
    return "";
  };

  return (
    <Card 
      className="relative hover:shadow-md transition-all border-l-4"
      style={{ borderLeftColor: habit.color }}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={habit.completedToday}
            onCheckedChange={handleToggleCompletion}
            className="h-5 w-5 rounded-full"
            aria-label={`Marcar hábito ${habit.name} como ${habit.completedToday ? 'não concluído' : 'concluído'}`}
          />
          
          <div>
            <h3 className="font-medium text-sm">{habit.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">
                {habit.currentStreak > 0 ? (
                  <>
                    <span className="font-medium">{habit.currentStreak} dias</span> {getStreakEmoji(habit.currentStreak)}
                  </>
                ) : 'Comece hoje!'}
              </span>
            </div>
          </div>
        </div>

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
      </div>

      {/* Mini-calendar showing last 7 days */}
      <div className="px-3 pb-3 flex gap-1 justify-end">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayLog = habit.logs?.find(log => 
            new Date(log.date).toDateString() === date.toDateString()
          );
          const isCompleted = dayLog?.completed;
          
          return (
            <div 
              key={`day-${i}`} 
              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
                isCompleted 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              } ${date.toDateString() === new Date().toDateString() ? 'ring-1 ring-primary' : ''}`}
              title={date.toLocaleDateString()}
            >
              {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : ''}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default HabitCard;
