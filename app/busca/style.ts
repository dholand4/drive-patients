'use client'

import styled from 'styled-components'

export const PageWrapper = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl * 2}px;
  box-sizing: border-box;
`

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

export const SearchWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`

export const ListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

export const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.danger};
  margin: 0 0 ${({ theme }) => theme.spacing.md}px;
`

export const FabButton = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl}px;
  right: ${({ theme }) => theme.spacing.xl}px;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  border: none;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(29, 158, 117, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, transform 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: scale(1.05);
  }
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.md}px;
`

export const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

export const ModalInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`

const BaseBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ModalCancelBtn = styled(BaseBtn)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const ModalConfirmBtn = styled(BaseBtn)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`

// ── Modal de Acesso Rápido ───────────────────────────────────────────────────

export const QuickModalBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 80vh;
`

export const QuickModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const QuickModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`

export const QuickModalClose = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  &:hover { background: ${({ theme }) => theme.colors.background}; }
`

export const QuickSearchWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const QuickList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
`

export const QuickItem = styled.li<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  cursor: ${({ $loading }) => ($loading ? 'wait' : 'pointer')};
  transition: background-color 0.12s;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.background}; }
`

export const QuickItemNome = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const QuickItemSub = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const QuickEmpty = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  margin: 0;
`

export const NewPatientLink = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  background: transparent;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  &:hover { background: ${({ theme }) => theme.colors.primaryLight}; }
`
