
import React from 'react';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RecurrenceDescriptionProps } from './types';

const RecurrenceDescription: React.FC<RecurrenceDescriptionProps> = ({ options }) => {
  if (!options.enabled) return <span>Não se repete</span>;
  
  let desc = '';
  
  switch(options.type) {
    case 'daily':
      desc = options.interval === 1 
        ? 'Todos os dias'
        : `A cada ${options.interval} dias`;
      break;
    case 'weekly':
      desc = options.interval === 1 
        ? 'Toda semana'
        : `A cada ${options.interval} semanas`;
      break;
    case 'monthly':
      desc = options.interval === 1 
        ? 'Todo mês'
        : `A cada ${options.interval} meses`;
      break;
  }
  
  if (options.endDate) {
    desc += ` até ${formatDate(options.endDate, 'dd/MM/yyyy')}`;
  }
  
  return <span>{desc}</span>;
};

export default RecurrenceDescription;
