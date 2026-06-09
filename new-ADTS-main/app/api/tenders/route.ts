import { NextRequest, NextResponse } from "next/server"
import { sql, ensureTendersTables } from "@/lib/db"

export const runtime = "nodejs"

function parseRequirements(text: string | null | undefined): string[] {
  if (!text) return []

  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export async function GET(_request: NextRequest) {
  try {
    await ensureTendersTables()

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
        requirements,
        document_url,
        created_at
      FROM tenders
      ORDER BY COALESCE(publish_date, created_at) DESC
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
        requirements: parseRequirements(row.requirements as string | null | undefined),
        documentUrl: (row.document_url as string) ?? "",
        createdAt: row.created_at as string,
      }
    })

    return NextResponse.json({ tenders })
  } catch (error) {
    console.error("Public tenders list error:", error)
    return NextResponse.json(
      { error: "Failed to load tenders" },
      { status: 500 },
    )
  }
}
