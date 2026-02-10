import { cn } from '@/lib/utils'
import { Loader2, Mic } from 'lucide-react'

export function TranscriptionBubble({
  transcription,
  isRecording,
  isProcessing,
}: {
  transcription: string
  isRecording: boolean
  isProcessing: boolean
}) {
  return (
    <div className='bg-white border shadow-xl rounded-2xl p-4 max-w-xs transition-all duration-300 transform ring-1 ring-black/5 translate-y-0 opacity-100'>
      <div className='flex items-start gap-4'>
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-inner',
            isProcessing
              ? 'bg-blue-50 text-blue-500'
              : 'bg-brand-muted text-brand',
          )}
        >
          {isProcessing ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <Mic className='h-5 w-5' />
          )}
        </div>
        <div className='flex-1 pt-1'>
          <p className='text-sm text-gray-700 leading-relaxed font-medium transition-all'>
            {transcription || 'Escuchando...'}
            {isRecording && (
              <span className='inline-block w-1 h-4 bg-brand ml-1 animate-pulse vertical-middle rounded-full' />
            )}
          </p>
          {isProcessing && (
            <p className='text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-2 animate-pulse'>
              Analizando...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
