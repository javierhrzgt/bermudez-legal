import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

// Inicializar Auth.js SOLO con la config Edge-safe
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // Ejecutar en todas las rutas EXCEPTO:
  // - rutas de API, archivos estaticos, imagenes y assets .png
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}