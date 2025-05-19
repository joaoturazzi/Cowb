
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card } from '@/components/ui/card';
import { CheckCircle2, PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const HabitWidget = () => {
  const { habits, isLoading } = useHabit();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card className="p-4 mb-4">
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </Card>
    );
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return (
      <Card className="p-4 mb-4 border-dashed border">
        <div className="flex flex-col items-center justify-center py-2">
          <CheckCircle2 className="h-5 w-5 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center mb-2">
            Crie hábitos diários para melhorar sua rotina
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center" 
            onClick={() => navigate('/habits')}
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
    
  return (
    <Card className="p-4 mb-4" onClick={() => navigate('/habits')} role="button" tabIndex={0}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-1 text-primary" />
          <span className="text-sm font-medium">Hábitos de hoje</span>
        </div>
        <span className="text-sm">
          {completedToday}/{activeHabits.length}
        </span>
      </div>
      <Progress value={completion} className="h-2 mt-2" />
      
      {activeHabits.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {activeHabits.slice(0, 3).map(habit => (
            <div 
              key={habit.id}
              className="flex items-center gap-1.5 py-1 px-2 rounded-full bg-muted text-xs"
              style={{ borderLeft: `3px solid ${habit.color}` }}
            >
              <span className={`h-2 w-2 rounded-full ${habit.completedToday ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              {habit.name}
            </div>
          ))}
          {activeHabits.length > 3 && (
            <div className="flex items-center py-1 px-2 rounded-full bg-muted text-xs">
              +{activeHabits.length - 3}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default HabitWidget;
