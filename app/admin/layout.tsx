"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ChefHat, Users, Calendar, Settings, LogOut, Home, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    if ((session.user as any).role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-xl font-semibold text-gray-900">Chef na Sua Casa - Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, Admin {session.user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Usuários</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bookings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Agendamentos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/plans"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Planos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/menus"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <ChefHat className="h-5 w-5" />
                  <span>Cardápios</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
