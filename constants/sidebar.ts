import {
  Home,
  Calendar,
  Users,
  CreditCard,
  Bell,
  UserPlus,
  Building2,
  Stethoscope,
  FileText,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarNavItem {
  icon: LucideIcon
  label: string
  href: string
  active?: boolean
}

export interface SidebarGroup {
  id: string
  label?: string
  items: SidebarNavItem[]
}

export const SIDEBAR_CONFIG: SidebarGroup[] = [
  {
    id: 'principal',
    items: [
      { icon: Home, label: 'Inicio', href: '#' },
      { icon: Calendar, label: 'Calendario', href: '#', active: true },
      { icon: Users, label: 'Pacientes', href: '#' },
      { icon: CreditCard, label: 'Cobros', href: '#' },
    ],
  },
  {
    id: 'gestion',
    label: 'Gestión',
    items: [
      { icon: Bell, label: 'Recordatorios', href: '#' },
      { icon: UserPlus, label: 'Referidos', href: '#' },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    items: [
      { icon: Building2, label: 'Consultorios', href: '#' },
      { icon: Stethoscope, label: 'Servicios', href: '#' },
      { icon: FileText, label: 'Plantillas', href: '#' },
    ],
  },
]
