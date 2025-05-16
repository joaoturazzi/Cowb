
import React from 'react';

interface NextReminderIndicatorProps {
  timeElapsed: number;
  reminderFrequency: number;
  showReminder: boolean;
}

const NextReminderIndicator: React.FC<NextReminderIndicatorProps> = ({
  timeElapsed,
  reminderFrequency,
  showReminder,
}) => {
  if (!showReminder) return null;
  
  const minutesRemaining = Math.max(0, Math.floor(((reminderFrequency * 60) - timeElapsed) / 60));
  const secondsRemaining = Math.max(0, ((reminderFrequency * 60) - timeElapsed) % 60);
  
  return (
    <div className="text-sm text-muted-foreground">
      Próximo lembrete em {minutesRemaining} minutos e {secondsRemaining} segundos.
    </div>
  );
};

export default NextReminderIndicator;
