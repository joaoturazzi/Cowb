
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HabitWidgetHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-2 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">Hábitos</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 text-xs hover:bg-primary/10 rounded-full px-2"
        onClick={() => navigate('/habits')}
      >
        Ver todos
      </Button>
    </div>
  );
};

export default HabitWidgetHeader;
