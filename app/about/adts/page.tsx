import { Heart, Users, Globe, BookOpen } from "lucide-react"
import Image from "next/image"

export default function CompassionInternational() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/community-prayer-rwanda-faith.jpg"
          alt="Compassion and faith in action"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">About Compassion International Rwanda</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Understanding our connection to the global compassion movement
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              While ADTS Rwanda operates as an independent Rwandan non-governmental organization, we share the spirit
              and values of the global compassion movement. Our work is rooted in the same fundamental belief: that
              every person, especially the most vulnerable, deserves dignity, opportunity, and the chance to thrive.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 rounded-lg border bg-card">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Christ-Centered</h3>
                <p className="text-foreground/70">
                  Our love of Jesus is central to everything we do. We respond to God's call to care for the
                  underprivileged and show love to those in need, demonstrating our faith through service.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community-Based</h3>
                <p className="text-foreground/70">
                  Our programs are delivered in partnership with local churches and community organizations, ensuring
                  that transformation is rooted in local wisdom, ownership, and sustainability.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Holistic Development</h3>
                <p className="text-foreground/70">
                  We address the whole person—physical, emotional, social, economic, and spiritual needs—recognizing
                  that true transformation requires comprehensive support.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Child & Family Focused</h3>
                <p className="text-foreground/70">
                  We address the needs of children, youth, and families so they can become responsible, fulfilled adults
                  equipped to transform their communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Compassionate Approach</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">Without Ulterior Motive</h3>
                <p className="text-foreground/70">
                  We offer our programs to the poorest of the poor, to children and families in greatest need, without
                  ulterior motive. Our service is an expression of love, not a means to an end.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">Releasing Children from Poverty</h3>
                <p className="text-foreground/70">
                  We work to release children from poverty in Jesus's name, providing education, healthcare, nutrition,
                  vocational training, and psychosocial support so they can break the cycle of poverty.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">Empowering Families</h3>
                <p className="text-foreground/70">
                  We recognize that children thrive when families thrive. Our programs empower parents—especially
                  mothers—with economic opportunities, education, and support to create stable, loving homes.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">Transforming Communities</h3>
                <p className="text-foreground/70">
                  We believe that transformed individuals transform families, and transformed families transform
                  communities. Our work creates ripple effects that extend far beyond individual beneficiaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Shared Values</h2>
            <p className="text-lg text-foreground/80 mb-8 text-center text-pretty">
              We are guided by values that reflect the character of Christ and our commitment to those we serve:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: "Compassion", description: "Deep empathy and active care for those in need" },
                { title: "Integrity", description: "We say what we mean, and we do what we say" },
                { title: "Respect", description: "Protecting the divine character in every person" },
                { title: "Grace", description: "Kind, forgiving, and merciful in all we do" },
                { title: "Collaboration", description: "Depending on teamwork and partnership" },
                { title: "Inclusivity", description: "Accepting and welcoming of all people" },
              ].map((value) => (
                <div key={value.title} className="p-6 rounded-lg border bg-card text-center">
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-foreground/70">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
            <p className="text-lg mb-8 text-pretty">
              Compassion is not just an organization—it's a movement, a calling, a cause, and a people. We invite you to
              be part of this beautiful, diverse expression of God's kingdom as we work together to transform lives and
              empower communities.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
