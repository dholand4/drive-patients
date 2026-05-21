'use client'

import { IConsultaFormProps } from './types'
import { Form, Row, DateInput, Textarea, SubmitButton, FeedbackMessage } from './style'

export function ConsultaFormGlobal({
  data,
  descricao,
  onDataChange,
  onDescricaoChange,
  onSubmit,
  loading,
  successMessage,
  errorMessage,
  disabled,
}: IConsultaFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Form onSubmit={handleSubmit} aria-label="Adicionar nova consulta">
      <Row>
        <DateInput
          type="date"
          value={data}
          onChange={(e) => onDataChange(e.target.value)}
          aria-label="Data da consulta"
          required
        />
      </Row>
      <Textarea
        value={descricao}
        onChange={(e) => onDescricaoChange(e.target.value)}
        placeholder="Queixa, diagnóstico, prescrição..."
        aria-label="Descrição da consulta"
        rows={4}
        required
      />
      {successMessage && (
        <FeedbackMessage $type="success" role="status">{successMessage}</FeedbackMessage>
      )}
      {errorMessage && (
        <FeedbackMessage $type="error" role="alert">{errorMessage}</FeedbackMessage>
      )}
      <SubmitButton
        type="submit"
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </SubmitButton>
    </Form>
  )
}
