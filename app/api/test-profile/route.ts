import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    console.log('🧪 TESTE: Iniciando PUT /api/test-profile')
    
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

    // Simular sucesso
    console.log('✅ TESTE: Todos os campos válidos')
    
    return NextResponse.json({
      message: 'TESTE: Perfil recebido com sucesso',
      receivedData: {
        name,
        phone,
        address,
        dietaryPreferences
      },
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('💥 Erro no teste:', error)
    return NextResponse.json(
      { message: 'Erro no teste', error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
