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

        // Seed a challenge
        const challengeId = 'demo-challenge-id'
        const challenge = await prisma.challenge.upsert({
            where: { id: challengeId },
            update: {},
            create: {
                id: challengeId,
                name: 'Guerra de Calorías',
                description: 'Quema 5000 kcal esta semana',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                goalType: 'CALORIES',
                goalValue: 5000,
                gymId: gym1Id
            }
        })

        // Connect member to challenge
        await prisma.userChallenge.upsert({
            where: { userId_challengeId: { userId: memberId, challengeId: challenge.id } },
            update: {},
            create: {
                userId: memberId,
                challengeId: challenge.id,
                progress: 2450,
                isCompleted: false
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Database verified and seeded with Auth-ready accounts and challenges.',
            adminAccount: adminEmail,
            memberAccount: memberEmail
        })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Failed to seed DB' }, { status: 500 })
    }
}
