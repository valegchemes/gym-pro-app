import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const gymId = searchParams.get('gymId')

        if (!gymId) {
            return NextResponse.json({ error: 'Missing gymId' }, { status: 400 })
        }

        // Get all users in this gym with XP ranking
        const users = await prisma.user.findMany({
            where: { gymId },
            select: {
                id: true,
                name: true,
                xp: true,
                level: true,
                currentStreak: true,
                longestStreak: true,
                _count: { select: { workouts: true, checkIns: true } },
            },
            orderBy: { xp: 'desc' },
            take: 20,
        })

        return NextResponse.json({ success: true, rankings: users })
    } catch (error) {
        console.error('Error fetching rankings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
