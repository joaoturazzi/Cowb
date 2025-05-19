
// Direct imports from date-fns
import { format, addDays, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// Import the Locale type explicitly
import type { Locale } from 'date-fns';

/**
 * Formats a date according to the specified format string
 * @param date The date to format
 * @param formatStr The format string
 * @param options Additional options
 * @returns Formatted date string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: Locale }): string {
  return format(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 * @param date The date to modify
 * @param amount The amount of days to add
 * @returns A new date with days added
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return addDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 * @param date The date to modify
 * @param amount The amount of days to subtract
 * @returns A new date with days subtracted
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return subDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 * @param dateStr The ISO string to parse
 * @returns A Date object
 */
export function parseISODate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 * @param date The date to get start of day for
 * @returns A new date representing the start of day
 */
export function getStartOfDay(date: Date | number): Date {
  return startOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 * @param date The date to get end of day for
 * @returns A new date representing the end of day
 */
export function getEndOfDay(date: Date | number): Date {
  return endOfDay(date);
}

// Directly export the date-fns functions and locale
// This is the key change - we directly export imported items, not re-exporting
export { format, addDays, subDays, parseISO, startOfDay, endOfDay, ptBR };

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
