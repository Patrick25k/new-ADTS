import { NextRequest, NextResponse } from "next/server"
import { sql, ensureContactsTables } from "@/lib/db"
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth-tokens"

export const runtime = "nodejs"

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
  if (!token) {
    throw new Error("Unauthorized")
  }

  const payload = await verifyAdminToken(token)
  return payload
}

export async function GET(request: NextRequest) {
  try {
    await ensureContactsTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        subject,
        message,
        category,
        location,
        organization,
        status,
        priority,
        created_at,
        updated_at
      FROM contact_messages
      ORDER BY created_at DESC
    `

    const contacts = (rows as any[]).map((row) => ({
      id: row.id as string,
      name: (row.name as string) ?? "",
      email: (row.email as string) ?? "",
      phone: (row.phone as string) ?? "",
      subject: (row.subject as string) ?? "",
      message: (row.message as string) ?? "",
      category: (row.category as string) ?? "",
      location: (row.location as string) ?? "",
      organization: (row.organization as string) ?? "",
      status: (row.status as string) ?? "Unread",
      priority: (row.priority as string) ?? "Medium",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }))

    return NextResponse.json({ contacts })
  } catch (error: any) {
    console.error("Contacts list error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to load contacts" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureContactsTables()
    await requireAdmin(request)

    const body = await request.json()
    const { id, status, priority } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const dbStatus =
      status === "Unread" || status === "Read" || status === "Replied"
        ? status
        : "Unread"

    const dbPriority =
      priority === "High" || priority === "Low" || priority === "Medium"
        ? priority
        : "Medium"

    const rows = await sql`
      UPDATE contact_messages
      SET
        status = ${dbStatus},
        priority = ${dbPriority},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
        id,
        name,
        email,
        phone,
        subject,
        message,
        category,
        location,
        organization,
        status,
        priority,
        created_at,
        updated_at
    `

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const contact = {
      id: row.id as string,
      name: (row.name as string) ?? "",
      email: (row.email as string) ?? "",
      phone: (row.phone as string) ?? "",
      subject: (row.subject as string) ?? "",
      message: (row.message as string) ?? "",
      category: (row.category as string) ?? "",
      location: (row.location as string) ?? "",
      organization: (row.organization as string) ?? "",
      status: (row.status as string) ?? "Unread",
      priority: (row.priority as string) ?? "Medium",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ contact })
  } catch (error: any) {
    console.error("Contact update error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureContactsTables()
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact delete error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 },
    )
  }
}
