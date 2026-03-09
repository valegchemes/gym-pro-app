import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const gymId = searchParams.get('gymId')

        if (!gymId) {
            return NextResponse.json({ error: 'Missing gymId' }, { status: 400 })
        }

        const posts = await prisma.socialPost.findMany({
            where: { gymId },
            include: {
                user: {
                    select: { name: true, level: true, id: true }
                }
            },
            orderBy: { date: 'desc' },
            take: 10
        })

        return NextResponse.json({ success: true, posts })
    } catch (error) {
        console.error('Error fetching feed:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
