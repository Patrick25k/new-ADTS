"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const heroImages = [
  {
    url: "/diverse-community-people-rwanda-hope-gathering.jpg",
    alt: "Community gathering in Rwanda",
  },
  {
    url: "/women-empowerment-rwanda-education-training.jpg",
    alt: "Women empowerment program",
  },
  {
    url: "/children-education-rwanda-classroom-learning.jpg",
    alt: "Children education program",
  },
  {
    url: "/community-development-rwanda-village-transformatio.jpg",
    alt: "Community development",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Images with Fade Transition */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/60" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#FCB20B] mb-6 text-[#FCB20B]">
            TRANSFORMING LIVES, EMPOWERING COMMUNITIES
          </h1>
          <p className="text-xl md:text-2xl text-background/90 mb-8 text-pretty">
            Building a society where all members are active, cohesive and autonomous
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/about">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background/10 backdrop-blur border-background text-background hover:bg-background/20"
            >
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-background w-8" : "bg-background/50 hover:bg-background/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
