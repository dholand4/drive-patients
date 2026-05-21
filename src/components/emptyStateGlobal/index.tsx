'use client'

import { IEmptyStateProps } from './types'
import { Container, Icon, Message, ActionButton } from './style'

export function EmptyStateGlobal({ message, actionLabel, onAction }: IEmptyStateProps) {
  return (
    <Container>
      <Icon aria-hidden>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </Icon>
      <Message>{message}</Message>
      {actionLabel && onAction && (
        <ActionButton onClick={onAction}>{actionLabel}</ActionButton>
      )}
    </Container>
  )
}
