import { IConsulta } from '@/@types'

/**
 * Detecta e captura datas no início de uma linha, nos formatos:
 *   DD/MM            → "15/01"
 *   DD/MM/AA         → "15/01/26"
 *   DD/MM/AAAA       → "15/01/2026"
 *   DD/MMtexto       → "15/01Sessão..." (sem espaço, vira data + descrição)
 *   DD/MM texto      → "15/01 Sessão..." (com espaço)
 *
 * Grupos: [1] data, [2] texto restante na mesma linha (pode ser vazio)
 */
const DATA_INICIO_REGEX = /^(\d{1,2}\/\d{2}(?:\/\d{2,4})?)\s*(.*)/

export function parseConsultas(texto: string): IConsulta[] {
  const linhas = texto.split('\n')
  const consultas: IConsulta[] = []
  let atual: IConsulta | null = null

  for (const linha of linhas) {
    const match = DATA_INICIO_REGEX.exec(linha.trimEnd())
    if (match) {
      if (atual) consultas.push(atual)
      const descricaoInicial = match[2].trim()
      atual = { data: match[1], descricao: descricaoInicial }
    } else if (atual) {
      const trimmed = linha.trimEnd()
      if (!atual.descricao && !trimmed) continue   // pula linhas vazias antes do texto
      atual = {
        data: atual.data,
        descricao: atual.descricao
          ? `${atual.descricao}\n${trimmed}`
          : trimmed,
      }
    }
    // Linhas antes da primeira data (ex: "REGISTROS DE SESSÃO") são ignoradas
  }

  if (atual) consultas.push(atual)

  return consultas
    .filter((c) => c.data)
    .reverse()
}
