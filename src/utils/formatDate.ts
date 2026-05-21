export function formatarDataBR(isoDate: string): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function hojeISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function isoParaBR(iso: string): string {
  if (!iso || !iso.includes('-')) return iso
  const [, mm, dd] = iso.split('-')
  return `${dd}/${mm}`
}

export function isoParaBRCompleto(iso: string): string {
  if (!iso || !iso.includes('-')) return iso
  const [aaaa, mm, dd] = iso.split('-')
  return `${dd}/${mm}/${aaaa}`
}

export function brParaISO(br: string): string {
  if (!br || !br.includes('/')) return br
  const [dd, mm, aaaa] = br.split('/')
  return `${aaaa}-${mm}-${dd}`
}
