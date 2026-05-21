import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/constants/theme'
import { PatientCardGlobal } from '../index'

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

const PACIENTE = {
  id: '1',
  nome: 'João Silva',
  ultimaEdicao: '2024-05-10T14:00:00Z',
}

describe('PatientCardGlobal', () => {
  it('renderiza o nome do paciente', () => {
    const { getByText } = wrap(<PatientCardGlobal paciente={PACIENTE} onClick={() => {}} />)
    expect(getByText('João Silva')).toBeInTheDocument()
  })

  it('renderiza as iniciais no avatar', () => {
    const { getByText } = wrap(<PatientCardGlobal paciente={PACIENTE} onClick={() => {}} />)
    expect(getByText('JS')).toBeInTheDocument()
  })

  it('dispara onClick ao clicar no card', () => {
    const fn = jest.fn()
    const { getByRole } = wrap(<PatientCardGlobal paciente={PACIENTE} onClick={fn} />)
    fireEvent.click(getByRole('button'))
    expect(fn).toHaveBeenCalledWith(PACIENTE)
  })

  it('dispara onClick ao pressionar Enter', () => {
    const fn = jest.fn()
    const { getByRole } = wrap(<PatientCardGlobal paciente={PACIENTE} onClick={fn} />)
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('exibe a data de última edição', () => {
    const { getByText } = wrap(<PatientCardGlobal paciente={PACIENTE} onClick={() => {}} />)
    expect(getByText(/10\/05\/2024/)).toBeInTheDocument()
  })
})
