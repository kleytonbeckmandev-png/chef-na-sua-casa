const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserLogin() {
  try {
    console.log('🔍 Verificando usuário para login...')
    
    const user = await prisma.user.findUnique({
      where: {
        email: 'kleytonbeckman@gmail.com'
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      }
    })
    
    if (user) {
      console.log('✅ Usuário encontrado:')
      console.log(`   ID: ${user.id}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Criado em: ${user.createdAt}`)
      console.log(`   Senha hash: ${user.password.substring(0, 20)}...`)
      
      // Verificar se tem perfil
      if (user.role === 'CLIENT') {
        const profile = await prisma.clientProfile.findUnique({
          where: { userId: user.id }
        })
        console.log(`   Perfil cliente: ${profile ? 'Sim' : 'Não'}`)
      } else if (user.role === 'CHEF') {
        const profile = await prisma.chefProfile.findUnique({
          where: { userId: user.id }
        })
        console.log(`   Perfil chef: ${profile ? 'Sim' : 'Não'}`)
      }
    } else {
      console.log('❌ Usuário não encontrado')
    }
    
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserLogin()
