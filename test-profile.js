const fetch = require('node-fetch')

async function testProfileAPI() {
  try {
    console.log('🧪 Testando API de perfil...')
    
    // Simular dados que o frontend envia
    const testData = {
      name: 'Kleyton Barbosa Teste',
      phone: '98981302056',
      address: 'Res. Portal do Paço 3 - Rua 31 Quadra 20',
      dietaryPreferences: 'SEM DETALHES'
    }
    
    console.log('📤 Dados de teste:', testData)
    console.log('📤 JSON stringify:', JSON.stringify(testData))
    
    // Testar a API (sem autenticação por enquanto)
    const response = await fetch('http://localhost:3000/api/client/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📋 Status da resposta:', response.status)
    console.log('📋 Headers:', response.headers.raw())
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Resposta de sucesso:', data)
    } else {
      const errorData = await response.json()
      console.log('❌ Erro na resposta:', errorData)
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error)
  }
}

testProfileAPI()
