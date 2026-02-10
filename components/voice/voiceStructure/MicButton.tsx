import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Mic, MicOff } from 'lucide-react'

export function MicButton({
  isRecording,
  hasActiveTranscription,
  onClick,
}: {
  isRecording: boolean
  hasActiveTranscription: boolean
  onClick: () => void
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-3xl group relative p-0 border-none',
        isRecording
          ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-200'
          : 'bg-brand hover:bg-brand-hover shadow-purple-200',
      )}
    >
      {isRecording ? (
        <div className='relative'>
          <div className='absolute inset-0 rounded-full bg-white opacity-40 animate-ping' />
          <MicOff className='h-8 w-8 text-white relative z-10' />
        </div>
      ) : (
        <Mic className='h-8 w-8 text-white group-hover:scale-110 transition-transform' />
      )}

      {!isRecording && !hasActiveTranscription && (
        <div className='absolute right-full mr-6 bg-gray-900 text-white text-[11px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none transform translate-x-2 group-hover:translate-x-0 shadow-lg font-medium'>
          Agendar por voz
        </div>
      )}
    </Button>
  )
}
