
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Habit } from '@/contexts/habit/habitTypes';
import HabitCard from '../components/habit/HabitCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import HabitForm from '../components/habit/HabitForm';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const Habits = () => {
  const { habits, isLoading } = useHabit();
  const { isAuthenticated } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<Habit | undefined>(undefined);
  
  const handleAddHabit = () => {
    setCurrentHabit(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditHabit = (habit: Habit) => {
    setCurrentHabit(habit);
    setIsFormOpen(true);
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };
  
  const completedHabitsToday = habits.filter(habit => habit.completedToday).length;
  const completionPercentage = habits.length > 0 
    ? Math.round((completedHabitsToday / habits.length) * 100) 
    : 0;
  
  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Hábitos</h1>
        <Button onClick={handleAddHabit} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Hábito
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {isAuthenticated && habits.length > 0 ? (
            <>
              <Card className="mb-6 p-4">
                <h2 className="text-sm font-medium mb-2">Progresso de hoje</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {completedHabitsToday} de {habits.length} hábitos concluídos
                  </span>
                  <span className="text-sm font-medium">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </Card>
              
              <div className="grid grid-cols-1 gap-4">
                {habits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onEdit={handleEditHabit}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">Sem hábitos ainda</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Crie hábitos para acompanhar suas rotinas diárias e desenvolver consistência nas suas atividades.
              </p>
              <Button onClick={handleAddHabit}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar meu primeiro hábito
              </Button>
            </div>
          )}
        </>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentHabit ? 'Editar hábito' : 'Criar novo hábito'}
            </DialogTitle>
          </DialogHeader>
          <HabitForm 
            onSuccess={handleFormSuccess} 
            initialData={currentHabit}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Habits;
