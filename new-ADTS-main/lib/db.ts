import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== 'production') {
  console.warn("DATABASE_URL environment variable is not set");
}

/**
 * PostgreSQL connection pool
 */
export const pool = connectionString ? new Pool({
  connectionString,
}) : null;

/**
 * Tagged template helper to keep `sql\`...\`` syntax
 * Returns rows array to match Neon serverless driver behavior
 */
export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  if (!pool) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  let query = "";
  const params: any[] = [];

  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      params.push(values[i]);
      query += `$${params.length}`;
    }
  });

  const result = await pool.query(query, params);
  return result.rows;
}

/* ============================================================
   EXTENSIONS (Initialized once at startup)
============================================================ */

let extensionsInitialized = false;

export async function ensureExtensions() {
  if (extensionsInitialized) {
    return;
  }

  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
    extensionsInitialized = true;
  } catch (error) {
    console.error("Error creating pgcrypto extension:", error);
    throw error;
  }
}

/* ============================================================
   CORE ADMIN TABLES
============================================================ */

let adminTablesInitialized = false;

export async function ensureAdminTables() {
  // Note: pgcrypto extension is created separately during app initialization
  if (adminTablesInitialized) {
    return;
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        role TEXT NOT NULL DEFAULT 'admin',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    adminTablesInitialized = true;
  } catch (error) {
    // Only log, don't throw - table may already exist
    console.debug("Admin tables initialization:", error);
  }
}

/* ============================================================
   ADMIN SEEDING
============================================================ */

let adminSeeded = false;

/**
 * Seeds the default admin user if no admin exists
 * Uses environment variables for credentials with sensible defaults
 * Guard flag ensures this only runs once per process
 */
export async function seedAdmin() {
  // Skip if already attempted to seed
  if (adminSeeded) {
    return {
      seeded: false,
      message: "Admin seeding already attempted in this process",
    };
  }

  adminSeeded = true;

  try {
    await ensureAdminTables();

    const existingAdmins = await sql`
      SELECT id FROM admin_users LIMIT 1
    `;

    if (existingAdmins.length === 0) {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "admin123";
      const defaultFullName = process.env.DEFAULT_ADMIN_NAME ?? "Administrator";

      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      const inserted = await sql`
        INSERT INTO admin_users (email, password_hash, full_name, role)
        VALUES (${defaultEmail}, ${passwordHash}, ${defaultFullName}, 'admin')
        RETURNING id, email, full_name
      `;

      return { seeded: true, message: "Default admin created", admin: inserted[0] };
    }

    return { seeded: false, message: "Admin already exists" };
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return {
      seeded: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/* ============================================================
   BLOG TABLES
============================================================ */

let blogTablesInitialized = false;

export async function ensureBlogTables() {
  if (blogTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        status TEXT NOT NULL DEFAULT 'Draft',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        cover_image_url TEXT,
        author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
        views INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    blogTablesInitialized = true;
  } catch (error) {
    console.debug("Blog tables initialization:", error);
  }
}

/* ============================================================
   CONTACT MESSAGES (SINGLE SOURCE)
============================================================ */

let contactsTablesInitialized = false;

export async function ensureContactsTables() {
  if (contactsTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT,
        location TEXT,
        organization TEXT,
        status TEXT NOT NULL DEFAULT 'Unread',
        priority TEXT NOT NULL DEFAULT 'Medium',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    contactsTablesInitialized = true;
  } catch (error) {
    console.debug("Contacts tables initialization:", error);
  }
}

/* ============================================================
   TENDERS
============================================================ */

let tendersTablesInitialized = false;

export async function ensureTendersTables() {
  if (tendersTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tenders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        reference TEXT,
        category TEXT,
        status TEXT NOT NULL DEFAULT 'Open',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        priority TEXT NOT NULL DEFAULT 'Medium',
        publish_date DATE,
        deadline DATE,
        budget_text TEXT,
        budget_min NUMERIC,
        budget_max NUMERIC,
        submissions INTEGER NOT NULL DEFAULT 0,
        views INTEGER NOT NULL DEFAULT 0,
        requirements TEXT,
        document_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    tendersTablesInitialized = true;
  } catch (error) {
    console.debug("Tenders tables initialization:", error);
  }
}

/* ============================================================
   TEAM
============================================================ */

let teamTablesInitialized = false;

export async function ensureTeamTables() {
  if (teamTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        position TEXT,
        department TEXT,
        email TEXT,
        phone TEXT,
        location TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        image_url TEXT,
        bio TEXT,
        skills TEXT,
        join_date DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    teamTablesInitialized = true;
  } catch (error) {
    console.debug("Team tables initialization:", error);
  }
}

/* ============================================================
   STORIES
============================================================ */

let storiesTablesInitialized = false;

export async function ensureStoriesTables() {
  if (storiesTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        excerpt TEXT,
        story TEXT,
        impact TEXT,
        category TEXT,
        status TEXT NOT NULL DEFAULT 'Draft',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        image_url TEXT,
        video_url TEXT,
        author_name TEXT,
        read_time TEXT,
        views INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    storiesTablesInitialized = true;
  } catch (error) {
    console.debug("Stories tables initialization:", error);
  }
}

/* ============================================================
   VIDEOS
============================================================ */

let videosTablesInitialized = false;

export async function ensureVideosTables() {
  if (videosTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        youtube_url TEXT NOT NULL,
        category TEXT,
        status TEXT NOT NULL DEFAULT 'Draft',
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        duration TEXT,
        author_name TEXT,
        views INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        comments_count INTEGER NOT NULL DEFAULT 0,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    videosTablesInitialized = true;
  } catch (error) {
    console.debug("Videos tables initialization:", error);
  }
}

/* ============================================================
   VOLUNTEERS
============================================================ */

let volunteersTablesInitialized = false;

export async function ensureVolunteersTables() {
  if (volunteersTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS volunteers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        age INTEGER,
        profession TEXT,
        experience TEXT,
        skills TEXT,
        availability TEXT,
        preferred_programs TEXT,
        languages TEXT,
        motivation TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        rating NUMERIC,
        hours_committed INTEGER NOT NULL DEFAULT 0,
        references_count INTEGER NOT NULL DEFAULT 0,
        background_status TEXT,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    volunteersTablesInitialized = true;
  } catch (error) {
    console.debug("Volunteers tables initialization:", error);
  }
}

/* ============================================================
   GALLERY
============================================================ */

let galleryTablesInitialized = false;

export async function ensureGalleryTables() {
  if (galleryTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category TEXT,
        photographer TEXT,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'Published',
        file_size TEXT,
        dimensions TEXT,
        views INTEGER NOT NULL DEFAULT 0,
        downloads INTEGER NOT NULL DEFAULT 0,
        alt_text TEXT,
        tags TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `;
    galleryTablesInitialized = true;
  } catch (error) {
    console.debug("Gallery tables initialization:", error);
  }
}

/* ============================================================
   JOBS
============================================================ */

let jobsTablesInitialized = false;

export async function ensureJobsTables() {
  if (jobsTablesInitialized) {
    return;
  }

  await ensureAdminTables();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
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
      )
    `;
    jobsTablesInitialized = true;
  } catch (error) {
    console.debug("Jobs tables initialization:", error);
  }
}
