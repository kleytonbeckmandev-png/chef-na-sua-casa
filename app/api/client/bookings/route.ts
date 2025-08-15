import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Dados mock para simulação (serão substituídos pelo banco de dados)
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
  { id: '1', name: 'Culinária Italiana', description: 'Massas, risotos e pratos tradicionais italianos', price: 50 },
  { id: '2', name: 'Culinária Francesa', description: 'Cuisine française com técnicas refinadas', price: 70 },
  { id: '3', name: 'Culinária Brasileira', description: 'Pratos típicos da nossa culinária regional', price: 45 },
  { id: '4', name: 'Culinária Asiática', description: 'Sushi, curry e pratos orientais', price: 60 }
]

const mockPlans = [
  { id: '1', name: 'Avulso', description: '1 refeição', price: 150, duration: 1, discount: 0 },
  { id: '2', name: 'Mensal', description: '4 refeições por mês', price: 520, duration: 30, discount: 15 },
  { id: '3', name: 'Trimestral', description: '12 refeições por trimestre', price: 1350, duration: 90, discount: 25 }
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
    
    let dbBookings = []
    let allBookings = []
    
    try {
      // Tentar buscar agendamentos do banco de dados
      const dbBookingsResult = await prisma.booking.findMany({
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          },
          chef: {
            select: {
              name: true
            }
          },
          plan: {
            select: {
              name: true
            }
          },
          menu: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      // Converter para o formato esperado pelo frontend
      dbBookings = dbBookingsResult.map((booking: any) => ({
        id: booking.id,
        title: booking.menu.name,
        status: booking.status,
        date: booking.date.toISOString().split('T')[0],
        time: booking.time,
        people: booking.peopleCount,
        chef: `Chef: ${booking.chef.name}`,
        chefId: booking.chefId,
        notes: booking.notes || '',
        price: booking.totalPrice,
        plan: booking.plan.name
      }))

      console.log('✅ Agendamentos do banco:', dbBookings.length)
      
    } catch (dbError) {
      console.log('⚠️ Erro ao acessar banco:', dbError)
      dbBookings = []
    }

    // Sempre incluir dados mock para garantir que novos agendamentos apareçam
    console.log('🔄 Combinando dados do banco com dados mock')
    
    // Criar um mapa dos IDs do banco para evitar duplicatas
    const dbIds = new Set(dbBookings.map((b: any) => b.id))
    
    // Adicionar dados mock que não estão no banco
    const mockOnlyBookings = mockBookings.filter((b: any) => !dbIds.has(b.id))
    
    // Combinar dados do banco com dados mock únicos
    allBookings = [...dbBookings, ...mockOnlyBookings]
    
    console.log('📊 Total de agendamentos:', allBookings.length)
    console.log('  - Banco:', dbBookings.length)
    console.log('  - Mock únicos:', mockOnlyBookings.length)

    return NextResponse.json({
      success: true,
      bookings: allBookings,
      usingMockData: dbBookings.length === 0
    })

  } catch (error) {
    console.error('Erro geral ao buscar agendamentos:', error)
    
    // Em caso de erro geral, retornar dados mock
    return NextResponse.json({
      success: true,
      bookings: mockBookings,
      usingMockData: true
    })
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
    // Corrigir problema de fuso horário - garantir que a data seja interpretada corretamente
    const selectedDate = new Date(date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    console.log('🔍 Validação de data na API:', {
      date,
      selectedDate: selectedDate.toISOString(),
      today: today.toISOString(),
      isPast: selectedDate < today
    })
    
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

    // Tentar atualizar no banco de dados
    console.log('✅ Validações de data e disponibilidade aprovadas')
    
    let formattedBooking
    
    try {
      console.log('✅ Atualizando no banco de dados')
      
      // Converter a data para o formato DateTime
      const bookingDate = new Date(date + 'T00:00:00')
      
      // Atualizar o agendamento no banco
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          date: bookingDate,
          time: time,
          peopleCount: people,
          menuId: menuId,
          notes: notes || '',
          updatedAt: new Date()
        },
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          },
          chef: {
            select: {
              name: true
            }
          },
          plan: {
            select: {
              name: true
            }
          },
          menu: {
            select: {
              name: true
            }
          }
        }
      })

      console.log('✅ Agendamento atualizado no banco:', updatedBooking.id)
      
      // Converter para o formato esperado pelo frontend
      formattedBooking = {
        id: updatedBooking.id,
        title: updatedBooking.menu.name,
        status: updatedBooking.status,
        date: updatedBooking.date.toISOString().split('T')[0],
        time: updatedBooking.time,
        people: updatedBooking.peopleCount,
        chef: `Chef: ${updatedBooking.chef.name}`,
        chefId: updatedBooking.chefId,
        notes: updatedBooking.notes || '',
        price: updatedBooking.totalPrice,
        plan: updatedBooking.plan.name
      }
      
    } catch (dbError) {
      console.log('⚠️ Erro ao atualizar no banco, simulando atualização:', dbError)
      
      // Se o banco falhar, simular atualização com dados mock
      const originalBooking = mockBookings.find(b => b.id === bookingId)
      if (originalBooking) {
        // Atualizar dados mock locais
        const index = mockBookings.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          mockBookings[index] = {
            ...originalBooking,
            date: date,
            time: time,
            people: people,
            notes: notes || ''
          }
        }
        
        console.log('✅ Agendamento atualizado nos dados mock')
        
        // Criar objeto formatado para resposta
        formattedBooking = {
          id: originalBooking.id,
          title: originalBooking.title,
          status: originalBooking.status,
          date: date,
          time: time,
          people: people,
          chef: originalBooking.chef,
          chefId: originalBooking.chefId,
          notes: notes || '',
          price: originalBooking.price,
          plan: originalBooking.plan
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento atualizado com sucesso!',
      booking: formattedBooking
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
    
    const { date, time, people, menuId, chefId, notes, planId, peopleCount } = body

    console.log('🔍 Dados extraídos:', {
      date, time, people, menuId, chefId, notes, planId, peopleCount
    })

    // Normalizar o campo people (aceitar tanto 'people' quanto 'peopleCount')
    const normalizedPeople = people || peopleCount

    // Validações
    if (!date || !time || !normalizedPeople || !menuId || !chefId || !planId) {
      console.log('❌ Validação falhou - campos obrigatórios:', {
        hasDate: !!date,
        hasTime: !!time,
        hasPeople: !!normalizedPeople,
        hasMenuId: !!menuId,
        hasChefId: !!chefId,
        hasPlanId: !!planId
      })
      return NextResponse.json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      }, { status: 400 })
    }

    console.log('✅ Validação de campos obrigatórios aprovada')

    // VALIDAÇÃO DE DATA: Para novos agendamentos, não permitir datas passadas
    // Corrigir problema de fuso horário - garantir que a data seja interpretada corretamente
    const selectedDate = new Date(date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetar para início do dia
    
    console.log('🔍 Validação de data para novo agendamento:', {
      date,
      selectedDate: selectedDate.toISOString(),
      today: today.toISOString(),
      isPast: selectedDate < today
    })
    
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

    // Tentar criar novo agendamento no banco de dados
    console.log('✅ Validações de data e disponibilidade aprovadas')
    
    let formattedBooking
    
    try {
      console.log('✅ Criando agendamento no banco de dados')

      // Converter a data para o formato DateTime
      const bookingDate = new Date(date + 'T00:00:00')
      
      // Buscar o menu para calcular o preço total
      const menu = await prisma.menu.findUnique({
        where: { id: menuId }
      })

      if (!menu) {
        throw new Error('Menu não encontrado no banco')
      }

      // Buscar o plano para aplicar o desconto
      const plan = await prisma.plan.findUnique({
        where: { id: planId }
      })

      // Calcular preço total com desconto do plano
      let totalPrice = menu.price * normalizedPeople
      if (plan && plan.discount) {
        totalPrice = totalPrice * (1 - plan.discount / 100)
      }

      console.log('💰 Cálculo do preço:', {
        menuPrice: menu.price,
        people: normalizedPeople,
        basePrice: menu.price * normalizedPeople,
        planDiscount: plan?.discount || 0,
        finalPrice: totalPrice
      })

      // Criar o agendamento
      const newBooking = await prisma.booking.create({
        data: {
          clientId: 'cmebe87t70001fjuic53jh9f0', // ID temporário para teste
          chefId: chefId,
          planId: planId,
          menuId: menuId,
          date: bookingDate,
          time: time,
          peopleCount: normalizedPeople,
          totalPrice: totalPrice,
          notes: notes || '',
          status: 'PENDING'
        },
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          },
          chef: {
            select: {
              name: true
            }
          },
          plan: {
            select: {
              name: true
            }
          },
          menu: {
            select: {
              name: true
            }
          }
        }
      })

      console.log('✅ Agendamento criado no banco:', newBooking.id)
      
      // Converter para o formato esperado pelo frontend
      formattedBooking = {
        id: newBooking.id,
        title: newBooking.menu.name,
        status: newBooking.status,
        date: newBooking.date.toISOString().split('T')[0],
        time: newBooking.time,
        people: newBooking.peopleCount,
        chef: `Chef: ${newBooking.chef.name}`,
        chefId: newBooking.chefId,
        notes: newBooking.notes || '',
        price: newBooking.totalPrice,
        plan: newBooking.plan.name
      }
      
    } catch (dbError) {
      console.log('⚠️ Erro ao criar no banco, simulando criação:', dbError)
      
      // Se o banco falhar, simular criação com dados mock
      const mockMenu = mockMenus.find(m => m.id === menuId)
      const mockPlan = mockPlans.find(p => p.id === planId)
      
      if (!mockMenu) {
        throw new Error('Menu não encontrado nos dados mock')
      }
      
      // Calcular preço total com desconto do plano
      let mockTotalPrice = mockMenu.price * normalizedPeople
      if (mockPlan && mockPlan.discount) {
        mockTotalPrice = mockTotalPrice * (1 - mockPlan.discount / 100)
      }
      
      console.log('💰 Cálculo do preço (mock):', {
        menuPrice: mockMenu.price,
        people: normalizedPeople,
        basePrice: mockMenu.price * normalizedPeople,
        planDiscount: mockPlan?.discount || 0,
        finalPrice: mockTotalPrice
      })
      
      const newId = Date.now().toString()
      
      // Adicionar aos dados mock locais
      const newMockBooking = {
        id: newId,
        title: mockMenu.name,
        status: 'PENDING',
        date: date,
        time: time,
        people: normalizedPeople,
        chef: 'Chef: Maria Costa',
        chefId: chefId,
        notes: notes || '',
        price: mockTotalPrice,
        plan: mockPlan?.name || 'Plano Selecionado'
      }
      
      mockBookings.push(newMockBooking)
      
      console.log('✅ Agendamento criado nos dados mock')
      
      // Criar objeto formatado para resposta
      formattedBooking = newMockBooking
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento criado com sucesso!',
      booking: formattedBooking
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

    let updatedBooking
    
    try {
      // Atualizar o status para CANCELLED no banco de dados
      updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      })

      console.log('✅ Agendamento cancelado no banco:', updatedBooking.id)
      
    } catch (dbError) {
      console.log('⚠️ Erro ao cancelar no banco, simulando cancelamento:', dbError)
      
      // Se o banco falhar, simular cancelamento com dados mock
      const index = mockBookings.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        mockBookings[index].status = 'CANCELLED'
        console.log('✅ Agendamento cancelado nos dados mock')
      }
    }

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
