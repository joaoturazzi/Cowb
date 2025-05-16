
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FrequencyControlProps {
  frequency: number;
  disabled: boolean;
  onValueChange: (value: number[]) => void;
}

const FrequencyControl: React.FC<FrequencyControlProps> = ({
  frequency,
  disabled,
  onValueChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>Frequência dos lembretes</Label>
        <span className="text-sm">{frequency} minutos</span>
      </div>
      <Slider
        value={[frequency]}
        min={15}
        max={60}
        step={5}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </div>
  );
};

export default FrequencyControl;
