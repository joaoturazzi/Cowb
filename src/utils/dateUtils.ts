
import { 
  format as formatFn,
  addDays as addDaysFn,
  subDays as subDaysFn,
  parseISO as parseISOFn,
  startOfDay as startOfDayFn,
  endOfDay as endOfDayFn
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Re-export date-fns functions as values (not types)
export const format = formatFn;
export const addDays = addDaysFn;
export const subDays = subDaysFn;
export const parseISO = parseISOFn;
export const startOfDay = startOfDayFn;
export const endOfDay = endOfDayFn;
export { ptBR };
