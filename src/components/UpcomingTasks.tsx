
import React, { useState, Suspense } from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { useTask, useTimer } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EditTaskSheet from './EditTaskSheet';
import ErrorBoundary from './ErrorBoundary';
import { 
  useUpcomingTasks,
  UpcomingTasksHeader,
  UpcomingDaysTabs
} from './upcoming-tasks';

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const UpcomingTasks: React.FC = () => {
  try {
    const { toggleTaskCompletion, removeTask, setCurrentTask } = useTask();
    const { timerState } = useTimer();
    const navigate = useNavigate();
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    
    const {
      upcomingDays,
      selectedDay,
      setSelectedDay,
      showCompletionMessage,
      completedTaskName,
      taskStreak,
      showTaskCompletionMessage
    } = useUpcomingTasks();

    // Safe toast function using Sonner correctly
    const safeToast = (title: string, description?: string) => {
      try {
        toast(title, { description });
      } catch (error) {
        console.error("Error showing toast:", error);
      }
    };

    const handleTaskCheck = (taskId: string) => {
      try {
        if (!upcomingDays) return;
        
        const taskToComplete = upcomingDays
          .flatMap(day => day.tasks)
          .find(t => t.id === taskId);
        
        if (taskToComplete) {
          // Store task name for contextual message
          showTaskCompletionMessage(taskId, taskToComplete.name);
          
          // Toggle completion status
          toggleTaskCompletion(taskId);
          
          safeToast(
            taskToComplete.completed ? "Tarefa desmarcada" : "Tarefa concluída", 
            taskToComplete.completed 
              ? "Tarefa marcada como pendente" 
              : "Parabéns por completar esta tarefa!"
          );
        }
      } catch (error) {
        console.error("Error handling task check:", error);
      }
    };

    const handleTaskSelect = (task: Task) => {
      try {
        setCurrentTask(task);
        safeToast(
          "Tarefa selecionada", 
          `"${task.name}" foi selecionada para o timer.`
        );
        navigate('/'); // Navigate to the main page to start the timer
      } catch (error) {
        console.error("Error selecting task:", error);
      }
    };

    const handleEditTask = (task: Task) => {
      setTaskToEdit(task);
    };

    const handleDeleteTask = (taskId: string) => {
      try {
        removeTask(taskId);
        safeToast(
          "Tarefa removida", 
          "A tarefa foi removida com sucesso."
        );
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const handleAddTask = (date: string) => {
      // Navigate to add task page with the selected date
      navigate('/add-task', { state: { selectedDate: date } });
    };

    // If upcomingDays is undefined, show loading
    if (!upcomingDays) {
      return <LoadingFallback />;
    }
    
    return (
      <div className="space-y-6 py-4">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <UpcomingTasksHeader onAddTask={handleAddTask} selectedDay={selectedDay} />
            
            <UpcomingDaysTabs
              days={upcomingDays}
              selectedDay={selectedDay}
              timerState={timerState}
              currentTask={null}
              showCompletionMessage={showCompletionMessage}
              completedTaskName={completedTaskName}
              taskStreak={taskStreak}
              onDayChange={setSelectedDay}
              onAddTask={handleAddTask}
              onCheckTask={handleTaskCheck}
              onSelectTask={handleTaskSelect}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />

            {taskToEdit && (
              <EditTaskSheet 
                task={taskToEdit} 
                isOpen={!!taskToEdit} 
                onClose={() => setTaskToEdit(null)} 
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  } catch (error) {
    console.error("Error rendering UpcomingTasks:", error);
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
        <h3 className="text-lg font-medium text-destructive mb-2">Erro ao carregar tarefas</h3>
        <p className="text-sm text-muted-foreground">Não foi possível carregar as tarefas. Por favor, tente novamente.</p>
      </div>
    );
  }
};

export default UpcomingTasks;
