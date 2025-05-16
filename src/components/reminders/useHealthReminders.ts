
import { useState, useEffect } from 'react';
import { ReminderSettings } from '@/contexts/timer/timerSettingsTypes';
import { useToast } from '@/hooks/use-toast';

export const useHealthReminders = (
  settings: ReminderSettings, 
  onSettingsChange: (settings: ReminderSettings) => void
) => {
  const [localSettings, setLocalSettings] = useState<ReminderSettings>({
    water: true,
    stretch: true,
    eyes: true,
    frequency: 30
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Lógica de lembretes
  useEffect(() => {
    if (!localSettings.water && !localSettings.stretch && !localSettings.eyes) {
      return;
    }
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Verificar se precisamos mostrar algum lembrete
        if (newTime >= localSettings.frequency * 60) {
          showReminders();
          return 0; // Reiniciar o contador
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [localSettings]);

  const showReminders = () => {
    if (localSettings.water) {
      toast({
        title: "Hora de hidratar!",
        description: "Lembre-se de beber água para manter-se hidratado durante suas tarefas.",
      });
      
      // Adicionar pequeno delay entre os toasts
      setTimeout(() => {
        if (localSettings.stretch) {
          toast({
            title: "Hora de se alongar!",
            description: "Levante-se e faça um pequeno alongamento para melhorar a circulação.",
          });
        }
      }, 1500);
      
      // Adicionar pequeno delay entre os toasts
      setTimeout(() => {
        if (localSettings.eyes) {
          toast({
            title: "Descanse seus olhos!",
            description: "Olhe para longe da tela por 20 segundos para reduzir a fadiga ocular.",
          });
        }
      }, 3000);
    } else if (localSettings.stretch) {
      toast({
        title: "Hora de se alongar!",
        description: "Levante-se e faça um pequeno alongamento para melhorar a circulação.",
      });
      
      // Adicionar pequeno delay entre os toasts
      setTimeout(() => {
        if (localSettings.eyes) {
          toast({
            title: "Descanse seus olhos!",
            description: "Olhe para longe da tela por 20 segundos para reduzir a fadiga ocular.",
          });
        }
      }, 1500);
    } else if (localSettings.eyes) {
      toast({
        title: "Descanse seus olhos!",
        description: "Olhe para longe da tela por 20 segundos para reduzir a fadiga ocular.",
      });
    }
  };

  const handleToggleChange = (key: keyof Omit<ReminderSettings, 'frequency'>, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    // Mostrar confirmação
    if (value) {
      let reminderType = '';
      switch(key) {
        case 'water':
          reminderType = 'hidratação';
          break;
        case 'stretch':
          reminderType = 'alongamento';
          break;
        case 'eyes':
          reminderType = 'descanso para os olhos';
          break;
      }
      
      toast({
        title: `Lembretes de ${reminderType} ativados`,
        description: `Você receberá notificações a cada ${localSettings.frequency} minutos.`,
      });
    }
  };

  const handleFrequencyChange = (value: number[]) => {
    const newSettings = { ...localSettings, frequency: value[0] };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const areRemindersEnabled = localSettings.water || localSettings.stretch || localSettings.eyes;

  return {
    localSettings,
    timeElapsed,
    handleToggleChange,
    handleFrequencyChange,
    areRemindersEnabled
  };
};
