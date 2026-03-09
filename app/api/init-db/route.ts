import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // Check if the gyms exist
        const gym1Id = 'demo-gym-1'
        const gym2Id = 'demo-gym-2'

        await prisma.gym.upsert({
            where: { id: gym1Id },
            update: {},
            create: {
                id: gym1Id,
                name: 'FitLife Centro',
                description: 'Sucursal principal en el centro',
            }
        })

        await prisma.gym.upsert({
            where: { id: gym2Id },
            update: {},
            create: {
                id: gym2Id,
                name: 'FitLife Norte',
                description: 'Sucursal en la zona norte',
            }
        })

        // Seed a dummy user
        const userId = 'demo-user-1'
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: 'valeria@demo.com',
                name: 'Valeria M.',
                passwordHash: 'hashedpassword',
                gymId: gym1Id,
                xp: 1500,
                level: 5,
                currentStreak: 7,
                longestStreak: 14
            }
        })

        return NextResponse.json({ success: true, message: 'Database verified and seeded successfully.' })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Failed to seed DB' }, { status: 500 })
    }
}
