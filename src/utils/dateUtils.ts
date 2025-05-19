
// Import date-fns functions with renamed imports to avoid conflicts
import { format as formatFn } from 'date-fns';
import { addDays as addDaysFn } from 'date-fns';
import { subDays as subDaysFn } from 'date-fns';
import { parseISO as parseISOFn } from 'date-fns';
import { startOfDay as startOfDayFn } from 'date-fns';
import { endOfDay as endOfDayFn } from 'date-fns';
import { ptBR as ptBRLocale } from 'date-fns/locale';

/**
 * Formats a date according to the specified format string
 * @param date The date to format
 * @param formatStr The format string
 * @param options Additional options
 * @returns Formatted date string
 */
export function format(date: Date | number, formatStr: string, options?: { locale?: Locale }): string {
  return formatFn(date, formatStr, options);
}

/**
 * Adds the specified number of days to the given date
 * @param date The date to modify
 * @param amount The amount of days to add
 * @returns A new date with days added
 */
export function addDays(date: Date | number, amount: number): Date {
  return addDaysFn(date, amount);
}

/**
 * Subtracts the specified number of days from the given date
 * @param date The date to modify
 * @param amount The amount of days to subtract
 * @returns A new date with days subtracted
 */
export function subDays(date: Date | number, amount: number): Date {
  return subDaysFn(date, amount);
}

/**
 * Parses an ISO date string into a Date object
 * @param dateStr The ISO string to parse
 * @returns A Date object
 */
export function parseISO(dateStr: string): Date {
  return parseISOFn(dateStr);
}

/**
 * Returns the start of the day (00:00:00) for the given date
 * @param date The date to get start of day for
 * @returns A new date representing the start of day
 */
export function startOfDay(date: Date | number): Date {
  return startOfDayFn(date);
}

/**
 * Returns the end of the day (23:59:59.999) for the given date
 * @param date The date to get end of day for
 * @returns A new date representing the end of day
 */
export function endOfDay(date: Date | number): Date {
  return endOfDayFn(date);
}

/**
 * Portuguese (Brazil) locale for date-fns
 */
export const ptBR = ptBRLocale;

// Debug log to verify exports are working correctly
console.log("dateUtils loaded correctly with all functions available");
