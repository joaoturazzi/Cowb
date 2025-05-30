
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { RecurrenceEndDateProps } from './types';
import { format, ptBR } from '@/utils/dateUtils';

const RecurrenceEndDate: React.FC<RecurrenceEndDateProps> = ({ 
  endDate, 
  onEndDateChange 
}) => {
  const toggleEndDate = () => {
    onEndDateChange(endDate ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Data de término (opcional)</label>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          className={endDate ? 'text-left' : 'text-muted-foreground text-left'}
          onClick={toggleEndDate}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {endDate ? format(endDate, 'PPP', { locale: ptBR }) : 'Sem data de término'}
        </Button>
        
        {endDate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEndDateChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {endDate && (
        <div className="pt-2">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => onEndDateChange(date || null)}
            disabled={(date) => date < new Date()}
            initialFocus
            className="pointer-events-auto"
          />
        </div>
      )}
    </div>
  );
};

export default RecurrenceEndDate;
