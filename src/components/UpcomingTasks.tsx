
import React, { useState, useEffect } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/contexts/task/taskTypes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaskItem from './TaskItem';
import { useTask, useTimer } from '@/contexts';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import EditTaskSheet from './EditTaskSheet';

interface DayTasks {
  date: Date;
  formattedDate: string;
  tasks: Task[];
  isEmpty: boolean;
}

const UpcomingTasks: React.FC = () => {
  const { tasks, toggleTaskCompletion, removeTask, setCurrentTask } = useTask();
  const { timerState } = useTimer();
  const [upcomingDays, setUpcomingDays] = useState<DayTasks[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [completedTaskName, setCompletedTaskName] = useState<string>('');
  const [taskStreak, setTaskStreak] = useState<number>(0);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Prepare the 5-day task view
  useEffect(() => {
    const days: DayTasks[] = [];
    const today = new Date();
    
    // Create an array for today + next 4 days
    for (let i = 0; i < 5; i++) {
      const currentDate = addDays(today, i);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      
      days.push({
        date: currentDate,
        formattedDate,
        tasks: [],
        isEmpty: true
      });
    }
    
    // Sort tasks into the appropriate days
    tasks.forEach(task => {
      if (task.target_date) {
        const dayIndex = days.findIndex(day => 
          day.formattedDate === task.target_date
        );
        
        if (dayIndex !== -1) {
          days[dayIndex].tasks.push(task);
          days[dayIndex].isEmpty = false;
        }
      }
    });
    
    // Sort tasks by priority for each day
    days.forEach(day => {
      day.tasks.sort((a, b) => {
        // First, sort by completion status
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        // Then sort by priority
        const priorityValue = { high: 3, medium: 2, low: 1 };
        return priorityValue[b.priority as keyof typeof priorityValue] - 
               priorityValue[a.priority as keyof typeof priorityValue];
      });
    });
    
    setUpcomingDays(days);
  }, [tasks]);

  const handleTaskCheck = (taskId: string) => {
    const taskToComplete = tasks.find(t => t.id === taskId);
    
    if (taskToComplete) {
      // Store task name for contextual message
      setCompletedTaskName(taskToComplete.name);
      
      // Toggle completion status
      toggleTaskCompletion(taskId);
      
      // Show completion message
      setShowCompletionMessage(taskId);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowCompletionMessage(null);
      }, 3000);
      
      toast({
        title: "Status atualizado",
        description: taskToComplete.completed ? "Tarefa marcada como pendente" : "Tarefa concluída com sucesso",
      });
    }
  };

  const handleTaskSelect = (task: Task) => {
    setCurrentTask(task);
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

  // Get the selected day's tasks
  const selectedDayTasks = upcomingDays.find(day => day.formattedDate === selectedDay)?.tasks || [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tarefas dos Próximos Dias</h2>
        <Button 
          onClick={() => handleAddTask(selectedDay)}
          size="sm"
        >
          Nova Tarefa
        </Button>
      </div>
      
      <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="grid grid-cols-5 mb-4">
          {upcomingDays.map((day) => (
            <TabsTrigger key={day.formattedDate} value={day.formattedDate} className="text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium">
                  {format(day.date, 'EEE', { locale: ptBR })}
                </span>
                <span className="text-sm">
                  {format(day.date, 'd MMM', { locale: ptBR })}
                </span>
                {!day.isEmpty && (
                  <span className="mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {day.tasks.filter(t => !t.completed).length}
                  </span>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {upcomingDays.map((day) => (
          <TabsContent key={day.formattedDate} value={day.formattedDate}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(day.date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.isEmpty ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Nenhuma tarefa para este dia</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleAddTask(day.formattedDate)}
                    >
                      Adicionar Tarefa <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {day.tasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        currentTask={null}
                        timerState={timerState}
                        showCompletionMessage={showCompletionMessage}
                        completedTaskName={completedTaskName}
                        taskStreak={taskStreak}
                        onCheckTask={handleTaskCheck}
                        onSelectTask={handleTaskSelect}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

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
