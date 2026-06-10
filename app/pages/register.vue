<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const role = ref('paciente')
const name = ref('')
const email = ref('')
const password = ref('')

const selectRole = (selectedRole: string) => {
  role.value = selectedRole
}

const handleRegister = () => {
  // Simular cadastro e redirecionar
  navigateTo('/home')
}
</script>

<template>
  <div id="screen-register" class="screen flex-col h-full active">
    <header
      class="bg-gradient-to-r from-lilac to-rose-dark p-4 flex items-center gap-3"
    >
      <button class="text-white flex items-center" @click="navigateTo('/login')">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h2 class="text-white font-bold text-lg">Cadastro</h2>
    </header>
    <div class="flex-1 overflow-auto p-6 space-y-4">
      <div class="flex gap-3">
        <button
          id="btn-paciente"
          class="flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all"
          :class="role === 'paciente' ? 'border-lilac bg-lilac/10 text-lilac' : 'border-gray-200 text-gray-400'"
          @click="selectRole('paciente')"
        >
          Paciente
        </button>
        <button
          id="btn-profissional"
          class="flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all"
          :class="role === 'profissional' ? 'border-lilac bg-lilac/10 text-lilac' : 'border-gray-200 text-gray-400'"
          @click="selectRole('profissional')"
        >
          Profissional
        </button>
      </div>
      <div>
        <label
          for="reg-name"
          class="text-sm font-medium text-gray-600 block mb-1"
          >Nome completo</label
        >
        <input
          id="reg-name"
          v-model="name"
          type="text"
          placeholder="Seu nome"
          class="w-full px-4 py-3 rounded-xl border border-rose/40 focus:outline-none focus:ring-2 focus:ring-lilac/50 bg-rose-light/30"
        >
      </div>
      <div>
        <label
          for="reg-email"
          class="text-sm font-medium text-gray-600 block mb-1"
          >E-mail</label
        >
        <input
          id="reg-email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          class="w-full px-4 py-3 rounded-xl border border-rose/40 focus:outline-none focus:ring-2 focus:ring-lilac/50 bg-rose-light/30"
        >
      </div>
      <div>
        <label
          for="reg-pass"
          class="text-sm font-medium text-gray-600 block mb-1"
          >Senha</label
        >
        <input
          id="reg-pass"
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-3 rounded-xl border border-rose/40 focus:outline-none focus:ring-2 focus:ring-lilac/50 bg-rose-light/30"
        >
      </div>
      <button
        class="w-full py-3 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition-all shadow-lg shadow-mint/30"
        @click="handleRegister"
      >
        Cadastrar
      </button>
    </div>
  </div>
</template>

