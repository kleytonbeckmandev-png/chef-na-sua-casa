"use client"

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, MapPin, Phone, UtensilsCrossed, Save, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ClientProfile {
  id: string
  userId: string
  dietaryPreferences: string
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

export default function ClientProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dietaryPreferences: ''
  })

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      // Simular dados do perfil (em produção, isso viria da API)
      const mockProfile: ClientProfile = {
        id: 'profile-1',
        userId: 'user-1',
        dietaryPreferences: 'Vegetariano, Sem glúten',
        address: 'Res. Portal do Paço 3 - Rua 31 Quadra 15',
        phone: '98981302035',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setProfile(mockProfile)
      setFormData({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: mockProfile.phone,
        address: mockProfile.address,
        dietaryPreferences: mockProfile.dietaryPreferences
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Simular salvamento (em produção, isso seria uma chamada para a API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas informações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Restaurar dados originais
    if (profile) {
      setFormData({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: profile.phone,
        address: profile.address,
        dietaryPreferences: profile.dietaryPreferences
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e preferências</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <span>Informações Pessoais</span>
            </CardTitle>
            <CardDescription>
              Dados básicos da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-orange-600" />
              <span>Informações de Contato</span>
            </CardTitle>
            <CardDescription>
              Como podemos entrar em contato com você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências Alimentares */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
              <span>Preferências Alimentares</span>
            </CardTitle>
            <CardDescription>
              Informe suas restrições ou preferências alimentares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="dietaryPreferences">Preferências</Label>
              <Input
                id="dietaryPreferences"
                value={formData.dietaryPreferences}
                onChange={(e) => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                disabled={!isEditing}
                placeholder="Ex: Vegetariano, Sem glúten, Sem lactose, etc."
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Essas informações ajudam nossos chefs a preparar refeições adequadas para você
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Conta</CardTitle>
          <CardDescription>
            Resumo das suas atividades na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">Agendamentos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Chefs Experimentados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
