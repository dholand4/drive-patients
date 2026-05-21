import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { driveService } from '@/services/driveService'
import { parseConsultas } from '@/utils/parseConsultas'
import { formatConsulta } from '@/utils/formatConsulta'
import { IConsulta } from '@/@types'

interface IRouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: IRouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const docId = searchParams.get('docId') ?? undefined

    const { conteudo, nome, anos } = await driveService.lerArquivoComNome(
      params.id,
      session.accessToken,
      docId,
    )
    const consultas = parseConsultas(conteudo)
    return NextResponse.json({
      pacienteId:   params.id,
      pacienteNome: nome,
      consultas,
      conteudoRaw:  conteudo,
      anos,
    })
  } catch (error) {
    console.error('Erro ao ler prontuário:', error)
    return NextResponse.json({ error: 'Erro ao carregar prontuário' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: IRouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as Partial<IConsulta>
    const data      = typeof body.data      === 'string' ? body.data.trim()      : ''
    const descricao = typeof body.descricao === 'string' ? body.descricao.trim() : ''

    if (!data || !descricao) {
      return NextResponse.json({ error: 'data e descricao são obrigatórios' }, { status: 400 })
    }

    const texto = formatConsulta({ data, descricao })
    await driveService.appendSessao(params.id, texto, session.accessToken)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar consulta:', error)
    return NextResponse.json({ error: 'Erro ao salvar consulta' }, { status: 500 })
  }
}
