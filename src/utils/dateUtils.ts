
// Import functions from date-fns
import { format, addDays, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

// Create a default options object with the locale
const defaultOptions = { locale: ptBR };

/**
 * Formats a date according to the specified format string
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return format(date, formatStr, { ...defaultOptions, ...options });
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

// Export the locale for use in components
export { ptBR };

// Export the original functions for backward compatibility
export { format, addDays, subDays, parseISO, startOfDay, endOfDay };

// Log para verificar que o módulo carregou corretamente
console.log("dateUtils carregado com sucesso");
