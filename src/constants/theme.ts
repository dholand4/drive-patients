export const theme = {
  colors: {
    primary: '#1D9E75',
    primaryLight: '#E1F5EE',
    primaryDark: '#0F6E56',
    background: '#FAFAF9',
    surface: '#FFFFFF',
    border: 'rgba(0,0,0,0.1)',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    danger: '#E24B4A',
    success: '#1D9E75',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    sizes: {
      xs: '12px',
      sm: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
    },
  },
} as const

export type Theme = typeof theme
