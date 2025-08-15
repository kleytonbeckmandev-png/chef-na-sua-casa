import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Iniciando PUT /api/client/profile')
    
    const body = await request.json()
    console.log('📝 Body recebido:', body)
    
    const { name, phone, address, dietaryPreferences } = body

    // Validação simples
    if (!name) {
      console.log('❌ Nome é obrigatório')
      return NextResponse.json(
        { message: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    console.log('✅ Nome recebido:', name)

    // Usar um usuário fixo para teste
    const testUserId = 'cmebe87t70001fjuic53jh9f0'
    
    try {
      // Atualizar o nome do usuário
      console.log('👤 Atualizando nome do usuário para:', name)
      const updatedUser = await prisma.user.update({
        where: { id: testUserId },
        data: { name: name }
      })
      console.log('✅ Usuário atualizado:', updatedUser.name)

      // Buscar ou criar perfil
      let profile = await prisma.clientProfile.findUnique({
        where: { userId: testUserId }
      })

      if (profile) {
        // Atualizar perfil existente
        console.log('🔄 Atualizando perfil existente')
        profile = await prisma.clientProfile.update({
          where: { userId: testUserId },
          data: {
            phone: phone || profile.phone,
            address: address || profile.address,
            dietaryPreferences: dietaryPreferences || profile.dietaryPreferences,
            updatedAt: new Date()
          }
        })
      } else {
        // Criar novo perfil
        console.log('🆕 Criando novo perfil')
        profile = await prisma.clientProfile.create({
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

      console.log('✅ Perfil atualizado/criado:', profile)

      return NextResponse.json({
        success: true,
        message: 'Perfil atualizado com sucesso!',
        profile: profile,
        user: { name: name }
      })

    } catch (dbError) {
      console.error('💥 Erro no banco:', dbError)
      return NextResponse.json({
        success: false,
        message: 'Erro ao salvar no banco de dados',
        error: dbError instanceof Error ? dbError.message : 'Erro desconhecido'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('💥 Erro geral:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando GET /api/client/profile')
    
    // Usar um usuário fixo para teste
    const testUserId = 'cmebe87t70001fjuic53jh9f0'
    
    // Buscar perfil e usuário
    const [profile, user] = await Promise.all([
      prisma.clientProfile.findUnique({
        where: { userId: testUserId }
      }),
      prisma.user.findUnique({
        where: { id: testUserId },
        select: { name: true, email: true }
      })
    ])

    if (!profile) {
      console.log('❌ Perfil não encontrado')
      return NextResponse.json({
        success: false,
        message: 'Perfil não encontrado'
      }, { status: 404 })
    }

    console.log('✅ Perfil encontrado:', profile)
    console.log('✅ Usuário encontrado:', user)

    return NextResponse.json({
      success: true,
      profile: profile,
      user: user
    })

  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
