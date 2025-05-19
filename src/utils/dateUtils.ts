
// Import specific functions from date-fns with aliases
import { format as formatDate } from 'date-fns';
import { addDays as addDaysToDate } from 'date-fns';
import { subDays as subDaysFromDate } from 'date-fns';
import { parseISO as parseISODate } from 'date-fns';
import { startOfDay as getStartOfDay } from 'date-fns';
import { endOfDay as getEndOfDay } from 'date-fns';
// Import locale
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 */
export function format(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return formatDate(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDays(date: Date | number, amount: number): Date {
  return addDaysToDate(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subDays(date: Date | number, amount: number): Date {
  return subDaysFromDate(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISO(dateStr: string): Date {
  return parseISODate(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function startOfDay(date: Date | number): Date {
  return getStartOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function endOfDay(date: Date | number): Date {
  return getEndOfDay(date);
}

// Aliases for backward compatibility (these are now actually the original functions)
export { 
  addDaysToDate,
  subDaysFromDate as subtractDaysFromDate,
  parseISODate,
  getStartOfDay,
  getEndOfDay,
  formatDate
};

// Export the pt-BR locale
export { ptBR };

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
