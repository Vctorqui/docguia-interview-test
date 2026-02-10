import { Button } from '@/components/ui/button'
import { AppointmentItem } from './AppointmentItem'
import {
  AlertCircle,
  CalendarIcon,
  Check,
  Clock,
  Stethoscope,
  User,
  X,
} from 'lucide-react'
import { AmbiguityResolution } from './AmbiguityResolution'
import { cn } from '@/lib/utils'
import { ParsedAppointment } from '@/lib/appointment-parsing'
import { CALENDAR_CONFIG } from '@/constants/calendar'
import { isTimeInRange } from '@/lib/appointment-utils'

export function ResultBubble({
  data,
  onCancel,
  onConfirm,
  onUpdateField,
}: {
  data: ParsedAppointment
  onCancel: () => void
  onConfirm: (time?: string) => void
  onUpdateField: (field: keyof ParsedAppointment, value: any) => void
}) {
  const isValidTime = data.time ? isTimeInRange(data.time) : true
  const isComplete = data.missingFields.length === 0 && isValidTime

  return (
    <div className='bg-white border shadow-2xl rounded-2xl p-5 w-80 mb-2 transform transition-all animate-in slide-in-from-bottom-4 ring-1 ring-black/5'>
      <div className='flex items-center justify-between mb-4 border-b pb-3'>
        <div>
          <h3 className='font-semibold text-gray-900'>Resumen de cita</h3>
          <p className='text-[10px] text-gray-400 uppercase tracking-wider font-bold'>
            Asistente de Voz
          </p>
        </div>
        <Button
          onClick={onCancel}
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-gray-600 h-8 w-8 rounded-full'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-y-4 mb-5'>
        <div className='grid grid-cols-1 gap-3 text-sm'>
          <AppointmentItem
            icon={<User className='h-4 w-4 text-gray-400' />}
            label='Paciente'
            value={data.patient || ''}
            placeholder='Nombre del paciente'
            isMissing={data.missingFields.includes('patient')}
            onChange={(val) => onUpdateField('patient', val)}
          />
          <AppointmentItem
            icon={<CalendarIcon className='h-4 w-4 text-gray-400' />}
            label='Fecha'
            value={data.date || ''}
            placeholder='Ej: 13 Feb 2026'
            isMissing={data.missingFields.includes('date')}
            onChange={(val) => onUpdateField('date', val)}
          />

          <div className='flex items-center gap-3'>
            <Clock className='h-4 w-4 text-gray-400' />
            <div className='flex-1 border-b pb-1'>
              <span className='text-gray-500 text-[10px] block'>
                Hora y Duración
              </span>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={data.time || ''}
                  onChange={(e) => onUpdateField('time', e.target.value)}
                  placeholder='Ej: 10:00 AM'
                  className={cn(
                    'flex-1 bg-transparent border-none p-0 h-6 text-sm font-medium focus:ring-0 focus:outline-none placeholder:text-gray-300',
                    data.ambiguities?.includes('period') ||
                      data.ambiguities?.includes('time_slot')
                      ? 'text-orange-600'
                      : data.missingFields.includes('time')
                        ? 'text-red-500'
                        : 'text-gray-900',
                  )}
                />
                <span className='text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 whitespace-nowrap'>
                  {data.duration} min
                </span>
              </div>
            </div>
          </div>

          <AppointmentItem
            icon={<Stethoscope className='h-4 w-4 text-gray-400' />}
            label='Motivo'
            value={data.reason || ''}
            placeholder='Ej: Consulta General'
            valueClassName={data.reason ? 'text-brand' : ''}
            isMissing={data.missingFields.includes('reason')}
            onChange={(val) => onUpdateField('reason', val)}
          />
        </div>
      </div>

      {data.followUpPrompt && isValidTime && (
        <div className='bg-blue-50 p-2.5 rounded-xl mb-4 border border-blue-100 flex items-start gap-2'>
          <AlertCircle className='h-3.5 w-3.5 text-blue-500 mt-0.5' />
          <p className='text-[11px] text-blue-800 font-medium leading-tight'>
            {data.followUpPrompt}
          </p>
        </div>
      )}

      {!isValidTime && (
        <div className='bg-red-50 p-2.5 rounded-xl mb-4 border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1'>
          <AlertCircle className='h-3.5 w-3.5 text-red-500 mt-0.5' />
          <p className='text-[11px] text-red-800 font-medium leading-tight'>
            La hora ({data.time}) está fuera del horario de atención (
            {CALENDAR_CONFIG.START_HOUR}:00 AM - {CALENDAR_CONFIG.END_HOUR - 12}
            :00 PM).
          </p>
        </div>
      )}

      {data.isAmbiguous && isValidTime ? (
        <AmbiguityResolution data={data} onUpdateField={onUpdateField} />
      ) : null}

      <div className='flex flex-col gap-2'>
        <Button
          onClick={() => onConfirm()}
          disabled={!isComplete}
          className={cn(
            'w-full text-white rounded-xl py-6 font-semibold shadow-lg transition-all',
            isComplete
              ? 'bg-brand hover:bg-brand-hover shadow-purple-200'
              : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed',
          )}
        >
          {isComplete ? (
            <>
              <Check className='h-5 w-5 mr-2' /> Confirmar cita{' '}
              {data.time ? `para las ${data.time}` : ''}
            </>
          ) : !isValidTime ? (
            'Hora fuera de rango'
          ) : (
            'Datos incompletos'
          )}
        </Button>
      </div>
    </div>
  )
}
