import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar agendamentos do cliente
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando GET /api/client/bookings')
    
    // Para debug, usar um usuário fixo
    const testUserId = 'cmebe87t70001fjuic53jh9f0'
    
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: testUserId
      },
      include: {
        menu: true,
        chef: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    console.log('✅ Agendamentos encontrados:', bookings.length)

    return NextResponse.json({
      success: true,
      bookings: bookings
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

    // Verificar se o agendamento existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!existingBooking) {
      return NextResponse.json({
        success: false,
        message: 'Agendamento não encontrado'
      }, { status: 404 })
    }

    // Buscar o menu
    const menu = await prisma.menu.findUnique({
      where: { id: menuId }
    })

    if (!menu) {
      return NextResponse.json({
        success: false,
        message: 'Cardápio não encontrado'
      }, { status: 404 })
    }

    // Atualizar o agendamento
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: new Date(date),
        time: time,
        people: people,
        menuId: menuId,
        updatedAt: new Date()
      },
      include: {
        menu: true,
        chef: {
          include: {
            user: true
          }
        }
      }
    })

    console.log('✅ Agendamento atualizado:', updatedBooking)

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

    // Para debug, usar um usuário fixo
    const testUserId = 'cmebe87t70001fjuic53jh9f0'

    // Criar novo agendamento
    const newBooking = await prisma.booking.create({
      data: {
        clientId: testUserId,
        chefId: chefId,
        menuId: menuId,
        planId: planId,
        date: new Date(date),
        time: time,
        people: people,
        notes: notes || '',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        menu: true,
        chef: {
          include: {
            user: true
          }
        },
        plan: true
      }
    })

    console.log('✅ Novo agendamento criado:', newBooking)

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

    // Verificar se o agendamento existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!existingBooking) {
      return NextResponse.json({
        success: false,
        message: 'Agendamento não encontrado'
      }, { status: 404 })
    }

    // Verificar se pode ser cancelado (apenas pendentes)
    if (existingBooking.status !== 'PENDING') {
      return NextResponse.json({
        success: false,
        message: 'Apenas agendamentos pendentes podem ser cancelados'
      }, { status: 400 })
    }

    // Atualizar status para cancelado
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    })

    console.log('✅ Agendamento cancelado:', cancelledBooking)

    return NextResponse.json({
      success: true,
      message: 'Agendamento cancelado com sucesso!',
      booking: cancelledBooking
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
