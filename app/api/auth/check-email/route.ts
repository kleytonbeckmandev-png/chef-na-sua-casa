import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? 'Email já está em uso' : 'Email disponível'
    })

  } catch (error) {
    console.error('Erro ao verificar email:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
