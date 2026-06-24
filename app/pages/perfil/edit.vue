<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Camera,
  User,
  Mail,
  AtSign,
  Activity,
  Heart,
  CheckCircle,
  Trash2
} from 'lucide-vue-next'

const config = useRuntimeConfig()
const token = useCookie('token')
const userData = ref<any>(null)

const name = ref('')
const displayName = ref('')
const email = ref('')
const treatmentPhase = ref('')
const bio = ref('')

const showSuccessToast = ref(false)

const fetchProfile = async () => {
  if (!token.value) {
    navigateTo('/login')
    return
  }
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const data: any = await $fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    userData.value = data
    name.value = data.name || ''
    displayName.value = data.displayName || ''
    email.value = data.email || ''
    treatmentPhase.value = data.treatmentPhase || ''
    bio.value = data.bio || ''
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchProfile()
})

const handleSave = async () => {
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        ...userData.value,
        name: name.value,
        displayName: displayName.value,
        email: email.value,
        treatmentPhase: treatmentPhase.value,
        bio: bio.value
      }
    })
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}

const handleDeleteAccount = async () => {
  if (!confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) return
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    token.value = null
    navigateTo('/login')
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div
    id="screen-profile-edit"
    class="screen flex-col h-full bg-white relative"
  >
    <NavBarTop title="Perfil" :back-arrow="true" />

    <div class="flex-1 overflow-auto p-6 space-y-6 pb-24 fade-in">
      <div class="flex flex-col items-center">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-lilac to-rose flex items-center justify-center text-4xl text-white font-bold shadow-lg"
          >
            {{ name?.charAt(0).toUpperCase()}}
          </div>
          <button
            class="absolute bottom-0 right-0 bg-mint text-white p-2 rounded-full shadow-lg hover:bg-mint-dark transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white"
          >
            <Camera class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2 font-medium">
          Toque para alterar a foto
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Nome Completo
          </label>
          <div class="relative flex items-center">
            <User class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="name"
              type="text"
              placeholder="Seu nome completo"
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            >
          </div>
        </div>

        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            E-mail
          </label>
          <div class="relative flex items-center">
            <Mail class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            >
          </div>
        </div>

        <!-- Display Name Input -->
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Nome de Exibição
          </label>
          <div class="relative flex items-center">
            <AtSign class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="displayName"
              type="text"
              placeholder="Como quer ser chamado"
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            >
          </div>
        </div>

        <!-- Treatment Phase Input -->
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Fase de Tratamento
          </label>
          <div class="relative flex items-center">
            <Activity class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="treatmentPhase"
              type="text"
              placeholder="Ex: Fase Inicial, Manutenção..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            >
          </div>
        </div>

        <!-- Bio Input -->
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Sobre Mim (Biografia)
          </label>
          <div class="relative flex items-start">
            <Heart class="absolute left-4 top-3.5 w-5 h-5 text-lilac/70" />
            <textarea
              v-model="bio"
              rows="3"
              placeholder="Compartilhe um pouco sobre você..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium resize-none"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 space-y-3">
        <button
          class="w-full py-3 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition-all duration-300 shadow-md shadow-mint/20 hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
          @click="handleSave"
        >
          Salvar Alterações
        </button>
        <button
          class="w-full py-3 bg-gray-50 text-gray-500 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-100 flex items-center justify-center"
          @click="navigateTo('/perfil')"
        >
          Cancelar
        </button>
        <button
          class="w-full py-3 bg-red-50 text-red-500 font-semibold rounded-xl hover:bg-red-100 transition-all duration-300 border border-red-100 flex items-center justify-center gap-2 mt-4"
          @click="handleDeleteAccount"
        >
          <Trash2 class="w-5 h-5" />
          Deletar Conta
        </button>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <transition name="fade">
      <div
        v-if="showSuccessToast"
        class="absolute bottom-20 left-4 right-4 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50"
      >
        <CheckCircle class="w-6 h-6 flex-shrink-0" />
        <div>
          <p class="font-bold text-sm">Perfil Atualizado!</p>
          <p class="text-xs text-white/90">
            Suas alterações foram salvas com sucesso.
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>
