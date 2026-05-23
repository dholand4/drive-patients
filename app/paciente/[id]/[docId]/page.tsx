'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConsultaItemGlobal } from '@/components/consultaItemGlobal'
import { ConsultaFormGlobal } from '@/components/consultaFormGlobal'
import { useProntuarioDoc } from '@/hooks/useProntuarioDoc'
import { useNovaConsulta } from '@/hooks/useNovaConsulta'
import {
  PageWrapper,
  HeaderBar,
  BackButton,
  PatientName,
  ContentArea,
  ConsultasList,
  LoadingText,
  ErrorText,
  FormWrapper,
} from '../style'

interface IDocPageProps {
  params: { id: string; docId: string }
}

export default function ProntuarioDocPage({ params }: IDocPageProps) {
  const router = useRouter()
  const { prontuario, loading, saving, error, saveError, salvarConsulta, editarConsulta, apagarConsulta } =
    useProntuarioDoc(params.id, params.docId)
  const { data, descricao, setData, setDescricao, reset, toConsulta, isValid } = useNovaConsulta()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!isValid) return
    setSuccessMessage(null)
    const ok = await salvarConsulta(toConsulta())
    if (ok) {
      reset()
      setSuccessMessage('Consulta salva com sucesso!')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  // Título: "Nome do paciente — 2026"
  const titulo = prontuario
    ? `${prontuario.pacienteNome} — ${prontuario.anos.find((a) => a.id === params.docId)?.nome ?? ''}`
    : '...'

  return (
    <PageWrapper>
      <HeaderBar>
        <BackButton onClick={() => router.push('/busca')} aria-label="Voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </BackButton>
        <PatientName title={titulo}>{titulo}</PatientName>
      </HeaderBar>

      <ContentArea>
        {loading && <LoadingText>Carregando consultas...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        {!loading && !error && prontuario && (
          <ConsultasList>
            {prontuario.consultas.length === 0 && (
              <LoadingText>Nenhuma consulta registrada neste ano.</LoadingText>
            )}
            {prontuario.consultas.map((c, i) => (
              <li key={`${c.data}-${i}`}>
                <ConsultaItemGlobal
                  consulta={c}
                  onEditar={editarConsulta}
                  onApagar={apagarConsulta}
                />
              </li>
            ))}
          </ConsultasList>
        )}
      </ContentArea>

      <FormWrapper>
        <ConsultaFormGlobal
          data={data}
          descricao={descricao}
          onDataChange={setData}
          onDescricaoChange={setDescricao}
          onSubmit={handleSubmit}
          loading={saving}
          successMessage={successMessage}
          errorMessage={saveError}
          disabled={!isValid}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
