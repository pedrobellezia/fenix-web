<template>
  <div id="screen-notifications" class="screen flex-col h-full">
    <NavBarTop title="Notificações" :back-arrow="true" />
    <div class="flex-1 overflow-auto p-4 space-y-2 fade-in">
      <div class="bg-lilac/5 border-l-4 border-lilac rounded-r-xl p-3">
        <p class="text-sm font-bold text-gray-800">Lembrete de consulta</p>
        <p class="text-xs text-gray-500">Amanhã às 14:30 - Dra. Silva</p>
        <p class="text-[10px] text-gray-400 mt-1">Há 1 hora</p>
      </div>
      <div
        class="bg-rose-light/30 border-l-4 border-rose-dark rounded-r-xl p-3"
      >
        <p class="text-sm font-bold text-gray-800">Nova resposta no fórum</p>
        <p class="text-xs text-gray-500">Maria comentou na sua postagem</p>
        <p class="text-[10px] text-gray-400 mt-1">Há 3 horas</p>
      </div>
      <div class="bg-green-50 border-l-4 border-mint rounded-r-xl p-3">
        <p class="text-sm font-bold text-gray-800">Sessão registrada ✓</p>
        <p class="text-xs text-gray-500">Quimioterapia Ciclo 3 concluído</p>
        <p class="text-[10px] text-gray-400 mt-1">Ontem</p>
      </div>
    </div>
    <NavBarBottom />
  </div>
</template>
