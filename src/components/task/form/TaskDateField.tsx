
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, ptBR } from '@/utils/dateUtils';

interface TaskDateFieldProps {
  date: Date;
  setDate: (date: Date) => void;
}

const TaskDateField: React.FC<TaskDateFieldProps> = ({ date, setDate }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date">Data da tarefa</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskDateField;
