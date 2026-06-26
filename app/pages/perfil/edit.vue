<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import {
  Camera,
  User,
  Mail,
  AtSign,
  Activity,
  Heart,
  CheckCircle,
  Trash2,
  X,
} from 'lucide-vue-next'

const config = useRuntimeConfig()
const token = useCookie('token')
const userData = ref<any>(null)

const name = ref('')
const displayName = ref('')
const email = ref('')
const treatmentPhase = ref('')
const bio = ref('')
const picUrl = ref('')

const showSuccessToast = ref(false)

// Image Cropper State
const fileInput = ref<HTMLInputElement | null>(null)
const cropperRef = ref<any>(null)
const imageToCrop = ref<string | null>(null)
const showCropperModal = ref(false)
const isUploading = ref(false)
const showAvatarMenu = ref(false)

const fetchProfile = async () => {
  if (!token.value) {
    navigateTo('/login')
    return
  }
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http')
      ? config.public.baseApiUrl
      : `http://${config.public.baseApiUrl}`
    const data: any = await $fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    userData.value = data
    name.value = data.name || ''
    displayName.value = data.displayName || ''
    email.value = data.email || ''
    treatmentPhase.value = data.treatmentPhase || ''
    bio.value = data.bio || ''
    picUrl.value = data.picUrl || ''
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchProfile()
})

// Trigger file selection
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageToCrop.value = e.target?.result as string
    showCropperModal.value = true
  }
  reader.readAsDataURL(file)

  // Clear input so same file can be selected again
  target.value = ''
}

// Cancel cropping
const cancelCrop = () => {
  showCropperModal.value = false
  imageToCrop.value = null
}

// Confirm cropping and upload
const confirmCrop = async () => {
  if (!cropperRef.value) return

  const { canvas } = cropperRef.value.getResult()
  if (!canvas) return

  isUploading.value = true

  canvas.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      isUploading.value = false
      return
    }

    const formData = new FormData()
    formData.append('file', blob, 'avatar.png')

    try {
      const baseUrl = config.public.baseApiUrl.startsWith('http')
        ? config.public.baseApiUrl
        : `http://${config.public.baseApiUrl}`
      await $fetch(`${baseUrl}/me/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      })

      // Refresh profile to get the new picUrl
      await fetchProfile()

      showCropperModal.value = false
      imageToCrop.value = null
    } catch (e) {
      console.error('Error uploading photo:', e)
    } finally {
      isUploading.value = false
    }
  }, 'image/png')
}

const handleSave = async () => {
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http')
      ? config.public.baseApiUrl
      : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        ...userData.value,
        name: name.value,
        displayName: displayName.value,
        email: email.value,
        treatmentPhase: treatmentPhase.value,
        bio: bio.value,
        picUrl: picUrl.value,
      },
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
  if (
    !confirm(
      'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
    )
  )
    return
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http')
      ? config.public.baseApiUrl
      : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    token.value = null
    navigateTo('/login')
  } catch (e) {
    console.error(e)
  }
}

const getAvatarUrl = () => {
  if (picUrl.value) {
    if (picUrl.value.startsWith('http')) return picUrl.value
    const baseUrl = config.public.baseApiUrl.startsWith('http')
      ? config.public.baseApiUrl
      : `http://${config.public.baseApiUrl}`
    return `${baseUrl}/upload/${picUrl.value}`
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.value || 'Usuário')}&background=9B72CF&color=fff&size=128`
}

const selectNewPhoto = () => {
  showAvatarMenu.value = false
  triggerFileInput()
}

const removePhoto = () => {
  showAvatarMenu.value = false
  picUrl.value = ''
  handleSave()
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
        <div class="relative cursor-pointer" @click="showAvatarMenu = true">
          <img
            :src="getAvatarUrl()"
            alt="Avatar"
            class="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white"
          />
          <button
            class="absolute bottom-0 right-0 bg-mint text-white p-2 rounded-full shadow-lg hover:bg-mint-dark transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white"
          >
            <Camera class="w-4 h-4" />
          </button>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileSelected"
        />
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
            />
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
            />
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
            />
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
              placeholder="Ex: Fase Inicial"
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            />
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

    <!-- Cropper Modal -->
    <div
      v-if="showCropperModal"
      class="fixed inset-0 bg-black/90 z-[100] flex flex-col"
    >
      <div class="flex items-center justify-between p-4 text-white">
        <button
          class="p-2 hover:bg-white/10 rounded-full transition-colors"
          :disabled="isUploading"
          @click="cancelCrop"
        >
          <X class="w-6 h-6" />
        </button>
        <h3 class="font-bold">Ajustar Foto</h3>
        <button
          class="px-4 py-1.5 bg-mint text-white rounded-lg font-bold hover:bg-mint-dark transition-colors disabled:opacity-50"
          :disabled="isUploading"
          @click="confirmCrop"
        >
          {{ isUploading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>

      <div
        class="flex-1 flex items-center justify-center relative overflow-hidden bg-black p-4"
      >
        <Cropper
          ref="cropperRef"
          class="w-full max-h-[80vh]"
          :src="imageToCrop"
          :stencil-component="CircleStencil"
          :stencil-props="{
            aspectRatio: 1,
            movable: false,
            resizable: false,
            handlers: {},
            lines: {},
            overlayClass: 'cropper-solid-overlay',
          }"
          background-class="cropper-solid-bg"
          image-restriction="stencil"
        />
      </div>
    </div>

    <!-- Avatar Menu Modal -->
    <div v-if="showAvatarMenu" class="fixed inset-0 bg-black/50 z-[100] flex flex-col justify-end" @click="showAvatarMenu = false">
      <div class="bg-white rounded-t-2xl p-4 shadow-xl" @click.stop>
        <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h3 class="font-bold text-gray-800 text-center mb-4">Foto de Perfil</h3>
        <div class="space-y-2">
          <button class="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-semibold" @click="selectNewPhoto">
            <Camera class="w-5 h-5 text-mint" />
            Escolher nova foto
          </button>
          <button class="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold" @click="removePhoto">
            <Trash2 class="w-5 h-5" />
            Excluir foto atual
          </button>
          <button class="w-full flex items-center justify-center p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors font-semibold mt-2" @click="showAvatarMenu = false">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cropper-solid-overlay {
  background-color: rgba(0, 0, 0, 1) !important;
  opacity: 1 !important;
}
.cropper-solid-bg {
  background-color: #000000 !important;
}
</style>
