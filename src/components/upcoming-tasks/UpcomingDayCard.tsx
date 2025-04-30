
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem from '../TaskItem';
import { cn } from '@/lib/utils';

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

  // Separate completed and pending tasks
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <Card className={cn(
      "border shadow-lg transition-all overflow-hidden",
      isToday ? "border-primary/30 bg-card/70" : ""
    )}>
      <CardHeader className={cn(
        "bg-muted/30",
        isToday ? "bg-primary/5" : ""
      )}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-md",
              isToday ? "bg-primary/20" : "bg-muted/50"
            )}>
              <Calendar className={cn(
                "h-5 w-5", 
                isToday ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <span className={isToday ? "text-primary font-semibold" : ""}>
              {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 flex gap-1"
            onClick={() => onAddTask(formattedDate)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isEmpty ? (
          <div className="text-center py-12 px-4">
            <div className="bg-muted/30 rounded-full w-16 h-16 mb-4 flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <p className="text-muted-foreground mb-4">Você não tem tarefas para este dia</p>
            <Button 
              variant="default" 
              className="mt-2 bg-primary hover:bg-primary/90"
              onClick={() => onAddTask(formattedDate)}
            >
              Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            {pendingTasks.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Tarefas pendentes ({pendingTasks.length})
                </h3>
                {pendingTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    currentTask={currentTask}
                    timerState={timerState}
                    showCompletionMessage={showCompletionMessage}
                    completedTaskName={completedTaskName}
                    taskStreak={taskStreak}
                    onCheckTask={onCheckTask}
                    onSelectTask={onSelectTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Tarefas concluídas ({completedTasks.length})
                </h3>
                <div className="opacity-70">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      currentTask={currentTask}
                      timerState={timerState}
                      showCompletionMessage={showCompletionMessage}
                      completedTaskName={completedTaskName}
                      taskStreak={taskStreak}
                      onCheckTask={onCheckTask}
                      onSelectTask={onSelectTask}
                      onEditTask={onEditTask}
                      onDeleteTask={onDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDayCard;
