import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuários de teste
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Criar admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {},
    create: {
      email: 'admin@teste.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Criar cliente
  const client = await prisma.user.upsert({
    where: { email: 'cliente@teste.com' },
    update: {},
    create: {
      email: 'cliente@teste.com',
      name: 'João Silva',
      password: hashedPassword,
      role: 'CLIENT',
      clientProfile: {
        create: {
          dietaryPreferences: ['Vegetariano'],
          address: 'Rua das Flores, 123 - São Paulo, SP',
          phone: '(11) 99999-9999',
        },
      },
    },
  })

  // Criar cozinheira
  const chef = await prisma.user.upsert({
    where: { email: 'chef@teste.com' },
    update: {},
    create: {
      email: 'chef@teste.com',
      name: 'Maria Costa',
      password: hashedPassword,
      role: 'CHEF',
      chefProfile: {
        create: {
          specialties: ['Culinária Italiana', 'Culinária Francesa'],
          experience: '8 anos',
          bio: 'Chef profissional com experiência em restaurantes renomados e eventos privados.',
          hourlyRate: 80.0,
          isAvailable: true,
        },
      },
    },
  })

  // Criar planos
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { name: 'Avulso' },
      update: {},
      create: {
        name: 'Avulso',
        description: '1 refeição personalizada',
        duration: 1,
        price: 150.0,
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Mensal' },
      update: {},
      create: {
        name: 'Mensal',
        description: '4 refeições por mês',
        duration: 30,
        price: 520.0,
        isActive: true,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Trimestral' },
      update: {},
      create: {
        name: 'Trimestral',
        description: '12 refeições por trimestre',
        duration: 90,
        price: 1350.0,
        isActive: true,
      },
    }),
  ])

  // Criar cardápios
  const menus = await Promise.all([
    prisma.menu.upsert({
      where: { name: 'Culinária Italiana' },
      update: {},
      create: {
        name: 'Culinária Italiana',
        description: 'Massas, risotos e pratos tradicionais italianos',
        price: 50.0,
        isActive: true,
      },
    }),
    prisma.menu.upsert({
      where: { name: 'Culinária Francesa' },
      update: {},
      create: {
        name: 'Culinária Francesa',
        description: 'Pratos sofisticados da gastronomia francesa',
        price: 70.0,
        isActive: true,
      },
    }),
    prisma.menu.upsert({
      where: { name: 'Culinária Brasileira' },
      update: {},
      create: {
        name: 'Culinária Brasileira',
        description: 'Feijoada, churrasco e pratos regionais',
        price: 45.0,
        isActive: true,
      },
    }),
    prisma.menu.upsert({
      where: { name: 'Culinária Asiática' },
      update: {},
      create: {
        name: 'Culinária Asiática',
        description: 'Sushi, pad thai e pratos orientais',
        price: 60.0,
        isActive: true,
      },
    }),
    prisma.menu.upsert({
      where: { name: 'Culinária Vegetariana' },
      update: {},
      create: {
        name: 'Culinária Vegetariana',
        description: 'Pratos vegetarianos e veganos',
        price: 40.0,
        isActive: true,
      },
    }),
    prisma.menu.upsert({
      where: { name: 'Doces e Sobremesas' },
      update: {},
      create: {
        name: 'Doces e Sobremesas',
        description: 'Bolos, tortas e sobremesas especiais',
        price: 35.0,
        isActive: true,
      },
    }),
  ])

  // Criar alguns agendamentos de exemplo
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(19, 0, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(18, 0, 0, 0)

  await Promise.all([
    prisma.booking.upsert({
      where: { id: 'booking-1' },
      update: {},
      create: {
        id: 'booking-1',
        clientId: client.id,
        chefId: chef.id,
        planId: plans[0].id, // Avulso
        menuId: menus[0].id, // Italiana
        date: tomorrow,
        time: '19:00',
        peopleCount: 4,
        totalPrice: 200.0,
        status: 'CONFIRMED',
        notes: 'Cliente prefere massas sem glúten',
      },
    }),
    prisma.booking.upsert({
      where: { id: 'booking-2' },
      update: {},
      create: {
        id: 'booking-2',
        clientId: client.id,
        chefId: chef.id,
        planId: plans[1].id, // Mensal
        menuId: menus[1].id, // Francesa
        date: nextWeek,
        time: '18:00',
        peopleCount: 2,
        totalPrice: 140.0,
        status: 'PENDING',
        notes: 'Aniversário de casamento',
      },
    }),
  ])

  console.log('✅ Seed concluído com sucesso!')
  console.log('👤 Usuários criados:')
  console.log(`   - Admin: ${admin.email}`)
  console.log(`   - Cliente: ${client.email}`)
  console.log(`   - Cozinheira: ${chef.email}`)
  console.log('📋 Planos criados:', plans.length)
  console.log('🍽️ Cardápios criados:', menus.length)
  console.log('📅 Agendamentos de exemplo criados')
  console.log('\n🔑 Senha para todos os usuários: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
