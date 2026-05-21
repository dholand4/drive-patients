import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/themeProvider'
import StyledComponentsRegistry from '@/providers/styledRegistry'
import { AuthProvider } from '@/providers/sessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#1D9E75',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Prontuários QP',
  description: 'Gerenciamento de prontuários médicos',
  appleWebApp: {
    capable: true,
    title: 'Prontuários QP',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ margin: 0, background: '#FAFAF9' }}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
