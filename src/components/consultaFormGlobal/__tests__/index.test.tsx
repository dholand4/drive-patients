import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/constants/theme'
import { ConsultaFormGlobal } from '../index'

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

const BASE_PROPS = {
  data: '2025-05-20',
  descricao: '',
  onDataChange: jest.fn(),
  onDescricaoChange: jest.fn(),
  onSubmit: jest.fn(),
}

afterEach(() => jest.clearAllMocks())

describe('ConsultaFormGlobal', () => {
  it('renderiza o campo de data com o valor fornecido', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} />)
    const input = screen.getByLabelText('Data da consulta') as HTMLInputElement
    expect(input.value).toBe('2025-05-20')
  })

  it('renderiza o textarea com placeholder correto', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} />)
    expect(screen.getByPlaceholderText('Queixa, diagnóstico, prescrição...')).toBeInTheDocument()
  })

  it('chama onDescricaoChange ao digitar na textarea', () => {
    const onDescricaoChange = jest.fn()
    wrap(<ConsultaFormGlobal {...BASE_PROPS} onDescricaoChange={onDescricaoChange} />)
    fireEvent.change(screen.getByLabelText('Descrição da consulta'), { target: { value: 'Dor lombar' } })
    expect(onDescricaoChange).toHaveBeenCalledWith('Dor lombar')
  })

  it('chama onSubmit ao enviar o formulário', () => {
    const onSubmit = jest.fn()
    wrap(<ConsultaFormGlobal {...BASE_PROPS} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByRole('form', { name: 'Adicionar nova consulta' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('desabilita o botão quando loading=true', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} loading />)
    expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled()
  })

  it('exibe mensagem de sucesso', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} successMessage="Consulta salva!" />)
    expect(screen.getByRole('status')).toHaveTextContent('Consulta salva!')
  })

  it('exibe mensagem de erro', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} errorMessage="Erro ao salvar." />)
    expect(screen.getByRole('alert')).toHaveTextContent('Erro ao salvar.')
  })

  it('desabilita o botão quando disabled=true', () => {
    wrap(<ConsultaFormGlobal {...BASE_PROPS} disabled />)
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()
  })
})
