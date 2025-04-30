
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <Tabs 
      defaultValue={selectedDay} 
      onValueChange={onDayChange} 
      className="animate-fade-in"
    >
      <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} mb-4`}>
        {days.map((day) => (
          <TabsTrigger 
            key={day.formattedDate} 
            value={day.formattedDate} 
            className="text-center transition-all duration-200 hover:bg-primary/10"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">
                {getDayName(day.date)}
              </span>
              <span className="text-xs">
                {getFormattedDate(day.date)}
              </span>
              {!day.isEmpty && (
                <span className="mt-1 px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full transition-transform hover:scale-105">
                  {day.tasks.filter(t => !t.completed).length}
                </span>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {days.map((day) => (
        <TabsContent 
          key={day.formattedDate} 
          value={day.formattedDate}
          className="animate-fade-in"
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
