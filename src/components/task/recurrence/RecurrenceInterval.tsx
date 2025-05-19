
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RecurrenceIntervalProps } from './types';

const RecurrenceInterval: React.FC<RecurrenceIntervalProps> = ({ 
  interval, 
  type,
  onIntervalChange
}) => {
  const getIntervalLabel = () => {
    if (interval === 1) {
      return type === 'daily' ? 'dia' : type === 'weekly' ? 'semana' : 'mês';
    }
    return type === 'daily' ? 'dias' : type === 'weekly' ? 'semanas' : 'meses';
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="recurrence-interval" className="col-span-1">
        Intervalo
      </Label>
      <div className="flex items-center col-span-3">
        <span className="mr-2">A cada</span>
        <Input
          id="recurrence-interval"
          type="number"
          min="1"
          max="100"
          value={interval}
          onChange={(e) => 
            onIntervalChange(Math.max(1, parseInt(e.target.value) || 1)) 
          }
          className="w-16 text-center"
        />
        <span className="ml-2">{getIntervalLabel()}</span>
      </div>
    </div>
  );
};

export default RecurrenceInterval;
