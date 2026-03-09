import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Header from './components/Header'
import { GymProvider } from './context/GymContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GymPro - Tu Compañero de Entrenamiento Definitivo',
  description: 'Aplicación profesional para seguimiento de entrenamientos, nutrición y progreso en el gimnasio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <GymProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <Navbar />
            <main className="pt-16 pb-20">
              {children}
            </main>
          </div>
        </GymProvider>
      </body>
    </html>
  )
}
