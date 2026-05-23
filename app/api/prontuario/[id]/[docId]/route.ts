import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { driveService } from '@/services/driveService'
import { IConsulta } from '@/@types'

interface IRouteParams {
  params: { id: string; docId: string }
}

export async function PUT(request: NextRequest, { params }: IRouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { consulta: IConsulta; novaDescricao: string }
    if (!body.consulta || !body.novaDescricao?.trim()) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    await driveService.editarConsulta(params.docId, body.consulta, body.novaDescricao.trim(), session.accessToken)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao editar consulta:', error)
    return NextResponse.json({ error: 'Erro ao editar consulta' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: IRouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { consulta: IConsulta }
    if (!body.consulta) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    await driveService.apagarConsulta(params.docId, body.consulta, session.accessToken)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao apagar consulta:', error)
    return NextResponse.json({ error: 'Erro ao apagar consulta' }, { status: 500 })
  }
}
