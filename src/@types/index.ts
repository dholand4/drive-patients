export interface IPaciente {
  id: string
  nome: string
  ultimaEdicao: string
}

export interface IConsulta {
  data: string
  descricao: string
}

export interface IDocAno {
  id:   string
  nome: string
}

export interface IProntuario {
  pacienteId:   string
  pacienteNome: string
  consultas:    IConsulta[]
  conteudoRaw:  string
  anos:         IDocAno[]
}
