'use client'

import { ISearchInputProps } from './types'
import { Container, Input, IconWrapper } from './style'

export function SearchInputGlobal({ value, onChange, loading, placeholder = 'Buscar paciente...' }: ISearchInputProps) {
  return (
    <Container>
      <IconWrapper aria-hidden>
        {loading ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </IconWrapper>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        $loading={loading}
      />
    </Container>
  )
}
