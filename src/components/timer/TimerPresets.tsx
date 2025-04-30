
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimerPresetsProps {
  handleChangeTimerSettings: (preset: string) => void;
}

const TimerPresets: React.FC<TimerPresetsProps> = ({ handleChangeTimerSettings }) => {
  return (
    <Tabs defaultValue="short" className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Temporizador</h2>
        <TabsList>
          <TabsTrigger value="short" onClick={() => handleChangeTimerSettings('short')}>
            25/5
          </TabsTrigger>
          <TabsTrigger value="medium" onClick={() => handleChangeTimerSettings('medium')}>
            50/10
          </TabsTrigger>
          <TabsTrigger value="long" onClick={() => handleChangeTimerSettings('long')}>
            90/15
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export default TimerPresets;
