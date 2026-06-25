<script setup lang="ts">
import { Bell, User, ArrowLeft } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Fênix',
  },
  backArrow: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <header
    class="bg-gradient-to-r from-lilac to-rose-dark p-4 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <button
        v-if="backArrow"
        class="flex items-center justify-center"
        @click="goBack"
      >
        <ArrowLeft class="w-6 h-6 text-white" />
      </button>


      <h2 class="text-white font-bold text-lg">{{ title }}</h2>
    </div>

    <div class="flex gap-2">
      <button
        class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center relative"
        @click="navigateTo('/notifications')"
      >
        <Bell class="w-4 h-4 text-white" />
        <span
          class="absolute -top-1 -right-1 w-4 h-4 bg-mint text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          3
        </span>
      </button>

      <button
        class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"
        @click="navigateTo('/perfil')"
      >
        <User class="w-4 h-4 text-white" />
      </button>
    </div>
  </header>
</template>
