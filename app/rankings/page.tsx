'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Dumbbell, Star, Crown, Medal } from 'lucide-react'
import { useGym } from '../context/GymContext'

interface RankingUser {
    id: string
    name: string
    xp: number
    level: number
    currentStreak: number
    longestStreak: number
    _count: { workouts: number; checkIns: number }
}

export default function RankingsPage() {
    const { gymId } = useGym()
    const [rankings, setRankings] = useState<RankingUser[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'xp' | 'streak' | 'workouts'>('xp')

    useEffect(() => {
        if (gymId) {
            fetch(`/api/rankings?gymId=${gymId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setRankings(data.rankings)
                    setLoading(false)
                })
        }
    }, [gymId])

    const sorted = [...rankings].sort((a, b) => {
        if (activeTab === 'xp') return b.xp - a.xp
        if (activeTab === 'streak') return b.currentStreak - a.currentStreak
        return b._count.workouts - a._count.workouts
    })

    const getRankIcon = (idx: number) => {
        if (idx === 0) return <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400" />
        if (idx === 1) return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />
        if (idx === 2) return <Medal className="h-6 w-6 text-amber-600 fill-amber-600" />
        return <span className="text-gray-400 font-bold text-lg w-6 text-center">#{idx + 1}</span>
    }

    const getRankBg = (idx: number) => {
        if (idx === 0) return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-400'
        if (idx === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-l-4 border-gray-400'
        if (idx === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 border-l-4 border-amber-600'
        return 'bg-white dark:bg-gray-800'
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                        <h1 className="text-4xl font-black dark:text-white">Rankings</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Clasificación del gimnasio actual</p>
                </motion.div>

                {/* Category tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'xp', label: '⭐ XP Total', },
                        { id: 'streak', label: '🔥 Racha' },
                        { id: 'workouts', label: '💪 Entrenos' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nadie en este gimnasio aún. ¡Sé el primero!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sorted.map((user, idx) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`${getRankBg(idx)} rounded-2xl p-4 shadow-sm flex items-center gap-4`}
                            >
                                {/* Rank */}
                                <div className="w-8 flex items-center justify-center flex-shrink-0">
                                    {getRankIcon(idx)}
                                </div>

                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-slate-400' :
                                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-700' :
                                                'bg-gradient-to-br from-blue-500 to-purple-600'
                                    }`}>
                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold dark:text-white truncate">{user.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-500" />
                                            Nivel {user.level}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Flame className="h-3 w-3 text-orange-500" />
                                            {user.currentStreak} días
                                        </span>
                                    </div>
                                </div>

                                {/* Main metric */}
                                <div className="text-right flex-shrink-0">
                                    {activeTab === 'xp' && <p className="text-2xl font-black text-blue-600">{user.xp}<span className="text-sm font-normal text-gray-400"> XP</span></p>}
                                    {activeTab === 'streak' && <p className="text-2xl font-black text-orange-500">{user.currentStreak}<span className="text-sm font-normal text-gray-400"> d</span></p>}
                                    {activeTab === 'workouts' && <p className="text-2xl font-black text-green-600">{user._count.workouts}<span className="text-sm font-normal text-gray-400"> WOD</span></p>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
