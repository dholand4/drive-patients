import { IPaciente } from '@/@types'

export interface IPatientCardProps {
  paciente: IPaciente
  onClick: (paciente: IPaciente) => void
}
