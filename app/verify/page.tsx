'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Verification failed')

            router.push('/login?verified=true')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Verifica tu Cuenta
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    Hemos enviado un código al email: <br />
                    <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                            Ingresa el código de 6 dígitos
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full text-center text-4xl tracking-[1em] py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono"
                            placeholder="000000"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center"
                    >
                        {loading ? 'Verificando...' : (
                            <>
                                Confirmar <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        ¿No recibiste el código? <button type="button" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Reenviar</button>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <VerifyContent />
        </Suspense>
    )
}
