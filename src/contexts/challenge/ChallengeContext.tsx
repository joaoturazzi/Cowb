
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useTask } from '@/contexts';
import { sonnerToast as toast } from '@/components/ui';
import { Challenge, ChallengeContextType, ChallengeType, UserProgress } from './challengeTypes';
import { generateChallenge } from './challengeGenerator';

const defaultContextValue: ChallengeContextType = {
  challenges: [],
  activeChallenge: null,
  dailyChallenges: [],
  weeklyChallenges: [],
  surpriseChallenges: [],
  completedChallenges: 0,
  updateChallengeProgress: () => {},
  completeChallenge: () => {},
  generateSurpriseChallenge: () => {},
};

export const ChallengeContext = createContext<ChallengeContextType>(defaultContextValue);

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { tasks } = useTask();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalTasksCompleted: 0,
    highPriorityTasksCompleted: 0,
    streakDays: 0,
    points: 0,
    level: 1
  });

  // Filter challenges by type
  const dailyChallenges = challenges.filter(c => c.type === 'daily' && c.status !== 'completed');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly' && c.status !== 'completed');
  const surpriseChallenges = challenges.filter(c => c.type === 'surprise' && c.status !== 'completed');
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  
  // Current active challenge (if any)
  const activeChallenge = challenges.find(c => c.status === 'in-progress') || null;

  useEffect(() => {
    // Initialize challenges if user is authenticated
    if (user) {
      // Load challenges from localStorage for now (in a real app, these would come from a database)
      const savedChallenges = localStorage.getItem(`challenges_${user.id}`);
      
      if (savedChallenges) {
        setChallenges(JSON.parse(savedChallenges));
      } else {
        // Generate initial challenges if none exist
        const initialChallenges: Challenge[] = [
          generateChallenge('daily'),
          generateChallenge('daily'),
          generateChallenge('weekly'),
          generateChallenge('weekly'),
        ];
        setChallenges(initialChallenges);
        localStorage.setItem(`challenges_${user.id}`, JSON.stringify(initialChallenges));
      }
      
      // Load user progress
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  // Update challenges based on task completion
  useEffect(() => {
    if (!user) return;
    
    // Calculate completed tasks for progress tracking
    const completedTasks = tasks.filter(task => task.completed);
    const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high');
    
    // Update user progress
    const newProgress = {
      ...userProgress,
      totalTasksCompleted: completedTasks.length,
      highPriorityTasksCompleted: highPriorityCompleted.length
    };
    
    setUserProgress(newProgress);
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
    
    // Check for challenge progress updates
    updateChallengesProgress(completedTasks.length, highPriorityCompleted.length);
    
  }, [tasks, user]);

  // Check for milestone achievements
  useEffect(() => {
    const { totalTasksCompleted } = userProgress;
    
    // Check for milestone achievements (10th, 50th, 100th task)
    if (totalTasksCompleted === 10 || totalTasksCompleted === 50 || totalTasksCompleted === 100) {
      showMilestoneAchievement(totalTasksCompleted);
    }
  }, [userProgress.totalTasksCompleted]);

  const updateChallengesProgress = (totalCompleted: number, highPriorityCompleted: number) => {
    // Update challenges based on task statistics
    const updatedChallenges = challenges.map(challenge => {
      // Update specific challenge progress based on its criteria
      if (challenge.status === 'in-progress') {
        let updatedProgress = challenge.progress;
        
        // Example: Update high priority task challenge
        if (challenge.title.includes('alta prioridade')) {
          updatedProgress = highPriorityCompleted;
        } 
        // Example: Update total tasks challenge
        else if (challenge.title.includes('Complete')) {
          updatedProgress = totalCompleted % challenge.goal;
        }
        
        // Check if challenge is completed
        if (updatedProgress >= challenge.goal) {
          return {
            ...challenge, 
            progress: challenge.goal, 
            status: 'completed' as const
          };
        }
        
        return { ...challenge, progress: updatedProgress };
      }
      
      return challenge;
    });
    
    setChallenges(updatedChallenges);
    if (user) {
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(updatedChallenges));
    }
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const newProgress = challenge.progress + progress;
        const isCompleted = newProgress >= challenge.goal;
        
        return {
          ...challenge,
          progress: Math.min(newProgress, challenge.goal),
          status: isCompleted ? 'completed' as const : challenge.status
        };
      }
      return challenge;
    });
    
    setChallenges(updatedChallenges);
    if (user) {
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(updatedChallenges));
    }
    
    // Show toast if a challenge was completed
    const completedChallenge = updatedChallenges.find(c => 
      c.id === challengeId && c.status === 'completed' && 
      challenges.find(orig => orig.id === challengeId)?.status !== 'completed'
    );
    
    if (completedChallenge) {
      toast.success("Desafio Concluído!", {
        description: `Você completou: ${completedChallenge.title}`,
      });
    }
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Mark challenge as completed
    updateChallengeProgress(challengeId, challenge.goal - challenge.progress);
    
    // Award points
    const pointsGained = challenge.type === 'daily' ? 50 : 
                         challenge.type === 'weekly' ? 150 : 100;
                         
    setUserProgress(prev => ({
      ...prev,
      points: prev.points + pointsGained
    }));
    
    // Show completion notification with confetti
    toast.success("Desafio Concluído!", {
      description: `Você ganhou ${pointsGained} pontos!`,
    });
  };

  const generateSurpriseChallenge = () => {
    // Only allow a maximum of 3 active surprise challenges
    if (surpriseChallenges.length >= 3) return;
    
    const newChallenge = generateChallenge('surprise');
    const updatedChallenges = [...challenges, newChallenge];
    
    setChallenges(updatedChallenges);
    if (user) {
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(updatedChallenges));
    }
    
    // Notify the user about the new challenge
    toast("Novo Desafio Surpresa!", {
      description: newChallenge.title,
    });
  };

  const showMilestoneAchievement = (milestone: number) => {
    toast.success(`Conquista Desbloqueada: ${milestone}ª Tarefa!`, {
      description: "Continue progredindo para desbloquear mais conquistas!",
    });
    
    // Dispatch custom event for confetti animation
    const event = new CustomEvent('milestone-reached', { detail: { milestone } });
    window.dispatchEvent(event);
  };

  return (
    <ChallengeContext.Provider value={{
      challenges,
      activeChallenge,
      dailyChallenges,
      weeklyChallenges,
      surpriseChallenges,
      completedChallenges,
      updateChallengeProgress,
      completeChallenge,
      generateSurpriseChallenge
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};
