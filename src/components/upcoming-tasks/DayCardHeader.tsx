
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { CardTitle } from "@/components/ui/card";

interface DayCardHeaderProps {
  formattedDisplayDate: string;
  formattedDate: string;
  isToday: boolean;
  onAddTask: (date: string) => void;
}

const DayCardHeader: React.FC<DayCardHeaderProps> = ({
  formattedDisplayDate,
  formattedDate,
  isToday,
  onAddTask
}) => {
  return (
    <CardTitle className="text-lg flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={cn(
          "p-2.5 rounded-md transition-colors duration-300",
          isToday ? "bg-primary/30" : "bg-muted/40"
        )}>
          <Calendar className={cn(
            "h-5 w-5", 
            isToday ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <span className={cn(
          isToday ? "text-primary font-semibold" : "",
          "capitalize text-lg"
        )}>
          {formattedDisplayDate}
        </span>
      </div>
      <Button
        variant={isToday ? "default" : "outline"}
        size="sm"
        className={cn(
          "hover:bg-primary/10 flex gap-1.5 ml-2 transition-all",
          isToday ? "bg-primary/30 hover:bg-primary/40 text-primary-foreground border-none" : "border-primary/20 hover:border-primary/40"
        )}
        onClick={() => onAddTask(formattedDate)}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Adicionar</span>
      </Button>
    </CardTitle>
  );
};

export default DayCardHeader;
