
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskNameFieldProps {
  name: string;
  setName: (name: string) => void;
}

const TaskNameField: React.FC<TaskNameFieldProps> = ({ name, setName }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nome da tarefa</Label>
      <Input
        id="name"
        placeholder="O que você precisa fazer?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

export default TaskNameField;
