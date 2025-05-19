
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/contexts/challenge/challengeTypes';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Zap, Target, Award } from 'lucide-react';
import './ChallengeCard.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  const { id, title, description, type, goal, progress, status } = challenge;
  const progressPercentage = Math.floor((progress / goal) * 100);
  const isCompleted = status === 'completed';
  
  const getIcon = () => {
    switch (type) {
      case 'daily': return <CalendarDays className="h-5 w-5" />;
      case 'weekly': return <Target className="h-5 w-5" />;
      case 'surprise': return <Zap className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'surprise': return 'Surpresa';
      default: return 'Desafio';
    }
  };

  return (
    <Card className={`challenge-card ${type} ${isCompleted ? 'completed' : ''}`}>
      <CardHeader className="challenge-header">
        <div className="challenge-badge">{getTypeLabel()}</div>
        <div className="challenge-title-container">
          <div className="challenge-icon">
            {getIcon()}
          </div>
          <div className="challenge-title">
            {title}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="challenge-description">{description}</div>
        <div className="challenge-progress-container">
          <div className="progress-text">
            <span>{progress}/{goal}</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="challenge-progress" />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="challenge-button"
          variant={isCompleted ? "outline" : "default"} 
          onClick={() => onComplete(id)} 
          disabled={isCompleted || progress < goal}
        >
          {isCompleted ? 'Concluído' : (progress >= goal ? 'Receber Recompensa' : 'Em Progresso')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
