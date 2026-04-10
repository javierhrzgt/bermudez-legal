'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { siteConfig } from '@/config/site'

const schema = z
  .object({
    newPassword: z.string().min(6, { message: 'Minimo 6 caracteres' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: data.newPassword }),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Ocurrio un error. Intenta de nuevo.')
      setIsLoading(false)
      return
    }

    setSuccess(true)
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
            Restablecer Contrasena
          </h1>
          <p className="text-muted-foreground">{siteConfig.siteName}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
          {success ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Contrasena Actualizada</h2>
              <p className="text-muted-foreground">
                Su contrasena ha sido restablecida exitosamente.
              </p>
              <Link
                href="/admin/login"
                className="inline-block bg-primary-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-all mt-4"
              >
                Ir a Iniciar Sesion
              </Link>
            </div>
          ) : (
            <>
              {(error || !token) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    {!token
                      ? 'Enlace de recuperacion invalido. No se proporciono un token.'
                      : error}
                  </p>
                </div>
              )}

              {token ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                      Nueva Contrasena
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Minimo 6 caracteres"
                        className="w-full pl-12 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                        {...register('newPassword')}
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Confirmar Contrasena
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repita la contrasena"
                        className="w-full pl-12 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-800 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Restableciendo...' : 'Restablecer Contrasena'}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <Link
                    href="/admin/forgot-password"
                    className="text-primary-700 hover:text-primary-800 font-medium text-sm"
                  >
                    Solicitar nuevo enlace
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
