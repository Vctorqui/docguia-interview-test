import { cn } from '@/lib/utils'

export function CalendarHeader({ days }: { days: any[] }) {
  return (
    <div className='flex border-b sticky top-0 bg-white z-10 font-medium text-gray-600 text-sm'>
      <div className='w-[120px] p-6 text-center border-r'>Horario</div>
      {days.map((day) => (
        <div
          key={`${day.name}-${day.number}`}
          className='flex-1 p-4 text-center border-r last:border-r-0'
        >
          <div className='flex items-center justify-center gap-2'>
            <span className={cn(day.current && 'text-brand')}>{day.name}</span>
            {day.current && (
              <div className='w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs'>
                {day.number}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
