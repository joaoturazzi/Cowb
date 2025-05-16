
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Droplet, Eye, MoveUpRight } from 'lucide-react';
import { ReminderSettings } from '@/contexts/timer/timerSettingsTypes';
import ReminderToggle from './ReminderToggle';
import FrequencyControl from './FrequencyControl';
import NextReminderIndicator from './NextReminderIndicator';
import { useHealthReminders } from './useHealthReminders';

interface HealthRemindersProps {
  settings: ReminderSettings;
  onSettingsChange: (settings: ReminderSettings) => void;
}

const HealthReminders: React.FC<HealthRemindersProps> = ({ settings, onSettingsChange }) => {
  const {
    localSettings,
    timeElapsed,
    handleToggleChange,
    handleFrequencyChange,
    areRemindersEnabled
  } = useHealthReminders(settings, onSettingsChange);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Lembretes de Saúde</CardTitle>
        <CardDescription>
          Configure lembretes para manter sua saúde durante o trabalho.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <ReminderToggle
            id="water"
            label="Lembrete para beber água"
            icon={Droplet}
            iconColor="text-blue-500"
            checked={localSettings.water}
            onCheckedChange={(checked) => handleToggleChange('water', checked)}
          />
          
          <ReminderToggle
            id="stretch"
            label="Lembrete para alongamento"
            icon={MoveUpRight}
            iconColor="text-green-500"
            checked={localSettings.stretch}
            onCheckedChange={(checked) => handleToggleChange('stretch', checked)}
          />
          
          <ReminderToggle
            id="eyes"
            label="Lembrete para descansar os olhos"
            icon={Eye}
            iconColor="text-purple-500"
            checked={localSettings.eyes}
            onCheckedChange={(checked) => handleToggleChange('eyes', checked)}
          />
        </div>
        
        <FrequencyControl
          frequency={localSettings.frequency}
          disabled={!areRemindersEnabled}
          onValueChange={handleFrequencyChange}
        />
        
        <NextReminderIndicator
          timeElapsed={timeElapsed}
          reminderFrequency={localSettings.frequency}
          showReminder={areRemindersEnabled}
        />
      </CardContent>
    </Card>
  );
};

export default HealthReminders;
