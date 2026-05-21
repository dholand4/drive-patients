import { act, renderHook, waitFor } from '@testing-library/react'
import { useBuscarPacientes } from '../useBuscarPacientes'
import { prontuarioService } from '@/services/prontuarioService'

jest.mock('@/services/prontuarioService')

const mockBuscar = prontuarioService.buscarPacientes as jest.MockedFunction<
  typeof prontuarioService.buscarPacientes
>

const PACIENTES_MOCK = [
  { id: '1', nome: 'João Silva', ultimaEdicao: '2024-05-10T14:00:00Z' },
]

beforeEach(() => {
  jest.useFakeTimers()
  mockBuscar.mockResolvedValue(PACIENTES_MOCK)
})

afterEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()
})

describe('useBuscarPacientes', () => {
  it('busca todos os pacientes ao iniciar com query vazia', async () => {
    renderHook(() => useBuscarPacientes(''))
    act(() => jest.runAllTimers())
    await waitFor(() => expect(mockBuscar).toHaveBeenCalledWith(''))
  })

  it('aplica debounce de 400ms ao digitar', async () => {
    renderHook(() => useBuscarPacientes('Jo'))
    expect(mockBuscar).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(399))
    expect(mockBuscar).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(1))
    await waitFor(() => expect(mockBuscar).toHaveBeenCalledWith('Jo'))
  })

  it('busca imediatamente ao limpar o campo', async () => {
    const { rerender } = renderHook(({ q }) => useBuscarPacientes(q), {
      initialProps: { q: 'João' },
    })
    act(() => jest.runAllTimers())
    await waitFor(() => expect(mockBuscar).toHaveBeenCalledWith('João'))
    jest.clearAllMocks()
    rerender({ q: '' })
    // delay 0 — sem debounce
    act(() => jest.advanceTimersByTime(0))
    await waitFor(() => expect(mockBuscar).toHaveBeenCalledWith(''))
  })

  it('retorna pacientes após busca bem-sucedida', async () => {
    const { result } = renderHook(() => useBuscarPacientes('João'))
    act(() => jest.runAllTimers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pacientes).toEqual(PACIENTES_MOCK)
    expect(result.current.error).toBeNull()
  })

  it('define error em caso de falha de rede', async () => {
    mockBuscar.mockRejectedValueOnce(new Error('network'))
    const { result } = renderHook(() => useBuscarPacientes('João'))
    act(() => jest.runAllTimers())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).not.toBeNull()
    expect(result.current.pacientes).toEqual([])
  })

  it('exibe loading state durante a busca', async () => {
    let resolve!: (v: typeof PACIENTES_MOCK) => void
    mockBuscar.mockReturnValueOnce(new Promise((r) => (resolve = r)))
    const { result } = renderHook(() => useBuscarPacientes('Maria'))
    act(() => jest.runAllTimers())
    await waitFor(() => expect(result.current.loading).toBe(true))
    act(() => resolve(PACIENTES_MOCK))
    await waitFor(() => expect(result.current.loading).toBe(false))
  })
})
