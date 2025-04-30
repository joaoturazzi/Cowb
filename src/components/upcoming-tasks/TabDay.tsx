
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
    return format(date, 'EEE', { locale: ptBR });
  };
  
  const getFormattedDate = (date: Date) => {
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
        "min-w-[100px] relative transition-all duration-300 rounded-lg py-3 px-2",
        isSelected ? "bg-background font-medium shadow-md" : "hover:bg-primary/5",
        isCurrentDay && !isSelected && "bg-primary/5 font-semibold border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center">
        <span className={cn(
          "text-sm font-medium uppercase",
          isSelected ? "text-primary" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-xs opacity-80 mt-1",
          isSelected ? "text-primary/90" : ""
        )}>
          {getFormattedDate(date)}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "mt-1.5 px-2.5 py-0.5 text-xs rounded-full transition-all",
            isSelected 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-primary/15 text-primary"
          )}>
            {tasksCount}
          </span>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabDay;
