import { useState } from 'react'
import { IConsulta } from '@/@types'
import { hojeISO, isoParaBR } from '@/utils/formatDate'

interface IUseNovaConsulta {
  data: string
  descricao: string
  setData: (v: string) => void
  setDescricao: (v: string) => void
  reset: () => void
  toConsulta: () => IConsulta
  isValid: boolean
}

export function useNovaConsulta(): IUseNovaConsulta {
  const [data, setData] = useState<string>(hojeISO())
  const [descricao, setDescricao] = useState<string>('')

  const reset = () => {
    setData(hojeISO())
    setDescricao('')
  }

  const toConsulta = (): IConsulta => ({
    data: isoParaBR(data),
    descricao: descricao.trim(),
  })

  const isValid = data.trim().length > 0 && descricao.trim().length > 0

  return { data, descricao, setData, setDescricao, reset, toConsulta, isValid }
}
