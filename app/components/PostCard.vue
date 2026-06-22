<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Heart, HandHeart, BicepsFlexed, MessageCircle } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'

const props = defineProps({
  id: { type: String, required: true },
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

const token = useCookie('token')
const authUserStr = useCookie('user')
const config = useRuntimeConfig()

// Pega o ID do usuário a partir do cookie codificado em Base64
const currentUserId = computed(() => {
  if (!authUserStr.value) return null;
  try {
    const decodedStr = atob(authUserStr.value as string)
    const userObj = JSON.parse(decodedStr)
    return userObj.id
  } catch(e) {
    return null;
  }
})

const localLikes = ref([...(props.likes || [])])

watch(() => props.likes, (newLikes) => {
  localLikes.value = [...(newLikes || [])]
}, { deep: true })

const heartCount = computed(() => localLikes.value.filter((l: any) => l.reactionType === 'heart').length)
const handheartCount = computed(() => localLikes.value.filter((l: any) => l.reactionType === 'handheart').length)
const armflexCount = computed(() => localLikes.value.filter((l: any) => l.reactionType === 'armflex').length)

const hasReacted = (type: string) => {
  if (!currentUserId.value) return false;
  return localLikes.value.some((l: any) => l.reactionType === type && l.user?.id === currentUserId.value)
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
      localLikes.value.push(res)
    }
  } catch (e) {
    console.error('Error posting like', e)
  }
}

const authorName = computed(() => props.user?.name || 'Usuário')

const sigla = computed(() => {
  if (props.user?.name) {
    return props.user.name.substring(0, 2).toUpperCase()
  }
  return 'US'
})

const formattedDate = computed(() => {
  if (!props.createdAt) return ''
  const date = new Date(props.createdAt)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)
})
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
