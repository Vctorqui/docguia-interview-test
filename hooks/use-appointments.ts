'use client'

import { Appointment, AppointmentData } from '@/types/appointments'
import { INITIAL_APPOINTMENTS } from '@/constants/appointments'
import {
  mapVoiceDataToAppointment,
  mapFormDataToAppointment,
  isTimeInRange,
} from '@/lib/appointment-utils'
import { type ParsedAppointment } from '@/lib/appointment-parsing'
import { toast } from 'sonner'
import { useCallback, useState } from 'react'

export function useAppointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const handleVoiceParsed = useCallback((data: ParsedAppointment) => {
    if (data.time && !isTimeInRange(data.time)) {
      toast.error(`Cita fuera de rango: ${data.time}`)
      return
    }
    setAppointments((prev) => [...prev, mapVoiceDataToAppointment(data)])
    setDrawerOpen(false)
    toast.success('Cita agendada por voz con éxito')
  }, [])

  const addAppointment = useCallback((data: AppointmentData) => {
    setAppointments((prev) => [...prev, mapFormDataToAppointment(data)])
    setDrawerOpen(false)
    toast.success('Cita agendada con éxito')
  }, [])

  const updateAppointment = useCallback((id: string, data: AppointmentData) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...mapFormDataToAppointment(data), id } // Keep the same ID
          : apt,
      ),
    )
    setDrawerOpen(false)
    setSelectedAppointment(null)
    toast.success('Cita editada con éxito')
  }, [])

  const openDrawer = useCallback(() => {
    setSelectedAppointment(null)
    setDrawerOpen(true)
  }, [])

  const editAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setSelectedAppointment(null)
  }, [])

  return {
    appointments,
    drawerOpen,
    selectedAppointment,
    setDrawerOpen,
    handleVoiceParsed,
    addAppointment,
    updateAppointment,
    openDrawer,
    editAppointment,
    closeDrawer,
  }
}
