
// Import specific functions from date-fns to ensure TypeScript compatibility
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { ptBR } from 'date-fns/locale';

/**
 * Locale português do Brasil para formatação de datas
 */
export { ptBR };

/**
 * Formata uma data de acordo com o formato especificado
 * @param date Data para formatar
 * @param formatStr String de formato (ex: 'dd/MM/yyyy')
 * @param options Opções adicionais como locale
 * @returns String formatada
 */
export function formatDate(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return format(date, formatStr, options);
}

/**
 * Adiciona o número especificado de dias à data
 * @param date Data base
 * @param amount Quantidade de dias para adicionar
 * @returns Nova data com os dias adicionados
 */
export function addDaysToDate(date: Date | number, amount: number): Date {
  return addDays(date, amount);
}

/**
 * Subtrai o número especificado de dias da data
 * @param date Data base
 * @param amount Quantidade de dias para subtrair
 * @returns Nova data com os dias subtraídos
 */
export function subtractDaysFromDate(date: Date | number, amount: number): Date {
  return subDays(date, amount);
}

/**
 * Converte uma string ISO em um objeto Date
 * @param dateStr String ISO de data
 * @returns Objeto Date
 */
export function parseISODate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Retorna o início do dia (00:00:00) para a data fornecida
 * @param date Data de entrada
 * @returns Data representando o início do dia
 */
export function getStartOfDay(date: Date | number): Date {
  return startOfDay(date);
}

/**
 * Retorna o fim do dia (23:59:59.999) para a data fornecida
 * @param date Data de entrada
 * @returns Data representando o fim do dia
 */
export function getEndOfDay(date: Date | number): Date {
  return endOfDay(date);
}

// Export original functions for backward compatibility
export { format, addDays, subDays, parseISO, startOfDay, endOfDay };

// Log para verificar que o módulo carregou corretamente
console.log("dateUtils carregado com sucesso");
