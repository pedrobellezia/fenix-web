<script setup lang="ts">
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import { Edit, ChevronRight, Bell, Shield, LogOut } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const token = useCookie('token')
const user = ref<any>(null)

const fetchProfile = async () => {
  if (!token.value) {
    navigateTo('/login')
    return
  }
  
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const data = await $fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    user.value = data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchProfile()
})

const handleLogout = () => {
  const tokenCookie = useCookie('token')
  const userCookie = useCookie('user')
  tokenCookie.value = null
  userCookie.value = null
  navigateTo('/login')
}

const getAvatarUrl = (u: any) => {
  if (!u) return '';
  if (u.picUrl) {
    if (u.picUrl.startsWith('http')) return u.picUrl;
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`;
    return `${baseUrl}/upload/${u.picUrl}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Usuário')}&background=random&color=fff&size=128`
}
</script>
<template>
  <div id="screen-profile" class="screen flex-col h-full">
    <NavBarTop title="Perfil" />
    <div class="flex-1 overflow-auto p-4 fade-in">
      <div class="flex flex-col items-center mb-5">
        <img
          v-if="user"
          :src="getAvatarUrl(user)"
          alt="Avatar"
          class="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-100 mb-2"
        />
        <h3 v-if="user" class="font-bold text-gray-800">{{ user.name || 'Usuário' }}</h3>
        <p v-if="user" class="text-sm text-gray-500 capitalize">{{ user.role || 'Paciente' }}</p>
      </div>
      <div class="space-y-2">
        <button
          class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
          @click="navigateTo('/perfil/edit')"
        >
          <Edit class="w-5 h-5 text-lilac" />
          <span class="text-sm font-medium text-gray-700">Editar perfil</span>
          <ChevronRight class="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button
          class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
          @click="navigateTo('/notifications')"
        >
          <Bell class="w-5 h-5 text-lilac" />
          <span class="text-sm font-medium text-gray-700">Notificações</span>
          <ChevronRight class="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button
          class="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition mt-4"
          @click="handleLogout"
        >
          <LogOut class="w-5 h-5 text-red-500" />
          <span class="text-sm font-medium text-red-600">Sair</span>
        </button>
      </div>
    </div>
    <NavBarBottom />
  </div>
</template>
