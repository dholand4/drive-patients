import { useCallback, useEffect, useRef, useState } from 'react'
import { IPaciente } from '@/@types'
import { prontuarioService } from '@/services/prontuarioService'

const DEBOUNCE_MS = 400

interface IUseBuscarPacientes {
  pacientes: IPaciente[]
  loading: boolean
  error: string | null
}

export function useBuscarPacientes(query: string): IUseBuscarPacientes {
  const [pacientes, setPacientes] = useState<IPaciente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buscar = useCallback(async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await prontuarioService.buscarPacientes(q)
      setPacientes(result)
    } catch {
      setError('Erro ao buscar pacientes. Tente novamente.')
      setPacientes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    // Busca imediata ao limpar o campo, com debounce ao digitar
    const delay = query.length === 0 ? 0 : DEBOUNCE_MS
    timerRef.current = setTimeout(() => {
      buscar(query)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, buscar])

  return { pacientes, loading, error }
}
