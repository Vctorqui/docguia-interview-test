import { Button } from '@/components/ui/button'
import { Appointment } from '@/types/appointments'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

    const isNarrow = totalColumns >= 3
    const shouldExpandLeft = (appointment.columnIndex || 0) >= totalColumns / 2
    const initials = appointment.patientName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div
        className={cn(
          'absolute px-[1px] pointer-events-auto transition-all duration-200 z-10 group',
          isNarrow ? 'z-20' : 'z-10',
          'hover:z-50',
        )}
        style={{
          top: `${(appointment.top / 60) * 100}px`,
          height: `${(appointment.height / 60) * 100}px`,
          left: `${left}%`,
          width: `${colWidth}%`,
        }}
      >
        <Button
          onClick={() => onEdit?.(appointment)}
          className={cn(
            'h-full w-full bg-brand-muted border border-brand-border rounded-lg p-2 flex flex-col overflow-hidden text-brand-hover cursor-pointer transition-all duration-250 text-left items-start justify-start relative shadow-sm',
            'hover:bg-white hover:shadow-2xl hover:border-brand-hover hover:opacity-100',
            isNarrow && 'items-center justify-center p-1',
            isNarrow && 'group-hover:w-[230px]',
            isNarrow &&
              shouldExpandLeft &&
              'group-hover:-translate-x-[calc(230px-100%)]',
            appointment.hasConflict &&
              'border-red-300 bg-red-50 hover:bg-white hover:border-red-400',
            isNarrow &&
              'group-hover:items-start group-hover:justify-start group-hover:p-2',
          )}
        >
          {appointment.hasConflict && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='absolute top-1 right-1 text-red-500 z-20'>
                  <AlertCircle className='w-3 h-3' />
                </div>
              </TooltipTrigger>
              <TooltipContent className='bg-red-600 text-white border-none text-[10px]'>
                Conflicto de horario
              </TooltipContent>
            </Tooltip>
          )}

          <div
            className={cn(
              'flex flex-col w-full h-full justify-center group-hover:justify-start',
              !isNarrow
                ? 'items-start'
                : 'items-center group-hover:items-start',
            )}
          >
            <span
              className={cn(
                'font-semibold text-xs leading-none mb-1 truncate w-full',
                isNarrow && 'hidden group-hover:block',
                !isNarrow && 'block',
              )}
            >
              {appointment.patientName}
            </span>
            {isNarrow && (
              <span className='font-bold text-[11px] leading-none group-hover:hidden text-brand-primary'>
                {initials}
              </span>
            )}
            <span
              className={cn(
                'text-[10px] opacity-80 leading-none truncate w-full',
                isNarrow && 'hidden group-hover:block',
                !isNarrow && 'block',
              )}
            >
              {appointment.time}
            </span>
          </div>
        </Button>
      </div>
    )
  },
)
