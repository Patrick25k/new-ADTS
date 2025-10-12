import { Users, Target, Heart, Globe } from "lucide-react"
import Image from "next/image"

export default function WhoWeAre() {
  const programs = [
    {
      icon: Users,
      title: "Training for Transformation",
      description: "Capacity building for community mobilizers and leaders using participatory adult learning.",
      stats: "6,732 trained (2,682 men; 4,050 women)",
    },
    {
      icon: Heart,
      title: "Ending Domestic Violence",
      description: "Community mobilization, awareness, and psychosocial support to prevent GBV.",
      stats: "76,825 reached (40,130 women; 27,695 men)",
    },
    {
      icon: Target,
      title: "Socio-Economic Empowerment",
      description: "VSL groups, cooperatives, and entrepreneurship training for vulnerable women.",
      stats: "51,259 members (42,265 women; 8,994 men)",
    },
    {
      icon: Globe,
      title: "Civic Participation",
      description: "Leadership development, community dialogue, and policy monitoring.",
      stats: "8,720+ reached",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_31.jpeg"
          alt="ADTS Rwanda community gathering"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Who We Are & What We Do</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            A Rwandan NGO working for social transformation, sustainable and equitable development since 1998
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="p-8 rounded-lg border bg-card">
              <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
              <p className="text-lg text-foreground/80 text-pretty">
                A society where all members are active, cohesive and autonomous and participate in achieving a just and
                prosperous world.
              </p>
            </div>
            <div className="p-8 rounded-lg border bg-card">
              <h2 className="text-3xl font-bold mb-4 text-secondary">Our Mission</h2>
              <p className="text-lg text-foreground/80 text-pretty">
                ADTS works for social transformation, sustainable and equitable development through community-driven
                education, training, and grassroots programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <div key={index} className="bg-background p-8 rounded-lg border hover:shadow-lg transition-shadow">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">{program.title}</h3>
                  <p className="text-foreground/70 mb-4">{program.description}</p>
                  <div className="text-sm font-semibold text-primary">{program.stats}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Additional Programs</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">Teen Mothers' Education & Support</h3>
                <p className="text-foreground/70">
                  Vocational training, sexual reproductive health education, and self-help groups for adolescent
                  mothers. 300 teen mothers regrouped into 10 self-helping groups.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">Research & Documentation</h3>
                <p className="text-foreground/70">
                  Monitoring, evaluation, and documentation of program impact used for continuous learning and policy
                  influence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodologies */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Approaches & Methodologies</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Training for Transformation (TFT)",
                "Appreciative Inquiry (AI)",
                "Voluntary Savings & Loan (VSL)",
                "DELTA",
                "Community Score Cards (CSC)",
                "Human Rights-Based Approach (HRBAP)",
              ].map((method) => (
                <div key={method} className="bg-background p-4 rounded-lg border text-center">
                  <p className="font-medium text-sm">{method}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
