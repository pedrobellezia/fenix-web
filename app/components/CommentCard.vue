<script setup lang="ts">
import { computed } from 'vue'

import type { Comentario } from '~/types'

type Props = Omit<Comentario, 'id'>

const props = defineProps<Props>()

const sigla = computed(() => {
  return props.nome
    .split(' ')
    .slice(0, 2)
    .map((nome) => nome[0]?.toUpperCase() || '')
    .join('')
})

const formattedDate = computed(() => {
  const commentDate = new Date(props.date)
  const now = new Date()

  const diffMs = now.getTime() - commentDate.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours >= 24) {
    return commentDate.toLocaleDateString('pt-BR')
  } else {
    return diffHours === 0 ? 'Agora mesmo' : `${diffHours}h`
  }
})
</script>

<template>
  <div class="bg-gray-50 border border-gray-100 rounded-lg p-3">
    <div class="flex items-center gap-2 mb-2">
      <div
        class="w-7 h-7 rounded-full bg-lilac/20 flex items-center justify-center text-xs font-bold text-lilac"
      >
        {{ sigla }}
      </div>
      <span class="text-sm font-bold text-gray-700">{{ nome }}</span>
      <span class="text-xs text-gray-400 ml-auto">{{ formattedDate }}</span>
    </div>
    <p class="text-sm text-gray-600">
      {{ comentario }}
    </p>
  </div>
</template>