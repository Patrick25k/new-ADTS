import { NextRequest, NextResponse } from "next/server"
import { sql, ensureTendersTables } from "@/lib/db"
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

function parseRequirements(text: string | null | undefined): string[] {
  if (!text) return []

  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    await ensureTendersTables()
    await requireAdmin(request)

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        reference,
        category,
        status,
        featured,
        priority,
        publish_date,
        deadline,
        budget_text,
        budget_min,
        budget_max,
        submissions,
        views,
        requirements,
        document_url,
        created_at,
        updated_at
      FROM tenders
      ORDER BY created_at DESC
    `

    const tenders = (rows as any[]).map((row) => {
      const status = (row.status as string) ?? "Open"
      const priority = (row.priority as string) ?? "Medium"

      return {
        id: row.id as string,
        title: (row.title as string) ?? "",
        description: (row.description as string) ?? "",
        reference: (row.reference as string) ?? "",
        category: (row.category as string) ?? "",
        status,
        featured: Boolean(row.featured),
        priority,
        publishDate: (row.publish_date as string) ?? null,
        deadline: (row.deadline as string) ?? null,
        budget: (row.budget_text as string) ?? "",
        budgetMin: row.budget_min !== null ? Number(row.budget_min) : null,
        budgetMax: row.budget_max !== null ? Number(row.budget_max) : null,
        submissions: Number(row.submissions ?? 0),
        views: Number(row.views ?? 0),
        requirements: parseRequirements(row.requirements as string | null | undefined),
        documentUrl: (row.document_url as string) ?? "",
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      }
    })

    return NextResponse.json({ tenders })
  } catch (error: any) {
    console.error("Tenders list error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to load tenders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTendersTables()
    await requireAdmin(request)

    const body = await request.json()
    const {
      title,
      description,
      reference,
      category,
      status,
      featured,
      priority,
      publishDate,
      deadline,
      budget,
      budgetMin,
      budgetMax,
      requirements,
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

    const budgetMinNumber =
      typeof budgetMin === "number"
        ? budgetMin
        : budgetMin
        ? Number.parseFloat(budgetMin)
        : null
    const budgetMaxNumber =
      typeof budgetMax === "number"
        ? budgetMax
        : budgetMax
        ? Number.parseFloat(budgetMax)
        : null

    const requirementsText = (requirements as string | undefined) ?? ""

    const rows = await sql`
      INSERT INTO tenders (
        title,
        description,
        reference,
        category,
        status,
        featured,
        priority,
        publish_date,
        deadline,
        budget_text,
        budget_min,
        budget_max,
        submissions,
        views,
        requirements,
        document_url,
        created_at,
        updated_at
      ) VALUES (
        ${title},
        ${description ?? ""},
        ${reference ?? ""},
        ${category ?? ""},
        ${dbStatus},
        ${isFeatured},
        ${dbPriority},
        ${publishDate || null},
        ${deadline || null},
        ${budget ?? ""},
        ${budgetMinNumber},
        ${budgetMaxNumber},
        0,
        0,
        ${requirementsText},
        ${documentUrl ?? ""},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        title,
        description,
        reference,
        category,
        status,
        featured,
        priority,
        publish_date,
        deadline,
        budget_text,
        budget_min,
        budget_max,
        submissions,
        views,
        requirements,
        document_url,
        created_at,
        updated_at
    `

    const row = (rows as any[])[0]

    const createdStatus = (row.status as string) ?? "Open"
    const createdPriority = (row.priority as string) ?? "Medium"

    const tender = {
      id: row.id as string,
      title: (row.title as string) ?? "",
      description: (row.description as string) ?? "",
      reference: (row.reference as string) ?? "",
      category: (row.category as string) ?? "",
      status: createdStatus,
      featured: Boolean(row.featured),
      priority: createdPriority,
      publishDate: (row.publish_date as string) ?? null,
      deadline: (row.deadline as string) ?? null,
      budget: (row.budget_text as string) ?? "",
      budgetMin: row.budget_min !== null ? Number(row.budget_min) : null,
      budgetMax: row.budget_max !== null ? Number(row.budget_max) : null,
      submissions: Number(row.submissions ?? 0),
      views: Number(row.views ?? 0),
      requirements: parseRequirements(row.requirements as string | null | undefined),
      documentUrl: (row.document_url as string) ?? "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }

    return NextResponse.json({ tender }, { status: 201 })
  } catch (error: any) {
    console.error("Tender create error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create tender" }, { status: 500 })
  }
}
