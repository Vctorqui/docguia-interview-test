import { Button } from '@/components/ui/button'
import { Appointment } from '@/types/appointments'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import React from 'react'

export const AppointmentCard = React.memo(
  ({
    appointment,
    onEdit,
  }: {
    appointment: Appointment
    onEdit?: (appointment: Appointment) => void
  }) => {
    const dayWidth = 14.28
    const totalColumns = appointment.totalColumns || 1
    const colWidth = dayWidth / totalColumns
    const left =
      appointment.dayIndex * dayWidth +
      (appointment.columnIndex || 0) * colWidth

    return (
      <div
        className='absolute z-10 px-[1px] pointer-events-auto transition-all duration-300'
        style={{
          top: `${(appointment.top / 60) * 100}px`,
          height: `${(appointment.height / 60) * 100}px`,
          left: `${left}%`,
          width: `${colWidth}%`,
        }}
      >
        <Button
          variant='ghost'
          onClick={() => onEdit?.(appointment)}
          className={cn(
            'h-full w-full bg-brand-muted border border-brand-border rounded-lg p-2 flex flex-col overflow-hidden text-brand-hover cursor-pointer hover:bg-[#F4EBFF] transition-colors text-left items-start justify-start relative group',
            appointment.hasConflict &&
              'border-red-300 bg-red-50 hover:bg-red-100',
          )}
        >
          {appointment.hasConflict && (
            <div className='absolute top-1 right-1 text-red-500'>
              <AlertCircle className='w-3 h-3' />
            </div>
          )}
          <span className='font-semibold text-xs leading-none mb-1 truncate w-full'>
            {appointment.patientName}
          </span>
          <span className='text-[10px] opacity-80 leading-none truncate w-full'>
            {appointment.time}
          </span>

          {appointment.hasConflict && totalColumns > 1 && (
            <div className='mt-auto hidden group-hover:block'>
              <span className='text-[9px] text-red-600 font-medium'>
                Conflicto de horario
              </span>
            </div>
          )}
        </Button>
      </div>
    )
  },
)
