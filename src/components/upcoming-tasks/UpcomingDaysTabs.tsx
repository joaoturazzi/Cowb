
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpcomingDaysTabsProps {
  days: DayTasks[];
  selectedDay: string;
  timerState: string;
  currentTask: Task | null;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onDayChange: (day: string) => void;
  onAddTask: (date: string) => void;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const UpcomingDaysTabs: React.FC<UpcomingDaysTabsProps> = ({
  days,
  selectedDay,
  timerState,
  currentTask,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onDayChange,
  onAddTask,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  
  // Scroll to selected tab when it changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;
      
      // Calculate the center position for the selected tab
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      
      const centerPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      // Smooth scroll to the center position
      scrollContainer.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedDay]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  
  const getFormattedDate = (date: Date) => {
    return isMobile 
      ? format(date, 'dd/MM', { locale: ptBR })
      : format(date, 'd MMM', { locale: ptBR });
  };

  const getDayName = (date: Date) => {
    return format(date, 'EEE', { locale: ptBR });
  };

  const isToday = (date: Date) => {
    return new Date().toDateString() === date.toDateString();
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm animate-fade-in">
      <Tabs 
        defaultValue={selectedDay} 
        onValueChange={onDayChange}
        className="animate-fade-in"
      >
        <div className="px-4 pt-4 relative">
          <div className="relative">
            <div 
              ref={scrollContainerRef} 
              className="flex overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <TabsList className={cn(
                "inline-flex w-auto min-w-full justify-start gap-2 p-1.5 rounded-xl bg-muted/50 border shadow-inner",
              )}>
                {days.map((day) => {
                  const isSelectedDay = day.formattedDate === selectedDay;
                  const isCurrentDay = isToday(day.date);
                  const pendingTasksCount = day.tasks.filter(t => !t.completed).length;
                  
                  return (
                    <TabsTrigger 
                      key={day.formattedDate} 
                      value={day.formattedDate} 
                      ref={isSelectedDay ? activeTabRef : undefined}
                      className={cn(
                        "min-w-[100px] relative transition-all duration-300 rounded-lg py-3 px-2",
                        isSelectedDay ? "bg-background font-medium shadow-md" : "hover:bg-primary/5",
                        isCurrentDay && !isSelectedDay && "bg-primary/5 font-semibold border border-primary/20"
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "text-sm font-medium uppercase",
                          isSelectedDay ? "text-primary" : ""
                        )}>
                          {getDayName(day.date)}
                        </span>
                        <span className={cn(
                          "text-xs opacity-80 mt-1",
                          isSelectedDay ? "text-primary/90" : ""
                        )}>
                          {getFormattedDate(day.date)}
                        </span>
                        {pendingTasksCount > 0 && (
                          <span className={cn(
                            "mt-1.5 px-2.5 py-0.5 text-xs rounded-full transition-all",
                            isSelectedDay 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "bg-primary/15 text-primary"
                          )}>
                            {pendingTasksCount}
                          </span>
                        )}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            
            {/* Scroll buttons with improved styling */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border border-border z-10 opacity-90 hover:opacity-100"
              onClick={handleScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm border border-border z-10 opacity-90 hover:opacity-100"
              onClick={handleScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Gradient fade effects */}
            <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-card to-transparent z-[1]"></div>
            <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-card to-transparent z-[1]"></div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {days.map((day) => (
            <TabsContent 
              key={day.formattedDate} 
              value={day.formattedDate}
              className="animate-fade-in mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <UpcomingDayCard
                date={day.date}
                tasks={day.tasks}
                isEmpty={day.isEmpty}
                timerState={timerState}
                currentTask={currentTask}
                showCompletionMessage={showCompletionMessage}
                completedTaskName={completedTaskName}
                taskStreak={taskStreak}
                onAddTask={onAddTask}
                onCheckTask={onCheckTask}
                onSelectTask={onSelectTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default UpcomingDaysTabs;
