import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only')

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { payload } = await jwtVerify(token, JWT_SECRET)
        if (payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const users = await prisma.user.findMany({
            include: {
                checkIns: {
                    orderBy: { date: 'desc' },
                    take: 1
                },
                _count: {
                    select: { workouts: true, checkIns: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const detailedUsers = users.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            level: user.level,
            xp: user.xp,
            workoutsCount: user._count?.workouts || 0,
            checkInsCount: user._count?.checkIns || 0,
            lastCheckIn: user.checkIns?.[0]?.date || null,
            isVerified: user.isVerified
        }))

        return NextResponse.json(detailedUsers)
    } catch (error) {
        console.error('Admin users fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
