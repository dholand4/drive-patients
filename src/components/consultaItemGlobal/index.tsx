'use client'

import { useState } from 'react'
import { IConsultaItemProps } from './types'
import {
  Container,
  Header,
  DataLabel,
  Descricao,
  Acoes,
  AcaoBtn,
  EditTextarea,
  EditAcoes,
  SalvarBtn,
  CancelarBtn,
} from './style'

export function ConsultaItemGlobal({ consulta, onEditar, onApagar }: IConsultaItemProps) {
  const [editando, setEditando]   = useState(false)
  const [texto, setTexto]         = useState(consulta.descricao)
  const [salvando, setSalvando]   = useState(false)
  const [apagando, setApagando]   = useState(false)

  const handleSalvar = async () => {
    if (!onEditar || !texto.trim() || texto === consulta.descricao) {
      setEditando(false)
      return
    }
    setSalvando(true)
    try {
      await onEditar(consulta, texto.trim())
      setEditando(false)
    } finally {
      setSalvando(false)
    }
  }

  const handleCancelar = () => {
    setTexto(consulta.descricao)
    setEditando(false)
  }

  const handleApagar = async () => {
    if (!onApagar) return
    if (!confirm('Apagar esta consulta? A ação não pode ser desfeita.')) return
    setApagando(true)
    try {
      await onApagar(consulta)
    } finally {
      setApagando(false)
    }
  }

  return (
    <Container>
      <Header>
        <DataLabel>{consulta.data}</DataLabel>
        {(onEditar || onApagar) && !editando && (
          <Acoes>
            {onEditar && (
              <AcaoBtn onClick={() => setEditando(true)} title="Editar consulta" aria-label="Editar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </AcaoBtn>
            )}
            {onApagar && (
              <AcaoBtn $danger onClick={handleApagar} disabled={apagando} title="Apagar consulta" aria-label="Apagar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </AcaoBtn>
            )}
          </Acoes>
        )}
      </Header>

      {editando ? (
        <>
          <EditTextarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
          />
          <EditAcoes>
            <CancelarBtn onClick={handleCancelar} disabled={salvando}>Cancelar</CancelarBtn>
            <SalvarBtn onClick={handleSalvar} disabled={salvando || !texto.trim()}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </SalvarBtn>
          </EditAcoes>
        </>
      ) : (
        <Descricao>{consulta.descricao}</Descricao>
      )}
    </Container>
  )
}
