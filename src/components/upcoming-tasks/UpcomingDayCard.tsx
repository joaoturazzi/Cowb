
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import DayCardHeader from './DayCardHeader';
import TaskSection from './TaskSection';
import EmptyDayCard from './EmptyDayCard';
import EmptyTasksAlert from './EmptyTasksAlert';
import { format, ptBR } from '@/utils/dateUtils';

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
      "border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
      isToday ? "bg-gradient-to-br from-primary/5 to-card border-primary/20" : ""
    )}>
      <CardHeader className={cn(
        "bg-muted/10 pb-2 border-b",
        isToday ? "bg-primary/5" : "",
        "px-4 py-3"
      )}>
        <DayCardHeader 
          formattedDisplayDate={formattedDisplayDate}
          formattedDate={formattedDate}
          isToday={isToday}
          onAddTask={onAddTask}
        />
      </CardHeader>
      <CardContent className="p-3">
        {isEmpty ? (
          <EmptyDayCard 
            formattedDate={formattedDate} 
            onAddTask={onAddTask} 
          />
        ) : (
          <div className="space-y-4">
            {pendingTasks.length > 0 && (
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
            )}
            
            {completedTasks.length > 0 && (
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
            )}

            {pendingTasks.length === 0 && completedTasks.length === 0 && (
              <EmptyTasksAlert onAddTask={() => onAddTask(formattedDate)} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDayCard;
