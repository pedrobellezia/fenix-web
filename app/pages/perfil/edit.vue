<script setup lang="ts">
import { ref } from 'vue'
import {
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  CheckCircle,
} from 'lucide-vue-next'

const name = ref('Laura Pereira')
const email = ref('laura.pereira@gmail.com')
const phone = ref('(11) 98765-4321')
const birthDate = ref('1998-05-15')
const bio = ref(
  'Paciente em tratamento oncológico. Sempre buscando forças na comunidade e compartilhando amor.',
)
const showSuccessToast = ref(false)

const handleSave = () => {
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 2000)
}
</script>

<template>
  <div
    id="screen-profile-edit"
    class="screen flex-col h-full bg-white relative"
  >
    <!-- Header -->
    <NavBarTop title="Perfil" :back-arrow="true" />

    <!-- Main Content -->
    <div class="flex-1 overflow-auto p-6 space-y-6 pb-24 fade-in">
      <!-- Profile Picture -->
      <div class="flex flex-col items-center">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-lilac to-rose flex items-center justify-center text-4xl text-white font-bold shadow-lg"
          >
            LP
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

      <!-- Form -->
      <div class="space-y-4">
        <!-- Name Input -->
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

        <!-- Email Input -->
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

        <!-- Phone Input -->
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Telefone / Celular
          </label>
          <div class="relative flex items-center">
            <Phone class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-rose-dark/20 bg-rose-light/20 focus:border-lilac focus:bg-white focus:outline-none focus:ring-2 focus:ring-lilac/25 transition-all text-sm text-gray-700 font-medium"
            >
          </div>
        </div>

        <!-- Birth Date Input -->
        <div>
          <label
            class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1"
          >
            Data de Nascimento
          </label>
          <div class="relative flex items-center">
            <Calendar class="absolute left-4 w-5 h-5 text-lilac/70" />
            <input
              v-model="birthDate"
              type="date"
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
          @click="navigateTo('/profile')"
        >
          Cancelar
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
