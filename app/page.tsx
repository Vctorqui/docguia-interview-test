'use client'

import { useState } from 'react'
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
  const { days, rangeText, nextWeek, prevWeek, goToToday, currentDayIndex } =
    useCalendar()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DashboardLayout
      open={sidebarOpen}
      onCloseMobile={() => setSidebarOpen(false)}
    >
      <CalendarHeader
        onAddAppointment={openDrawer}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        rangeText={rangeText}
        onNext={nextWeek}
        onPrev={prevWeek}
        onToday={goToToday}
      />
      <WeeklyCalendar
        appointments={appointments}
        onEditAppointment={editAppointment}
        days={days}
        currentDayIndex={currentDayIndex}
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
      <VoiceAssistant
        onParsed={handleVoiceParsed}
        appointments={appointments}
      />
    </DashboardLayout>
  )
}
