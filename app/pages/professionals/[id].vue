<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Professional } from '~/types'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import { Star, MapPin, Clock } from 'lucide-vue-next'
import profData from '~/data/professionals.json'

const route = useRoute()

const professionals = ref<Professional[]>(profData as Professional[])
const id = route.params.id

const professional = professionals.value.find((prof) => prof.id === id)

if (!professional) {
  navigateTo('/error')
}
</script>

<template>
  <div id="screen-prof-detail" class="screen flex-col h-full">
    <NavBarTop :title="professional?.name || 'Profissional'" />
    <div class="flex-1 overflow-auto p-4 fade-in">
      <div v-if="professional" class="flex flex-col items-center mb-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2"
          :class="getSpecialtyBgClass(professional.specialty)"
        >
          <component
            :is="getSpecialtyIcon(professional.specialty)"
            class="w-10 h-10"
            :class="getSpecialtyTextClass(professional.specialty)"
          />
        </div>
        <h3 class="font-bold text-gray-800">{{ professional.name }}</h3>
        <p class="text-sm text-gray-500">
          {{ professional.specialty }} • {{ professional.crm }}
        </p>
        <div class="flex items-center gap-1 mt-1">
          <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
          <span class="text-sm font-bold text-gray-700">{{
            professional.rating
          }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 mt-10">
        Profissional não encontrado.
      </div>

      <div v-if="professional" class="bg-rose-light/50 rounded-xl p-4 mb-3">
        <p class="text-sm text-gray-700">
          {{ professional.description }}
        </p>
      </div>

      <div v-if="professional" class="space-y-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <MapPin class="w-4 h-4 text-lilac" />
          {{ professional.location }}
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Clock class="w-4 h-4 text-lilac" />
          {{ professional.availability }}
        </div>
      </div>

      <button
        v-if="professional"
        class="w-full py-3 bg-mint text-white font-bold rounded-xl hover:bg-mint-dark transition shadow-lg shadow-mint/30"
      >
        Solicitar Agendamento
      </button>
    </div>
    <NavBarBottom />
  </div>
</template>
