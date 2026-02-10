'use client'

import { type ParsedAppointment } from '@/lib/appointment-parsing'
import { useVoiceRecognition } from '@/hooks/use-voice-recognition'
import { ResultBubble } from './voiceStructure/ResultBubble'
import { TranscriptionBubble } from './voiceStructure/TranscriptionBubble'
import { MicButton } from './voiceStructure/MicButton'
import { useCallback, useState } from 'react'

interface VoiceAssistantProps {
  onParsed: (data: ParsedAppointment) => void
}

export function VoiceAssistant({ onParsed }: VoiceAssistantProps) {
  const [showResult, setShowResult] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedAppointment | null>(null)

  const handleParsed = useCallback((data: ParsedAppointment) => {
    setParsedData(data)
    setShowResult(true)
  }, [])

  const {
    isRecording,
    transcription,
    isProcessing,
    toggleRecording,
    setTranscription,
  } = useVoiceRecognition(handleParsed)

  const handleUpdateField = useCallback(
    (field: keyof ParsedAppointment, value: any) => {
      if (!parsedData) return

      const updatedData = { ...parsedData, [field]: value }

      const requiredFields: (keyof ParsedAppointment)[] = [
        'patient',
        'date',
        'time',
        'reason',
      ]
      const missingFields = requiredFields.filter((f) => !updatedData[f])

      let followUpPrompt = undefined
      if (missingFields.length > 0) {
        const fieldMap: Record<string, string> = {
          patient: 'el nombre del paciente',
          date: 'la fecha',
          time: 'la hora',
          reason: 'el motivo',
        }
        const missing = missingFields.map((f) => fieldMap[f as string])
        if (missing.length === 1) {
          followUpPrompt = `Necesito completar un dato: me falta ${missing[0]}.`
        } else {
          const last = missing.pop()
          followUpPrompt = `Necesito completar algunos datos: me falta ${missing.join(', ')} y ${last}.`
        }
      }

      setParsedData({
        ...updatedData,
        missingFields: missingFields as string[],
        followUpPrompt,
      })
    },
    [parsedData],
  )

  const handleConfirm = (updatedTime?: string) => {
    if (parsedData) {
      const finalData = updatedTime
        ? { ...parsedData, time: updatedTime, isAmbiguous: false }
        : parsedData
      onParsed(finalData)
      setShowResult(false)
      setTranscription('')
      setParsedData(null)
    }
  }

  const handleCancel = () => {
    setShowResult(false)
    setTranscription('')
    setParsedData(null)
  }

  return (
    <div className='fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3'>
      {showResult && parsedData && (
        <ResultBubble
          data={parsedData}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
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
