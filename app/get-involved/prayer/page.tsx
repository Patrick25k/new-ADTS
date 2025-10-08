import { Heart, Users, Globe, BookOpen } from "lucide-react"
import Image from "next/image"

export default function Prayer() {
  const prayerPoints = [
    {
      title: "For Families Experiencing Violence",
      description:
        "Pray for families trapped in cycles of domestic violence. Ask God to bring healing, transformation, and peace to these households.",
    },
    {
      title: "For Women's Empowerment",
      description:
        "Pray for the 86,000+ women we've empowered and the thousands more we seek to reach. Pray for their economic success, dignity, and leadership.",
    },
    {
      title: "For Teen Mothers",
      description:
        "Lift up the 300+ teen mothers in our programs. Pray for their education, vocational training, and restoration of hope and opportunity.",
    },
    {
      title: "For Community Mobilizers",
      description:
        "Pray for the 6,732 trained community mobilizers leading transformation across the Great Lakes region. Ask for wisdom, courage, and perseverance.",
    },
    {
      title: "For Our Staff & Leadership",
      description:
        "Pray for ADTS staff, field officers, and leadership team. Ask God to grant them wisdom, strength, and compassion as they serve.",
    },
    {
      title: "For Partnerships & Resources",
      description:
        "Pray for continued partnerships with Trocaire, NPA, CARE, and others. Pray for the resources needed to expand our impact.",
    },
    {
      title: "For Unity & Reconciliation",
      description:
        "Pray for continued healing and reconciliation in Rwanda. Ask God to strengthen social cohesion and peace across communities.",
    },
    {
      title: "For Sustainable Transformation",
      description:
        "Pray that the transformation we facilitate would be deep, lasting, and community-owned, creating ripple effects for generations.",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/community-prayer-rwanda-faith.jpg"
          alt="Community prayer in Rwanda"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Prayer</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Join us in praying for transformation, healing, and hope across Rwanda
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">The Power of Prayer</h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              Prayer is the foundation of our work at ADTS Rwanda. We believe that lasting transformation begins with
              God's grace and power working in hearts, families, and communities. Your prayers are a vital part of our
              mission.
            </p>
            <p className="text-lg text-foreground/80 text-pretty">
              When you pray for ADTS Rwanda, you're not just supporting an organization—you're partnering with God in
              the transformation of lives, the healing of families, and the empowerment of communities.
            </p>
          </div>
        </div>
      </section>

      {/* Prayer Points */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How to Pray for ADTS Rwanda</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {prayerPoints.map((point, index) => (
                <div key={index} className="p-6 rounded-lg border bg-background">
                  <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                  <p className="text-foreground/70">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact of Prayer */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Stories of Answered Prayer</h2>
            <div className="space-y-8">
              <div className="p-8 rounded-lg border bg-card">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Families Restored</h3>
                <p className="text-foreground/70 mb-4">
                  Through prayer and our EDV programs, we've witnessed countless families transformed. Husbands who once
                  used violence now lead with love. Wives who lived in fear now experience dignity and peace.
                </p>
                <div className="text-sm font-semibold text-primary">76,825+ people reached through EDV programs</div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Women Empowered</h3>
                <p className="text-foreground/70 mb-4">
                  God has answered prayers for economic empowerment. Women who once lived in extreme poverty now run
                  successful businesses, support their families, and lead in their communities.
                </p>
                <div className="text-sm font-semibold text-primary">86,000+ women empowered</div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Communities Transformed</h3>
                <p className="text-foreground/70 mb-4">
                  Prayer has been central to our community mobilization efforts. We've seen entire communities shift
                  from division to unity, from violence to peace, from despair to hope.
                </p>
                <div className="text-sm font-semibold text-primary">140,000+ people reached</div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Teen Mothers Given Hope</h3>
                <p className="text-foreground/70 mb-4">
                  Through prayer and vocational training, teen mothers who faced rejection and hopelessness have found
                  new purpose, skills, and community support.
                </p>
                <div className="text-sm font-semibold text-primary">300+ teen mothers trained</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Prayer Network */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Our Prayer Network</h2>
            <p className="text-lg mb-8 text-pretty">
              We invite you to become a regular prayer partner with ADTS Rwanda. Receive monthly prayer updates,
              testimonies of transformation, and specific prayer requests directly from the field.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:adtsrwanda@yahoo.fr?subject=Join Prayer Network"
                className="inline-block px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Join Prayer Network
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
