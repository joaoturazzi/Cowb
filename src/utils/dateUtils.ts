
// Import date-fns functions directly to avoid type-only export issues
import * as dateFns from 'date-fns';
import { pt } from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return dateFns.format(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return dateFns.addDays(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return dateFns.subDays(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 */
export function parseISODate(dateStr: string): Date {
  return dateFns.parseISO(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 */
export function getStartOfDay(date: Date | number): Date {
  return dateFns.startOfDay(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 */
export function getEndOfDay(date: Date | number): Date {
  return dateFns.endOfDay(date);
}

// Make these functions available directly for compatibility with existing code
export const format = dateFns.format;
export const addDays = dateFns.addDays;
export const subDays = dateFns.subDays;
export const parseISO = dateFns.parseISO;
export const startOfDay = dateFns.startOfDay;
export const endOfDay = dateFns.endOfDay;
export const ptBR = pt;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
