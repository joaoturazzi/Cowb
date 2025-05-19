
// Import from date-fns as namespace to avoid type-only export issues
import * as dateFns from 'date-fns';
import * as dateFnsLocale from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 */
export function format(date: Date | number, formatStr: string, options?: { locale?: dateFns.Locale }): string {
  return dateFns.format(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDays(date: Date | number, amount: number): Date {
  return dateFns.addDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subDays(date: Date | number, amount: number): Date {
  return dateFns.subDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISO(dateStr: string): Date {
  return dateFns.parseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function startOfDay(date: Date | number): Date {
  return dateFns.startOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function endOfDay(date: Date | number): Date {
  return dateFns.endOfDay(date);
}

// Aliases for backward compatibility
export const addDaysToDate = addDays;
export const subtractDaysFromDate = subDays;
export const parseISODate = parseISO;
export const getStartOfDay = startOfDay;
export const getEndOfDay = endOfDay;
export const formatDate = format;

// Export the pt-BR locale
export const ptBR = dateFnsLocale.ptBR;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
