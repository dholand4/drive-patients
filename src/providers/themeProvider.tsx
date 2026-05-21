'use client'

import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from '@/constants/theme'

interface IThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: IThemeProviderProps) {
  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  )
}
