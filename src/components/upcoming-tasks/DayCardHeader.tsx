
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
  // Capitalize first letter of each word in the date
  const capitalizeDate = (date: string) => {
    return date.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const displayDate = capitalizeDate(formattedDisplayDate);
  
  return (
    <CardTitle className="text-base sm:text-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-md transition-colors",
          isToday ? "bg-primary/20" : "bg-muted/30"
        )}>
          <Calendar className={cn(
            "h-4 w-4", 
            isToday ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <span className={cn(
          isToday ? "text-primary font-medium" : "",
          "capitalize"
        )}>
          {displayDate}
        </span>
      </div>
      <Button
        variant={isToday ? "default" : "outline"}
        size="sm"
        className={cn(
          "hover:bg-primary/10 flex gap-1 transition-all",
          isToday ? "bg-primary/20 hover:bg-primary/30 text-primary border-none" : "border-primary/20 hover:border-primary/40"
        )}
        onClick={() => onAddTask(formattedDate)}
      >
        <Plus className="h-3 w-3" />
        <span className="text-xs">Adicionar</span>
      </Button>
    </CardTitle>
  );
};

export default DayCardHeader;
