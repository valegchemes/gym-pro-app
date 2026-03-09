'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, BarChart3, AlertCircle, Search,
    ArrowUpRight, Mail, Calendar, Award,
    ChevronRight, Filter, Download
} from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setUsers(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        if (filter === 'all') return matchesSearch
        if (filter === 'unverified') return matchesSearch && !user.isVerified
        if (filter === 'admin') return matchesSearch && user.role === 'ADMIN'
        return matchesSearch
    })

    return (
        <div className="min-h-screen pt-20 md:pt-24 px-4 pb-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Miembros</h1>
                    <p className="text-gray-600 dark:text-gray-400">Analiza el comportamiento y progreso de tus usuarios</p>
                </header>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-none rounded-xl shadow-sm px-4 py-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los Miembros</option>
                            <option value="unverified">No Verificados</option>
                            <option value="admin">Administradores</option>
                        </select>
                        <button className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500 hover:text-blue-500 transition-colors">
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Users Table / List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando miembros...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Usuario</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actividad</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Progreso</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <AnimatePresence>
                                        {filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isVerified
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        }`}>
                                                        {user.isVerified ? 'Verificado' : 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="text-gray-900 dark:text-white">Última: {user.lastCheckIn ? new Date(user.lastCheckIn).toLocaleDateString() : 'Nunca'}</p>
                                                        <p className="text-xs text-gray-500">{user.checkInsCount} visitas totales</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden max-w-[100px]">
                                                            <div
                                                                className="h-full bg-blue-500"
                                                                style={{ width: `${(user.xp % 1000) / 10}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Nv.{user.level}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={`/admin/users/${user.id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors inline-block"
                                                    >
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="p-20 text-center">
                                    <p className="text-gray-500">No se encontraron usuarios que coincidan con los criterios.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
