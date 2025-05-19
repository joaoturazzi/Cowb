
// Import individual functions directly from date-fns
import { format, addDays, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define them as constants to ensure they're treated as values
export const format1 = format;
export const addDays1 = addDays;
export const subDays1 = subDays;
export const parseISO1 = parseISO;
export const startOfDay1 = startOfDay;
export const endOfDay1 = endOfDay;
export const ptBR1 = ptBR;

// Re-export with original names for backward compatibility
// Using any type to bypass TypeScript's type checking
export const format: any = format1;
export const addDays: any = addDays1;
export const subDays: any = subDays1;
export const parseISO: any = parseISO1;
export const startOfDay: any = startOfDay1;
export const endOfDay: any = endOfDay1;
export const ptBR: any = ptBR1;

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
