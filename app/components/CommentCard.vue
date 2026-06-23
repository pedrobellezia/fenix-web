<script setup lang="ts">
import { computed, ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'

const props = defineProps<{
  id?: string
  userId?: string
  nome: string
  comentario: string
  date?: string | Date
  avatar?: string | null
  replyToName?: string
}>()

const emit = defineEmits<{
  (e: 'reply'): void
  (e: 'deleted'): void
}>()

const token = useCookie('token')
const authUserStr = useCookie('user')
const config = useRuntimeConfig()

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

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const deleteComment = async () => {
  if (!props.id || isDeleting.value) return;
  isDeleting.value = true;
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/api/comments/${props.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    showDeleteConfirm.value = false;
    emit('deleted');
  } catch (e) {
    console.error('Error deleting comment', e)
  } finally {
    isDeleting.value = false;
  }
}

const sigla = computed(() => {
  return props.nome
    .split(' ')
    .slice(0, 2)
    .map((nome) => nome[0]?.toUpperCase() || '')
    .join('')
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  
  let data: Date
  if (typeof props.date === 'number' || (typeof props.date === 'string' && !isNaN(Number(props.date)))) {
    data = new Date(Number(props.date))
  } else {
    const dataString = String(props.date)
    // Se a data já possuir timezone (como +03:00 ou Z), não adiciona Z
    const hasTimezone = /[Z+-]\d{2}:?\d{2}?$/.test(dataString) || dataString.endsWith('Z')
    data = new Date(hasTimezone ? dataString : dataString + 'Z')
  }
  
  if (isNaN(data.getTime())) return ''

  const localeStr = data.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Normalize string to guarantee "dd/MM/yyyy, HH:mm"
  // Some browsers output "23/06/2026 14:10", others "23/06/2026, 14:10"
  return localeStr.replace(/,?\s+/, ', ')
})
</script>

<template>
  <div class="bg-gray-50 border border-gray-100 rounded-lg p-3">
    <div class="flex items-center gap-2 mb-2">
      <img
        v-if="avatar"
        :src="avatar"
        :alt="nome"
        class="w-7 h-7 rounded-full object-cover"
      />
      <div
        v-else
        class="w-7 h-7 rounded-full bg-lilac/20 flex items-center justify-center text-xs font-bold text-lilac"
      >
        {{ sigla }}
      </div>
      <span class="text-sm font-bold text-gray-700">{{ nome }}</span>
      <span class="text-xs text-gray-400" :class="{'ml-auto': !currentUserId || props.userId !== currentUserId}">{{ formattedDate }}</span>
      <button 
        v-if="currentUserId && props.userId === currentUserId"
        @click.stop.prevent="showDeleteConfirm = true" 
        class="text-gray-400 hover:text-red-500 transition-colors ml-auto"
        title="Excluir Comentário"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>
    <div v-if="replyToName" class="text-[11px] text-gray-400 mb-2 mt-[-4px]">
      Em resposta a <span class="text-mint font-semibold">@{{ replyToName }}</span>
    </div>
    <p class="text-sm text-gray-600">
      {{ comentario }}
    </p>
    <div class="mt-2 flex justify-end">
      <button @click="emit('reply')" class="text-xs text-mint font-semibold hover:underline">
        Responder
      </button>
    </div>

    <!-- Modal Confirmação -->
    <div v-if="showDeleteConfirm" @click.stop class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Excluir Comentário</h3>
        <p class="text-sm text-gray-600 mb-5">Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.</p>
        <div class="flex gap-3 justify-end">
          <button @click.stop.prevent="showDeleteConfirm = false" class="px-4 py-2 text-sm text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors" :disabled="isDeleting">Cancelar</button>
          <button @click.stop.prevent="deleteComment" class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors" :disabled="isDeleting">
            {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>