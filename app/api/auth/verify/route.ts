import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json()

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Missing email or code' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        if (user.verificationCode !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            )
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationCode: null
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Account verified successfully'
        })
    } catch (error) {
        console.error('Verification error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
