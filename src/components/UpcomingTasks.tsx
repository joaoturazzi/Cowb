
import React, { useState } from 'react';
import { Task } from '@/contexts/task/taskTypes';
import { useTask, useTimer } from '@/contexts';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import EditTaskSheet from './EditTaskSheet';
import { useUpcomingTasks } from './upcoming-tasks/useUpcomingTasks';
import UpcomingTasksHeader from './upcoming-tasks/UpcomingTasksHeader';
import UpcomingDaysTabs from './upcoming-tasks/UpcomingDaysTabs';

const UpcomingTasks: React.FC = () => {
  const { toggleTaskCompletion, removeTask, setCurrentTask } = useTask();
  const { timerState } = useTimer();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleTaskCheck = (taskId: string) => {
    const taskToComplete = upcomingDays
      .flatMap(day => day.tasks)
      .find(t => t.id === taskId);
    
    if (taskToComplete) {
      // Store task name for contextual message
      showTaskCompletionMessage(taskId, taskToComplete.name);
      
      // Toggle completion status
      toggleTaskCompletion(taskId);
      
      toast({
        title: taskToComplete.completed ? "Tarefa desmarcada" : "Tarefa concluída",
        description: taskToComplete.completed 
          ? "Tarefa marcada como pendente" 
          : "Parabéns por completar esta tarefa!",
        variant: "default",
      });
    }
  };

  const handleTaskSelect = (task: Task) => {
    setCurrentTask(task);
    toast({
      title: "Tarefa selecionada",
      description: `"${task.name}" foi selecionada para o timer.`,
    });
    navigate('/app'); // Navigate to the main page to start the timer
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
    });
  };

  const handleAddTask = (date: string) => {
    // Navigate to add task page with the selected date
    navigate('/add-task', { state: { selectedDate: date } });
  };
  
  return (
    <div className="space-y-6 py-4">
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
    </div>
  );
};

export default UpcomingTasks;
