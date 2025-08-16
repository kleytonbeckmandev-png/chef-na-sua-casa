export interface ShiftAvailability {
  start: string
  end: string
  available: boolean
}

export interface DayAvailability {
  morning: ShiftAvailability
  afternoon: ShiftAvailability
}

export interface ChefAvailability {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

export interface Booking {
  id: string
  date: string
  shift: 'morning' | 'afternoon'
  startTime: string
  endTime: string
  clientId: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
}

/**
 * Verifica se um turno específico está disponível para agendamento
 * @param date - Data no formato YYYY-MM-DD
 * @param shift - Turno (morning ou afternoon)
 * @param chefAvailability - Disponibilidade configurada do chef
 * @param existingBookings - Agendamentos existentes
 * @returns Objeto com disponibilidade e detalhes
 */
export function checkShiftAvailability(
  date: string,
  shift: 'morning' | 'afternoon',
  chefAvailability: ChefAvailability,
  existingBookings: Booking[]
): {
  available: boolean
  reason?: string
  shiftInfo?: ShiftAvailability
} {
  try {
    // Obter o dia da semana (0 = domingo, 1 = segunda, etc.)
    const dayOfWeek = new Date(date).getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek] as keyof ChefAvailability
    
    // Verificar se o chef está disponível neste dia e turno
    const dayAvailability = chefAvailability[dayName]
    if (!dayAvailability) {
      return { available: false, reason: 'Dia não configurado na disponibilidade' }
    }
    
    const shiftAvailability = dayAvailability[shift]
    if (!shiftAvailability.available) {
      return { available: false, reason: 'Turno não disponível' }
    }
    
    // Verificar se já existe um agendamento para este turno nesta data
    const conflictingBooking = existingBookings.find(booking => 
      booking.date === date && 
      booking.shift === shift && 
      ['CONFIRMED', 'PENDING'].includes(booking.status)
    )
    
    if (conflictingBooking) {
      return { 
        available: false, 
        reason: 'Turno já possui agendamento confirmado ou pendente',
        shiftInfo: shiftAvailability
      }
    }
    
    // Verificar se o horário solicitado está dentro do turno disponível
    const requestedStart = new Date(`2000-01-01T${shiftAvailability.start}`)
    const requestedEnd = new Date(`2000-01-01T${shiftAvailability.end}`)
    
    // Por enquanto, aceitamos qualquer horário dentro do turno
    // Futuramente podemos implementar validação mais específica
    
    return { 
      available: true, 
      shiftInfo: shiftAvailability
    }
    
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return { available: false, reason: 'Erro interno ao verificar disponibilidade' }
  }
}

/**
 * Obtém todos os turnos disponíveis para uma data específica
 * @param date - Data no formato YYYY-MM-DD
 * @param chefAvailability - Disponibilidade configurada do chef
 * @param existingBookings - Agendamentos existentes
 * @returns Array de turnos disponíveis
 */
export function getAvailableShifts(
  date: string,
  chefAvailability: ChefAvailability,
  existingBookings: Booking[]
): Array<{
  shift: 'morning' | 'afternoon'
  name: string
  start: string
  end: string
  available: boolean
}> {
  try {
    const dayOfWeek = new Date(date).getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek] as keyof ChefAvailability
    
    const dayAvailability = chefAvailability[dayName]
    if (!dayAvailability) {
      return []
    }
    
    const shifts = [
      { 
        shift: 'morning' as const, 
        name: 'MANHÃ',
        ...dayAvailability.morning 
      },
      { 
        shift: 'afternoon' as const, 
        name: 'TARDE',
        ...dayAvailability.afternoon 
      }
    ]
    
    // Filtrar apenas turnos disponíveis e sem conflitos
    return shifts.filter(shift => {
      if (!shift.available) return false
      
      const conflictingBooking = existingBookings.find(booking => 
        booking.date === date && 
        booking.shift === shift.shift && 
        ['CONFIRMED', 'PENDING'].includes(booking.status)
      )
      
      return !conflictingBooking
    })
    
  } catch (error) {
    console.error('Erro ao obter turnos disponíveis:', error)
    return []
  }
}

/**
 * Valida se um horário específico está dentro de um turno
 * @param time - Horário no formato HH:MM
 * @param shiftStart - Início do turno
 * @param shiftEnd - Fim do turno
 * @returns true se o horário está dentro do turno
 */
export function isTimeInShift(time: string, shiftStart: string, shiftEnd: string): boolean {
  try {
    const requestedTime = new Date(`2000-01-01T${time}`)
    const start = new Date(`2000-01-01T${shiftStart}`)
    const end = new Date(`2000-01-01T${shiftEnd}`)
    
    return requestedTime >= start && requestedTime <= end
  } catch (error) {
    console.error('Erro ao validar horário:', error)
    return false
  }
}

/**
 * Obtém o nome do dia da semana em português
 * @param dayName - Nome do dia em inglês
 * @returns Nome do dia em português
 */
export function getDayNameInPortuguese(dayName: string): string {
  const dayNames: { [key: string]: string } = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  }
  
  return dayNames[dayName] || dayName
}

/**
 * Obtém o nome do turno em português
 * @param shift - Identificador do turno
 * @returns Nome do turno em português
 */
export function getShiftNameInPortuguese(shift: 'morning' | 'afternoon'): string {
  const shiftNames = {
    morning: 'MANHÃ',
    afternoon: 'TARDE'
  }
  
  return shiftNames[shift]
}
