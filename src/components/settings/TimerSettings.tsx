
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { TimerPreset } from '@/contexts/timer/timerSettingsTypes';
import { useToast } from '@/hooks/use-toast';

interface TimerSettingsProps {
  timerPresets: TimerPreset[];
  onSavePreset: (preset: Omit<TimerPreset, "id">) => void;
  onRemovePreset: (presetId: string) => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({
  timerPresets,
  onSavePreset,
  onRemovePreset,
}) => {
  const { toast } = useToast();
  
  const [customTimer, setCustomTimer] = useState({
    name: 'Meu Preset',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4
  });

  const handleSavePreset = () => {
    onSavePreset(customTimer);
    
    toast({
      title: "Preset criado",
      description: `Preset "${customTimer.name}" foi adicionado.`
    });
    
    // Resetar o formulário
    setCustomTimer({
      name: 'Meu Preset',
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      cyclesBeforeLongBreak: 4
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presets do Temporizador</CardTitle>
        <CardDescription>
          Personalize os intervalos de trabalho e pausa do seu temporizador Pomodoro.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Nome do Preset</Label>
              <Input
                id="preset-name"
                value={customTimer.name}
                onChange={(e) => setCustomTimer({
                  ...customTimer,
                  name: e.target.value
                })}
                placeholder="Ex: Concentração Intensa"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Tempo de Trabalho</Label>
                <span className="text-sm">{customTimer.workDuration} minutos</span>
              </div>
              <Slider
                value={[customTimer.workDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setCustomTimer({
                  ...customTimer,
                  workDuration: value[0]
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Pausa Curta</Label>
                <span className="text-sm">{customTimer.shortBreakDuration} minutos</span>
              </div>
              <Slider
                value={[customTimer.shortBreakDuration]}
                min={1}
                max={15}
                step={1}
                onValueChange={(value) => setCustomTimer({
                  ...customTimer,
                  shortBreakDuration: value[0]
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Pausa Longa</Label>
                <span className="text-sm">{customTimer.longBreakDuration} minutos</span>
              </div>
              <Slider
                value={[customTimer.longBreakDuration]}
                min={5}
                max={30}
                step={5}
                onValueChange={(value) => setCustomTimer({
                  ...customTimer,
                  longBreakDuration: value[0]
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Ciclos até Pausa Longa</Label>
                <span className="text-sm">{customTimer.cyclesBeforeLongBreak} ciclos</span>
              </div>
              <Slider
                value={[customTimer.cyclesBeforeLongBreak]}
                min={2}
                max={6}
                step={1}
                onValueChange={(value) => setCustomTimer({
                  ...customTimer,
                  cyclesBeforeLongBreak: value[0]
                })}
              />
            </div>
            
            <Button 
              onClick={handleSavePreset}
              className="w-full"
            >
              Adicionar Preset
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Meus Presets</h3>
            
            {timerPresets?.length ? (
              <div className="space-y-2">
                {timerPresets.map((preset) => (
                  <Card key={preset.id} className="p-4">
                    <h4 className="font-medium">{preset.name}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Trabalho: {preset.workDuration} min</div>
                      <div>Pausa curta: {preset.shortBreakDuration} min</div>
                      <div>Pausa longa: {preset.longBreakDuration} min</div>
                      <div>Ciclos: {preset.cyclesBeforeLongBreak}</div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemovePreset(preset.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm p-4 text-center bg-muted/20 rounded-md">
                Você ainda não tem presets personalizados.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerSettings;
