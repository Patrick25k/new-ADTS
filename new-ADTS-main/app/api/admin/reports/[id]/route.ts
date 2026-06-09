import { NextRequest, NextResponse } from "next/server"
import { sql, ensureAdminTables } from "@/lib/db"
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth-tokens"

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureReportsTables()
    await requireAdmin(request)

    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      type,
      category,
      status,
      priority,
      author,
      language,
      format,
      year,
      pages,
      size,
      publishDate,
      downloads,
      views,
      tags,
      documentUrl,
    } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const dbStatus =
      status === "Published" || status === "Draft" ? status : "Draft"
    const dbPriority =
      priority === "High" || priority === "Low" || priority === "Medium"
        ? priority
        : "Medium"

    const pagesNumber =
      typeof pages === "number" ? pages : pages ? Number.parseInt(pages, 10) : 0
    const downloadsNumber =
      typeof downloads === "number"
        ? downloads
        : downloads
        ? Number.parseInt(downloads, 10)
        : 0
    const viewsNumber =
      typeof views === "number" ? views : views ? Number.parseInt(views, 10) : 0

    const tagsText = (tags as string | undefined) ?? ""

    const rows = await sql`
      UPDATE reports
      SET
        title = ${title},
        description = ${description ?? ""},
        report_type = ${type ?? ""},
        category = ${category ?? ""},
        status = ${dbStatus},
        priority = ${dbPriority},
        author = ${author ?? ""},
        language = ${language ?? ""},
        format = ${format ?? "PDF"},
        year = ${year ?? ""},
        pages = ${pagesNumber},
        size_text = ${size ?? ""},
        publish_date = ${publishDate || null},
        downloads = ${downloadsNumber},
        views = ${viewsNumber},
        tags = ${tagsText},
        document_url = ${documentUrl ?? ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
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
        created_at,
        updated_at
    `

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const updatedStatus = (row.status as string) ?? "Draft"
    const updatedPriority = (row.priority as string) ?? "Medium"

    const report = {
      id: row.id as string,
      title: (row.title as string) ?? "",
      description: (row.description as string) ?? "",
      type: (row.report_type as string) ?? "",
      category: (row.category as string) ?? "",
      status: updatedStatus,
      priority: updatedPriority,
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
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ report })
  } catch (error: any) {
    console.error("Report update error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureReportsTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM reports
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Report delete error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 })
  }
}
