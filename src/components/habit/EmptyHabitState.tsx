
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlusCircle } from 'lucide-react';

interface EmptyHabitStateProps {
  onAddHabit: () => void;
}

const EmptyHabitState: React.FC<EmptyHabitStateProps> = ({ onAddHabit }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-medium mb-3">Sem hábitos ainda</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Crie hábitos para acompanhar suas rotinas diárias e desenvolver consistência nas suas atividades.
      </p>
      <Button onClick={onAddHabit} size="lg" className="gap-2">
        <PlusCircle className="h-5 w-5" />
        Criar meu primeiro hábito
      </Button>
    </div>
  );
};

export default EmptyHabitState;
