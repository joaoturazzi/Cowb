
import React from 'react';
import { HabitWithStats } from '@/contexts/habit/habitTypes';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import './HabitAnimations.css';

// Import refactored components
import HabitCheckbox from './HabitCheckbox';
import HabitActions from './HabitActions';
import HabitStreakIndicator from './HabitStreakIndicator';
import HabitAchievementBadge from './HabitAchievementBadge';
import HabitCompletionCalendar from './HabitCompletionCalendar';
import HabitCompletionAnimation from './HabitCompletionAnimation';

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit: (habit: HabitWithStats) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  // Add a dummy onToggle function since we need to provide it to HabitCheckbox
  const handleToggle = () => {
    console.log('Habit toggled:', habit.name);
    // In a real implementation, this would call a function to toggle the habit completion
  };

  return (
    <Card 
      className="relative overflow-hidden transition-all hover:shadow-md border-l-4 group"
      style={{ borderLeftColor: habit.color }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <HabitCheckbox 
              habitId={habit.id}
              isCompleted={habit.completedToday}
              color={habit.color}
              name={habit.name}
              currentStreak={habit.currentStreak}
              onToggle={handleToggle} // Required prop is now included
            />
            
            <div>
              <h3 className="font-medium">{habit.name}</h3>
              {habit.description && (
                <p className="text-xs text-muted-foreground mt-1">{habit.description}</p>
              )}
            </div>
          </div>

          <HabitActions habit={habit} onEdit={onEdit} />
        </div>

        {/* Streak information */}
        <div className="flex items-center gap-2 mb-3">
          <HabitStreakIndicator streak={habit.currentStreak} />
          <HabitAchievementBadge streak={habit.currentStreak} />

          <div className="ml-auto text-xs text-muted-foreground">
            {Math.round(habit.completionRate)}% nos últimos 30 dias
          </div>
        </div>

        {/* Progress bar */}
        <Progress 
          value={habit.completionRate} 
          className="h-1.5 mb-3" 
        />

        {/* Mini-calendar showing last 7 days */}
        <HabitCompletionCalendar logs={habit.logs} />
        
        {/* Achievement animation overlay - shown when completing a milestone */}
        <HabitCompletionAnimation 
          show={habit.completedToday} 
          streak={habit.currentStreak} 
        />
      </div>
    </Card>
  );
};

export default HabitCard;
