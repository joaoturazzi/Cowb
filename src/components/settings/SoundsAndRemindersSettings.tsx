
import React from 'react';
import BackgroundSoundPlayer from '../audio/BackgroundSoundPlayer';
import HealthReminders from '../reminders/HealthReminders';
import { AudioSettings, ReminderSettings } from '@/contexts/timer/timerSettingsTypes';

interface SoundsAndRemindersSettingsProps {
  audioSettings: AudioSettings;
  reminderSettings: ReminderSettings;
  onAudioSettingsChange: (settings: AudioSettings) => void;
  onReminderSettingsChange: (settings: ReminderSettings) => void;
}

const SoundsAndRemindersSettings: React.FC<SoundsAndRemindersSettingsProps> = ({
  audioSettings,
  reminderSettings,
  onAudioSettingsChange,
  onReminderSettingsChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BackgroundSoundPlayer 
        settings={audioSettings}
        onSettingsChange={onAudioSettingsChange}
      />
      <HealthReminders 
        settings={reminderSettings}
        onSettingsChange={onReminderSettingsChange}
      />
    </div>
  );
};

export default SoundsAndRemindersSettings;
