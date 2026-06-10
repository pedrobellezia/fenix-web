<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '~/types'
import PostCard from '~/components/PostCard.vue'
import CommentCard from '~/components/CommentCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import postsData from '~/data/posts.json'
import { Send } from 'lucide-vue-next'

const route = useRoute()
const postId = computed(() => route.params.id)

const post = computed<Post | undefined>(() => {
  return (postsData as Post[]).find((p) => p.id === postId.value)
})
</script>

<template>
  <div class="screen flex-col h-full active">
    <NavBarTop title="Post" />
    <div v-if="post" class="flex-1 overflow-auto p-4 space-y-3">
      <PostCard
        :key="post.id"
        :nome="post.nome"
        :titulo="post.titulo"
        :conteudo="post.conteudo"
        :reacoes="post.reacoes"
        :comentarios="post.comentarios"
        :date="post.date"
      />
      <div class="text-sm font-bold text-gray-700 mt-4">Comentários</div>
      <div class="space-y-2">
        <CommentCard
          v-for="comment in post.comentarios"
          :key="comment.id"
          :nome="comment.nome"
          :comentario="comment.comentario"
          :date="comment.date"
        />
      </div>
    </div>
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Post não encontrado.</p>
    </div>
    <div class="p-4 border-t border-gray-100 flex items-center gap-2">
      <input
        type="text"
        placeholder="Adicione um comentário..."
        class="flex-1 p-2 border border-gray-200 rounded-lg"
      >
      <button class="p-2 bg-mint text-white rounded-lg">
        <Send class="w-5 h-5" />
      </button>
    </div>
    <NavBarBottom />
  </div>
</template>
