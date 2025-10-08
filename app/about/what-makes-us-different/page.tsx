import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function WhatMakesUsDifferent() {
  const differentiators = [
    {
      title: "Training for Transformation Approach",
      description:
        "We use Paulo Freire-inspired participatory adult learning methodologies that empower communities to discover their own solutions and drive their own development.",
    },
    {
      title: "Community-Driven Solutions",
      description:
        "Rather than imposing external solutions, we facilitate community organizing and critical thinking, enabling grassroots leaders to identify and address their own challenges.",
    },
    {
      title: "Holistic Integration",
      description:
        "We integrate multiple approaches: Training for Transformation (TFT), Appreciative Inquiry (AI), Voluntary Savings & Loan (VSL), DELTA, Community Score Cards, and Human Rights-Based Approaches.",
    },
    {
      title: "Focus on Root Causes",
      description:
        "We address the underlying causes of poverty and violence—mindset, behavior, social norms, and power dynamics—not just symptoms.",
    },
    {
      title: "Gender Equality at the Core",
      description:
        "Gender equality and women's empowerment are central to all our programs, with dedicated structures like Ending Domestic Violence Working Groups and gender focal points.",
    },
    {
      title: "Proven Track Record",
      description:
        "Over 23 years of continuous service, we've reached 140,000+ people, empowered 86,000+ women, and created lasting transformation in families and communities.",
    },
    {
      title: "Strong Partnerships",
      description:
        "We collaborate with leading international organizations including Trocaire, Norwegian People's Aid, CARE International, World Bank, and UNICEF.",
    },
    {
      title: "Evidence-Based Programming",
      description:
        "We document outcomes rigorously, creating evidence for programming and advocacy, and continuously learning from our work to improve impact.",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/diverse-community-people-rwanda-hope-gathering.jpg"
          alt="ADTS Rwanda community diversity"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-[#FCB20B]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B] ">What Makes Us Different?</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty text-white/90">
            ADTS Rwanda stands apart through our unique combination of proven methodologies, community-driven
            approaches, and unwavering commitment to sustainable transformation.
          </p>
        </div>
      </section>

      {/* Differentiators Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {differentiators.map((item, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                "Innovation",
                "Integrity",
                "Self-reliance",
                "Mutual respect",
                "Participation",
                "Solidarity",
                "Meaningful work",
              ].map((value) => (
                <div key={value} className="bg-background p-6 rounded-lg text-center border">
                  <h3 className="font-semibold text-lg">{value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Transforming Lives Since 1998</h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              What truly sets us apart is our deep commitment to walking alongside communities in their journey toward
              self-reliance and dignity. We don't just deliver programs—we facilitate transformation from within,
              ensuring that change is sustainable, community-owned, and rooted in local wisdom and strength.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">23+</div>
                <div className="text-sm text-foreground/70">Years of Service</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">140K+</div>
                <div className="text-sm text-foreground/70">People Reached</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">86K+</div>
                <div className="text-sm text-foreground/70">Women Empowered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">300+</div>
                <div className="text-sm text-foreground/70">Teen Mothers Trained</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
