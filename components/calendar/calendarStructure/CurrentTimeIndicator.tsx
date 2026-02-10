import { useCalendar } from '@/hooks/use-calendar'

export function CurrentTimeIndicator({ dayIndex }: { dayIndex: number }) {
  const { timeIndicatorTop, isWithinVisibleHours } = useCalendar()

  if (!isWithinVisibleHours) return null

  return (
    <div
      className='absolute inset-y-0 w-[14.28%] bg-transparent pointer-events-none transition-all duration-500'
      style={{ left: `${dayIndex * 14.28}%` }}
    >
      <div
        className='w-full h-[2px] bg-[#F04438] absolute z-20 flex items-center shadow-[0_0_8px_rgba(240,68,56,0.4)]'
        style={{ top: `${timeIndicatorTop}px` }}
      >
        <div className='w-2.5 h-2.5 rounded-full bg-[#F04438] -ml-1.25 border-2 border-white' />
      </div>
    </div>
  )
}
