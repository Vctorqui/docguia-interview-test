export const CALENDAR_CONFIG = {
  START_HOUR: 7,
  END_HOUR: 20, // 8 PM
  HOUR_HEIGHT: 100,
}

export const HOURS = Array.from(
  { length: CALENDAR_CONFIG.END_HOUR - CALENDAR_CONFIG.START_HOUR + 1 },
  (_, i) => i + CALENDAR_CONFIG.START_HOUR,
)
