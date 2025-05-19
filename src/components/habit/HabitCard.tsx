import React from 'react';
import { Habit, HabitWithStats } from '@/contexts/habit/habitTypes';
import { CheckCircle, CheckCircle2, MoreVertical, Pencil, Trash, Award, Flame } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import './HabitAnimations.css';

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
    if (streak >= 30) return <Flame className="h-4 w-4 text-orange-500" />;
    if (streak >= 14) return <Flame className="h-4 w-4 text-yellow-500" />;
    if (streak >= 7) return <Flame className="h-4 w-4 text-blue-500" />;
    if (streak >= 3) return <Flame className="h-4 w-4 text-green-500" />;
    return null;
  };

  // Get achievement badge based on streak
  const getAchievementBadge = (streak: number) => {
    if (streak >= 100) return { icon: <Award className="h-5 w-5 text-yellow-500" />, label: "Mestre" };
    if (streak >= 30) return { icon: <Award className="h-5 w-5 text-orange-500" />, label: "Experiente" };
    if (streak >= 7) return { icon: <Award className="h-5 w-5 text-blue-500" />, label: "Iniciante" };
    return null;
  };

  const achievementBadge = getAchievementBadge(habit.currentStreak);

  return (
    <Card 
      className="relative overflow-hidden transition-all hover:shadow-md border-l-4 group"
      style={{ borderLeftColor: habit.color }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={habit.completedToday}
              onCheckedChange={handleToggleCompletion}
              className="h-5 w-5 rounded-full"
              style={{ borderColor: habit.color }}
              aria-label={`Marcar hábito ${habit.name} como ${habit.completedToday ? 'não concluído' : 'concluído'}`}
            />
            
            <div>
              <h3 className="font-medium">{habit.name}</h3>
              {habit.description && (
                <p className="text-xs text-muted-foreground mt-1">{habit.description}</p>
              )}
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

        {/* Streak information */}
        <div className="flex items-center gap-2 mb-3">
          {habit.currentStreak > 0 && (
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-xs">
              <Flame className="h-3 w-3 text-primary" />
              <span>{habit.currentStreak} dias</span>
            </div>
          )}
          
          {achievementBadge && (
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full text-xs text-yellow-700">
              {achievementBadge.icon}
              <span>{achievementBadge.label}</span>
            </div>
          )}

          <div className="ml-auto text-xs text-muted-foreground">
            {Math.round(habit.completionRate)}% nos últimos 30 dias
          </div>
        </div>

        {/* Progress bar */}
        <Progress 
          value={habit.completionRate} 
          className="h-1.5 mb-3" 
        />

        {/* Mini-calendar showing last 7 days */}
        <div className="flex gap-1 justify-end">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayLog = habit.logs?.find(log => 
              new Date(log.date).toDateString() === date.toDateString()
            );
            const isCompleted = dayLog?.completed;
            const dayOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()];
            
            return (
              <div 
                key={`day-${i}`} 
                className={`w-6 h-6 flex flex-col items-center justify-center rounded-full text-[10px] transition-all ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                } ${date.toDateString() === new Date().toDateString() ? 'ring-1 ring-primary' : ''}`}
                title={date.toLocaleDateString()}
              >
                <span className="text-[8px]">{dayOfWeek}</span>
                {isCompleted && <div className="h-1 w-1 rounded-full bg-current mt-0.5"></div>}
              </div>
            );
          })}
        </div>
        
        {/* Achievement animation overlay - shown when completing a milestone */}
        {habit.completedToday && habit.currentStreak > 0 && habit.currentStreak % 7 === 0 && (
          <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center animate-pulse">
            <div className="animate-bounce">
              <Award className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HabitCard;
