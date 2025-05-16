import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackgroundSoundPlayer from '../components/audio/BackgroundSoundPlayer';
import HealthReminders from '../components/reminders/HealthReminders';
import { UserSettings, TimerPreset, AudioSettings, ReminderSettings } from '../contexts/timer/timerSettingsTypes';
import { getUserSettings, updateUserSettings, updateAudioSettings, updateReminderSettings } from '../contexts/userSettingsService';
import { Loader2, Settings as SettingsIcon, Timer, Clock, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const defaultSettings: UserSettings = {
  timer_presets: {
    custom: []
  },
  reminder_settings: {
    water: true,
    stretch: true,
    eyes: true,
    frequency: 30
  },
  audio_settings: {
    enabled: false,
    volume: 50,
    source: 'lofi',
    autoStop: true
  },
  theme_preference: 'system'
};

const Settings = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('timer');
  const [isSaving, setIsSaving] = useState(false);
  
  // Campos para o timer personalizado
  const [customTimer, setCustomTimer] = useState({
    name: 'Meu Preset',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4
  });
  
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const userSettings = await getUserSettings(user.id);
        if (userSettings) {
          setSettings(userSettings);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas configurações.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
    
  }, [isAuthenticated, user, toast]);
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserSettings(user.id, settings);
      toast({
        title: "Sucesso",
        description: "Suas configurações foram salvas."
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSavePreset = () => {
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      ...customTimer
    };
    
    const updatedPresets = [...(settings.timer_presets?.custom || []), newPreset];
    
    setSettings({
      ...settings,
      timer_presets: {
        ...settings.timer_presets,
        custom: updatedPresets
      }
    });
    
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
  
  const handleAudioSettingsChange = (audioSettings: AudioSettings) => {
    setSettings({
      ...settings,
      audio_settings: audioSettings
    });
  };
  
  const handleReminderSettingsChange = (reminderSettings: ReminderSettings) => {
    setSettings({
      ...settings,
      reminder_settings: reminderSettings
    });
  };
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações</h1>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer">
              <Timer className="h-4 w-4 mr-2" />
              Temporizador
            </TabsTrigger>
            <TabsTrigger value="sounds">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Sons e Lembretes
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Clock className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="space-y-4 mt-4">
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
                    
                    {settings.timer_presets?.custom?.length ? (
                      <div className="space-y-2">
                        {settings.timer_presets.custom.map((preset) => (
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
                                onClick={() => {
                                  const updatedPresets = settings.timer_presets?.custom?.filter(
                                    p => p.id !== preset.id
                                  ) || [];
                                  
                                  setSettings({
                                    ...settings,
                                    timer_presets: {
                                      ...settings.timer_presets,
                                      custom: updatedPresets
                                    }
                                  });
                                }}
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
          </TabsContent>
          
          <TabsContent value="sounds" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BackgroundSoundPlayer 
                settings={settings.audio_settings}
                onSettingsChange={handleAudioSettingsChange}
              />
              <HealthReminders 
                settings={settings.reminder_settings}
                onSettingsChange={handleReminderSettingsChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={settings.theme_preference === 'light' ? "default" : "outline"}
                      onClick={() => setSettings({
                        ...settings,
                        theme_preference: 'light'
                      })}
                      className="justify-center"
                    >
                      Claro
                    </Button>
                    <Button 
                      variant={settings.theme_preference === 'dark' ? "default" : "outline"}
                      onClick={() => setSettings({
                        ...settings,
                        theme_preference: 'dark'
                      })}
                      className="justify-center"
                    >
                      Escuro
                    </Button>
                    <Button 
                      variant={settings.theme_preference === 'system' ? "default" : "outline"}
                      onClick={() => setSettings({
                        ...settings,
                        theme_preference: 'system'
                      })}
                      className="justify-center"
                    >
                      Sistema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
