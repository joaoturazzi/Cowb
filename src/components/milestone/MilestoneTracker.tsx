
import React, { useEffect, useState } from 'react';
import { useTask, useAuth } from '@/contexts';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star } from 'lucide-react';
import ConfettiCelebration from '../animations/ConfettiCelebration';
import './MilestoneTracker.css';

interface MilestoneAchievement {
  id: string;
  name: string;
  description: string;
  milestone: number;
  achieved: boolean;
  achievedAt?: Date;
  icon: 'trophy' | 'award' | 'star';
}

const MilestoneTracker: React.FC = () => {
  const { tasks } = useTask();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentMilestone, setRecentMilestone] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<MilestoneAchievement[]>([
    {
      id: 'first-10',
      name: 'Primeiros Passos',
      description: 'Complete 10 tarefas',
      milestone: 10,
      achieved: false,
      icon: 'star'
    },
    {
      id: 'half-100',
      name: 'Meio Caminho',
      description: 'Complete 50 tarefas',
      milestone: 50,
      achieved: false,
      icon: 'award'
    },
    {
      id: 'century',
      name: 'Centenário',
      description: 'Complete 100 tarefas',
      milestone: 100,
      achieved: false,
      icon: 'trophy'
    }
  ]);

  // Listen for custom milestone events
  useEffect(() => {
    const handleMilestoneReached = (event: CustomEvent) => {
      const { milestone } = event.detail;
      setRecentMilestone(milestone);
      setShowConfetti(true);
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
        setRecentMilestone(null);
      }, 6000);
    };

    window.addEventListener('milestone-reached' as any, handleMilestoneReached as EventListener);
    
    return () => {
      window.removeEventListener('milestone-reached' as any, handleMilestoneReached as EventListener);
    };
  }, []);

  // Track achievements
  useEffect(() => {
    if (!user) return;
    
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // Load previously saved achievements
    const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
    let currentAchievements = achievements;
    
    if (savedAchievements) {
      currentAchievements = JSON.parse(savedAchievements);
      setAchievements(currentAchievements);
    }
    
    // Check for new achievements
    const updatedAchievements = currentAchievements.map(achievement => {
      if (!achievement.achieved && completedTasks >= achievement.milestone) {
        return { 
          ...achievement, 
          achieved: true,
          achievedAt: new Date()
        };
      }
      return achievement;
    });
    
    // Save updated achievements
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(currentAchievements)) {
      setAchievements(updatedAchievements);
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(updatedAchievements));
    }
  }, [tasks, user]);

  // Render icon based on type
  const renderIcon = (type: 'trophy' | 'award' | 'star') => {
    switch (type) {
      case 'trophy': return <Trophy className="h-4 w-4 mr-1" />;
      case 'award': return <Award className="h-4 w-4 mr-1" />;
      case 'star': return <Star className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <>
      <ConfettiCelebration show={showConfetti} milestone={recentMilestone || undefined} />
      
      <div className="milestones-container">
        <h3 className="milestones-title">Conquistas</h3>
        
        <div className="milestones-list">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`milestone-item ${achievement.achieved ? 'achieved' : 'locked'}`}
            >
              <div className="milestone-icon">
                {renderIcon(achievement.icon)}
              </div>
              <div className="milestone-details">
                <div className="milestone-name">{achievement.name}</div>
                <div className="milestone-description">{achievement.description}</div>
              </div>
              <Badge variant={achievement.achieved ? "default" : "outline"} className="milestone-badge">
                {achievement.achieved ? 'Concluído' : 'Bloqueado'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MilestoneTracker;
