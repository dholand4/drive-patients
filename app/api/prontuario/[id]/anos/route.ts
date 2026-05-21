import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { driveService } from '@/services/driveService'

interface IRouteParams {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: IRouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const anos = await driveService.listarAnos(params.id, session.accessToken)
    return NextResponse.json({ anos })
  } catch (error) {
    console.error('Erro ao listar anos:', error)
    return NextResponse.json({ error: 'Erro ao listar anos' }, { status: 500 })
  }
}
