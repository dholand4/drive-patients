import { IConsulta } from '@/@types'

export interface IConsultaItemProps {
  consulta:  IConsulta
  onEditar?: (consulta: IConsulta, novaDescricao: string) => Promise<void>
  onApagar?: (consulta: IConsulta) => Promise<void>
}
