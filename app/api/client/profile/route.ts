import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session) // Debug
    
    if (!session) {
      return NextResponse.json(
        { message: 'Sessão não encontrada' },
        { status: 401 }
      )
    }

    if ((session.user as any).role !== 'CLIENT') {
      return NextResponse.json(
        { message: 'Acesso negado. Apenas clientes podem atualizar perfil.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { phone, address, dietaryPreferences } = body

    // Validações
    if (!phone || !address || !dietaryPreferences) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar perfil do cliente
    const updatedProfile = await prisma.clientProfile.update({
      where: {
        userId: (session.user as any).id
      },
      data: {
        phone,
        address,
        dietaryPreferences,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      profile: updatedProfile
    }, { status: 200 })

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
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
