
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
        "min-w-[90px] h-[86px] relative transition-all duration-300 rounded-xl py-2 px-3 mx-1 flex-shrink-0",
        isSelected 
          ? "bg-background shadow-md border border-primary/40" 
          : "hover:bg-primary/5",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1">
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
            "px-2 py-0.5 text-xs rounded-full absolute -top-1.5 -right-1.5",
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
