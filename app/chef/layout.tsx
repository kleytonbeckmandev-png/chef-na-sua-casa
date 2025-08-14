"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ChefHat, Calendar, User, LogOut, Home, Clock, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ChefLayout({
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

    if ((session.user as any).role !== 'CHEF') {
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
            <h1 className="text-xl font-semibold text-gray-900">Chef na Sua Casa</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Olá, Chef {session.user?.name}
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
                  href="/chef"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chef/profile"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Meu Perfil</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chef/bookings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Agendamentos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chef/calendar"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <Clock className="h-5 w-5" />
                  <span>Calendário</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chef/ingredients"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <UtensilsCrossed className="h-5 w-5" />
                  <span>Ingredientes</span>
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
