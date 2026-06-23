<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Post } from '~/types'
import PostCard from '~/components/PostCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import CreatePostPopup from '~/components/CreatePostPopup.vue'
import { Plus } from 'lucide-vue-next'

const posts = ref<any[]>([])
const config = useRuntimeConfig()
const token = useCookie('token')
const isCreatePostOpen = ref(false)

const fetchPosts = async () => {
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const response = await $fetch(`${baseUrl}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    posts.value = response as any[]
  } catch (e) {
    console.error('Error fetching posts:', e)
  }
}

onMounted(() => {
  fetchPosts()
})

const handlePostCreated = () => {
  fetchPosts()
}
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
            :id="post.id"
            :user="post.user"
            :title="post.title"
            :content="post.content"
            :likes="post.likes"
            :media="post.media"
            :createdAt="post.createdAt"
            :comentariosCount="post.comments?.length || post._count?.comments || post.commentsCount || post.comentariosCount || 0"
            @deleted="fetchPosts"
          />
        </NuxtLink>
      </div>
    </div>
    <!-- Floating Action Button -->
    <button
      @click="isCreatePostOpen = true"
      class="fixed bottom-24 right-6 z-40 w-14 h-14 bg-mint text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] shadow-mint/40 hover:scale-105 active:scale-95 transition-all"
    >
      <Plus class="w-6 h-6" />
    </button>
    
    <CreatePostPopup 
      v-model="isCreatePostOpen" 
      @post-created="handlePostCreated" 
    />
    <NavBarBottom />
  </div>
</template>
