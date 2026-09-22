import { NextResponse } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: ADMIN_TOKEN_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  })

  return response
}
