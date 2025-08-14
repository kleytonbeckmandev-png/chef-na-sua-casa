import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      dietaryPreferences,
      specialties,
      experience,
      bio,
      hourlyRate
    } = body

    // Validações básicas
    if (!name || !email || !password || !role || !phone || !address) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está em uso' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as 'CLIENT' | 'CHEF',
      }
    })

    // Criar perfil baseado no role
    if (role === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          dietaryPreferences: dietaryPreferences || 'Sem restrições',
          address,
          phone,
        }
      })
    } else if (role === 'CHEF') {
      if (!specialties || !experience || !hourlyRate) {
        return NextResponse.json(
          { message: 'Para cozinheiras, especialidades, experiência e taxa por hora são obrigatórios' },
          { status: 400 }
        )
      }

      await prisma.chefProfile.create({
        data: {
          userId: user.id,
          specialties: specialties || 'Culinária geral',
          experience,
          bio: bio || '',
          hourlyRate: parseFloat(hourlyRate),
          isAvailable: true,
        }
      })
    }

    return NextResponse.json(
      { message: 'Usuário criado com sucesso' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
