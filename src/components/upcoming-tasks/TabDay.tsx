
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
    // Format para obter um nome do dia mais legível em português
    const dayName = format(date, 'EEEE', { locale: ptBR }) as string;
    // Capitaliza primeira letra
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  const getFormattedDate = (date: Date) => {
    // Formatação de data melhorada baseada no tamanho da tela
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
        "min-w-[120px] h-[90px] relative transition-all duration-300 rounded-xl py-2 px-3 mx-1",
        isSelected 
          ? "bg-background shadow-md border border-primary/20" 
          : "hover:bg-primary/10",
        isCurrentDay && !isSelected && "bg-primary/10 border border-primary/20"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1.5">
        <span className={cn(
          "text-sm font-medium capitalize",
          isSelected ? "text-primary" : "",
          isCurrentDay && !isSelected ? "text-primary/80" : ""
        )}>
          {getDayName(date)}
        </span>
        <span className={cn(
          "text-base font-bold",
          isSelected ? "text-primary/90" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/70" : ""
        )}>
          {format(date, 'd', { locale: ptBR })}
        </span>
        <span className={cn(
          "text-xs",
          isSelected ? "text-primary/70 font-medium" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {format(date, 'MMM', { locale: ptBR })}
        </span>
        {tasksCount > 0 && (
          <span className={cn(
            "px-2.5 py-0.5 text-xs rounded-full transition-all absolute -top-1.5 -right-1.5",
            isSelected 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : isCurrentDay 
                ? "bg-primary/30 text-primary"
                : "bg-primary/20 text-primary/90"
          )}>
            {tasksCount}
          </span>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabDay;
