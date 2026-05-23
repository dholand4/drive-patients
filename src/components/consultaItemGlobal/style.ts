import styled from 'styled-components'

export const Container = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Acoes = styled.div`
  display: flex;
  gap: 4px;
`

export const AcaoBtn = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  color: ${({ theme, $danger }) => $danger ? theme.colors.danger : theme.colors.textSecondary};
  display: flex;
  align-items: center;
  transition: background-color 0.12s;

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? 'rgba(226,75,74,0.08)' : theme.colors.background};
  }
`

export const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
`

export const EditAcoes = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

const BaseBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

export const SalvarBtn = styled(BaseBtn)`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  &:hover:not(:disabled) { opacity: 0.85; }
`

export const CancelarBtn = styled(BaseBtn)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background}; }
`

export const DataLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`

export const Descricao = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`
