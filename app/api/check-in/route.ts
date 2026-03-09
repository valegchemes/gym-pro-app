import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const sessionUser = await getSessionUser()
        const { gymId } = await request.json()

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!gymId) {
            return NextResponse.json(
                { error: 'Missing gymId' },
                { status: 400 }
            )
        }

        const userId = sessionUser.id

        // Register check-in
        const checkIn = await prisma.checkIn.create({
            data: {
                gymId,
                userId,
            },
        })

        // Update user streaks
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        let newStreak = 1
        if (user) {
            const now = new Date()
            newStreak = user.currentStreak

            if (!user.lastCheckIn) {
                newStreak = 1
            } else {
                // simple daily streak logic based on dates formatting
                const lastDate = new Date(user.lastCheckIn).toDateString()
                const todayDate = now.toDateString()

                if (lastDate !== todayDate) {
                    const yesterday = new Date(now)
                    yesterday.setDate(yesterday.getDate() - 1)

                    if (lastDate === yesterday.toDateString()) {
                        newStreak += 1
                    } else {
                        newStreak = 1 // reset streak
                    }
                }
            }

            await prisma.user.update({
                where: { id: userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak: Math.max(newStreak, user.longestStreak),
                    lastCheckIn: now,
                    xp: { increment: 50 } // Reward for checking in
                }
            })
        }

        return NextResponse.json({ success: true, checkIn, newStreak })
    } catch (error) {
        console.error('Error during check-in:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
