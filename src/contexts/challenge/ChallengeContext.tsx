
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, ChallengeParticipant } from './challengeTypes';
import { 
  fetchChallenges, 
  generateChallenge, 
  updateChallenge,
  deleteChallenge
} from './services/challengeService';
import { 
  joinChallenge, 
  updateChallengeProgress, 
  completeChallenge, 
  leaveChallenge 
} from './services/challengeProgressService';

interface ChallengeContextType {
  challenges: Challenge[];
  loadingChallenges: boolean;
  userParticipation: Record<string, ChallengeParticipant | undefined>;
  createChallenge: (challenge: Partial<Challenge>) => Promise<Challenge | null>;
  updateChallengeData: (challengeId: string, updates: Partial<Challenge>) => Promise<boolean>;
  removeChallenge: (challengeId: string) => Promise<boolean>;
  joinUserToChallenge: (challengeId: string) => Promise<boolean>;
  leaveUserFromChallenge: (challengeId: string) => Promise<boolean>;
  updateProgress: (challengeId: string, progress: number) => Promise<boolean>;
  markChallengeComplete: (challengeId: string, challenge: Challenge) => Promise<boolean>;
  refreshChallenges: () => Promise<void>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [userParticipation, setUserParticipation] = useState<Record<string, ChallengeParticipant | undefined>>({});
  
  const { user } = useAuth();

  // Load challenges from Supabase
  const loadChallenges = async () => {
    if (!user?.id) {
      setChallenges([]);
      setLoadingChallenges(false);
      return;
    }

    setLoadingChallenges(true);
    try {
      const fetchedChallenges = await fetchChallenges(user.id);
      setChallenges(fetchedChallenges);
      
      // Extract user participation
      const participationMap: Record<string, ChallengeParticipant | undefined> = {};
      fetchedChallenges.forEach(challenge => {
        if (challenge.challenge_participants) {
          const userParticipant = challenge.challenge_participants.find(
            p => p.user_id === user.id
          );
          if (userParticipant) {
            participationMap[challenge.id] = userParticipant;
          }
        }
      });
      setUserParticipation(participationMap);
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setLoadingChallenges(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    // Initial load
    loadChallenges();

    // Subscribe to changes
    const channel = supabase
      .channel('public:challenge-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'shared_challenges'
        },
        () => {
          loadChallenges();
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'challenge_participants'
        },
        () => {
          loadChallenges();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Create new challenge
  const createChallenge = async (challengeData: Partial<Challenge>) => {
    if (!user?.id) return null;
    
    const newChallenge = await generateChallenge({
      ...challengeData,
      creator_id: user.id
    });
    
    if (newChallenge) {
      // Automatically join the user to their own challenge
      await joinChallenge(newChallenge.id, user.id);
      await loadChallenges();
    }
    
    return newChallenge;
  };

  // Update challenge
  const updateChallengeData = async (challengeId: string, updates: Partial<Challenge>) => {
    if (!user?.id) return false;
    
    const result = await updateChallenge(challengeId, updates);
    
    if (result) {
      await loadChallenges();
    }
    
    return result;
  };

  // Delete challenge
  const removeChallenge = async (challengeId: string) => {
    if (!user?.id) return false;
    
    const result = await deleteChallenge(challengeId, user.id);
    
    if (result) {
      setChallenges(prevChallenges => 
        prevChallenges.filter(challenge => challenge.id !== challengeId)
      );
    }
    
    return result;
  };

  // Join challenge
  const joinUserToChallenge = async (challengeId: string) => {
    if (!user?.id) return false;
    
    const result = await joinChallenge(challengeId, user.id);
    
    if (result) {
      await loadChallenges();
    }
    
    return result;
  };

  // Leave challenge
  const leaveUserFromChallenge = async (challengeId: string) => {
    if (!user?.id) return false;
    
    const result = await leaveChallenge(challengeId, user.id);
    
    if (result) {
      // Remove participation locally for immediate UI update
      setUserParticipation(prev => {
        const updated = { ...prev };
        delete updated[challengeId];
        return updated;
      });
      
      await loadChallenges();
    }
    
    return result;
  };

  // Update challenge progress
  const updateProgress = async (challengeId: string, progress: number) => {
    if (!user?.id) return false;
    
    const result = await updateChallengeProgress(challengeId, user.id, progress);
    
    if (result) {
      // Update local state for immediate UI update
      setUserParticipation(prev => ({
        ...prev,
        [challengeId]: {
          ...prev[challengeId],
          progress
        } as ChallengeParticipant
      }));
      
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge && progress >= challenge.goal) {
        await markChallengeComplete(challengeId, challenge);
      }
    }
    
    return result;
  };

  // Complete challenge
  const markChallengeComplete = async (challengeId: string, challenge: Challenge) => {
    if (!user?.id) return false;
    
    const result = await completeChallenge(challengeId, user.id, challenge);
    
    if (result) {
      // Update local state for immediate UI update
      setUserParticipation(prev => ({
        ...prev,
        [challengeId]: {
          ...prev[challengeId],
          status: 'completed',
          progress: challenge.goal
        } as ChallengeParticipant
      }));
      
      await loadChallenges();
    }
    
    return result;
  };

  // Refresh challenges
  const refreshChallenges = async () => {
    await loadChallenges();
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        loadingChallenges,
        userParticipation,
        createChallenge,
        updateChallengeData,
        removeChallenge,
        joinUserToChallenge,
        leaveUserFromChallenge,
        updateProgress,
        markChallengeComplete,
        refreshChallenges
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
