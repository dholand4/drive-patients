'use client'

import styled from 'styled-components'

export const AnosGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-top: ${({ theme }) => theme.spacing.sm}px;
`

export const AnoCard = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md}px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(29, 158, 117, 0.12);
  }
`

export const AnoCardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`

export const AnoCardNome = styled.span`
  flex: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const AnoCardArrow = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
`

export const EmptyAnos = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl}px 0;
`
