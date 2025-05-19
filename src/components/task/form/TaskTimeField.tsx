
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskTimeFieldProps {
  estimatedTime: string;
  setEstimatedTime: (time: string) => void;
}

const TaskTimeField: React.FC<TaskTimeFieldProps> = ({ estimatedTime, setEstimatedTime }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="estimatedTime">Tempo estimado (minutos)</Label>
      <Select
        value={estimatedTime}
        onValueChange={(value) => setEstimatedTime(value)}
      >
        <SelectTrigger id="estimatedTime">
          <SelectValue placeholder="Selecione o tempo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 minutos</SelectItem>
          <SelectItem value="10">10 minutos</SelectItem>
          <SelectItem value="15">15 minutos</SelectItem>
          <SelectItem value="25">25 minutos</SelectItem>
          <SelectItem value="30">30 minutos</SelectItem>
          <SelectItem value="45">45 minutos</SelectItem>
          <SelectItem value="60">1 hora</SelectItem>
          <SelectItem value="90">1.5 horas</SelectItem>
          <SelectItem value="120">2 horas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskTimeField;
