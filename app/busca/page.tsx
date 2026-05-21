'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchInputGlobal } from '@/components/searchInputGlobal'
import { PatientCardGlobal } from '@/components/patientCardGlobal'
import { EmptyStateGlobal } from '@/components/emptyStateGlobal'
import { useBuscarPacientes } from '@/hooks/useBuscarPacientes'
import { prontuarioService } from '@/services/prontuarioService'
import { IPaciente } from '@/@types'
import {
  PageWrapper,
  Header,
  Title,
  SearchWrapper,
  ListWrapper,
  ErrorText,
  FabButton,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  ModalInput,
  ModalActions,
  ModalCancelBtn,
  ModalConfirmBtn,
} from './style'

function BuscaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [showModal, setShowModal] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [criando, setCriando] = useState(false)

  const { pacientes, loading, error } = useBuscarPacientes(query)

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    const qs = params.toString()
    router.replace(qs ? `/busca?${qs}` : '/busca', { scroll: false })
  }, [query, router])

  const handleCardClick = (paciente: IPaciente) => {
    router.push(`/paciente/${paciente.id}`)
  }

  const handleCriarPaciente = async () => {
    if (!novoNome.trim()) return
    setCriando(true)
    try {
      const paciente = await prontuarioService.criarPaciente(novoNome.trim())
      setShowModal(false)
      setNovoNome('')
      router.push(`/paciente/${paciente.id}`)
    } catch {
      // erro silencioso — usuário pode tentar novamente
    } finally {
      setCriando(false)
    }
  }

  const showEmpty = !loading && pacientes.length === 0 && !error

  return (
    <PageWrapper>
      <Header>
        <Title>Prontuários</Title>
      </Header>
      <SearchWrapper>
        <SearchInputGlobal value={query} onChange={setQuery} loading={loading} />
      </SearchWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {showEmpty && (
        <EmptyStateGlobal
          message="Nenhum paciente encontrado."
          actionLabel="Criar paciente"
          onAction={() => setShowModal(true)}
        />
      )}
      {!showEmpty && pacientes.length > 0 && (
        <ListWrapper>
          {pacientes.map((p) => (
            <PatientCardGlobal key={p.id} paciente={p} onClick={handleCardClick} />
          ))}
        </ListWrapper>
      )}
      <FabButton onClick={() => setShowModal(true)} aria-label="Novo paciente" title="Novo paciente">
        +
      </FabButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()} role="dialog" aria-modal aria-label="Criar novo paciente">
            <ModalTitle>Novo Paciente</ModalTitle>
            <ModalInput
              type="text"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Nome completo"
              onKeyDown={(e) => e.key === 'Enter' && handleCriarPaciente()}
              autoFocus
            />
            <ModalActions>
              <ModalCancelBtn onClick={() => { setShowModal(false); setNovoNome('') }}>
                Cancelar
              </ModalCancelBtn>
              <ModalConfirmBtn
                onClick={handleCriarPaciente}
                disabled={!novoNome.trim() || criando}
              >
                {criando ? 'Criando...' : 'Criar'}
              </ModalConfirmBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  )
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  )
}
