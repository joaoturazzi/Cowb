
// Import functions from date-fns with named imports
import { 
  format as dateFnsFormat,
  addDays as dateFnsAddDays,
  subDays as dateFnsSubDays,
  parseISO as dateFnsParseISO,
  startOfDay as dateFnsStartOfDay,
  endOfDay as dateFnsEndOfDay
} from 'date-fns';

// Import locale directly from the locale file
import { ptBR as dateFnsPtBR } from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return dateFnsFormat(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return dateFnsAddDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return dateFnsSubDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISODate(dateStr: string): Date {
  return dateFnsParseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function getStartOfDay(date: Date | number): Date {
  return dateFnsStartOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function getEndOfDay(date: Date | number): Date {
  return dateFnsEndOfDay(date);
}

// Export the functions as values
export const format = dateFnsFormat;
export const addDays = dateFnsAddDays;
export const subDays = dateFnsSubDays;
export const parseISO = dateFnsParseISO;
export const startOfDay = dateFnsStartOfDay;
export const endOfDay = dateFnsEndOfDay;

// Export the locale as a value
export const ptBR = dateFnsPtBR;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
