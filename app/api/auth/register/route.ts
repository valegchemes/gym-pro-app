import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const { email, password, name, gymId } = await request.json()

        if (!email || !password || !name || !gymId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                gymId,
                verificationCode,
                isVerified: false,
                role: 'MEMBER'
            }
        })

        // In a real app, send email here. For now, we log it.
        console.log(`[AUTH] Verification code for ${email}: ${verificationCode}`)

        return NextResponse.json({
            success: true,
            message: 'User registered. Please verify your email.',
            userId: user.id
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
