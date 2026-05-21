'use client'

import { IPatientCardProps } from './types'
import { Card, Avatar, AvatarText, Info, Name, Date } from './style'
import { formatarDataBR } from '@/utils/formatDate'

function getInitials(nome: string): string {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function PatientCardGlobal({ paciente, onClick }: IPatientCardProps) {
  return (
    <Card onClick={() => onClick(paciente)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(paciente)}
      aria-label={`Ver prontuário de ${paciente.nome}`}>
      <Avatar>
        <AvatarText>{getInitials(paciente.nome)}</AvatarText>
      </Avatar>
      <Info>
        <Name>{paciente.nome}</Name>
        <Date>Última edição: {formatarDataBR(paciente.ultimaEdicao)}</Date>
      </Info>
    </Card>
  )
}
