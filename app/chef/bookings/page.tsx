"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, Users, MapPin, Phone, Mail, Search, Filter, CheckCircle, XCircle, Clock as ClockIcon, X } from 'lucide-react'

interface Booking {
  id: string
  title: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
  date: string
  time: string
  people: number
  client: string
  clientEmail: string
  clientPhone: string
  address: string
  notes: string
  price: number
  plan: string
  menu: string
}

const mockBookings: Booking[] = [
  {
    id: '1',
    title: 'CARNE BOVINA',
    status: 'CONFIRMED',
    date: '2024-01-15',
    time: '19:00',
    people: 4,
    client: 'Maria Silva',
    clientEmail: 'maria@email.com',
    clientPhone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    notes: 'Cliente prefere carne bem passada',
    price: 280.00,
    plan: 'Avulso',
    menu: 'CARNE BOVINA'
  },
  {
    id: '2',
    title: 'AVES',
    status: 'PENDING',
    date: '2024-01-21',
    time: '18:00',
    people: 2,
    client: 'João Santos',
    clientEmail: 'joao@email.com',
    clientPhone: '(11) 88888-8888',
    address: 'Av. Principal, 456 - São Paulo, SP',
    notes: 'Aniversário de casamento',
    price: 240.00,
    plan: 'Mensal',
    menu: 'AVES'
  },
  {
    id: '3',
    title: 'CARNE SUÍNA',
    status: 'PENDING',
    date: '2024-01-25',
    time: '20:00',
    people: 6,
    client: 'Ana Costa',
    clientEmail: 'ana@email.com',
    clientPhone: '(11) 77777-7777',
    address: 'Rua do Comércio, 789 - São Paulo, SP',
    notes: 'Festa de família',
    price: 390.00,
    plan: 'Avulso',
    menu: 'CARNE SUÍNA'
  },
  {
    id: '4',
    title: 'PEIXES E FRUTOS DO MAR',
    status: 'COMPLETED',
    date: '2024-01-10',
    time: '19:30',
    people: 3,
    client: 'Pedro Lima',
    clientEmail: 'pedro@email.com',
    clientPhone: '(11) 66666-6666',
    address: 'Rua das Palmeiras, 321 - São Paulo, SP',
    notes: 'Cliente gosta de comida picante',
    price: 225.00,
    plan: 'Avulso',
    menu: 'PEIXES E FRUTOS DO MAR'
  }
]

export default function ChefBookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    // Simular carregamento de agendamentos
    try {
      setTimeout(() => {
        setBookings(mockBookings)
        setFilteredBookings(mockBookings)
        setIsLoading(false)
        setError(null)
      }, 1000)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setError('Erro ao carregar agendamentos')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Filtrar agendamentos baseado na busca e filtros
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.menu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter(booking => booking.date === dateFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, dateFilter])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />
    }
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      // Simular atualização no banco de dados
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus as any }
          : booking
      ))

      toast({
        title: "Status atualizado",
        description: `Agendamento ${newStatus.toLowerCase()} com sucesso`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do agendamento",
        variant: "destructive",
      })
    }
  }

  const handleBookingAction = (action: string, booking: Booking) => {
    switch (action) {
      case 'confirm':
        handleStatusUpdate(booking.id, 'CONFIRMED')
        break
      case 'complete':
        handleStatusUpdate(booking.id, 'COMPLETED')
        break
      case 'cancel':
        handleStatusUpdate(booking.id, 'CANCELLED')
        break
      case 'view':
        setSelectedBooking(booking)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
          <p className="text-gray-600">Gerencie todos os seus compromissos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendário
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Cliente, menu ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                  setDateFilter('')
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredBookings.length} agendamento{filteredBookings.length !== 1 ? 's' : ''} encontrado{filteredBookings.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Ordenar por:</span>
          <Select defaultValue="date">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="price">Preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Booking Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.menu}</h3>
                        <p className="text-sm text-gray-600">{booking.client}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(booking.price)}
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(booking.date)} às {booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{booking.people} pessoa{booking.people > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Observações:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{booking.clientEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{booking.clientPhone}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2 lg:ml-6">
                  <Button
                    onClick={() => handleBookingAction('view', booking)}
                    variant="outline"
                    className="w-full"
                  >
                    Ver Detalhes
                  </Button>
                  
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleBookingAction('confirm', booking)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => handleBookingAction('cancel', booking)}
                        variant="destructive"
                        className="w-full"
                      >
                        Recusar
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => handleBookingAction('complete', booking)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Marcar como Concluído
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'ALL' || dateFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Você ainda não possui agendamentos'
              }
            </p>
            {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                  setDateFilter('')
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalhes do Agendamento</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBooking(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o agendamento selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Header com Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedBooking.menu}</h3>
                  <p className="text-lg text-gray-600">{selectedBooking.client}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(selectedBooking.price)}
                  </div>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>

              {/* Informações Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Data e Horário</h4>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(selectedBooking.date)} às {selectedBooking.time}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Participantes</h4>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{selectedBooking.people} pessoa{selectedBooking.people > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Plano</h4>
                    <div className="text-gray-600">{selectedBooking.plan}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Local</h4>
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{selectedBooking.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contato</h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedBooking.clientEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedBooking.clientPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedBooking.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Fechar
                </Button>
                
                {selectedBooking.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={() => {
                        handleBookingAction('confirm', selectedBooking)
                        setSelectedBooking(null)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmar
                    </Button>
                    <Button
                      onClick={() => {
                        handleBookingAction('cancel', selectedBooking)
                        setSelectedBooking(null)
                      }}
                      variant="destructive"
                    >
                      Recusar
                    </Button>
                  </>
                )}
                
                {selectedBooking.status === 'CONFIRMED' && (
                  <Button
                    onClick={() => {
                      handleBookingAction('complete', selectedBooking)
                      setSelectedBooking(null)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Marcar como Concluído
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
