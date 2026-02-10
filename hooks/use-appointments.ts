'use client'

import { Appointment, AppointmentData } from '@/types/appointments'
import { INITIAL_APPOINTMENTS } from '@/constants/appointments'
import {
  mapVoiceDataToAppointment,
  mapFormDataToAppointment,
  isTimeInRange,
  findAppointmentByTime,
} from '@/lib/appointment-utils'
import { type ParsedAppointment } from '@/lib/appointment-parsing'
import { toast } from 'sonner'
import { useCallback, useState, useEffect } from 'react'

export function useAppointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docguia_appointments')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setAppointments(parsed)
          }
        } catch (e) {
          console.error('Failed to parse appointments', e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('docguia_appointments', JSON.stringify(appointments))
    }
  }, [appointments, isLoaded])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const handleVoiceParsed = useCallback(
    (data: ParsedAppointment) => {
      if (data.time && !isTimeInRange(data.time)) {
        toast.error(`Cita fuera de rango: ${data.time}`)
        return
      }

      const voiceUpdates = mapVoiceDataToAppointment(data)

      // Automatic Edit Logic
      if (data.intent === 'edit') {
        let targetId = selectedAppointment?.id

        // If sourceTime is provided, try to find the appointment with fuzzy matching
        if (data.sourceTime && !targetId) {
          const targetDay = voiceUpdates.dayIndex ?? new Date().getDay()
          const found = findAppointmentByTime(
            appointments,
            data.sourceTime,
            targetDay as number,
          )

          if (found) {
            targetId = found.id
          }
        }

        if (targetId) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === targetId
                ? ({ ...apt, ...voiceUpdates } as Appointment)
                : apt,
            ),
          )
          setDrawerOpen(false)
          setSelectedAppointment(null)
          toast.success('Cita actualizada con éxito')
          return
        } else if (data.sourceTime) {
          toast.error(`No encontré ninguna cita a las ${data.sourceTime}`)
          return
        }
      }

      const newAppointment: Appointment = {
        id: Math.random().toString(36).slice(2, 9),
        patientName: 'Nuevo Paciente',
        dayIndex: voiceUpdates.dayIndex ?? new Date().getDay(),
        top: voiceUpdates.top ?? 60,
        height: 30,
        time: '09:00 - 30 min',
        duration: '30 min',
        ...voiceUpdates,
      } as Appointment

      setAppointments((prev) => [...prev, newAppointment])
      setDrawerOpen(false)
      toast.success('Cita agendada por voz con éxito')
    },
    [appointments, selectedAppointment],
  )

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
