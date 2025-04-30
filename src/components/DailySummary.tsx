
import React from 'react';
import { useTask } from '../contexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const DailySummary: React.FC = () => {
  const { dailySummary, tasks } = useTask();
  
  // Tasks not completed from today
  const pendingTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt).toDateString();
    const today = new Date().toDateString();
    return taskDate === today && !task.completed;
  });

  // Tasks that were redistributed from previous days
  const redistributedTasks = tasks.filter(task => {
    const targetDate = task.target_date ? new Date(task.target_date) : null;
    const createdDate = new Date(task.createdAt);
    
    // If target date exists and is different from creation date, it was redistributed
    if (targetDate && targetDate.toDateString() !== createdDate.toDateString()) {
      return true;
    }
    return false;
  });

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hora${hours > 1 ? 's' : ''} e ${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`
      : `${hours} hora${hours > 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo focado</p>
              <p className="font-medium">
                {dailySummary.totalFocusedTime > 0 
                  ? formatTime(dailySummary.totalFocusedTime) 
                  : 'Nenhum tempo registrado'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Tarefas concluídas</p>
              <p className="text-2xl font-semibold">{dailySummary.completedTasks}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <p className="text-2xl font-semibold">{pendingTasks.length}</p>
            </div>
          </div>

          {redistributedTasks.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <p className="font-medium text-amber-800 dark:text-amber-300">
                  {redistributedTasks.length} tarefa{redistributedTasks.length !== 1 ? 's' : ''} redistribuída{redistributedTasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {redistributedTasks.length === 1 ? 
                  'Esta tarefa foi movida de um dia anterior.' : 
                  'Estas tarefas foram movidas de dias anteriores.'}
              </p>
            </div>
          )}

          {dailySummary.completedTasks > 0 && pendingTasks.length === 0 ? (
            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="font-medium">Parabéns!</p>
              </div>
              <p className="text-sm">Você completou todas as tarefas de hoje. 🎉</p>
            </div>
          ) : pendingTasks.length > 0 ? (
            <div className="bg-priority-low p-3 rounded-lg text-center">
              <p className="font-medium">Você está fazendo progresso! Continue amanhã com calma. 🌱</p>
            </div>
          ) : (
            <div className="bg-secondary p-3 rounded-lg text-center">
              <p className="font-medium">Comece adicionando suas tarefas do dia. ✨</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
