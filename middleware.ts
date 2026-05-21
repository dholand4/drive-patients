export { default } from 'next-auth/middleware'

export const config = {
  // Protege todas as rotas exceto login e api/auth
  matcher: ['/busca', '/paciente/:path*'],
}
