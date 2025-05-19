
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTimeForDisplay } from '@/utils/timeUtils';

interface TaskTimeFieldProps {
  estimatedTime: number;
  setEstimatedTime: (time: number) => void;
}

const TaskTimeField: React.FC<TaskTimeFieldProps> = ({ estimatedTime, setEstimatedTime }) => {
  const timeOptions = [5, 10, 15, 25, 30, 45, 60, 90, 120];
  
  return (
    <div className="space-y-2">
      <Label htmlFor="estimatedTime">Tempo estimado (minutos)</Label>
      <Select
        value={estimatedTime.toString()}
        onValueChange={(value) => setEstimatedTime(parseInt(value, 10))}
      >
        <SelectTrigger id="estimatedTime">
          <SelectValue placeholder="Selecione o tempo" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map(time => (
            <SelectItem key={time} value={time.toString()}>
              {formatTimeForDisplay(time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskTimeField;
