
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
    <Tabs 
      defaultValue={selectedDay} 
      onValueChange={onDayChange} 
      className="animate-fade-in"
    >
      <TabsList className={cn(
        "grid w-full rounded-xl mb-6 bg-muted/80 p-1 shadow-inner",
        isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-5 gap-2'
      )}>
        {days.map((day) => {
          const isSelectedDay = day.formattedDate === selectedDay;
          const isCurrentDay = isToday(day.date);
          const pendingTasksCount = day.tasks.filter(t => !t.completed).length;
          
          return (
            <TabsTrigger 
              key={day.formattedDate} 
              value={day.formattedDate} 
              className={cn(
                "relative text-center transition-all duration-300 rounded-lg",
                isSelectedDay ? "font-medium shadow-sm" : "hover:bg-primary/5",
                isCurrentDay && "bg-primary/5 font-semibold"
              )}
            >
              <div className="flex flex-col items-center py-1">
                <span className={cn(
                  "text-sm font-medium",
                  isSelectedDay && "text-primary"
                )}>
                  {getDayName(day.date)}
                </span>
                <span className="text-xs opacity-90">
                  {getFormattedDate(day.date)}
                </span>
                {pendingTasksCount > 0 && (
                  <span className={cn(
                    "mt-1.5 px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full transition-all",
                    isSelectedDay ? "bg-primary text-white" : "bg-primary/15 text-primary"
                  )}>
                    {pendingTasksCount}
                  </span>
                )}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {days.map((day) => (
        <TabsContent 
          key={day.formattedDate} 
          value={day.formattedDate}
          className="animate-fade-in focus-visible:outline-none focus-visible:ring-0"
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
    </Tabs>
  );
};

export default UpcomingDaysTabs;
