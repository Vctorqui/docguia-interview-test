'use client'

import { useState, useCallback } from 'react'
import {
  parseVoiceCommand,
  type ParsedAppointment,
} from '@/lib/appointment-parsing'
import { useVoiceRecognition } from '@/hooks/use-voice-recognition'
import { Appointment } from '@/types/appointments'
import {
  findAppointmentByTime,
  mapVoiceDataToAppointment,
} from '@/lib/appointment-utils'

export function useVoiceAssistant(
  appointments: Appointment[],
  onParsed?: (data: ParsedAppointment) => void,
) {
  const [showResult, setShowResult] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedAppointment | null>(null)
  const [matchedAppointment, setMatchedAppointment] =
    useState<Appointment | null>(null)

  const handleParsed = useCallback(
    (data: ParsedAppointment) => {
      if (data.intent === 'edit' && data.sourceTime) {
        // Use specified date if available, otherwise current day
        const dayIndex = data.date
          ? mapVoiceDataToAppointment(data).dayIndex || new Date().getDay()
          : new Date().getDay()
        const found = findAppointmentByTime(
          appointments,
          data.sourceTime,
          dayIndex,
        )
        setMatchedAppointment(found)
      } else {
        setMatchedAppointment(null)
      }

      setParsedData(data)
      setShowResult(true)
    },
    [appointments],
  )

  const {
    isRecording,
    transcription,
    isProcessing,
    toggleRecording,
    setTranscription,
    startRecording,
    stopRecording,
  } = useVoiceRecognition(handleParsed)

  const handleProcessDraft = useCallback(() => {
    if (!transcription) return
    const data = parseVoiceCommand(transcription)
    handleParsed(data)
  }, [transcription, handleParsed])

  const handleUpdateField = useCallback(
    (field: keyof ParsedAppointment, value: any) => {
      setParsedData((prev) => {
        if (!prev) return null

        const updatedData = { ...prev, [field]: value }

        // Relaxed validation for edit intent
        const requiredFields: (keyof ParsedAppointment)[] =
          updatedData.intent === 'create'
            ? ['patient', 'date', 'time', 'reason']
            : ['time']

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

        return {
          ...updatedData,
          missingFields: missingFields as string[],
          followUpPrompt,
        }
      })
    },
    [],
  )

  const handleConfirm = useCallback(
    (callback: (data: ParsedAppointment) => void, updatedTime?: string) => {
      if (parsedData) {
        const finalData = updatedTime
          ? { ...parsedData, time: updatedTime, isAmbiguous: false }
          : parsedData
        callback(finalData)
        setShowResult(false)
        setTranscription('')
        setParsedData(null)
      }
    },
    [parsedData, setTranscription],
  )

  const handleCancel = useCallback(() => {
    setShowResult(false)
    setTranscription('')
    setParsedData(null)
  }, [setTranscription])

  return {
    isRecording,
    transcription,
    isProcessing,
    showResult,
    parsedData,
    matchedAppointment,
    toggleRecording,
    startRecording,
    stopRecording,
    setTranscription,
    handleProcessDraft,
    handleUpdateField,
    handleConfirm,
    handleCancel,
  }
}
