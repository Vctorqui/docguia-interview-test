'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  parseVoiceCommand,
  type ParsedAppointment,
} from '@/lib/appointment-parsing'

export function useVoiceRecognition(
  onParsed: (data: ParsedAppointment) => void,
) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'es-ES'

      recognitionRef.current.onresult = (event: any) => {
        let fullTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript
        }
        setTranscription(fullTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        stopRecording()
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta transcripción de voz.')
      return
    }

    setIsRecording(true)
    setTranscription('')
    setIsProcessing(false)

    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error('Error starting recognition', e)
    }
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    setIsProcessing(true)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Simulate NLP processing delay for better UX
    setTimeout(() => {
      const data = parseVoiceCommand(transcription)
      onParsed(data)
      setIsProcessing(false)
    }, 1200)
  }, [transcription, onParsed])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return {
    isRecording,
    transcription,
    isProcessing,
    startRecording,
    stopRecording,
    toggleRecording,
    setTranscription,
  }
}
