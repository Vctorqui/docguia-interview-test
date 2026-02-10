'use client'

import { CalendarDay } from '@/hooks/use-calendar'
import { CalendarHeader } from './calendarStructure/Header'
import { TimeColumn } from './calendarStructure/TimeColumn'
import { GridBody } from './calendarStructure/Body'
import { Appointment } from '@/types/appointments'

interface WeeklyCalendarProps {
  appointments: Appointment[]
  onEditAppointment?: (appointment: Appointment) => void
  days: CalendarDay[]
  currentDayIndex: number
}

export function WeeklyCalendar({
  appointments,
  onEditAppointment,
  days,
  currentDayIndex,
}: WeeklyCalendarProps) {
  return (
    <div className='flex-1 overflow-auto bg-white scrollbar-hide'>
      <div className='min-w-[1000px] md:min-w-0'>
        <CalendarHeader days={days} />

        <div className='relative flex'>
          <TimeColumn />
          <GridBody
            appointments={appointments}
            days={days}
            currentDayIndex={currentDayIndex}
            onEditAppointment={onEditAppointment}
          />
        </div>
      </div>
    </div>
  )
}
