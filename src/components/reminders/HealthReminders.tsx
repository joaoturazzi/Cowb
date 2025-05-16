
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ReminderSettings } from '@/contexts/timer/timerSettingsTypes';
import { useToast } from '@/hooks/use-toast';
import { Droplet, Eye, MoveUpRight } from 'lucide-react';

interface HealthRemindersProps {
  settings: ReminderSettings;
  onSettingsChange: (settings: ReminderSettings) => void;
}

const HealthReminders: React.FC<HealthRemindersProps> = ({ settings, onSettingsChange }) => {
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

  // Set up reminders
  useEffect(() => {
    if (!localSettings.water && !localSettings.stretch && !localSettings.eyes) {
      return;
    }
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Check if we should show any reminders
        if (newTime >= localSettings.frequency * 60) {
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
          
          return 0; // Reset the counter
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [localSettings, toast]);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              <Label htmlFor="water">Lembrete para beber água</Label>
            </div>
            <Switch 
              id="water" 
              checked={localSettings.water}
              onCheckedChange={(checked) => handleToggleChange('water', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MoveUpRight className="h-4 w-4 text-green-500" />
              <Label htmlFor="stretch">Lembrete para alongamento</Label>
            </div>
            <Switch 
              id="stretch" 
              checked={localSettings.stretch}
              onCheckedChange={(checked) => handleToggleChange('stretch', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <Label htmlFor="eyes">Lembrete para descansar os olhos</Label>
            </div>
            <Switch 
              id="eyes" 
              checked={localSettings.eyes}
              onCheckedChange={(checked) => handleToggleChange('eyes', checked)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Frequência dos lembretes</Label>
            <span className="text-sm">{localSettings.frequency} minutos</span>
          </div>
          <Slider
            value={[localSettings.frequency]}
            min={15}
            max={60}
            step={5}
            onValueChange={handleFrequencyChange}
            disabled={!localSettings.water && !localSettings.stretch && !localSettings.eyes}
          />
        </div>
        
        {(localSettings.water || localSettings.stretch || localSettings.eyes) && (
          <div className="text-sm text-muted-foreground">
            Próximo lembrete em {Math.max(0, Math.floor(((localSettings.frequency * 60) - timeElapsed) / 60))} minutos e {Math.max(0, ((localSettings.frequency * 60) - timeElapsed) % 60)} segundos.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthReminders;
