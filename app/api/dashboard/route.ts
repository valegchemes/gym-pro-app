import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const gymId = searchParams.get('gymId')
        if (!gymId) return NextResponse.json({ error: 'Missing gymId' }, { status: 400 })

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Total members
        const totalMembers = await prisma.user.count({ where: { gymId } })

        // Active last 7 days (check-in or workout)
        const activeUsers7d = await prisma.user.count({
            where: {
                gymId,
                OR: [
                    { checkIns: { some: { date: { gte: sevenDaysAgo } } } },
                    { workouts: { some: { date: { gte: sevenDaysAgo } } } },
                ]
            }
        })

        // Active last 30 days
        const activeUsers30d = await prisma.user.count({
            where: {
                gymId,
                OR: [
                    { checkIns: { some: { date: { gte: thirtyDaysAgo } } } },
                    { workouts: { some: { date: { gte: thirtyDaysAgo } } } },
                ]
            }
        })

        // Churn risk: members with no activity in last 14 days
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        const churnRiskUsers = await prisma.user.findMany({
            where: {
                gymId,
                AND: [
                    { checkIns: { none: { date: { gte: fourteenDaysAgo } } } },
                    { workouts: { none: { date: { gte: fourteenDaysAgo } } } },
                ]
            },
            select: {
                id: true, name: true, email: true, lastCheckIn: true,
                currentStreak: true, longestStreak: true
            }
        })

        // Total workouts in last 30 days
        const totalWorkouts30d = await prisma.workout.count({
            where: {
                gym: { id: gymId },
                date: { gte: thirtyDaysAgo }
            }
        })

        // Total check-ins in last 30 days
        const totalCheckIns30d = await prisma.checkIn.count({
            where: {
                gymId,
                date: { gte: thirtyDaysAgo }
            }
        })

        // Top 5 most active members
        const topMembers = await prisma.user.findMany({
            where: { gymId },
            select: {
                id: true, name: true, xp: true, level: true, currentStreak: true,
                _count: { select: { workouts: true } }
            },
            orderBy: { xp: 'desc' },
            take: 5
        })

        // Social posts in last 7 days (engagement)
        const recentPosts = await prisma.socialPost.count({
            where: { gymId, date: { gte: sevenDaysAgo } }
        })

        const churnRate = totalMembers > 0
            ? Math.round((churnRiskUsers.length / totalMembers) * 100)
            : 0

        const retentionRate7d = totalMembers > 0
            ? Math.round((activeUsers7d / totalMembers) * 100)
            : 0

        return NextResponse.json({
            success: true,
            stats: {
                totalMembers,
                activeUsers7d,
                activeUsers30d,
                retentionRate7d,
                churnRiskCount: churnRiskUsers.length,
                churnRate,
                totalWorkouts30d,
                totalCheckIns30d,
                recentPosts,
                topMembers,
                churnRiskUsers,
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
