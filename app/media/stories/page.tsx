import { Heart, TrendingUp, Users, Home } from "lucide-react"
import Image from "next/image"

interface StoryItem {
  icon: typeof Heart
  title: string
  category: string
  excerpt: string
  story: string
  impact: string
  image?: string
  videoUrl?: string
}

const staticStories: StoryItem[] = [
  {
    icon: Heart,
    title: "From Violence to Peace: A Family Transformed",
    category: "Ending Domestic Violence",
    excerpt:
      "After years of domestic violence, our family was broken. My husband would come home drunk and beat me in front of our children. I felt hopeless and trapped.",
    story:
      "Everything changed when the EDV working group came to our community. They invited my husband to a training session. At first, he refused, but eventually he went. What he learned there transformed him completely. He stopped drinking, stopped the violence, and started treating me with respect. Our field officer visited us regularly, providing counseling and support. Today, our home is peaceful. My children no longer live in fear. My husband and I work together to provide for our family. The EDV program didn't just save our marriage—it saved our children's future.",
    impact: "Family restored, children protected, community inspired",
  },
  {
    icon: TrendingUp,
    title: "From Poverty to Prosperity: A Mother's Journey",
    category: "Socio-Economic Empowerment",
    excerpt:
      "I was one of the poorest women in my village. I couldn't afford to send my children to school or put food on the table. I felt like a failure as a mother.",
    story:
      "ADTS introduced me to a Voluntary Savings and Loan group. At first, I didn't believe I could save anything—I had nothing. But the group taught me financial literacy and encouraged me to start small. I began saving just 100 Rwandan francs per week. After six months, I had enough to start a small business selling vegetables at the market. My business grew. I saved more, borrowed from the group, and expanded. Today, I employ two other women, all my children are in school, and I've built a new house for my family. I'm no longer the poorest woman in my village—I'm a role model for other women.",
    impact: "Business established, children educated, two jobs created",
  },
  {
    icon: Users,
    title: "Teen Mother Finds Hope and Purpose",
    category: "Teen Mothers' Support",
    excerpt:
      "I became pregnant at 16. My family rejected me, the father of my child abandoned me, and I dropped out of school. I thought my life was over.",
    story:
      "ADTS found me when I was at my lowest point. They invited me to join a teen mothers' support group. For the first time since my pregnancy, I didn't feel alone. The group provided psychosocial counseling that helped me heal from the trauma and shame. ADTS enrolled me in vocational training—I learned tailoring and hairdressing. They also taught us about sexual and reproductive health so we could make better choices in the future. After completing the training, ADTS helped me get a sewing machine. I started my own tailoring business from home. Now I can provide for my child, and I'm teaching other young mothers in my community. ADTS didn't just give me skills—they gave me back my dignity and hope.",
    impact: "Business started, child supported, hope restored",
  },
  {
    icon: Home,
    title: "Community Mobilizer Transforms His Village",
    category: "Training for Transformation",
    excerpt:
      "I attended the Training for Transformation program not knowing it would change my entire life and my community.",
    story:
      "The TFT methodology opened my eyes to the root causes of poverty and violence in my community. I learned about critical consciousness, participatory leadership, and community organizing. I realized that we didn't need to wait for outside help—we had the power to transform our own community. I returned to my village and began organizing community dialogues. We identified our biggest challenges: domestic violence, lack of clean water, and youth unemployment. We formed action groups to address each issue. I facilitated trainings on gender equality and conflict resolution. We mobilized resources to build a community water point. We started a youth cooperative for income-generating activities. Today, domestic violence has decreased significantly in our village. Young people have jobs. Families have access to clean water. And I've trained 50 other community members to become mobilizers. The transformation I've witnessed is beyond what I ever imagined possible.",
    impact: "Village transformed, 50 mobilizers trained, multiple community projects launched",
  },
]

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

function iconForCategory(category: string): typeof Heart {
  const normalized = category.toLowerCase()

  if (normalized.includes("violence") || normalized.includes("peace")) {
    return Heart
  }

  if (
    normalized.includes("econom") ||
    normalized.includes("socio") ||
    normalized.includes("empower")
  ) {
    return TrendingUp
  }

  if (normalized.includes("teen") || normalized.includes("mother")) {
    return Users
  }

  if (normalized.includes("community") || normalized.includes("village")) {
    return Home
  }

  return Heart
}

export default async function CompassionStories() {
  let stories: StoryItem[] = staticStories

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    const response = await fetch(`${baseUrl}/api/stories`, {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()
      const dynamicStories = (data.stories ?? []).map((story: any) => {
        const rawImage = ((story.imageUrl as string) ?? "").trim()
        const rawVideo = ((story.videoUrl as string) ?? "").trim()

        let image = rawImage
        if (!image && rawVideo) {
          const id = extractYouTubeId(rawVideo)
          if (id) {
            image = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          }
        }

        return {
          icon: iconForCategory((story.category as string) ?? ""),
          title: story.title as string,
          category: (story.category as string) || "Story",
          excerpt: (story.excerpt as string) ?? "",
          story: (story.story as string) ?? "",
          impact: (story.impact as string) ?? "",
          image: image || undefined,
          videoUrl: rawVideo || undefined,
        }
      }) as StoryItem[]

      if (dynamicStories.length > 0) {
        stories = dynamicStories
      }
    }
  } catch (error) {
    console.error("Failed to load public stories", error)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/act8.jpg"
          alt="Compassion stories from Rwanda"
          fill
          className="object-cover object-[center_30%] brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Compassion Stories</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Real stories of transformation, hope, and empowerment from the people we serve
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-foreground/80 text-pretty">
              These are not just statistics—they are real people with real stories. Behind every number is a life
              transformed, a family restored, a community empowered. These testimonies demonstrate the power of
              community-driven transformation and the impact of walking alongside people in their journey toward
              dignity, self-reliance, and hope.
            </p>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {stories.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="bg-background rounded-lg border p-8">
                  {item.image && (
                    <div className="mb-6 rounded-lg overflow-hidden bg-accent/30 h-56">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary mb-1">{item.category}</div>
                      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg text-foreground/80 italic border-l-4 border-primary pl-4">{item.excerpt}</p>
                    <p className="text-foreground/70 leading-relaxed">{item.story}</p>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-primary">Impact: {item.impact}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Stories Behind the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">140K+</div>
                <div className="text-sm text-foreground/70">People Reached</div>
                <div className="text-xs text-foreground/50 mt-1">Each with their own story</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">86K+</div>
                <div className="text-sm text-foreground/70">Women Empowered</div>
                <div className="text-xs text-foreground/50 mt-1">Each building a better future</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">76K+</div>
                <div className="text-sm text-foreground/70">Reached by EDV</div>
                <div className="text-xs text-foreground/50 mt-1">Families finding peace</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">300+</div>
                <div className="text-sm text-foreground/70">Teen Mothers</div>
                <div className="text-xs text-foreground/50 mt-1">Hope restored</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Be Part of More Stories Like These</h2>
            <p className="text-lg mb-8 text-pretty">
              Your support can help write the next chapter of transformation for families and communities across Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/get-involved"
                className="inline-block px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Involved
              </a>
              <a
                href="/contact"
                className="inline-block px-8 py-3 border-2 border-background text-background rounded-lg font-semibold hover:bg-background hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
