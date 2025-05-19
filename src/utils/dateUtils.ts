
// Import directly from date-fns (not using type imports)
import { format } from 'date-fns';
import { addDays } from 'date-fns';
import { subDays } from 'date-fns';
import { parseISO } from 'date-fns';
import { startOfDay } from 'date-fns';
import { endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Export as values (not types)
export { format, addDays, subDays, parseISO, startOfDay, endOfDay, ptBR };

// Add debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
