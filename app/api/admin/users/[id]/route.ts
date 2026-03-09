import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only')

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const { id } = params

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                checkIns: {
                    orderBy: { date: 'desc' }
                },
                workouts: {
                    orderBy: { date: 'desc' },
                    include: {
                        sets: {
                            include: {
                                exercise: true
                            }
                        }
                    }
                },
                challenges: {
                    include: {
                        challenge: true
                    }
                },
                records: {
                    include: {
                        exercise: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Comprehensive analytics
        const totalCheckIns = user.checkIns.length
        const totalWorkouts = user.workouts.length
        const lastCheckInDate = user.checkIns[0]?.date || null
        const daysSinceLastCheckIn = lastCheckInDate
            ? Math.floor((Date.now() - new Date(lastCheckInDate).getTime()) / (1000 * 60 * 60 * 24))
            : null

        let engagementStatus: 'Active' | 'At Risk' | 'Inactive' = 'Active'
        if (!lastCheckInDate || daysSinceLastCheckIn! > 14) {
            engagementStatus = 'Inactive'
        } else if (daysSinceLastCheckIn! > 7) {
            engagementStatus = 'At Risk'
        }

        return NextResponse.json({
            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                level: user.level,
                xp: user.xp,
                currentStreak: user.currentStreak,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            },
            analytics: {
                totalCheckIns,
                totalWorkouts,
                lastCheckIn: lastCheckInDate,
                daysSinceLastVisit: daysSinceLastCheckIn,
                status: engagementStatus
            },
            history: {
                checkIns: user.checkIns,
                workouts: user.workouts.map(w => ({
                    id: w.id,
                    name: w.name,
                    date: w.date,
                    setsCount: w.sets.length,
                    muscle: w.sets[0]?.exercise.targetMuscle || 'N/A'
                }))
            },
            challenges: user.challenges.map(c => ({
                id: c.challenge.id,
                name: c.challenge.name,
                isCompleted: c.isCompleted,
                progress: c.progress,
                goalValue: c.challenge.goalValue
            }))
        })
    } catch (error) {
        console.error('Admin user detail fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
