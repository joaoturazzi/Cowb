
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { useUser } from '@/contexts/user/UserContext';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

interface HabitCheckboxProps {
  habitId: string;
  isCompleted: boolean;
  color: string;
  name: string;
  currentStreak: number;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  habitId,
  isCompleted,
  color,
  name,
  currentStreak,
}) => {
  const { toggleHabitCompletion } = useHabit();
  const { addPoints } = useUser();
  
  const handleToggle = async () => {
    try {
      const success = await toggleHabitCompletion(habitId);
      
      if (success && !isCompleted) {
        // Award points when completing a habit
        // Base points + streak bonus
        const basePoints = 5;
        const streakBonus = Math.min(Math.floor(currentStreak / 7) * 3, 15); // Cap at +15 points
        const totalPoints = basePoints + streakBonus;
        
        // Add points to user profile
        await addPoints(totalPoints);
        
        // Milestone streak message
        if ((currentStreak + 1) % 7 === 0) {
          toast.success(`🔥 ${currentStreak + 1} day streak achieved for "${name}"!`, {
            description: "Keep it up! You're building a great habit."
          });
        }
      }
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      toast.error("Failed to update habit");
    }
  };
  
  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex-none w-5 h-5 rounded-full transition-all relative",
        isCompleted && "scale-110"
      )}
      aria-label={`Mark habit "${name}" as ${isCompleted ? "incomplete" : "complete"}`}
    >
      {isCompleted ? (
        <CheckCircle2 
          className="transition-opacity" 
          style={{ color }} 
          fill={color}
          fillOpacity={0.2}
        />
      ) : (
        <Circle 
          className="text-muted-foreground hover:scale-110 transition-transform" 
        />
      )}
    </button>
  );
};

export default HabitCheckbox;
