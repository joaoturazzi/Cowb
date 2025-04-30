import React, { useState, useEffect } from 'react';
import { useTask, useAuth, useTimer } from '../contexts';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight, Plus, Trash2, Pencil, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskCompletionMessage from './TaskCompletionMessage';
import { useToast } from '@/hooks/use-toast';
import EditTaskSheet from './EditTaskSheet';
import { Task } from '../contexts/task/taskTypes';
import CompletionPathIndicator from './CompletionPathIndicator';

const TaskList: React.FC = () => {
  const { tasks, toggleTaskCompletion, currentTask, setCurrentTask, removeTask } = useTask();
  const { isAuthenticated } = useAuth();
  const { timerState } = useTimer();
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sort tasks: incomplete tasks first by priority, then completed tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    // Always put completed tasks at the bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // If both are incomplete, sort by priority first
    if (!a.completed && !b.completed) {
      // Sort by priority (high > medium > low)
      const priorityValue = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityValue[b.priority as keyof typeof priorityValue] - 
                           priorityValue[a.priority as keyof typeof priorityValue];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by estimated time
      return a.estimatedTime - b.estimatedTime;
    }
    
    // If both are completed, sort by most recently completed
    return 0;
  });

  // Calculate total estimated time and completed time
  const totalEstimatedTime = tasks.reduce((total, task) => total + task.estimatedTime, 0);
  const completedTime = tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + task.estimatedTime, 0);
  
  const progressPercentage = totalEstimatedTime > 0 
    ? Math.min(100, (completedTime / totalEstimatedTime) * 100)
    : 0;

  // Calculate remaining time for all incomplete tasks
  const remainingTime = tasks
    .filter(task => !task.completed)
    .reduce((total, task) => total + task.estimatedTime, 0);

  // Check for task streak (tasks completed within a 5-minute window)
  useEffect(() => {
    if (lastCompletionTime) {
      const now = Date.now();
      const timeDiff = now - lastCompletionTime;
      
      // If completed within 5 minutes, increase streak
      if (timeDiff <= 5 * 60 * 1000) {
        setTaskStreak(prev => prev + 1);
      } else {
        // Otherwise reset streak
        setTaskStreak(1);
      }
    }
  }, [showCompletionMessage]);

  const handleTaskSelect = (task: typeof tasks[0]) => {
    setCurrentTask(task);
  };

  const handleTaskCheck = (taskId: string) => {
    const taskToComplete = tasks.find(t => t.id === taskId);
    
    if (taskToComplete) {
      // Store task name for contextual message
      setCompletedTaskName(taskToComplete.name);
      
      // Record the completion time for streak tracking
      setLastCompletionTime(Date.now());
      
      // Toggle completion status
      toggleTaskCompletion(taskId);
      
      // Show completion message
      setShowCompletionMessage(taskId);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowCompletionMessage(null);
      }, 3000);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
    });
  }

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
  };

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

  // Get visual style for task card based on priority
  const getTaskCardClass = (task: Task) => {
    if (task.completed) return 'task-card task-completed';
    
    switch (task.priority) {
      case 'high': return 'task-card task-high-priority';
      case 'medium': return 'task-card task-medium-priority';
      case 'low': return 'task-card task-low-priority';
      default: return 'task-card';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">Faça login para visualizar e gerenciar suas tarefas</p>
        <Button onClick={() => navigate('/login')}>Fazer Login</Button>
      </div>
    );
  }
  
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
      
      {sortedTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma tarefa para hoje.</p>
          <p className="text-sm">Adicione tarefas para começar.</p>
        </div>
      ) : (
        <>
          {/* Completion Path Indicator */}
          <CompletionPathIndicator 
            remainingTime={remainingTime} 
            totalEstimatedTime={totalEstimatedTime}
            completedTime={completedTime}
          />
          
          <div className="mb-5">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{formatMinutes(completedTime)} / {formatMinutes(totalEstimatedTime)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <div key={task.id} className="relative">
                <div className={getTaskCardClass(task)}>
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
                        {task.target_date && new Date(task.target_date).toDateString() !== new Date().toDateString() && (
                          <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full">
                            Tarefa redistribuída
                          </span>
                        )}
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
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditTask(task)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleTaskSelect(task)}
                          disabled={timerState === 'work' && currentTask?.id !== task.id}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
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
                  <TaskCompletionMessage 
                    taskName={completedTaskName} 
                    streak={taskStreak} 
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {taskToEdit && (
        <EditTaskSheet 
          task={taskToEdit} 
          isOpen={!!taskToEdit} 
          onClose={() => setTaskToEdit(null)} 
        />
      )}
    </div>
  );
};

export default TaskList;
