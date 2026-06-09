import { Heart, Users, Globe, BookOpen } from "lucide-react";
import Image from "next/image";

export default function AboutADTS() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_18.jpeg"
          alt="ADTS Rwanda — community development and child protection"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            About ADTS Rwanda
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            ADTS Rwanda is a locally-led non-governmental organisation working
            to protect children, strengthen families, and empower communities
            across Rwanda.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              ADTS Rwanda works with vulnerable children, youth and families to
              create safer, healthier and more resilient communities. We focus
              on child protection, education, livelihoods, and community-based
              prevention of gender-based violence — always partnering with local
              leaders and organisations to build long-term local capacity.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 rounded-lg border bg-card">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Women's Empowerment
                </h3>
                <p className="text-foreground/70">
                  We prioritise programmes that support women and girls —
                  economic inclusion, leadership development, gender-based
                  violence prevention and access to education — because strong
                  women mean stronger families and communities.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Values-Driven Service
                </h3>
                <p className="text-foreground/70">
                  We are guided by compassion and dignity. Our work is
                  people-centered and seeks to protect the rights and wellbeing
                  of every child and family we serve.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community-Led</h3>
                <p className="text-foreground/70">
                  Programs are delivered with local partners and volunteers so
                  that solutions are culturally appropriate, owned by
                  communities, and sustained after external support ends.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Child & Family Focus
                </h3>
                <p className="text-foreground/70">
                  Our interventions prioritize children and their caregivers,
                  strengthening families so children can flourish and contribute
                  to their communities.
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
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Approach
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Women's Empowerment
                </h3>
                <p className="text-foreground/70">
                  We run focused programmes for women and girls — including
                  gender-based violence prevention, leadership and livelihoods
                  support, and education access — so women can lead change in
                  their families and communities.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Child Protection & Safeguarding
                </h3>
                <p className="text-foreground/70">
                  We lead community-based child protection initiatives to
                  prevent abuse, respond to incidents, and strengthen local
                  safeguarding systems so children grow up safe and secure.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Education & Youth Empowerment
                </h3>
                <p className="text-foreground/70">
                  We support access to quality education, life skills and
                  mentorship so young people can complete school, pursue
                  livelihoods and become leaders in their communities.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Economic Strengthening
                </h3>
                <p className="text-foreground/70">
                  We provide livelihoods training, small enterprise support and
                  savings groups to help families build resilient incomes and
                  reduce vulnerability.
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
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Shared Values
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-center text-pretty">
              We are guided by values that reflect our commitment to dignity,
              partnership and lasting impact:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Compassion",
                  description: "Deep empathy and active care for those in need",
                },
                {
                  title: "Integrity",
                  description:
                    "We are accountable, transparent and trustworthy",
                },
                {
                  title: "Respect",
                  description: "Treating every person with dignity and worth",
                },
                {
                  title: "Service",
                  description: "Practical help that meets real needs",
                },
                {
                  title: "Partnership",
                  description:
                    "Working together with communities and local leaders",
                },
                {
                  title: "Inclusivity",
                  description:
                    "Welcoming and serving people from all backgrounds",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-lg border bg-card text-center"
                >
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-foreground/70">
                    {value.description}
                  </p>
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
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <p className="text-lg mb-8 text-pretty">
              You can partner with ADTS Rwanda by volunteering, supporting our
              programs, or referring families in need. Reach out to learn how to
              donate, volunteer, or collaborate — together we can strengthen
              communities across Rwanda.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
