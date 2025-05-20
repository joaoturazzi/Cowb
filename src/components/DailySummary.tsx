
import React from 'react';
import { useTask } from '../contexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const DailySummary: React.FC = () => {
  const taskContext = useTask();
  const { isDarkMode } = useTheme();
  // Safely access properties
  const tasks = taskContext?.tasks || [];
  const dailySummary = taskContext?.dailySummary || { totalFocusedTime: 0, completedTasks: 0 };
  
  // Tasks not completed from today
  const pendingTasks = tasks.filter(task => {
    // Use target_date instead of createdAt
    const taskDate = task.target_date ? new Date(task.target_date).toDateString() : new Date().toDateString();
    const today = new Date().toDateString();
    return taskDate === today && !task.completed;
  });

  // Tasks that were redistributed from previous days
  const redistributedTasks = tasks.filter(task => {
    const targetDate = task.target_date ? new Date(task.target_date) : null;
    // Since we don't have createdAt, we'll consider tasks with a target_date before today as redistributed
    if (targetDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight for date comparison
      return targetDate < today && !task.completed;
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
  
  // Card styles based on theme and completion
  const getCardStyle = () => {
    const allCompleted = pendingTasks.length === 0 && dailySummary.completedTasks > 0;
    if (allCompleted) {
      return isDarkMode 
        ? "bg-gradient-to-br from-green-900/10 to-green-800/5 border-green-700/10" 
        : "bg-gradient-to-br from-green-50 to-green-100/30 border-green-200/30";
    }
    return "";
  };

  return (
    <Card className={getCardStyle()}>
      <CardHeader className="pb-2">
        <CardTitle>Resumo do dia</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
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
            <motion.div 
              className="bg-secondary/50 rounded-lg p-4 border border-border/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Tarefas concluídas</p>
              <p className={`text-2xl font-semibold ${dailySummary.completedTasks > 0 ? "text-green-500" : ""}`}>
                {dailySummary.completedTasks}
              </p>
            </motion.div>
            <motion.div 
              className="bg-secondary/50 rounded-lg p-4 border border-border/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
              <p className={`text-2xl font-semibold ${pendingTasks.length > 0 ? "text-amber-500" : "text-green-500"}`}>
                {pendingTasks.length}
              </p>
            </motion.div>
          </div>

          {redistributedTasks.length > 0 && (
            <motion.div 
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>
          )}

          {dailySummary.completedTasks > 0 && pendingTasks.length === 0 ? (
            <motion.div 
              className="bg-green-500/10 p-3 rounded-lg text-center border border-green-500/20"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="font-medium text-green-700 dark:text-green-400">Parabéns!</p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">Você completou todas as tarefas de hoje. 🎉</p>
            </motion.div>
          ) : pendingTasks.length > 0 ? (
            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <p className="font-medium text-primary/90">Você está fazendo progresso! Continue amanhã com calma. 🌱</p>
            </div>
          ) : (
            <div className="bg-secondary p-3 rounded-lg text-center">
              <p className="font-medium">Comece adicionando suas tarefas do dia. ✨</p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
