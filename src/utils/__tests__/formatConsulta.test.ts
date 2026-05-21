import { formatConsulta } from '../formatConsulta'

describe('formatConsulta', () => {
  it('serializa no formato DD/MM + texto na linha seguinte', () => {
    const result = formatConsulta({ data: '20/05', descricao: 'Retorno, pressão normal.' })
    expect(result).toBe('20/05\nRetorno, pressão normal.')
  })

  it('preserva quebras de linha na descrição', () => {
    const result = formatConsulta({ data: '01/01', descricao: 'Linha 1\nLinha 2' })
    expect(result).toBe('01/01\nLinha 1\nLinha 2')
  })

  it('funciona com datas que têm ano', () => {
    const result = formatConsulta({ data: '20/05/26', descricao: 'Sessão.' })
    expect(result).toBe('20/05/26\nSessão.')
  })
})
