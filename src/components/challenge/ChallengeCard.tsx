
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Award, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { Challenge, ChallengeParticipant } from '@/contexts/challenge/challengeTypes';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ChallengeCardProps {
  challenge: Challenge;
  participation?: ChallengeParticipant;
  isCreator: boolean;
  onJoin: (challengeId: string) => void;
  onLeave: (challengeId: string) => void;
  onDelete: (challengeId: string) => void;
  onUpdateProgress: (challengeId: string, progress: number) => void;
  onClick?: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  participation,
  isCreator,
  onJoin,
  onLeave,
  onDelete,
  onUpdateProgress,
  onClick
}) => {
  const isCompleted = participation?.status === 'completed';
  const progress = participation?.progress || 0;
  const progressPercentage = Math.min(100, (progress / challenge.goal) * 100);
  
  const getRemainingDays = () => {
    if (!challenge.end_date) return null;
    
    const endDate = new Date(challenge.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const remainingDays = getRemainingDays();
  
  const handleProgressChange = () => {
    // Simple increment for demonstration
    if (participation && !isCompleted) {
      onUpdateProgress(challenge.id, Math.min(challenge.goal, progress + 1));
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          
          {isCreator && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir desafio</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este desafio? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(challenge.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        <CardDescription>
          {challenge.description || 'Sem descrição'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-sm">
              Recompensa: {challenge.reward_details?.points || 100} pontos
            </span>
          </div>
          
          {remainingDays !== null && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                {remainingDays > 0 
                  ? `${remainingDays} dias restantes` 
                  : 'Prazo encerrado'}
              </span>
            </div>
          )}
          
          {participation && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progresso</span>
                <span>{progress}/{challenge.goal}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {participation ? (
          <>
            {!isCompleted && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProgressChange}
                className="text-xs"
              >
                Atualizar Progresso
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLeave(challenge.id)}
              className="text-xs text-destructive"
            >
              {isCreator ? "Arquivar" : "Sair"}
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onJoin(challenge.id)}
              className="text-xs"
            >
              Participar
            </Button>
            {onClick && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onClick(challenge)}
                className="text-xs"
              >
                Detalhes <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
