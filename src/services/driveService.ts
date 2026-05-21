import { google } from 'googleapis'
import mammoth from 'mammoth'
import iconv from 'iconv-lite'
import { IDocAno, IPaciente } from '@/@types'

const MIME_FOLDER = 'application/vnd.google-apps.folder'
const MIME_GDOC   = 'application/vnd.google-apps.document'
const MIME_DOCX   = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const FOLDER_ID   = process.env.GOOGLE_DRIVE_FOLDER_ID ?? ''

const DRIVE_FLAGS = {
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
} as const

function getAuth(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  )
  auth.setCredentials({ access_token: accessToken })
  return auth
}

function getDrive(accessToken: string) {
  return google.drive({ version: 'v3', auth: getAuth(accessToken) })
}

function getDocs(accessToken: string) {
  return google.docs({ version: 'v1', auth: getAuth(accessToken) })
}

interface IDocInfo {
  id:       string
  nome:     string
  mimeType: string
}

// ─── Helpers de estrutura ────────────────────────────────────────────────────

/**
 * Procura a subpasta "Prontuário" dentro da pasta do paciente.
 * Aceita qualquer nome que contenha "rontuario" (sem acento, case-insensitive).
 * Retorna null se não encontrar (fallback para estrutura antiga).
 */
async function encontrarPastaProntuario(
  pacienteFolderId: string,
  accessToken: string,
): Promise<string | null> {
  const drive = getDrive(accessToken)
  const res = await drive.files.list({
    q: `'${pacienteFolderId}' in parents and mimeType = '${MIME_FOLDER}' and trashed = false`,
    fields: 'files(id, name)',
    ...DRIVE_FLAGS,
  })
  const found = (res.data.files ?? []).find((f) =>
    f.name?.toLowerCase().replace(/[áàãâä]/g, 'a').includes('rontuario')
  )
  return found?.id ?? null
}

/**
 * Lista todos os Google Docs dentro de uma pasta (busca por docs de ano).
 * Ordena por nome crescente para que anos mais antigos venham primeiro.
 */
async function listarDocsNaPasta(
  folderId: string,
  accessToken: string,
): Promise<IDocInfo[]> {
  const drive = getDrive(accessToken)
  const mimeFilter = `(mimeType = '${MIME_GDOC}' or mimeType = '${MIME_DOCX}')`
  const res = await drive.files.list({
    q: `'${folderId}' in parents and ${mimeFilter} and trashed = false`,
    fields: 'files(id, name, mimeType)',
    orderBy: 'name asc',
    ...DRIVE_FLAGS,
  })
  return (res.data.files ?? []).map((f) => ({
    id:       f.id as string,
    nome:     f.name as string,
    mimeType: f.mimeType as string,
  }))
}

/**
 * Encontra o doc do ano corrente dentro da pasta de prontuários.
 * Se não existir, cria um Google Doc com o ano como nome.
 */
async function encontrarOuCriarDocAno(
  prontuarioPastaId: string,
  accessToken: string,
): Promise<IDocInfo> {
  const drive = getDrive(accessToken)
  const ano = new Date().getFullYear().toString()
  const res = await drive.files.list({
    q: `'${prontuarioPastaId}' in parents and mimeType = '${MIME_GDOC}' and name = '${ano}' and trashed = false`,
    fields: 'files(id, name, mimeType)',
    ...DRIVE_FLAGS,
  })
  const existe = res.data.files?.[0]
  if (existe) {
    return { id: existe.id as string, nome: existe.name as string, mimeType: MIME_GDOC }
  }
  const criado = await drive.files.create({
    requestBody: { name: ano, mimeType: MIME_GDOC, parents: [prontuarioPastaId] },
    fields: 'id, name',
    ...DRIVE_FLAGS,
  })
  return { id: criado.data.id as string, nome: ano, mimeType: MIME_GDOC }
}

// ─── Helpers de conteúdo ─────────────────────────────────────────────────────

async function exportarGoogleDoc(fileId: string, accessToken: string): Promise<string> {
  const drive = getDrive(accessToken)
  const res = await drive.files.export(
    { fileId, mimeType: 'text/plain' },
    { responseType: 'text' }
  )
  return res.data as string
}

/**
 * Safety net para .docx de sistemas Windows antigos onde mammoth
 * pode interpretar bytes XML como CP1252 em vez de UTF-8.
 */
function corrigirEncoding(texto: string): string {
  if (!/Ã[Ā-˿]/.test(texto)) return texto
  try {
    return iconv.encode(texto, 'win1252').toString('utf-8')
  } catch {
    return texto
  }
}

async function extrairTextoDocx(fileId: string, accessToken: string): Promise<string> {
  const drive = getDrive(accessToken)
  const res = await drive.files.get(
    { fileId, alt: 'media', ...DRIVE_FLAGS },
    { responseType: 'stream' }
  )
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    const stream = res.data as NodeJS.ReadableStream
    stream.on('data', (chunk: unknown) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as ArrayBuffer))
    )
    stream.on('end', resolve)
    stream.on('error', reject)
  })
  const buffer = Buffer.concat(chunks)
  const result = await mammoth.extractRawText({ buffer })
  return corrigirEncoding(result.value)
}

async function lerDoc(doc: IDocInfo, accessToken: string): Promise<string> {
  return doc.mimeType === MIME_GDOC
    ? exportarGoogleDoc(doc.id, accessToken)
    : extrairTextoDocx(doc.id, accessToken)
}

async function converterDocxParaGoogleDoc(
  docx: IDocInfo,
  folderId: string,
  accessToken: string,
): Promise<string> {
  const drive = getDrive(accessToken)
  const nomeDoc = docx.nome.replace(/\.docx$/i, '')
  const converted = await drive.files.copy({
    fileId: docx.id,
    requestBody: { name: nomeDoc, mimeType: MIME_GDOC, parents: [folderId] },
    ...DRIVE_FLAGS,
  })
  return converted.data.id as string
}

// ─── Serviço público ──────────────────────────────────────────────────────────

export const driveService = {
  async buscarArquivos(q: string, accessToken: string): Promise<IPaciente[]> {
    const drive = getDrive(accessToken)
    const nameFilter = q.trim() ? `and name contains '${q.trim()}' ` : ''
    const res = await drive.files.list({
      q: `mimeType = '${MIME_FOLDER}' ${nameFilter}and '${FOLDER_ID}' in parents and trashed = false and not name = 'arquivados'`,
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'name asc',
      ...DRIVE_FLAGS,
    })
    return (res.data.files ?? [])
      .filter((f) => f.id && f.name)
      .map((f) => ({
        id:          f.id as string,
        nome:        f.name as string,
        ultimaEdicao: f.modifiedTime ?? '',
      }))
  },

  /**
   * Lista os docs de ano disponíveis na pasta Prontuário do paciente.
   * Retorna array vazio se não houver estrutura nova.
   */
  async listarAnos(folderId: string, accessToken: string): Promise<IDocAno[]> {
    const prontuarioPastaId = await encontrarPastaProntuario(folderId, accessToken)
    if (!prontuarioPastaId) return []
    const docs = await listarDocsNaPasta(prontuarioPastaId, accessToken)
    return docs.map((d) => ({ id: d.id, nome: d.nome }))
  },

  /**
   * Lê o prontuário do paciente.
   *
   * Nova estrutura: 📁 Paciente → 📁 Prontuário → 📄 2025, 📄 2026...
   *   - Se `docId` for passado: lê apenas aquele doc.
   *   - Caso contrário: lê todos os docs de ano em paralelo (ordem cronológica).
   *
   * Fallback (estrutura antiga): doc direto na pasta do paciente.
   */
  async lerArquivoComNome(
    folderId: string,
    accessToken: string,
    docId?: string,
  ): Promise<{ conteudo: string; nome: string; anos: IDocAno[] }> {
    const drive = getDrive(accessToken)
    const pasta = await drive.files.get({ fileId: folderId, fields: 'name', ...DRIVE_FLAGS })
    const nomePaciente = pasta.data.name as string

    const prontuarioPastaId = await encontrarPastaProntuario(folderId, accessToken)

    if (prontuarioPastaId) {
      const todosOsDocs = await listarDocsNaPasta(prontuarioPastaId, accessToken)
      const anos: IDocAno[] = todosOsDocs.map((d) => ({ id: d.id, nome: d.nome }))

      if (todosOsDocs.length === 0) return { conteudo: '', nome: nomePaciente, anos }

      // Filtra por doc específico ou lê todos
      const docsParaLer = docId
        ? todosOsDocs.filter((d) => d.id === docId)
        : todosOsDocs

      if (docsParaLer.length === 0) return { conteudo: '', nome: nomePaciente, anos }

      const textos = await Promise.all(docsParaLer.map((d) => lerDoc(d, accessToken)))
      return { conteudo: textos.join('\n'), nome: nomePaciente, anos }
    }

    // Fallback: estrutura antiga — doc direto na pasta do paciente
    const docs = await listarDocsNaPasta(folderId, accessToken)
    if (docs.length === 0) return { conteudo: '', nome: nomePaciente, anos: [] }
    const escolhido =
      docs.find((d) => d.nome.toLowerCase().includes('registros')) ?? docs[docs.length - 1]
    const conteudo = await lerDoc(escolhido, accessToken)
    return { conteudo, nome: nomePaciente, anos: [] }
  },

  /**
   * Appenda uma nova sessão ao doc do ano corrente.
   *
   * Nova estrutura: encontra subpasta "Prontuário" → encontra/cria doc do ano atual.
   * Fallback: usa o doc direto na pasta do paciente (comportamento anterior).
   */
  async appendSessao(folderId: string, texto: string, accessToken: string): Promise<void> {
    const prontuarioPastaId = await encontrarPastaProntuario(folderId, accessToken)

    let docId: string

    if (prontuarioPastaId) {
      // Nova estrutura: usa (ou cria) o doc do ano atual
      const docInfo = await encontrarOuCriarDocAno(prontuarioPastaId, accessToken)
      docId = docInfo.id
    } else {
      // Fallback: estrutura antiga
      const docs = await listarDocsNaPasta(folderId, accessToken)
      if (docs.length === 0) throw new Error('Documento de registros não encontrado na pasta.')
      let doc = docs.find((d) => d.nome.toLowerCase().includes('registros')) ?? docs[0]
      if (doc.mimeType === MIME_DOCX) {
        const novoId = await converterDocxParaGoogleDoc(doc, folderId, accessToken)
        doc = { id: novoId, nome: doc.nome.replace(/\.docx$/i, ''), mimeType: MIME_GDOC }
      }
      docId = doc.id
    }

    const docs = getDocs(accessToken)
    const docData = await docs.documents.get({ documentId: docId })
    const content = docData.data.body?.content ?? []
    const lastElement = content[content.length - 1]
    const endIndex = (lastElement?.endIndex ?? 1) - 1
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [{ insertText: { location: { index: endIndex }, text: `\n${texto}` } }],
      },
    })
  },

  /**
   * Cria pasta do paciente com estrutura nova:
   *   📁 Nome → 📁 Prontuário → 📄 [ano atual]
   *             📁 Outro
   */
  async criarArquivo(nome: string, accessToken: string): Promise<IPaciente> {
    const drive = getDrive(accessToken)

    // Pasta principal do paciente
    const pasta = await drive.files.create({
      requestBody: { name: nome, mimeType: MIME_FOLDER, parents: [FOLDER_ID] },
      fields: 'id, modifiedTime',
      ...DRIVE_FLAGS,
    })
    const pastaId = pasta.data.id as string

    // Subpasta Prontuário
    const prontuarioPasta = await drive.files.create({
      requestBody: { name: 'Prontuário', mimeType: MIME_FOLDER, parents: [pastaId] },
      fields: 'id',
      ...DRIVE_FLAGS,
    })
    const prontuarioPastaId = prontuarioPasta.data.id as string

    // Doc do ano atual dentro de Prontuário
    const anoAtual = new Date().getFullYear().toString()
    await drive.files.create({
      requestBody: { name: anoAtual, mimeType: MIME_GDOC, parents: [prontuarioPastaId] },
      fields: 'id',
      ...DRIVE_FLAGS,
    })

    // Subpasta Outro
    await drive.files.create({
      requestBody: { name: 'Outro', mimeType: MIME_FOLDER, parents: [pastaId] },
      fields: 'id',
      ...DRIVE_FLAGS,
    })

    return { id: pastaId, nome, ultimaEdicao: pasta.data.modifiedTime ?? '' }
  },
}
