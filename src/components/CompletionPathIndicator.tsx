
import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

interface CompletionPathIndicatorProps {
  remainingTime: number;
  totalEstimatedTime: number;
  completedTime: number;
}

const CompletionPathIndicator: React.FC<CompletionPathIndicatorProps> = ({
  remainingTime,
  totalEstimatedTime,
  completedTime
}) => {
  const formatTimeForDisplay = (minutes: number): string => {
    if (minutes < 60) return `${minutes} minutos`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${mins}min`;
  };
  
  // Calculate completion percentage
  const completionPercentage = totalEstimatedTime > 0 
    ? Math.min(100, Math.round((completedTime / totalEstimatedTime) * 100))
    : 0;

  return (
    <div className="mb-6 bg-secondary/50 rounded-lg p-4">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <Clock className="h-4 w-4 mr-2 text-primary" />
        Caminho de Conclusão
      </h3>
      
      <div className="space-y-3">
        {completionPercentage === 100 ? (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Todas as tarefas concluídas!</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span>Tempo restante estimado</span>
              <span className="font-medium">{formatTimeForDisplay(remainingTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-medium">{completionPercentage}%</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {remainingTime > 0 ? (
                <span>
                  Você precisará de aproximadamente <span className="font-medium">{formatTimeForDisplay(remainingTime)}</span> de 
                  foco para completar todas as tarefas de hoje.
                </span>
              ) : (
                <span>Nenhuma tarefa pendente para hoje.</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompletionPathIndicator;
