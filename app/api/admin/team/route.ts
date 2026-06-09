import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureTeamTables } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export const runtime = 'nodejs'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error('Unauthorized')
  }

  const payload = await verifyAdminToken(token)
  return payload
}

export async function GET(request: NextRequest) {
  try {
    await ensureTeamTables()
    await requireAdmin(request)

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
        created_at,
        updated_at
      FROM team_members
      ORDER BY created_at DESC
    `

    const members = (rows as any[]).map((row) => {
      const name = (row.name as string) ?? ''
      const status = (row.status as string) ?? 'Active'
      const skillsText = (row.skills as string) ?? ''

      const skills = skillsText
        ? skillsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      const initials =
        name
          .split(' ')
          .filter(Boolean)
          .map((part: string) => part[0]?.toUpperCase())
          .slice(0, 2)
          .join('') || 'TM'

      return {
        id: row.id as string,
        name,
        position: (row.position as string) ?? '',
        department: (row.department as string) ?? '',
        email: (row.email as string) ?? '',
        phone: (row.phone as string) ?? '',
        location: (row.location as string) ?? '',
        status,
        featured: Boolean(row.featured),
        image: (row.image_url as string) ?? '',
        avatar: initials,
        bio: (row.bio as string) ?? '',
        skills,
        joinDate: (row.join_date as string) ?? null,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      }
    })

    return NextResponse.json({ members })
  } catch (error: any) {
    console.error('Team list error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to load team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTeamTables()
    await requireAdmin(request)

    const body = await request.json()
    const {
      name,
      position,
      department,
      email,
      phone,
      location,
      status,
      featured,
      image,
      bio,
      skills,
      joinDate,
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 },
      )
    }

    const dbStatus =
      status === 'Active' || status === 'On Leave' || status === 'Inactive'
        ? status
        : 'Active'
    const isFeatured = Boolean(featured)
    const skillsText = (skills as string | undefined) ?? ''

    const rows = await sql`
      INSERT INTO team_members (
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
        created_at,
        updated_at
      ) VALUES (
        ${name},
        ${position ?? ''},
        ${department ?? ''},
        ${email ?? ''},
        ${phone ?? ''},
        ${location ?? ''},
        ${dbStatus},
        ${isFeatured},
        ${image ?? ''},
        ${bio ?? ''},
        ${skillsText},
        ${joinDate || null},
        NOW(),
        NOW()
      )
      RETURNING
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
        created_at,
        updated_at
    `

    const row = (rows as any[])[0]

    const createdName = (row.name as string) ?? ''
    const createdStatus = (row.status as string) ?? 'Active'
    const createdSkillsText = (row.skills as string) ?? ''
    const createdSkills = createdSkillsText
      ? createdSkillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    const initials =
      createdName
        .split(' ')
        .filter(Boolean)
        .map((part: string) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('') || 'TM'

    const member = {
      id: row.id as string,
      name: createdName,
      position: (row.position as string) ?? '',
      department: (row.department as string) ?? '',
      email: (row.email as string) ?? '',
      phone: (row.phone as string) ?? '',
      location: (row.location as string) ?? '',
      status: createdStatus,
      featured: Boolean(row.featured),
      image: (row.image_url as string) ?? '',
      avatar: initials,
      bio: (row.bio as string) ?? '',
      skills: createdSkills,
      joinDate: (row.join_date as string) ?? null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ member }, { status: 201 })
  } catch (error: any) {
    console.error('Team create error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
