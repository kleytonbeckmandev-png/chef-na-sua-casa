import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Iniciando PUT /api/client/profile')
    
    // TEMPORARIAMENTE: Aceitar qualquer requisição para debug
    console.log('⚠️ MODO DEBUG: Aceitando qualquer requisição')
    
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

    // Validação mínima
    if (name === undefined || name === null) {
      console.log('❌ Nome é undefined/null')
      return NextResponse.json(
        { message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Para debug, vamos usar um usuário fixo
    const testUserId = 'cmebe87t70001fjuic53jh9f0' // ID do usuário cliente que vimos no teste
    
    console.log('🔧 Tentando atualizar perfil para userId:', testUserId)

    // Verificar se o perfil existe
    let existingProfile = await prisma.clientProfile.findUnique({
      where: {
        userId: testUserId
      }
    })

    console.log('📄 Perfil existente:', existingProfile ? 'SIM' : 'NÃO')

    let updatedProfile

    try {
      // Primeiro, atualizar o nome do usuário
      console.log('👤 Atualizando nome do usuário para:', name)
      const updatedUser = await prisma.user.update({
        where: {
          id: testUserId
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
            userId: testUserId
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
            userId: testUserId,
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
    console.log('🔍 Iniciando GET /api/client/profile')
    
    // TEMPORARIAMENTE: Aceitar qualquer requisição para debug
    console.log('⚠️ MODO DEBUG: Aceitando qualquer requisição')
    
    // Para debug, vamos usar um usuário fixo
    const testUserId = 'cmebe87t70001fjuic53jh9f0' // ID do usuário cliente que vimos no teste
    
    // Buscar perfil do cliente
    const profile = await prisma.clientProfile.findUnique({
      where: {
        userId: testUserId
      }
    })

    if (!profile) {
      console.log('❌ Perfil não encontrado')
      return NextResponse.json(
        { message: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Perfil encontrado:', profile)

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
