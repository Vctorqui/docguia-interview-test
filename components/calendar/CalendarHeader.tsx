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
  onToggleSidebar?: () => void
}

export function CalendarHeader({
  onAddAppointment,
  onToggleSidebar,
}: CalendarHeaderProps) {
  return (
    <div className='flex flex-col gap-4 p-4 md:p-6 border-b bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 md:gap-3'>
          <Button
            variant='outline'
            size='icon'
            onClick={onToggleSidebar}
            className='h-9 w-9 md:h-10 md:w-10 text-gray-500'
          >
            <SquareChevronRight className='h-5 w-5' />
          </Button>
          <h2 className='text-lg md:text-xl font-semibold flex items-center gap-2'>
            Calendario
          </h2>
          <div className='hidden sm:flex items-center'>
            <HelpCircle className='w-4 h-4 text-gray-400 cursor-pointer' />
            <span className='text-xs md:text-sm font-normal text-brand cursor-pointer ml-1'>
              ¿Cómo funciona?
            </span>
          </div>
        </div>

        <Button
          onClick={onAddAppointment}
          className='bg-brand hover:bg-brand-hover text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-xs md:text-sm'
        >
          <span className='hidden xs:inline'>Agendar Cita</span>
          <Plus className='w-4 h-4' />
        </Button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-2 md:gap-4'>
          <Button
            variant='outline'
            className='bg-white text-xs md:text-sm font-medium hover:bg-gray-50 rounded-lg px-3 md:px-5 py-1.5 md:py-2'
          >
            Hoy
          </Button>

          <div className='flex items-center border rounded-lg overflow-hidden bg-white'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 md:h-9 md:w-9 rounded-none hover:bg-gray-50 transition-colors border-r'
            >
              <ChevronLeft className='w-3 h-3 md:w-4 md:h-4 text-gray-400' />
            </Button>
            <div className='px-3 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-gray-700 min-w-[120px] md:min-w-[160px] text-center'>
              8 - 14 Feb 2026
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 md:h-9 md:w-9 rounded-none hover:bg-gray-50 transition-colors border-l'
            >
              <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-gray-400' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex bg-gray-50/80 p-1 rounded-full border border-gray-100'>
            <Button
              size='sm'
              className='h-7 md:h-8 px-4 md:px-6 rounded-full text-xs md:text-sm font-semibold transition-all bg-white shadow-sm ring-1 ring-gray-200/50 text-brand border-none hover:bg-white'
            >
              Semana
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 md:h-8 px-4 md:px-6 rounded-full text-xs md:text-sm font-medium text-gray-400 hover:text-gray-600 transition-all'
            >
              Día
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 md:h-8 px-4 md:px-6 rounded-full text-xs md:text-sm font-medium text-gray-400 hover:text-gray-600 transition-all'
            >
              Lista
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-3 flex-wrap'>
          <div className='flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 border rounded-lg text-xs md:text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors bg-white'>
            <div className='w-1.5 h-1.5 rounded-lg bg-brand shadow-[0_0_4px_rgba(146,105,229,0.5)]' />
            <span>Todos los consultorios</span>
            <ChevronDown className='w-3 h-3 md:w-4 md:h-4 text-gray-400 ml-1' />
          </div>

          <Button
            variant='outline'
            className='flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg bg-transparent'
          >
            <Filter className='w-3 h-3 md:w-4 md:h-4 text-gray-400' />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
