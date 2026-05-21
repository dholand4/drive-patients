import { useCallback, useEffect, useState } from 'react'
import { IConsulta, IProntuario } from '@/@types'
import { prontuarioService } from '@/services/prontuarioService'

interface IUseProntuarioDoc {
  prontuario: IProntuario | null
  loading:    boolean
  saving:     boolean
  error:      string | null
  saveError:  string | null
  salvarConsulta: (consulta: IConsulta) => Promise<boolean>
}

export function useProntuarioDoc(pacienteId: string, docId: string): IUseProntuarioDoc {
  const [prontuario, setProntuario] = useState<IProntuario | null>(null)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [saveError, setSaveError]   = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await prontuarioService.lerProntuario(pacienteId, docId)
      setProntuario(data)
    } catch {
      setError('Erro ao carregar prontuário.')
    } finally {
      setLoading(false)
    }
  }, [pacienteId, docId])

  useEffect(() => {
    if (pacienteId && docId) carregar()
  }, [pacienteId, docId, carregar])

  const salvarConsulta = useCallback(
    async (consulta: IConsulta): Promise<boolean> => {
      setSaving(true)
      setSaveError(null)
      try {
        await prontuarioService.salvarConsulta(pacienteId, consulta)
        await carregar()
        return true
      } catch {
        setSaveError('Erro ao salvar consulta. Tente novamente.')
        return false
      } finally {
        setSaving(false)
      }
    },
    [pacienteId, carregar],
  )

  return { prontuario, loading, saving, error, saveError, salvarConsulta }
}
