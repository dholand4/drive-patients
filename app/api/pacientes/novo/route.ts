import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { driveService } from '@/services/driveService'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { nome?: unknown }
    const nome = typeof body.nome === 'string' ? body.nome.trim() : ''
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    const paciente = await driveService.criarArquivo(nome, session.accessToken)
    return NextResponse.json(paciente, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    return NextResponse.json({ error: 'Erro interno ao criar paciente' }, { status: 500 })
  }
}
