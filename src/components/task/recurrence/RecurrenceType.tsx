
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { RecurrenceTypeProps, recurrenceLabels } from './types';

const RecurrenceType: React.FC<RecurrenceTypeProps> = ({ type, onTypeChange }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="recurrence-type" className="col-span-1">Tipo</Label>
      <Select
        value={type}
        onValueChange={(val: 'daily' | 'weekly' | 'monthly') => onTypeChange(val)}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">{recurrenceLabels.daily}</SelectItem>
          <SelectItem value="weekly">{recurrenceLabels.weekly}</SelectItem>
          <SelectItem value="monthly">{recurrenceLabels.monthly}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RecurrenceType;
