import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  // Paginas personalizadas
  pages: {
    signIn: '/admin/login',
  },

  // Los providers se declaran en auth.ts (completos con bcrypt)
  // Aqui se dejan vacios para que el middleware pueda importar este archivo
  providers: [],

  callbacks: {
    // Se ejecuta en CADA request del middleware
    // Decide si el usuario tiene acceso a la ruta solicitada
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      // Paginas de autenticacion: siempre publicas
      const isAuthPage = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']
        .some(p => nextUrl.pathname.startsWith(p))

      // Area de administracion: requiere autenticacion
      const isAdminArea = nextUrl.pathname.startsWith('/admin')

      if (isAdminArea && !isAuthPage) {
        return isLoggedIn
      }

      // Todas las demas rutas son publicas
      return true
    },
  },
}