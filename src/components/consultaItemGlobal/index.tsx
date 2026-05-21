'use client'

import { IConsultaItemProps } from './types'
import { Container, Header, DataLabel, Descricao } from './style'

export function ConsultaItemGlobal({ consulta }: IConsultaItemProps) {
  return (
    <Container>
      <Header>
        <DataLabel>{consulta.data}</DataLabel>
      </Header>
      <Descricao>{consulta.descricao}</Descricao>
    </Container>
  )
}
