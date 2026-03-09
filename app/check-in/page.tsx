'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, CheckCircle, MapPin, Calendar } from 'lucide-react'
import { useGym } from '../context/GymContext'

export default function CheckInPage() {
    const { gymId } = useGym()
    const [isScanning, setIsScanning] = useState(false)
    const [isCheckedIn, setIsCheckedIn] = useState(false)

    const [currentStreak, setCurrentStreak] = useState(0)

    const handleScanClick = async () => {
        setIsScanning(true)

        try {
            const response = await fetch('/api/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gymId, userId: 'demo-user-1' }),
            })

            if (response.ok) {
                const data = await response.json()
                if (data.newStreak) {
                    setCurrentStreak(data.newStreak)
                }
                setIsCheckedIn(true)
            } else {
                alert('Hubo un error al registrar la asistencia')
            }
        } catch (error) {
            alert('Error de conexión')
        } finally {
            setIsScanning(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] pt-6 px-4 pb-6 flex flex-col max-w-md mx-auto relative">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Check-in
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Registra tu asistencia en el gimnasio
                </p>
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {!isCheckedIn ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center border border-gray-100 dark:border-gray-700"
                    >
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-6">
                            <QrCode className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2 dark:text-white">Escáner QR</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[250px]">
                            Escanea el código en la recepción de tu gimnasio para registrar tu asistencia.
                        </p>

                        <button
                            onClick={handleScanClick}
                            disabled={isScanning}
                            className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg flex justify-center items-center space-x-2 ${isScanning
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95'
                                }`}
                        >
                            {isScanning ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    <span>Escaneando...</span>
                                </>
                            ) : (
                                <span>Escanear Código</span>
                            )}
                        </button>

                        <div className="mt-6 flex items-center text-sm text-gray-400 dark:text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            Gimnasio Actual: <strong className="ml-1 text-gray-700 dark:text-gray-300">{gymId}</strong>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full bg-green-500 rounded-3xl p-8 shadow-xl shadow-green-500/20 text-center flex flex-col items-center text-white"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
                        >
                            <CheckCircle className="h-14 w-14 text-green-500" />
                        </motion.div>

                        <h2 className="text-3xl font-bold mb-2">¡Asistencia Registrada!</h2>
                        <p className="text-green-50 mb-8 max-w-[250px]">
                            Excelente trabajo. Sincronizamos tu visita a la ubicación de {gymId}.
                        </p>

                        <div className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex justify-around mb-8">
                            <div className="text-center">
                                <p className="text-sm font-medium opacity-80 mb-1">Día</p>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-bold">{new Date().toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                </div>
                            </div>
                            <div className="w-px bg-white/30"></div>
                            <div className="text-center">
                                <p className="text-sm font-medium opacity-80 mb-1">Racha</p>
                                <div className="flex items-center space-x-1">
                                    <span className="font-bold">{currentStreak} días</span>
                                    <span className="text-xl">🔥</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCheckedIn(false)}
                            className="w-full bg-white text-green-600 font-bold py-4 rounded-2xl transition-transform active:scale-95"
                        >
                            Volver al inicio
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
