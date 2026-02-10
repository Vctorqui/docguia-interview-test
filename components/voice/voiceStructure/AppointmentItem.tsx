import { cn } from '@/lib/utils'

export function AppointmentItem({
  icon,
  label,
  value,
  placeholder,
  valueClassName,
  isMissing,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: string
  placeholder?: string
  valueClassName?: string
  isMissing?: boolean
  onChange?: (value: string) => void
}) {
  return (
    <div className='flex items-center gap-3 group'>
      {icon}
      <div
        className={cn(
          'flex-1 border-b pb-1 transition-colors',
          isMissing
            ? 'border-red-200'
            : 'border-gray-100 group-focus-within:border-brand',
        )}
      >
        <span className='text-gray-500 text-[10px] block'>{label}</span>
        <input
          type='text'
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent border-none p-0 h-6 text-sm font-medium focus:ring-0 focus:outline-none placeholder:text-gray-300',
            isMissing ? 'text-red-500' : 'text-gray-900',
            valueClassName,
          )}
        />
      </div>
    </div>
  )
}
