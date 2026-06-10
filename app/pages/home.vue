<script setup lang="ts">
import { ref } from 'vue'
import PostCard from '~/components/PostCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import postsData from '~/data/posts.json'
import { Quote, MessageCircle, Users } from 'lucide-vue-next'

const posts = ref(postsData)
</script>

<template>
  <div id="screen-home" class="screen flex-col h-full active">
    <NavBarTop />

    <div class="flex-1 overflow-auto p-4 pb-24 space-y-4 fade-in">
      <div
        class="bg-gradient-to-r from-rose-light to-purple-100 rounded-2xl p-5 border border-rose/20"
      >
        <div class="flex items-center gap-2 mb-1">
          <Quote class="w-4 h-4 text-lilac" />
          <p class="text-xs text-lilac font-bold uppercase">Mensagem do dia</p>
        </div>
        <p id="motivational-text" class="text-gray-700 font-medium">
          "Você não está sozinho(a) nessa jornada. Cada passo conta."
        </p>
      </div>

      <div class="flex justify-center gap-4">
        <button
          class="bg-lilac/10 border border-lilac/20 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-lilac/20 transition w-36"
          @click="navigateTo('/forum')"
        >
          <MessageCircle class="w-6 h-6 text-lilac" />
          <span class="text-xs font-bold text-lilac">Fórum</span>
        </button>

        <button
          class="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-green-100 transition w-36"
          @click="navigateTo('/professionals')"
        >
          <Users class="w-6 h-6 text-mint" />
          <span class="text-xs font-bold text-mint">Profissionais</span>
        </button>
      </div>

      <div>
        <h3 class="font-bold text-gray-700 mb-2">Postagens recentes</h3>

        <div class="space-y-2">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :nome="post.nome"
            :titulo="post.titulo"
            :conteudo="post.conteudo"
            :reacoes="post.reacoes"
            :comentarios="post.comentarios"
            :date="post.date"
          />
        </div>
      </div>
    </div>

    <NavBarBottom />
  </div>
</template>
