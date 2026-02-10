export interface Appointment {
  id: string
  patientName: string
  time: string
  duration: string
  dayIndex: number
  fullDate: string
  top: number
  height: number
  clinic?: string
  service?: string
  columnIndex?: number
  totalColumns?: number
  hasConflict?: boolean
}

export interface AppointmentData {
  patient: string
  clinic: string
  date: string
  time: string
  service: string
  duration: number
}
