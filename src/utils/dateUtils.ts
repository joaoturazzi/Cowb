
// Import the actual functions from date-fns
import { format as dateFnsFormat } from 'date-fns';
import { addDays as dateFnsAddDays } from 'date-fns';
import { subDays as dateFnsSubDays } from 'date-fns';
import { parseISO as dateFnsParseISO } from 'date-fns';
import { startOfDay as dateFnsStartOfDay } from 'date-fns';
import { endOfDay as dateFnsEndOfDay } from 'date-fns';
// Import the ptBR locale
import { pt as dateFnsPtBR } from 'date-fns/locale';

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

// Export aliases for compatibility with existing code
export const format = dateFnsFormat;
export const addDays = dateFnsAddDays;
export const subDays = dateFnsSubDays;
export const parseISO = dateFnsParseISO;
export const startOfDay = dateFnsStartOfDay;
export const endOfDay = dateFnsEndOfDay;
export const ptBR = dateFnsPtBR;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
