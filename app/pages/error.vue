<script setup lang="ts">
import { AlertCircle, Home, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div
    id="screen-error"
    class="screen flex flex-col justify-center items-center h-full min-h-screen bg-gradient-to-b from-rose-light/50 to-white p-6 text-center fade-in"
  >
    <!-- Error Icon & Visual Area -->
    <div class="mb-8 flex flex-col items-center">
      <div
        class="w-24 h-24 rounded-full bg-rose-light flex items-center justify-center text-rose-dark border-4 border-white shadow-xl animate-pulse"
      >
        <AlertCircle class="w-12 h-12" />
      </div>
      <div class="h-2 w-16 bg-rose-dark/20 rounded-full mt-4 blur-sm" />
    </div>

    <!-- Error Text Content -->
    <div class="max-w-xs space-y-3 mb-8">
      <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
        Ops! Algo deu errado
      </h1>
      <p class="text-sm text-gray-500 leading-relaxed">
        Não conseguimos encontrar as informações ou a página que você estava
        procurando.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="w-full max-w-xs space-y-3">
      <button
        class="w-full py-3.5 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition-all duration-300 shadow-lg shadow-mint/30 hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
        @click="navigateTo('/home')"
      >
        <Home class="w-4 h-4" />
        Voltar para o Início
      </button>

      <button
        class="w-full py-3.5 bg-white text-lilac font-bold rounded-xl hover:bg-rose-light/20 transition-all duration-300 border border-lilac/30 flex items-center justify-center gap-2"
        @click="goBack"
      >
        <ArrowLeft class="w-4 h-4" />
        Voltar Página Anterior
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
