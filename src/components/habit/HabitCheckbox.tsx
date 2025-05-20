
import React from 'react';
import { useUser } from '@/contexts/user/UserContext';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface HabitCheckboxProps {
  habitId?: string; // Added habitId as an optional prop
  isCompleted: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  completionPoints?: number;
  name?: string; // Added name as an optional prop
  currentStreak?: number; // Added currentStreak as an optional prop
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  isCompleted,
  onToggle,
  size = 'md',
  color = '#4F46E5',
  disabled = false,
  completionPoints = 5,
  // We don't need to destructure the other props as they're not used directly
}) => {
  const { addPoints } = useUser();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = async () => {
    if (disabled) return;
    
    onToggle();
    
    // Add points when habit is completed, subtract when unchecked
    if (!isCompleted) {
      await addPoints(completionPoints);
    }
  };

  return (
    <Checkbox
      checked={isCompleted}
      onCheckedChange={handleToggle}
      disabled={disabled}
      className={cn(
        sizeClasses[size],
        "rounded-full transition-all duration-300",
        isCompleted && "animate-pulse",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        backgroundColor: isCompleted ? color : 'transparent',
        borderColor: color
      }}
    />
  );
};

export default HabitCheckbox;
