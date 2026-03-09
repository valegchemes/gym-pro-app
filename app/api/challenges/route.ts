import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const gymId = searchParams.get('gymId')
        if (!gymId) return NextResponse.json({ error: 'Missing gymId' }, { status: 400 })

        const challenges = await prisma.challenge.findMany({
            where: { gymId },
            orderBy: { startDate: 'desc' }
        })
        return NextResponse.json({ success: true, challenges })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { gymId, name, description, startDate, endDate, goalType, goalValue } = await request.json()
        if (!gymId || !name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

        const challenge = await prisma.challenge.create({
            data: {
                gymId,
                name,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                goalType,
                goalValue: Number(goalValue)
            }
        })
        return NextResponse.json({ success: true, challenge })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
