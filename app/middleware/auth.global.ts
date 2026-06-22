export default defineNuxtRouteMiddleware((to, from) => {
  // Pega o token armazenado nos cookies
  const token = useCookie('token')

  // Array com as rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/']

  // Se o usuário não tem token e está tentando acessar uma rota protegida
  if (!token.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login') // Redireciona para o login
  }

  // Opcional: Se o usuário já está logado e tenta acessar login/register
  if (token.value && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
    return navigateTo('/home') // Redireciona para a home
  }
})
