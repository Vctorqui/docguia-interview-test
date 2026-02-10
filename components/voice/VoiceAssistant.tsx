import { useState, useCallback } from 'react'
import { type ParsedAppointment } from '@/lib/appointment-parsing'
import { ResultBubble } from './voiceStructure/ResultBubble'
import { TranscriptionBubble } from './voiceStructure/TranscriptionBubble'
import { MicButton } from './voiceStructure/MicButton'
import { Appointment } from '@/types/appointments'
import { useVoiceAssistant } from '@/hooks/use-voice-assistant'
import { X } from 'lucide-react'
import { Button } from '../ui/button'

interface VoiceAssistantProps {
  onParsed: (data: ParsedAppointment) => void
  appointments: Appointment[]
}

export function VoiceAssistant({
  onParsed,
  appointments,
}: VoiceAssistantProps) {
  const {
    isRecording,
    transcription,
    isProcessing,
    showResult,
    parsedData,
    matchedAppointment,
    toggleRecording,
    handleUpdateField,
    handleConfirm,
    handleCancel,
  } = useVoiceAssistant(appointments, onParsed)

  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      handleCancel()
      setIsClosing(false)
    }, 300)
  }, [handleCancel])

  const handleConfirmAction = useCallback(
    (time?: string) => {
      setIsClosing(true)
      setTimeout(() => {
        handleConfirm(onParsed, time)
        setIsClosing(false)
      }, 300)
    },
    [handleConfirm, onParsed],
  )

  const [showInvitation, setShowInvitation] = useState(
    appointments.length === 0,
  )

  if (appointments.length > 0 && showInvitation) {
    setShowInvitation(false)
  }

  return (
    <div className='fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3'>
      {showInvitation && !showResult && !transcription && !isProcessing && (
        <div className='bg-brand text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium animate-bounce-subtle flex items-center gap-2 mb-2'>
          <span>✨ Agenda tu primera cita</span>
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => setShowInvitation(false)}
            className='hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='h-3 w-3' />
          </Button>
        </div>
      )}

      {showResult && parsedData && (
        <ResultBubble
          data={parsedData}
          isClosing={isClosing}
          matchedAppointment={matchedAppointment}
          onCancel={handleClose}
          onConfirm={handleConfirmAction}
          onUpdateField={handleUpdateField}
        />
      )}

      {(transcription || isProcessing) && !showResult && (
        <TranscriptionBubble
          transcription={transcription}
          isRecording={isRecording}
          isProcessing={isProcessing}
        />
      )}

      <MicButton
        isRecording={isRecording}
        hasActiveTranscription={!!transcription}
        onClick={toggleRecording}
      />
    </div>
  )
}
