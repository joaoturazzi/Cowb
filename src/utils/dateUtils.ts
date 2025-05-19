
// Import directly from date-fns with explicit naming
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return format(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return addDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return subDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISODate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function getStartOfDay(date: Date | number): Date {
  return startOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function getEndOfDay(date: Date | number): Date {
  return endOfDay(date);
}

// Re-export the functions for compatibility
export {
  format,
  addDays,
  subDays,
  parseISO,
  startOfDay,
  endOfDay,
  ptBR
};

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
