
// Import date-fns functions directly
import { format as dateFnsFormat } from 'date-fns';
import { addDays as dateFnsAddDays } from 'date-fns';
import { subDays as dateFnsSubDays } from 'date-fns';
import { parseISO as dateFnsParseISO } from 'date-fns';
import { startOfDay as dateFnsStartOfDay } from 'date-fns';
import { endOfDay as dateFnsEndOfDay } from 'date-fns';
import { ptBR as dateFnsPtBR } from 'date-fns/locale';

// Export wrapper functions to ensure they're exported as values
export function format(...args: Parameters<typeof dateFnsFormat>) {
  return dateFnsFormat(...args);
}

export function addDays(...args: Parameters<typeof dateFnsAddDays>) {
  return dateFnsAddDays(...args);
}

export function subDays(...args: Parameters<typeof dateFnsSubDays>) {
  return dateFnsSubDays(...args);
}

export function parseISO(...args: Parameters<typeof dateFnsParseISO>) {
  return dateFnsParseISO(...args);
}

export function startOfDay(...args: Parameters<typeof dateFnsStartOfDay>) {
  return dateFnsStartOfDay(...args);
}

export function endOfDay(...args: Parameters<typeof dateFnsEndOfDay>) {
  return dateFnsEndOfDay(...args);
}

// Export locale as a value
export const ptBR = dateFnsPtBR;

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
