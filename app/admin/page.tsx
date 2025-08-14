"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, ChefHat, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session } = useSession()

  // Dados mockados para demonstração
  const stats = {
    totalUsers: 156,
    totalChefs: 23,
    totalBookings: 89,
    totalRevenue: 15600,
    pendingBookings: 12,
    activeUsers: 89
  }

  const recentBookings = [
    {
      id: '1',
      client: 'João Silva',
      chef: 'Maria Costa',
      date: '2024-01-15',
      time: '19:00',
      status: 'CONFIRMED',
      amount: 200
    },
    {
      id: '2',
      client: 'Ana Santos',
      chef: 'Pedro Lima',
      date: '2024-01-15',
      time: '20:30',
      status: 'PENDING',
      amount: 150
    },
    {
      id: '3',
      client: 'Carlos Oliveira',
      chef: 'Fernanda Silva',
      date: '2024-01-16',
      time: '18:00',
      status: 'CONFIRMED',
      amount: 300
    }
  ]

  const recentUsers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'CLIENT',
      joinDate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Maria Costa',
      email: 'maria@email.com',
      role: 'CHEF',
      joinDate: '2024-01-12'
    },
    {
      id: '3',
      name: 'Pedro Lima',
      email: 'pedro@email.com',
      role: 'CHEF',
      joinDate: '2024-01-14'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, Admin {session?.user?.name}!
        </h1>
        <p className="text-blue-100">
          Gerencie a plataforma Chef na Sua Casa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalChefs}
                </div>
                <p className="text-sm text-gray-600">Cozinheiras</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalBookings}
                </div>
                <p className="text-sm text-gray-600">Agendamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  R$ {stats.totalRevenue}
                </div>
                <p className="text-sm text-gray-600">Receita Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gerenciar Usuários</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Acessar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agendamentos</CardTitle>
            <CardDescription>
              Acompanhe todos os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Configurações</CardTitle>
            <CardDescription>
              Configure a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">
                <ChefHat className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Ações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-yellow-700">
              • {stats.pendingBookings} agendamentos aguardando confirmação
            </p>
            <p className="text-sm text-yellow-700">
              • 3 novos usuários aguardando aprovação
            </p>
            <p className="text-sm text-yellow-700">
              • 2 cozinheiras com documentos pendentes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
            <CardDescription>
              Últimos agendamentos da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{booking.client}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Chef: {booking.chef}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span>{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</span>
                    <span className="font-semibold">R$ {booking.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>
              Novos usuários cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{user.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'CHEF' 
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'CHEF' ? 'Cozinheira' : 'Cliente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Cadastrado em {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Métricas de Performance
          </CardTitle>
          <CardDescription>
            Resumo do desempenho da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Taxa de Ativação</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(stats.totalRevenue / stats.totalBookings)}
              </div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {Math.round((stats.totalBookings / stats.totalUsers) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Taxa de Conversão</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {Math.round(stats.totalBookings / 30)}
              </div>
              <p className="text-sm text-gray-600">Agendamentos/Dia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
