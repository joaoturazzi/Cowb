
import React from 'react';
import { useChallenge } from '@/contexts/challenge/ChallengeContext';
import ChallengeCard from './ChallengeCard';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import './ChallengeCard.css';

const ChallengesList = () => {
  const { 
    dailyChallenges, 
    weeklyChallenges, 
    surpriseChallenges, 
    completeChallenge,
    generateSurpriseChallenge 
  } = useChallenge();
  
  const activeChallenges = [
    ...dailyChallenges.slice(0, 2),
    ...weeklyChallenges.slice(0, 2),
    ...surpriseChallenges
  ];

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h3 className="challenges-title">Seus Desafios</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="surprise-challenge-button"
          onClick={generateSurpriseChallenge}
          disabled={surpriseChallenges.length >= 3}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Desafio Surpresa
        </Button>
      </div>
      
      {activeChallenges.length > 0 ? (
        <div className="challenges-list">
          {activeChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onComplete={completeChallenge}
            />
          ))}
        </div>
      ) : (
        <div className="no-challenges">
          <p>Sem desafios ativos no momento.</p>
          <Button variant="default" onClick={generateSurpriseChallenge}>
            <Sparkles className="h-4 w-4 mr-1" />
            Gerar Desafio
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
