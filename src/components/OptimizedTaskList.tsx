import React, { useState, useEffect } from 'react';
import { useTask, useAuth, useTimer } from '../contexts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import EditTaskSheet from './EditTaskSheet';
import { Task } from '../contexts/task/taskTypes';
import CompletionPathIndicator from './CompletionPathIndicator';
import TaskListHeader from './TaskListHeader';
import EmptyTasksList from './EmptyTasksList';
import TaskProgress from './TaskProgress';
import TaskItem from './TaskItem';
import VirtualizedTaskList from './VirtualizedTaskList';
import { checkOnlineStatus } from '../utils/offlineSupport';

const OptimizedTaskList: React.FC = () => {
  const { tasks, toggleTaskCompletion, currentTask, setCurrentTask, removeTask } = useTask();
  const { isAuthenticated } = useAuth();
  const { timerState } = useTimer();
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(checkOnlineStatus());
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(checkOnlineStatus());
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
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

  const handleTaskSelect = (task: Task) => {
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

  // Show offline warning if needed
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "Você está offline",
        description: "Algumas funcionalidades podem estar limitadas até que sua conexão seja restaurada.",
        duration: 5000,
      });
    }
  }, [isOnline]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-4">Faça login para visualizar e gerenciar suas tarefas</p>
        <Button onClick={() => navigate('/login')}>Fazer Login</Button>
      </div>
    );
  }
  
  // Render task item for virtualized list
  const renderTaskItem = (task: Task, index: number) => (
    <TaskItem
      key={task.id}
      task={task}
      currentTask={currentTask}
      timerState={timerState}
      showCompletionMessage={showCompletionMessage}
      completedTaskName={completedTaskName}
      taskStreak={taskStreak}
      onCheckTask={handleTaskCheck}
      onSelectTask={handleTaskSelect}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
    />
  );
  
  return (
    <div>
      <TaskListHeader />
      
      {!isOnline && (
        <div className="mb-4 px-3 py-2 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200 text-sm">
          Modo offline. Suas alterações serão sincronizadas quando a conexão for restabelecida.
        </div>
      )}
      
      {sortedTasks.length === 0 ? (
        <EmptyTasksList />
      ) : (
        <>
          {/* Completion Path Indicator */}
          <CompletionPathIndicator 
            remainingTime={remainingTime} 
            totalEstimatedTime={totalEstimatedTime}
            completedTime={completedTime}
          />
          
          <TaskProgress 
            completedTime={completedTime} 
            totalEstimatedTime={totalEstimatedTime} 
          />
          
          {sortedTasks.length > 20 ? (
            <VirtualizedTaskList
              tasks={sortedTasks}
              itemHeight={90} // Adjust based on your TaskItem height
              windowHeight={500} // Adjust based on your desired view height
              renderItem={renderTaskItem}
              className="space-y-3"
            />
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => renderTaskItem(task, 0))}
            </div>
          )}
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

export default OptimizedTaskList;
