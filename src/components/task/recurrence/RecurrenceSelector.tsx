
import React, { useState } from 'react';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Repeat, X } from 'lucide-react';
import RecurrenceDescription from './RecurrenceDescription';
import RecurrenceForm from './RecurrenceForm';
import { RecurrenceSelectorProps } from './types';

const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  
  const handleDisableRecurrence = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ ...value, enabled: false });
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Recorrência</label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between h-9 px-3"
          >
            <div className="flex items-center">
              <Repeat className="h-4 w-4 mr-2" />
              <RecurrenceDescription options={value} />
            </div>
            {value.enabled && (
              <X 
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={handleDisableRecurrence}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <RecurrenceForm 
            value={value}
            onChange={onChange}
            onClose={() => setOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecurrenceSelector;
