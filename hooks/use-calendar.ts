'use client'

import { CALENDAR_CONFIG } from '@/constants/calendar'
import { useState, useEffect, useMemo } from 'react'

export interface CalendarDay {
  name: string
  number: number
  current: boolean
  date: Date
  isoDate: string // Added for robust filtering
}

const formatToISOLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useCalendar() {
  const [now, setNow] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const days = useMemo(() => {
    const startOfWeek = new Date(viewDate)
    startOfWeek.setDate(viewDate.getDate() - viewDate.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return {
        name: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i],
        number: date.getDate(),
        current: date.toDateString() === now.toDateString(),
        date: date,
        isoDate: formatToISOLocal(date),
      }
    })
  }, [viewDate, now.toDateString()])

  const rangeText = useMemo(() => {
    const start = days[0].date
    const end = days[6].date

    const startMonth = start.toLocaleDateString('es-ES', { month: 'short' })
    const endMonth = end.toLocaleDateString('es-ES', { month: 'short' })
    const year = end.getFullYear()

    if (startMonth === endMonth) {
      return `${start.getDate()} - ${end.getDate()} ${capitalize(startMonth)} ${year}`
    } else {
      return `${start.getDate()} ${capitalize(startMonth)} - ${end.getDate()} ${capitalize(endMonth)} ${year}`
    }
  }, [days])

  const nextWeek = () => {
    const d = new Date(viewDate)
    d.setDate(d.getDate() + 7)
    setViewDate(d)
  }

  const prevWeek = () => {
    const d = new Date(viewDate)
    d.setDate(d.getDate() - 7)
    setViewDate(d)
  }

  const goToToday = () => setViewDate(new Date())

  const currentDayIndex = now.getDay()
  const currentHour = now.getHours()
  const currentMinutes = now.getMinutes()

  const timeIndicatorTop =
    (currentHour - CALENDAR_CONFIG.START_HOUR) * CALENDAR_CONFIG.HOUR_HEIGHT +
    (currentMinutes * CALENDAR_CONFIG.HOUR_HEIGHT) / 60
  const isWithinVisibleHours =
    currentHour >= CALENDAR_CONFIG.START_HOUR &&
    currentHour <= CALENDAR_CONFIG.END_HOUR

  return {
    days,
    currentDayIndex,
    timeIndicatorTop,
    isWithinVisibleHours,
    now,
    viewDate,
    rangeText,
    nextWeek,
    prevWeek,
    goToToday,
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace('.', '')
}
