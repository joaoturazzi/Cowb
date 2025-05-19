
// Import specific functions from date-fns
import { format as dateFnsFormat } from 'date-fns/format';
import { addDays as dateFnsAddDays } from 'date-fns/addDays';
import { subDays as dateFnsSubDays } from 'date-fns/subDays';
import { parseISO as dateFnsParseISO } from 'date-fns/parseISO';
import { startOfDay as dateFnsStartOfDay } from 'date-fns/startOfDay';
import { endOfDay as dateFnsEndOfDay } from 'date-fns/endOfDay';
import { ptBR as dateFnsPtBR } from 'date-fns/locale/pt-BR';
import type { Locale } from 'date-fns/types';

/**
 * Formats a date according to the specified format string
 */
export function format(date: Date | number, formatStr: string, options?: { locale?: Locale }): string {
  return dateFnsFormat(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDays(date: Date | number, amount: number): Date {
  return dateFnsAddDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subDays(date: Date | number, amount: number): Date {
  return dateFnsSubDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISO(dateStr: string): Date {
  return dateFnsParseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function startOfDay(date: Date | number): Date {
  return dateFnsStartOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function endOfDay(date: Date | number): Date {
  return dateFnsEndOfDay(date);
}

// Aliases for backward compatibility
export const addDaysToDate = addDays;
export const subtractDaysFromDate = subDays;
export const parseISODate = parseISO;
export const getStartOfDay = startOfDay;
export const getEndOfDay = endOfDay;
export const formatDate = format;

// Export the pt-BR locale
export const ptBR = dateFnsPtBR;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
