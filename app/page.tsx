'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Trophy, Target, Calendar, Dumbbell, Apple,
  TrendingUp, Clock, Award, Zap, ChevronRight, QrCode
} from 'lucide-react'
import Link from 'next/link'
import { useGym } from './context/GymContext'

export default function Home() {
  const { gymId } = useGym()
  const [feed, setFeed] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    if (gymId) {
      fetch(`/api/feed?gymId=${gymId}`)
        .then(res => res.json())
        .then(data => { if (data.success) setFeed(data.posts) })

      fetch('/api/user?userId=demo-user-1')
        .then(res => res.json())
        .then(data => { if (data.success) setUserStats(data.user) })
    }
  }, [gymId])

  const stats = [
    { label: 'Racha', value: userStats ? `${userStats.currentStreak} días` : '...', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Entrenamientos', value: userStats?.totalWorkouts ?? '...', icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Nivel 🎮', value: userStats ? `Nv. ${userStats.level}` : '...', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'XP Total', value: userStats?.xp ?? '...', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ]

  const todaysPlan = {
    workout: 'Entrenamiento de Pecho y Tríceps',
    duration: '60 min',
    exercises: 8,
    calories: 450,
  }

  const quickActions = [
    { name: 'Check-In Gimnasio', href: '/check-in', icon: QrCode, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { name: 'Retos', href: '/challenges', icon: Target, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'Rutina IA', href: '/ai-routine', icon: Zap, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { name: 'Dieta IA', href: '/ai-diet', icon: Apple, color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  ]

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido de vuelta! 💪
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg card-hover"
              >
                <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Today's Workout Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Plan de Hoy</h2>
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">{todaysPlan.workout}</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Clock className="h-5 w-5 mb-2" />
              <p className="text-sm opacity-90">Duración</p>
              <p className="font-bold">{todaysPlan.duration}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Dumbbell className="h-5 w-5 mb-2" />
              <p className="text-sm opacity-90">Ejercicios</p>
              <p className="font-bold">{todaysPlan.exercises}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Flame className="h-5 w-5 mb-2" />
              <p className="text-sm opacity-90">Calorías</p>
              <p className="font-bold">{todaysPlan.calories}</p>
            </div>
          </div>
          <Link
            href="/workouts"
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <span>Comenzar Ahora</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`${action.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-between card-hover`}
                  >
                    <div>
                      <Icon className="h-8 w-8 mb-2" />
                      <p className="font-semibold">{action.name}</p>
                    </div>
                    <ChevronRight className="h-6 w-6" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Social Feed / Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actividad Reciente</h2>
          </div>
          <div className="space-y-4">
            {feed.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aún no hay actividad en este gimnasio. ¡Sé el primero en entrenar!</p>
            ) : (
              feed.map((post) => {
                const isPR = post.type === 'PR'
                return (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4 card-hover"
                  >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${isPR ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {isPR ? <Award className={`h-8 w-8 text-yellow-500`} /> : <Flame className={`h-8 w-8 text-blue-500`} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{post.user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
