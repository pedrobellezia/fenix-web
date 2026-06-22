<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const role = ref('PACIENTE')
const name = ref('')
const displayName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const config = useRuntimeConfig()

const selectRole = (selectedRole: string) => {
  role.value = selectedRole
}

const handleRegister = async () => {
  errorMsg.value = ''
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http')
      ? config.public.baseApiUrl
      : `http://${config.public.baseApiUrl}`
    await $fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: {
        name: name.value,
        displayName: displayName.value || name.value.split(' ')[0],
        email: email.value,
        password: password.value,
        role: role.value,
      },
    })

    navigateTo('/login')
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Falha ao cadastrar. Verifique os dados e tente novamente.'
  }
}
</script>

<template>
  <div id="screen-register" class="screen flex-col h-full active">
    <header
      class="bg-gradient-to-r from-lilac to-rose-dark p-4 flex items-center gap-3"
    >
      <button
        class="text-white flex items-center"
        @click="navigateTo('/login')"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h2 class="text-white font-bold text-lg">Cadastro</h2>
    </header>
    <div class="flex-1 overflow-auto p-6 space-y-4">
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
        />
      </div>
      <div>
        <label
          for="reg-display-name"
          class="text-sm font-medium text-gray-600 block mb-1"
          >Nome de exibição</label
        >
        <input
          id="reg-display-name"
          v-model="displayName"
          type="text"
          placeholder="Como quer ser chamado?"
          class="w-full px-4 py-3 rounded-xl border border-rose/40 focus:outline-none focus:ring-2 focus:ring-lilac/50 bg-rose-light/30"
        />
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
        />
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
        />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-500 font-medium text-center">
        {{ errorMsg }}
      </p>
      <button
        class="w-full py-3 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition-all shadow-lg shadow-mint/30"
        @click="handleRegister"
      >
        Cadastrar
      </button>
    </div>
  </div>
</template>
