
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskCompletionMessage from './TaskCompletionMessage';
import { useToast } from '@/hooks/use-toast';

const TaskList: React.FC = () => {
  const { tasks, toggleTaskCompletion, currentTask, setCurrentTask, timerState, removeTask } = useApp();
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  });

  // Calculate total estimated time and completed time
  const totalEstimatedTime = todaysTasks.reduce((total, task) => total + task.estimatedTime, 0);
  const completedTime = todaysTasks
    .filter(task => task.completed)
    .reduce((total, task) => total + task.estimatedTime, 0);
  
  const progressPercentage = totalEstimatedTime > 0 
    ? Math.min(100, (completedTime / totalEstimatedTime) * 100)
    : 0;

  const handleTaskSelect = (task: typeof tasks[0]) => {
    setCurrentTask(task);
  };

  const handleTaskCheck = (taskId: string) => {
    toggleTaskCompletion(taskId);
    setShowCompletionMessage(taskId);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowCompletionMessage(null);
    }, 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
    });
  }

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-tag priority-high';
      case 'medium': return 'priority-tag priority-medium';
      case 'low': return 'priority-tag priority-low';
      default: return 'priority-tag priority-low';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Tarefas de hoje</h2>
        <Button 
          onClick={() => navigate('/add-task')} 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 hover:bg-secondary"
        >
          <Plus className="h-4 w-4" /> Nova
        </Button>
      </div>
      
      {todaysTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma tarefa para hoje.</p>
          <p className="text-sm">Adicione tarefas para começar.</p>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{formatMinutes(completedTime)} / {formatMinutes(totalEstimatedTime)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.id} className="relative">
                <div className={`task-card ${task.completed ? 'opacity-70' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => handleTaskCheck(task.id)}
                      id={`task-${task.id}`}
                      disabled={timerState === 'work' && currentTask?.id === task.id}
                    />
                    <div>
                      <label 
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.name}
                      </label>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {formatMinutes(task.estimatedTime)}
                        </span>
                        <span className={getPriorityClass(task.priority)}>
                          {task.priority === 'low' ? 'baixa' : task.priority === 'medium' ? 'média' : 'alta'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {!task.completed && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleTaskSelect(task)}
                        disabled={timerState === 'work' && currentTask?.id !== task.id}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showCompletionMessage === task.id && (
                  <TaskCompletionMessage />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
