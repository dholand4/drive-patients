export interface IConsultaFormProps {
  data: string
  descricao: string
  onDataChange: (value: string) => void
  onDescricaoChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
  successMessage?: string | null
  errorMessage?: string | null
  disabled?: boolean
}
