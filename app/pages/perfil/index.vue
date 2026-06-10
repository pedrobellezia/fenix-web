<script setup lang="ts">
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import { Edit, ChevronRight, Bell, Shield, LogOut } from 'lucide-vue-next'
</script>
<template>
  <div id="screen-profile" class="screen flex-col h-full">
    <NavBarTop title="Perfil" />
    <div class="flex-1 overflow-auto p-4 fade-in">
      <div class="flex flex-col items-center mb-5">
        <div
          class="w-20 h-20 rounded-full bg-gradient-to-br from-lilac to-rose flex items-center justify-center text-3xl text-white font-bold mb-2"
        >
          LP
        </div>
        <h3 class="font-bold text-gray-800">Laura Pereira</h3>
        <p class="text-sm text-gray-500">Paciente • Membro desde Jun 2025</p>
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
          class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
        >
          <Shield class="w-5 h-5 text-lilac" />
          <span class="text-sm font-medium text-gray-700">Privacidade</span>
          <ChevronRight class="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <button
          class="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition mt-4"
          @click="navigateTo('/login')"
        >
          <LogOut class="w-5 h-5 text-red-500" />
          <span class="text-sm font-medium text-red-600">Sair</span>
        </button>
      </div>
    </div>
    <NavBarBottom />
  </div>
</template>
