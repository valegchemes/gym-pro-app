import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

        // Seed a real Admin user
        const adminId = 'admin-user-id'
        const adminEmail = 'admin@gympro.com'
        const adminPasswordHash = await bcrypt.hash('admin123', 10)

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                id: adminId,
                email: adminEmail,
                name: 'Gym Owner',
                passwordHash: adminPasswordHash,
                gymId: gym1Id,
                role: 'ADMIN',
                isVerified: true,
                xp: 5000,
                level: 10
            }
        })

        // Seed a demo member
        const memberId = 'demo-member-id'
        const memberEmail = 'member@example.com'
        const memberPasswordHash = await bcrypt.hash('member123', 10)

        await prisma.user.upsert({
            where: { email: memberEmail },
            update: {},
            create: {
                id: memberId,
                email: memberEmail,
                name: 'Carlos Pérez',
                passwordHash: memberPasswordHash,
                gymId: gym1Id,
                role: 'MEMBER',
                isVerified: true,
                xp: 850,
                level: 2,
                currentStreak: 5
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Database verified and seeded with Auth-ready accounts.',
            adminAccount: adminEmail,
            memberAccount: memberEmail
        })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Failed to seed DB' }, { status: 500 })
    }
}
