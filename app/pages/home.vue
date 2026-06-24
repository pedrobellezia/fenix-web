<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PostCard from '~/components/PostCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import CreatePostPopup from '~/components/CreatePostPopup.vue'
import { Quote, MessageCircle, Users, Plus } from 'lucide-vue-next'

const posts = ref<any[]>([])
const config = useRuntimeConfig()
const token = useCookie('token')
const authUserStr = useCookie('user')
const isCreatePostOpen = ref(false)

const currentUserRole = computed(() => {
  if (!authUserStr.value) return null;
  try {
    const decodedStr = atob(authUserStr.value as string)
    const userObj = JSON.parse(decodedStr)
    return userObj.role
  } catch(e) {
    return null;
  }
})

const fetchPosts = async () => {
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const response = await $fetch(`${baseUrl}/api/posts?homepage=true`, {
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

      <div>
        <h3 class="font-bold text-gray-700 mb-2">Postagens recentes</h3>

        <div class="space-y-2">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :id="post.id"
            :user="post.user"
            :title="post.title"
            :content="post.content"
            :likes="post.likes"
            :media="post.media"
            :createdAt="post.createdAt"
          />
        </div>
      </div>
    </div>

    <button
      v-if="currentUserRole === 'ADMIN'"
      @click="isCreatePostOpen = true"
      class="fixed bottom-24 right-6 z-40 w-14 h-14 bg-mint text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] shadow-mint/40 hover:scale-105 active:scale-95 transition-all"
    >
      <Plus class="w-6 h-6" />
    </button>
    
    <CreatePostPopup 
      v-model="isCreatePostOpen" 
      :isHomepage="true"
      @post-created="handlePostCreated" 
    />

    <NavBarBottom />
  </div>
</template>
