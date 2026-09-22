import { NextRequest, NextResponse } from "next/server"
import { sql, ensureVolunteersTables } from "@/lib/db"
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

function parseList(text: string | null | undefined): string[] {
  if (!text) return []

  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    await ensureVolunteersTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        location,
        age,
        profession,
        experience,
        skills,
        availability,
        preferred_programs,
        languages,
        motivation,
        status,
        rating,
        hours_committed,
        references_count,
        background_status,
        applied_at,
        created_at,
        updated_at
      FROM volunteers
      ORDER BY applied_at DESC
    `

    const volunteers = (rows as any[]).map((row) => ({
      id: row.id as string,
      name: (row.name as string) ?? "",
      email: (row.email as string) ?? "",
      phone: (row.phone as string) ?? "",
      location: (row.location as string) ?? "",
      age: row.age ? Number(row.age) : null,
      profession: (row.profession as string) ?? "",
      experience: (row.experience as string) ?? "",
      skills: parseList(row.skills as string | null | undefined),
      availability: (row.availability as string) ?? "",
      preferredPrograms: parseList(
        row.preferred_programs as string | null | undefined,
      ),
      languages: parseList(row.languages as string | null | undefined),
      motivation: (row.motivation as string) ?? "",
      status: (row.status as string) ?? "Pending",
      rating: row.rating ? Number(row.rating) : null,
      hoursCommitted: Number(row.hours_committed ?? 0),
      references: Number(row.references_count ?? 0),
      background: (row.background_status as string) ?? "",
      appliedAt: row.applied_at as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }))

    return NextResponse.json({ volunteers })
  } catch (error: any) {
    console.error("Volunteers list error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to load volunteers" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureVolunteersTables()
    await requireAdmin(request)

    const body = await request.json()
    const {
      name,
      email,
      phone,
      location,
      age,
      profession,
      experience,
      skills,
      availability,
      preferredPrograms,
      languages,
      motivation,
      status,
      rating,
      hoursCommitted,
      references,
      background,
      appliedAt,
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      )
    }

    const dbStatus =
      status === "Pending" ||
      status === "Approved" ||
      status === "Rejected" ||
      status === "Active"
        ? status
        : "Pending"

    const ageNumber =
      typeof age === "number" ? age : age ? Number.parseInt(age, 10) : null
    const ratingNumber =
      typeof rating === "number"
        ? rating
        : rating
        ? Number.parseFloat(rating)
        : null
    const hoursNumber =
      typeof hoursCommitted === "number"
        ? hoursCommitted
        : hoursCommitted
        ? Number.parseInt(hoursCommitted, 10)
        : 0
    const refsNumber =
      typeof references === "number"
        ? references
        : references
        ? Number.parseInt(references, 10)
        : 0

    const skillsText =
      Array.isArray(skills) ? skills.join(", ") : (skills as string | "")
    const preferredProgramsText = Array.isArray(preferredPrograms)
      ? preferredPrograms.join(", ")
      : ((preferredPrograms as string | "") ?? "")
    const languagesText =
      Array.isArray(languages) ? languages.join(", ") : (languages as string | "")

    const rows = await sql`
      INSERT INTO volunteers (
        name,
        email,
        phone,
        location,
        age,
        profession,
        experience,
        skills,
        availability,
        preferred_programs,
        languages,
        motivation,
        status,
        rating,
        hours_committed,
        references_count,
        background_status,
        applied_at,
        created_at,
        updated_at
      ) VALUES (
        ${name},
        ${email},
        ${phone ?? ""},
        ${location ?? ""},
        ${ageNumber},
        ${profession ?? ""},
        ${experience ?? ""},
        ${skillsText},
        ${availability ?? ""},
        ${preferredProgramsText},
        ${languagesText},
        ${motivation ?? ""},
        ${dbStatus},
        ${ratingNumber},
        ${hoursNumber},
        ${refsNumber},
        ${background ?? ""},
        ${appliedAt || new Date().toISOString()},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        name,
        email,
        phone,
        location,
        age,
        profession,
        experience,
        skills,
        availability,
        preferred_programs,
        languages,
        motivation,
        status,
        rating,
        hours_committed,
        references_count,
        background_status,
        applied_at,
        created_at,
        updated_at
    `

    const row = (rows as any[])[0]

    const volunteer = {
      id: row.id as string,
      name: (row.name as string) ?? "",
      email: (row.email as string) ?? "",
      phone: (row.phone as string) ?? "",
      location: (row.location as string) ?? "",
      age: row.age ? Number(row.age) : null,
      profession: (row.profession as string) ?? "",
      experience: (row.experience as string) ?? "",
      skills: parseList(row.skills as string | null | undefined),
      availability: (row.availability as string) ?? "",
      preferredPrograms: parseList(
        row.preferred_programs as string | null | undefined,
      ),
      languages: parseList(row.languages as string | null | undefined),
      motivation: (row.motivation as string) ?? "",
      status: (row.status as string) ?? "Pending",
      rating: row.rating ? Number(row.rating) : null,
      hoursCommitted: Number(row.hours_committed ?? 0),
      references: Number(row.references_count ?? 0),
      background: (row.background_status as string) ?? "",
      appliedAt: row.applied_at as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ volunteer }, { status: 201 })
  } catch (error: any) {
    console.error("Volunteer create error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to create volunteer" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureVolunteersTables()
    await requireAdmin(request)

    const body = await request.json()
    const {
      id,
      name,
      email,
      phone,
      location,
      age,
      profession,
      experience,
      skills,
      availability,
      preferredPrograms,
      languages,
      motivation,
      status,
      rating,
      hoursCommitted,
      references,
      background,
    } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const dbStatus =
      status === "Pending" ||
      status === "Approved" ||
      status === "Rejected" ||
      status === "Active"
        ? status
        : "Pending"

    const ageNumber =
      typeof age === "number" ? age : age ? Number.parseInt(age, 10) : null
    const ratingNumber =
      typeof rating === "number"
        ? rating
        : rating
        ? Number.parseFloat(rating)
        : null
    const hoursNumber =
      typeof hoursCommitted === "number"
        ? hoursCommitted
        : hoursCommitted
        ? Number.parseInt(hoursCommitted, 10)
        : 0
    const refsNumber =
      typeof references === "number"
        ? references
        : references
        ? Number.parseInt(references, 10)
        : 0

    const skillsText =
      Array.isArray(skills) ? skills.join(", ") : (skills as string | "")
    const preferredProgramsText = Array.isArray(preferredPrograms)
      ? preferredPrograms.join(", ")
      : ((preferredPrograms as string | "") ?? "")
    const languagesText =
      Array.isArray(languages) ? languages.join(", ") : (languages as string | "")

    const rows = await sql`
      UPDATE volunteers
      SET
        name = ${name ?? ""},
        email = ${email ?? ""},
        phone = ${phone ?? ""},
        location = ${location ?? ""},
        age = ${ageNumber},
        profession = ${profession ?? ""},
        experience = ${experience ?? ""},
        skills = ${skillsText},
        availability = ${availability ?? ""},
        preferred_programs = ${preferredProgramsText},
        languages = ${languagesText},
        motivation = ${motivation ?? ""},
        status = ${dbStatus},
        rating = ${ratingNumber},
        hours_committed = ${hoursNumber},
        references_count = ${refsNumber},
        background_status = ${background ?? ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
        id,
        name,
        email,
        phone,
        location,
        age,
        profession,
        experience,
        skills,
        availability,
        preferred_programs,
        languages,
        motivation,
        status,
        rating,
        hours_committed,
        references_count,
        background_status,
        applied_at,
        created_at,
        updated_at
    `

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const volunteer = {
      id: row.id as string,
      name: (row.name as string) ?? "",
      email: (row.email as string) ?? "",
      phone: (row.phone as string) ?? "",
      location: (row.location as string) ?? "",
      age: row.age ? Number(row.age) : null,
      profession: (row.profession as string) ?? "",
      experience: (row.experience as string) ?? "",
      skills: parseList(row.skills as string | null | undefined),
      availability: (row.availability as string) ?? "",
      preferredPrograms: parseList(
        row.preferred_programs as string | null | undefined,
      ),
      languages: parseList(row.languages as string | null | undefined),
      motivation: (row.motivation as string) ?? "",
      status: (row.status as string) ?? "Pending",
      rating: row.rating ? Number(row.rating) : null,
      hoursCommitted: Number(row.hours_committed ?? 0),
      references: Number(row.references_count ?? 0),
      background: (row.background_status as string) ?? "",
      appliedAt: row.applied_at as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ volunteer })
  } catch (error: any) {
    console.error("Volunteer update error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to update volunteer" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureVolunteersTables()
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM volunteers
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Volunteer delete error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(
      { error: "Failed to delete volunteer" },
      { status: 500 },
    )
  }
}
