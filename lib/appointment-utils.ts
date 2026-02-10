import { Appointment, AppointmentData } from '@/types/appointments'
import { ParsedAppointment } from '@/lib/appointment-parsing'
import { CALENDAR_CONFIG } from '@/constants/calendar'

export function mapVoiceDataToAppointment(
  data: ParsedAppointment,
): Partial<Appointment> {
  const result: Partial<Appointment> = {}

  if (data.patient) result.patientName = data.patient
  if (data.clinic) result.clinic = data.clinic
  if (data.service) result.service = data.service

  if (data.time) {
    result.time = `${data.time} - ${data.duration || 30} min`
    result.duration = `${data.duration || 30} min`
    result.height = data.duration || 30

    const [hourStr, ...rest] = data.time.split(':')
    const hour = parseInt(hourStr)
    const minuteStr = rest.join(':')
    const minutes = parseInt(minuteStr.split(' ')[0]) || 0

    // Improved period detection
    const isExplicitPM =
      data.time.toLowerCase().includes('pm') ||
      data.time.toLowerCase().includes('tarde') ||
      data.time.toLowerCase().includes('noche')

    let adjustedHour = hour
    if (isExplicitPM && hour < 12) adjustedHour += 12
    if (!isExplicitPM && hour === 12 && data.time.toLowerCase().includes('am'))
      adjustedHour = 0

    result.top = (adjustedHour - CALENDAR_CONFIG.START_HOUR) * 60 + minutes
  }

  if (data.date) {
    // Handle both ISO YYYY-MM-DD and Spanish day names
    const lowDate = data.date.toLowerCase()
    let dayIndex: number | undefined = undefined

    if (lowDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const d = new Date(data.date + 'T12:00:00')
      dayIndex = d.getDay()
    } else {
      if (lowDate.includes('lunes')) dayIndex = 1
      else if (lowDate.includes('martes')) dayIndex = 2
      else if (lowDate.includes('miércoles') || lowDate.includes('miercoles'))
        dayIndex = 3
      else if (lowDate.includes('jueves')) dayIndex = 4
      else if (lowDate.includes('viernes')) dayIndex = 5
      else if (lowDate.includes('sábado') || lowDate.includes('sabado'))
        dayIndex = 6
      else if (lowDate.includes('domingo')) dayIndex = 0
    }

    result.dayIndex = dayIndex
    result.fullDate = data.date
  }

  return result
}

export function mapFormDataToAppointment(data: AppointmentData): Appointment {
  let dayIndex = 2
  let isoDate = ''

  if (data.date === 'today') {
    const d = new Date()
    dayIndex = d.getDay()
    isoDate = d.toISOString().split('T')[0]
  } else if (data.date === 'tomorrow') {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    dayIndex = d.getDay()
    isoDate = d.toISOString().split('T')[0]
  } else if (!isNaN(parseInt(data.date))) {
    dayIndex = parseInt(data.date)
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const target = new Date(startOfWeek)
    target.setDate(startOfWeek.getDate() + dayIndex)
    isoDate = target.toISOString().split('T')[0]
  } else {
    // Attempt to parse existing ISO or other formats
    try {
      const d = new Date(data.date)
      if (!isNaN(d.getTime())) {
        dayIndex = d.getDay()
        isoDate = d.toISOString().split('T')[0]
      }
    } catch (e) {}
  }

  return {
    id: Math.random().toString(36).slice(2, 9),
    patientName: data.patient || 'Nuevo Paciente',
    time: `${data.time} - ${data.duration} min`,
    duration: `${data.duration} min`,
    dayIndex: dayIndex,
    fullDate: isoDate,
    top: data.time
      ? (parseInt(data.time.split(':')[0]) - CALENDAR_CONFIG.START_HOUR) * 60 +
        parseInt(data.time.split(':')[1])
      : 60,
    height: data.duration,
    clinic: data.clinic,
    service: data.service,
  }
}

export function calculateOverlapGroups(
  appointments: Appointment[],
): Appointment[] {
  const cleaned = appointments.map((a) => ({
    ...a,
    columnIndex: 0,
    totalColumns: 1,
    hasConflict: false,
  }))

  const result: Appointment[] = []
  const days = Array.from(new Set(cleaned.map((a) => a.dayIndex)))

  for (const day of days) {
    const dayApts = cleaned
      .filter((a) => a.dayIndex === day)
      .sort((a, b) => a.top - b.top)

    if (dayApts.length === 0) continue

    const clusters: Appointment[][] = []
    let currentCluster: Appointment[] = []
    let clusterEnd = -1

    for (const apt of dayApts) {
      if (apt.top < clusterEnd) {
        currentCluster.push(apt)
        clusterEnd = Math.max(clusterEnd, apt.top + apt.height)
      } else {
        if (currentCluster.length > 0) clusters.push(currentCluster)
        currentCluster = [apt]
        clusterEnd = apt.top + apt.height
      }
    }
    if (currentCluster.length > 0) clusters.push(currentCluster)

    for (const cluster of clusters) {
      const columns: Appointment[][] = []

      for (const apt of cluster) {
        let placed = false
        for (let i = 0; i < columns.length; i++) {
          const lastInCol = columns[i][columns[i].length - 1]
          // If the appointment starts after the last one in this column ends
          if (apt.top >= lastInCol.top + lastInCol.height) {
            columns[i].push(apt)
            apt.columnIndex = i
            placed = true
            break
          }
        }
        if (!placed) {
          apt.columnIndex = columns.length
          columns.push([apt])
        }
      }

      const totalColumns = columns.length
      for (const apt of cluster) {
        apt.totalColumns = totalColumns
        apt.hasConflict = totalColumns > 1
      }

      result.push(...cluster)
    }
  }

  const apptsWithWork = new Set(result.map((r) => r.id))
  cleaned.forEach((a) => {
    if (!apptsWithWork.has(a.id)) {
      result.push(a)
    }
  })

  return result
}

export function isTimeInRange(time: string): boolean {
  if (!time) return true
  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr)
  const isPM =
    time.toLowerCase().includes('pm') ||
    time.toLowerCase().includes('tarde') ||
    time.toLowerCase().includes('noche')

  let adjustedHour = hour
  if (isPM && hour < 12) adjustedHour += 12
  if (!isPM && hour === 12 && time.toLowerCase().includes('am'))
    adjustedHour = 0

  return (
    adjustedHour >= CALENDAR_CONFIG.START_HOUR &&
    adjustedHour < CALENDAR_CONFIG.END_HOUR
  )
}

export function findAppointmentByTime(
  appointments: Appointment[],
  sourceTime: string,
  dayIndex: number,
): Appointment | null {
  if (!sourceTime) return null

  const sourceHourStr = sourceTime.split(':')[0]
  const sourceHour = parseInt(sourceHourStr)
  const isExplicitPM =
    sourceTime.toLowerCase().includes('pm') ||
    sourceTime.toLowerCase().includes('tarde') ||
    sourceTime.toLowerCase().includes('noche')

  let adjustedSourceHour = sourceHour
  if (isExplicitPM && sourceHour < 12) adjustedSourceHour += 12
  if (
    !isExplicitPM &&
    sourceHour === 12 &&
    sourceTime.toLowerCase().includes('am')
  )
    adjustedSourceHour = 0

  return (
    appointments.find((a) => {
      const aptHour = Math.floor(a.top / 60) + 7
      return a.dayIndex === dayIndex && aptHour === adjustedSourceHour
    }) || null
  )
}

export function normalizeString(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function findAppointmentByName(
  appointments: Appointment[],
  patientName: string,
  preferredDayIndex?: number,
): Appointment | null {
  if (!patientName) return null
  const normalizedSearch = normalizeString(patientName)

  if (preferredDayIndex !== undefined) {
    const match = appointments.find(
      (a) =>
        a.dayIndex === preferredDayIndex &&
        (normalizeString(a.patientName).includes(normalizedSearch) ||
          normalizedSearch.includes(normalizeString(a.patientName))),
    )
    if (match) return match
  }

  return (
    appointments.find(
      (a) =>
        normalizeString(a.patientName).includes(normalizedSearch) ||
        normalizedSearch.includes(normalizeString(a.patientName)),
    ) || null
  )
}
