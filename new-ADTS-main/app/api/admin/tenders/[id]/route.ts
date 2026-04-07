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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTendersTables()
    await requireAdmin(request)

    const { id } = await params
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
      UPDATE tenders
      SET
        title = ${title},
        description = ${description ?? ""},
        reference = ${reference ?? ""},
        category = ${category ?? ""},
        status = ${dbStatus},
        featured = ${isFeatured},
        priority = ${dbPriority},
        publish_date = ${publishDate || null},
        deadline = ${deadline || null},
        budget_text = ${budget ?? ""},
        budget_min = ${budgetMinNumber},
        budget_max = ${budgetMaxNumber},
        requirements = ${requirementsText},
        document_url = ${documentUrl ?? ""},
        updated_at = NOW()
      WHERE id = ${id}
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

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    const row = (rows as any[])[0]

    const updatedStatus = (row.status as string) ?? "Open"
    const updatedPriority = (row.priority as string) ?? "Medium"

    const tender = {
      id: row.id as string,
      title: (row.title as string) ?? "",
      description: (row.description as string) ?? "",
      reference: (row.reference as string) ?? "",
      category: (row.category as string) ?? "",
      status: updatedStatus,
      featured: Boolean(row.featured),
      priority: updatedPriority,
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

    return NextResponse.json({ tender })
  } catch (error: any) {
    console.error("Tender update error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update tender" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureTendersTables()
    await requireAdmin(request)

    const { id } = await params

    const result = await sql`
      DELETE FROM tenders
      WHERE id = ${id}
      RETURNING id
    `

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Tender delete error:", error)

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to delete tender" }, { status: 500 })
  }
}
