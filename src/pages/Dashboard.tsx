
import React from 'react';
import Layout from '../components/Layout';
import { useTasks, useHabit, useTimer } from '@/contexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DigitalClock from '../components/DigitalClock';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const { habits } = useHabit();
  const { completedPomodoros } = useTimer();
  
  const activeHabits = habits.filter(h => h.active);
  const completedHabits = activeHabits.filter(h => h.completedToday);
  const pendingHabits = activeHabits.filter(h => !h.completedToday);
  
  const pendingTasks = tasks.filter(task => !task.completed);
  const todaysTasks = pendingTasks.filter(task => {
    const taskDate = new Date(task.target_date); // Fixed: changed task.date to task.target_date
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="show"
        variants={container}
        className="pb-10"
      >
        <motion.div variants={item}>
          <DigitalClock />
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/2 blur-2xl"></div>
            <CardHeader>
              <CardTitle className="text-xl">Bem-vindo de volta!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Aqui está um resumo da sua atividade:
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{completedPomodoros}</p>
                  <p className="text-xs text-muted-foreground">Pomodoros</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {completedHabits.length}/{activeHabits.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Hábitos</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-500">
                    {tasks.filter(t => t.completed).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Tarefas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Tarefas para hoje</CardTitle>
                  <Link to="/upcoming">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Ver todas <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                {todaysTasks.length > 0 ? (
                  <ul className="space-y-2">
                    {todaysTasks.slice(0, 3).map((task) => (
                      <li key={task.id} className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm truncate">{task.name}</p>
                      </li>
                    ))}
                    {todaysTasks.length > 3 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        +{todaysTasks.length - 3} tarefas restantes
                      </p>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma tarefa para hoje!
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Hábitos pendentes</CardTitle>
                  <Link to="/habits">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      Ver todos <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                {pendingHabits.length > 0 ? (
                  <ul className="space-y-2">
                    {pendingHabits.slice(0, 3).map((habit) => (
                      <li key={habit.id} className="p-2 bg-muted/50 rounded-md flex items-center">
                        <div 
                          className="h-2 w-2 rounded-full mr-2" 
                          style={{ backgroundColor: habit.color }}
                        ></div>
                        <p className="text-sm truncate">{habit.name}</p>
                      </li>
                    ))}
                    {pendingHabits.length > 3 && (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        +{pendingHabits.length - 3} hábitos pendentes
                      </p>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {activeHabits.length > 0 
                      ? "Todos os hábitos foram completados!" 
                      : "Nenhum hábito criado ainda."}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="flex justify-center">
          <Link to="/app">
            <Button size="lg" className="gap-2">
              Ir para o Timer <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
