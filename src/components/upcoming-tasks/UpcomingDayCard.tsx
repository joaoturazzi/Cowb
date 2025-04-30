
import React from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskItem from '../TaskItem';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Nenhuma tarefa para este dia</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => onAddTask(formattedDate)}
            >
              Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
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
      </CardContent>
    </Card>
  );
};

export default UpcomingDayCard;
