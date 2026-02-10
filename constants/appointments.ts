import { Appointment } from '@/types/appointments'

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'Carlos Mayaudon',
    time: '8:30 - 9:30am',
    duration: '60 min',
    dayIndex: 2, // Mar 10
    top: 90,
    height: 60,
    clinic: 'principal',
    service: 'limpieza',
  },
]
