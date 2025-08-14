import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Iniciando PUT /api/client/profile')
    
    const session = await getServerSession(authOptions)
    console.log('📋 Session recebida:', session)
    console.log('👤 User ID:', (session?.user as any)?.id)
    console.log('🎭 User Role:', (session?.user as any)?.role)
    
    if (!session) {
      console.log('❌ Sessão não encontrada')
      return NextResponse.json(
        { message: 'Sessão não encontrada' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'CLIENT') {
      console.log('❌ Usuário não é cliente:', (session.user as any).role)
      return NextResponse.json(
        { message: 'Acesso negado. Apenas clientes podem atualizar perfil.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('📝 Body recebido:', body)
    console.log('📝 Body type:', typeof body)
    console.log('📝 Body keys:', Object.keys(body))
    
    const { name, phone, address, dietaryPreferences } = body

    // Validações com logs detalhados
    console.log('🔍 Validando campos:')
    console.log('  - name:', name, 'type:', typeof name, 'length:', name?.length)
    console.log('  - phone:', phone, 'type:', typeof phone, 'length:', phone?.length)
    console.log('  - address:', address, 'type:', typeof address, 'length:', address?.length)
    console.log('  - dietaryPreferences:', dietaryPreferences, 'type:', typeof dietaryPreferences, 'length:', dietaryPreferences?.length)

    // Validação mais flexível - permitir campos vazios por enquanto
    if (!name) {
      console.log('❌ Nome é obrigatório')
      return NextResponse.json(
        { message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    console.log('🔧 Tentando atualizar perfil para userId:', (session.user as any).id)

    // Verificar se o perfil existe
    let existingProfile = await prisma.clientProfile.findUnique({
      where: {
        userId: (session.user as any).id
      }
    })

    console.log('📄 Perfil existente:', existingProfile ? 'SIM' : 'NÃO')

    let updatedProfile

    try {
      // Primeiro, atualizar o nome do usuário
      console.log('👤 Atualizando nome do usuário para:', name)
      const updatedUser = await prisma.user.update({
        where: {
          id: (session.user as any).id
        },
        data: {
          name: name
        }
      })
      console.log('✅ Usuário atualizado:', updatedUser.name)

      if (existingProfile) {
        // Atualizar perfil existente
        console.log('🔄 Atualizando perfil existente')
        updatedProfile = await prisma.clientProfile.update({
          where: {
            userId: (session.user as any).id
          },
          data: {
            phone: phone || existingProfile.phone,
            address: address || existingProfile.address,
            dietaryPreferences: dietaryPreferences || existingProfile.dietaryPreferences,
            updatedAt: new Date()
          }
        })
      } else {
        // Criar novo perfil
        console.log('🆕 Criando novo perfil de cliente')
        updatedProfile = await prisma.clientProfile.create({
          data: {
            userId: (session.user as any).id,
            phone: phone || '',
            address: address || '',
            dietaryPreferences: dietaryPreferences || '',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }

      console.log('✅ Perfil atualizado com sucesso:', updatedProfile)

      return NextResponse.json({
        message: 'Perfil atualizado com sucesso',
        profile: updatedProfile,
        user: {
          name: name
        }
      }, { status: 200 })

    } catch (dbError) {
      console.error('💥 Erro no banco de dados:', dbError)
      throw dbError
    }

  } catch (error) {
    console.error('💥 Erro detalhado ao atualizar perfil:', error)
    console.error('📚 Stack trace:', error instanceof Error ? error.stack : 'N/A')
    return NextResponse.json(
      { message: 'Erro interno do servidor', error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Sessão não encontrada' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'CLIENT') {
      return NextResponse.json(
        { message: 'Acesso negado. Apenas clientes podem acessar perfil.' },
        { status: 403 }
      )
    }

    // Buscar perfil do cliente
    const profile = await prisma.clientProfile.findUnique({
      where: {
        userId: (session.user as any).id
      }
    })

    if (!profile) {
      return NextResponse.json(
        { message: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      profile
    }, { status: 200 })

  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
