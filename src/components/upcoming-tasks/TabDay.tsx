
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, ptBR } from '@/utils/dateUtils';

interface TabDayProps {
  date: Date;
  formattedDate: string;
  isSelected: boolean;
  tasksCount: number;
  tabRef?: React.Ref<HTMLButtonElement>;
}

const TabDay: React.FC<TabDayProps> = ({
  date,
  formattedDate,
  isSelected,
  tasksCount,
  tabRef
}) => {
  const isMobile = useIsMobile();
  
  const getDayName = (date: Date) => {
    // Get short day name and capitalize first letter
    const dayName = format(date, 'eee', { locale: ptBR }) as string;
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  const getDayNumber = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };
  
  const getMonthName = (date: Date) => {
    // Shorter month name for better display
    return format(date, 'MMM', { locale: ptBR }).substring(0, 3);
  };
  
  const isToday = (date: Date) => {
    return new Date().toDateString() === date.toDateString();
  };
  
  const isCurrentDay = isToday(date);
  
  return (
    <TabsTrigger 
      value={formattedDate} 
      ref={tabRef}
      className={cn(
        // Fixed width to ensure consistent sizing across all tabs
        "w-20 h-[76px] relative transition-all duration-300 rounded-xl py-1 px-0.5 mx-0.5",
        "flex-shrink-0 flex flex-col items-center justify-center text-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "touch-manipulation cursor-pointer",
        "hover:shadow-sm",
        isSelected 
          ? "bg-background shadow-md border border-primary/40" 
          : "hover:bg-primary/5 active:bg-primary/10",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-0.5 w-full overflow-hidden">
        <span className={cn(
          "text-xs font-medium truncate w-full",
          isSelected ? "text-primary" : "",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-xl font-bold",
          isSelected ? "text-primary" : "text-foreground",
          isCurrentDay && !isSelected ? "text-primary/90" : ""
        )}>
          {getDayNumber(date)}
        </span>
        <span className={cn(
          "text-xs lowercase truncate w-full",
          isSelected ? "text-primary/70" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {getMonthName(date)}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full text-xs",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : isCurrentDay 
                ? "bg-primary/40 text-primary-foreground"
                : "bg-muted text-muted-foreground"
          )}>
            {tasksCount}
          </span>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabDay;

