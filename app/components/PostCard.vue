<script setup lang="ts">
import { computed } from 'vue'
import { Heart, MessageCircle, HandHeart, Sparkles } from 'lucide-vue-next'

import type { Post } from '~/types'

const props = defineProps<Omit<Post, 'id'>>()

const sigla = computed(() => {
  return props.nome
    .split(' ')
    .slice(0, 2)
    .map((nome) => nome[0]?.toUpperCase() || '')
    .join('')
})

const formattedDate = computed(() => {
  const postDate = new Date(props.date)
  const now = new Date()

  const diffMs = now.getTime() - postDate.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours >= 24) {
    return postDate.toLocaleDateString('pt-BR')
  } else {
    return diffHours === 0 ? 'Agora mesmo' : `${diffHours}h`
  }
})

const comentariosCount = computed(() => props.comentarios.length)
</script>

<template>
  <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
    <div class="flex items-center gap-2 mb-2">
      <div
        class="w-8 h-8 rounded-full bg-lilac/20 flex items-center justify-center text-xs font-bold text-lilac"
      >
        {{ sigla }}
      </div>
      <span class="text-sm font-bold text-gray-700">{{ nome }}</span>
      <span class="text-xs text-gray-400 ml-auto">{{ formattedDate }}</span>
    </div>

    <h4 v-if="titulo" class="text-sm font-bold text-gray-800 mb-1">
      {{ titulo }}
    </h4>

    <p class="text-sm text-gray-600">
      {{ conteudo }}
    </p>

    <div class="flex gap-3 mt-3 pt-2 border-t border-gray-50">
      <button
        class="text-xs text-rose-dark flex items-center gap-1"
        @click="console.log('love')"
      >
        <Heart class="w-5 h-5" />
        {{ reacoes.love }}
      </button>

      <button
        class="text-xs text-blue-500 flex items-center gap-1"
        @click="console.log('support')"
      >
        <HandHeart class="w-5 h-5" />
        {{ reacoes.support }}
      </button>

      <button
        class="text-xs text-yellow-500 flex items-center gap-1"
        @click="console.log('strength')"
      >
        <Sparkles class="w-5 h-5" />
        {{ reacoes.strength }}
      </button>

      <button class="text-xs text-lilac flex items-center gap-1 ml-auto">
        <MessageCircle class="w-5 h-5" />
        {{ comentariosCount }}
      </button>
    </div>
  </div>
</template>
