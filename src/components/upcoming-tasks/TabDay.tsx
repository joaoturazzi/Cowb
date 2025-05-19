
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
    const dayName = format(date, 'EEE', { locale: ptBR }) as string;
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  const getDayNumber = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };
  
  const getMonthName = (date: Date) => {
    return format(date, 'MMM', { locale: ptBR });
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
        "w-[92px] h-[88px] relative transition-all duration-300 rounded-xl py-2 px-1 mx-1",
        "flex-shrink-0 flex items-center justify-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "touch-manipulation cursor-pointer",
        isSelected 
          ? "bg-background shadow-md border border-primary/40" 
          : "hover:bg-primary/5 active:bg-primary/10",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1 w-full">
        <span className={cn(
          "text-sm font-medium",
          isSelected ? "text-primary" : "",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-2xl font-bold",
          isSelected ? "text-primary" : "text-foreground",
          isCurrentDay && !isSelected ? "text-primary/90" : ""
        )}>
          {getDayNumber(date)}
        </span>
        <span className={cn(
          "text-xs",
          isSelected ? "text-primary/70" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {getMonthName(date)}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1.5 -right-1.5 px-2 py-0.5 text-xs rounded-full",
            "transform translate-x-0 translate-y-0 z-10", // Ensure proper stacking
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
