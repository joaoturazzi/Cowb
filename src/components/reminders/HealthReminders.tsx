
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Droplets, 
  Dumbbell, 
  Eye, 
  Bell,
  BellOff
} from 'lucide-react';
import { ReminderSettings } from '@/contexts/timer/timerSettingsTypes';
import { useToast } from '@/hooks/use-toast';

interface HealthRemindersProps {
  settings: ReminderSettings;
  onSettingsChange: (settings: ReminderSettings) => void;
  pomodoroActive?: boolean;
}

const HealthReminders: React.FC<HealthRemindersProps> = ({
  settings,
  onSettingsChange,
  pomodoroActive = false
}) => {
  const { toast } = useToast();
  const [timers, setTimers] = useState<Record<string, NodeJS.Timeout | null>>({
    water: null,
    stretch: null,
    eyes: null
  });
  
  // Configurar temporizadores quando as configurações mudam
  useEffect(() => {
    // Limpar temporizadores existentes
    Object.values(timers).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    
    // Não configurar novos temporizadores se o Pomodoro não estiver ativo
    if (!pomodoroActive) {
      setTimers({ water: null, stretch: null, eyes: null });
      return;
    }
    
    const newTimers: Record<string, NodeJS.Timeout | null> = {
      water: null,
      stretch: null,
      eyes: null
    };
    
    // Converter frequência de minutos para milissegundos
    const frequency = settings.frequency * 60 * 1000;
    
    // Configurar temporizador para beber água
    if (settings.water) {
      newTimers.water = setTimeout(() => {
        toast({
          title: "Hora de beber água!",
          description: "Manter-se hidratado é importante para a saúde e a concentração."
        });
      }, frequency);
    }
    
    // Configurar temporizador para alongamentos
    if (settings.stretch) {
      newTimers.stretch = setTimeout(() => {
        toast({
          title: "Hora de se alongar!",
          description: "Ficar muito tempo sentado pode causar dores musculares. Levante-se e alongue-se."
        });
      }, frequency + 30000); // 30 segundos depois do lembrete de água
    }
    
    // Configurar temporizador para descanso visual
    if (settings.eyes) {
      newTimers.eyes = setTimeout(() => {
        toast({
          title: "Descanse seus olhos!",
          description: "Olhe para um ponto distante por 20 segundos para reduzir a fadiga ocular."
        });
      }, frequency + 60000); // 1 minuto depois do lembrete de água
    }
    
    setTimers(newTimers);
    
    // Limpar temporizadores ao desmontar
    return () => {
      Object.values(newTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [settings, pomodoroActive, toast]);
  
  const toggleSetting = (key: keyof ReminderSettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key as keyof ReminderSettings]
    });
  };
  
  const handleFrequencyChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      frequency: value[0]
    });
  };
  
  const areRemindersEnabled = settings.water || settings.stretch || settings.eyes;
  
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Lembretes de Saúde
          {areRemindersEnabled ? (
            <Bell className="h-4 w-4 ml-2 text-primary" />
          ) : (
            <BellOff className="h-4 w-4 ml-2 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <Label htmlFor="water-reminder">Lembrete para beber água</Label>
              </div>
              <Switch 
                id="water-reminder"
                checked={settings.water}
                onCheckedChange={() => toggleSetting('water')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-green-500" />
                <Label htmlFor="stretch-reminder">Lembrete para alongar</Label>
              </div>
              <Switch 
                id="stretch-reminder"
                checked={settings.stretch}
                onCheckedChange={() => toggleSetting('stretch')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <Label htmlFor="eye-reminder">Lembrete para descansar os olhos</Label>
              </div>
              <Switch 
                id="eye-reminder"
                checked={settings.eyes}
                onCheckedChange={() => toggleSetting('eyes')}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Frequência dos lembretes</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">{settings.frequency} min</span>
              <Slider
                value={[settings.frequency]}
                min={15}
                max={60}
                step={5}
                onValueChange={handleFrequencyChange}
                className="flex-1"
                disabled={!areRemindersEnabled}
              />
            </div>
          </div>
          
          {areRemindersEnabled && !pomodoroActive && (
            <div className="text-xs text-muted-foreground">
              Os lembretes serão exibidos apenas durante as sessões de Pomodoro.
            </div>
          )}
          
          <Button
            size="sm"
            onClick={() => {
              toast({
                title: "Teste de lembrete",
                description: "Este é um teste dos lembretes de saúde."
              });
            }}
            disabled={!areRemindersEnabled}
            className="w-full"
          >
            Testar Lembretes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthReminders;
