import Image from "next/image"

export default function WhyWeExist() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_23.jpeg"
          alt="Women empowerment in Rwanda"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Why We Exist</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Born from the ashes of tragedy, driven by hope for transformation
          </p>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Origin Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground/80 mb-6 text-pretty">
                ADTS was created in 1998 in response to the profound needs that emerged after the 1994 Genocide against
                the Tutsi in Rwanda. Our founders recognized that rebuilding Rwanda required more than physical
                reconstruction—it demanded a fundamental transformation of hearts, minds, and social structures.
              </p>
              <p className="text-lg text-foreground/80 mb-6 text-pretty">
                In the aftermath of unimaginable tragedy, communities were fractured, trust was shattered, and the
                social fabric that held society together had been torn apart. Domestic violence, poverty, gender
                inequality, and trauma were widespread. Traditional approaches to development were insufficient to
                address these deep-rooted challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Needs Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">The Critical Needs We Address</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Social Cohesion & Unity</h3>
                <p className="text-foreground/70">
                  Rebuilding trust, fostering reconciliation, and creating cohesive communities where all members can
                  live together in peace and mutual respect.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Mindset & Behavior Change</h3>
                <p className="text-foreground/70">
                  Transforming harmful attitudes, beliefs, and behaviors that perpetuate violence, inequality, and
                  poverty through critical consciousness and education.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Gender Equality & Women's Rights</h3>
                <p className="text-foreground/70">
                  Addressing the root causes of gender-based violence and empowering women to claim their rights,
                  dignity, and economic independence.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Economic Empowerment</h3>
                <p className="text-foreground/70">
                  Breaking the cycle of poverty through savings groups, cooperatives, entrepreneurship training, and
                  income-generating activities.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Civic Participation & Governance</h3>
                <p className="text-foreground/70">
                  Strengthening democracy, human rights, leadership, and active citizenship so communities can hold
                  institutions accountable and shape their own futures.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-3 text-primary">Family Transformation</h3>
                <p className="text-foreground/70">
                  Preventing domestic violence, promoting peaceful families, and ensuring children grow up in safe,
                  nurturing environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Fundamental Purpose</h2>
            <p className="text-xl text-foreground/80 mb-8 text-pretty">
              We exist because we believe that every person—regardless of their past, their gender, their economic
              status—has inherent dignity and the capacity to transform their own life and community.
            </p>
            <p className="text-lg text-foreground/70 mb-8 text-pretty">
              We exist because top-down development doesn't work. Sustainable change must come from within communities,
              driven by their own critical consciousness, collective action, and self-reliance.
            </p>
            <p className="text-lg text-foreground/70 text-pretty">
              We exist to facilitate that transformation—not to impose solutions, but to walk alongside communities as
              they discover their own power, wisdom, and agency to create a just and prosperous world.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in This Mission</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-pretty">
            For over 23 years, we've been transforming lives and empowering communities. But there is still much work to
            be done. Together, we can create a Rwanda where every person thrives.
          </p>
        </div>
      </section>
    </main>
  )
}
