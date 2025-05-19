
// Importa as funções do date-fns com aliases
import { 
  format as formatFn,
  addDays as addDaysFn,
  subDays as subDaysFn,
  parseISO as parseISOFn,
  startOfDay as startOfDayFn,
  endOfDay as endOfDayFn
} from 'date-fns';

import { ptBR as ptBRLocale } from 'date-fns/locale';

// Exporta as funções como valores
// Usando export const para garantir que sejam tratadas como valores
export const format = formatFn;
export const addDays = addDaysFn;
export const subDays = subDaysFn;
export const parseISO = parseISOFn;
export const startOfDay = startOfDayFn;
export const endOfDay = endOfDayFn;
export const ptBR = ptBRLocale;
