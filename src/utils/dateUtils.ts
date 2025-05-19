
// Usando importação com namespace para resolver problemas com isolatedModules
import * as dateFns from 'date-fns';
import { ptBR as ptBRLocale } from 'date-fns/locale';

/**
 * Locale português do Brasil para formatação de datas
 */
export const ptBR = ptBRLocale;

/**
 * Formata uma data de acordo com o formato especificado
 * @param date Data para formatar
 * @param formatStr String de formato (ex: 'dd/MM/yyyy')
 * @param options Opções adicionais como locale
 * @returns String formatada
 */
export function format(date: Date | number, formatStr: string, options?: { locale?: any }): string {
  return dateFns.format(date, formatStr, options);
}

/**
 * Adiciona o número especificado de dias à data
 * @param date Data base
 * @param amount Quantidade de dias para adicionar
 * @returns Nova data com os dias adicionados
 */
export function addDays(date: Date | number, amount: number): Date {
  return dateFns.addDays(date, amount);
}

/**
 * Subtrai o número especificado de dias da data
 * @param date Data base
 * @param amount Quantidade de dias para subtrair
 * @returns Nova data com os dias subtraídos
 */
export function subDays(date: Date | number, amount: number): Date {
  return dateFns.subDays(date, amount);
}

/**
 * Converte uma string ISO em um objeto Date
 * @param dateStr String ISO de data
 * @returns Objeto Date
 */
export function parseISO(dateStr: string): Date {
  return dateFns.parseISO(dateStr);
}

/**
 * Retorna o início do dia (00:00:00) para a data fornecida
 * @param date Data de entrada
 * @returns Data representando o início do dia
 */
export function startOfDay(date: Date | number): Date {
  return dateFns.startOfDay(date);
}

/**
 * Retorna o fim do dia (23:59:59.999) para a data fornecida
 * @param date Data de entrada
 * @returns Data representando o fim do dia
 */
export function endOfDay(date: Date | number): Date {
  return dateFns.endOfDay(date);
}

// Log para verificar que o módulo carregou corretamente
console.log("dateUtils carregado com sucesso");
