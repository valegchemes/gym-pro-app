import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    try {
        // CLEAR DATABASE (Except Gyms/Exercises if we want to keep them, but let's clear users)
        await prisma.userChallenge.deleteMany()
        await prisma.userAchievement.deleteMany()
        await prisma.personalRecord.deleteMany()
        await prisma.workoutSet.deleteMany()
        await prisma.workout.deleteMany()
        await prisma.socialPost.deleteMany()
        await prisma.checkIn.deleteMany()
        await prisma.user.deleteMany()

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

        // Seed a real Admin user for the owner (Required to access admin panel)
        const adminEmail = 'admin@gympro.com'
        const adminPasswordHash = await bcrypt.hash('admin123', 10)

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'Gym Owner',
                passwordHash: adminPasswordHash,
                gymId: gym1Id,
                role: 'ADMIN',
                isVerified: true,
                xp: 1000,
                level: 1
            }
        })

        // Seed a basic challenge
        const challengeId = 'demo-challenge-id'
        await prisma.challenge.upsert({
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

        return NextResponse.json({
            success: true,
            message: 'Database cleaned and reset successfully. You can now register fresh.',
            adminAccount: adminEmail,
        })

        return NextResponse.json({
            success: true,
            message: 'Database verified and seeded with Auth-ready accounts and challenges.',
            adminAccount: adminEmail,
        })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: 'Failed to seed DB' }, { status: 500 })
    }
}
