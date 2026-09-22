import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const payload = await verifyAdminToken(token)

    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        fullName: payload.name || "Admin User",
        role: payload.role ?? 'admin',
      },
    })
  } catch (error) {
    console.error('Admin me error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
