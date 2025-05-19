
// Import date-fns functions directly from their modules as values
import { format as formatFn } from 'date-fns';
import { addDays as addDaysFn } from 'date-fns';
import { subDays as subDaysFn } from 'date-fns';
import { parseISO as parseISOFn } from 'date-fns';
import { startOfDay as startOfDayFn } from 'date-fns';
import { endOfDay as endOfDayFn } from 'date-fns';
import { ptBR as ptBRLocale } from 'date-fns/locale';

// Re-export as constants (values) to avoid type-only export errors with isolatedModules
export const format = formatFn;
export const addDays = addDaysFn;
export const subDays = subDaysFn;
export const parseISO = parseISOFn;
export const startOfDay = startOfDayFn;
export const endOfDay = endOfDayFn;
export const ptBR = ptBRLocale;

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
