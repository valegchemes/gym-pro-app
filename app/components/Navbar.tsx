'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Target, Trophy, User } from 'lucide-react'

const navItems = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Entrenar', href: '/workouts', icon: Dumbbell },
  { name: 'Retos', href: '/challenges', icon: Target },
  { name: 'Rankings', href: '/rankings', icon: Trophy },
  { name: 'Perfil', href: '/profile', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:space-x-8 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-all ${isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs md:text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
