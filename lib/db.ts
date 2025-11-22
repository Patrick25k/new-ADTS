import { neon } from '@neondatabase/serverless'

const connectionString = process.env.NEON_DATABASE_URL

if (!connectionString) {
  throw new Error('NEON_DATABASE_URL environment variable is not set')
}

export const sql = neon(connectionString)

export async function ensureAdminTables() {
  // Ensure required extension for UUID generation
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  // Admin users table for dashboard authentication
  await sql`CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export async function ensureBlogTables() {
  // Blogs depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'Draft',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    cover_image_url TEXT,
    author_id UUID REFERENCES admin_users(id),
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export async function ensureTendersTables() {
  // Tenders depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS tenders (
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
  )`;
}

export async function ensureTeamTables() {
  // Team members depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS team_members (
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
  )`;
}

export async function ensureStoriesTables() {
  // Stories depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS stories (
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
  )`;

  await sql`ALTER TABLE stories ADD COLUMN IF NOT EXISTS video_url TEXT`;
}

export async function ensureVideosTables() {
  // Videos depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS videos (
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
  )`;
}

export async function ensureContactsTables() {
  // Contact messages depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS contact_messages (
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
  )`;
}

export async function ensureVolunteersTables() {
  // Volunteers depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS volunteers (
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
  )`;
}

export async function ensureGalleryTables() {
  // Gallery depend on core admin tables and extensions
  await ensureAdminTables()

  await sql`CREATE TABLE IF NOT EXISTS gallery_images (
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
    created_by UUID REFERENCES admin_users(id)
  )`;
}
