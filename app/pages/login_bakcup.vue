<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const config = useRuntimeConfig()
const token = useCookie('token', { maxAge: 60 * 60 * 24 * 7 }) // 7 dias de expiração
const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 * 7 }) // 7 dias de expiração

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const baseUrl = config.public.baseApiUrl.startsWith('http') ? config.public.baseApiUrl : `http://${config.public.baseApiUrl}`
    const response = await $fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    const rawToken = typeof response === 'string' ? response : (response as any)?.token || (response as any)
    token.value = rawToken
    
    // Busca informações do usuário autenticado
    const userData = await $fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${rawToken}`
      }
    })
    
    // Salva o cookie de usuário de forma codificada em Base64
    userCookie.value = btoa(JSON.stringify(userData))
    
    navigateTo('/home')
  } catch (_e) {
    console.error(_e)
    errorMsg.value = 'Falha no login. Verifique suas credenciais.'
  }
}
</script>

<template>
  <div
    id="screen-login"
    class="flex h-full min-h-screen flex-col font-[Quicksand]"
  >
    <div
      class="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-lilac to-rose-dark p-8"
    >
      <div
        class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
      >
        <span class="text-5xl">🔥</span>
      </div>

      <h1 id="app-title" class="mb-2 text-4xl font-bold text-white">Fênix</h1>

      <p class="text-center text-sm text-white/80">
        Renascendo com esperança a cada dia
      </p>
    </div>

    <div class="space-y-4 p-6">
      <div>
        <label
          for="login-email"
          class="mb-1 block text-sm font-medium text-gray-600"
        >
          E-mail
        </label>

        <input
          id="login-email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          class="w-full rounded-xl border border-rose/40 bg-rose-light/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/50"
        >
      </div>

      <div>
        <label
          for="login-pass"
          class="mb-1 block text-sm font-medium text-gray-600"
        >
          Senha
        </label>

        <input
          id="login-pass"
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-xl border border-rose/40 bg-rose-light/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lilac/50"
        >
      </div>

      <p v-if="errorMsg" class="text-sm text-red-500 font-medium text-center">{{ errorMsg }}</p>

      <button
        class="w-full rounded-xl bg-mint py-3 font-bold text-white shadow-lg shadow-mint/30 transition-all hover:bg-mint-dark"
        @click="handleLogin"
      >
        Entrar
      </button>

      <button
        class="w-full py-2 text-sm font-medium text-lilac"
        @click="navigateTo('/register')"
      >
        Criar conta
      </button>
    </div>
  </div>
</template>

