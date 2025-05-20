
import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { toast } from '@/components/ui/use-toast';

const LOCAL_STORAGE_KEY = 'timerCompletionState';

const TimerCompletion: React.FC = () => {
  const { timerState, settings } = useTimer();
  const [lastCompletedState, setLastCompletedState] = useState<string | null>(() => {
    // Initialize from localStorage to persist across page reloads
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  });
  const previousTimerState = useRef<string | null>(null);
  
  // Persist lastCompletedState to localStorage whenever it changes
  useEffect(() => {
    if (lastCompletedState) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lastCompletedState));
      } catch (e) {
        console.error('Error writing to localStorage:', e);
      }
    }
  }, [lastCompletedState]);
  
  // Este useEffect monitora mudanças no timerState para mostrar notificações apropriadas
  useEffect(() => {
    // Se o estado anterior era um estado ativo e agora é 'idle', então um timer foi completado
    const wasActiveState = ['work', 'short_break', 'long_break'].includes(previousTimerState.current || '');
    const isNowIdle = timerState === 'idle';
    
    // Somente mostrar uma notificação se mudamos de um estado ativo para idle
    // E apenas se não mostramos a mesma notificação antes
    if (wasActiveState && isNowIdle && previousTimerState.current !== lastCompletedState) {
      const completedState = previousTimerState.current;
      
      // Determinar a mensagem com base no tipo de timer que foi concluído
      const message = completedState === 'work'
        ? "Hora de descansar! Você completou sua sessão de foco."
        : completedState === 'short_break' || completedState === 'long_break'
          ? "O tempo de descanso acabou. Pronto para focar novamente?"
          : "Timer concluído!";

      // Mostrar a notificação usando a API correta do sonner
      toast({
        title: "Timer Concluído",
        description: message
      });
      
      // Registrar este estado como já notificado
      setLastCompletedState(completedState);
    }
    
    // Atualizar o estado anterior para a próxima comparação
    previousTimerState.current = timerState;
  }, [timerState]);

  // Este componente não renderiza nada visível
  return null;
};

export default TimerCompletion;
