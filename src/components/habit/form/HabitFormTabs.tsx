
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { HabitFormData } from './HabitFormTypes';
import ColorPicker from './ColorPicker';
import FrequencySelector from './FrequencySelector';
import WeekDaySelector from './WeekDaySelector';

interface HabitFormTabsProps {
  form: UseFormReturn<HabitFormData>;
}

const HabitFormTabs: React.FC<HabitFormTabsProps> = ({ form }) => {
  const watchFrequencyType = form.watch('frequency_type');

  return (
    <Tabs defaultValue="color" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="color">Cor</TabsTrigger>
        <TabsTrigger value="frequency">Frequência</TabsTrigger>
      </TabsList>
      <TabsContent value="color" className="space-y-4 pt-4">
        <ColorPicker form={form} />
      </TabsContent>
      <TabsContent value="frequency" className="space-y-4 pt-4">
        <FrequencySelector form={form} />
        <WeekDaySelector 
          form={form} 
          visible={watchFrequencyType === 'specific_days'} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default HabitFormTabs;
