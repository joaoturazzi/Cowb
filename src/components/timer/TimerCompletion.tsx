
import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '@/contexts/TimerContext';
import { toast } from '@/components/ui/use-toast';

const TimerCompletion: React.FC = () => {
  const { timerState, settings } = useTimer();
  const [lastCompletedState, setLastCompletedState] = useState<string | null>(null);
  const previousTimerState = useRef<string | null>(null);
  
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
      // Passando o título como primeiro parâmetro e a descrição como uma opção
      toast(
        "Timer Concluído",
        { 
          description: message
        }
      );
      
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
