import * as React from 'react'
import { AppointmentData, Appointment } from '@/types/appointments'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CalendarDay } from '@/hooks/use-calendar'
import { CALENDAR_CONFIG, HOURS } from '@/constants/calendar'
import { isTimeInRange } from '@/lib/appointment-utils'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

export function AppointmentForm({
  onCancel,
  onSubmit,
  initialData,
  calendarDays,
}: {
  onCancel: () => void
  onSubmit: (data: AppointmentData) => void
  initialData?: Appointment | null
  calendarDays?: CalendarDay[]
}) {
  const [patient, setPatient] = useState(initialData?.patientName || '')
  const [clinic, setClinic] = useState(initialData?.clinic || '')
  const [date, setDate] = useState(initialData?.dayIndex.toString() || '')
  const [time, setTime] = useState('')
  const [service, setService] = useState(initialData?.service || '')
  const [duration, setDuration] = useState<number | string>(
    initialData?.height || 30,
  )

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patientName)
      setClinic(initialData.clinic || '')
      setDate(initialData.dayIndex.toString())
      setService(initialData.service || '')
      setDuration(initialData.height)

      if (initialData.time) {
        const timePart = initialData.time.split(' ')[0]
        if (timePart.includes(':')) setTime(timePart)
      }
    }
  }, [initialData])

  const handleSubmit = () => {
    if (!patient || !clinic || !date || !time) {
      toast.error('Por favor completa todos los campos obligatorios.')
      return
    }

    if (!isTimeInRange(time)) {
      toast.error(
        `La hora seleccionada está fuera del horario de atención (${CALENDAR_CONFIG.START_HOUR}:00 AM - ${CALENDAR_CONFIG.END_HOUR - 12}:00 PM).`,
      )
      return
    }

    const finalDuration = typeof duration === 'number' ? duration : 30

    onSubmit({
      patient,
      clinic,
      date,
      time,
      service,
      duration: finalDuration,
    })
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      <ScrollArea className='flex-1'>
        <div className='p-6 space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='patient'
                className='text-sm font-medium flex items-center gap-1'
              >
                Paciente <span className='text-red-500'>*</span>
              </Label>
              <Button
                variant='link'
                className='text-brand text-xs font-medium flex items-center gap-1 hover:no-underline p-0 h-auto'
              >
                Añadir paciente <Plus className='h-3 w-3' />
              </Button>
            </div>
            <div className='relative'>
              <Select value={patient} onValueChange={setPatient}>
                <SelectTrigger
                  className={cn('w-full', !patient && 'text-gray-500')}
                >
                  <SelectValue placeholder='Buscar paciente' />
                </SelectTrigger>
                <SelectContent>
                  {patient &&
                    ![
                      'Juan Pérez',
                      'María García',
                      'Carlos Rodríguez',
                    ].includes(patient) && (
                      <SelectItem value={patient}>{patient}</SelectItem>
                    )}
                  <SelectItem value='Juan Pérez'>Juan Pérez</SelectItem>
                  <SelectItem value='María García'>María García</SelectItem>
                  <SelectItem value='Carlos Rodríguez'>
                    Carlos Rodríguez
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='clinic'
              className='text-sm font-medium flex items-center gap-1'
            >
              Consultorio <span className='text-red-500'>*</span>
            </Label>
            <Select value={clinic} onValueChange={setClinic}>
              <SelectTrigger
                className={cn('w-full', !clinic && 'text-gray-400')}
              >
                <SelectValue placeholder='Selecciona un consultorio' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='principal'>Consultorio Principal</SelectItem>
                <SelectItem value='secundario'>Sede Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium flex items-center gap-1'>
                Fecha <span className='text-red-500'>*</span>
              </Label>
              <Select value={date} onValueChange={setDate}>
                <SelectTrigger
                  className={cn('w-full', !date && 'text-gray-400')}
                >
                  <SelectValue placeholder='Selecciona una fecha' />
                </SelectTrigger>
                <SelectContent>
                  {calendarDays?.map((day, idx) => {
                    const dayDate = day.date
                    const label = `${day.name}, ${dayDate.getDate()} ${dayDate.toLocaleDateString('es-ES', { month: 'short' })}`
                    return (
                      <SelectItem key={idx} value={dayDate.getDay().toString()}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium flex items-center gap-1'>
                Hora <span className='text-red-500'>*</span>
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger
                  className={cn('w-full', !time && 'text-gray-400')}
                >
                  <SelectValue placeholder='Hora' />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.filter((h) => h < CALENDAR_CONFIG.END_HOUR).map(
                    (h) => {
                      const label =
                        h === 12
                          ? '12:00 PM'
                          : h > 12
                            ? `${h - 12}:00 PM`
                            : `${h}:00 AM`
                      const labelHalf =
                        h === 12
                          ? '12:30 PM'
                          : h > 12
                            ? `${h - 12}:30 PM`
                            : `${h}:30 AM`
                      return (
                        <React.Fragment key={h}>
                          <SelectItem
                            value={`${h.toString().padStart(2, '0')}:00`}
                          >
                            {label}
                          </SelectItem>
                          <SelectItem
                            value={`${h.toString().padStart(2, '0')}:30`}
                          >
                            {labelHalf}
                          </SelectItem>
                        </React.Fragment>
                      )
                    },
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-700'>
              Servicios
            </Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger
                className={cn('w-full', !service && 'text-gray-400')}
              >
                <SelectValue placeholder='Seleccionar servicios...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='limpieza'>Limpieza Dental</SelectItem>
                <SelectItem value='control'>Control</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-700'>
              Duración de la cita
            </Label>
            <div className='relative'>
              <Input
                type='number'
                value={duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setDuration(isNaN(val) ? '' : val)
                }}
                className='pr-12'
              />
              <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                <span className='text-sm text-gray-400'>min</span>
              </div>
            </div>
          </div>

          <div className='space-y-2 pt-2 pb-6'>
            <Button
              variant='link'
              className='text-brand text-sm font-medium flex items-center gap-1 hover:no-underline p-0 h-auto w-fit'
            >
              Añadir notas internas <Plus className='h-4 w-4' />
            </Button>
            <Button
              variant='link'
              className='text-brand text-sm font-medium flex items-center gap-1 hover:no-underline p-0 h-auto w-fit'
            >
              Añadir Motivo de consulta <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </ScrollArea>

      <div className='p-6 border-t bg-white'>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1 py-6 rounded-xl text-gray-500 border-gray-200'
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className='flex-1 py-6 rounded-xl bg-brand-border hover:bg-brand text-brand-hover hover:text-white font-semibold border-none transition-colors'
          >
            {initialData ? 'Guardar cambios' : 'Agendar cita'}
          </Button>
        </div>
      </div>
    </div>
  )
}
