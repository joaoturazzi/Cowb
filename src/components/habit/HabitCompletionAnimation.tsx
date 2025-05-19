
import React from 'react';
import { Award } from 'lucide-react';
import './HabitAnimations.css';

interface HabitCompletionAnimationProps {
  show: boolean;
  streak: number;
}

const HabitCompletionAnimation: React.FC<HabitCompletionAnimationProps> = ({ show, streak }) => {
  // Only show animation on milestone completions (multiples of 7)
  if (!show || streak === 0 || streak % 7 !== 0) return null;
  
  return (
    <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center animate-pulse">
      <div className="animate-bounce">
        <Award className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
      </div>
    </div>
  );
};

export default HabitCompletionAnimation;
