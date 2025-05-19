
// Import functions from their specific modules in date-fns v3
import { format } from 'date-fns/format';
import { addDays } from 'date-fns/addDays';
import { subDays } from 'date-fns/subDays';
import { parseISO } from 'date-fns/parseISO';
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
// Import locale from specific path
import { ptBR } from 'date-fns/locale/pt-BR';

// Export the functions from date-fns
export { 
  format,
  addDays,
  subDays,
  parseISO,
  startOfDay,
  endOfDay,
  ptBR
};

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
