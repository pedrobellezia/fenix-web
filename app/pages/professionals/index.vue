<script setup lang="ts">
import { ref } from 'vue'
import type { Professional } from '~/types'
import NavBarTop from '~/components/NavBarTop.vue'
import NavBarBottom from '~/components/NavBarBottom.vue'
import { Star } from 'lucide-vue-next'
import professionalsData from '~/data/professionals.json'

const professionals = ref<Professional[]>(professionalsData as Professional[])
</script>

<template>
  <div id="screen-professionals" class="screen flex-col h-full">
    <NavBarTop title="Profissionais" />
    <div class="flex-1 overflow-auto p-4 space-y-3 fade-in">
      <div
        v-for="prof in professionals"
        :key="prof.id"
        class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-lg"
          :class="getSpecialtyBgClass(prof.specialty)"
        >
          <component
            :is="getSpecialtyIcon(prof.specialty)"
            class="w-6 h-6"
            :class="getSpecialtyTextClass(prof.specialty)"
          />
        </div>
        <div class="flex-1">
          <p class="font-bold text-gray-800 text-sm">{{ prof.name }}</p>
          <p class="text-xs text-gray-500">{{ prof.specialty }}</p>
          <div class="flex items-center gap-1 mt-1">
            <Star class="w-3 h-3 text-amber-400 fill-amber-400" />
            <span class="text-xs text-gray-500">{{ prof.rating }}</span>
          </div>
        </div>
        <button
          class="px-3 py-2 bg-mint text-white text-xs font-bold rounded-lg"
          @click="navigateTo(`/professionals/${prof.id}`)"
        >
          Ver
        </button>
      </div>
    </div>
    <NavBarBottom />
  </div>
</template>
