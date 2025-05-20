
import { useState, useEffect, useCallback } from 'react';
import { Challenge } from './challengeTypes';
import { fetchUserChallenges } from './services/challengeFetchService';
import { useRealtimeChallenges } from './hooks/useRealtimeChallenges';

export const useChallengeData = (userId: string | undefined) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filtered challenge lists
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const surpriseChallenges = challenges.filter(c => c.type === 'surprise');
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;

  const fetchChallenges = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data: challengesData, error } = await fetchUserChallenges(userId);
      
      if (error) {
        console.error('Error in fetchChallenges:', error);
        return;
      }
      
      if (challengesData) {
        setChallenges(challengesData);
        
        // Set active challenge
        const active = challengesData.find(c => 
          c.status === 'in-progress' && 
          (!c.expiresAt || new Date() < new Date(c.expiresAt))
        );
        setActiveChallenge(active || null);
      }
    } catch (error) {
      console.error('Unexpected error in fetchChallenges:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial fetch of challenges
  useEffect(() => {
    if (!userId) {
      setChallenges([]);
      setActiveChallenge(null);
      return;
    }
    
    fetchChallenges();
  }, [userId, fetchChallenges]);
  
  // Set up real-time subscription
  useRealtimeChallenges(userId, fetchChallenges);

  return {
    challenges,
    setChallenges,
    activeChallenge,
    setActiveChallenge,
    dailyChallenges,
    weeklyChallenges,
    surpriseChallenges,
    completedChallenges,
    isLoading,
    fetchChallenges
  };
};

export default useChallengeData;
