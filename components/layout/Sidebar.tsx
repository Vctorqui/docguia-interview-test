import Link from 'next/link'
import { Calendar, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { SIDEBAR_CONFIG } from '@/constants/sidebar'
import Image from 'next/image'

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden bg-white border-r shadow-2xl',
        'md:relative md:translate-x-0 md:opacity-100 md:shadow-none',
        open
          ? 'w-64 opacity-100 translate-x-0'
          : 'w-0 opacity-0 -translate-x-full md:w-64',
      )}
    >
      <div className='p-6 w-64'>
        <div className='flex items-center gap-2 text-brand text-2xl font-bold'>
          <Image
            src='/logo/logo-white.avif'
            alt='Logo'
            width={128}
            height={128}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>

      <nav className='flex-1 overflow-y-auto px-4 space-y-8'>
        {SIDEBAR_CONFIG.map((group) => (
          <div key={group.id}>
            {group.label && (
              <h3 className='px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2'>
                {group.label}
              </h3>
            )}
            <ul className='space-y-1'>
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-brand-muted text-brand'
                        : 'text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-5 h-5',
                        item.active ? 'text-brand' : 'text-gray-400',
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className='p-4 space-y-4'>
        <div className='bg-brand-muted p-4 rounded-xl border border-brand-border-muted'>
          <div className='flex items-center gap-2 text-brand font-semibold text-sm mb-1'>
            <div className='w-2 h-2 rounded-full bg-brand' />
            Cuenta Demo
          </div>
          <p className='text-brand text-xs'>Acceso ilimitado</p>
        </div>

        <Button
          variant='outline'
          className='flex items-center justify-between w-full h-auto p-2 border rounded-xl hover:bg-gray-50 transition-colors text-left bg-white'
        >
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-[#D1E9FF] flex items-center justify-center text-[#1570EF] font-bold text-xs'>
              C
            </div>
            <div>
              <p className='text-sm font-semibold truncate'>Dr. Carlos Parra</p>
            </div>
          </div>
          <ChevronDown className='w-4 h-4 text-gray-400' />
        </Button>
      </div>
    </aside>
  )
}
