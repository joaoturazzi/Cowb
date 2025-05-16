
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserSettings, TimerPreset } from '../contexts/timer/timerSettingsTypes';
import { getUserSettings, updateUserSettings } from '../contexts/settings/userSettingsService';
import { Loader2, Settings as SettingsIcon, Timer, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TimerSettings from '@/components/settings/TimerSettings';
import SoundsAndRemindersSettings from '@/components/settings/SoundsAndRemindersSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import SettingsHeader from '@/components/settings/SettingsHeader';

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
  
  const handleSavePreset = (preset: Omit<TimerPreset, "id">) => {
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      ...preset
    };
    
    const updatedPresets = [...(settings.timer_presets?.custom || []), newPreset];
    
    setSettings({
      ...settings,
      timer_presets: {
        ...settings.timer_presets,
        custom: updatedPresets
      }
    });
  };
  
  const handleRemovePreset = (presetId: string) => {
    const updatedPresets = settings.timer_presets?.custom?.filter(
      p => p.id !== presetId
    ) || [];
    
    setSettings({
      ...settings,
      timer_presets: {
        ...settings.timer_presets,
        custom: updatedPresets
      }
    });
  };
  
  const handleAudioSettingsChange = (audioSettings: typeof settings.audio_settings) => {
    setSettings({
      ...settings,
      audio_settings: audioSettings
    });
  };
  
  const handleReminderSettingsChange = (reminderSettings: typeof settings.reminder_settings) => {
    setSettings({
      ...settings,
      reminder_settings: reminderSettings
    });
  };
  
  const handleThemeChange = (theme: string) => {
    setSettings({
      ...settings,
      theme_preference: theme
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
        <SettingsHeader onSave={handleSaveSettings} isSaving={isSaving} />
        
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
            <TimerSettings
              timerPresets={settings.timer_presets?.custom || []}
              onSavePreset={handleSavePreset}
              onRemovePreset={handleRemovePreset}
            />
          </TabsContent>
          
          <TabsContent value="sounds" className="space-y-4 mt-4">
            <SoundsAndRemindersSettings
              audioSettings={settings.audio_settings}
              reminderSettings={settings.reminder_settings}
              onAudioSettingsChange={handleAudioSettingsChange}
              onReminderSettingsChange={handleReminderSettingsChange}
            />
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <AppearanceSettings
              themePreference={settings.theme_preference}
              onThemeChange={handleThemeChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
