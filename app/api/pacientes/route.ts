import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { driveService } from '@/services/driveService'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get('q') ?? ''
  try {
    const pacientes = await driveService.buscarArquivos(q.trim(), session.accessToken)
    return NextResponse.json(pacientes)
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return NextResponse.json({ error: 'Erro interno ao buscar pacientes' }, { status: 500 })
  }
}
