
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle real-time subscriptions for challenge data
 * @param userId The current user ID
 * @param onChallengeChange Callback to be executed when challenge data changes
 */
export const useRealtimeChallenges = (
  userId: string | undefined,
  onChallengeChange: () => void
) => {
  useEffect(() => {
    if (!userId) return;
    
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
          onChallengeChange();
        })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'challenge_participants',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          onChallengeChange();
        })
      .subscribe();
      
    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      supabase.removeChannel(challengeSubscription);
    };
  }, [userId, onChallengeChange]);
};

export default useRealtimeChallenges;
