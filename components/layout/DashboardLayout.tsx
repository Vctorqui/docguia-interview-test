import { Sidebar } from './Sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen bg-[#FDFCFE]'>
      <Sidebar />
      <main className='flex-1 flex flex-col overflow-hidden'>{children}</main>
    </div>
  )
}
