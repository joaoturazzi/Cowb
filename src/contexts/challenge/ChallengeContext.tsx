
import React, { createContext, useContext } from 'react';
import { Challenge, ChallengeContextType } from './challengeTypes';
import { useAuth } from '../AuthContext';
import { sonnerToast as toast } from '@/components/ui';
import { generateChallenge } from './challengeGenerator';
import useChallengeData from './useChallengeData';
import { 
  updateChallengeProgressService, 
  completeChallengeService, 
  createSurpriseChallengeService 
} from './challengeService';

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
  const { 
    challenges,
    setChallenges,
    activeChallenge,
    dailyChallenges,
    weeklyChallenges,
    surpriseChallenges,
    completedChallenges,
    fetchChallenges
  } = useChallengeData(user?.id);

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    if (!user) return;
    
    try {
      const { success, error } = await updateChallengeProgressService(challengeId, user.id, progress);
        
      if (!success) {
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
      
      const { success, error } = await completeChallengeService(challengeId, user.id, challenge);
        
      if (!success) {
        toast.error('Erro ao completar desafio');
        return;
      }
      
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? {...c, status: 'completed'} : c
      ));
      
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
      
      const { success, error } = await createSurpriseChallengeService(user.id, template);
      
      if (!success) {
        toast.error('Erro ao criar desafio surpresa');
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
