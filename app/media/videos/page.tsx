"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
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

export default function Videos() {
  const [videos, setVideos] = useState<PublicVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/videos");
        
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideos();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen">
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
            <p className="text-xl mb-8">
              Discover inspiring stories from our work across Rwanda
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading videos...</p>
          </div>
        </div>
      </main>
    );
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
