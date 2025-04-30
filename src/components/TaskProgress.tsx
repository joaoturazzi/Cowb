
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatMinutes } from '../utils/timeUtils';

interface TaskProgressProps {
  completedTime: number;
  totalEstimatedTime: number;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ completedTime, totalEstimatedTime }) => {
  const progressPercentage = totalEstimatedTime > 0 
    ? Math.min(100, (completedTime / totalEstimatedTime) * 100)
    : 0;

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Progresso</span>
        <span>{formatMinutes(completedTime)} / {formatMinutes(totalEstimatedTime)}</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default TaskProgress;
