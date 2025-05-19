
// Import functions directly from specific paths to avoid type errors with date-fns v3
import { format as formatFn } from 'date-fns/format';
import { addDays as addDaysFn } from 'date-fns/addDays';
import { subDays as subDaysFn } from 'date-fns/subDays';
import { parseISO as parseISOFn } from 'date-fns/parseISO';
import { startOfDay as startOfDayFn } from 'date-fns/startOfDay';
import { endOfDay as endOfDayFn } from 'date-fns/endOfDay';
import { pt as ptBRLocale } from 'date-fns/locale/pt';

/**
 * Formats a date according to the specified format string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return formatFn(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return addDaysFn(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return subDaysFn(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISODate(dateStr: string): Date {
  return parseISOFn(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function getStartOfDay(date: Date | number): Date {
  return startOfDayFn(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function getEndOfDay(date: Date | number): Date {
  return endOfDayFn(date);
}

// Export these functions directly to maintain compatibility with existing code
export const format = formatFn;
export const addDays = addDaysFn;
export const subDays = subDaysFn;
export const parseISO = parseISOFn;
export const startOfDay = startOfDayFn;
export const endOfDay = endOfDayFn;
export const ptBR = ptBRLocale;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
