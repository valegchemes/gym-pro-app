'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface GymContextType {
    gymId: string
    setGymId: (id: string) => void
}

const GymContext = createContext<GymContextType | undefined>(undefined)

export function GymProvider({ children }: { children: ReactNode }) {
    const [gymId, setGymId] = useState<string>('')

    // On mount, check if there's a saved gymId in localStorage
    useEffect(() => {
        const saved = localStorage.getItem('gymId')
        if (saved) {
            setGymId(saved)
        } else {
            // Default fallback gym ID for the demo if none selected
            const defaultId = 'demo-gym-1'
            setGymId(defaultId)
            localStorage.setItem('gymId', defaultId)
        }
    }, [])

    const handleSetGymId = (id: string) => {
        setGymId(id)
        localStorage.setItem('gymId', id)
    }

    return (
        <GymContext.Provider value={{ gymId, setGymId: handleSetGymId }}>
            {children}
        </GymContext.Provider>
    )
}

export function useGym() {
    const context = useContext(GymContext)
    if (context === undefined) {
        throw new Error('useGym must be used within a GymProvider')
    }
    return context
}
