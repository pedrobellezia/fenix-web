<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Home, MessageCircle, Users, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  return route.path === path || (path === '/home' && route.path === '/dashboard')
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 flex border-t border-gray-100 bg-white"
  >
    <button
      class="flex-1 py-3 flex flex-col items-center gap-1"
      :class="isActive('/home') ? 'text-lilac' : 'text-gray-400'"
      @click="navigateTo('/home')"
    >
      <Home class="w-5 h-5" />
      <span class="text-[10px]" :class="{ 'font-bold': isActive('/home') }">Início</span>
    </button>
    <button
      class="flex-1 py-3 flex flex-col items-center gap-1"
      :class="isActive('/forum') ? 'text-lilac' : 'text-gray-400'"
      @click="navigateTo('/forum')"
    >
      <MessageCircle class="w-5 h-5" />
      <span class="text-[10px]" :class="{ 'font-bold': isActive('/forum') }">Fórum</span>
    </button>
    <button
      class="flex-1 py-3 flex flex-col items-center gap-1"
      :class="isActive('/professionals') ? 'text-lilac' : 'text-gray-400'"
      @click="navigateTo('/professionals')"
    >
      <Users class="w-5 h-5" />
      <span class="text-[10px]" :class="{ 'font-bold': isActive('/professionals') }">Saúde</span>
    </button>
    <button
      class="flex-1 py-3 flex flex-col items-center gap-1"
      :class="isActive('/profile') ? 'text-lilac' : 'text-gray-400'"
      @click="navigateTo('/profile')"
    >
      <User class="w-5 h-5" />
      <span class="text-[10px]" :class="{ 'font-bold': isActive('/profile') }">Perfil</span>
    </button>
  </nav>
</template>
