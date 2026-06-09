import { NextRequest, NextResponse } from "next/server"
import { sql, ensureAdminTables } from "@/lib/db"

export const runtime = "nodejs"

async function ensureReportsTables() {
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    report_type TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    priority TEXT NOT NULL DEFAULT 'Medium',
    author TEXT,
    language TEXT,
    format TEXT,
    year TEXT,
    pages INTEGER,
    size_text TEXT,
    publish_date DATE,
    downloads INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    tags TEXT,
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
    await ensureReportsTables()

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        report_type,
        category,
        status,
        priority,
        author,
        language,
        format,
        year,
        pages,
        size_text,
        publish_date,
        downloads,
        views,
        tags,
        document_url,
        created_at
      FROM reports
      WHERE status = 'Published'
      ORDER BY COALESCE(publish_date, created_at) DESC
    `

    const reports = (rows as any[]).map((row) => {
      const status = (row.status as string) ?? "Published"
      const priority = (row.priority as string) ?? "Medium"

      return {
        id: row.id as string,
        title: (row.title as string) ?? "",
        description: (row.description as string) ?? "",
        type: (row.report_type as string) ?? "",
        category: (row.category as string) ?? "",
        status,
        priority,
        author: (row.author as string) ?? "",
        language: (row.language as string) ?? "",
        format: (row.format as string) ?? "PDF",
        year: (row.year as string) ?? "",
        pages: Number(row.pages ?? 0),
        size: (row.size_text as string) ?? "",
        publishDate: (row.publish_date as string) ?? null,
        downloads: Number(row.downloads ?? 0),
        views: Number(row.views ?? 0),
        tags: parseList(row.tags as string | null | undefined),
        documentUrl: (row.document_url as string) ?? "",
        createdAt: row.created_at as string,
      }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Public reports list error:", error)
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 },
    )
  }
}
