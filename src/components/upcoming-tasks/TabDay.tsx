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
    const dayName = format(date, 'eee', { locale: ptBR }) as string;
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  const getDayNumber = (date: Date) => {
    return format(date, 'd', { locale: ptBR });
  };
  
  const getMonthName = (date: Date) => {
    return format(date, 'MMM', { locale: ptBR }).substring(0, 3);
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isCurrentDay = isToday(date);
  
  return (
    <TabsTrigger 
      value={formattedDate} 
      ref={tabRef}
      className={cn(
        // Layout e dimensões
        "w-[68px] h-[80px] relative transition-all duration-200 rounded-lg",
        "flex-shrink-0 flex flex-col items-center justify-center text-center",
        // Interatividade e feedback
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "active:scale-95 touch-manipulation cursor-pointer",
        "hover:shadow-sm focus:shadow-sm",
        // Estados visuais
        isSelected 
          ? "bg-primary/10 shadow-md border border-primary/40 z-10" 
          : "hover:bg-muted/50 active:bg-muted/80 z-0",
        isCurrentDay && !isSelected && "bg-primary/5 border border-primary/20",
        // Animações
        "transform transition-transform duration-200 ease-in-out",
        "hover:translate-y-[-1px] active:translate-y-[1px]"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-0.5 w-full overflow-hidden px-1">
        <span className={cn(
          "text-[10px] font-medium truncate w-full tracking-wide",
          isSelected ? "text-primary font-semibold" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-[22px] font-bold leading-none",
          isSelected ? "text-primary" : "text-foreground",
          isCurrentDay && !isSelected ? "text-primary/90" : ""
        )}>
          {getDayNumber(date)}
        </span>
        <span className={cn(
          "text-[10px] lowercase truncate w-full tracking-wide",
          isSelected ? "text-primary/70" : "text-muted-foreground/80",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {getMonthName(date)}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[9px] font-medium",
            "transform transition-transform duration-200",
            "hover:scale-110",
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
