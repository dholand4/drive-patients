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
  QuickModalBox,
  QuickModalHeader,
  QuickModalTitle,
  QuickModalClose,
  QuickSearchWrapper,
  QuickList,
  QuickItem,
  QuickItemNome,
  QuickItemSub,
  QuickEmpty,
  NewPatientLink,
} from './style'

function BuscaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  // Modal acesso rápido
  const [showQuick, setShowQuick]         = useState(false)
  const [quickQuery, setQuickQuery]       = useState('')
  const [abrindoId, setAbrindoId]         = useState<string | null>(null)

  // Modal novo paciente
  const [showModal, setShowModal]         = useState(false)
  const [novoNome, setNovoNome]           = useState('')
  const [criando, setCriando]             = useState(false)

  const { pacientes, loading, error } = useBuscarPacientes(query)
  const { pacientes: quickPacientes, loading: quickLoading } = useBuscarPacientes(quickQuery)

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    const qs = params.toString()
    router.replace(qs ? `/busca?${qs}` : '/busca', { scroll: false })
  }, [query, router])

  // Ao abrir o modal rápido, limpa a busca anterior
  const abrirQuick = () => {
    setQuickQuery('')
    setAbrindoId(null)
    setShowQuick(true)
  }

  const handleCardClick = (paciente: IPaciente) => {
    router.push(`/paciente/${paciente.id}`)
  }

  // Clica num paciente no modal rápido → vai direto pro doc do ano atual
  const handleQuickSelect = async (paciente: IPaciente) => {
    if (abrindoId) return
    setAbrindoId(paciente.id)
    try {
      const docId = await prontuarioService.obterDocAnoAtual(paciente.id)
      setShowQuick(false)
      router.push(`/paciente/${paciente.id}/${docId}`)
    } catch {
      setAbrindoId(null)
    }
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
      // erro silencioso
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

      {/* FAB — acesso rápido */}
      <FabButton onClick={abrirQuick} aria-label="Nova consulta" title="Nova consulta">
        +
      </FabButton>

      {/* Modal de acesso rápido */}
      {showQuick && (
        <ModalOverlay onClick={() => setShowQuick(false)}>
          <QuickModalBox onClick={(e) => e.stopPropagation()}>
            <QuickModalHeader>
              <QuickModalTitle>Nova Consulta</QuickModalTitle>
              <QuickModalClose onClick={() => setShowQuick(false)} aria-label="Fechar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </QuickModalClose>
            </QuickModalHeader>

            <QuickSearchWrapper>
              <ModalInput
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Buscar paciente..."
                autoFocus
              />
            </QuickSearchWrapper>

            <QuickList>
              {quickLoading && <QuickEmpty>Buscando...</QuickEmpty>}
              {!quickLoading && quickPacientes.length === 0 && (
                <QuickEmpty>Nenhum paciente encontrado.</QuickEmpty>
              )}
              {!quickLoading && quickPacientes.map((p) => (
                <QuickItem
                  key={p.id}
                  $loading={abrindoId === p.id}
                  onClick={() => handleQuickSelect(p)}
                >
                  <QuickItemNome>{p.nome}</QuickItemNome>
                  <QuickItemSub>
                    {abrindoId === p.id ? 'Abrindo...' : new Date().getFullYear()}
                  </QuickItemSub>
                </QuickItem>
              ))}
            </QuickList>

            <NewPatientLink onClick={() => { setShowQuick(false); setShowModal(true) }}>
              + Criar novo paciente
            </NewPatientLink>
          </QuickModalBox>
        </ModalOverlay>
      )}

      {/* Modal criar novo paciente */}
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
    <Suspense fallback={null}>
      <BuscaContent />
    </Suspense>
  )
}
