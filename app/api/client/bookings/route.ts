import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Dados mock para simulação
const mockBookings = [
  {
    id: '1',
    title: 'Culinária Italiana',
    status: 'CONFIRMED',
    date: '2024-01-14',
    time: '19:00',
    people: 4,
    chef: 'Chef: Maria Costa',
    chefId: 'chef-1',
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
    chefId: 'chef-1',
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
    chefId: 'chef-1',
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

// Função para verificar disponibilidade do chef
function checkChefAvailability(chefId: string, date: string, time: string, excludeBookingId?: string) {
  // TEMPORARIAMENTE: Simular verificação de disponibilidade
  // Em produção, isso seria uma consulta ao banco de dados
  
  // Simular horários de trabalho do chef (8h às 22h)
  const selectedTime = new Date(`2000-01-01T${time}`)
  const workStart = new Date('2000-01-01T08:00')
  const workEnd = new Date('2000-01-01T22:00')
  
  // Verificar se o horário está dentro do expediente
  if (selectedTime < workStart || selectedTime > workEnd) {
    return {
      available: false,
      reason: 'Horário fora do expediente de trabalho (8h às 22h)'
    }
  }
  
  // Simular agendamentos existentes para o chef na data
  const existingBookings = [
    { time: '12:00', duration: 2 }, // Almoço das 12h às 14h
    { time: '19:00', duration: 2 }, // Jantar das 19h às 21h
  ]
  
  // Verificar conflitos de horário
  for (const booking of existingBookings) {
    const bookingStart = new Date(`2000-01-01T${booking.time}`)
    const bookingEnd = new Date(`2000-01-01T${booking.time}`)
    bookingEnd.setHours(bookingEnd.getHours() + booking.duration)
    
    const selectedEnd = new Date(selectedTime)
    selectedEnd.setHours(selectedEnd.getHours() + 2) // Assumir 2h de duração
    
    // Verificar se há sobreposição
    if (selectedTime < bookingEnd && selectedEnd > bookingStart) {
      return {
        available: false,
        reason: `Conflito com agendamento existente das ${booking.time} às ${bookingEnd.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      }
    }
  }
  
  return {
    available: true,
    reason: 'Horário disponível'
  }
}

// GET - Buscar agendamentos do cliente
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando GET /api/client/bookings')
    
    console.log('✅ Retornando agendamentos mock:', mockBookings.length)

    return NextResponse.json({
      success: true,
      bookings: mockBookings
    })

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// PUT - Atualizar agendamento
export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Iniciando PUT /api/client/bookings')
    
    const body = await request.json()
    console.log('📝 Body recebido:', body)
    
    const { bookingId, date, time, people, menuId, notes, chefId } = body

    // Validações
    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'ID do agendamento é obrigatório'
      }, { status: 400 })
    }

    if (!date || !time || !people || !menuId) {
      return NextResponse.json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      }, { status: 400 })
    }

    // VALIDAÇÃO DE DATA: Para edições, permitir datas passadas (é uma atualização)
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    // Se for uma edição (existe bookingId), permitir datas passadas
    if (selectedDate < today && !bookingId) {
      return NextResponse.json({
        success: false,
        message: 'Não é permitido agendar datas que já passaram. Por favor, escolha uma data futura.'
      }, { status: 400 })
    }

    // VALIDAÇÃO: Se for hoje, verificar disponibilidade do chef
    if (selectedDate.getTime() === today.getTime()) {
      console.log('🔍 Verificando disponibilidade do chef para hoje')
      
      const availability = checkChefAvailability(chefId || 'chef-1', date, time, bookingId)
      
      if (!availability.available) {
        return NextResponse.json({
          success: false,
          message: `Não há horário disponível para hoje: ${availability.reason}`,
          availability: availability
        }, { status: 400 })
      }
      
      console.log('✅ Chef disponível para o horário selecionado')
    }

    // TEMPORARIAMENTE: Simular sucesso com dados mock
    console.log('✅ Validações de data e disponibilidade aprovadas')
    console.log('✅ Simulando atualização bem-sucedida')

    // Buscar o agendamento original para manter dados não editados
    const originalBooking = mockBookings.find(b => b.id === bookingId)
    console.log('📋 Agendamento original:', originalBooking)
    console.log('📝 Dados recebidos na API:', { date, time, people, menuId, notes })
    
    const updatedBooking = {
      ...originalBooking, // Manter todos os dados originais
      id: bookingId,
      date: date, // Usar a data recebida
      time: time, // Usar o horário recebido
      people: people,
      title: mockMenus.find(m => m.id === menuId)?.name || originalBooking?.title || 'Cardápio Selecionado',
      notes: notes || '', // Incluir observações
      updatedAt: new Date().toISOString()
    }
    
    console.log('🔄 Objeto atualizado criado:', updatedBooking)
    console.log('📅 Data final:', updatedBooking.date)
    console.log('⏰ Horário final:', updatedBooking.time)

    console.log('🔄 Agendamento atualizado:', updatedBooking)

    // Atualizar os dados mock locais para persistir as mudanças
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId)
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex] = updatedBooking
      console.log('💾 Dados mock atualizados localmente')
      console.log('📋 Mock atualizado:', mockBookings[bookingIndex])
      console.log('🔍 Verificação final dos dados mock:')
      console.log('  - Data:', mockBookings[bookingIndex].date)
      console.log('  - Horário:', mockBookings[bookingIndex].time)
      console.log('  - Pessoas:', mockBookings[bookingIndex].people)
      console.log('  - Observações:', mockBookings[bookingIndex].notes)
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento atualizado com sucesso!',
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Criar novo agendamento
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando POST /api/client/bookings')
    
    const body = await request.json()
    console.log('📝 Body recebido:', body)
    
    const { date, time, people, menuId, chefId, notes, planId } = body

    // Validações
    if (!date || !time || !people || !menuId || !chefId || !planId) {
      return NextResponse.json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      }, { status: 400 })
    }

    // VALIDAÇÃO DE DATA: Para novos agendamentos, não permitir datas passadas
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    if (selectedDate < today) {
      return NextResponse.json({
        success: false,
        message: 'Não é permitido agendar datas que já passaram. Por favor, escolha uma data futura.'
      }, { status: 400 })
    }

    // VALIDAÇÃO: Se for hoje, verificar disponibilidade do chef
    if (selectedDate.getTime() === today.getTime()) {
      console.log('🔍 Verificando disponibilidade do chef para hoje')
      
      const availability = checkChefAvailability(chefId, date, time)
      
      if (!availability.available) {
        return NextResponse.json({
          success: false,
          message: `Não há horário disponível para hoje: ${availability.reason}`,
          availability: availability
        }, { status: 400 })
      }
      
      console.log('✅ Chef disponível para o horário selecionado')
    }

    // TEMPORARIAMENTE: Simular sucesso com dados mock
    console.log('✅ Validações de data e disponibilidade aprovadas')
    console.log('✅ Simulando criação bem-sucedida')

    const newBooking = {
      id: Date.now().toString(),
      date: date,
      time: time,
      people: people,
      menuId: menuId,
      chefId: chefId,
      planId: planId,
      notes: notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento criado com sucesso!',
      booking: newBooking
    })

  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// DELETE - Cancelar agendamento
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 Iniciando DELETE /api/client/bookings')
    
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: 'ID do agendamento é obrigatório'
      }, { status: 400 })
    }

    // TEMPORARIAMENTE: Simular sucesso com dados mock
    console.log('✅ Simulando cancelamento bem-sucedido')

    return NextResponse.json({
      success: true,
      message: 'Agendamento cancelado com sucesso!',
      booking: { id: bookingId, status: 'CANCELLED' }
    })

  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
