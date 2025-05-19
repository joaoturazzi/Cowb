

// Import and re-export date-fns functions
// The import/export pattern below ensures these are treated as values, not types
import { format as formatFn, addDays as addDaysFn, subDays as subDaysFn, 
  parseISO as parseISOFn, startOfDay as startOfDayFn, 
  endOfDay as endOfDayFn } from 'date-fns';
import { ptBR as ptBRLocale } from 'date-fns/locale';

// Export as values, not types
export const format = formatFn;
export const addDays = addDaysFn;
export const subDays = subDaysFn;
export const parseISO = parseISOFn;
export const startOfDay = startOfDayFn;
export const endOfDay = endOfDayFn;
export const ptBR = ptBRLocale;

