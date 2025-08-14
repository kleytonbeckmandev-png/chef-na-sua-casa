"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, ChefHat, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewBookingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    plan: '',
    menu: '',
    peopleCount: '',
    date: '',
    time: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Dados mockados para demonstração
  const plans = [
    { id: '1', name: 'Avulso', description: '1 refeição', price: 150, duration: 1 },
    { id: '2', name: 'Mensal', description: '4 refeições por mês', price: 520, duration: 30, discount: 15 },
    { id: '3', name: 'Trimestral', description: '12 refeições por trimestre', price: 1350, duration: 90, discount: 25 }
  ]

  const menus = [
    { id: '1', name: 'Culinária Italiana', description: 'Massas, risotos e pratos tradicionais italianos', price: 50 },
    { id: '2', name: 'Culinária Francesa', description: 'Pratos sofisticados da gastronomia francesa', price: 70 },
    { id: '3', name: 'Culinária Brasileira', description: 'Feijoada, churrasco e pratos regionais', price: 45 },
    { id: '4', name: 'Culinária Asiática', description: 'Sushi, pad thai e pratos orientais', price: 60 },
    { id: '5', name: 'Culinária Vegetariana', description: 'Pratos vegetarianos e veganos', price: 40 },
    { id: '6', name: 'Doces e Sobremesas', description: 'Bolos, tortas e sobremesas especiais', price: 35 }
  ]

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotal = () => {
    const selectedPlan = plans.find(p => p.id === formData.plan)
    const selectedMenu = menus.find(m => m.id === formData.menu)
    const peopleCount = parseInt(formData.peopleCount) || 0

    if (!selectedPlan || !selectedMenu) return 0

    let basePrice = selectedMenu.price * peopleCount
    if (selectedPlan.discount) {
      basePrice = basePrice * (1 - selectedPlan.discount / 100)
    }
    return basePrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação do agendamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso! Em breve você receberá a confirmação.",
      })
      
      router.push('/client/bookings')
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Escolha seu Plano</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                formData.plan === plan.id 
                  ? 'ring-2 ring-orange-500 bg-orange-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleInputChange('plan', plan.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  R$ {plan.price}
                </div>
                {plan.discount && (
                  <div className="text-sm text-green-600">
                    {plan.discount}% de desconto
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => setStep(2)}
          disabled={!formData.plan}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Selecione o Cardápio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map((menu) => (
            <Card 
              key={menu.id} 
              className={`cursor-pointer transition-all ${
                formData.menu === menu.id 
                  ? 'ring-2 ring-orange-500 bg-orange-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleInputChange('menu', menu.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{menu.name}</CardTitle>
                <CardDescription>{menu.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-orange-600">
                  R$ {menu.price}/pessoa
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="peopleCount">Número de Pessoas *</Label>
          <Input
            id="peopleCount"
            type="number"
            min="1"
            max="20"
            value={formData.peopleCount}
            onChange={(e) => handleInputChange('peopleCount', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Voltar
        </Button>
        <Button 
          onClick={() => setStep(3)}
          disabled={!formData.menu || !formData.peopleCount}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Agende Data e Horário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Horário *</Label>
            <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input
          id="notes"
          placeholder="Alguma observação especial? (opcional)"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>
          Voltar
        </Button>
        <Button 
          onClick={() => setStep(4)}
          disabled={!formData.date || !formData.time}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Resumo do Agendamento</h3>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plano:</span>
                <span>{plans.find(p => p.id === formData.plan)?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cardápio:</span>
                <span>{menus.find(m => m.id === formData.menu)?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pessoas:</span>
                <span>{formData.peopleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Data:</span>
                <span>{new Date(formData.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Horário:</span>
                <span>{formData.time}</span>
              </div>
              {formData.notes && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Observações:</span>
                  <span className="text-gray-600">{formData.notes}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)}>
          Voltar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Criando...' : 'Confirmar Agendamento'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Agendamento</h1>
        <p className="text-gray-600">
          Siga os passos para agendar sua refeição personalizada
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Plano</span>
          <span>Cardápio</span>
          <span>Agendamento</span>
          <span>Confirmação</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  )
}
