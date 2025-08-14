"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChefHat } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    address: '',
    dietaryPreferences: '',
    specialties: '',
    experience: '',
    bio: '',
    hourlyRate: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Função para verificar se o email já existe
  const checkEmailAvailability = async (email: string) => {
    if (!email || email.length < 5) return true // Email muito curto, não verificar
    
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.available
      }
      return true // Em caso de erro, assumir que está disponível
    } catch (error) {
      return true // Em caso de erro, assumir que está disponível
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    // Validação adicional: verificar se todos os campos obrigatórios estão preenchidos
    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.phone || !formData.address) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso! Faça login para continuar.",
        })
        router.push('/auth/login')
      } else {
        const error = await response.json()
        
        // Mensagem mais específica para email já existente
        if (error.message === 'Este email já está em uso') {
          toast({
            title: "Email já cadastrado",
            description: (
              <div>
                Este email já está sendo usado. 
                <br />
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Clique aqui para fazer login
                </Link>
                <br />
                Ou use um email diferente.
              </div>
            ),
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro",
            description: error.message || "Erro ao criar conta",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a conta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ChefHat className="h-12 w-12 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Cadastre-se para começar a usar nossos serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleInputChange('email', e.target.value)
                        // Verificar disponibilidade do email após um delay
                        if (e.target.value.length > 5) {
                          setEmailStatus('checking')
                          setTimeout(async () => {
                            const available = await checkEmailAvailability(e.target.value)
                            setEmailStatus(available ? 'available' : 'unavailable')
                          }, 500)
                        } else {
                          setEmailStatus('idle')
                        }
                      }}
                      required
                      className={emailStatus === 'unavailable' ? 'border-red-500' : 
                               emailStatus === 'available' ? 'border-green-500' : ''}
                    />
                    {emailStatus === 'checking' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    {emailStatus === 'available' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                        ✓
                      </div>
                    )}
                    {emailStatus === 'unavailable' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600">
                        ✗
                      </div>
                    )}
                  </div>
                  {emailStatus === 'unavailable' && (
                    <p className="text-sm text-red-600">
                      Este email já está em uso. 
                      <Link href="/auth/login" className="text-blue-600 hover:underline ml-1">
                        Faça login
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Conta *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="CHEF">Cozinheira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
              </div>

              {formData.role === 'CLIENT' && (
                <div className="space-y-2">
                  <Label htmlFor="dietaryPreferences">Preferências Alimentares</Label>
                  <Input
                    id="dietaryPreferences"
                    placeholder="Ex: Vegetariano, Sem glúten, etc."
                    value={formData.dietaryPreferences}
                    onChange={(e) => handleInputChange('dietaryPreferences', e.target.value)}
                  />
                </div>
              )}

              {formData.role === 'CHEF' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Especialidades *</Label>
                    <Input
                      id="specialties"
                      placeholder="Ex: Culinária italiana, Doces, etc."
                      value={formData.specialties}
                      onChange={(e) => handleInputChange('specialties', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Anos de Experiência *</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="0"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Taxa por Hora (R$) *</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Input
                      id="bio"
                      placeholder="Conte um pouco sobre você e sua experiência..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || emailStatus === 'unavailable' || emailStatus === 'checking'}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
              
              {emailStatus === 'unavailable' && (
                <p className="text-sm text-red-600 text-center">
                  ⚠️ Não é possível criar a conta com este email. Use um email diferente ou faça login.
                </p>
              )}
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-orange-600 hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
