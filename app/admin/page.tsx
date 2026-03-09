'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGym } from '../context/GymContext'
import {
    Users, TrendingUp, AlertTriangle, Crown, Flame,
    Dumbbell, Calendar, Activity, BarChart2, Shield
} from 'lucide-react'

interface DashboardStats {
    totalMembers: number
    activeUsers7d: number
    activeUsers30d: number
    retentionRate7d: number
    churnRiskCount: number
    churnRate: number
    totalWorkouts30d: number
    totalCheckIns30d: number
    recentPosts: number
    topMembers: { id: string; name: string; xp: number; level: number; currentStreak: number; _count: { workouts: number } }[]
    churnRiskUsers: { id: string; name: string; email: string; lastCheckIn: string | null; currentStreak: number }[]
}

export default function OwnerDashboard() {
    const { gymId } = useGym()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState<'overview' | 'retention' | 'members'>('overview')

    useEffect(() => {
        if (gymId) {
            fetch(`/api/dashboard?gymId=${gymId}`)
                .then(r => r.json())
                .then(data => {
                    if (data.success) setStats(data.stats)
                    setLoading(false)
                })
        }
    }, [gymId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />
            </div>
        )
    }

    const kpis = [
        { label: 'Miembros Totales', value: stats?.totalMembers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+12%' },
        { label: 'Activos (7 días)', value: stats?.activeUsers7d ?? 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trend: `${stats?.retentionRate7d ?? 0}%` },
        { label: 'Riesgo de churn', value: stats?.churnRiskCount ?? 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', trend: `${stats?.churnRate ?? 0}%` },
        { label: 'Entrenamientos/mes', value: stats?.totalWorkouts30d ?? 0, icon: Dumbbell, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '' },
        { label: 'Check-ins/mes', value: stats?.totalCheckIns30d ?? 0, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: '' },
        { label: 'Posts sociales (7d)', value: stats?.recentPosts ?? 0, icon: BarChart2, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20', trend: '' },
    ]

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black dark:text-white">Panel de Administración</h1>
                            <p className="text-gray-500 text-sm">Gym: {gymId}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'overview', label: '📊 Resumen' },
                        { id: 'retention', label: '⚠️ Retención y Churn' },
                        { id: 'members', label: '🏆 Top Miembros' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${activeSection === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >{tab.label}</button>
                    ))}
                </div>

                {/* Overview */}
                {activeSection === 'overview' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {kpis.map((kpi, idx) => {
                            const Icon = kpi.icon
                            return (
                                <motion.div
                                    key={kpi.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.07 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
                                >
                                    <div className={`${kpi.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                        <Icon className={`h-5 w-5 ${kpi.color}`} />
                                    </div>
                                    <p className="text-3xl font-black dark:text-white">{kpi.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</p>
                                    {kpi.trend && (
                                        <span className={`text-xs font-bold mt-1 inline-block ${kpi.label.includes('churn') ? 'text-red-500' : 'text-green-500'
                                            }`}>{kpi.trend}</span>
                                    )}
                                </motion.div>
                            )
                        })}

                        {/* Retention Visual */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="col-span-2 md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                        >
                            <h3 className="font-bold text-lg dark:text-white mb-4">Retención de miembros (30 días)</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Muy Activos (7d)', count: stats?.activeUsers7d ?? 0, total: stats?.totalMembers ?? 1, color: 'bg-green-500' },
                                    { label: 'Activos (30d)', count: stats?.activeUsers30d ?? 0, total: stats?.totalMembers ?? 1, color: 'bg-blue-500' },
                                    { label: 'En riesgo', count: stats?.churnRiskCount ?? 0, total: stats?.totalMembers ?? 1, color: 'bg-red-500' },
                                ].map(bar => {
                                    const pct = Math.round((bar.count / bar.total) * 100)
                                    return (
                                        <div key={bar.label}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">{bar.label}</span>
                                                <span className="font-bold dark:text-white">{bar.count} ({pct}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className={`${bar.color} h-3 rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Retention / Churn */}
                {activeSection === 'retention' && (
                    <div>
                        {/* Alert Banner */}
                        {(stats?.churnRiskCount ?? 0) > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 flex items-start gap-4"
                            >
                                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-red-800 dark:text-red-300">⚠️ {stats?.churnRiskCount} miembros en riesgo de abandono</h3>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        Estos miembros no han hecho check-in ni entrenado en los últimos 14 días. Contactarlos podría reducir el churn.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Churn Risk Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-lg dark:text-white">Miembros en riesgo</h3>
                                <p className="text-sm text-gray-500 mt-1">Sin actividad en los últimos 14 días</p>
                            </div>

                            {(stats?.churnRiskUsers.length ?? 0) === 0 ? (
                                <div className="p-10 text-center text-gray-500">
                                    ✅ ¡Sin miembros en riesgo! Todos han estado activos recientemente.
                                </div>
                            ) : (
                                stats?.churnRiskUsers.map((user, idx) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center font-bold text-red-600">
                                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Último acceso</p>
                                            <p className="text-xs font-semibold text-red-500">
                                                {user.lastCheckIn ? new Date(user.lastCheckIn).toLocaleDateString('es-ES') : 'Nunca'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Top Members */}
                {activeSection === 'members' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-lg dark:text-white">🏆 Top miembros</h3>
                        </div>
                        {stats?.topMembers.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-4 p-5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                                <span className="text-2xl font-black text-gray-300 w-8">
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                </span>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold dark:text-white">{member.name}</p>
                                    <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                                        <span>Nivel {member.level}</span>
                                        <span>🔥 {member.currentStreak} días</span>
                                        <span>💪 {member._count.workouts} entrenos</span>
                                    </div>
                                </div>
                                <p className="text-xl font-black text-blue-600">{member.xp} <span className="text-xs font-normal text-gray-400">XP</span></p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
