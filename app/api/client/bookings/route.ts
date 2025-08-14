import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar agendamentos do cliente
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando GET /api/client/bookings')
    
    // TEMPORARIAMENTE: Retornar dados mock até o banco estar configurado
    const mockBookings = [
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
      }
    ]

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
    
    const { bookingId, date, time, people, menuId } = body

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

    // VALIDAÇÃO DE DATA: Não permitir datas passadas
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    if (selectedDate < today) {
      return NextResponse.json({
        success: false,
        message: 'Não é permitido agendar datas que já passaram. Por favor, escolha uma data futura.'
      }, { status: 400 })
    }

    // VALIDAÇÃO: Permitir apenas agendamento no dia atual ou futuros
    if (selectedDate.getTime() === today.getTime()) {
      // Se for hoje, verificar se o horário já passou
      const currentTime = new Date()
      const selectedTime = new Date(`2000-01-01T${time}`)
      const currentTimeOnly = new Date(`2000-01-01T${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`)
      
      if (selectedTimeOnly < currentTimeOnly) {
        return NextResponse.json({
          success: false,
          message: 'Não é permitido agendar horários que já passaram no dia atual. Por favor, escolha um horário futuro.'
        }, { status: 400 })
      }
    }

    // TEMPORARIAMENTE: Simular sucesso com dados mock
    console.log('✅ Validações de data aprovadas')
    console.log('✅ Simulando atualização bem-sucedida')

    const updatedBooking = {
      id: bookingId,
      date: date,
      time: time,
      people: people,
      menuId: menuId,
      updatedAt: new Date().toISOString()
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

    // VALIDAÇÃO DE DATA: Não permitir datas passadas
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    if (selectedDate < today) {
      return NextResponse.json({
        success: false,
        message: 'Não é permitido agendar datas que já passaram. Por favor, escolha uma data futura.'
      }, { status: 400 })
    }

    // VALIDAÇÃO: Permitir apenas agendamento no dia atual ou futuros
    if (selectedDate.getTime() === today.getTime()) {
      // Se for hoje, verificar se o horário já passou
      const currentTime = new Date()
      const selectedTime = new Date(`2000-01-01T${time}`)
      const currentTimeOnly = new Date(`2000-01-01T${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`)
      
      if (selectedTimeOnly < currentTimeOnly) {
        return NextResponse.json({
          success: false,
          message: 'Não é permitido agendar horários que já passaram no dia atual. Por favor, escolha um horário futuro.'
        }, { status: 400 })
      }
    }

    // TEMPORARIAMENTE: Simular sucesso com dados mock
    console.log('✅ Validações de data aprovadas')
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
