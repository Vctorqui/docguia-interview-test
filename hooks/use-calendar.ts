'use client'

import { CALENDAR_CONFIG } from '@/constants/calendar'
import { useState, useEffect, useMemo } from 'react'

export interface CalendarDay {
  name: string
  number: number
  current: boolean
  date: Date
}

export function useCalendar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const days = useMemo(() => {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return {
        name: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i],
        number: date.getDate(),
        current: date.toDateString() === now.toDateString(),
        date: date,
      }
    })
  }, [now.toDateString()])

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
  }
}
