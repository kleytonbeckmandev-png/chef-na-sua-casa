import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, Calendar, Users, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Chef na Sua Casa</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Tenha um chef profissional
            <span className="text-orange-600"> na sua casa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Agende refeições personalizadas com cozinheiras experientes. 
            Escolha seu cardápio, defina o número de pessoas e receba um serviço de qualidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Começar Agora
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Processo simples em apenas 4 passos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Cadastre-se</h3>
              <p className="text-gray-600">Crie sua conta e escolha seu perfil</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Agende</h3>
              <p className="text-gray-600">Escolha data, horário e cardápio</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Receba</h3>
              <p className="text-gray-600">Nossa cozinheira prepara sua refeição</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Aproveite</h3>
              <p className="text-gray-600">Desfrute de uma refeição incrível</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planos Flexíveis
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o que melhor se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Avulso</h3>
              <p className="text-gray-600 mb-6">Perfeito para ocasiões especiais</p>
              <ul className="text-gray-600 mb-8 space-y-2">
                <li>• 1 refeição</li>
                <li>• Cardápio personalizado</li>
                <li>• Flexibilidade total</li>
              </ul>
              <Button className="w-full">Escolher</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-orange-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mensal</h3>
              <p className="text-gray-600 mb-6">Ideal para famílias</p>
              <ul className="text-gray-600 mb-8 space-y-2">
                <li>• 4 refeições por mês</li>
                <li>• Desconto de 15%</li>
                <li>• Prioridade no agendamento</li>
              </ul>
              <Button className="w-full">Escolher</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trimestral</h3>
              <p className="text-gray-600 mb-6">Melhor custo-benefício</p>
              <ul className="text-gray-600 mb-8 space-y-2">
                <li>• 12 refeições por trimestre</li>
                <li>• Desconto de 25%</li>
                <li>• Suporte prioritário</li>
              </ul>
              <Button className="w-full">Escolher</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Chef na Sua Casa</h3>
              <p className="text-gray-400">
                Conectando clientes a cozinheiras profissionais para experiências gastronômicas únicas.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Refeições personalizadas</li>
                <li>Agendamento online</li>
                <li>Cardápios variados</li>
                <li>Suporte 24/7</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre nós</li>
                <li>Carreiras</li>
                <li>Imprensa</li>
                <li>Contato</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Termos de uso</li>
                <li>Política de privacidade</li>
                <li>Cookies</li>
                <li>LGPD</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Chef na Sua Casa. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
