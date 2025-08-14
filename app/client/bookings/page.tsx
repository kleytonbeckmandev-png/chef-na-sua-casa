"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, ChefHat, MapPin, Star, Eye, MessageSquare } from 'lucide-react'

interface Booking {
  id: string
  date: string
  time: string
  peopleCount: number
  totalPrice: number
  status: string
  notes?: string
  chefName: string
  menuName: string
  planName: string
}

export default function ClientBookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      // Simular dados de agendamentos (em produção, isso viria da API)
      const mockBookings: Booking[] = [
        {
          id: 'booking-1',
          date: '2024-01-15',
          time: '19:00',
          peopleCount: 4,
          totalPrice: 200.0,
          status: 'CONFIRMED',
          notes: 'Cliente prefere massas sem glúten',
          chefName: 'Maria Costa',
          menuName: 'Culinária Italiana',
          planName: 'Avulso'
        },
        {
          id: 'booking-2',
          date: '2024-01-22',
          time: '18:00',
          peopleCount: 2,
          totalPrice: 140.0,
          status: 'PENDING',
          notes: 'Aniversário de casamento',
          chefName: 'Maria Costa',
          menuName: 'Culinária Francesa',
          planName: 'Mensal'
        },
        {
          id: 'booking-3',
          date: '2024-01-08',
          time: '20:00',
          peopleCount: 6,
          totalPrice: 300.0,
          status: 'COMPLETED',
          notes: 'Jantar de família',
          chefName: 'João Silva',
          menuName: 'Culinária Brasileira',
          planName: 'Avulso'
        }
      ]

      setBookings(mockBookings)
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filterBookings = (status: string) => {
    return bookings.filter(booking => {
      if (activeTab === 'upcoming') {
        return ['CONFIRMED', 'PENDING'].includes(booking.status)
      } else if (activeTab === 'completed') {
        return booking.status === 'COMPLETED'
      } else if (activeTab === 'cancelled') {
        return booking.status === 'CANCELLED'
      }
      return true
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  const filteredBookings = filterBookings(activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
        <p className="text-gray-600 mt-2">Acompanhe todos os seus agendamentos e histórico</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Próximos ({bookings.filter(b => ['CONFIRMED', 'PENDING'].includes(b.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Concluídos ({bookings.filter(b => b.status === 'COMPLETED').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cancelled'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cancelados ({bookings.filter(b => b.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'upcoming' && 'Você não tem agendamentos futuros.'}
              {activeTab === 'completed' && 'Você ainda não completou nenhum agendamento.'}
              {activeTab === 'cancelled' && 'Você não tem agendamentos cancelados.'}
            </p>
            <Button>
              Fazer Novo Agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{booking.menuName}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(booking.date)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{booking.peopleCount} pessoas</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      R$ {booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{booking.planName}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Chef:</span>
                      <span>{booking.chefName}</span>
                    </div>
                    {booking.notes && (
                      <div className="flex items-start space-x-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="text-gray-600">{booking.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    {booking.status === 'PENDING' && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        Cancelar
                      </Button>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Avaliar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {bookings.filter(b => ['CONFIRMED', 'PENDING'].includes(b.status)).length}
              </div>
              <div className="text-sm text-gray-600">Próximos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                R$ {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Investido</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
