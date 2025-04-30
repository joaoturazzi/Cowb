
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';

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
  return (
    <Tabs defaultValue={selectedDay} onValueChange={onDayChange}>
      <TabsList className="grid grid-cols-5 mb-4">
        {days.map((day) => (
          <TabsTrigger key={day.formattedDate} value={day.formattedDate} className="text-center">
            <div className="flex flex-col items-center">
              <span className="font-medium">
                {format(day.date, 'EEE', { locale: ptBR })}
              </span>
              <span className="text-sm">
                {format(day.date, 'd MMM', { locale: ptBR })}
              </span>
              {!day.isEmpty && (
                <span className="mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {day.tasks.filter(t => !t.completed).length}
                </span>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {days.map((day) => (
        <TabsContent key={day.formattedDate} value={day.formattedDate}>
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
