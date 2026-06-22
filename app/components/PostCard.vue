<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Heart, MessageCircle, HandHeart, BicepsFlexed } from 'lucide-vue-next'

// Props interface supporting both mock legacy data and backend API data structures
interface PostProps {
  // Backend API structures
  title?: string
  content?: string
  createdAt?: string | Date
  active?: boolean
  user?: {
    id: string
    name: string
    email?: string
    picUrl?: string
    role?: string
  }
  likes?: Array<{
    id: string
    user?: {
      id: string
      name?: string
      email?: string
      picUrl?: string
      role?: string
    }
    reactionType: 'heart' | 'handheart' | 'armflex'
    createdAt?: string
  }>
  media?: Array<{
    id: string
    mediaUrl: string
    mediaType: string
    mimeType: string
    createdAt?: string
  }>
}

const props = defineProps<PostProps>()

const emit = defineEmits<{
  (e: 'liked', payload: { postId: string; reactionType: 'heart' | 'handheart' | 'armflex' }): void
}>()

const config = useRuntimeConfig()
const token = useCookie('token')

// Helper to extract user ID from the JWT token
const getUserIdFromToken = (tokenValue: string | null | undefined): string | null => {
  if (!tokenValue) return null
  try {
    const payload = tokenValue.split('.')[1]
    if (!payload) return null
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const parsed = JSON.parse(decodedPayload)
    return parsed.id || parsed.sub || parsed.userId || null
  } catch (e) {
    console.error('Error decoding JWT payload:', e)
    return null
  }
}

// Current logged in user ID from token
const currentUserId = computed(() => getUserIdFromToken(token.value))

// Reactive local states for optimistic updates and compatibility
const localLikes = ref<any[]>(props.likes ? [...props.likes] : [])
const localReacoes = ref({
  love: props.reacoes?.love || 0,
  support: props.reacoes?.support || 0,
  strength: props.reacoes?.strength || 0
})

watch(() => props.likes, (newLikes) => {
  if (newLikes) {
    localLikes.value = [...newLikes]
  }
}, { deep: true })

watch(() => props.reacoes, (newReacoes) => {
  if (newReacoes) {
    localReacoes.value = {
      love: newReacoes.love || 0,
      support: newReacoes.support || 0,
      strength: newReacoes.strength || 0
    }
  }
}, { deep: true })

// Helper to determine if the logged in user reacted
const hasReacted = (reactionType: 'heart' | 'handheart' | 'armflex') => {
  if (localLikes.value.length > 0 && currentUserId.value) {
    return localLikes.value.some(
      (l) => l.user?.id === currentUserId.value && l.reactionType === reactionType
    )
  }
  return false
}

// Computeds for display mapping
const authorName = computed(() => props.user?.name || props.nome || 'Usuário')

const sigla = computed(() => {
  return authorName.value
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase() || '')
    .join('')
})

const formattedDate = computed(() => {
  const rawDate = props.createdAt || props.date
  return rawDate ? formatRelativeDate(rawDate) : ''
})

const comentariosCount = computed(() => props.comentarios?.length || 0)

// Reaction counters
const heartCount = computed(() => {
  if (props.likes || localLikes.value.length > 0) {
    return localLikes.value.filter((l) => l.reactionType === 'heart').length
  }
  return localReacoes.value.love
})

const handheartCount = computed(() => {
  if (props.likes || localLikes.value.length > 0) {
    return localLikes.value.filter((l) => l.reactionType === 'handheart').length
  }
  return localReacoes.value.support
})

const armflexCount = computed(() => {
  if (props.likes || localLikes.value.length > 0) {
    return localLikes.value.filter((l) => l.reactionType === 'armflex').length
  }
  return localReacoes.value.strength
})

// React / like toggling
const toggleLike = async (reactionType: 'heart' | 'handheart' | 'armflex') => {
  if (!token.value) {
    console.warn('Usuário não autenticado.')
    navigateTo('/login')
    return
  }
  if (!props.id) {
    console.warn('ID do post não fornecido.')
    return
  }

  const userIdVal = currentUserId.value

  // Optimistic UI updates
  if (props.likes || localLikes.value.length > 0) {
    const existingIndex = localLikes.value.findIndex(
      (l) => l.user?.id === userIdVal && l.reactionType === reactionType
    )
    if (existingIndex > -1) {
      localLikes.value.splice(existingIndex, 1)
    } else {
      localLikes.value.push({
        id: `temp-${Date.now()}`,
        reactionType,
        user: { id: userIdVal || 'current-user' }
      })
    }
  } else {
    if (reactionType === 'heart') localReacoes.value.love++
    else if (reactionType === 'handheart') localReacoes.value.support++
    else if (reactionType === 'armflex') localReacoes.value.strength++
  }

  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    
    await $fetch(`${baseUrl}/api/postlikes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        post: {
          id: props.id
        },
        reactionType
      }
    })

    emit('liked', { postId: props.id, reactionType })
  } catch (error) {
    console.error('Erro ao reagir ao post:', error)
    // Rollback optimistic update
    if (props.likes) {
      localLikes.value = [...props.likes]
    } else if (props.reacoes) {
      localReacoes.value = {
        love: props.reacoes.love || 0,
        support: props.reacoes.support || 0,
        strength: props.reacoes.strength || 0
      }
    }
  }
}
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Post Header -->
    <div class="flex items-center gap-2 mb-2">
      <!-- Profile avatar or initials -->
      <img
        v-if="props.user?.picUrl"
        :src="props.user.picUrl"
        alt="Avatar"
        class="w-8 h-8 rounded-full object-cover border border-gray-100"
      />
      <div
        v-else
        class="w-8 h-8 rounded-full bg-lilac/20 flex items-center justify-center text-xs font-bold text-lilac"
      >
        {{ sigla }}
      </div>
      <span class="text-sm font-bold text-gray-700">{{ authorName }}</span>
      <span class="text-xs text-gray-400 ml-auto">{{ formattedDate }}</span>
    </div>

    <!-- Post Title -->
    <h4 v-if="props.title || props.titulo" class="text-sm font-bold text-gray-800 mb-1">
      {{ props.title || props.titulo }}
    </h4>

    <!-- Post Content -->
    <p class="text-sm text-gray-600 whitespace-pre-line">
      {{ props.content || props.conteudo }}
    </p>

    <!-- Post Media Attachment -->
    <div v-if="props.media && props.media.length > 0" class="mt-3 overflow-hidden rounded-xl space-y-2">
      <div v-for="item in props.media" :key="item.id" class="overflow-hidden rounded-xl">
        <img
          v-if="item.mediaType === 'image' || item.mimeType?.startsWith('image/')"
          :src="item.mediaUrl"
          alt="Post media"
          class="w-full max-h-64 object-cover hover:scale-[1.01] transition-transform duration-200 rounded-xl"
        />
        <video
          v-else-if="item.mediaType === 'video' || item.mimeType?.startsWith('video/')"
          :src="item.mediaUrl"
          controls
          class="w-full max-h-64 object-cover rounded-xl"
        />
      </div>
    </div>

    <!-- Post Actions Footer -->
    <div class="flex gap-3 mt-3 pt-2 border-t border-gray-50">
      <!-- Heart Reaction -->
      <button
        class="text-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
        :class="hasReacted('heart') ? 'text-rose-600 font-bold' : 'text-gray-500 hover:text-rose-500'"
        @click.stop.prevent="toggleLike('heart')"
      >
        <Heart 
          class="w-5 h-5 transition-transform duration-200" 
          :class="hasReacted('heart') ? 'fill-rose-600 stroke-rose-600 scale-110' : 'stroke-current'"
        />
        <span>{{ heartCount }}</span>
      </button>

      <!-- Handheart Reaction -->
      <button
        class="text-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
        :class="hasReacted('handheart') ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-500'"
        @click.stop.prevent="toggleLike('handheart')"
      >
        <HandHeart 
          class="w-5 h-5 transition-transform duration-200" 
          :class="hasReacted('handheart') ? 'fill-blue-100 stroke-blue-600 scale-110' : 'stroke-current'"
        />
        <span>{{ handheartCount }}</span>
      </button>

      <!-- Armflex Reaction -->
      <button
        class="text-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
        :class="hasReacted('armflex') ? 'text-amber-600 font-bold' : 'text-gray-500 hover:text-amber-500'"
        @click.stop.prevent="toggleLike('armflex')"
      >
        <BicepsFlexed 
          class="w-5 h-5 transition-transform duration-200" 
          :class="hasReacted('armflex') ? 'fill-amber-100 stroke-amber-600 scale-110' : 'stroke-current'"
        />
        <span>{{ armflexCount }}</span>
      </button>

      <!-- Comments Count -->
      <button class="text-xs text-lilac hover:text-lilac-dark flex items-center gap-1.5 ml-auto transition-all duration-200 hover:scale-105 active:scale-95">
        <MessageCircle class="w-5 h-5" />
        <span>{{ comentariosCount }}</span>
      </button>
    </div>
  </div>
</template>
