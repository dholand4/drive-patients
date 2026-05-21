import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { google } from 'googleapis'

const MIME_FOLDER = 'application/vnd.google-apps.folder'
const FOLDER_ID   = process.env.GOOGLE_DRIVE_FOLDER_ID ?? ''
const DRIVE_FLAGS = { supportsAllDrives: true, includeItemsFromAllDrives: true } as const

function getDrive(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  )
  auth.setCredentials({ access_token: accessToken })
  return google.drive({ version: 'v3', auth })
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const drive = getDrive(session.accessToken)
  const resultados: { nome: string; id: string; criado: string[]; pulado: string[] }[] = []

  // 1. Lista todas as pastas de pacientes
  const listRes = await drive.files.list({
    q: `mimeType = '${MIME_FOLDER}' and '${FOLDER_ID}' in parents and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name asc',
    ...DRIVE_FLAGS,
  })
  const pacientes = listRes.data.files ?? []

  for (const paciente of pacientes) {
    const pastaId = paciente.id as string
    const criado: string[] = []
    const pulado: string[] = []

    // 2. Verifica o que já existe dentro da pasta do paciente
    const filhosRes = await drive.files.list({
      q: `'${pastaId}' in parents and mimeType = '${MIME_FOLDER}' and trashed = false`,
      fields: 'files(id, name)',
      ...DRIVE_FLAGS,
    })
    const filhos = filhosRes.data.files ?? []
    const nomes = filhos.map((f) => f.name?.toLowerCase().replace(/[áàãâä]/g, 'a') ?? '')

    // 3. Cria "Prontuário" se não existir
    const temProntuario = nomes.some((n) => n.includes('rontuario'))
    if (!temProntuario) {
      await drive.files.create({
        requestBody: { name: 'Prontuário', mimeType: MIME_FOLDER, parents: [pastaId] },
        fields: 'id',
        ...DRIVE_FLAGS,
      })
      criado.push('Prontuário')
    } else {
      pulado.push('Prontuário (já existe)')
    }

    // 4. Cria "Outro" se não existir
    const temOutro = nomes.some((n) => n.includes('outro'))
    if (!temOutro) {
      await drive.files.create({
        requestBody: { name: 'Outro', mimeType: MIME_FOLDER, parents: [pastaId] },
        fields: 'id',
        ...DRIVE_FLAGS,
      })
      criado.push('Outro')
    } else {
      pulado.push('Outro (já existe)')
    }

    resultados.push({ nome: paciente.name as string, id: pastaId, criado, pulado })
  }

  return NextResponse.json({ total: pacientes.length, resultados })
}
