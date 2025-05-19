
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Habit } from '@/contexts/habit/habitTypes';
import HabitCard from '../components/habit/HabitCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle2, Loader2, Flame, Award, Calendar } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HabitAchievements from '../components/habit/HabitAchievements';

const Habits = () => {
  const { habits, isLoading } = useHabit();
  const { isAuthenticated } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<Habit | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'list' | 'achievements'>('list');
  
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
  
  // Calculate longest current streak among all habits
  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.currentStreak))
    : 0;

  // Calculate total completed habits
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + (habit.logs?.filter(log => log.completed)?.length || 0), 0
  );
  
  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Hábitos</h1>
        <Button onClick={handleAddHabit}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Hábito
        </Button>
      </div>

      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" onClick={() => setViewMode('list')}>
            <Calendar className="h-4 w-4 mr-2" /> Hábitos
          </TabsTrigger>
          <TabsTrigger value="achievements" onClick={() => setViewMode('achievements')}>
            <Award className="h-4 w-4 mr-2" /> Conquistas
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {viewMode === 'list' && isAuthenticated && habits.length > 0 ? (
            <>
              <Card className="mb-6 p-5 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Progresso de hoje</h2>
                    <p className="text-sm text-muted-foreground">
                      {completedHabitsToday} de {habits.length} hábitos concluídos
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {longestStreak > 0 && (
                      <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">{longestStreak} dias</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{totalCompletions} completados</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progresso</span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
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
          ) : viewMode === 'achievements' ? (
            <HabitAchievements />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-3">Sem hábitos ainda</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Crie hábitos para acompanhar suas rotinas diárias e desenvolver consistência nas suas atividades.
              </p>
              <Button onClick={handleAddHabit} size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Criar meu primeiro hábito
              </Button>
            </div>
          )}
        </>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
