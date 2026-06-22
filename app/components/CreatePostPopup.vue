<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Criar Novo Post</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
          <input 
            v-model="post.title" 
            type="text" 
            placeholder="Digite o título do post..." 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conteúdo</label>
          <textarea 
            v-model="post.content" 
            rows="4" 
            placeholder="No que você está pensando?" 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Media URLs (Simplified) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mídias (URLs)</label>
            <button @click="addMedia" type="button" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
              + Adicionar Mídia
            </button>
          </div>
          
          <div v-if="post.media.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
            Nenhuma mídia adicionada.
          </div>

          <div v-for="(media, index) in post.media" :key="index" class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-3 space-y-3 relative group">
            <button @click="removeMedia(index)" type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="md:col-span-2">
                <input v-model="media.mediaUrl" type="text" placeholder="URL da Mídia (ex: https://...)" class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <select v-model="media.mediaType" class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>
              <div>
                <input v-model="media.mimeType" type="text" placeholder="Mime Type (ex: image/jpeg)" class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Actions -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
        <button @click="close" type="button" class="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium transition-colors">
          Cancelar
        </button>
        <button 
          @click="submitPost" 
          :disabled="isSubmitting"
          class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Publicando...' : 'Publicar Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'post-created'): void
}>()

const config = useRuntimeConfig()
const token = useCookie('token')

const isSubmitting = ref(false)

const initialPostState = () => ({
  title: '',
  content: '',
  mediaType: 'image', // Padrão da requisição
  media: [] as Array<{ mediaUrl: string, mediaType: string, mimeType: string }>
})

const post = ref(initialPostState())

const close = () => {
  emit('update:modelValue', false)
  // Optional: reset form on close
  // post.value = initialPostState()
}

const addMedia = () => {
  post.value.media.push({
    mediaUrl: '',
    mediaType: 'image',
    mimeType: 'image/jpeg'
  })
}

const removeMedia = (index: number) => {
  post.value.media.splice(index, 1)
}

const submitPost = async () => {
  if (!post.value.title || !post.value.content) {
    alert('O título e o conteúdo são obrigatórios!')
    return
  }

  try {
    isSubmitting.value = true
    
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    
    // Atualiza o root mediaType baseado na primeira mídia (se houver)
    if (post.value.media.length > 0) {
      post.value.mediaType = post.value.media[0].mediaType
    }

    const payload: any = {
      title: post.value.title,
      content: post.value.content,
      media: post.value.media
    }

    if (post.value.media.length > 0) {
      payload.mediaType = post.value.media[0].mediaType
    }

    await $fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: payload
    })

    // Reset and close
    post.value = initialPostState()
    emit('post-created')
    close()
  } catch (error) {
    console.error('Erro ao criar post:', error)
    alert('Ocorreu um erro ao publicar o post. Verifique o console.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
</style>
