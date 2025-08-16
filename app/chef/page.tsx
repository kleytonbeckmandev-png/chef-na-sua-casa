"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, Star, TrendingUp, ChefHat } from 'lucide-react'
import Link from 'next/link'

export default function ChefDashboard() {
  const { data: session } = useSession()

  // Dados mockados para demonstração
  const stats = {
    totalBookings: 24,
    pendingBookings: 3,
    completedBookings: 18,
    cancelledBookings: 3,
    averageRating: 4.8,
    totalEarnings: 2840.00,
    thisMonthEarnings: 680.00
  }

  const upcomingBookings = [
    {
      id: '1',
      date: '2024-01-15',
      time: '19:00',
      client: 'Maria Silva',
      menu: 'Culinária Italiana',
      peopleCount: 4,
      status: 'CONFIRMED',
      price: 200.00
    },
    {
      id: '2',
      date: '2024-01-16',
      time: '18:00',
      client: 'João Santos',
      menu: 'Culinária Francesa',
      peopleCount: 2,
      status: 'CONFIRMED',
      price: 140.00
    }
  ]

  const recentReviews = [
    {
      id: '1',
      client: 'Ana Costa',
      rating: 5,
      comment: 'Excelente serviço! A comida estava deliciosa e o atendimento foi perfeito.',
      date: '2024-01-10'
    },
    {
      id: '2',
      client: 'Carlos Lima',
      rating: 5,
      comment: 'Superou todas as expectativas. Recomendo muito!',
      date: '2024-01-08'
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'CONFIRMED': { label: 'Confirmado', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'PENDING': { label: 'Pendente', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'CANCELLED': { label: 'Cancelado', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'COMPLETED': { label: 'Concluído', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo de volta, Chef {session?.user?.name}!
        </h1>
        <p className="text-orange-100">
          Gerencie seus agendamentos e acompanhe seu desempenho
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Baseado em {stats.completedBookings} avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonthEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Requerem sua atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Próximos Agendamentos
            </CardTitle>
            <CardDescription>
              Seus próximos compromissos
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{booking.client}</h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-gray-600">{booking.menu}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatDate(booking.date)} às {booking.time}</span>
                      <span>{booking.peopleCount} pessoa{booking.peopleCount > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(booking.price)}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Ver Detalhes
                    </Button>
                    </div>
                  </div>
                ))}
              </div>
            <div className="mt-4">
              <Link href="/chef/bookings">
                <Button variant="outline" className="w-full">
                  Ver Todos os Agendamentos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Avaliações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Avaliações Recentes
            </CardTitle>
            <CardDescription>
              Feedback dos seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{review.client}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    </div>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                  </div>
                ))}
              </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Ver Todas as Avaliações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/chef/bookings">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-8 w-8" />
                <span>Gerenciar Agendamentos</span>
              </Button>
            </Link>
            <Link href="/chef/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <ChefHat className="h-8 w-8" />
                <span>Editar Perfil</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-8 w-8" />
              <span>Ver Clientes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
