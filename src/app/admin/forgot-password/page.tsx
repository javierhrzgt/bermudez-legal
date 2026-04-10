'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/config/site'

// Zod v4: z.email() es top-level, NO z.string().email()
const schema = z.object({
  email: z.email({ message: 'Ingresa un email valido' }),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    // Siempre mostrar exito para no revelar si el email existe
    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            {siteConfig.logo ? (
              <Image src={siteConfig.logo} alt={siteConfig.siteName} width={48} height={48} className="rounded-xl object-contain" />
            ) : (
              <div className="bg-primary-800 p-3 rounded-xl">
                <siteConfig.logoFallbackIcon className="h-7 w-7 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-muted-foreground">{siteConfig.siteName}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Correo Enviado</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Si el email esta registrado, recibirá un enlace para restablecer su contraseña.
                Revise su bandeja de entrada y la carpeta de spam.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium text-sm mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesion
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-6">
                Ingrese su email y le enviaremos un enlace para restablecer su contraseña.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@ejemplo.com"
                      className="w-full pl-12 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-800 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800 hover:underline transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio de sesion
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
