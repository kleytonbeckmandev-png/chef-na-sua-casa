"use client"

import { useState, useEffect, useCallback } from 'react'
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
    title: 'CARNE BOVINA',
    status: 'CONFIRMED',
    date: '2024-01-14',
    time: '19:00',
    people: 4,
    chef: 'Chef: Maria Costa',
    notes: 'Cliente prefere carne bem passada',
    price: 280.00,
    plan: 'Avulso'
  },
  {
    id: '2',
    title: 'AVES',
    status: 'PENDING',
    date: '2024-01-21',
    time: '18:00',
    people: 2,
    chef: 'Chef: Maria Costa',
    notes: 'Aniversário de casamento',
    price: 240.00,
    plan: 'Mensal'
  },
  {
    id: '3',
    title: 'PEIXES E FRUTOS DO MAR',
    status: 'PENDING',
    date: '2025-10-24',
    time: '22:01',
    people: 20,
    chef: 'Chef: Maria Costa',
    notes: 'Aniversário de casamento 50 anos',
    price: 1500.00,
    plan: 'Mensal'
  }
]

const mockMenus = [
  { id: '1', name: 'CARNE BOVINA', description: 'Assado de panela, Cozidão, Carne frita, Churrasco, Estrogonofe, Filé ao molho, Carne assada' },
  { id: '2', name: 'AVES', description: 'Frango assado, Frango grelhado, Frango ao molho, Peru assado, Pato assado, Frango frito, Frango cozido' },
  { id: '3', name: 'CARNE SUÍNA', description: 'Porco assado, Lombo assado, Costela assada, Carne de porco grelhada, Porco ao molho, Lombo grelhado' },
  { id: '4', name: 'PEIXES E FRUTOS DO MAR', description: 'Salmão grelhado, Atum grelhado, Bacalhau assado, Camarão grelhado, Peixe frito, Peixe ao molho, Mariscos' },
  { id: '5', name: 'SOBREMESAS', description: 'Bolo de chocolate, Torta de limão, Pudim, Sorvete caseiro, Mousse, Tiramisu, Cheesecake' },
  { id: '6', name: 'SALADAS', description: 'Salada verde, Salada de frutas, Salada de grãos, Salada de legumes, Salada de massas, Salada de quinoa' },
  { id: '7', name: 'OUTRAS', description: 'Massas, Risotos, Sopas, Pães caseiros, Molhos especiais, Conservas caseiras' }
]

export default function ClientBookingsPage() {
  const { toast } = useToast()
  
  // Função utilitária para obter a data atual no fuso horário local
  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editData, setEditData] = useState({
    date: getCurrentDate(),
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    people: 1,
    menuId: '',
    notes: ''
  })

  // Função para buscar agendamentos da API
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Iniciando busca de agendamentos...')
      
      const response = await fetch('/api/client/bookings')
      console.log('📡 Resposta da API:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Dados recebidos:', data)
        
        if (data.success && data.bookings) {
          setBookings(data.bookings)
          console.log('✅ Agendamentos carregados da API:', data.bookings.length)
        } else {
          console.log('⚠️ API retornou dados inválidos, usando mock')
          setBookings(mockBookings)
        }
      } else {
        console.log('❌ Erro na API, usando dados mock')
        setBookings(mockBookings)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', error)
      console.log('🔄 Usando dados mock devido ao erro')
      setBookings(mockBookings)
    } finally {
      setIsLoading(false)
      console.log('🏁 Carregamento finalizado')
    }
  }, [])

  // Carregar agendamentos quando a página for carregada
  useEffect(() => {
    console.log('🚀 Página carregada, iniciando busca de agendamentos...')
    fetchBookings()
  }, [fetchBookings]) // Dependência vazia para executar apenas uma vez

  const handleViewDetails = (booking: Booking) => {
    console.log('👁️ Abrindo detalhes do agendamento:', booking)
    console.log('📅 Data do agendamento:', booking.date)
    console.log('⏰ Horário do agendamento:', booking.time)
    
    // Primeiro, atualizar o editData para garantir sincronização
    const newEditData = {
      date: booking.date,
      time: booking.time,
      people: booking.people,
      menuId: mockMenus.find(m => m.name === booking.title)?.id || '',
      notes: booking.notes || ''
    }
    
    setEditData(newEditData)
    setSelectedBooking(booking)
    setIsEditing(false)
    setIsModalOpen(true)
    
    console.log('🔧 Estado atualizado:')
    console.log('  - selectedBooking:', booking)
    console.log('  - isModalOpen:', true)
    console.log('  - editData:', newEditData)
    console.log('  - Sincronização verificada:', {
      'selectedBooking.date': booking.date,
      'editData.date': newEditData.date,
      'selectedBooking.time': booking.time,
      'editData.time': newEditData.time
    })
  }

  const handleSaveChanges = async () => {
    if (!selectedBooking) return

    try {
      console.log('🚀 Salvando alterações do agendamento:', selectedBooking.id)
      console.log('📝 Dados para salvar:', editData)

      // Corrigir problema de fuso horário - garantir que a data seja interpretada corretamente
      const selectedDate = new Date(editData.date + 'T00:00:00')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      console.log('🔍 Validação de data:', {
        editDataDate: editData.date,
        selectedDate: selectedDate.toISOString(),
        today: today.toISOString(),
        isPast: selectedDate < today
      })
      
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
          // Criar objeto atualizado com os dados editados
          const updatedBooking = {
            ...selectedBooking,
            date: editData.date,        // Data editada
            time: editData.time,        // Horário editado
            people: editData.people,    // Pessoas editadas
            title: mockMenus.find(m => m.id === editData.menuId)?.name || selectedBooking.title,
            notes: editData.notes       // Observações editadas
          }

          console.log('🔄 Dados atualizados:', updatedBooking)
          console.log('📅 Data editada:', editData.date)
          console.log('⏰ Horário editado:', editData.time)
          console.log('👥 Pessoas editadas:', editData.people)

          // Atualizar a lista de agendamentos PRIMEIRO
          setBookings(prev => {
            const newBookings = prev.map(b => 
              b.id === selectedBooking.id 
                ? updatedBooking  // Usar o objeto completo atualizado
                : b
            )
            console.log('📋 Lista atualizada:', newBookings)
            console.log('📅 Data na lista:', newBookings.find(b => b.id === selectedBooking.id)?.date)
            console.log('⏰ Horário na lista:', newBookings.find(b => b.id === selectedBooking.id)?.time)
            return newBookings
          })

          // Aguardar a atualização da lista antes de atualizar o selectedBooking
          setTimeout(() => {
            setSelectedBooking(updatedBooking)
            console.log('✅ selectedBooking atualizado:', updatedBooking)
          }, 100)

          toast({
            title: "✅ Sucesso!",
            description: "As alterações foram salvas.",
          })
          
          // Recarregar os dados da API para garantir sincronização
          // await fetchBookings() // REMOVIDO - causava loop infinito
          
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
      console.log('🔄 Cancelando edição, restaurando dados originais')
      console.log('📅 Data original:', selectedBooking.date)
      console.log('⏰ Horário original:', selectedBooking.time)
      
      const restoredEditData = {
        date: selectedBooking.date,
        time: selectedBooking.time,
        people: selectedBooking.people,
        menuId: mockMenus.find(m => m.name === selectedBooking.title)?.id || '',
        notes: selectedBooking.notes || ''
      }
      
      setEditData(restoredEditData)
      console.log('✅ Dados restaurados:', restoredEditData)
      console.log('🔍 Sincronização verificada:', {
        'selectedBooking.date': selectedBooking.date,
        'editData.date': restoredEditData.date,
        'selectedBooking.time': selectedBooking.time,
        'editData.time': restoredEditData.time
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
          
          // Recarregar os dados da API para garantir sincronização
          // await fetchBookings() // REMOVIDO - causava loop infinito
          
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
    console.log('📅 Alterando data para:', newDate)
    
    // Corrigir problema de fuso horário - garantir que a data seja interpretada corretamente
    const selectedDate = new Date(newDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    console.log('🔍 Comparação de datas:', {
      newDate,
      selectedDate: selectedDate.toISOString(),
      today: today.toISOString(),
      isPast: selectedDate < today
    })
    
    // Para edições de agendamentos existentes, permitir datas passadas
    if (selectedDate < today && selectedBooking?.id) {
      console.log('✅ Data passada permitida para edição')
      setEditData(prev => ({ ...prev, date: newDate }))
      return
    }
    
    // Para novos agendamentos, não permitir datas passadas
    if (selectedDate < today && !selectedBooking?.id) {
      toast({
        title: "❌ **DATA INVÁLIDA**",
        description: "**Não é permitido agendar datas que já passaram!**",
        variant: "destructive",
      })
      setEditData(prev => ({ ...prev, date: getCurrentDate() }))
      return
    }
    
    console.log('✅ Data válida, atualizando estado')
    setEditData(prev => ({ ...prev, date: newDate }))
  }

  const handleTimeChange = (newTime: string) => {
    console.log('⏰ Alterando horário para:', newTime)
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
    // Corrigir problema de fuso horário - adicionar 'T00:00:00' para garantir que seja meia-noite no fuso local
    const date = new Date(dateString + 'T00:00:00')
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      console.error('❌ Data inválida:', dateString)
      return 'Data inválida'
    }
    
    console.log('🔍 Formatando data:', {
      original: dateString,
      parsed: date.toISOString(),
      local: date.toLocaleDateString('pt-BR'),
      weekday: date.getDay(),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    })
    
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

  // Logs de debug para verificar os dados
  console.log('📊 Estado atual dos agendamentos:')
  console.log('  - Total de agendamentos:', bookings.length)
  console.log('  - Próximos:', upcomingBookings.length)
  console.log('  - Concluídos:', completedBookings.length)
  console.log('  - Cancelados:', cancelledBookings.length)
  console.log('  - Dados completos:', bookings)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando agendamentos...</p>
          </div>
        </div>
      ) : (
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
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Calendar className="h-16 w-16 mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento próximo</h3>
              <p className="text-gray-500">Você ainda não tem agendamentos confirmados ou pendentes.</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => (
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
            ))
          )}
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
      )}

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
                    {editData.date === getCurrentDate() && (
                      <p className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                        💡 <strong>Dica:</strong> Para hoje, o sistema verifica automaticamente a disponibilidade do chef
                      </p>
                    )}
                    {new Date(editData.date + 'T00:00:00') < new Date() && (
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
                        min={getCurrentDate()}
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