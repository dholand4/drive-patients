import { parseConsultas } from '../parseConsultas'

const TEXTO_REAL = `REGISTROS DE SESSÃO

15/01
O paciente chegou à clínica em crise.
16/01
Os pais chegaram no horário previsto.
22/01
Paciente ausente.`

const TEXTO_MULTILINE = `REGISTROS DE SESSÃO

15/01
Linha 1 da sessão.
Continuação na linha 2.
Mais detalhes.
22/01
Segunda visita.`

const TEXTO_COM_ANO = `REGISTROS DE SESSÃO

15/01/26
Sessão com ano curto.
15/01/2026
Sessão com ano longo.`

describe('parseConsultas', () => {
  it('retorna array vazio para texto sem datas', () => {
    expect(parseConsultas('REGISTROS DE SESSÃO\n\n')).toEqual([])
  })

  it('retorna array vazio para string vazia', () => {
    expect(parseConsultas('')).toEqual([])
  })

  it('parseia sessões no formato real (DD/MM)', () => {
    const result = parseConsultas(TEXTO_REAL)
    expect(result).toHaveLength(3)
  })

  it('retorna a sessão mais recente primeiro', () => {
    const result = parseConsultas(TEXTO_REAL)
    expect(result[0].data).toBe('22/01')
    expect(result[2].data).toBe('15/01')
  })

  it('captura a descrição corretamente', () => {
    const result = parseConsultas(TEXTO_REAL)
    const ultima = result.find((c) => c.data === '15/01')
    expect(ultima?.descricao).toBe('O paciente chegou à clínica em crise.')
  })

  it('lida com sessão multiline', () => {
    const result = parseConsultas(TEXTO_MULTILINE)
    const primeira = result.find((c) => c.data === '15/01')
    expect(primeira?.descricao).toContain('Linha 1 da sessão.')
    expect(primeira?.descricao).toContain('Continuação na linha 2.')
    expect(primeira?.descricao).toContain('Mais detalhes.')
  })

  it('ignora o cabeçalho "REGISTROS DE SESSÃO"', () => {
    const result = parseConsultas(TEXTO_REAL)
    expect(result.every((c) => !c.descricao.includes('REGISTROS'))).toBe(true)
  })

  it('aceita datas com ano curto (DD/MM/AA)', () => {
    const result = parseConsultas(TEXTO_COM_ANO)
    expect(result.some((c) => c.data === '15/01/26')).toBe(true)
  })

  it('aceita datas com ano longo (DD/MM/AAAA)', () => {
    const result = parseConsultas(TEXTO_COM_ANO)
    expect(result.some((c) => c.data === '15/01/2026')).toBe(true)
  })

  it('separa data quando o texto está colado sem espaço (DD/MMtexto)', () => {
    const texto = `REGISTROS DE SESSÃO\n\n03/03Atendimento desmarcado.\n10/03Sessão normal.`
    const result = parseConsultas(texto)
    expect(result).toHaveLength(2)
    expect(result[0].data).toBe('10/03')
    expect(result[0].descricao).toBe('Sessão normal.')
    expect(result[1].data).toBe('03/03')
    expect(result[1].descricao).toBe('Atendimento desmarcado.')
  })
})
