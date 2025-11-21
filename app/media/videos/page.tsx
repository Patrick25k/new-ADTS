import { Play } from "lucide-react";
import Image from "next/image";
import { sql, ensureVideosTables } from "@/lib/db";
import VideoNavigator from "@/components/VideoNavigator";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;
    }

    return null;
  } catch {
    return null;
  }
}

function getVideoThumbnailUrl(youtubeUrl: string): string {
  const id = extractYouTubeId(youtubeUrl)
  if (!id) return ""
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

interface PublicVideoItem {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  status: string;
  featured: boolean;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  date: string;
}

export default async function Videos() {
  let videos: PublicVideoItem[] = [];

  try {
    await ensureVideosTables();

    const rows = await sql`
      SELECT
        id,
        title,
        description,
        youtube_url,
        category,
        status,
        featured,
        duration,
        views,
        likes,
        comments_count,
        published_at,
        created_at
      FROM videos
      WHERE status = 'Published'
      ORDER BY COALESCE(published_at, created_at) DESC
    `;

    videos = (rows as any[]).map((row) => {
      const publishedAt = (row.published_at as string) ?? null
      const createdAt = row.created_at as string
      const rawDate = publishedAt ?? createdAt

      return {
        id: row.id as string,
        title: row.title as string,
        description: (row.description as string) ?? '',
        youtubeUrl: (row.youtube_url as string) ?? '',
        category: (row.category as string) ?? '',
        status: (row.status as string) ?? 'Draft',
        featured: Boolean(row.featured),
        duration: (row.duration as string) ?? '',
        views: (row.views as number) ?? 0,
        likes: (row.likes as number) ?? 0,
        comments: (row.comments_count as number) ?? 0,
        date: rawDate
          ? new Date(rawDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '',
      }
    });
  } catch (error) {
    console.error("Failed to load public videos", error);
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_30.jpeg"
          alt="ADTS Rwanda video stories"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            Videos
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Watch stories of transformation, hope, and empowerment from across
            Rwanda
          </p>
        </div>
      </section>

      {/* Embedded YouTube */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Description block above the video */}
            <div className="mb-6 text-center">
              <h2 className="text-4xl font-bold mb-4">OUR FEATURED VIDEOS</h2>
            </div>

            <VideoNavigator videos={videos} />
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Want to Share Your Story?
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              If you've been impacted by ADTS Rwanda's programs and would like
              to share your testimony, we'd love to hear from you.
            </p>
            <a
              href="mailto:rwandaadts@gmail.com?subject=Video Testimony"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
