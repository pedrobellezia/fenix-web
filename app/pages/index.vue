<template>
  <div>
    <nav class="sticky top-0 z-50 w-full border-b border-gray-300 dark:border-slate-800 bg-[#F2F1F6]/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm transition-colors duration-300">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
            
            <div class="flex items-center gap-2 cursor-pointer" @click="scrollToTop">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#575991]/20 to-rose-300/20 shadow-inner">
                <img src="~/assets/images/logo-fenix.png" alt="Logo Fênix" class="h-10 w-10 object-contain">
                </div>
                <span class="hidden sm:block text-xl font-bold text-[#575991] dark:text-indigo-400">Fênix</span>
            </div>

            <div class="flex items-center gap-3 sm:gap-4">
                
                <button @click="toggleTheme" class="p-2 rounded-lg bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#575991]">
                    <svg v-if="!isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                </button>

                <button @click="navigateToLogin" class="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#575991] dark:hover:text-white transition-colors">
                    Entrar
                </button>
                <button @click="navigateToRegister" class="rounded-xl bg-[#575991] px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#4a4b7a] dark:hover:bg-indigo-500 hover:-translate-y-0.5 whitespace-nowrap">
                    Criar Conta
                </button>
            </div>
        </div>
    </nav>

    <header class="relative bg-[#575991] dark:bg-slate-950 px-6 py-20 sm:py-32 overflow-hidden shadow-md transition-colors duration-300">
        <div class="absolute inset-0 opacity-10 dark:opacity-20" style="background: radial-gradient(circle at center, #EAE8ED, transparent);"></div>
        
        <div class="relative mx-auto max-w-3xl text-center">
            <h1 class="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
                Renascendo com esperança a cada dia
            </h1>
            <p class="mb-10 text-base sm:text-lg md:text-xl leading-relaxed text-[#EAE9F0] dark:text-slate-400">
                Uma rede de apoio segura e acolhedora. Conecte-se com pessoas que entendem a sua jornada, compartilhe suas conquistas e encontre conforto em uma comunidade feita para cuidar de você.
            </p>
            <button @click="navigateToRegister" class="rounded-xl bg-[#71CFA0] dark:bg-[#5cb88a] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg shadow-[#71CFA0]/20 dark:shadow-none transition-all hover:bg-[#5dbb8c] hover:-translate-y-1 hover:shadow-xl">
                Começar Gratuitamente
            </button>
        </div>
    </header>

    <section class="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32">
        <div class="mb-12 sm:mb-16 text-center">
            <h2 class="text-3xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-4xl">Por que escolher o Fênix?</h2>
            <p class="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">Um ambiente desenvolvido pensando no seu bem-estar e privacidade.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <div class="rounded-2xl border border-gray-300/60 dark:border-slate-700 bg-[#F2F1F6] dark:bg-slate-800 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#575991]/10 dark:bg-[#575991]/30 text-[#575991] dark:text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h3 class="mb-2 text-xl font-bold text-slate-800 dark:text-white">Comunidade Acolhedora</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Interaja através de posts e reações protegidas contra spam. Um espaço livre de julgamentos.</p>
            </div>

            <div class="rounded-2xl border border-gray-300/60 dark:border-slate-700 bg-[#F2F1F6] dark:bg-slate-800 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#71CFA0]/10 dark:bg-[#71CFA0]/20 text-[#71CFA0] dark:text-[#71CFA0]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 class="mb-2 text-xl font-bold text-slate-800 dark:text-white">Compartilhe sua Jornada</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Faça upload de fotos e escreva desabafos ou conquistas de forma simples e direta.</p>
            </div>

            <div class="rounded-2xl border border-gray-300/60 dark:border-slate-700 bg-[#F2F1F6] dark:bg-slate-800 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 class="mb-2 text-xl font-bold text-slate-800 dark:text-white">Segurança de Dados</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Autenticação JWT robusta, senhas criptografadas e conformidade total com a sua privacidade.</p>
            </div>
        </div>
    </section>

    <section class="bg-[#DCDAE6] dark:bg-slate-950 py-20 sm:py-32 border-t border-gray-300/50 dark:border-slate-800 shadow-inner transition-colors duration-300">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
            <div class="mb-12 sm:mb-16 text-center">
                <h2 class="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Feito para Todos</h2>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
                
                <div class="rounded-3xl border border-gray-300/60 dark:border-slate-800 bg-[#F2F1F6] dark:bg-slate-900 p-8 shadow-sm">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">Paciente</h3>
                    <p class="mt-4 flex items-baseline gap-x-2">
                        <span class="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">Grátis</span>
                    </p>
                    <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Acesso completo à comunidade e recursos de bem-estar.</p>
                    <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Postagens ilimitadas</li>
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Upload de mídias</li>
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Interação na comunidade</li>
                    </ul>
                    <button @click="navigateToRegister" class="mt-8 w-full rounded-xl bg-[#EAE8ED] dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Cadastrar</button>
                </div>

                <div class="relative rounded-3xl border-2 border-[#575991] dark:border-indigo-500 bg-[#F2F1F6] dark:bg-slate-900 p-8 shadow-lg">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#575991] dark:bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-sm whitespace-nowrap">
                        Profissional de Saúde
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">Acolhedor</h3>
                    <p class="mt-4 flex items-baseline gap-x-2">
                        <span class="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">Validado</span>
                    </p>
                    <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Para médicos, terapeutas e especialistas que desejam guiar pacientes.</p>
                    <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <li class="flex gap-3"><span class="text-[#575991] dark:text-indigo-400 font-bold">✓</span> Selo de Profissional</li>
                        <li class="flex gap-3"><span class="text-[#575991] dark:text-indigo-400 font-bold">✓</span> Artigos e Orientações</li>
                        <li class="flex gap-3"><span class="text-[#575991] dark:text-indigo-400 font-bold">✓</span> Moderação de conteúdo</li>
                    </ul>
                    <button class="mt-8 w-full rounded-xl bg-[#575991] dark:bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-[#4a4b7a] dark:hover:bg-indigo-700 shadow-md transition-colors">Solicitar Acesso</button>
                </div>

                <div class="rounded-3xl border border-gray-300/60 dark:border-slate-800 bg-[#F2F1F6] dark:bg-slate-900 p-8 shadow-sm mt-8 lg:mt-0">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">Instituição</h3>
                    <p class="mt-4 flex items-baseline gap-x-2">
                        <span class="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">Parceiro</span>
                    </p>
                    <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Clínicas e hospitais que apoiam o tratamento humanizado.</p>
                    <ul class="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Página Oficial</li>
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Divulgação de Campanhas</li>
                        <li class="flex gap-3"><span class="text-[#71CFA0] font-bold">✓</span> Relatórios de Impacto</li>
                    </ul>
                    <button class="mt-8 w-full rounded-xl bg-[#EAE8ED] dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Fale Conosco</button>
                </div>

            </div>
        </div>
    </section>

    <footer class="bg-[#F2F1F6] dark:bg-slate-900 py-8 border-t border-gray-300 dark:border-slate-800 transition-colors duration-300">
        <div class="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            <p>© 2026 Fênix - Renascendo com esperança a cada dia. Em conformidade com a LGPD.</p>
        </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

const isDark = ref(false)

useHead({
  bodyAttrs: {
    class: 'antialiased min-h-screen bg-[#EAE8ED] dark:bg-slate-900 text-slate-700 dark:text-slate-300'
  }
})

onMounted(() => {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
    } else {
        isDark.value = false
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
    }
})

const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('color-theme', isDark.value ? 'dark' : 'light')
    
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
    } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
    }
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const navigateToLogin = () => {
    navigateTo('/login')
}

const navigateToRegister = () => {
    navigateTo('/register')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

body { 
    font-family: 'Quicksand', sans-serif; 
    transition: background-color 0.3s ease, color 0.3s ease;
}
::selection {
    background-color: rgba(87, 89, 145, 0.5); 
    color: white;
}
</style>
