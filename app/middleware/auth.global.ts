export default defineNuxtRouteMiddleware((to, _from) => {
  // Pega o token e o usuário armazenado nos cookies
  const token = useCookie('token')
  const user = useCookie('user')

  // Rotas que não exigem o usuário logado
  const publicRoutes = ['/login', '/register', '/']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Se NÃO está logado e tenta acessar rota protegida -> Vai pro login
  if ((!token.value || !user.value) && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Se ESTÁ logado e tenta acessar rotas de login/registro/raiz -> Vai pra home
  if (token.value && user.value && isPublicRoute) {
    return navigateTo('/home')
  }
})
