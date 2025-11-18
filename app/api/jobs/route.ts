import { NextRequest, NextResponse } from "next/server"
import { sql, ensureAdminTables } from "@/lib/db"

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

function parseList(text: string | null | undefined): string[] {
  if (!text) return []

  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export async function GET(_request: NextRequest) {
  try {
    await ensureJobsTables()

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
        created_at
      FROM jobs
      ORDER BY COALESCE(post_date, created_at) DESC
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
      }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Public jobs list error:", error)
    return NextResponse.json(
      { error: "Failed to load jobs" },
      { status: 500 },
    )
  }
}
