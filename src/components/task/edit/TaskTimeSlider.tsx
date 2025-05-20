
import React, { useState, useEffect } from 'react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';

interface TaskTimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TaskTimeSlider: React.FC<TaskTimeSliderProps> = ({
  value,
  onChange
}) => {
  const minuteValues = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];
  
  const [sliderValue, setSliderValue] = useState(
    minuteValues.indexOf(value) !== -1 
      ? [minuteValues.indexOf(value)] 
      : [minuteValues.findIndex(v => v >= value) || 0]
  );
  
  useEffect(() => {
    // Update slider when external value changes
    const valueIndex = minuteValues.indexOf(value);
    if (valueIndex !== -1 && valueIndex !== sliderValue[0]) {
      setSliderValue([valueIndex]);
    }
  }, [value]);

  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    onChange(minuteValues[values[0]]);
  };

  return (
    <FormItem>
      <FormLabel>Tempo Estimado: {minuteValues[sliderValue[0]]} minutos</FormLabel>
      <Slider
        value={sliderValue}
        max={minuteValues.length - 1}
        step={1}
        onValueChange={handleSliderChange}
        className="mt-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>5min</span>
        <span>2h</span>
      </div>
    </FormItem>
  );
};

export default TaskTimeSlider;
