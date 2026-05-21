import { act, renderHook, waitFor } from '@testing-library/react'
import { useProntuario } from '../useProntuario'
import { prontuarioService } from '@/services/prontuarioService'

jest.mock('@/services/prontuarioService')

const mockLer = prontuarioService.lerProntuario as jest.MockedFunction<
  typeof prontuarioService.lerProntuario
>
const mockSalvar = prontuarioService.salvarConsulta as jest.MockedFunction<
  typeof prontuarioService.salvarConsulta
>

const PRONTUARIO_MOCK = {
  pacienteId: '123',
  pacienteNome: 'João Silva',
  consultas: [{ data: '10/05/2024', descricao: 'Consulta inicial.' }],
  conteudoRaw: 'Prontuário - João Silva\n[10/05/2024] Consulta inicial.',
}

beforeEach(() => {
  mockLer.mockResolvedValue(PRONTUARIO_MOCK)
  mockSalvar.mockResolvedValue(undefined)
})

afterEach(() => jest.clearAllMocks())

describe('useProntuario', () => {
  it('carrega dados ao montar', async () => {
    const { result } = renderHook(() => useProntuario('123'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.prontuario).toEqual(PRONTUARIO_MOCK)
    expect(result.current.error).toBeNull()
  })

  it('define error quando falha ao carregar', async () => {
    mockLer.mockRejectedValueOnce(new Error('fail'))
    const { result } = renderHook(() => useProntuario('123'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).not.toBeNull()
    expect(result.current.prontuario).toBeNull()
  })

  it('salva consulta e recarrega prontuário', async () => {
    const { result } = renderHook(() => useProntuario('123'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    let success: boolean
    await act(async () => {
      success = await result.current.salvarConsulta({ data: '20/05/2025', descricao: 'Retorno.' })
    })
    expect(success!).toBe(true)
    expect(mockSalvar).toHaveBeenCalledWith('123', { data: '20/05/2025', descricao: 'Retorno.' })
    expect(mockLer).toHaveBeenCalledTimes(2)
  })

  it('define saveError quando falha ao salvar', async () => {
    mockSalvar.mockRejectedValueOnce(new Error('save fail'))
    const { result } = renderHook(() => useProntuario('123'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    let success: boolean
    await act(async () => {
      success = await result.current.salvarConsulta({ data: '20/05/2025', descricao: 'Retorno.' })
    })
    expect(success!).toBe(false)
    expect(result.current.saveError).not.toBeNull()
  })
})
