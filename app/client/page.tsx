"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ChefHat, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function ClientDashboard() {
  const { data: session } = useSession()

  // Dados mockados para demonstração
  const upcomingBookings = [
    {
      id: '1',
      date: '2024-01-15',
      time: '19:00',
      chef: 'Maria Silva',
      menu: 'Culinária Italiana',
      peopleCount: 4,
      status: 'CONFIRMED'
    }
  ]

  const recentBookings = [
    {
      id: '2',
      date: '2024-01-10',
      chef: 'Ana Costa',
      menu: 'Culinária Francesa',
      peopleCount: 2,
      status: 'COMPLETED'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo de volta, {session?.user?.name}!
        </h1>
        <p className="text-orange-100">
          Gerencie seus agendamentos e descubra novos sabores
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Novo Agendamento</CardTitle>
            <CardDescription>
              Agende uma refeição personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/client/new-booking">
              <Button className="w-full">
                <ChefHat className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Meu Perfil</CardTitle>
            <CardDescription>
              Atualize suas preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/client/profile">
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Histórico</CardTitle>
            <CardDescription>
              Veja todos os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/client/bookings">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Próximos Agendamentos
            </CardTitle>
            <CardDescription>
              Seus próximos compromissos culinários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{booking.chef}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Confirmado
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.menu}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</span>
                      <span>{booking.peopleCount} pessoas</span>
                    </div>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Agendamentos Recentes
            </CardTitle>
            <CardDescription>
              Histórico dos seus últimos pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{booking.chef}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        Concluído
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.menu}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{new Date(booking.date).toLocaleDateString('pt-BR')}</span>
                      <span>{booking.peopleCount} pessoas</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum agendamento recente
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {upcomingBookings.length}
              </div>
              <p className="text-sm text-gray-600">Agendamentos Ativos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {recentBookings.length}
              </div>
              <p className="text-sm text-gray-600">Refeições Realizadas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                3
              </div>
              <p className="text-sm text-gray-600">Chefs Experimentados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                4.8
              </div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
