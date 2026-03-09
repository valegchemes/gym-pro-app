'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Calendar, Dumbbell, Trophy,
    TrendingUp, Clock, Mail, Shield,
    ChevronRight, Award, Zap
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function UserDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/admin/users/${id}`)
            .then(res => res.json())
            .then(resData => {
                if (!resData.error) setData(resData)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!data) return <div className="p-20 text-center">Usuario no encontrado.</div>

    const statusColors = {
        'Active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'At Risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        'Inactive': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/admin/users"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-500 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Miembros
                </Link>

                {/* User Profile Header */}
                <header className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="h-24 w-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-blue-500/20">
                            {data.profile.name.charAt(0)}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-3xl font-black">{data.profile.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto md:mx-0 ${statusColors[data.analytics.status as keyof typeof statusColors]}`}>
                                    {data.analytics.status === 'Active' ? 'Activo' : data.analytics.status === 'At Risk' ? 'En Riesgo' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center"><Mail className="h-4 w-4 mr-1.5" /> {data.profile.email}</div>
                                <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> Miembro desde {new Date(data.profile.createdAt).toLocaleDateString()}</div>
                                <div className="flex items-center font-bold text-blue-600"><Shield className="h-4 w-4 mr-1.5" /> {data.profile.role}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="text-center px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <p className="text-2xl font-black text-blue-600">{data.profile.level}</p>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Nivel</p>
                            </div>
                            <div className="text-center px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <p className="text-2xl font-black text-amber-500">🔥{data.profile.currentStreak}</p>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Racha</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Analytics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Visitas Totales', value: data.analytics.totalCheckIns, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Entrenos', value: data.analytics.totalWorkouts, icon: Dumbbell, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                        { label: 'Días ausente', value: data.analytics.daysSinceLastVisit ?? 'N/A', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                        { label: 'Puntos XP', value: data.profile.xp, icon: Zap, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
                        >
                            <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-black">{stat.value}</p>
                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content: History */}
                    <div className="md:col-span-2 space-y-8">
                        {/* History Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                                    Historial Reciente
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {data.history.workouts.length === 0 ? (
                                    <div className="p-10 text-center text-gray-500">No hay entrenamientos registrados.</div>
                                ) : (
                                    data.history.workouts.slice(0, 5).map((w: any) => (
                                        <div key={w.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                    <Dumbbell className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{w.name}</p>
                                                    <p className="text-xs text-gray-500">{new Date(w.date).toLocaleDateString()} • {w.muscle}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-400">{w.setsCount} series</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Challenges & Verified */}
                    <div className="space-y-8">
                        {/* Challenges Card */}
                        <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                                Retos Gym
                            </h3>
                            <div className="space-y-4">
                                {data.challenges.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No participa en retos.</p>
                                ) : (
                                    data.challenges.map((c: any) => (
                                        <div key={c.id}>
                                            <div className="flex justify-between text-xs mb-1.5">
                                                <span className="font-medium">{c.name}</span>
                                                <span className="font-black text-blue-600">{Math.round((c.progress / c.goalValue) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${c.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(c.progress / c.goalValue) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Verification Status */}
                        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    {data.profile.isVerified ? <Award className="h-6 w-6" /> : <Shield className="h-6 w-6 opacity-50" />}
                                </div>
                                <div>
                                    <h4 className="font-bold">Estatus de Cuenta</h4>
                                    <p className="text-xs opacity-80">{data.profile.isVerified ? 'Verificada y Autenticada' : 'Pendiente de Verificación'}</p>
                                </div>
                            </div>
                            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                                {data.profile.isVerified ? 'Ver Certificados' : 'Reenviar Invitación'}
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
