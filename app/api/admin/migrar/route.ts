import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

const MIME_FOLDER = 'application/vnd.google-apps.folder'
const MIME_GDOC   = 'application/vnd.google-apps.document'
const MIME_DOCX   = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const FOLDER_ID   = process.env.GOOGLE_DRIVE_FOLDER_ID ?? ''
const DRIVE_FLAGS = { supportsAllDrives: true, includeItemsFromAllDrives: true } as const
const BACK_DIR    = path.join(process.cwd(), 'back')

// Palavras-chave que indicam arquivo de registros → vai para Prontuário
const PRONTUARIO_KW = ['regist', 'relato', 'sess']

function getDrive(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  )
  auth.setCredentials({ access_token: accessToken })
  return google.drive({ version: 'v3', auth })
}

function isProntuario(filename: string): boolean {
  const lower = filename.toLowerCase()
  return PRONTUARIO_KW.some((kw) => lower.includes(kw))
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const map: Record<string, string> = {
    '.docx': MIME_DOCX,
    '.doc':  'application/msword',
    '.pdf':  'application/pdf',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls':  'application/vnd.ms-excel',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png':  'image/png',
    '.heic': 'image/heic',
    '.html': 'text/html',
  }
  return map[ext] ?? 'application/octet-stream'
}

async function criarPasta(drive: ReturnType<typeof getDrive>, nome: string, parentId: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: { name: nome, mimeType: MIME_FOLDER, parents: [parentId] },
    fields: 'id',
    ...DRIVE_FLAGS,
  })
  return res.data.id as string
}

async function uploadArquivo(
  drive: ReturnType<typeof getDrive>,
  filePath: string,
  parentId: string,
  convertToGDoc: boolean,
): Promise<void> {
  const filename  = path.basename(filePath)
  const mimeOrig  = getMimeType(filename)
  const nomeDrive = convertToGDoc ? filename.replace(/\.(docx|doc)$/i, '') : filename

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (drive.files.create as any)({
    requestBody: {
      name:     nomeDrive,
      parents:  [parentId],
      mimeType: convertToGDoc ? MIME_GDOC : undefined,
    },
    media: {
      mimeType: mimeOrig,
      body:     fs.createReadStream(filePath),
    },
    fields: 'id',
    ...DRIVE_FLAGS,
  })
}

async function encontrarPastaExistente(
  drive: ReturnType<typeof getDrive>,
  nome: string,
  parentId: string,
): Promise<string | null> {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${nome.replace(/'/g, "\\'")}' and trashed = false`,
    fields: 'files(id)',
    ...DRIVE_FLAGS,
  })
  return res.data.files?.[0]?.id ?? null
}

async function encontrarOuCriarPasta(
  drive: ReturnType<typeof getDrive>,
  nome: string,
  parentId: string,
): Promise<{ id: string; criado: boolean }> {
  const existente = await encontrarPastaExistente(drive, nome, parentId)
  if (existente) return { id: existente, criado: false }
  const id = await criarPasta(drive, nome, parentId)
  return { id, criado: true }
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  if (!fs.existsSync(BACK_DIR)) {
    return NextResponse.json(
      { error: 'Pasta back/ não encontrada. Este endpoint só funciona localmente.' },
      { status: 400 },
    )
  }

  const drive = getDrive(session.accessToken)
  const log: string[] = []
  let pacientesOk = 0

  const pacientesDirs = fs
    .readdirSync(BACK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const nomePaciente of pacientesDirs) {
    const pacienteDir = path.join(BACK_DIR, nomePaciente)

    try {
      // Cria (ou reutiliza) pasta do paciente no Drive
      const { id: pastaId, criado: pastaCriada } = await encontrarOuCriarPasta(drive, nomePaciente, FOLDER_ID)
      if (!pastaCriada) log.push(`⏭️  ${nomePaciente} — pasta já existe, verificando arquivos...`)

      // Cria (ou reutiliza) subpastas
      const { id: prontuarioId } = await encontrarOuCriarPasta(drive, 'Prontuário', pastaId)
      const { id: outroId }      = await encontrarOuCriarPasta(drive, 'Outro', pastaId)

      // Lista arquivos já existentes nas subpastas para evitar duplicatas
      const [jaEmPront, jaEmOutro] = await Promise.all([
        drive.files.list({
          q: `'${prontuarioId}' in parents and trashed = false`,
          fields: 'files(name)',
          ...DRIVE_FLAGS,
        }).then((r) => new Set((r.data.files ?? []).map((f) => f.name as string))),
        drive.files.list({
          q: `'${outroId}' in parents and trashed = false`,
          fields: 'files(name)',
          ...DRIVE_FLAGS,
        }).then((r) => new Set((r.data.files ?? []).map((f) => f.name as string))),
      ])

      // Classifica e faz upload dos arquivos
      const arquivos = fs
        .readdirSync(pacienteDir, { withFileTypes: true })
        .filter((f) => f.isFile())

      for (const arquivo of arquivos) {
        const filePath = path.join(pacienteDir, arquivo.name)
        const ehDocx   = /\.(docx|doc)$/i.test(arquivo.name)
        const ehPront  = isProntuario(arquivo.name)
        const destId   = ehPront ? prontuarioId : outroId

        // Nome que vai aparecer no Drive (sem extensão se for convertido para GDoc)
        const nomeDrive = ehDocx && ehPront ? arquivo.name.replace(/\.(docx|doc)$/i, '') : arquivo.name
        const jaExiste  = ehPront ? jaEmPront.has(nomeDrive) : jaEmOutro.has(nomeDrive)

        if (jaExiste) {
          log.push(`  ⏭️  ${nomePaciente}/${arquivo.name} — já existe, pulando`)
          continue
        }

        // Converte para Google Doc apenas se for docx E for de prontuário
        const converter = ehDocx && ehPront
        await uploadArquivo(drive, filePath, destId, converter)

        log.push(`  ✅ ${nomePaciente}/${arquivo.name} → ${ehPront ? 'Prontuário' : 'Outro'}`)
      }

      pacientesOk++
      log.push(`✅ ${nomePaciente} — OK`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log.push(`❌ ${nomePaciente} — ERRO: ${msg}`)
    }
  }

  return NextResponse.json({ pacientesOk, total: pacientesDirs.length, log })
}
