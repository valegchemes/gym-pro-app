import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || 'demo-user-1'

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                achievements: { include: { achievement: true } },
                records: { include: { exercise: true }, orderBy: { date: 'desc' }, take: 5 },
                workouts: { orderBy: { date: 'desc' }, take: 30 },
                checkIns: { orderBy: { date: 'desc' }, take: 30 },
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Calculate level XP progress
        const xpPerLevel = 1000
        const currentLevelXp = user.xp % xpPerLevel
        const xpToNextLevel = xpPerLevel - currentLevelXp

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                xp: user.xp,
                level: user.level,
                currentLevelXp,
                xpToNextLevel,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                lastCheckIn: user.lastCheckIn,
                totalWorkouts: user.workouts.length,
                totalCheckIns: user.checkIns.length,
                achievements: user.achievements.map(ua => ({
                    id: ua.id,
                    name: ua.achievement.name,
                    description: ua.achievement.description,
                    icon: ua.achievement.icon,
                    xpReward: ua.achievement.xpReward,
                    date: ua.date,
                })),
                personalRecords: user.records.map(pr => ({
                    exerciseName: pr.exercise.name,
                    weight: pr.weight,
                    date: pr.date,
                })),
            }
        })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
