
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem from '../TaskItem';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
      "border shadow-md transition-all overflow-hidden",
      isToday ? "border-primary/30 bg-card/70" : ""
    )}>
      <CardHeader className={cn(
        "bg-muted/30 pb-4",
        isToday ? "bg-primary/5" : ""
      )}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-md",
              isToday ? "bg-primary/20" : "bg-muted/50"
            )}>
              <Calendar className={cn(
                "h-5 w-5", 
                isToday ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <span className={isToday ? "text-primary font-semibold" : ""}>
              {formattedDisplayDate}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 flex gap-1 ml-2"
            onClick={() => onAddTask(formattedDate)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 md:p-6">
        {isEmpty ? (
          <div className="text-center py-12 px-4">
            <div className="bg-muted/30 rounded-full w-16 h-16 mb-4 flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <p className="text-muted-foreground mb-5">Você não tem tarefas para este dia</p>
            <Button 
              variant="default" 
              className="mt-2 bg-primary hover:bg-primary/90 shadow-sm"
              onClick={() => onAddTask(formattedDate)}
            >
              Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Tarefas pendentes ({pendingTasks.length})
                  </h3>
                  {isToday && (
                    <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                      Hoje
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
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
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-t pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Tarefas concluídas ({completedTasks.length})
                  </h3>
                  {completedTasks.length > 0 && pendingTasks.length === 0 && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                      Tudo concluído
                    </span>
                  )}
                </div>
                
                <div className="opacity-70 space-y-2">
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

            {pendingTasks.length === 0 && completedTasks.length === 0 && (
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertTitle>Nenhuma tarefa</AlertTitle>
                <AlertDescription>
                  Você não tem tarefas para este dia. Adicione uma nova tarefa para começar.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDayCard;
