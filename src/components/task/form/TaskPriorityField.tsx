
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskPriorityFieldProps {
  priority: 'low' | 'medium' | 'high';
  setPriority: (priority: 'low' | 'medium' | 'high') => void;
}

const TaskPriorityField: React.FC<TaskPriorityFieldProps> = ({ priority, setPriority }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="priority">Prioridade</Label>
      <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
        <SelectTrigger id="priority">
          <SelectValue placeholder="Selecione a prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Baixa</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskPriorityField;
