'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Calendar, Award, Target, Weight,
  Ruler, Activity, Zap, ChevronLeft, ChevronRight,
  Camera, Plus
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscle'>('weight')

  // Weight progress data
  const weightData = [
    { date: '1 Feb', weight: 82.5, bodyFat: 18.5, muscle: 67.2 },
    { date: '5 Feb', weight: 82.1, bodyFat: 18.2, muscle: 67.5 },
    { date: '10 Feb', weight: 81.8, bodyFat: 17.9, muscle: 67.8 },
    { date: '15 Feb', weight: 81.5, bodyFat: 17.6, muscle: 68.1 },
    { date: '20 Feb', weight: 81.2, bodyFat: 17.3, muscle: 68.4 },
    { date: '25 Feb', weight: 80.9, bodyFat: 17.0, muscle: 68.7 },
    { date: '1 Mar', weight: 80.6, bodyFat: 16.8, muscle: 69.0 },
    { date: '5 Mar', weight: 80.3, bodyFat: 16.5, muscle: 69.3 },
  ]

  // Workout volume data
  const workoutVolumeData = [
    { week: 'Sem 1', volume: 12500, workouts: 4 },
    { week: 'Sem 2', volume: 13200, workouts: 5 },
    { week: 'Sem 3', volume: 13800, workouts: 5 },
    { week: 'Sem 4', volume: 14500, workouts: 5 },
  ]

  // Personal Records
  const personalRecords = [
    { exercise: 'Sentadilla', current: '140 kg', previous: '130 kg', improvement: '+10 kg', date: '5 Mar' },
    { exercise: 'Peso Muerto', current: '160 kg', previous: '150 kg', improvement: '+10 kg', date: '28 Feb' },
    { exercise: 'Press Banca', current: '100 kg', previous: '95 kg', improvement: '+5 kg', date: '20 Feb' },
    { exercise: 'Dominadas', current: '15 reps', previous: '12 reps', improvement: '+3 reps', date: '15 Feb' },
  ]

  // Body measurements
  const measurements = [
    { part: 'Pecho', value: 102, unit: 'cm', change: '+2' },
    { part: 'Cintura', value: 82, unit: 'cm', change: '-3' },
    { part: 'Brazos', value: 38, unit: 'cm', change: '+1.5' },
    { part: 'Piernas', value: 58, unit: 'cm', change: '+2' },
  ]

  const stats = [
    { label: 'Peso Actual', value: '80.3 kg', change: '-2.2 kg', icon: Weight, trend: 'down', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Grasa Corporal', value: '16.5%', change: '-2.0%', icon: Activity, trend: 'down', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Masa Muscular', value: '69.3 kg', change: '+2.1 kg', icon: Zap, trend: 'up', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'IMC', value: '24.1', change: '-0.6', icon: Ruler, trend: 'down', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ]

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'weight':
        return { data: weightData, dataKey: 'weight', label: 'Peso (kg)', color: '#3b82f6' }
      case 'bodyFat':
        return { data: weightData, dataKey: 'bodyFat', label: 'Grasa Corporal (%)', color: '#f59e0b' }
      case 'muscle':
        return { data: weightData, dataKey: 'muscle', label: 'Masa Muscular (kg)', color: '#8b5cf6' }
    }
  }

  const metricInfo = getMetricData()

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Progreso
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitorea tu evolución y alcanza tus metas
          </p>
        </div>

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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''} ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-green-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') || stat.change.startsWith('-') ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">este mes</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weight Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Evolución Corporal
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedMetric('weight')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'weight'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Peso
                  </button>
                  <button
                    onClick={() => setSelectedMetric('bodyFat')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'bodyFat'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Grasa
                  </button>
                  <button
                    onClick={() => setSelectedMetric('muscle')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedMetric === 'muscle'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Músculo
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metricInfo.data}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricInfo.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metricInfo.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey={metricInfo.dataKey} 
                  stroke={metricInfo.color} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Body Measurements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Medidas
              </h2>
              <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {measurements.map((measurement, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {measurement.part}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {measurement.value} {measurement.unit}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${
                    measurement.change.startsWith('+') 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    <span className="text-sm font-semibold">{measurement.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Subir Foto de Progreso</span>
            </button>
          </motion.div>
        </div>

        {/* Workout Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Volumen de Entrenamiento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="week" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Personal Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Récords Personales
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {personalRecords.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {record.exercise}
                  </h3>
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    PR
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {record.current}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Anterior: {record.previous}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {record.improvement}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
