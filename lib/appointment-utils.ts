import { Appointment, AppointmentData } from '@/types/appointments'
import { ParsedAppointment } from '@/lib/appointment-parsing'
import { CALENDAR_CONFIG } from '@/constants/calendar'

export function mapVoiceDataToAppointment(
  data: ParsedAppointment,
): Appointment {
  return {
    id: Math.random().toString(36).slice(2, 9),
    patientName: data.patient || 'Nuevo Paciente',
    time: `${data.time} - ${data.duration} min`,
    duration: `${data.duration} min`,
    dayIndex: data.date?.includes('13 Feb') ? 5 : 2,
    top: data.time
      ? (parseInt(data.time.split(':')[0]) - CALENDAR_CONFIG.START_HOUR) * 60 +
        parseInt(data.time.split(':')[1])
      : 60,
    height: data.duration || 30,
    clinic: data.clinic,
    service: data.service,
  }
}

export function mapFormDataToAppointment(data: AppointmentData): Appointment {
  let dayIndex = 2
  if (data.date === 'today') dayIndex = new Date().getDay()
  else if (data.date === 'tomorrow') dayIndex = (new Date().getDay() + 1) % 7
  else if (!isNaN(parseInt(data.date))) dayIndex = parseInt(data.date)

  return {
    id: Math.random().toString(36).slice(2, 9),
    patientName: data.patient || 'Nuevo Paciente',
    time: `${data.time} - ${data.duration} min`,
    duration: `${data.duration} min`,
    dayIndex: dayIndex,
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
  // Reset previous data
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

    // Assign columns within each cluster
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
  return hour >= CALENDAR_CONFIG.START_HOUR && hour <= CALENDAR_CONFIG.END_HOUR
}
