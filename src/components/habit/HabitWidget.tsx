
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card } from '@/components/ui/card';
import {
  EmptyHabitWidget,
  HabitWidgetHeader,
  HabitWidgetProgress,
  HabitsList,
  CompletionMessage,
  LoadingHabitWidget
} from './widget';

const HabitWidget = () => {
  const { habits, isLoading, toggleHabitCompletion } = useHabit();
  
  if (isLoading) {
    return <LoadingHabitWidget />;
  }
  
  // Filter to only active habits
  const activeHabits = habits.filter(h => h.active);
  
  if (activeHabits.length === 0) {
    return <EmptyHabitWidget />;
  }
  
  const completedToday = activeHabits.filter(h => h.completedToday).length;
  const completion = activeHabits.length > 0 
    ? Math.round((completedToday / activeHabits.length) * 100) 
    : 0;
  
  return (
    <Card 
      className="p-4 hover:shadow-md transition-all relative overflow-hidden h-full bg-gradient-to-br from-card to-background border-primary/10" 
      role="button" 
      tabIndex={0}
    >
      {/* Background decorative elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <HabitWidgetHeader />
      <HabitWidgetProgress habits={activeHabits} />
      <HabitsList habits={activeHabits} toggleHabitCompletion={toggleHabitCompletion} />
      <CompletionMessage isComplete={completion === 100} />
    </Card>
  );
};

export default HabitWidget;
