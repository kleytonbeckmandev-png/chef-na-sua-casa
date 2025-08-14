"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, Users, ChefHat, FileText, Eye, Edit, Save, X } from 'lucide-react'

interface Booking {
  id: string
  title: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
  date: string
  time: string
  people: number
  chef: string
  notes: string
  price: number
  plan: string
}

const mockBookings: Booking[] = [
  {
    id: '1',
    title: 'Culinária Italiana',
    status: 'CONFIRMED',
    date: '2024-01-14',
    time: '19:00',
    people: 4,
    chef: 'Chef: Maria Costa',
    notes: 'Cliente prefere massas sem glúten',
    price: 200.00,
    plan: 'Avulso'
  },
  {
    id: '2',
    title: 'Culinária Francesa',
    status: 'PENDING',
    date: '2024-01-21',
    time: '18:00',
    people: 2,
    chef: 'Chef: Maria Costa',
    notes: 'Aniversário de casamento',
    price: 140.00,
    plan: 'Mensal'
  },
  {
    id: '3',
    title: 'Culinária Brasileira',
    status: 'PENDING',
    date: '2025-10-24',
    time: '22:01',
    people: 20,
    chef: 'Chef: Maria Costa',
    notes: 'Aniversário de casamento 50 anos',
    price: 140.00,
    plan: 'Mensal'
  }
]

const mockMenus = [
  { id: '1', name: 'Culinária Italiana', description: 'Massas, risotos e pratos tradicionais italianos' },
  { id: '2', name: 'Culinária Francesa', description: 'Cuisine française com técnicas refinadas' },
  { id: '3', name: 'Culinária Brasileira', description: 'Pratos típicos da nossa culinária regional' },
  { id: '4', name: 'Culinária Asiática', description: 'Sushi, curry e pratos orientais' }
]

export default function ClientBookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    people: 1,
    menuId: '',
    notes: ''
  })

  const handleViewDetails = (booking: Booking) => {
    console.log('👁️ Abrindo detalhes do agendamento:', booking)
    console.log('📅 Data do agendamento:', booking.date)
    console.log('⏰ Horário do agendamento:', booking.time)
    
    setSelectedBooking(booking)
    setEditData({
      date: booking.date,
      time: booking.time,
      people: booking.people,
      menuId: mockMenus.find(m => m.name === booking.title)?.id || '',
      notes: booking.notes || ''
    })
    setIsEditing(false)
    setIsModalOpen(true)
    
    console.log('🔧 Estado atualizado:')
    console.log('  - selectedBooking:', booking)
    console.log('  - isModalOpen:', true)
    console.log('  - editData:', {
      date: booking.date,
      time: booking.time,
      people: booking.people,
      menuId: mockMenus.find(m => m.name === booking.title)?.id || '',
      notes: booking.notes || ''
    })
  }

  const handleSaveChanges = async () => {
    if (!selectedBooking) return

    try {
      console.log('🚀 Salvando alterações do agendamento:', selectedBooking.id)
      console.log('📝 Dados para salvar:', editData)

      const selectedDate = new Date(editData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today && !selectedBooking.id) {
        toast({
          title: "❌ **DATA INVÁLIDA**",
          description: "**Não é permitido agendar datas que já passaram!**",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/client/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          date: editData.date,
          time: editData.time,
          people: editData.people,
          menuId: editData.menuId,
          notes: editData.notes,
          chefId: 'chef-1'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success) {
          const updatedBooking = {
            ...selectedBooking,
            ...data.booking,
            date: editData.date,
            time: editData.time,
            people: editData.people,
            title: mockMenus.find(m => m.id === editData.menuId)?.name || selectedBooking.title,
            notes: editData.notes
          }

          console.log('🔄 Dados atualizados:', updatedBooking)

          setBookings(prev => {
            const newBookings = prev.map(b => 
              b.id === selectedBooking.id 
                ? {
                    ...b,
                    date: editData.date,
                    time: editData.time,
                    people: editData.people,
                    title: mockMenus.find(m => m.id === editData.menuId)?.name || b.title,
                    notes: editData.notes
                  }
                : b
            )
            return newBookings
          })

          setSelectedBooking(updatedBooking)

          toast({
            title: "✅ Sucesso!",
            description: "As alterações foram salvas.",
          })
          
          setTimeout(() => {
            console.log('🚪 Fechando modal automaticamente...')
            setIsModalOpen(false)
            setSelectedBooking(null)
          }, 1000)
        } else {
          throw new Error(data.message || 'Erro ao atualizar agendamento')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao atualizar agendamento')
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    if (selectedBooking) {
      setEditData({
        date: selectedBooking.date,
        time: selectedBooking.time,
        people: selectedBooking.people,
        menuId: mockMenus.find(m => m.name === selectedBooking.title)?.id || '',
        notes: selectedBooking.notes || ''
      })
    }
    setIsEditing(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
    setIsEditing(false)
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      console.log('🚫 Cancelando agendamento:', bookingId)
      
      const response = await fetch(`/api/client/bookings?id=${bookingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success) {
          console.log('✅ API retornou sucesso, atualizando estado local...')
          
          setBookings(prev => {
            const updatedBookings = prev.map(b => 
              b.id === bookingId 
                ? { ...b, status: 'CANCELLED' as const }
                : b
            )
            console.log('🔄 Estado atualizado:', updatedBookings)
            return updatedBookings
          })

          toast({
            title: "✅ Agendamento cancelado!",
            description: "O agendamento foi cancelado com sucesso.",
          })
          
          console.log('🎉 Cancelamento concluído com sucesso!')
        } else {
          throw new Error(data.message || 'Erro ao cancelar agendamento')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao cancelar agendamento')
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      toast({
        title: "❌ Erro ao cancelar",
        description: error instanceof Error ? error.message : "Não foi possível cancelar o agendamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDateChange = (newDate: string) => {
    const selectedDate = new Date(newDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today && !selectedBooking?.id) {
      toast({
        title: "❌ **DATA INVÁLIDA**",
        description: "**Não é permitido agendar datas que já passaram!**",
        variant: "destructive",
      })
      setEditData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }))
      return
    }
    
    setEditData(prev => ({ ...prev, date: newDate }))
  }

  const handleTimeChange = (newTime: string) => {
    setEditData(prev => ({ ...prev, time: newTime }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'Pendente', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMED': { label: 'Confirmado', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'COMPLETED': { label: 'Concluído', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'CANCELLED': { label: 'Cancelado', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED')
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Próximos ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídos ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelados ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{booking.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">
                      R$ {booking.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{booking.plan}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{booking.people} pessoas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="h-4 w-4" />
                    <span>{booking.chef}</span>
                  </div>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <FileText className="h-4 w-4 mt-0.5" />
                    <span className="text-sm">{booking.notes}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewDetails(booking)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  
                  {booking.status === 'PENDING' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-blue-500 opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{booking.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {booking.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{booking.plan}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{booking.people} pessoas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="h-4 w-4" />
                    <span>{booking.chef}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500">Nenhum agendamento cancelado.</p>
              </CardContent>
            </Card>
          ) : (
            cancelledBookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-red-500 opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{booking.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">
                        R$ {booking.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">{booking.plan}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{booking.people} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <ChefHat className="h-4 w-4" />
                      <span>{booking.chef}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBooking.title}</DialogTitle>
                <DialogDescription>
                  Detalhes completos do seu agendamento
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Status e Preço */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-2xl font-bold text-orange-600">
                      R$ {selectedBooking.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{selectedBooking.plan}</p>
                  </div>
                </div>

                {/* Informações do Chef */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Chef Responsável</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800">{selectedBooking.chef}</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p>⏰ <strong>Expediente:</strong> 8h às 22h</p>
                    <p>📅 <strong>Disponibilidade:</strong> Verificada automaticamente</p>
                    {editData.date === new Date().toISOString().split('T')[0] && (
                      <p className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                        💡 <strong>Dica:</strong> Para hoje, o sistema verifica automaticamente a disponibilidade do chef
                      </p>
                    )}
                    {new Date(editData.date) < new Date() && (
                      <p className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800">
                        ✅ <strong>Edição permitida:</strong> Você pode editar agendamentos passados
                      </p>
                    )}
                  </div>
                </div>

                {/* Detalhes Editáveis */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSaveChanges}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={editData.time}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="people">Quantidade de Pessoas</Label>
                      <Input
                        id="people"
                        type="number"
                        min="1"
                        max="20"
                        value={editData.people}
                        onChange={(e) => setEditData({ ...editData, people: parseInt(e.target.value) })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="menu">Cardápio</Label>
                      <Select
                        value={editData.menuId}
                        onValueChange={(value) => setEditData({ ...editData, menuId: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione o cardápio" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockMenus.map((menu) => (
                            <SelectItem key={menu.id} value={menu.id}>
                              {menu.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        💡 <strong>Dica:</strong> As alterações serão salvas automaticamente quando você clicar em "Salvar".
                      </p>
                    </div>
                  )}
                </div>

                {/* Observações */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Observações</h3>
                  {!isEditing ? (
                    <p className="text-gray-700">{editData.notes || 'Nenhuma observação adicional.'}</p>
                  ) : (
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <textarea
                        id="notes"
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        placeholder="Ex: Aniversário de casamento, preferências especiais, etc."
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Informações adicionais para o chef
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{upcomingBookings.length}</div>
            <div className="text-sm text-gray-600">Próximos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{completedBookings.length}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              R$ {bookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Investido</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
