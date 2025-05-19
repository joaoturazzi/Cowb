
// Direct imports from specific paths instead of index
import { format as dateFnsFormat } from 'date-fns/format';
import { addDays as dateFnsAddDays } from 'date-fns/addDays';
import { subDays as dateFnsSubDays } from 'date-fns/subDays';
import { parseISO as dateFnsParseISO } from 'date-fns/parseISO';
import { startOfDay as dateFnsStartOfDay } from 'date-fns/startOfDay';
import { endOfDay as dateFnsEndOfDay } from 'date-fns/endOfDay';
// Import locale separately
import { ptBR as dateFnsPtBR } from 'date-fns/locale/pt-BR';

// Export as values (not types) with clearer naming
export const format = dateFnsFormat;
export const addDays = dateFnsAddDays;
export const subDays = dateFnsSubDays;
export const parseISO = dateFnsParseISO;
export const startOfDay = dateFnsStartOfDay;
export const endOfDay = dateFnsEndOfDay;
export const ptBR = dateFnsPtBR;

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
