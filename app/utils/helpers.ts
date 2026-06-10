import { Stethoscope, Brain } from 'lucide-vue-next'

/**
 * Retorna o componente de ícone correspondente à especialidade médica.
 */
export const getSpecialtyIcon = (specialty: string) => {
  if (
    specialty.includes('Oncologista') ||
    specialty.includes('Radioterapeuta')
  ) {
    return Stethoscope
  }
  if (specialty.includes('Psicóloga')) {
    return Brain
  }
  return Stethoscope // Ícone padrão
}

/**
 * Retorna a classe CSS de cor de fundo correspondente à especialidade.
 */
export const getSpecialtyBgClass = (specialty: string) => {
  if (specialty.includes('Oncologista')) {
    return 'bg-lilac/20'
  }
  if (specialty.includes('Radioterapeuta')) {
    return 'bg-mint/20'
  }
  if (specialty.includes('Psicóloga')) {
    return 'bg-rose/20'
  }
  return 'bg-gray-200'
}

/**
 * Retorna a classe CSS de cor de texto correspondente à especialidade.
 */
export const getSpecialtyTextClass = (specialty: string) => {
  if (specialty.includes('Oncologista')) {
    return 'text-lilac'
  }
  if (specialty.includes('Radioterapeuta')) {
    return 'text-mint'
  }
  if (specialty.includes('Psicóloga')) {
    return 'text-rose'
  }
  return 'text-gray-700'
}

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA).
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return String(date)
  return d.toLocaleDateString('pt-BR')
}

/**
 * Formata uma data de postagem de forma amigável/relativa (ex: "Agora mesmo", "2h", "10/06/2026").
 */
export const formatRelativeDate = (date: string | Date): string => {
  const postDate = new Date(date)
  if (isNaN(postDate.getTime())) return String(date)
  const now = new Date()

  const diffMs = now.getTime() - postDate.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours >= 24) {
    return postDate.toLocaleDateString('pt-BR')
  } else {
    return diffHours === 0 ? 'Agora mesmo' : `${diffHours}h`
  }
}


/**
 * Limita o tamanho de um texto e adiciona reticências se necessário.
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Navega para a página anterior no histórico do navegador.
 */
export const goBack = () => {
  const router = useRouter()
  router.back()
}
