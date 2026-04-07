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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTeamTables()
    await requireAdmin(request)

    const { id } = await params
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
      UPDATE team_members
      SET
        name = ${name},
        position = ${position ?? ''},
        department = ${department ?? ''},
        email = ${email ?? ''},
        phone = ${phone ?? ''},
        location = ${location ?? ''},
        status = ${dbStatus},
        featured = ${isFeatured},
        image_url = ${image ?? ''},
        bio = ${bio ?? ''},
        skills = ${skillsText},
        join_date = ${joinDate || null},
        updated_at = NOW()
      WHERE id = ${id}
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

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const updatedName = (row.name as string) ?? ''
    const updatedStatus = (row.status as string) ?? 'Active'
    const updatedSkillsText = (row.skills as string) ?? ''
    const updatedSkills = updatedSkillsText
      ? updatedSkillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    const initials =
      updatedName
        .split(' ')
        .filter(Boolean)
        .map((part: string) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('') || 'TM'

    const member = {
      id: row.id as string,
      name: updatedName,
      position: (row.position as string) ?? '',
      department: (row.department as string) ?? '',
      email: (row.email as string) ?? '',
      phone: (row.phone as string) ?? '',
      location: (row.location as string) ?? '',
      status: updatedStatus,
      featured: Boolean(row.featured),
      image: (row.image_url as string) ?? '',
      avatar: initials,
      bio: (row.bio as string) ?? '',
      skills: updatedSkills,
      joinDate: (row.join_date as string) ?? null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ member })
  } catch (error: any) {
    console.error('Team update error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTeamTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM team_members
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Team delete error:', error)

    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
