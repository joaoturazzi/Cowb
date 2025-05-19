
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, ChallengeContextType, ChallengeStatus, ChallengeType, ChallengeReward } from './challengeTypes';
import { useAuth } from '../AuthContext';
import { sonnerToast as toast } from '@/components/ui';
import { generateChallenge, calculateExpirationDate } from './challengeGenerator';

const defaultChallengeContext: ChallengeContextType = {
  challenges: [],
  activeChallenge: null,
  dailyChallenges: [],
  weeklyChallenges: [],
  surpriseChallenges: [],
  completedChallenges: 0,
  updateChallengeProgress: () => Promise.resolve(),
  completeChallenge: () => Promise.resolve(),
  generateSurpriseChallenge: () => Promise.resolve()
};

const ChallengeContext = createContext<ChallengeContextType>(defaultChallengeContext);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filtered challenge lists
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const surpriseChallenges = challenges.filter(c => c.type === 'surprise');
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  
  // Fetch challenges when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
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
          filter: `creator_id=eq.${user.id}`
        }, 
        () => {
          fetchChallenges();
        })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'challenge_participants',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchChallenges();
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(challengeSubscription);
    };
  }, [isAuthenticated, user]);

  const fetchChallenges = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch challenges created by the user
      const { data: createdChallenges, error: createdError } = await supabase
        .from('shared_challenges')
        .select('*')
        .eq('creator_id', user.id);
        
      // Fetch challenges where user is a participant
      const { data: participatingData, error: participatingError } = await supabase
        .from('challenge_participants')
        .select(`
          challenge_id,
          status,
          progress,
          shared_challenges (*)
        `)
        .eq('user_id', user.id);
        
      if (createdError || participatingError) {
        console.error('Error fetching challenges:', createdError || participatingError);
        toast.error('Erro ao carregar desafios');
        return;
      }
      
      // Transform and combine challenges
      const created = createdChallenges?.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        type: c.type as ChallengeType,
        goal: c.goal,
        progress: 0, // Default progress
        status: c.status as ChallengeStatus,
        reward: c.reward_type as ChallengeReward | undefined,
        rewardDetails: c.reward_details,
        expiresAt: c.end_date,
        createdAt: c.created_at
      })) || [];
      
      const participating = participatingData?.map(p => ({
        id: p.shared_challenges.id,
        title: p.shared_challenges.title,
        description: p.shared_challenges.description || '',
        type: p.shared_challenges.type as ChallengeType,
        goal: p.shared_challenges.goal,
        progress: p.progress,
        status: p.status as ChallengeStatus,
        reward: p.shared_challenges.reward_type as ChallengeReward | undefined,
        rewardDetails: p.shared_challenges.reward_details,
        expiresAt: p.shared_challenges.end_date,
        createdAt: p.shared_challenges.created_at
      })) || [];
      
      // Combine and deduplicate
      const allChallenges = [...created];
      participating.forEach(p => {
        if (!allChallenges.some(c => c.id === p.id)) {
          allChallenges.push(p);
        }
      });
      
      setChallenges(allChallenges);
      
      // Set active challenge
      const active = allChallenges.find(c => 
        c.status === 'in-progress' && 
        (!c.expiresAt || new Date() < new Date(c.expiresAt))
      );
      setActiveChallenge(active || null);
      
    } catch (error) {
      console.error('Unexpected error fetching challenges:', error);
      toast.error('Erro inesperado ao carregar desafios');
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('challenge_participants')
        .update({ 
          progress, 
          updated_at: new Date().toISOString() 
        })
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating challenge progress:', error);
        toast.error('Erro ao atualizar progresso do desafio');
        return;
      }
      
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? {...c, progress} : c
      ));
      
      toast.success('Progresso atualizado');
    } catch (error) {
      console.error('Unexpected error updating challenge progress:', error);
      toast.error('Erro inesperado ao atualizar progresso');
    }
  };

  const completeChallenge = async (challengeId: string) => {
    if (!user) return;
    
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) {
        toast.error('Desafio não encontrado');
        return;
      }
      
      const { error } = await supabase
        .from('challenge_participants')
        .update({ 
          status: 'completed', 
          updated_at: new Date().toISOString() 
        })
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error completing challenge:', error);
        toast.error('Erro ao completar desafio');
        return;
      }
      
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? {...c, status: 'completed'} : c
      ));
      
      // Update user points if there's a points reward
      if (challenge.reward === 'points' && challenge.rewardDetails) {
        const points = typeof challenge.rewardDetails === 'string' 
          ? parseInt(challenge.rewardDetails)
          : challenge.rewardDetails.points || 0;
          
        if (points > 0) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              total_points: supabase.rpc('increment', { x: points }),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (profileError) {
            console.error('Error updating user points:', profileError);
          }
        }
      }
      
      toast.success('Desafio completado!', {
        description: 'Parabéns por completar o desafio!'
      });
    } catch (error) {
      console.error('Unexpected error completing challenge:', error);
      toast.error('Erro inesperado ao completar desafio');
    }
  };

  const generateSurpriseChallenge = async () => {
    if (!user) return;
    
    try {
      // Generate a random challenge using our generator
      const template = generateChallenge('surprise');
      const expiration = calculateExpirationDate(template.durationDays || 1);
      
      // Insert the new challenge
      const { data: challenge, error } = await supabase
        .from('shared_challenges')
        .insert({
          title: template.title,
          description: template.description,
          type: template.type,
          goal: template.goal,
          creator_id: user.id,
          end_date: expiration.toISOString(),
          reward_type: 'points',
          reward_details: { points: template.rewardPoints || 50 }
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating surprise challenge:', error);
        toast.error('Erro ao criar desafio surpresa');
        return;
      }
      
      // Add the user as a participant
      const { error: participantError } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challenge.id,
          user_id: user.id,
          status: 'in-progress',
          progress: 0
        });
        
      if (participantError) {
        console.error('Error adding user as challenge participant:', participantError);
        toast.error('Erro ao registrar participação no desafio');
        return;
      }
      
      toast.success('Novo desafio surpresa!', {
        description: template.title
      });
      
      fetchChallenges();
    } catch (error) {
      console.error('Unexpected error generating surprise challenge:', error);
      toast.error('Erro inesperado ao gerar desafio surpresa');
    }
  };

  const value = {
    challenges,
    activeChallenge,
    dailyChallenges,
    weeklyChallenges,
    surpriseChallenges,
    completedChallenges,
    updateChallengeProgress,
    completeChallenge,
    generateSurpriseChallenge
  };

  return (
    <ChallengeContext.Provider value={value}>
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

export default ChallengeContext;
