import { useCallback, useEffect, useState } from 'react'
import { IConsulta, IProntuario } from '@/@types'
import { prontuarioService } from '@/services/prontuarioService'

interface IUseProntuario {
  prontuario:      IProntuario | null
  loading:         boolean
  saving:          boolean
  error:           string | null
  saveError:       string | null
  anoSelecionado:  string | null   // null = "Todos"
  selecionarAno:   (docId: string | null) => void
  salvarConsulta:  (consulta: IConsulta) => Promise<boolean>
}

export function useProntuario(id: string): IUseProntuario {
  const [prontuario, setProntuario]       = useState<IProntuario | null>(null)
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [saveError, setSaveError]         = useState<string | null>(null)
  const [anoSelecionado, setAnoSelecionado] = useState<string | null>(null)

  const carregar = useCallback(async (docId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await prontuarioService.lerProntuario(id, docId)
      setProntuario(data)
    } catch {
      setError('Erro ao carregar prontuário.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) carregar(anoSelecionado ?? undefined)
  }, [id, anoSelecionado, carregar])

  const selecionarAno = useCallback((docId: string | null) => {
    setAnoSelecionado(docId)
  }, [])

  const salvarConsulta = useCallback(
    async (consulta: IConsulta): Promise<boolean> => {
      setSaving(true)
      setSaveError(null)
      try {
        await prontuarioService.salvarConsulta(id, consulta)
        await carregar(anoSelecionado ?? undefined)
        return true
      } catch {
        setSaveError('Erro ao salvar consulta. Tente novamente.')
        return false
      } finally {
        setSaving(false)
      }
    },
    [id, anoSelecionado, carregar]
  )

  return { prontuario, loading, saving, error, saveError, anoSelecionado, selecionarAno, salvarConsulta }
}
