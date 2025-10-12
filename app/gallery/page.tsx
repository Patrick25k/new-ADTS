"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { galleryImages } from "@/lib/galleryImages";

type Img = { src: string; alt: string };

export default function GalleryPage() {
  const itemsPerPage = 6; // 2 rows x 3 columns on large screens
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(galleryImages.length / itemsPerPage));
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const start = page * itemsPerPage;
  const pageImages: Img[] = galleryImages.slice(start, start + itemsPerPage);

  const currentImage = modalIndex !== null ? galleryImages[modalIndex] : null;

  // Modal (lightbox) helpers
  const openModal = (index: number) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);
  const showPrev = () =>
    setModalIndex((i) => {
      if (i === null) return i;
      return (i - 1 + galleryImages.length) % galleryImages.length;
    });
  const showNext = () =>
    setModalIndex((i) => {
      if (i === null) return i;
      return (i + 1) % galleryImages.length;
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
    const prev = (modalIndex - 1 + galleryImages.length) % galleryImages.length;
    const next = (modalIndex + 1) % galleryImages.length;
    const pImg = document.createElement("img");
    const nImg = document.createElement("img");
    pImg.src = galleryImages[prev].src;
    nImg.src = galleryImages[next].src;

    return () => window.removeEventListener("keydown", onKey);
  }, [modalIndex, galleryImages]);

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
                {pageImages.map((image: Img, index: number) => (
                  <figure
                    key={start + index}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-zoom-in hover:shadow-xl transition-shadow"
                    onClick={() => openModal(start + index)}
                  >
                    <img
                      src={
                        image.src ||
                        "/images/image_22.jpeg"
                      }
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end pointer-events-none group-hover:pointer-events-auto">
                      <p className="text-background p-4 text-sm font-medium">
                        {image.alt}
                      </p>
                    </figcaption>
                  </figure>
                ))}
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
      {modalIndex !== null && currentImage && (
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
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="w-full h-[70vh] object-contain mx-auto"
              />
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
