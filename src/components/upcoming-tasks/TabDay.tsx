
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

  // Log when tabs are clicked for debugging
  const handleTabClick = () => {
    console.log("TabDay clicked:", formattedDate);
  };
  
  return (
    <TabsTrigger 
      value={formattedDate} 
      ref={tabRef}
      onClick={handleTabClick}
      className={cn(
        // Responsive and slightly smaller width
        "min-w-[65px] sm:min-w-[72px] md:min-w-[80px] h-[62px] relative transition-all duration-300 rounded-lg",
        "py-1.5 px-0.5 mx-0.5 flex-shrink-0 flex flex-col items-center justify-center text-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        // Improved touch interaction
        "active:scale-95 touch-manipulation cursor-pointer",
        // Enhanced hover and focus states with subtle animations
        "hover:shadow-md focus:shadow-md transition-all",
        isSelected 
          ? "bg-background shadow-lg border-2 border-primary/60 scale-105 z-10" 
          : "hover:bg-muted/50 active:bg-primary/10 z-0 border border-transparent hover:border-muted",
        isCurrentDay && !isSelected && "bg-primary/10 border border-primary/40"
      )}
      style={{
        scrollSnapAlign: 'center',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-0.5 w-full overflow-hidden">
        {isCurrentDay && !isMobile && (
          <span className={cn(
            "absolute -top-1 right-1 text-[9px] font-medium uppercase rounded-sm px-1",
            isSelected ? "text-primary bg-primary/10" : "text-primary/70"
          )}>
            hoje
          </span>
        )}

        <span className={cn(
          "text-[11px] font-medium truncate w-full",
          isSelected ? "text-primary font-semibold" : "",
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
          "text-[10px] lowercase truncate w-full",
          isSelected ? "text-primary/70" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {getMonthName(date)}
        </span>

        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center rounded-full text-[10px] shadow-sm",
            isSelected 
              ? "bg-primary text-primary-foreground font-medium" 
              : isCurrentDay 
                ? "bg-primary/60 text-primary-foreground"
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
