'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Dumbbell, Clock, ChevronDown, ChevronUp, Loader } from 'lucide-react'

interface Exercise {
    name: string
    sets: number
    reps: string
    rest: number
}

interface Day {
    day: string
    focus: string
    exercises: Exercise[]
}

interface Routine {
    name: string
    tip: string
    daysPerWeek: number
    days: Day[]
}

export default function AIRoutinePage() {
    const [level, setLevel] = useState('Intermedio')
    const [goal, setGoal] = useState('Fuerza General')
    const [daysPerWeek, setDaysPerWeek] = useState(3)
    const [routine, setRoutine] = useState<Routine | null>(null)
    const [loading, setLoading] = useState(false)
    const [expandedDay, setExpandedDay] = useState<string | null>(null)

    const handleGenerate = async () => {
        setLoading(true)
        setRoutine(null)
        try {
            const res = await fetch('/api/ai-routine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, goal, daysPerWeek })
            })
            const data = await res.json()
            if (data.success) {
                setRoutine(data.routine)
                setExpandedDay(data.routine.days[0]?.day || null)
            }
        } catch (e) {
            alert('Error generando rutina')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <Zap className="h-7 w-7 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black dark:text-white">Rutina IA</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Personalizada para tus objetivos</p>
                        </div>
                    </div>
                </motion.div>

                {/* Config Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mb-6">
                    <h2 className="text-lg font-bold mb-5 dark:text-white">Configura tu rutina</h2>

                    <div className="space-y-5">
                        {/* Level */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Nivel</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Principiante', 'Intermedio', 'Avanzado'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${level === l
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >{l}</button>
                                ))}
                            </div>
                        </div>

                        {/* Goal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Objetivo</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Fuerza General', 'Volumen Muscular', 'Pérdida de Grasa', 'Resistencia'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setGoal(g)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${goal === g
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >{g}</button>
                                ))}
                            </div>
                        </div>

                        {/* Days */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                Días por semana: <span className="text-blue-600">{daysPerWeek}</span>
                            </label>
                            <input
                                type="range"
                                min={2}
                                max={6}
                                value={daysPerWeek}
                                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>2 días</span><span>6 días</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full mt-6 py-4 rounded-2xl font-black text-lg text-white transition-all flex items-center justify-center gap-2 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg active:scale-95'
                            }`}
                    >
                        {loading ? (
                            <><Loader className="h-5 w-5 animate-spin" /><span>Generando rutina...</span></>
                        ) : (
                            <><Zap className="h-5 w-5 fill-white" /><span>Generar Rutina con IA</span></>
                        )}
                    </button>
                </motion.div>

                {/* Generated Routine */}
                <AnimatePresence>
                    {routine && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Title */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 mb-4 text-white">
                                <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">🤖 Rutina Generada</p>
                                <h2 className="text-xl font-black">{routine.name}</h2>
                                <p className="text-sm opacity-80 mt-2">💡 {routine.tip}</p>
                            </div>

                            {/* Days */}
                            <div className="space-y-3">
                                {routine.days.map((day, idx) => (
                                    <div key={day.day} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                        <button
                                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                                            className="w-full flex items-center justify-between p-5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                                    <span className="font-black text-blue-600">D{idx + 1}</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold dark:text-white">{day.day}</p>
                                                    <p className="text-sm text-gray-500">{day.focus}</p>
                                                </div>
                                            </div>
                                            {expandedDay === day.day
                                                ? <ChevronUp className="h-5 w-5 text-gray-400" />
                                                : <ChevronDown className="h-5 w-5 text-gray-400" />
                                            }
                                        </button>

                                        <AnimatePresence>
                                            {expandedDay === day.day && (
                                                <motion.div
                                                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                                        {day.exercises.map((ex, exIdx) => (
                                                            <div key={exIdx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                                                <div>
                                                                    <p className="font-semibold dark:text-white text-sm">{ex.name}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">{ex.sets} series</span>
                                                                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">{ex.reps} reps</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-gray-400">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span className="text-xs">{ex.rest}s</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
