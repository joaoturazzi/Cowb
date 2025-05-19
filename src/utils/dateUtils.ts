
// Import individual functions directly from date-fns
import { format, addDays, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Export the imported functions directly
export { format, addDays, subDays, parseISO, startOfDay, endOfDay, ptBR };

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
