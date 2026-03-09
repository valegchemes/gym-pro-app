'use client'

import { useGym } from '../context/GymContext'
import { MapPin } from 'lucide-react'

// Mock gyms for now, later we would fetch this from the database or API
const GYMS = [
    { id: 'demo-gym-1', name: 'FitLife Centro' },
    { id: 'demo-gym-2', name: 'FitLife Norte' },
]

export default function Header() {
    const { gymId, setGymId } = useGym()

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <span className="text-white font-black italic tracking-tighter">GP</span>
                    </div>
                    <span className="font-bold text-xl hidden sm:block dark:text-white">GymPro</span>
                </div>

                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 py-1.5 px-3 rounded-full">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <select
                        value={gymId}
                        onChange={(e) => setGymId(e.target.value)}
                        className="bg-transparent text-sm font-medium border-none outline-none focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200 cursor-pointer"
                    >
                        {GYMS.map(gym => (
                            <option key={gym.id} value={gym.id} className="bg-white dark:bg-gray-800 dark:text-white">{gym.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    )
}
