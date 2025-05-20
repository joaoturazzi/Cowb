
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, ptBR } from '@/utils/dateUtils';
import { Calendar } from 'lucide-react';

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
        // Base styles with fixed dimensions to prevent layout shifts
        "w-16 min-w-16 h-[74px] relative transition-all duration-150 rounded-lg",
        "py-1.5 px-0.5 mx-0.5 flex flex-col items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
        // Improved touch interaction
        "touch-manipulation cursor-pointer select-none",
        // Enhanced states
        isSelected 
          ? "bg-primary/15 shadow-md border-2 border-primary/60 scale-[1.03] data-[state=active]:bg-primary/15" 
          : "hover:bg-muted/50 border border-transparent hover:border-muted/40",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/30"
      )}
      style={{
        scrollSnapAlign: 'center',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-0.5 w-full overflow-hidden">
        {/* Today indicator */}
        {isCurrentDay && (
          <span className={cn(
            "absolute -top-1.5 left-1/2 transform -translate-x-1/2 text-[9px] font-medium uppercase bg-primary/20 rounded-sm px-1.5 py-0.5",
            isSelected ? "text-primary" : "text-primary/80"
          )}>
            hoje
          </span>
        )}

        {/* Day name */}
        <span className={cn(
          "text-[11px] font-medium mt-1",
          isSelected ? "text-primary font-semibold" : "",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        
        {/* Day number */}
        <span className={cn(
          "text-xl font-bold",
          isSelected ? "text-primary" : "text-foreground",
          isCurrentDay && !isSelected ? "text-primary/90" : ""
        )}>
          {getDayNumber(date)}
        </span>
        
        {/* Month name */}
        <span className={cn(
          "text-[10px] lowercase",
          isSelected ? "text-primary/80" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/70" : ""
        )}>
          {getMonthName(date)}
        </span>

        {/* Tasks count badge */}
        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-medium shadow-sm",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : isCurrentDay 
                ? "bg-primary/70 text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
          )}>
            {tasksCount}
          </span>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabDay;
