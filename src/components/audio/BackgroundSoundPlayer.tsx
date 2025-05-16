
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  VolumeX, 
  Volume, 
  Volume1, 
  Volume2,
  Music,
  Waves,
  Wind
} from 'lucide-react';
import { AudioSettings } from '@/contexts/timer/timerSettingsTypes';

// URLs simuladas para áudio - em produção, estas seriam URLs reais
const AUDIO_SOURCES = {
  lofi: [
    "/audio/lofi-1.mp3",
    "/audio/lofi-2.mp3",
  ],
  'white-noise': [
    "/audio/white-noise-1.mp3",
    "/audio/white-noise-2.mp3",
  ],
  nature: [
    "/audio/nature-1.mp3",
    "/audio/nature-2.mp3",
  ],
};

// Componente simulado para desenvolvimento
// No projeto real, os arquivos de áudio existiriam
const AUDIO_PLACEHOLDERS: Record<string, string> = {
  lofi: "https://cdn.gpteng.co/audio/lofi-placeholder.mp3",
  'white-noise': "https://cdn.gpteng.co/audio/white-noise-placeholder.mp3",
  nature: "https://cdn.gpteng.co/audio/nature-placeholder.mp3",
};

interface BackgroundSoundPlayerProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
}

const BackgroundSoundPlayer: React.FC<BackgroundSoundPlayerProps> = ({
  settings,
  onSettingsChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar o áudio quando as configurações mudam
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    
    // Atualizar a fonte do áudio
    const source = settings.source;
    if (source !== 'none') {
      // Em produção, escolha aleatoriamente de AUDIO_SOURCES[source]
      // Para desenvolvimento, usamos um placeholder
      audioRef.current.src = AUDIO_PLACEHOLDERS[source];
      
      // Atualizar volume
      audioRef.current.volume = settings.volume / 100;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [settings.source]);
  
  // Atualizar volume quando a configuração mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume / 100;
    }
  }, [settings.volume]);
  
  const togglePlayback = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(err => {
        console.error('Erro ao reproduzir áudio:', err);
        // Pode ser necessário interação do usuário para iniciar o áudio
      });
    }
    setIsPlaying(!isPlaying);
    onSettingsChange({ ...settings, enabled: !isPlaying });
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    onSettingsChange({ ...settings, volume: newVolume });
  };
  
  const handleSourceChange = (source: 'lofi' | 'white-noise' | 'nature' | 'none') => {
    // Pausar o áudio atual
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    onSettingsChange({ ...settings, source });
    
    // Se o novo source for "none", também pausamos a reprodução
    if (source === 'none') {
      setIsPlaying(false);
      onSettingsChange({ ...settings, source, enabled: false });
    } else if (isPlaying) {
      // Se já estávamos reproduzindo, iniciar o novo áudio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }, 100);
    }
  };
  
  const getVolumeIcon = () => {
    if (settings.volume === 0) return <VolumeX className="h-5 w-5" />;
    if (settings.volume < 33) return <Volume className="h-5 w-5" />;
    if (settings.volume < 67) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };
  
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Music className="h-5 w-5 mr-2" />
          Sons de Fundo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={settings.source === 'lofi' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSourceChange('lofi')}
              className="flex-1"
            >
              <Music className="h-4 w-4 mr-2" /> Lo-Fi
            </Button>
            <Button 
              variant={settings.source === 'white-noise' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSourceChange('white-noise')}
              className="flex-1"
            >
              <Waves className="h-4 w-4 mr-2" /> Ruído Branco
            </Button>
            <Button 
              variant={settings.source === 'nature' ? "default" : "outline"}
              size="sm"
              onClick={() => handleSourceChange('nature')}
              className="flex-1"
            >
              <Wind className="h-4 w-4 mr-2" /> Natureza
            </Button>
          </div>
          
          <div className="pt-2 space-y-4">
            <div className="flex items-center space-x-3">
              {getVolumeIcon()}
              <Slider
                value={[settings.volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                disabled={settings.source === 'none'}
              />
            </div>
            
            <Button 
              onClick={togglePlayback}
              disabled={settings.source === 'none'}
              className="w-full"
              variant={isPlaying ? "outline" : "default"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" /> Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Reproduzir
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundSoundPlayer;
