"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, Calendar, Users, LogOut } from 'lucide-react'

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    try {
      if (status === 'loading') return
      
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      // Verificar se o usuário é um chef
      const userRole = (session.user as any).role
      if (userRole !== 'CHEF') {
        router.push('/')
        return
      }
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error)
      router.push('/auth/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chef Dashboard</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {session.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/chef" className="flex items-center py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <ChefHat className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link href="/chef/bookings" className="flex items-center py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              Agendamentos
            </Link>
            <Link href="/chef/profile" className="flex items-center py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              <Users className="h-4 w-4 mr-2" />
              Perfil
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
