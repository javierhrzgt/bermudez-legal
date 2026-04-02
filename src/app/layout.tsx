import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | Bermudez Legal Consulting',
    default: 'Bermudez Legal Consulting',
  },
  description: 'Consultoría legal especializada en Guatemala. Expertos en propiedad intelectual, contratos empresariales y asesoría legal para emprendedores y empresas.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Bermudez Legal Consulting | Bufete de Abogados en Guatemala",
    description: "Consultoría legal especializada en Guatemala. Expertos en propiedad intelectual, contratos empresariales y asesoría legal para emprendedores y empresas.",
    siteName:'Bermudez Legal Consulting',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}