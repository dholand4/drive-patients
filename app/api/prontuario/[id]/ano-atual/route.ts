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
    const docId = await driveService.obterDocAnoAtual(params.id, session.accessToken)
    return NextResponse.json({ docId })
  } catch (error) {
    console.error('Erro ao obter doc do ano atual:', error)
    return NextResponse.json({ error: 'Erro ao obter doc do ano atual' }, { status: 500 })
  }
}
