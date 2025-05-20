import React, { useState, Suspense } from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { useTasks, useTimer } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EditTaskSheet from './EditTaskSheet';
import ErrorBoundary from './ErrorBoundary';
import { useUpcomingTasks } from './upcoming-tasks/useUpcomingTasks';
import UpcomingTasksHeader from './upcoming-tasks/UpcomingTasksHeader';
import UpcomingDaysTabs from './upcoming-tasks/UpcomingDaysTabs';

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const UpcomingTasks: React.FC = () => {
  try {
    const taskContext = useTasks();
    const timerContext = useTimer();
    
    // Use the new function names from the updated TaskContext
    const toggleTaskCompletion = taskContext?.completeTask || (() => {});
    const removeTask = taskContext?.deleteTask || (() => {});
    const setCurrentTask = taskContext?.setCurrentTask || (() => {});
    const timerState = timerContext?.timerState || 'idle';
    
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

    // Clear log to help with debugging
    console.log('Current selected day:', selectedDay);

    const handleDayChange = (day: string) => {
      console.log('Day changed to:', day);
      setSelectedDay(day);
    };

    const handleTaskCheck = (taskId: string) => {
      try {
        if (!upcomingDays) return;
        
        const taskToComplete = upcomingDays
          .flatMap(day => day.tasks)
          .find(t => t.id === taskId);
        
        if (taskToComplete) {
          showTaskCompletionMessage(taskId, taskToComplete.name);
          toggleTaskCompletion(taskId);
          
          toast(
            taskToComplete.completed ? "Tarefa desmarcada" : "Tarefa concluída", 
            { 
              description: taskToComplete.completed 
                ? "Tarefa marcada como pendente" 
                : "Parabéns por completar esta tarefa!" 
            }
          );
        }
      } catch (error) {
        console.error("Error handling task check:", error);
      }
    };

    const handleTaskSelect = (task: Task) => {
      try {
        setCurrentTask(task);
        toast("Tarefa selecionada", { description: `"${task.name}" foi selecionada para o timer.` });
        navigate('/');
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
        toast("Tarefa removida", { description: "A tarefa foi removida com sucesso." });
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const handleAddTask = (date: string) => {
      navigate('/add-task', { state: { selectedDate: date } });
    };

    // Show loading state if data isn't ready
    if (!upcomingDays) {
      return <LoadingFallback />;
    }
    
    return (
      <div className="space-y-4 py-2">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <UpcomingTasksHeader onAddTask={handleAddTask} selectedDay={selectedDay} />
            
            <div className="max-w-full overflow-hidden">
              <UpcomingDaysTabs
                days={upcomingDays}
                selectedDay={selectedDay}
                timerState={timerState}
                currentTask={null}
                showCompletionMessage={showCompletionMessage}
                completedTaskName={completedTaskName}
                taskStreak={taskStreak}
                onDayChange={handleDayChange}
                onAddTask={handleAddTask}
                onCheckTask={handleTaskCheck}
                onSelectTask={handleTaskSelect}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>

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
