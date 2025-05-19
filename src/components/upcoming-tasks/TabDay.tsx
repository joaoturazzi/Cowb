
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
    // Format to get a more readable day name in Portuguese
    const dayName = format(date, 'EEEE', { locale: ptBR });
    // Ensure dayName is a string before using string methods
    if (typeof dayName === 'string') {
      // Capitalize first letter
      return dayName.charAt(0).toUpperCase() + dayName.slice(1);
    }
    return '';
  };
  
  const getFormattedDate = (date: Date) => {
    // Improved date formatting based on screen size
    return isMobile 
      ? format(date, 'dd/MM', { locale: ptBR })
      : format(date, 'd MMM', { locale: ptBR });
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
        "min-w-[110px] h-[80px] relative transition-all duration-300 rounded-xl py-2 px-3",
        isSelected 
          ? "bg-background shadow-md border border-primary/20" 
          : "hover:bg-primary/5",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className={cn(
          "text-sm font-medium capitalize mb-1",
          isSelected ? "text-primary" : "",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-xs mb-1.5",
          isSelected ? "text-primary/90 font-medium" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/70" : ""
        )}>
          {getFormattedDate(date)}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "px-2.5 py-0.5 text-xs rounded-full transition-all",
            isSelected 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : isCurrentDay 
                ? "bg-primary/20 text-primary"
                : "bg-primary/15 text-primary/90"
          )}>
            {tasksCount}
          </span>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabDay;
