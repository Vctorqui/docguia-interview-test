'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar'
import { AppointmentDrawer } from '@/components/appointments/AppointmentDrawer'
import { VoiceAssistant } from '@/components/voice/VoiceAssistant'
import { useAppointments } from '@/hooks/use-appointments'
import { useCalendar } from '@/hooks/use-calendar'

export default function Home() {
  const {
    appointments,
    drawerOpen,
    selectedAppointment,
    setDrawerOpen,
    handleVoiceParsed,
    addAppointment,
    updateAppointment,
    openDrawer,
    editAppointment,
  } = useAppointments()
  const { days } = useCalendar()

  return (
    <DashboardLayout>
      <CalendarHeader onAddAppointment={openDrawer} />
      <WeeklyCalendar
        appointments={appointments}
        onEditAppointment={editAppointment}
      />
      <AppointmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        appointment={selectedAppointment}
        calendarDays={days}
        onSubmit={(data) => {
          if (selectedAppointment) {
            updateAppointment(selectedAppointment.id, data)
          } else {
            addAppointment(data)
          }
        }}
      />
      <VoiceAssistant onParsed={handleVoiceParsed} />
    </DashboardLayout>
  )
}
