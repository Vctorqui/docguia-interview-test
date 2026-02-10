import { Appointment } from '@/types/appointments'
import { AppointmentCard } from './AppointmentCard'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'
import { calculateOverlapGroups } from '@/lib/appointment-utils'

import { HOURS } from '@/constants/calendar'

export function GridBody({
  appointments,
  days,
  currentDayIndex,
  onEditAppointment,
}: {
  appointments: Appointment[]
  days: any[]
  currentDayIndex: number
  onEditAppointment?: (appointment: Appointment) => void
}) {
  const filteredAppointments = appointments.filter((apt) => {
    return days.some((day) => apt.fullDate === day.isoDate)
  })

  const processedAppointments = calculateOverlapGroups(filteredAppointments)

  return (
    <div className='flex-1 flex relative'>
      <div className='absolute inset-0 flex'>
        {days.map((_, i) => (
          <div key={i} className='flex-1 border-r last:border-r-0 h-full' />
        ))}
      </div>

      <div className='absolute inset-0'>
        {HOURS.map((_, i) => (
          <div key={i} className='h-[100px] border-b last:border-b-0 w-full' />
        ))}
      </div>

      <CurrentTimeIndicator dayIndex={currentDayIndex} />

      {processedAppointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          onEdit={onEditAppointment}
        />
      ))}
    </div>
  )
}
