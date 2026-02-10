import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { ParsedAppointment } from '@/lib/appointment-parsing'

export function AmbiguityResolution({
  data,
  onUpdateField,
}: {
  data: ParsedAppointment
  onUpdateField: (field: keyof ParsedAppointment, value: any) => void
}) {
  const resolve = (newTime: string) => {
    onUpdateField('time', newTime)
    onUpdateField('isAmbiguous', false)
  }

  return (
    <div className='bg-orange-50 p-3 rounded-xl mb-4 border border-orange-100 animate-pulse-subtle'>
      <div className='flex items-start gap-2 mb-2'>
        <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5' />
        <p className='text-xs text-orange-800 font-medium leading-tight'>
          {data.ambiguities?.includes('period')
            ? `¿Te refieres a las ${data.time} AM o PM?`
            : data.ambiguities?.includes('time_slot')
              ? '¿En qué horario de la tarde prefieres?'
              : 'Necesito confirmar un detalle'}
        </p>
      </div>

      <div className='flex flex-wrap gap-2'>
        {data.ambiguities?.includes('period') ? (
          <>
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs text-orange-700 border-orange-200 bg-white flex-1 hover:bg-orange-100'
              onClick={() =>
                resolve(
                  `${data.time?.split(':')[0]}:${data.time?.split(':')[1]} AM`,
                )
              }
            >
              AM
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs text-orange-700 border-orange-200 bg-white flex-1 hover:bg-orange-100'
              onClick={() => {
                const h = parseInt(data.time?.split(':')[0] || '0')
                resolve(`${h < 12 ? h + 12 : h}:${data.time?.split(':')[1]} PM`)
              }}
            >
              PM
            </Button>
          </>
        ) : (
          data.suggestions?.map((suggestion) => (
            <Button
              key={suggestion}
              variant='outline'
              size='sm'
              className='h-8 text-xs text-orange-700 border-orange-200 bg-white flex-1 min-w-[60px] hover:bg-orange-100'
              onClick={() => resolve(suggestion)}
            >
              {suggestion}
            </Button>
          ))
        )}
      </div>
    </div>
  )
}
