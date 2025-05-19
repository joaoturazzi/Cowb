
import { useState, useEffect } from 'react';
import { Challenge, ChallengeStatus } from './challengeTypes';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserChallenges } from './challengeService';

export const useChallengeData = (userId: string | undefined) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filtered challenge lists
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const surpriseChallenges = challenges.filter(c => c.type === 'surprise');
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;

  const fetchChallenges = async () => {
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
  };

  // Set up subscription for real-time updates
  useEffect(() => {
    if (!userId) {
      setChallenges([]);
      setActiveChallenge(null);
      return;
    }
    
    fetchChallenges();
    
    // Set up subscription for real-time updates
    const challengeSubscription = supabase
      .channel('challenge-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'shared_challenges',
          filter: `creator_id=eq.${userId}`
        }, 
        () => {
          fetchChallenges();
        })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'challenge_participants',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          fetchChallenges();
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(challengeSubscription);
    };
  }, [userId]);

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
