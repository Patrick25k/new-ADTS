import { Calendar } from "lucide-react"
import Image from "next/image"

export default function HistoricalBackground() {
  const timeline = [
    {
      year: "1994",
      title: "The Genocide Against the Tutsi",
      description:
        "Rwanda experienced one of the darkest chapters in human history. The genocide left the nation devastated, with shattered communities, broken families, and deep trauma.",
    },
    {
      year: "1998",
      title: "ADTS Founded",
      description:
        "In response to the profound post-genocide needs, ADTS was established by visionary leaders committed to social transformation, reconciliation, and community healing.",
    },
    {
      year: "2003",
      title: "Legal Recognition",
      description:
        "ADTS received official legal personality (No. 092/11) from the Rwandan Government, formalizing our status as a registered non-governmental organization.",
    },
    {
      year: "1998-2005",
      title: "Early Programs & Partnerships",
      description:
        "Began Training for Transformation programs with support from Trocaire. Focused on peace-building, unity, reconciliation, and community mobilization in post-genocide Rwanda.",
    },
    {
      year: "2006-2012",
      title: "Expansion of Programs",
      description:
        "Launched Ending Domestic Violence initiatives, established gender focal points, and began socio-economic empowerment programs including VSL groups and cooperatives.",
    },
    {
      year: "2013-2018",
      title: "Scaling Impact",
      description:
        "Expanded partnerships with Norwegian People's Aid, CARE International, World Bank, and UNICEF. Reached tens of thousands with integrated programs addressing GBV, poverty, and governance.",
    },
    {
      year: "2019-Present",
      title: "Deepening Transformation",
      description:
        "Continued growth and impact with teen mothers' programs, policy monitoring, research and documentation, and regional Training for Transformation across the Great Lakes region.",
    },
    {
      year: "2024",
      title: "23+ Years of Service",
      description:
        "ADTS has now reached over 140,000 people, empowered 86,000+ women, trained thousands of community mobilizers, and created lasting transformation in families and communities across Rwanda.",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image1a.jpeg"
          alt="ADTS Rwanda historical journey"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Historical Background</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            From the ashes of tragedy to a beacon of hope and transformation
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              The story of ADTS Rwanda cannot be told without understanding the context from which it emerged. Born in
              the aftermath of the 1994 Genocide against the Tutsi, ADTS represents the resilience, hope, and
              determination of the Rwandan people to rebuild not just infrastructure, but the very social fabric of
              their nation.
            </p>
            <p className="text-lg text-foreground/80 text-pretty">
              What began as a grassroots response to urgent post-genocide needs has grown into a comprehensive,
              evidence-based organization that has touched the lives of over 140,000 people across Rwanda and the Great
              Lakes region.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      <Calendar className="h-6 w-6" />
                    </div>
                    {index < timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <div className="text-sm font-semibold text-primary mb-1">{item.year}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-foreground/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Status */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Legal Status & Compliance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Registration</h3>
                <p className="text-foreground/70 mb-2">
                  <strong>Founded:</strong> 1998
                </p>
                <p className="text-foreground/70 mb-2">
                  <strong>Legal Personality:</strong> No. 092/11 (2003)
                </p>
                <p className="text-foreground/70">
                  <strong>Registered with:</strong> Rwanda Governance Board (RGB)
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Compliance</h3>
                <p className="text-foreground/70">
                  ADTS operates in full compliance with Rwanda Governance Board (RGB) requirements and law number
                  04/2012 of 17/02/2012 governing non-governmental organizations in Rwanda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Forward */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Looking Forward</h2>
            <p className="text-lg mb-8 text-pretty">
              As we reflect on over two decades of service, we remain committed to our founding vision: a society where
              all members are active, cohesive, and autonomous, participating in achieving a just and prosperous world.
              The journey continues, and we invite you to be part of this transformation.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
