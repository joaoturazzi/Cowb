
import React from 'react';
import { Button } from '@/components/ui/button';
import RecurrenceToggle from './RecurrenceToggle';
import RecurrenceType from './RecurrenceType';
import RecurrenceInterval from './RecurrenceInterval';
import RecurrenceEndDate from './RecurrenceEndDate';
import { RecurrenceOptions } from './types';

interface RecurrenceFormProps {
  value: RecurrenceOptions;
  onChange: (value: RecurrenceOptions) => void;
  onClose: () => void;
}

const RecurrenceForm: React.FC<RecurrenceFormProps> = ({
  value,
  onChange,
  onClose
}) => {
  const handleRecurrenceChange = (changes: Partial<RecurrenceOptions>) => {
    onChange({ ...value, ...changes });
  };
  
  // Fix: Create a separate handler for end date to fix type error
  const handleEndDateChange = (date: Date | null) => {
    handleRecurrenceChange({ endDate: date });
  };
  
  return (
    <div className="space-y-4">
      <RecurrenceToggle 
        enabled={value.enabled}
        onToggle={(checked) => handleRecurrenceChange({ enabled: checked })}
      />
      
      {value.enabled && (
        <>
          <RecurrenceType 
            type={value.type}
            onTypeChange={(type) => handleRecurrenceChange({ type })}
          />
          
          <RecurrenceInterval 
            interval={value.interval}
            type={value.type}
            onIntervalChange={(interval) => handleRecurrenceChange({ interval })}
          />
          
          <RecurrenceEndDate 
            endDate={value.endDate}
            onEndDateChange={handleEndDateChange}
          />
        </>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onClose}
          size="sm"
        >
          Concluído
        </Button>
      </div>
    </div>
  );
};

export default RecurrenceForm;
