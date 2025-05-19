
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Target, Award, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Challenge } from '@/contexts/challenge/challengeTypes';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './ChallengeCard.css';
import { useChallenge } from '@/contexts';

interface ChallengeCardProps {
  challenge: Challenge;
  showActions?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, showActions = true }) => {
  const { updateChallengeProgress, completeChallenge } = useChallenge();
  
  const isExpired = challenge.expiresAt ? isAfter(new Date(), challenge.expiresAt) : false;
  const progressPercentage = Math.min(Math.round((challenge.progress / challenge.goal) * 100), 100);
  const isCompleted = challenge.status === 'completed';
  const isCompletable = !isCompleted && challenge.progress >= challenge.goal;
  
  const challengeTypeIcons = {
    'daily': <Calendar className="h-4 w-4 mr-1" />,
    'weekly': <Calendar className="h-4 w-4 mr-1" />,
    'surprise': <Trophy className="h-4 w-4 mr-1" />
  };
  
  const challengeTypeColors = {
    'daily': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    'weekly': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    'surprise': 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
  };
  
  const handleIncrementProgress = () => {
    updateChallengeProgress(challenge.id, challenge.progress + 1);
  };
  
  const handleCompleteChallenge = () => {
    completeChallenge(challenge.id);
  };

  return (
    <Card className={`challenge-card ${isCompleted ? 'completed' : ''} ${isExpired ? 'expired' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          <div className={`text-xs px-2 py-1 rounded-full flex items-center ${challengeTypeColors[challenge.type]}`}>
            {challengeTypeIcons[challenge.type]}
            {challenge.type === 'daily' ? 'Diário' : 
             challenge.type === 'weekly' ? 'Semanal' : 'Surpresa'}
          </div>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">Meta: {challenge.goal}</span>
            </div>
            
            {challenge.expiresAt && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">
                  Expira: {format(challenge.expiresAt, "dd MMM", { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm">{challenge.progress}/{challenge.goal}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {challenge.reward && (
            <div className="flex items-center text-sm mt-2">
              <Award className="h-4 w-4 mr-1 text-amber-500" />
              <span>
                Recompensa: {challenge.reward === 'points' ? 
                  `${typeof challenge.rewardDetails === 'string' ? 
                    challenge.rewardDetails : challenge.rewardDetails?.points || 0} pontos` : 
                  challenge.reward === 'badge' ? 'Medalha' : 'Tema'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {showActions && !isCompleted && !isExpired && (
        <CardFooter className="flex justify-between gap-2">
          <Button 
            onClick={handleIncrementProgress} 
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Progresso +1
          </Button>
          
          {isCompletable && (
            <Button 
              onClick={handleCompleteChallenge}
              size="sm"
              className="flex-1"
            >
              Completar
            </Button>
          )}
        </CardFooter>
      )}
      
      {isCompleted && (
        <CardFooter>
          <div className="w-full text-center py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md">
            <Trophy className="h-4 w-4 inline mr-1" />
            <span className="text-sm font-medium">Completado!</span>
          </div>
        </CardFooter>
      )}
      
      {isExpired && !isCompleted && (
        <CardFooter>
          <div className="w-full text-center py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
            <span className="text-sm">Expirado</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ChallengeCard;
