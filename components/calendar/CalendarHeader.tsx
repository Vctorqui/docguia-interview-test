import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Plus,
  Filter,
  ChevronDown,
  Menu,
  SquareChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarHeaderProps {
  onAddAppointment?: () => void
}

export function CalendarHeader({ onAddAppointment }: CalendarHeaderProps) {
  return (
    <div className='flex flex-col gap-6 p-6 border-b bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='icon'
            className='h-10 w-10 text-gray-500'
          >
            <SquareChevronRight className='h-5 w-5' />
          </Button>
          <h2 className='text-xl font-semibold flex items-center gap-2'>
            Calendario
          </h2>
          <div className='flex items-center'>
            <HelpCircle className='w-4 h-4 text-gray-400 cursor-pointer' />
            <span className='text-sm font-normal text-brand cursor-pointer ml-1'>
              ¿Cómo funciona?
            </span>
          </div>
        </div>

        <Button
          onClick={onAddAppointment}
          className='bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm'
        >
          Agendar Cita
          <Plus className='w-4 h-4' />
        </Button>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            className='bg-white text-sm font-medium hover:bg-gray-50 rounded-lg px-5 py-2'
          >
            Hoy
          </Button>

          <div className='flex items-center border rounded-lg overflow-hidden bg-white'>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-none hover:bg-gray-50 transition-colors border-r'
            >
              <ChevronLeft className='w-4 h-4 text-gray-400' />
            </Button>
            <div className='px-6 py-2 text-sm font-semibold text-gray-700 min-w-[160px] text-center'>
              8 - 14 Feb 2026
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-none hover:bg-gray-50 transition-colors border-l'
            >
              <ChevronRight className='w-4 h-4 text-gray-400' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex bg-gray-50/80 p-1.5 rounded-full border border-gray-100'>
            <Button
              size='sm'
              className='h-8 px-6 rounded-full text-sm font-semibold transition-all bg-white shadow-sm ring-1 ring-gray-200/50 text-brand border-none hover:bg-white'
            >
              Semana
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-6 rounded-full text-sm font-medium text-gray-400 hover:text-gray-600 transition-all'
            >
              Día
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-6 rounded-full text-sm font-medium text-gray-400 hover:text-gray-600 transition-all'
            >
              Lista
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 px-5 py-2.5 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors bg-white'>
            <div className='w-1.5 h-1.5 rounded-lg bg-brand shadow-[0_0_4px_rgba(146,105,229,0.5)]' />
            <span>Todos los consultorios</span>
            <ChevronDown className='w-4 h-4 text-gray-400 ml-1' />
          </div>

          <Button
            variant='outline'
            className='flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-transparent'
          >
            <Filter className='w-4 h-4 text-gray-400' />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
