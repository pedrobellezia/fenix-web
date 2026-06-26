<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie, useRuntimeConfig } from '#app'
import PostCard from '~/components/PostCard.vue'
import CommentCard from '~/components/CommentCard.vue'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import { Send } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const token = useCookie('token')
const postId = route.params.id

const post = ref<any>(null)
const comments = ref<any[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const newComment = ref('')
const replyingTo = ref<any>(null)

const startReply = (comment: any) => {
  replyingTo.value = comment
}

const cancelReply = () => {
  replyingTo.value = null
}

const organizedComments = computed(() => {
  const map = new Map()
  const roots: any[] = []
  
  comments.value.forEach(c => {
    map.set(c.id, { ...c, replies: [] })
  })
  
  map.forEach(c => {
    if (c.parentComment?.id) {
      const parent = map.get(c.parentComment.id)
      if (parent) {
        c.replyToName = parent.user?.displayName
        parent.replies.push(c)
      } else {
        roots.push(c)
      }
    } else {
      roots.push(c)
    }
  })
  
  const flat: any[] = []
  const traverse = (node: any, depth: number) => {
    flat.push({ ...node, depth })
    node.replies.forEach((r: any) => traverse(r, depth + 1))
  }
  roots.forEach(r => traverse(r, 0))
  
  return flat
})

const submitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const response = await $fetch(`${baseUrl}/api/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        body: newComment.value,
        post: { id: postId },
        ...(replyingTo.value ? { parentComment: { id: replyingTo.value.id } } : {})
      }
    })
    
    // Garante que o comentário recém-criado tenha um timestamp caso a API não retorne
    if (!response.createdAt && !response.date && !response.created_at) {
      response.createdAt = new Date().toISOString()
    }
    
    // Atualiza a lista com o novo comentário
    comments.value.push(response)
    newComment.value = ''
    replyingTo.value = null
  } catch (e) {
    console.error('Error posting comment:', e)
  } finally {
    isSubmitting.value = false
  }
}

const fetchPost = async () => {
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const response: any = await $fetch(`${baseUrl}/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    post.value = response
    comments.value = response.comments || []
  } catch (e) {
    console.error('Error fetching post:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchPost()
})

const handlePostDeleted = () => {
  router.push('/forum')
}

const handleCommentDeleted = () => {
  fetchPost()
}
</script>

<template>
  <div class="screen flex-col h-full active">
    <NavBarTop title="Post" />
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Carregando...</p>
    </div>
    <div v-else-if="post" class="flex-1 overflow-auto p-4 pb-[160px] space-y-3">
      <PostCard
        :id="post.id "
        :user="post.user"
        :title="post.title"
        :content="post.content"
        :likes="post.likes"
        :media="post.media"
        :created-at="post.createdAt"
        :comentarios-count="comments.length"
        @deleted="handlePostDeleted"
      />
      <div class="text-sm font-bold text-gray-700 mt-4">Comentários</div>
      <div class="space-y-2">
        <div v-for="comment in organizedComments" :key="comment.id" :class="{'ml-8 border-l-2 border-gray-100 pl-3': comment.depth > 0}">
          <CommentCard
            :id="comment.id"
            :user-id="comment.user?.id"
            :nome="comment.user?.displayName"
            :comentario="comment.body "
            :date="comment.createdAt "
            :avatar="comment.user?.picUrl"
            :reply-to-name="comment.replyToName"
            @reply="startReply(comment)"
            @deleted="handleCommentDeleted"
          />
        </div>
        <p v-if="!comments.length" class="text-gray-500 text-sm italic">
          Nenhum comentário ainda.
        </p>
      </div>
    </div>
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">Post não encontrado.</p>
    </div>
    
    <!-- Fixed Input Container -->
    <div class="fixed bottom-[61px] left-0 right-0 z-40 flex flex-col bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div v-if="replyingTo" class="px-4 py-2 flex justify-between items-center text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
        <span>Respondendo a <strong class="text-gray-700">{{ replyingTo.user?.displayName }}</strong></span>
        <button class="text-red-500 hover:underline" @click="cancelReply">Cancelar</button>
      </div>
      
      <div class="p-4 flex items-center gap-2">
        <input
          v-model="newComment"
          type="text"
          placeholder="Adicione um comentário..."
          class="flex-1 p-2 border border-gray-200 rounded-lg"
          :disabled="isSubmitting"
          @keyup.enter="submitComment"
        >
        <button 
          class="p-2 bg-mint text-white rounded-lg disabled:opacity-50" 
          :disabled="isSubmitting"
          @click="submitComment"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
    <NavBarBottom />
  </div>
</template>
