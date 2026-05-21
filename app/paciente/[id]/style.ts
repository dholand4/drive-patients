'use client'

import styled from 'styled-components'

export const PageWrapper = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`

export const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`

export const BackButton = styled.button`
  background: transparent;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

export const PatientName = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
  overflow-y: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`

export const ConsultasList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md}px;
`

export const LoadingText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl}px 0;
`

export const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg}px 0;
`

export const FormWrapper = styled.div`
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
`

export const AnosBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const AnoTab = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 4px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  border: 1.5px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? '#fff' : theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.primary)};
  }
`
