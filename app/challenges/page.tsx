'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Trophy, Plus, Calendar, Users, Flame, Lock, CheckCircle } from 'lucide-react'
import { useGym } from '../context/GymContext'

interface Challenge {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    goalType: string
    goalValue: number
}

const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 'c1',
        name: '💪 Reto 30 Sentadillas',
        description: 'Completa 30 sentadillas cada día durante todo el mes.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        goalType: 'WORKOUTS',
        goalValue: 30
    },
    {
        id: 'c2',
        name: '🔥 Racha de 14 días',
        description: 'Entrena 14 días consecutivos sin falta.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        goalType: 'STREAK',
        goalValue: 14
    },
    {
        id: 'c3',
        name: '🏋️ 10,000 kg levantados',
        description: 'Acumula 10,000 kg de volumen total en entrenamientos.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 21 * 86400000).toISOString(),
        goalType: 'VOLUME',
        goalValue: 10000
    },
    {
        id: 'c4',
        name: '📋 Check-in Perfecto',
        description: 'Asiste al gimnasio 20 veces este mes.',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        goalType: 'CHECKINS',
        goalValue: 20
    },
]

const MOCK_PROGRESS: Record<string, number> = {
    c1: 67,
    c2: 43,
    c3: 25,
    c4: 80,
}

const goalTypeLabel: Record<string, string> = {
    WORKOUTS: 'entrenamientos',
    STREAK: 'días de racha',
    VOLUME: 'kg de volumen',
    CHECKINS: 'check-ins',
}

const goalTypeColor: Record<string, string> = {
    WORKOUTS: 'from-blue-500 to-cyan-500',
    STREAK: 'from-orange-500 to-red-500',
    VOLUME: 'from-purple-500 to-pink-500',
    CHECKINS: 'from-green-500 to-emerald-500',
}

export default function ChallengesPage() {
    const { gymId } = useGym()
    const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES)
    const [joined, setJoined] = useState<Set<string>>(new Set())
    const [showCreate, setShowCreate] = useState(false)
    const [newChallenge, setNewChallenge] = useState({ name: '', description: '', goalType: 'WORKOUTS', goalValue: 10, days: 30 })

    const handleJoin = (id: string) => {
        setJoined(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const getDaysLeft = (endDate: string) => {
        const diff = new Date(endDate).getTime() - Date.now()
        return Math.max(0, Math.ceil(diff / 86400000))
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                                <Target className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-black dark:text-white">Retos</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 ml-15 pl-1">Desafíos del gimnasio</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
                    >
                        <Plus className="h-5 w-5" />
                        Crear reto
                    </button>
                </motion.div>

                {/* Create Challenge Form */}
                <AnimatePresence>
                    {showCreate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-blue-100 dark:border-blue-900">
                                <h2 className="font-bold text-lg mb-4 dark:text-white">Crear nuevo reto</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del reto (ej: Reto 30 días)"
                                        value={newChallenge.name}
                                        onChange={e => setNewChallenge(p => ({ ...p, name: e.target.value }))}
                                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        placeholder="Descripción del reto..."
                                        rows={2}
                                        value={newChallenge.description}
                                        onChange={e => setNewChallenge(p => ({ ...p, description: e.target.value }))}
                                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de objetivo</label>
                                            <select
                                                value={newChallenge.goalType}
                                                onChange={e => setNewChallenge(p => ({ ...p, goalType: e.target.value }))}
                                                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white text-sm focus:outline-none"
                                            >
                                                <option value="WORKOUTS">Entrenamientos</option>
                                                <option value="STREAK">Racha</option>
                                                <option value="VOLUME">Volumen</option>
                                                <option value="CHECKINS">Check-ins</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Meta</label>
                                            <input type="number" value={newChallenge.goalValue}
                                                onChange={e => setNewChallenge(p => ({ ...p, goalValue: Number(e.target.value) }))}
                                                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Duración (días)</label>
                                            <input type="number" value={newChallenge.days}
                                                onChange={e => setNewChallenge(p => ({ ...p, days: Number(e.target.value) }))}
                                                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700 dark:text-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!newChallenge.name) return
                                            const fake: Challenge = {
                                                id: `c${Date.now()}`,
                                                name: newChallenge.name,
                                                description: newChallenge.description,
                                                startDate: new Date().toISOString(),
                                                endDate: new Date(Date.now() + newChallenge.days * 86400000).toISOString(),
                                                goalType: newChallenge.goalType,
                                                goalValue: newChallenge.goalValue,
                                            }
                                            setChallenges(p => [fake, ...p])
                                            setShowCreate(false)
                                            setNewChallenge({ name: '', description: '', goalType: 'WORKOUTS', goalValue: 10, days: 30 })
                                        }}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Publicar reto
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Challenges List */}
                <div className="space-y-4">
                    {challenges.map((ch, idx) => {
                        const isJoined = joined.has(ch.id)
                        const progress = MOCK_PROGRESS[ch.id] || 0
                        const daysLeft = getDaysLeft(ch.endDate)
                        const colorClass = goalTypeColor[ch.goalType] || 'from-blue-500 to-purple-500'

                        return (
                            <motion.div
                                key={ch.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`h-1.5 bg-gradient-to-r ${colorClass}`} />

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg dark:text-white">{ch.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{ch.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleJoin(ch.id)}
                                            className={`ml-3 flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${isJoined
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                }`}
                                        >
                                            {isJoined ? <><CheckCircle className="h-4 w-4" /> Unido</> : 'Unirse'}
                                        </button>
                                    </div>

                                    {isJoined && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Tu progreso</span>
                                                <span className="font-bold">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.8 }}
                                                    className={`h-2 rounded-full bg-gradient-to-r ${colorClass}`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {daysLeft} días restantes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="h-3.5 w-3.5" />
                                            Meta: {ch.goalValue} {goalTypeLabel[ch.goalType]}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            {Math.floor(Math.random() * 30) + 5} participantes
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
