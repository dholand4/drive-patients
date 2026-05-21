import { IConsulta, IDocAno, IPaciente, IProntuario } from '@/@types'

export const prontuarioService = {
  async buscarPacientes(q: string): Promise<IPaciente[]> {
    const res = await fetch(`/api/pacientes?q=${encodeURIComponent(q)}`)
    if (!res.ok) throw new Error('Erro ao buscar pacientes')
    return res.json() as Promise<IPaciente[]>
  },

  async listarAnos(id: string): Promise<IDocAno[]> {
    const res = await fetch(`/api/prontuario/${id}/anos`)
    if (!res.ok) throw new Error('Erro ao listar anos')
    const data = (await res.json()) as { anos: IDocAno[] }
    return data.anos
  },

  async lerProntuario(id: string, docId?: string): Promise<IProntuario> {
    const url = docId
      ? `/api/prontuario/${id}?docId=${encodeURIComponent(docId)}`
      : `/api/prontuario/${id}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Erro ao carregar prontuário')
    return res.json() as Promise<IProntuario>
  },

  async salvarConsulta(id: string, consulta: IConsulta): Promise<void> {
    const res = await fetch(`/api/prontuario/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consulta),
    })
    if (!res.ok) throw new Error('Erro ao salvar consulta')
  },

  async criarPaciente(nome: string): Promise<IPaciente> {
    const res = await fetch('/api/pacientes/novo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    })
    if (!res.ok) throw new Error('Erro ao criar paciente')
    return res.json() as Promise<IPaciente>
  },
}
