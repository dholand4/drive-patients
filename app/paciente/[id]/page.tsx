'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IDocAno } from '@/@types'
import { prontuarioService } from '@/services/prontuarioService'
import {
  PageWrapper,
  HeaderBar,
  BackButton,
  PatientName,
  ContentArea,
  LoadingText,
  ErrorText,
} from './style'
import {
  AnoCard,
  AnoCardIcon,
  AnoCardNome,
  AnoCardArrow,
  AnosGrid,
  EmptyAnos,
} from './styleAnos'

interface IPacientePageProps {
  params: { id: string }
}

export default function PacientePage({ params }: IPacientePageProps) {
  const router = useRouter()
  const [anos, setAnos]           = useState<IDocAno[]>([])
  const [nomePaciente, setNome]   = useState<string>('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setError(null)
      try {
        const [anosData, prontuario] = await Promise.all([
          prontuarioService.listarAnos(params.id),
          prontuarioService.lerProntuario(params.id),
        ])
        setAnos(anosData)
        setNome(prontuario.pacienteNome)
      } catch {
        setError('Erro ao carregar dados do paciente.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [params.id])

  const abrirAno = (docId: string) => {
    router.push(`/paciente/${params.id}/${docId}`)
  }

  return (
    <PageWrapper>
      <HeaderBar>
        <BackButton onClick={() => router.push('/busca')} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </BackButton>
        <PatientName>{nomePaciente || '...'}</PatientName>
      </HeaderBar>

      <ContentArea>
        {loading && <LoadingText>Carregando...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        {!loading && !error && (
          anos.length === 0 ? (
            <EmptyAnos>Nenhum documento encontrado na pasta Prontuário.</EmptyAnos>
          ) : (
            <AnosGrid>
              {anos.map((ano) => (
                <AnoCard key={ano.id} onClick={() => abrirAno(ano.id)}>
                  <AnoCardIcon>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </AnoCardIcon>
                  <AnoCardNome>{ano.nome}</AnoCardNome>
                  <AnoCardArrow>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </AnoCardArrow>
                </AnoCard>
              ))}
            </AnosGrid>
          )
        )}
      </ContentArea>
    </PageWrapper>
  )
}
