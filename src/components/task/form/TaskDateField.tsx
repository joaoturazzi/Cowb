
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TaskDateFieldProps {
  targetDate: Date;
  setTargetDate: (date: Date) => void;
}

const TaskDateField: React.FC<TaskDateFieldProps> = ({ targetDate, setTargetDate }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="targetDate">Data</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="targetDate"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !targetDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {targetDate ? (
              format(targetDate, "EEEE, d 'de' MMMM, yyyy", { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={targetDate}
            onSelect={(date) => date && setTargetDate(date)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskDateField;
