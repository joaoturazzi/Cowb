
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import DayCardHeader from './DayCardHeader';
import TaskSection from './TaskSection';
import EmptyDayCard from './EmptyDayCard';
import EmptyTasksAlert from './EmptyTasksAlert';

interface UpcomingDayCardProps {
  date: Date;
  tasks: Task[];
  isEmpty: boolean;
  timerState: string;
  currentTask: Task | null;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onAddTask: (date: string) => void;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const UpcomingDayCard: React.FC<UpcomingDayCardProps> = ({
  date,
  tasks,
  isEmpty,
  timerState,
  currentTask,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onAddTask,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const isToday = new Date().toDateString() === date.toDateString();
  const formattedDisplayDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

  // Separate completed and pending tasks
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <Card className={cn(
      "border shadow-md transition-transform hover:shadow-lg duration-300 overflow-hidden",
      isToday ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card" : ""
    )}>
      <CardHeader className={cn(
        "bg-muted/20 pb-4 border-b",
        isToday ? "bg-primary/10" : ""
      )}>
        <DayCardHeader 
          formattedDisplayDate={formattedDisplayDate}
          formattedDate={formattedDate}
          isToday={isToday}
          onAddTask={onAddTask}
        />
      </CardHeader>
      <CardContent className="p-5 md:p-6">
        {isEmpty ? (
          <EmptyDayCard 
            formattedDate={formattedDate} 
            onAddTask={onAddTask} 
          />
        ) : (
          <div className="space-y-6">
            <TaskSection
              title="Tarefas pendentes"
              tasks={pendingTasks}
              badgeText={isToday ? "Hoje" : undefined}
              badgeColor={isToday ? "bg-primary/20 text-primary" : undefined}
              timerState={timerState}
              currentTask={currentTask}
              showCompletionMessage={showCompletionMessage}
              completedTaskName={completedTaskName}
              taskStreak={taskStreak}
              onCheckTask={onCheckTask}
              onSelectTask={onSelectTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
            
            <TaskSection
              title="Tarefas concluídas"
              tasks={completedTasks}
              badgeText={completedTasks.length > 0 && pendingTasks.length === 0 ? "Tudo concluído" : undefined}
              badgeColor="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              isCompleted={true}
              timerState={timerState}
              currentTask={currentTask}
              showCompletionMessage={showCompletionMessage}
              completedTaskName={completedTaskName}
              taskStreak={taskStreak}
              onCheckTask={onCheckTask}
              onSelectTask={onSelectTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />

            {pendingTasks.length === 0 && completedTasks.length === 0 && (
              <EmptyTasksAlert />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDayCard;
