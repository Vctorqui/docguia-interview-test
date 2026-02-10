import { useState, useCallback } from 'react'
import { type ParsedAppointment } from '@/lib/appointment-parsing'
import { ResultBubble } from './voiceStructure/ResultBubble'
import { TranscriptionBubble } from './voiceStructure/TranscriptionBubble'
import { MicButton } from './voiceStructure/MicButton'
import { Appointment } from '@/types/appointments'
import { useVoiceAssistant } from '@/hooks/use-voice-assistant'

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

  return (
    <div className='fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3'>
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
