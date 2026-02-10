import { HOURS } from '@/constants/calendar'

export function TimeColumn() {
  return (
    <div className='w-[120px] bg-[#FDFCFE] border-r'>
      {HOURS.map((hour) => (
        <div
          key={hour}
          className='h-[100px] border-b px-4 py-2 text-xs font-medium text-gray-500 uppercase flex items-center justify-center'
        >
          {hour === 12
            ? '12:00 PM'
            : hour > 12
              ? `${hour - 12}:00 PM`
              : `${hour}:00 AM`}
        </div>
      ))}
    </div>
  )
}
