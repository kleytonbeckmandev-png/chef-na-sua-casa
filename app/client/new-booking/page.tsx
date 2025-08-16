"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Clock, Users, ChefHat, CreditCard, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewBookingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    plan: '',
    menu: '',
    peopleCount: 1,
    date: '',
    shift: '',
    time: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<any>(null)
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])
  const [shoppingCart, setShoppingCart] = useState<Array<{
    id: string
    name: string
    category: string
    price: number
    quantity: number
  }>>([])
  const router = useRouter()
  const { toast } = useToast()

  // Dados mockados para demonstração
  const plans = [
    { id: '1', name: 'Avulso', description: '1 refeição personalizada', price: null, duration: 1, discount: 0 },
    { id: '2', name: 'Mensal', description: '4 refeições por mês', price: 520, duration: 30, discount: 25 },
    { id: '3', name: 'Trimestral', description: '12 refeições por trimestre', price: 1350, duration: 90, discount: 25 }
  ]

  const menus = [
    { 
      id: '1', 
      name: 'CARNE BOVINA', 
      description: 'Assado de panela, Cozidão, Carne frita, Churrasco, Estrogonofe, Filé ao molho, Carne assada', 
      price: 70,
      subOptions: ['Assado de panela', 'Cozidão', 'Carne frita', 'Churrasco', 'Estrogonofe', 'Filé ao molho', 'Carne assada']
    },
    { 
      id: '2', 
      name: 'AVES', 
      description: 'Frango assado, Frango grelhado, Frango ao molho, Peru assado, Pato assado, Frango frito, Frango cozido', 
      price: 60,
      subOptions: ['Frango assado', 'Frango grelhado', 'Frango ao molho', 'Peru assado', 'Pato assado', 'Frango frito', 'Frango cozido']
    },
    { 
      id: '3', 
      name: 'CARNE SUÍNA', 
      description: 'Porco assado, Lombo assado, Costela assada, Carne de porco grelhada, Porco ao molho, Lombo grelhado', 
      price: 65,
      subOptions: ['Porco assado', 'Lombo assado', 'Costela assada', 'Carne de porco grelhada', 'Porco ao molho', 'Lombo grelhado']
    },
    { 
      id: '4', 
      name: 'PEIXES E FRUTOS DO MAR', 
      description: 'Salmão grelhado, Atum grelhado, Bacalhau assado, Camarão grelhado, Peixe frito, Peixe ao molho, Mariscos', 
      price: 75,
      subOptions: ['Salmão grelhado', 'Atum grelhado', 'Bacalhau assado', 'Camarão grelhado', 'Peixe frito', 'Peixe ao molho', 'Mariscos']
    },
    { 
      id: '5', 
      name: 'SOBREMESAS', 
      description: 'Bolo de chocolate, Torta de limão, Pudim, Sorvete caseiro, Mousse, Tiramisu, Cheesecake', 
      price: 35,
      subOptions: ['Bolo de chocolate', 'Torta de limão', 'Pudim', 'Sorvete caseiro', 'Mousse', 'Tiramisu', 'Cheesecake']
    },
    { 
      id: '6', 
      name: 'SALADAS', 
      description: 'Salada verde, Salada de frutas, Salada de grãos, Salada de legumes, Salada de massas, Salada de quinoa', 
      price: 40,
      subOptions: ['Salada verde', 'Salada de frutas', 'Salada de grãos', 'Salada de legumes', 'Salada de massas', 'Salada de quinoa']
    },
    { 
      id: '7', 
      name: 'OUTRAS', 
      description: 'Massas, Risotos, Sopas, Pães caseiros, Molhos especiais, Conservas caseiras', 
      price: 50,
      subOptions: ['Massas', 'Risotos', 'Sopas', 'Pães caseiros', 'Molhos especiais', 'Conservas caseiras']
    }
  ]

  const shifts = [
    { id: 'morning', name: 'MANHÃ', start: '08:00', end: '12:00', icon: '🌅' },
    { id: 'afternoon', name: 'TARDE', start: '14:00', end: '18:00', icon: '🌆' }
  ]

  const timeSlotsByShift = {
    morning: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    afternoon: ['14:00', '15:00', '16:00', '17:00', '18:00']
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'shift') {
      setFormData(prev => ({ ...prev, time: '' }))
    }
    
    if (field === 'date' && formData.plan) {
      const validation = validatePlanDate(value, formData.plan)
      if (!validation.valid) {
        toast({
          title: "Data inválida",
          description: validation.message,
          variant: "destructive",
        })
        setFormData(prev => ({ ...prev, date: '' }))
      }
    }
  }

  const openMenuModal = (menu: any) => {
    setSelectedMenuCategory(menu)
    setSelectedMenuItems([])
    setIsMenuModalOpen(true)
  }

  const handleMenuItemToggle = (item: string) => {
    setSelectedMenuItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const confirmMenuSelection = () => {
    if (selectedMenuItems.length === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos um item do cardápio",
        variant: "destructive",
      })
      return
    }

    // Adicionar itens selecionados à cesta
    const newItems = selectedMenuItems.map(item => ({
      id: `${selectedMenuCategory.id}-${item}`,
      name: item,
      category: selectedMenuCategory.name,
      price: selectedMenuCategory.price,
      quantity: 1
    }))

    setShoppingCart(prev => {
      // Filtrar itens que já existem na cesta
      const existingItems = prev.filter(cartItem => 
        !newItems.some(newItem => newItem.id === cartItem.id)
      )
      return [...existingItems, ...newItems]
    })

    setIsMenuModalOpen(false)
    
    toast({
      title: "Itens adicionados à cesta",
      description: `${selectedMenuItems.length} item(s) adicionado(s) à cesta`,
      variant: "default",
    })
  }

  const removeFromCart = (itemId: string) => {
    setShoppingCart(prev => prev.filter(item => item.id !== itemId))
    toast({
      title: "Item removido",
      description: "Item removido da cesta",
      variant: "default",
    })
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setShoppingCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const calculateCartTotal = () => {
    return shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItemsInCart = () => {
    return shoppingCart.reduce((total, item) => total + item.quantity, 0)
  }

  const closeMenuModal = () => {
    setIsMenuModalOpen(false)
    setSelectedMenuCategory(null)
    setSelectedMenuItems([])
  }

  const calculateTotal = () => {
    const selectedPlan = plans.find(p => p.id === formData.plan)
    const peopleCount = formData.peopleCount || 0

    if (!selectedPlan) return 0

    // Para plano avulso, calcular baseado na cesta e pessoas
    if (selectedPlan.id === '1') {
      return calculateCartTotal() * peopleCount
    }

    // Para outros planos, aplicar desconto se houver
    let basePrice = calculateCartTotal() * peopleCount
    if (selectedPlan.discount) {
      basePrice = basePrice * (1 - selectedPlan.discount / 100)
    }
    return basePrice
  }

  const validatePlanDate = (selectedDate: string, planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId)
    if (!selectedPlan) return { valid: false, message: "Plano não encontrado" }

    const today = new Date()
    const selected = new Date(selectedDate)
    const maxDate = new Date(today.getTime() + (selectedPlan.duration * 24 * 60 * 60 * 1000))

    if (selected < today) {
      return { valid: false, message: "A data não pode ser no passado" }
    }

    if (selected > maxDate) {
      return { valid: false, message: `A data deve estar dentro dos ${selectedPlan.duration} dias de validade do plano` }
    }

    return { valid: true, message: "" }
  }

  const handleSubmit = async () => {
    if (!formData.plan || !formData.menu || !formData.peopleCount || !formData.date || !formData.shift || !formData.time) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const requestBody = {
        planId: formData.plan,
        peopleCount: formData.peopleCount,
        date: formData.date,
        shift: formData.shift,
        time: formData.time,
        notes: formData.notes,
        shoppingCart: shoppingCart,
        totalCartValue: calculateCartTotal(),
        totalItems: getTotalItemsInCart()
      }

      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar agendamento')
      }

      const result = await response.json()

      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso",
        variant: "default",
      })

      router.push('/client/bookings')
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o agendamento",
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
                {plan.price ? (
                  <div className="text-2xl font-bold text-orange-600">
                    R$ {plan.price}
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-gray-600">
                    Preço calculado por refeição
                  </div>
                )}
                {plan.discount && plan.discount > 0 && (
                  <div className="text-sm text-green-600">
                    {plan.discount}% de desconto
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Validade:</strong> {plan.duration} {plan.duration === 1 ? 'dia' : 'dias'}
                </div>
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
                shoppingCart.some(item => item.category === menu.name)
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => openMenuModal(menu)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{menu.name}</CardTitle>
                <CardDescription>{menu.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-orange-600">
                  R$ {menu.price}/pessoa
                </div>
                {shoppingCart.some(item => item.category === menu.name) && (
                  <div className="mt-2 text-sm text-green-600">
                    <strong>Itens na cesta: {shoppingCart.filter(item => item.category === menu.name).length}</strong>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cesta de Compras */}
      {shoppingCart.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">🛒 Cesta de Compras</h3>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                {shoppingCart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.category}</div>
                      <div className="text-sm text-orange-600 font-medium">
                        R$ {item.price}/pessoa
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold text-green-700">
                    <span>Total da Cesta:</span>
                    <span>R$ {calculateCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-green-600">
                    {getTotalItemsInCart()} item(s) selecionado(s)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
        
        {formData.plan === '1' && shoppingCart.length > 0 && formData.peopleCount && (
          <div className="space-y-2">
            <Label>Preço Calculado</Label>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                R$ {calculateTotal().toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {formData.peopleCount} pessoa{(formData.peopleCount as number) > 1 ? 's' : ''} × R$ {calculateCartTotal().toFixed(2)}/pessoa
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>
          Voltar
        </Button>
        <Button 
          onClick={() => setStep(3)}
          disabled={shoppingCart.length === 0 || !formData.peopleCount}
          className={shoppingCart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              min={(() => {
                const now = new Date()
                const year = now.getFullYear()
                const month = String(now.getMonth() + 1).padStart(2, '0')
                const day = String(now.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
              })()}
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Turno *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.shift === shift.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('shift', shift.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{shift.icon}</span>
                    <div>
                      <div className="font-medium">{shift.name}</div>
                      <div className="text-sm text-gray-600">{shift.start} - {shift.end}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {formData.shift && (
            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlotsByShift[formData.shift as keyof typeof timeSlotsByShift]?.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
          disabled={!formData.date || !formData.shift || !formData.time}
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
              <div className="flex justify-between items-start">
                <span className="font-medium">Cardápio Selecionado:</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {shoppingCart.length} categoria(s) com {getTotalItemsInCart()} item(s)
                  </div>
                </div>
              </div>
              {shoppingCart.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="font-medium">Itens da Cesta:</span>
                  <div className="text-right max-w-xs">
                    {shoppingCart.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {item.name} ({item.category}) - Qtd: {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Pessoas:</span>
                <span>{formData.peopleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Data:</span>
                <span>{new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Turno:</span>
                <span className="flex items-center space-x-2">
                  <span>{shifts.find(s => s.id === formData.shift)?.icon}</span>
                  <span>{shifts.find(s => s.id === formData.shift)?.name}</span>
                </span>
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
                {formData.plan === '1' && (
                  <div className="text-sm text-gray-600 mt-2">
                    {formData.peopleCount} pessoa{(formData.peopleCount as number) > 1 ? 's' : ''} × R$ {menus.find(m => m.id === formData.menu)?.price}/pessoa
                  </div>
                )}
                {formData.plan !== '1' && (() => {
                  const plan = plans.find(p => p.id === formData.plan)
                  return plan?.discount && plan.discount > 0 ? (
                  <div className="text-sm text-green-600 mt-2">
                      {plan.discount}% de desconto aplicado
                  </div>
                  ) : null
                })()}
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

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      <Dialog open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Selecione os Itens do Cardápio</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenuModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <div className="text-sm text-gray-600 mt-2">
              Selecione os itens desejados desta categoria. Eles serão adicionados à sua cesta de compras.
            </div>
          </DialogHeader>
          
          {selectedMenuCategory && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  {selectedMenuCategory.name}
                </h3>
                <p className="text-orange-700 text-sm">
                  {selectedMenuCategory.description}
                </p>
                <div className="mt-2 text-orange-800 font-medium">
                  R$ {selectedMenuCategory.price}/pessoa
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Selecione os itens desejados:
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMenuCategory.subOptions.map((item: string) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={selectedMenuItems.includes(item)}
                        onCheckedChange={() => handleMenuItemToggle(item)}
                      />
                      <Label
                        htmlFor={item}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={closeMenuModal}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmMenuSelection}
              disabled={selectedMenuItems.length === 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Adicionar à Cesta ({selectedMenuItems.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
