
import React from 'react';
import { Award } from 'lucide-react';

interface AchievementBadge {
  icon: React.ReactNode;
  label: string;
}

interface HabitAchievementBadgeProps {
  streak: number;
}

const HabitAchievementBadge: React.FC<HabitAchievementBadgeProps> = ({ streak }) => {
  // Get achievement badge based on streak
  const getAchievementBadge = (streak: number): AchievementBadge | null => {
    if (streak >= 100) return { icon: <Award className="h-5 w-5 text-yellow-500" />, label: "Mestre" };
    if (streak >= 30) return { icon: <Award className="h-5 w-5 text-orange-500" />, label: "Experiente" };
    if (streak >= 7) return { icon: <Award className="h-5 w-5 text-blue-500" />, label: "Iniciante" };
    return null;
  };

  const achievement = getAchievementBadge(streak);
  
  if (!achievement) return null;
  
  return (
    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full text-xs text-yellow-700">
      {achievement.icon}
      <span>{achievement.label}</span>
    </div>
  );
};

export default HabitAchievementBadge;
