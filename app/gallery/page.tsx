"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  youtubeUrl?: string;
  category: string;
  photographer?: string;
  author?: string;
  featured: boolean;
  status: string;
  fileSize?: string;
  dimensions?: string;
  views: number;
  downloads?: number;
  altText?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  type: "image" | "video";
}

type Img = { src: string; alt: string };

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
  const id = extractYouTubeId(youtubeUrl);
  if (!id) return "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export default function GalleryPage() {
  const itemsPerPage = 6; // 2 rows x 3 columns on large screens
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const start = page * itemsPerPage;
  const pageItems: Img[] = items
    .slice(start, start + itemsPerPage)
    .map((item) => ({
      src:
        item.type === "image"
          ? item.imageUrl || ""
          : getVideoThumbnailUrl(item.youtubeUrl || ""),
      alt: item.altText || item.title,
    }));

  const currentItem = modalIndex !== null ? items[modalIndex] : null;

  useEffect(() => {
    async function loadGalleryItems() {
      try {
        setIsLoading(true);

        const [imagesRes, videosRes] = await Promise.all([
          fetch("/api/gallery"),
          fetch("/api/videos"),
        ]);

        const images = imagesRes.ok
          ? (await imagesRes.json()).images || []
          : [];
        const videos = videosRes.ok
          ? (await videosRes.json()).videos || []
          : [];

        const imageItems: GalleryImage[] = images.map((img: any) => ({
          ...img,
          type: "image" as const,
          views: img.views || 0,
        }));

        const videoItems: GalleryImage[] = videos.map((vid: any) => ({
          id: vid.id,
          title: vid.title,
          description: vid.description,
          youtubeUrl: vid.youtubeUrl,
          category: vid.category,
          author: vid.author,
          featured: vid.featured,
          status: vid.status,
          views: vid.views || 0,
          createdAt: vid.createdAt,
          updatedAt: vid.updatedAt,
          type: "video" as const,
        }));

        const combined = [...imageItems, ...videoItems].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setItems(combined);
      } catch (error) {
        console.error("Failed to load gallery items", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGalleryItems();
  }, []);

  // Modal (lightbox) helpers
  const openModal = (index: number) => setModalIndex(start + index);
  const closeModal = () => setModalIndex(null);
  const showPrev = () =>
    setModalIndex((i) => {
      if (i === null) return i;
      return (i - 1 + items.length) % items.length;
    });
  const showNext = () =>
    setModalIndex((i) => {
      if (i === null) return i;
      return (i + 1) % items.length;
    });

  // Keyboard support and preloading adjacent images
  useEffect(() => {
    if (modalIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKey);

    // Preload prev/next images for smoother navigation
    const prev = (modalIndex - 1 + items.length) % items.length;
    const next = (modalIndex + 1) % items.length;
    const pImg = document.createElement("img");
    const nImg = document.createElement("img");
    const prevItem = items[prev];
    const nextItem = items[next];
    pImg.src =
      prevItem?.type === "image"
        ? prevItem?.imageUrl || ""
        : getVideoThumbnailUrl(prevItem?.youtubeUrl || "");
    nImg.src =
      nextItem?.type === "image"
        ? nextItem?.imageUrl || ""
        : getVideoThumbnailUrl(nextItem?.youtubeUrl || "");

    return () => window.removeEventListener("keydown", onKey);
  }, [modalIndex, items]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_22.jpeg"
          alt="Children learning in Rwanda"
          fill
          className="object-cover object-[center] brightness-50"
        />
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">
            GALLERY
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Witness the transformation and impact of our work in communities
            across Rwanda
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">OUR WORK IN ACTION</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These images capture the spirit of transformation, hope, and
                empowerment that defines our mission. Every photo tells a story
                of lives changed and communities strengthened.
              </p>
            </div>

            <div className="relative">
              {/* Side arrows centered vertically */}
              <button
                aria-label="Previous page"
                className="absolute left-[-50px] top-[48%] -translate-y-1/2 z-20 p-3 rounded-full bg-primary hover:bg-secondary/95 shadow-md disabled:opacity-40 hover:cursor-pointer"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0}
              >
                <ArrowLeft className="h-6 w-6 text-foreground" />
              </button>

              <button
                aria-label="Next page"
                className="absolute right-[-50px] top-[48%] -translate-y-1/2 z-20 p-3 rounded-full bg-primary/80 hover:bg-secondary/95 shadow-md disabled:opacity-40 hover:cursor-pointer"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
              >
                <ArrowRight className="h-6 w-6 text-foreground" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">Loading gallery...</p>
                  </div>
                ) : pageItems.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No items available in the gallery.
                    </p>
                  </div>
                ) : (
                  pageItems.map((item: Img, index: number) => {
                    const itemData = items[start + index];
                    return (
                      <figure
                        key={start + index}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-zoom-in hover:shadow-xl transition-shadow"
                        onClick={() => openModal(index)}
                      >
                        <img
                          src={item.src || "/images/image_22.jpeg"}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                        {itemData?.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <Play className="w-16 h-16 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end pointer-events-none group-hover:pointer-events-auto">
                          <p className="text-background p-4 text-sm font-medium">
                            {item.alt}
                          </p>
                        </figcaption>
                      </figure>
                    );
                  })
                )}
              </div>

              {/* Page indicator centered below grid */}
              <div className="flex items-center justify-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} / {pageCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {modalIndex !== null && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeModal}
            aria-hidden
          />

          <div className="relative max-w-5xl w-full mx-4">
            <button
              aria-label="Close"
              className="absolute right-[-5px] top-[-10px] z-50 p-2 rounded-full text-primary hover:cursor-pointer hover:text-secondary font-extrabold text-2xl"
              onClick={closeModal}
            >
              ✕
            </button>

            <button
              aria-label="Previous page"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary hover:bg-secondary/95 shadow-md disabled:opacity-40 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
            >
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>

            <div className="bg-black rounded">
              {currentItem.type === "image" ? (
                <img
                  src={currentItem.imageUrl || ""}
                  alt={currentItem.altText || currentItem.title}
                  className="w-full h-[70vh] object-contain mx-auto"
                />
              ) : (
                <div className="w-full h-[70vh] flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(currentItem.youtubeUrl || "")}`}
                    title={currentItem.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded"
                  />
                </div>
              )}
              {currentItem.title && (
                <div className="text-white text-center p-4">
                  <h3 className="text-lg font-semibold">{currentItem.title}</h3>
                  {currentItem.description && (
                    <p className="text-sm text-gray-300 mt-1">
                      {currentItem.description}
                    </p>
                  )}
                  {currentItem.type === "image" && currentItem.photographer && (
                    <p className="text-xs text-gray-400 mt-2">
                      Photo by: {currentItem.photographer}
                    </p>
                  )}
                  {currentItem.type === "video" && currentItem.author && (
                    <p className="text-xs text-gray-400 mt-2">
                      By: {currentItem.author}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              aria-label="Next page"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary/80 hover:bg-secondary/95 shadow-md disabled:opacity-40 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
            >
              <ArrowRight className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Impact Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex flex-col items-center mb-6">
                <span className="text-3xl font-bold">ADTS</span>
                <span className="text-lg font-semibold text-primary">
                  RWANDA
                </span>
              </div>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Changing lives means moving at your heart's rhythm. We're here for
              creating that. We are here for our partners and for the society.
              We are here to make sure that we give opportunities to change,
              grow and develop. We're here for the people of Rwanda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>23+ Years of Service</span>
              <span>•</span>
              <span>140K+ People Reached</span>
              <span>•</span>
              <span>86K+ Women Empowered</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
