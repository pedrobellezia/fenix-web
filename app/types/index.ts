export interface Reacoes {
  love: number
  support: number
  strength: number
}

export interface Comentario {
  id: string
  nome: string
  comentario: string
  date: string | Date
}

export interface Post {
  id: string
  nome: string
  titulo?: string
  conteudo: string
  reacoes: Reacoes
  comentarios: Comentario[]
  date: string | Date
}

export interface Professional {
  id: string
  name: string
  specialty: string
  crm: string
  rating: number
  description: string
  location: string
  availability: string
}

export interface NotificationStyle {
  bg: string
  border: string
}

export interface Notification {
  id: string
  type: string
  title: string
  description: string
  time: string
  style: NotificationStyle
}
