<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '~/types'
import PostCard from '~/components/PostCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import postsData from '~/data/posts.json'
import { Plus } from 'lucide-vue-next'

const posts = ref<Post[]>(postsData as Post[])
</script>

<template>
  <div id="screen-forum" class="screen flex-col h-full active">
    <NavBarTop title="Fórum" />
    <div class="flex-1 overflow-auto p-4 space-y-3 fade-in">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <span
          class="px-3 py-1 bg-lilac text-white text-xs font-bold rounded-full whitespace-nowrap"
        >
          Todos
        </span>
        <span
          class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap"
        >
          Quimioterapia
        </span>
        <span
          class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap"
        >
          Radioterapia
        </span>
        <span
          class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap"
        >
          Apoio
        </span>
      </div>
      <div class="space-y-2">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/forum/${post.id}`"
          class="block"
        >
          <PostCard
            :nome="post.nome"
            :titulo="post.titulo"
            :conteudo="post.conteudo"
            :reacoes="post.reacoes"
            :comentarios="post.comentarios"
            :date="post.date"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="p-4 border-t border-gray-100">
      <NuxtLink
        to="/new-post"
        class="w-full py-3 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition flex items-center justify-center gap-2 shadow-lg shadow-mint/30"
      >
        <Plus class="w-4 h-4" />
        Nova Postagem
      </NuxtLink>
    </div>
    <NavBarBottom />
  </div>
</template>
