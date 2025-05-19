
import React, { useState, useEffect } from 'react';
import './enhancedAnimations.css';
import { Check, Star, TrendingUp, Zap } from 'lucide-react';

interface EnhancedTaskCompletionProps {
  taskName: string;
  streak?: number;
  priority?: string;
}

const EnhancedTaskCompletion: React.FC<EnhancedTaskCompletionProps> = ({ 
  taskName, 
  streak = 0, 
  priority = 'medium' 
}) => {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    // Set animation class based on streak or priority
    if (streak >= 5) {
      setAnimationClass('explosion-animation');
    } else if (streak >= 3) {
      setAnimationClass('wave-animation');
    } else if (priority === 'high') {
      setAnimationClass('bounce-animation');
    } else {
      setAnimationClass('slide-animation');
    }
    
    // Remove animation class after animation completes
    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [taskName, streak, priority]);

  // Select icon based on streak or priority
  const getIcon = () => {
    if (streak >= 5) return <Zap className="h-6 w-6 text-yellow-400" />;
    if (streak >= 3) return <TrendingUp className="h-6 w-6 text-blue-400" />;
    if (priority === 'high') return <Star className="h-6 w-6 text-purple-400" />;
    return <Check className="h-6 w-6 text-green-400" />;
  };

  return (
    <div className={`enhanced-task-completion ${animationClass}`}>
      <div className="animation-icon">{getIcon()}</div>
      <div className="animation-content">
        <div className="animation-text">{taskName}</div>
        {streak > 1 && (
          <div className="animation-streak">Sequência: {streak}</div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTaskCompletion;
