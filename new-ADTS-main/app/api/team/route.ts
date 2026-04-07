import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureTeamTables } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    await ensureTeamTables()

    const rows = await sql`
      SELECT
        id,
        name,
        position,
        department,
        email,
        phone,
        location,
        status,
        featured,
        image_url,
        bio,
        skills,
        join_date,
        created_at
      FROM team_members
      WHERE status = 'Active'
      ORDER BY COALESCE(join_date, created_at) ASC
    `

    const members = (rows as any[]).map((row) => {
      const skillsText = (row.skills as string) ?? ''

      const skills = skillsText
        ? skillsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      return {
        id: row.id as string,
        name: (row.name as string) ?? '',
        position: (row.position as string) ?? '',
        department: (row.department as string) ?? '',
        email: (row.email as string) ?? '',
        phone: (row.phone as string) ?? '',
        location: (row.location as string) ?? '',
        status: (row.status as string) ?? 'Active',
        featured: Boolean(row.featured),
        imageUrl: (row.image_url as string) ?? '',
        bio: (row.bio as string) ?? '',
        skills,
        joinDate: (row.join_date as string) ?? null,
        createdAt: row.created_at as string,
      }
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Public team list error:', error)
    return NextResponse.json(
      { error: 'Failed to load team members' },
      { status: 500 },
    )
  }
}
