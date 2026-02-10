export interface ParsedAppointment {
  patient?: string
  date?: string
  time?: string
  duration?: number
  reason?: string
  clinic?: string
  service?: string
  isAmbiguous: boolean
  ambiguities?: string[]
  suggestions?: string[]
  missingFields: string[]
  followUpPrompt?: string
}
const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]
const daysOfWeek = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
]

const patientTriggers = [
  'agendar a',
  'agenda a',
  'agéndame a',
  'cita para',
  'paciente',
  'cliente',
  'con el paciente',
  'con la paciente',
  'para',
  'con',
  'pon una cita con',
]

const stopWords = [
  'mañana',
  'hoy',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
  'el',
  'la',
  'los',
  'las',
  'a',
  'de',
  'en',
  'por',
  'con',
  'en la',
  'por la',
]

const reasonTriggers = [
  'motivo',
  'razón',
  'por',
  'debido a',
  'para',
  'consulta de',
]

const forbidden = [
  'mañana',
  'hoy',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
  'en la tarde',
  'en la mañana',
]

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function extractDate(lowercase: string): string {
  if (lowercase.includes('mañana')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (lowercase.includes('hoy')) {
    return new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Check for specific days of week
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lowercase.includes(daysOfWeek[i])) {
      const d = new Date()
      const currentDay = d.getDay()
      const targetDay = i
      let diff = targetDay - currentDay
      if (diff <= 0) diff += 7
      d.setDate(d.getDate() + diff)
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
  }

  const dateMatch = lowercase.match(/(\d{1,2})\s+de\s+([a-z]+)/)
  if (dateMatch) {
    const day = parseInt(dateMatch[1])
    const monthName = dateMatch[2]
    const monthIndex = months.findIndex((m) => m.startsWith(monthName))
    if (monthIndex !== -1) {
      const d = new Date()
      d.setMonth(monthIndex)
      d.setDate(day)
      if (d < new Date()) d.setFullYear(d.getFullYear() + 1)
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
  }

  return ''
}

function extractTime(lowercase: string): {
  time: string
  isAmbiguous: boolean
  ambiguity?: string
} {
  const timeRegex =
    /(?:a las |las |a la |la )?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i
  const timeMatch = lowercase.match(timeRegex)

  if (timeMatch) {
    const hour = parseInt(timeMatch[1])
    const minutes = timeMatch[2] || '00'
    const period = timeMatch[3]?.toLowerCase()
    const isAmbiguous = !period && hour > 0 && hour <= 12

    return {
      time: `${hour}:${minutes} ${period || ''}`.trim(),
      isAmbiguous,
      ambiguity: isAmbiguous ? 'period' : undefined,
    }
  }

  return { time: '', isAmbiguous: false }
}

function extractPatient(lowercase: string): string {
  for (const trigger of patientTriggers) {
    if (lowercase.includes(trigger + ' ')) {
      const afterTrigger = lowercase.split(trigger + ' ')[1]
      const nameMatch = afterTrigger.match(/^([a-zñáéíóúü]+\s?){1,3}/i)
      if (nameMatch) {
        const potentialName = nameMatch[0].trim()
        const firstWord = potentialName.split(' ')[0]
        if (!stopWords.includes(firstWord) && potentialName.length > 2) {
          return capitalize(potentialName)
        }
      }
    }
  }

  if (
    lowercase.includes('bloquéame') ||
    lowercase.includes('bloqueame') ||
    lowercase.includes('bloquear')
  ) {
    return 'Bloqueo de Agenda'
  }

  return ''
}

function extractDuration(lowercase: string): number {
  if (lowercase.includes('una hora') || lowercase.includes('1 hora')) return 60
  if (lowercase.includes('media hora') || lowercase.includes('30 minutos'))
    return 30

  const durationMatch = lowercase.match(/(\d+)\s*minutos/)
  return durationMatch ? parseInt(durationMatch[1]) : 30
}

function extractReason(lowercase: string, currentPatient: string): string {
  if (currentPatient === 'Bloqueo de Agenda') return 'Indisponible / Reunión'

  for (const trigger of reasonTriggers) {
    if (lowercase.includes(trigger + ' ')) {
      const parts = lowercase.split(trigger + ' ')
      const possibleReason = parts[parts.length - 1].trim()

      if (
        possibleReason &&
        !forbidden.some((f) => possibleReason.includes(f)) &&
        possibleReason.length > 2
      ) {
        return capitalize(possibleReason.split(',')[0].split('.')[0])
      }
    }
  }
  return ''
}

export function parseVoiceCommand(text: string): ParsedAppointment {
  const lowercase = text.toLowerCase()
  const result: ParsedAppointment = {
    isAmbiguous: false,
    ambiguities: [],
    suggestions: [],
    missingFields: [],
  }

  result.date = extractDate(lowercase)
  const timeInfo = extractTime(lowercase)
  result.time = timeInfo.time
  if (timeInfo.isAmbiguous) {
    result.isAmbiguous = true
    result.ambiguities?.push(timeInfo.ambiguity!)
  }

  result.patient = extractPatient(lowercase)
  result.duration = extractDuration(lowercase)
  result.reason = extractReason(lowercase, result.patient!)

  // Contextual Ambiguities (Afternoon/Morning)
  if (lowercase.includes('en la tarde') || lowercase.includes('por la tarde')) {
    result.isAmbiguous = true
    if (!result.ambiguities?.includes('time_slot')) {
      result.ambiguities?.push('time_slot')
      result.suggestions = ['3:00 PM', '4:00 PM', '5:00 PM']
    }
  } else if (
    lowercase.includes('en la mañana') ||
    lowercase.includes('por la mañana')
  ) {
    result.isAmbiguous = true
    if (!result.ambiguities?.includes('time_slot')) {
      result.ambiguities?.push('time_slot')
      result.suggestions = ['9:00 AM', '10:00 AM', '11:00 AM']
    }
  }

  if (!result.patient) result.missingFields.push('patient')
  if (!result.date) result.missingFields.push('date')
  if (!result.time && !result.ambiguities?.includes('time_slot')) {
    result.missingFields.push('time')
  }
  if (!result.reason) result.missingFields.push('reason')

  if (result.missingFields.length > 0) {
    const fieldMap: Record<string, string> = {
      patient: 'el nombre del paciente',
      date: 'la fecha',
      time: 'la hora',
      reason: 'el motivo',
    }
    const missing = result.missingFields.map((f) => fieldMap[f])
    if (missing.length === 1) {
      result.followUpPrompt = `Necesito completar un dato: me falta ${missing[0]}.`
    } else {
      const last = missing.pop()
      result.followUpPrompt = `Necesito completar algunos datos: me falta ${missing.join(', ')} y ${last}.`
    }
  }

  return result
}
