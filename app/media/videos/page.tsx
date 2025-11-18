import { Play } from "lucide-react";
import Image from "next/image";

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

interface PublicVideoItem {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
  status: string;
  featured: boolean;
  duration: string;
  date: string;
}

export default async function Videos() {
  const fallbackYoutubeId = "rwVO60Mck7s";

  let videos: PublicVideoItem[] = [];
  let youtubeId = fallbackYoutubeId;
  let featuredTitle = "ADTS Rwanda — Featured Video";
  let featuredDescription = "Watch this video to learn more about ADTS Rwanda's work and impact.";

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/videos`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      videos = (data.videos ?? []) as PublicVideoItem[];

      const featured = videos.find((v) => v.featured) ?? videos[0];

      if (featured) {
        const id = extractYouTubeId(featured.youtubeUrl);
        if (id) {
          youtubeId = id;
          featuredTitle = featured.title || featuredTitle;
          featuredDescription = featured.description || featuredDescription;
        }
      }
    }
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

            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="ADTS Rwanda - Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-2xl font-semibold mt-6">
              {featuredTitle}
            </h2>
            <p className="text-foreground/80 mt-2">
              {featuredDescription}
            </p>
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
