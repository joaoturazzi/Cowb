
import React, { useState, useEffect } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/contexts/task/taskTypes';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaskItem from './TaskItem';
import { useTask } from '@/contexts';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DayTasks {
  date: Date;
  formattedDate: string;
  tasks: Task[];
  isEmpty: boolean;
}

const UpcomingTasks: React.FC = () => {
  const { tasks } = useTask();
  const [upcomingDays, setUpcomingDays] = useState<DayTasks[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const navigate = useNavigate();

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
    
    setUpcomingDays(days);
  }, [tasks]);
  
  // These functions are placeholders to avoid TypeScript errors in TaskItem
  // The actual implementation would be managed by the task context
  const handleCheckTask = () => {};
  const handleSelectTask = () => {};
  const handleEditTask = () => {};
  const handleDeleteTask = () => {};

  // Get the selected day's tasks
  const selectedDayTasks = upcomingDays.find(day => day.formattedDate === selectedDay)?.tasks || [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tarefas dos Próximos Dias</h2>
        <Button 
          onClick={() => navigate('/add-task')}
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
                      onClick={() => navigate('/add-task')}
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
                        timerState=""
                        showCompletionMessage={null}
                        completedTaskName=""
                        taskStreak={0}
                        onCheckTask={handleCheckTask}
                        onSelectTask={handleSelectTask}
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
    </div>
  );
};

export default UpcomingTasks;
