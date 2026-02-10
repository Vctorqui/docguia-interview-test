import { Sidebar } from './Sidebar'

export function DashboardLayout({
  children,
  open = true,
  onCloseMobile,
}: {
  children: React.ReactNode
  open?: boolean
  onCloseMobile?: () => void
}) {
  return (
    <div className='flex h-screen bg-[#FDFCFE] overflow-hidden relative'>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity cursor-pointer'
          onClick={onCloseMobile}
        />
      )}
      <Sidebar open={open} />
      <main className='flex-1 flex flex-col min-w-0 overflow-hidden relative z-0'>
        {children}
      </main>
    </div>
  )
}
