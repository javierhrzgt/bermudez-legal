import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
    title: {
      template: `%s | ${siteConfig.siteName}`,
      default: siteConfig.siteName,
    },
    description: siteConfig.siteDescription,
    icons: {
      icon: siteConfig.favicon,
      shortcut: siteConfig.favicon,
    },
    openGraph: {
      title: `${siteConfig.siteName} | Bufete de Abogados en Guatemala`,
      description: siteConfig.siteDescription,
      siteName: siteConfig.siteName,
      images: [siteConfig.ogImage],
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