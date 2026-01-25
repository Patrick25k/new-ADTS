import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureAdminTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Ensure the admin_users table exists
    await ensureAdminTables()
    
    // Seed admin if none exists (idempotent)
    const existingCheck = await sql`SELECT id FROM admin_users LIMIT 1`
    if (existingCheck.length === 0) {
      const { seedAdmin } = await import('@/lib/db')
      await seedAdmin()
    }

    // Fetch all admin users from the database
    const rows = await sql`
      SELECT 
        id,
        email,
        full_name,
        role,
        is_active,
        created_at
      FROM admin_users
      ORDER BY created_at DESC
    `

    const users = (rows as any[]).map((row) => ({
      id: row.id as string,
      email: row.email as string,
      full_name: row.full_name as string || null,
      role: row.role as string || 'Admin',
      is_active: Boolean(row.is_active),
      created_at: row.created_at as string,
    }))

    const response = NextResponse.json({ users })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json(
      { error: 'Failed to load admin users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
