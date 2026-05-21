import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
].join(' ')

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  const tokens = await res.json()
  if (!res.ok) throw new Error(tokens.error ?? 'Falha ao renovar token')
  return {
    accessToken:  tokens.access_token as string,
    expiresAt:    Math.floor(Date.now() / 1000) + (tokens.expires_in as number),
    refreshToken: (tokens.refresh_token as string | undefined) ?? refreshToken,
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:       `openid email profile ${DRIVE_SCOPES}`,
          access_type: 'offline',
          prompt:      'consent',
        },
      },
      checks: ['state'],
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Primeiro login — salva tokens do Google
      if (account) {
        return {
          ...token,
          accessToken:  account.access_token,
          refreshToken: account.refresh_token,
          expiresAt:    account.expires_at,
        }
      }

      // Token ainda válido
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // Token expirado → renova
      try {
        const refreshed = await refreshAccessToken(token.refreshToken as string)
        return { ...token, ...refreshed }
      } catch (err) {
        console.error('[auth] Erro ao renovar token:', err)
        return { ...token, error: 'RefreshAccessTokenError' }
      }
    },

    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        error:       token.error as string | undefined,
      }
    },
  },

  cookies: {
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false,
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false,
      },
    },
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false,
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: false,
      },
    },
  },

  pages: {
    signIn: '/login',
  },

}
