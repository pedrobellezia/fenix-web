<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, HandHeart, BicepsFlexed, MessageCircle, Trash2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'

const props = defineProps({
  id: { type: String, default: '' },
  user: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  titulo: { type: String, default: '' },
  content: { type: String, default: '' },
  conteudo: { type: String, default: '' },
  media: { type: Array, default: () => [] },
  likes: { type: Array, default: () => [] },
  createdAt: { type: String, default: '' },
  comentariosCount: { type: [Number, String], default: 0 }
})

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const token = useCookie('token')
const authUserStr = useCookie('user')
const config = useRuntimeConfig()
const router = useRouter()

const goToPost = () => {
  if (props.id) {
    router.push(`/forum/${props.id}`)
  }
}

// Pega o ID do usuário a partir do cookie codificado em Base64
const currentUser = computed(() => {
  if (!authUserStr.value) return null;
  try {
    const decodedStr = atob(authUserStr.value as string)
    return JSON.parse(decodedStr)
  } catch {
    return null;
  }
})

const currentUserId = computed(() => currentUser.value?.id)
const currentUserRole = computed(() => currentUser.value?.role)

const localLikes = ref([...(props.likes || [])])

watch(() => props.likes, (newLikes) => {
  localLikes.value = [...(newLikes || [])]
}, { deep: true })

const heartCount = computed(() => localLikes.value.filter((l: { reactionType?: string }) => l.reactionType === 'heart').length)
const handheartCount = computed(() => localLikes.value.filter((l: { reactionType?: string }) => l.reactionType === 'handheart').length)
const armflexCount = computed(() => localLikes.value.filter((l: { reactionType?: string }) => l.reactionType === 'armflex').length)

const hasReacted = (type: string) => {
  if (!currentUserId.value) return false;
  return localLikes.value.some((l: { reactionType?: string; user?: { id?: string } }) => l.reactionType === type && l.user?.id === currentUserId.value)
}

const toggleLike = async (type: string) => {
  if (hasReacted(type)) return; // Evita reagir 2 vezes

  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    
    const res = await $fetch(`${baseUrl}/api/postlikes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        post: { id: props.id },
        reactionType: type
      }
    })
    
    if (res) {
      // Remove reações anteriores do usuário (apenas no frontend) para exclusividade mútua
      if (currentUserId.value) {
        localLikes.value = localLikes.value.filter((l: { user?: { id?: string } }) => l.user?.id !== currentUserId.value)
      }
      localLikes.value.push(res)
    }
  } catch (e) {
    console.error('Error posting like', e)
  }
}

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const deletePost = async () => {
  if (isDeleting.value) return;
  isDeleting.value = true;
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/api/posts/${props.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    showDeleteConfirm.value = false;
    emit('deleted');
  } catch (e) {
    console.error('Error deleting post', e)
  } finally {
    isDeleting.value = false;
  }
}

const authorName = computed(() => props.user?.name || 'Usuário')

const _sigla = computed(() => {
  if (props.user?.name) {
    return props.user.name.substring(0, 2).toUpperCase()
  }
  return 'US'
})

const formattedDate = computed(() => {
  if (!props.createdAt) return ''
  
  let dateStr = props.createdAt
  // Assume UTC se não tiver timezone (para lidar com "2026-06-25T17:58:10.091349")
  if (!dateStr.endsWith('Z') && !dateStr.substring(10).includes('+') && !dateStr.substring(10).includes('-')) {
    dateStr += 'Z'
  }
  
  const date = new Date(dateStr)
  const now = new Date()
  
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours >= 0 && diffHours < 24) {
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins === 0 ? 'agora' : `há ${diffMins}m`
    }
    return `há ${diffHours}h`
  }
  
  return new Intl.DateTimeFormat('pt-BR', { 
    timeZone: 'America/Sao_Paulo', 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  }).format(date)
})

const getMediaUrl = (filename: string) => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename; // fallback in case it's already a full URL
  const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`;
  return `${baseUrl}/upload/${filename}`;
}

const previewMediaUrl = ref<string | null>(null)
const previewMediaType = ref<string | null>(null)

const openPreview = (item: { filename?: string; mediaUrl?: string; mediaType?: string; mimeType?: string }) => {
  previewMediaUrl.value = getMediaUrl(item.filename || item.mediaUrl || '')
  previewMediaType.value = item.mediaType?.toLowerCase() || item.mimeType?.toLowerCase()
}

const closePreview = () => {
  previewMediaUrl.value = null
  previewMediaType.value = null
}

const getAvatarUrl = () => {
  if (props.user?.picUrl) {
    if (props.user.picUrl.startsWith('http')) return props.user.picUrl;
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`;
    return `${baseUrl}/upload/${props.user.picUrl}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName.value)}&background=9B72CF&color=fff`
}
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" @click="goToPost">
    <!-- Post Header -->
    <div class="flex items-center gap-2 mb-2">
      <!-- Profile avatar or initials -->
      <img
        :src="getAvatarUrl()"
        alt="Avatar"
        class="w-8 h-8 rounded-full object-cover border border-gray-100"
      >
      <span class="text-sm font-bold text-gray-700">{{ authorName }}</span>
      <div class="ml-auto flex items-center gap-3">
        <span class="text-xs text-gray-400">{{ formattedDate }}</span>
        <button 
          v-if="(currentUserId && props.user?.id === currentUserId) || currentUserRole === 'ADMIN'"
          class="text-gray-400 hover:text-red-500 transition-colors" 
          title="Excluir Post"
          @click.stop.prevent="showDeleteConfirm = true"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Post Title -->
    <h4 v-if="props.title " class="text-sm font-bold text-gray-800 mb-1">
      {{ props.title }}
    </h4>

    <!-- Post Content -->
    <p class="text-sm text-gray-600 whitespace-pre-line">
      {{ props.content }}
    </p>

    <!-- Post Media Attachment -->
    <div v-if="props.media && props.media.length > 0" class="mt-3 grid grid-cols-4 gap-2">
      <div v-for="item in props.media" :key="item.id" class="relative overflow-hidden rounded-xl aspect-square bg-black/5 cursor-pointer group" @click.stop.prevent="openPreview(item)">
        <img
          v-if="item.mediaType?.toLowerCase() === 'image' || item.mimeType?.toLowerCase().startsWith('image/')"
          :src="getMediaUrl(item.filename || item.mediaUrl)"
          alt="Post media"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-200"
        >
        <video
          v-else-if="item.mediaType?.toLowerCase() === 'video' || item.mimeType?.toLowerCase().startsWith('video/')"
          class="absolute inset-0 w-full h-full object-cover"
          muted
        >
          <source :src="getMediaUrl(item.filename || item.mediaUrl)" :type="item.mimeType" >
        </video>
        <!-- Ícone de Play sobreposto para vídeos -->
        <div v-if="item.mediaType?.toLowerCase() === 'video' || item.mimeType?.toLowerCase().startsWith('video/')" class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80 group-hover:opacity-100 transition-opacity"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
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

    <!-- Modal Confirmação -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" @click.stop>
      <div class="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Excluir Post</h3>
        <p class="text-sm text-gray-600 mb-5">Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita.</p>
        <div class="flex gap-3 justify-end">
          <button class="px-4 py-2 text-sm text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors" :disabled="isDeleting" @click.stop.prevent="showDeleteConfirm = false">Cancelar</button>
          <button class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors" :disabled="isDeleting" @click.stop.prevent="deletePost">
            {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Full Size Media Preview Modal -->
    <div v-if="previewMediaUrl" class="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" @click.stop.prevent="closePreview">
      <button class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full z-50" @click.stop.prevent="closePreview">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <img v-if="previewMediaType === 'image' || previewMediaType?.startsWith('image/')" :src="previewMediaUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop >
      <video v-else-if="previewMediaType === 'video' || previewMediaType?.startsWith('video/')" :src="previewMediaUrl" controls autoplay class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop/>
    </div>
  </div>
</template>
