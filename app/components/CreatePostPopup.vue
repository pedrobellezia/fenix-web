<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 class="text-xl font-bold text-gray-800">Criar Novo Post</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 border border-gray-100 shadow-sm hover:shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
          <input 
            v-model="post.title" 
            type="text" 
            placeholder="Digite o título do post..." 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Conteúdo</label>
          <textarea 
            v-model="post.content" 
            rows="4" 
            placeholder="No que você está pensando?" 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"
          ></textarea>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Mídias (Opcional)</label>
          <div class="flex items-center justify-center w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="mb-1 text-sm text-gray-500"><span class="font-semibold">Clique para enviar</span> ou arraste os arquivos</p>
                    <p class="text-xs text-gray-500">Imagens ou Vídeos (PNG, JPG, MP4...)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  @change="handleFileChange" 
                  class="hidden" 
                />
            </label>
          </div>
          
          <!-- Image/Video Previews -->
          <div v-if="files.length > 0" class="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            <div v-for="(fileItem, index) in files" :key="index" @click="openPreview(fileItem)" class="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-black cursor-pointer hover:opacity-90 transition-opacity">
              <img v-if="fileItem.type.startsWith('image/')" :src="fileItem.url" class="w-full h-full object-cover" />
              <video v-else-if="fileItem.type.startsWith('video/')" :src="fileItem.url" class="w-full h-full object-cover" muted></video>
              
              <!-- Delete Button (Top Right) -->
              <button @click.stop="removeFile(index)" type="button" class="absolute top-1.5 right-1.5 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors shadow-sm" title="Remover mídia">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Actions -->
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
        <button @click="close" type="button" class="px-5 py-2.5 rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 font-semibold transition-colors shadow-sm">
          Cancelar
        </button>
        <button 
          @click="submitPost" 
          :disabled="isSubmitting"
          class="px-5 py-2.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

  <!-- Full Size Media Preview Modal -->
  <div v-if="previewMediaUrl" @click="closePreview" class="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
    <button @click="closePreview" class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <img v-if="previewMediaType?.startsWith('image/')" :src="previewMediaUrl" class="max-w-full max-h-[90vh] object-contain rounded-lg" @click.stop />
    <video v-else-if="previewMediaType?.startsWith('video/')" :src="previewMediaUrl" controls class="max-w-full max-h-[90vh] object-contain rounded-lg" @click.stop></video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps < {
    modelValue: boolean
} > ()

const emit = defineEmits < {
    (e: 'update:modelValue', value: boolean): void
    (e: 'post-created'): void
} > ()

const config = useRuntimeConfig()
const token = useCookie('token')

const isSubmitting = ref(false)

const initialPostState = () => ({
    title: '',
    content: ''
})

const post = ref(initialPostState())
const files = ref<{ file: File, url: string, type: string }[]>([])

const close = () => {
    emit('update:modelValue', false)
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        const newFiles = Array.from(target.files)
        newFiles.forEach(file => {
            files.value.push({
                file,
                url: URL.createObjectURL(file),
                type: file.type
            })
        })
    }
    target.value = ''
}

const removeFile = (index: number) => {
    const removed = files.value.splice(index, 1)[0]
    if (removed) {
        URL.revokeObjectURL(removed.url)
    }
}

const previewMediaUrl = ref<string | null>(null)
const previewMediaType = ref<string | null>(null)

const openPreview = (fileItem: { url: string, type: string }) => {
    previewMediaUrl.value = fileItem.url
    previewMediaType.value = fileItem.type
}

const closePreview = () => {
    previewMediaUrl.value = null
    previewMediaType.value = null
}

const submitPost = async () => {
    if (!post.value.title || !post.value.content) {
        alert('O título e o conteúdo são obrigatórios!')
        return
    }

    try {
        isSubmitting.value = true

        const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`

        const postData = {
            title: post.value.title,
            content: post.value.content
        }

        const formData = new FormData()
        formData.append(
            "post",
            new Blob([JSON.stringify(postData)], { type: "application/json" })
        )

        if (files.value && files.value.length > 0) {
            for (let i = 0; i < files.value.length; i++) {
                formData.append("files", files.value[i].file)
            }
        }

        await $fetch(`${baseUrl}/api/posts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.value}`
            },
            body: formData
        })

        // Reset and close
        post.value = initialPostState()
        files.value = []
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
