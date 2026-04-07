import { NextRequest, NextResponse } from "next/server"
import { sql, ensureAdminTables } from "@/lib/db"
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth-tokens"

export const runtime = "nodejs"

async function ensureJobsTables() {
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    department TEXT,
    location TEXT,
    job_type TEXT,
    experience TEXT,
    education TEXT,
    salary_text TEXT,
    post_date DATE,
    deadline DATE,
    applicants INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Open',
    priority TEXT NOT NULL DEFAULT 'Medium',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    requirements TEXT,
    benefits TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

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
    await ensureJobsTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        department,
        location,
        job_type,
        experience,
        education,
        salary_text,
        post_date,
        deadline,
        applicants,
        views,
        status,
        priority,
        featured,
        requirements,
        benefits,
        document_url,
        created_at,
        updated_at
      FROM jobs
      ORDER BY created_at DESC
    `

    const jobs = (rows as any[]).map((row) => {
      const status = (row.status as string) ?? "Open"
      const priority = (row.priority as string) ?? "Medium"

      return {
        id: row.id as string,
        title: (row.title as string) ?? "",
        description: (row.description as string) ?? "",
        department: (row.department as string) ?? "",
        location: (row.location as string) ?? "",
        type: (row.job_type as string) ?? "",
        experience: (row.experience as string) ?? "",
        education: (row.education as string) ?? "",
        salary: (row.salary_text as string) ?? "",
        postDate: (row.post_date as string) ?? null,
        deadline: (row.deadline as string) ?? null,
        applicants: Number(row.applicants ?? 0),
        views: Number(row.views ?? 0),
        status,
        priority,
        featured: Boolean(row.featured),
        requirements: parseList(row.requirements as string | null | undefined),
        benefits: parseList(row.benefits as string | null | undefined),
        documentUrl: (row.document_url as string) ?? "",
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      }
    })

    return NextResponse.json({ jobs })
  } catch (error: any) {
    console.error("Jobs list error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureJobsTables()
    await requireAdmin(request)

    const body = await request.json()
    const {
      title,
      description,
      department,
      location,
      type,
      experience,
      education,
      salary,
      postDate,
      deadline,
      applicants,
      views,
      status,
      priority,
      featured,
      requirements,
      benefits,
      documentUrl,
    } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const dbStatus = status === "Closed" ? "Closed" : "Open"
    const dbPriority =
      priority === "High" || priority === "Low" || priority === "Medium"
        ? priority
        : "Medium"
    const isFeatured = Boolean(featured)

    const applicantsNumber =
      typeof applicants === "number"
        ? applicants
        : applicants
        ? Number.parseInt(applicants, 10)
        : 0
    const viewsNumber =
      typeof views === "number" ? views : views ? Number.parseInt(views, 10) : 0

    const requirementsText = (requirements as string | undefined) ?? ""
    const benefitsText = (benefits as string | undefined) ?? ""

    const rows = await sql`
      INSERT INTO jobs (
        title,
        description,
        department,
        location,
        job_type,
        experience,
        education,
        salary_text,
        post_date,
        deadline,
        applicants,
        views,
        status,
        priority,
        featured,
        requirements,
        benefits,
        document_url,
        created_at,
        updated_at
      ) VALUES (
        ${title},
        ${description ?? ""},
        ${department ?? ""},
        ${location ?? ""},
        ${type ?? ""},
        ${experience ?? ""},
        ${education ?? ""},
        ${salary ?? ""},
        ${postDate || null},
        ${deadline || null},
        ${applicantsNumber},
        ${viewsNumber},
        ${dbStatus},
        ${dbPriority},
        ${isFeatured},
        ${requirementsText},
        ${benefitsText},
        ${documentUrl ?? ""},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        title,
        description,
        department,
        location,
        job_type,
        experience,
        education,
        salary_text,
        post_date,
        deadline,
        applicants,
        views,
        status,
        priority,
        featured,
        requirements,
        benefits,
        document_url,
        created_at,
        updated_at
    `

    const row = (rows as any[])[0]

    const createdStatus = (row.status as string) ?? "Open"
    const createdPriority = (row.priority as string) ?? "Medium"

    const job = {
      id: row.id as string,
      title: (row.title as string) ?? "",
      description: (row.description as string) ?? "",
      department: (row.department as string) ?? "",
      location: (row.location as string) ?? "",
      type: (row.job_type as string) ?? "",
      experience: (row.experience as string) ?? "",
      education: (row.education as string) ?? "",
      salary: (row.salary_text as string) ?? "",
      postDate: (row.post_date as string) ?? null,
      deadline: (row.deadline as string) ?? null,
      applicants: Number(row.applicants ?? 0),
      views: Number(row.views ?? 0),
      status: createdStatus,
      priority: createdPriority,
      featured: Boolean(row.featured),
      requirements: parseList(row.requirements as string | null | undefined),
      benefits: parseList(row.benefits as string | null | undefined),
      documentUrl: (row.document_url as string) ?? "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ job }, { status: 201 })
  } catch (error: any) {
    console.error("Job create error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
