import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { google } from 'googleapis'

const MIME_FOLDER = 'application/vnd.google-apps.folder'
const MIME_GDOC   = 'application/vnd.google-apps.document'
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
  const log: string[] = []

  // 1. Lista todas as pastas de pacientes
  const pacientesRes = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType = '${MIME_FOLDER}' and trashed = false`,
    fields: 'files(id, name)',
    orderBy: 'name asc',
    ...DRIVE_FLAGS,
  })
  const pacientes = pacientesRes.data.files ?? []

  for (const paciente of pacientes) {
    const pastaId = paciente.id as string
    const nomePaciente = paciente.name as string

    // 2. Encontra a subpasta Prontuário
    const prontuarioRes = await drive.files.list({
      q: `'${pastaId}' in parents and mimeType = '${MIME_FOLDER}' and trashed = false`,
      fields: 'files(id, name)',
      ...DRIVE_FLAGS,
    })
    const prontuarioPasta = (prontuarioRes.data.files ?? []).find((f) =>
      f.name?.toLowerCase().replace(/[áàãâä]/g, 'a').includes('rontuario')
    )

    if (!prontuarioPasta) {
      log.push(`⚠️  ${nomePaciente} — sem pasta Prontuário, pulando`)
      continue
    }

    // 3. Lista arquivos dentro de Prontuário
    const arquivosRes = await drive.files.list({
      q: `'${prontuarioPasta.id}' in parents and trashed = false`,
      fields: 'files(id, name)',
      ...DRIVE_FLAGS,
    })
    const arquivos = arquivosRes.data.files ?? []

    if (arquivos.length === 0) {
      await drive.files.create({
        requestBody: { name: '2026', mimeType: MIME_GDOC, parents: [prontuarioPasta.id as string] },
        fields: 'id',
        ...DRIVE_FLAGS,
      })
      log.push(`🆕 ${nomePaciente} — Prontuário vazio, criado doc "2026"`)
      continue
    }

    for (const arquivo of arquivos) {
      if (arquivo.name === '2026') {
        log.push(`⏭️  ${nomePaciente}/${arquivo.name} — já é 2026, pulando`)
        continue
      }

      await drive.files.update({
        fileId: arquivo.id as string,
        requestBody: { name: '2026' },
        ...DRIVE_FLAGS,
      })
      log.push(`✅ ${nomePaciente}: "${arquivo.name}" → "2026"`)
    }
  }

  return NextResponse.json({ total: pacientes.length, log })
}
