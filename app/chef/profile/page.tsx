"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ChefHat, User, MapPin, Phone, Mail, Star, Edit, Save, X, Plus, Trash2, Clock, Sun, Moon } from 'lucide-react'

interface Shift {
  id: 'morning' | 'afternoon'
  name: string
  start: string
  end: string
  available: boolean
  icon: React.ReactNode
}

interface DayAvailability {
  day: string
  dayName: string
  shifts: {
    morning: Shift
    afternoon: Shift
  }
}

interface FoodCategory {
  id: string
  name: string
  options: string[]
}

interface ChefProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  bio: string
  foodCategories: FoodCategory[]
  experience: number
  rating: number
  totalBookings: number
  hourlyRate: number
  availability: {
    monday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    tuesday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    wednesday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    thursday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    friday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    saturday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
    sunday: { morning: { start: string; end: string; available: boolean }; afternoon: { start: string; end: string; available: boolean } }
  }
}

const mockProfile: ChefProfile = {
  id: '1',
  name: 'Maria Costa',
  email: 'maria@chef.com',
  phone: '(11) 99999-9999',
  address: 'Rua das Flores, 123 - São Paulo, SP',
  bio: 'Chef profissional com mais de 10 anos de experiência em culinária internacional. Especializada em culinárias variadas e apaixonada por criar experiências gastronômicas únicas e memoráveis.',
  foodCategories: [
    {
      id: 'carne-bovina',
      name: 'CARNE BOVINA',
      options: ['Assado de panela', 'Cozidão', 'Carne frita', 'Churrasco', 'Estrogonofe', 'Filé ao molho', 'Carne assada']
    },
    {
      id: 'aves',
      name: 'AVES',
      options: ['Frango assado', 'Frango grelhado', 'Frango ao molho', 'Peru assado', 'Pato assado', 'Frango frito', 'Frango cozido']
    },
    {
      id: 'carne-suina',
      name: 'CARNE SUÍNA',
      options: ['Porco assado', 'Lombo assado', 'Costela assada', 'Carne de porco grelhada', 'Porco ao molho', 'Lombo grelhado']
    },
    {
      id: 'peixes-frutos-mar',
      name: 'PEIXES E FRUTOS DO MAR',
      options: ['Salmão grelhado', 'Atum grelhado', 'Bacalhau assado', 'Camarão grelhado', 'Peixe frito', 'Peixe ao molho', 'Mariscos']
    },
    {
      id: 'sobremesas',
      name: 'SOBREMESAS',
      options: ['Bolo de chocolate', 'Torta de limão', 'Pudim', 'Sorvete caseiro', 'Mousse', 'Tiramisu', 'Cheesecake']
    },
    {
      id: 'saladas',
      name: 'SALADAS',
      options: ['Salada verde', 'Salada de frutas', 'Salada de grãos', 'Salada de legumes', 'Salada de massas', 'Salada de quinoa']
    },
    {
      id: 'outras',
      name: 'OUTRAS',
      options: ['Massas', 'Risotos', 'Sopas', 'Pães caseiros', 'Molhos especiais', 'Conservas caseiras']
    }
  ],
  experience: 12,
  rating: 4.8,
  totalBookings: 156,
  hourlyRate: 80,
  availability: {
    monday: { 
      morning: { start: '08:00', end: '12:00', available: true }, 
      afternoon: { start: '14:00', end: '18:00', available: true } 
    },
    tuesday: { 
      morning: { start: '08:00', end: '12:00', available: true }, 
      afternoon: { start: '14:00', end: '18:00', available: true } 
    },
    wednesday: { 
      morning: { start: '08:00', end: '12:00', available: true }, 
      afternoon: { start: '14:00', end: '18:00', available: true } 
    },
    thursday: { 
      morning: { start: '08:00', end: '12:00', available: true }, 
      afternoon: { start: '14:00', end: '18:00', available: true } 
    },
    friday: { 
      morning: { start: '08:00', end: '12:00', available: true }, 
      afternoon: { start: '14:00', end: '18:00', available: true } 
    },
    saturday: { 
      morning: { start: '09:00', end: '13:00', available: true }, 
      afternoon: { start: '15:00', end: '19:00', available: false } 
    },
    sunday: { 
      morning: { start: '10:00', end: '14:00', available: false }, 
      afternoon: { start: '16:00', end: '20:00', available: false } 
    }
  }
}

export default function ChefProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<ChefProfile>(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<ChefProfile>(mockProfile)
  const [newFoodOption, setNewFoodOption] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const shifts: { [key: string]: Shift } = {
    morning: {
      id: 'morning',
      name: 'MANHÃ',
      start: '08:00',
      end: '12:00',
      available: true,
      icon: <Sun className="h-4 w-4 text-yellow-500" />
    },
    afternoon: {
      id: 'afternoon',
      name: 'TARDE',
      start: '14:00',
      end: '18:00',
      available: true,
      icon: <Moon className="h-4 w-4 text-blue-500" />
    }
  }

  const daysOfWeek: DayAvailability[] = [
    { day: 'monday', dayName: 'Segunda-feira', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'tuesday', dayName: 'Terça-feira', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'wednesday', dayName: 'Quarta-feira', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'thursday', dayName: 'Quinta-feira', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'friday', dayName: 'Sexta-feira', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'saturday', dayName: 'Sábado', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } },
    { day: 'sunday', dayName: 'Domingo', shifts: { morning: shifts.morning, afternoon: shifts.afternoon } }
  ]

  const handleEdit = () => {
    setEditData({ ...profile })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({ ...profile })
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      // Simular salvamento no banco de dados
      setProfile(editData)
      setIsEditing(false)
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof ChefProfile, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }



  const handleFoodOptionAdd = (categoryId: string) => {
    if (newFoodOption.trim()) {
      setEditData(prev => ({
        ...prev,
        foodCategories: prev.foodCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, options: [...cat.options, newFoodOption.trim()] }
            : cat
        )
      }))
      setNewFoodOption('')
    }
  }

  const handleFoodOptionRemove = (categoryId: string, option: string) => {
    setEditData(prev => ({
      ...prev,
      foodCategories: prev.foodCategories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, options: cat.options.filter(opt => opt !== option) }
          : cat
      )
    }))
  }

  const handleAvailabilityChange = (day: string, shift: 'morning' | 'afternoon', field: 'start' | 'end' | 'available', value: any) => {
    setEditData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [shift]: {
            ...prev.availability[day as keyof typeof prev.availability][shift],
            [field]: value
          }
        }
      }
    }))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getShiftStatus = (day: string, shift: 'morning' | 'afternoon') => {
    const dayAvailability = editData.availability[day as keyof typeof editData.availability]
    const shiftData = dayAvailability[shift]
    
    if (!shiftData.available) {
      return { status: 'Indisponível', className: 'text-gray-500', bgColor: 'bg-gray-100' }
    }
    
    return { 
      status: `${shiftData.start} - ${shiftData.end}`, 
      className: 'text-green-600', 
      bgColor: 'bg-green-50' 
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações e preferências</p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Suas informações básicas e de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.address}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
              />
            ) : (
              <p className="text-gray-700">{profile.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChefHat className="h-5 w-5 mr-2" />
            Informações Profissionais
          </CardTitle>
          <CardDescription>
            Suas categorias de alimentos e experiência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Anos de Experiência</Label>
              {isEditing ? (
                <Input
                  id="experience"
                  type="number"
                  value={editData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.experience} anos</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Taxa por Hora</Label>
              {isEditing ? (
                <Input
                  id="hourlyRate"
                  type="number"
                  value={editData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value))}
                />
              ) : (
                <p className="text-gray-900 font-medium">{formatCurrency(profile.hourlyRate)}/hora</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Avaliação Média</Label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(profile.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-900 font-medium">{profile.rating}</span>
              </div>
            </div>
          </div>
          


          <div className="space-y-4">
            <Label>Categorias de Alimentos</Label>
            {isEditing ? (
              <div className="space-y-4">
                {editData.foodCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                      >
                        {selectedCategory === category.id ? 'Fechar' : 'Editar Opções'}
                      </Button>
                    </div>
                    
                    {selectedCategory === category.id && (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Nova opção de alimento"
                            value={newFoodOption}
                            onChange={(e) => setNewFoodOption(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleFoodOptionAdd(category.id)}
                          />
                          <Button 
                            onClick={() => handleFoodOptionAdd(category.id)} 
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.options.map((option) => (
                            <Badge key={option} variant="outline" className="flex items-center space-x-1">
                              {option}
                              <button
                                onClick={() => handleFoodOptionRemove(category.id, option)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedCategory !== category.id && (
                      <div className="flex flex-wrap gap-2">
                        {category.options.slice(0, 3).map((option) => (
                          <Badge key={option} variant="secondary" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                        {category.options.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{category.options.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.foodCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{category.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.options.map((option) => (
                        <Badge key={option} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Disponibilidade por Turnos
          </CardTitle>
          <CardDescription>
            Configure seus horários de trabalho por turno (MANHÃ e TARDE). 
            Cada turno permite apenas 1 agendamento por dia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {daysOfWeek.map(({ day, dayName, shifts }) => (
              <div key={day} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">{dayName}</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Turno da Manhã */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {shifts.morning.icon}
                      <span className="font-medium text-gray-700">Turno da MANHÃ</span>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editData.availability[day as keyof typeof editData.availability].morning.available}
                            onChange={(e) => handleAvailabilityChange(day, 'morning', 'available', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Disponível</span>
                        </div>
                        
                        {editData.availability[day as keyof typeof editData.availability].morning.available && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Início</Label>
                              <Input
                                type="time"
                                value={editData.availability[day as keyof typeof editData.availability].morning.start}
                                onChange={(e) => handleAvailabilityChange(day, 'morning', 'start', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fim</Label>
                              <Input
                                type="time"
                                value={editData.availability[day as keyof typeof editData.availability].morning.end}
                                onChange={(e) => handleAvailabilityChange(day, 'morning', 'end', e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`p-3 rounded-lg ${getShiftStatus(day, 'morning').bgColor}`}>
                        <span className={`text-sm font-medium ${getShiftStatus(day, 'morning').className}`}>
                          {getShiftStatus(day, 'morning').status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Turno da Tarde */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {shifts.afternoon.icon}
                      <span className="font-medium text-gray-700">Turno da TARDE</span>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editData.availability[day as keyof typeof editData.availability].afternoon.available}
                            onChange={(e) => handleAvailabilityChange(day, 'afternoon', 'available', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Disponível</span>
                        </div>
                        
                        {editData.availability[day as keyof typeof editData.availability].afternoon.available && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Início</Label>
                              <Input
                                type="time"
                                value={editData.availability[day as keyof typeof editData.availability].afternoon.start}
                                onChange={(e) => handleAvailabilityChange(day, 'afternoon', 'start', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Fim</Label>
                              <Input
                                type="time"
                                value={editData.availability[day as keyof typeof editData.availability].afternoon.end}
                                onChange={(e) => handleAvailabilityChange(day, 'afternoon', 'end', e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`p-3 rounded-lg ${getShiftStatus(day, 'afternoon').bgColor}`}>
                        <span className={`text-sm font-medium ${getShiftStatus(day, 'afternoon').className}`}>
                          {getShiftStatus(day, 'afternoon').status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Regra de Negócio */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Regra:</strong> Cada turno permite apenas 1 agendamento por dia. 
                    Clientes não podem marcar no mesmo turno simultaneamente.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
          <CardDescription>
            Resumo da sua atividade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{profile.totalBookings}</div>
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{profile.rating}</div>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{profile.experience}</div>
              <p className="text-sm text-gray-600">Anos de Experiência</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
