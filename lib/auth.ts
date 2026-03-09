import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only')

export async function getSessionUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth-token')?.value

        if (!token) return null

        const { payload } = await jwtVerify(token, JWT_SECRET)
        return {
            id: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string
        }
    } catch (error) {
        return null
    }
}
