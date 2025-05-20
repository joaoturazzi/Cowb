
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyHabitWidget: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="p-4 h-full border-dashed hover:border-primary/50 transition-all group flex flex-col justify-center items-center bg-gradient-to-br from-card to-background" 
      onClick={() => navigate('/habits')} 
      role="button" 
      tabIndex={0}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
        <CheckCircle2 className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-center mb-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        Crie hábitos diários para melhorar sua rotina
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="group-hover:border-primary/50 transition-all flex items-center gap-1 text-xs h-8" 
      >
        <PlusCircle className="h-3 w-3" />
        Criar hábito
      </Button>
    </Card>
  );
};

export default EmptyHabitWidget;
