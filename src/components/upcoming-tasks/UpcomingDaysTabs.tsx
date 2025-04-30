
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const activeTabRef = useRef<HTMLButtonElement>(null);
  
  // Scroll to selected tab when it changes
  useEffect(() => {
    if (activeTabRef.current && scrollAreaRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollAreaRef.current;
      
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
    <div className="bg-card/30 p-4 sm:p-6 rounded-xl border shadow-sm">
      <Tabs 
        defaultValue={selectedDay} 
        onValueChange={onDayChange}
        className="animate-fade-in"
      >
        <div className="relative mb-6">
          <ScrollArea 
            ref={scrollAreaRef} 
            className="w-full overflow-x-auto pb-1"
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
                      "min-w-[90px] relative transition-all duration-300 rounded-lg py-2.5 px-2",
                      isSelectedDay ? "font-medium shadow-md" : "hover:bg-primary/5",
                      isCurrentDay && "bg-primary/5 font-semibold border border-primary/20"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "text-sm font-medium",
                        isSelectedDay && "text-primary"
                      )}>
                        {getDayName(day.date)}
                      </span>
                      <span className={cn(
                        "text-xs opacity-80 mt-0.5",
                        isSelectedDay && "text-primary/90"
                      )}>
                        {getFormattedDate(day.date)}
                      </span>
                      {pendingTasksCount > 0 && (
                        <span className={cn(
                          "mt-1.5 px-2 py-0.5 text-xs rounded-full transition-all",
                          isSelectedDay 
                            ? "bg-primary text-white shadow-sm" 
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
          </ScrollArea>
          
          {/* Scroll indicators/buttons */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 bg-gradient-to-r from-background to-transparent rounded-l-lg"></div>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 bg-gradient-to-l from-background to-transparent rounded-r-lg"></div>
          </div>
        </div>

        <div className="space-y-6">
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
