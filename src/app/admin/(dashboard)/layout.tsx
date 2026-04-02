import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { type Metadata } from 'next'
import AdminSidebar from '@/components/shared/admin-sidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | Admin',
    default: 'Admin',
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        userName={session.user.name ?? 'Admin'}
        userRole={session.user.role ?? 'editor'}
      />
      <main className="flex-1 pt-20 px-4 pb-8 lg:pt-8 lg:pl-72 lg:pr-8">
        {children}
      </main>
    </div>
  )
}
