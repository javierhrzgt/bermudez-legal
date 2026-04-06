import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.siteConfig.findUnique({
    where: { id: 'default' },
  })

  const siteName = config?.siteName || 'Bermudez Legal Consulting'
  const siteDescription = config?.siteDescription || 'Consultoría legal especializada en Guatemala. Protegemos sus intereses y acompañamos su crecimiento empresarial.'

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
    title: {
      template: '%s | ' + siteName,
      default: siteName,
    },
    description: siteDescription,
    icons: {
      icon: config?.favicon || '/favicon.svg',
      shortcut: config?.favicon || '/favicon.svg',
    },
    openGraph: {
      title: siteName + ' | Bufete de Abogados en Guatemala',
      description: siteDescription,
      siteName: siteName,
      images: config?.ogImage ? [config.ogImage] : ['/og-image.png'],
      type: 'website',
    },
  }
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
