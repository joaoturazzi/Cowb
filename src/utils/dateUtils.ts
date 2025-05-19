
// Import date-fns functions
import * as dateFns from 'date-fns';
import * as dateFnsLocale from 'date-fns/locale';

// Definir constantes explicitamente com tipagem para garantir que sejam tratadas como valores
// Export date functions as values
export const format = dateFns.format;
export const addDays = dateFns.addDays;
export const subDays = dateFns.subDays;
export const parseISO = dateFns.parseISO;
export const startOfDay = dateFns.startOfDay;
export const endOfDay = dateFns.endOfDay;

// Export locale
export const ptBR = dateFnsLocale.ptBR;

// Adicionar console.log para debug
console.log("dateUtils loaded:", { 
  format, 
  addDays, 
  subDays, 
  parseISO, 
  startOfDay, 
  endOfDay, 
  ptBR 
});
