
import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatTimeForDisplay } from '../utils/timeUtils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

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
  // Calculate completion percentage
  const completionPercentage = totalEstimatedTime > 0 
    ? Math.min(100, Math.round((completedTime / totalEstimatedTime) * 100))
    : 0;

  return (
    <Card className="p-5 h-full flex flex-col overflow-hidden relative bg-gradient-to-br from-card to-background border-primary/10 hover:shadow-md transition-shadow">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-3 z-10">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-base font-medium">Caminho de Conclusão</h3>
      </div>
      
      <div className="space-y-4 flex-grow z-10">
        {completionPercentage === 100 ? (
          <motion.div 
            className="flex items-center justify-center py-2 h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-primary">Todas as tarefas concluídas!</span>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="flex justify-between text-sm items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>Tempo restante estimado</span>
              <span className="font-medium bg-primary/10 px-2.5 py-0.5 rounded-full text-primary">
                {formatTimeForDisplay(remainingTime)}
              </span>
            </motion.div>
            
            <div className="space-y-1.5">
              <div className="flex h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{completionPercentage}% concluído</span>
              </div>
            </div>
            
            <div className="mt-3">
              {remainingTime > 0 ? (
                <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  <p>
                    Você precisa de aproximadamente <span className="font-medium text-foreground">{formatTimeForDisplay(remainingTime)}</span> de 
                    foco para completar todas as tarefas de hoje.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Nenhuma tarefa pendente para hoje</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CompletionPathIndicator;
