"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  description: string
  youtubeUrl: string
  category: string
  status: string
  featured: boolean
  duration: string
  views: number
  likes: number
  comments: number
  date: string
}

interface VideoNavigatorProps {
  videos: VideoItem[]
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url.trim())

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null
    }

    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v")
      if (v) return v
    }

    return null
  } catch {
    return null
  }
}

export default function VideoNavigator({ videos }: VideoNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentVideo = videos[currentIndex]
  const youtubeId = currentVideo ? extractYouTubeId(currentVideo.youtubeUrl) : null

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev === 0 ? videos.length - 1 : prev - 1)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length)
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          No published videos available at the moment. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {videos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-primary/90 hover:bg-secondary hover:cursor-pointer text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-primary/90 hover:bg-secondary hover:cursor-pointer text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Video Counter */}
      {videos.length > 1 && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Video {currentIndex + 1} of {videos.length}
          </p>
        </div>
      )}

      {/* Video Player */}
      {youtubeId ? (
        <>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h2 className="text-2xl font-semibold mt-6">
            {currentVideo.title}
          </h2>
          <p className="text-foreground/80 mt-2">
            {currentVideo.description}
          </p>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            Video not available. Please try another video.
          </p>
        </div>
      )}
    </div>
  )
}
