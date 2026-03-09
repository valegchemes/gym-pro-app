import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only')

export async function getSessionUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) return null

        const { payload } = await jwtVerify(token, JWT_SECRET)

        if (!payload || !payload.userId) return null

        return {
            id: payload.userId as string,
            email: payload.email as string,
            role: (payload.role as string) || 'MEMBER'
        }
    } catch (error) {
        console.error('Session verify error:', error)
        return null
    }
}
