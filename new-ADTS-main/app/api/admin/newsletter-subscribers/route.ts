import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureBlogTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await ensureBlogTables()

    const rows = await sql`
      SELECT 
        id,
        email,
        name,
        status,
        subscribed_at,
        created_at
      FROM newsletter_subscribers
      ORDER BY subscribed_at DESC
    `

    const subscribers = (rows as any[]).map((row) => ({
      id: row.id as string,
      email: row.email as string,
      name: (row.name as string) || null,
      status: row.status as string,
      subscribed_at: row.subscribed_at as string,
      created_at: row.created_at as string,
    }))

    const response = NextResponse.json({ subscribers })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Newsletter subscribers list error:', error)
    return NextResponse.json(
      { error: 'Failed to load subscribers' },
      { status: 500 }
    )
  }
}
