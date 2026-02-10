export type Intent = 'create' | 'edit'

export interface ParsedAppointment {
  patient?: string
  date?: string
  time?: string
  sourceTime?: string
  duration?: number
  reason?: string
  clinic?: string
  service?: string
  intent: Intent
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
  if (
    lowercase.includes('pasado mañana') ||
    lowercase.includes('pasado mañana')
  ) {
    const day = new Date()
    day.setDate(day.getDate() + 2)
    return day.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (lowercase.includes('mañana')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (lowercase.includes('hoy')) {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
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
        weekday: 'long',
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
        weekday: 'long',
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
    /(?:a las |las |a la |la )?(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.|de la mañana|de la tarde|de la noche)?/i
  const timeMatch = lowercase.match(timeRegex)

  if (timeMatch) {
    const hour = parseInt(timeMatch[1])
    const minutes = timeMatch[2] || '00'
    let rawPeriod = timeMatch[3]?.toLowerCase()
    let period: 'am' | 'pm' | undefined = undefined

    if (rawPeriod) {
      if (
        rawPeriod.includes('p') ||
        rawPeriod.includes('tarde') ||
        rawPeriod.includes('noche')
      )
        period = 'pm'
      if (rawPeriod.includes('a') || rawPeriod.includes('mañana')) period = 'am'
    }

    const isAmbiguous = !rawPeriod && hour >= 7 && hour <= 12

    // Only apply the smart default period if it's NOT ambiguous
    if (!period && !isAmbiguous) {
      if (hour >= 7 && hour <= 11) period = 'am'
      else if (hour === 12 || (hour >= 1 && hour <= 6)) period = 'pm'
    }

    const timeString = isAmbiguous
      ? `${hour}:${minutes}`
      : `${hour}:${minutes} ${period || ''}`

    return {
      time: timeString.trim().toUpperCase(),
      isAmbiguous,
      ambiguity: isAmbiguous ? 'period' : undefined,
    }
  }

  if (lowercase.includes('mediodía') || lowercase.includes('mediodia')) {
    return { time: '12:00 PM', isAmbiguous: false }
  }

  return { time: '', isAmbiguous: false }
}

function extractPatient(lowercase: string): string {
  for (const trigger of patientTriggers) {
    if (lowercase.includes(trigger + ' ')) {
      const afterTrigger = lowercase.split(trigger + ' ')[1]
      const nameMatch = afterTrigger.match(/^([a-zñáéíóúü]+\s?){1,3}/i)
      if (nameMatch) {
        let potentialName = nameMatch[0].trim()
        let words = potentialName.split(/\s+/)
        while (
          words.length > 0 &&
          stopWords.includes(words[words.length - 1].toLowerCase())
        ) {
          words.pop()
        }
        potentialName = words.join(' ')

        const firstWord = potentialName.split(' ')[0]
        if (
          !stopWords.includes(firstWord.toLowerCase()) &&
          potentialName.length > 2
        ) {
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
  const intent: Intent =
    lowercase.includes('mueve') ||
    lowercase.includes('cambia') ||
    lowercase.includes('reprograma') ||
    lowercase.includes('edita') ||
    lowercase.includes('modifica') ||
    lowercase.includes('pasala') ||
    lowercase.includes('pásala')
      ? 'edit'
      : 'create'

  const result: ParsedAppointment = {
    intent,
    isAmbiguous: false,
    ambiguities: [],
    suggestions: [],
    missingFields: [],
  }

  if (intent === 'edit') {
    const movePattern =
      /(?:de\s+las?|desde\s+las?|la\s+de\s+las?|la\s+cita\s+de\s+las?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|de\s+la\s+mañana|de\s+la\s+tarde|de\s+la\s+noche)?)\s+(?:a\s+las?|para\s+las?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|de\s+la\s+mañana|de\s+la\s+tarde|de\s+la\s+noche)?)/i
    const moveMatch = text.match(movePattern)

    if (moveMatch) {
      const sourceInfo = extractTime(moveMatch[1])
      const targetInfo = extractTime(moveMatch[2])
      result.sourceTime = sourceInfo.time
      result.time = targetInfo.time
      result.isAmbiguous = sourceInfo.isAmbiguous || targetInfo.isAmbiguous

      if (sourceInfo.ambiguity) result.ambiguities?.push(sourceInfo.ambiguity)
      if (targetInfo.ambiguity) result.ambiguities?.push(targetInfo.ambiguity)
    } else {
      // Fallback: try to find two times if the sentence is simple "8 a 9"
      const times = lowercase.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi)
      if (times && times.length >= 2) {
        const sourceInfo = extractTime(times[0])
        const targetInfo = extractTime(times[1])
        result.sourceTime = sourceInfo.time
        result.time = targetInfo.time
        result.isAmbiguous = sourceInfo.isAmbiguous || targetInfo.isAmbiguous

        if (sourceInfo.ambiguity) result.ambiguities?.push(sourceInfo.ambiguity)
        if (targetInfo.ambiguity) result.ambiguities?.push(targetInfo.ambiguity)
      } else {
        const timeInfo = extractTime(lowercase)
        result.time = timeInfo.time
        result.isAmbiguous = timeInfo.isAmbiguous
        if (timeInfo.ambiguity) result.ambiguities?.push(timeInfo.ambiguity)
      }
    }
  } else {
    const timeInfo = extractTime(lowercase)
    result.time = timeInfo.time
    result.isAmbiguous = timeInfo.isAmbiguous
    if (timeInfo.ambiguity) result.ambiguities?.push(timeInfo.ambiguity)
  }

  result.date = extractDate(lowercase)
  result.patient = extractPatient(lowercase)
  result.duration = extractDuration(lowercase)
  result.reason = extractReason(lowercase, result.patient!)

  // Contextual Ambiguities (Afternoon/Morning)
  if (
    lowercase.includes('en la tarde') ||
    lowercase.includes('por la tarde') ||
    lowercase.includes('tardecita')
  ) {
    result.isAmbiguous = true
    if (!result.ambiguities?.includes('time_slot')) {
      result.ambiguities?.push('time_slot')
      result.suggestions = ['3:00 PM', '4:00 PM', '5:00 PM']
    }
  } else if (
    lowercase.includes('en la mañana') ||
    lowercase.includes('por la mañana') ||
    lowercase.includes('mañanita')
  ) {
    result.isAmbiguous = true
    if (!result.ambiguities?.includes('time_slot')) {
      result.ambiguities?.push('time_slot')
      result.suggestions = ['9:00 AM', '10:00 AM', '11:00 AM']
    }
  }

  if (intent === 'create' && !result.patient)
    result.missingFields.push('patient')
  if (intent === 'create' && !result.date) result.missingFields.push('date')
  if (!result.time && !result.ambiguities?.includes('time_slot')) {
    result.missingFields.push('time')
  }
  if (intent === 'create' && !result.reason) result.missingFields.push('reason')

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
