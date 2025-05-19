
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RecurrenceToggleProps } from './types';

const RecurrenceToggle: React.FC<RecurrenceToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="recurrence-toggle">Ativar recorrência</Label>
      <Switch 
        id="recurrence-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default RecurrenceToggle;
