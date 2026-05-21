'use client'

import { signIn } from 'next-auth/react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  gap: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg}px;
  max-width: 360px;
  width: 100%;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin: 0;
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin: 0;
  line-height: 1.5;
`

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }
`

export default function LoginPage() {
  return (
    <Wrapper>
      <Card>
        <Title>Prontuários</Title>
        <Subtitle>
          Acesse com a sua conta Google para visualizar e editar os registros dos pacientes.
        </Subtitle>
        <LoginButton onClick={() => signIn('google', { callbackUrl: '/busca' })}>
          Entrar com Google
        </LoginButton>
      </Card>
    </Wrapper>
  )
}
