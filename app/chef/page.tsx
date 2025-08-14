"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ChefHat, Clock, Users, DollarSign, Star } from 'lucide-react'
import Link from 'next/link'

export default function ChefDashboard() {
  const { data: session } = useSession()

  // Dados mockados para demonstração
  const todayBookings = [
    {
      id: '1',
      client: 'João Silva',
      time: '19:00',
      menu: 'Culinária Italiana',
      peopleCount: 4,
      address: 'Rua das Flores, 123',
      status: 'CONFIRMED'
    },
    {
      id: '2',
      client: 'Maria Santos',
      time: '20:30',
      menu: 'Culinária Francesa',
      peopleCount: 2,
      address: 'Av. Principal, 456',
      status: 'PENDING'
    }
  ]

  const upcomingBookings = [
    {
      id: '3',
      client: 'Pedro Costa',
      date: '2024-01-16',
      time: '18:00',
      menu: 'Culinária Brasileira',
      peopleCount: 6,
      address: 'Rua do Comércio, 789'
    }
  ]

  const stats = {
    totalBookings: 12,
    completedBookings: 8,
    totalEarnings: 2400,
    averageRating: 4.8
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vinda, Chef {session?.user?.name}!
        </h1>
        <p className="text-orange-100">
          Gerencie seus agendamentos e prepare refeições incríveis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalBookings}
                </div>
                <p className="text-sm text-gray-600">Total de Pedidos</p>
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
                  {stats.completedBookings}
                </div>
                <p className="text-sm text-gray-600">Concluídos</p>
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
                  R$ {stats.totalEarnings}
                </div>
                <p className="text-sm text-gray-600">Ganhos Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </div>
                <p className="text-sm text-gray-600">Avaliação Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ver Agendamentos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chef/bookings">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Calendário</CardTitle>
            <CardDescription>
              Organize sua agenda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chef/calendar">
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Abrir
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ingredientes</CardTitle>
            <CardDescription>
              Gerencie suas listas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chef/ingredients">
              <Button variant="outline" className="w-full">
                <ChefHat className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Agendamentos de Hoje
            </CardTitle>
            <CardDescription>
              Seus compromissos para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayBookings.length > 0 ? (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
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
                    <p className="text-sm text-gray-600 mb-2">{booking.menu}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {booking.time}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {booking.peopleCount} pessoas
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{booking.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum agendamento para hoje
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Próximos Agendamentos
            </CardTitle>
            <CardDescription>
              Seus próximos compromissos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{booking.client}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.menu}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {booking.time}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {booking.peopleCount} pessoas
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{booking.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum agendamento próximo
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Últimas atualizações dos seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Agendamento confirmado para João Silva - Hoje às 19:00</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Novo agendamento recebido de Maria Santos - Hoje às 20:30</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm">Agendamento concluído para Ana Costa - Ontem às 18:00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
