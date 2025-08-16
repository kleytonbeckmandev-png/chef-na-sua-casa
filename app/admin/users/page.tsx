"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Users, UserPlus, Edit, Trash2, Search, Filter } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CLIENT' | 'CHEF'
  createdAt: string
  status: 'ACTIVE' | 'INACTIVE'
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@teste.com',
    role: 'ADMIN',
    createdAt: '2024-01-01',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'Cliente Teste',
    email: 'cliente@teste.com',
    role: 'CLIENT',
    createdAt: '2024-01-02',
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Chef Maria Costa',
    email: 'chef@teste.com',
    role: 'CHEF',
    createdAt: '2024-01-03',
    status: 'ACTIVE'
  }
]

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular carregamento de usuários
    try {
      setTimeout(() => {
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setIsLoading(false)
        setError(null)
      }, 1000)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setError('Erro ao carregar usuários')
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Filtrar usuários baseado na busca e filtro de role
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'ADMIN': { label: 'Administrador', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'CLIENT': { label: 'Cliente', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'CHEF': { label: 'Chef', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.CLIENT
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ACTIVE': { label: 'Ativo', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'INACTIVE': { label: 'Inativo', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar usuários</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600">Gerencie todos os usuários da plataforma</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar usuários</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="role-filter">Filtrar por função</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todas as funções" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as funções</SelectItem>
                  <SelectItem value="ADMIN">Administradores</SelectItem>
                  <SelectItem value="CLIENT">Clientes</SelectItem>
                  <SelectItem value="CHEF">Chefs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'ADMIN').length}</div>
            <div className="text-sm text-gray-600">Administradores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{users.filter(u => u.role === 'CLIENT').length}</div>
            <div className="text-sm text-gray-600">Clientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'CHEF').length}</div>
            <div className="text-sm text-gray-600">Chefs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Lista completa de usuários cadastrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Criado em</p>
                    <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'ALL' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Não há usuários cadastrados ainda.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
