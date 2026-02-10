'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AppointmentForm } from './appointmentForm/AppointmentForm'
import { AppointmentData, Appointment } from '@/types/appointments'
import { CalendarDay } from '@/hooks/use-calendar'

interface AppointmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AppointmentData) => void
  appointment?: Appointment | null
  calendarDays?: CalendarDay[]
}

export function AppointmentDrawer({
  open,
  onOpenChange,
  onSubmit,
  appointment,
  calendarDays,
}: AppointmentDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-[500px] p-0 flex flex-col gap-0 border-l'>
        <SheetHeader className='p-6 border-b flex flex-row items-center justify-between space-y-0'>
          <SheetTitle className='text-xl font-semibold'>
            {appointment ? 'Editar cita' : 'Agendar nueva cita'}
          </SheetTitle>
        </SheetHeader>

        <AppointmentForm
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
          initialData={appointment}
          calendarDays={calendarDays}
        />
      </SheetContent>
    </Sheet>
  )
}
