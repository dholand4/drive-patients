import { IConsulta } from '@/@types'

/**
 * Serializa uma consulta para o formato usado no Google Doc:
 *   DD/MM
 *   Descrição da sessão...
 */
export function formatConsulta(consulta: IConsulta): string {
  return `${consulta.data}\n${consulta.descricao}`
}
