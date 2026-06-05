import { NextRequest, NextResponse } from 'next/server'
import { sql, ensureAdminTables, ensureUserInvitationsTable } from '@/lib/db'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'
import { createTransporter, invitationEmailTemplate, formatRwandaTime } from '@/lib/email'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

async function requireSuperAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) throw new Error('Unauthorized')

  const payload = await verifyAdminToken(token)

  // Always check the DB role — the JWT role may be stale if the role was
  // updated after the user last logged in (e.g. SUPER_ADMIN_EMAIL migration).
  const rows = await sql`
    SELECT role FROM admin_users WHERE id = ${payload.sub as string} LIMIT 1
  `
  if (rows.length === 0) throw new Error('Unauthorized')
  if (rows[0].role !== 'super_admin') throw new Error('Forbidden')

  return { ...payload, role: rows[0].role as string }
}

function buildBaseUrl(request: NextRequest): string {
  // Use explicit env override if set
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL

  const host = request.headers.get('host') ?? 'localhost:3000'
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')
  return isLocal ? `http://${host}` : `https://${host}`
}

export async function GET(request: NextRequest) {
  try {
    await ensureAdminTables()

    const rows = await sql`
      SELECT id, email, full_name, role, is_active, created_at
      FROM admin_users
      ORDER BY created_at DESC
    `

    const users = (rows as any[]).map((row) => ({
      id: row.id as string,
      email: row.email as string,
      full_name: (row.full_name as string) || null,
      role: (row.role as string) || 'admin',
      is_active: Boolean(row.is_active),
      created_at: row.created_at as string,
    }))

    const response = NextResponse.json({ users })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json({ error: 'Failed to load admin users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requester = await requireSuperAdmin(request)
    await ensureAdminTables()
    await ensureUserInvitationsTable()

    const { email, full_name, role } = await request.json()

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 })
    }

    const validRoles = ['admin', 'super_admin']
    const assignedRole = validRoles.includes(role) ? role : 'admin'

    // Check email isn't already taken
    const existing = await sql`SELECT id FROM admin_users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    // Create the user with a random unusable password (they must set it via invitation)
    const randomHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)

    const inserted = await sql`
      INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
      VALUES (${email}, ${randomHash}, ${full_name}, ${assignedRole}, FALSE)
      RETURNING id, email, full_name, role, is_active, created_at
    `
    const newUser = inserted[0]

    // Generate a secure 72-hour invitation token
    const token = crypto.randomBytes(40).toString('hex')
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)

    await sql`
      INSERT INTO user_invitations (admin_user_id, token, expires_at)
      VALUES (${newUser.id}, ${token}, ${expiresAt.toISOString()})
    `

    // Build the set-password URL — http for localhost, https for production
    const setPasswordUrl = `${buildBaseUrl(request)}/admin/set-password?token=${token}`

    const sentAt = formatRwandaTime()
    const inviterName = requester.name || requester.email

    // Send invitation email
    let emailSent = false
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"ADTS Rwanda" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'You have been invited to ADTS Rwanda Admin Portal',
        html: invitationEmailTemplate(full_name, setPasswordUrl, inviterName, sentAt),
      })
      emailSent = true
      console.log(`✅ Invitation email sent to ${email}`)
    } catch (emailErr) {
      console.error('❌ Failed to send invitation email:', emailErr)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        is_active: newUser.is_active,
        created_at: newUser.created_at,
      },
      emailSent,
      ...(process.env.NODE_ENV === 'development' && !emailSent ? { devSetPasswordUrl: setPasswordUrl } : {}),
    }, { status: 201 })
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error?.message === 'Forbidden') {
      return NextResponse.json({ error: 'Only super admins can create new admin users' }, { status: 403 })
    }
    console.error('Create admin user error:', error)
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
  }
}
