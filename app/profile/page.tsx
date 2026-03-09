'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Trophy, TrendingUp,
  Award, Flame, Dumbbell, Zap, Star,
  ChevronRight, Calendar
} from 'lucide-react'
import { useGym } from '../context/GymContext'

interface UserStats {
  id: string
  name: string
  email: string
  xp: number
  level: number
  currentLevelXp: number
  xpToNextLevel: number
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  totalCheckIns: number
  achievements: { id: string; name: string; description: string; date: string }[]
  personalRecords: { exerciseName: string; weight: number; date: string }[]
}

export default function ProfilePage() {
  const { gymId } = useGym()
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'records'>('stats')
  const [user, setUser] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user?userId=demo-user-1')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user)
        setLoading(false)
      })
  }, [])

  const xpPercent = user ? Math.round((user.currentLevelXp / 1000) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-black border-2 border-white/40">
              {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black mb-1">{user?.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                <span className="font-bold text-lg">Nivel {user?.level}</span>
                <span className="text-white/60 text-sm">· {user?.xp} XP total</span>
              </div>

              {/* XP Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{user?.currentLevelXp} XP</span>
                  <span>{user?.xpToNextLevel} XP para el siguiente nivel</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-orange-300" />
                  <p className="text-xl font-black">{user?.currentStreak}</p>
                  <p className="text-xs text-white/70">Racha actual</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Dumbbell className="h-5 w-5 mx-auto mb-1 text-blue-200" />
                  <p className="text-xl font-black">{user?.totalWorkouts}</p>
                  <p className="text-xs text-white/70">Entrenamientos</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <CalendarChecked className="h-5 w-5 mx-auto mb-1 text-green-300" />
                  <p className="text-xl font-black">{user?.totalCheckIns}</p>
                  <p className="text-xs text-white/70">Asistencias</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <Award className="h-5 w-5 mx-auto mb-1 text-purple-200" />
                  <p className="text-xl font-black">{user?.achievements.length}</p>
                  <p className="text-xs text-white/70">Logros</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'stats', label: 'Estadísticas', icon: TrendingUp },
            { id: 'achievements', label: 'Logros', icon: Trophy },
            { id: 'records', label: 'Récords', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Resumen de racha</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="font-bold dark:text-white">Racha Actual</p>
                      <p className="text-sm text-gray-500">días consecutivos</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-orange-500">{user?.currentStreak}</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-bold dark:text-white">Racha Máxima</p>
                      <p className="text-sm text-gray-500">mejor racha histórica</p>
                    </div>
                  </div>
                  <p className="text-3xl font-black text-yellow-500">{user?.longestStreak}</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Actividad Total</h2>
              <div className="space-y-4">
                {[
                  { label: 'Entrenamientos Completados', value: user?.totalWorkouts, icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Check-ins en Gimnasio', value: user?.totalCheckIns, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'XP Total Acumulado', value: user?.xp, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                ].map(stat => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className={`flex justify-between items-center p-4 ${stat.bg} rounded-xl`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                        <p className="font-medium dark:text-white">{stat.label}</p>
                      </div>
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Achievements tab */}
        {activeTab === 'achievements' && (
          <div>
            {user?.achievements.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aún no has ganado logros. ¡Entrena para desbloquearlos!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user?.achievements.map((ach, idx) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
                  >
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="font-bold dark:text-white mb-1">{ach.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{ach.description}</p>
                    <p className="text-xs text-green-500 font-semibold">{new Date(ach.date).toLocaleDateString('es-ES')}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Personal Records tab */}
        {activeTab === 'records' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {user?.personalRecords.length === 0 ? (
              <div className="text-center py-16">
                <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aún no tienes récords personales. ¡Completa un entrenamiento con pesos!</p>
              </div>
            ) : (
              user?.personalRecords.map((pr, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{pr.exerciseName}</p>
                      <p className="text-xs text-gray-400">{new Date(pr.date).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-blue-600">{pr.weight} <span className="text-sm font-normal text-gray-500">kg</span></p>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component used above for calendar check icon
function CalendarChecked({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9,15 11,17 15,13" />
    </svg>
  )
}
