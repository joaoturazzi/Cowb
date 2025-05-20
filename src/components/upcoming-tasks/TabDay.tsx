
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
        // Responsive width based on screen size
        "min-w-[70px] sm:min-w-[78px] md:min-w-[85px] h-[68px] relative transition-all duration-300 rounded-xl",
        "py-2 px-1 mx-0.5 flex-shrink-0 flex flex-col items-center justify-center text-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        // Improved touch interaction
        "active:scale-95 touch-manipulation cursor-pointer",
        // Enhanced hover and focus states
        "hover:shadow-md focus:shadow-md",
        isSelected 
          ? "bg-background shadow-lg border-2 border-primary/60 z-10" 
          : "hover:bg-muted/50 active:bg-primary/10 z-0",
        isCurrentDay && !isSelected && "bg-primary/10 border border-primary/40"
      )}
    >
      <div className="flex flex-col items-center justify-center h-full gap-0.5 w-full overflow-hidden">
        {isCurrentDay && !isMobile && (
          <span className={cn(
            "absolute -top-1 right-1 text-[10px] font-medium uppercase",
            isSelected ? "text-primary" : "text-primary/70"
          )}>
            hoje
          </span>
        )}

        <span className={cn(
          "text-xs font-medium truncate w-full",
          isSelected ? "text-primary font-semibold" : "",
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
          "text-xs lowercase truncate w-full",
          isSelected ? "text-primary/70" : "text-muted-foreground",
          isCurrentDay && !isSelected ? "text-primary/60" : ""
        )}>
          {getMonthName(date)}
        </span>

        {tasksCount > 0 && (
          <span className={cn(
            "absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm",
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
