<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'

const role = ref('PACIENTE')
const name = ref('')
const displayName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const mostrarSenha = ref(false)

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
  <div
    id="screen-register"
    class="flex min-h-screen flex-col items-center justify-center bg-[#575991] px-4 font-sans"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-[#EAE9F0] p-8 shadow-md border border-[#DCDAE6]"
    >
      <div class="mb-8 flex flex-col items-center justify-center relative">
        <button
          class="absolute left-0 top-0 p-2 text-slate-500 hover:text-lilac transition-colors"
          @click="navigateTo('/login')"
        >
          <ArrowLeft class="h-6 w-6" />
        </button>

        <div
          class="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-lilac/30 to-rose-light/30 shadow-inner"
        >
          <!-- Logo da Fênix -->
          <img
            src="~/assets/images/logo-fenix.png"
            alt="Logo Fênix"
            class="h-24 w-24 object-contain drop-shadow-md"
          />
        </div>

        <h1 class="mb-1 text-3xl font-bold text-slate-700">
          Cadastro
        </h1>
        <p class="text-center text-sm font-medium text-slate-500">
          Crie sua conta para começar
        </p>
      </div>

      <!-- Formulário -->
      <div class="space-y-5">
        <!-- Nome -->
        <div>
          <label
            for="reg-name"
            class="mb-1 block text-sm font-semibold text-slate-600"
          >
            Nome completo
          </label>
          <input
            id="reg-name"
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lilac/50 transition-all"
          />
        </div>

        <!-- Nome de exibição -->
        <div>
          <label
            for="reg-display-name"
            class="mb-1 block text-sm font-semibold text-slate-600"
          >
            Nome de exibição
          </label>
          <input
            id="reg-display-name"
            v-model="displayName"
            type="text"
            placeholder="Como quer ser chamado?"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lilac/50 transition-all"
          />
        </div>

        <!-- E-mail -->
        <div>
          <label
            for="reg-email"
            class="mb-1 block text-sm font-semibold text-slate-600"
          >
            E-mail
          </label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lilac/50 transition-all"
          />
        </div>

        <!-- Senha -->
        <div>
          <label
            for="reg-pass"
            class="mb-1 block text-sm font-semibold text-slate-600"
          >
            Senha
          </label>
          <div class="relative">
            <input
              id="reg-pass"
              v-model="password"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lilac/50 transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
            />
            <!-- Botão do Olhinho Customizado -->
            <button
              type="button"
              @click="mostrarSenha = !mostrarSenha"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-lilac transition-colors"
            >
              <svg
                v-if="!mostrarSenha"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-if="errorMsg"
          class="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          {{ errorMsg }}
        </div>

        <div class="pt-2">
          <button
            class="mb-3 w-full rounded-xl bg-mint py-3 font-bold text-white shadow-md shadow-mint/20 transition-all hover:bg-mint-dark hover:-translate-y-0.5"
            @click="handleRegister"
          >
            Cadastrar
          </button>

          <div class="text-center">
            <span class="text-sm text-slate-500"
              >Já tem uma conta?
            </span>
            <button
              class="text-sm font-bold text-lilac hover:underline"
              @click="navigateTo('/login')"
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
