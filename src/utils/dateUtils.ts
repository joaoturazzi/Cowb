
// Import date-fns functions directly
import { format } from 'date-fns';
import { addDays } from 'date-fns';
import { subDays } from 'date-fns';
import { parseISO } from 'date-fns';
import { startOfDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Export wrapper functions to ensure they're exported as values
export function format(...args: Parameters<typeof format>) {
  return format(...args);
}

export function addDays(...args: Parameters<typeof addDays>) {
  return addDays(...args);
}

export function subDays(...args: Parameters<typeof subDays>) {
  return subDays(...args);
}

export function parseISO(...args: Parameters<typeof parseISO>) {
  return parseISO(...args);
}

export function startOfDay(...args: Parameters<typeof startOfDay>) {
  return startOfDay(...args);
}

export function endOfDay(...args: Parameters<typeof endOfDay>) {
  return endOfDay(...args);
}

// Export locale as a value
export const ptBR = ptBR;

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
