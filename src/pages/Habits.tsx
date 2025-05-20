
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Habit } from '@/contexts/habit/habitTypes';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Calendar, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import HabitForm from '../components/habit/HabitForm';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HabitAchievements from '../components/habit/HabitAchievements';
import HabitsList from '../components/habit/HabitsList';
import EmptyHabitState from '../components/habit/EmptyHabitState';

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
            <HabitsList habits={habits} onEditHabit={handleEditHabit} />
          ) : viewMode === 'achievements' ? (
            <HabitAchievements />
          ) : (
            <EmptyHabitState onAddHabit={handleAddHabit} />
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
