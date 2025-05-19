
// Import individual functions directly from date-fns
import * as dateFns from 'date-fns';
import * as dateFnsLocale from 'date-fns/locale';

// Export the functions from date-fns
export const format = dateFns.format;
export const addDays = dateFns.addDays;
export const subDays = dateFns.subDays;
export const parseISO = dateFns.parseISO;
export const startOfDay = dateFns.startOfDay;
export const endOfDay = dateFns.endOfDay;
export const ptBR = dateFnsLocale.ptBR;

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded:", { 
  format, 
  addDays, 
  subDays, 
  parseISO, 
  startOfDay, 
  endOfDay, 
  ptBR 
});
