import { Users, Shield, Target } from "lucide-react"
import Image from "next/image"

export default function LeadershipTeam() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/community-leader-woman-speaking-meeting.jpg"
          alt="ADTS Rwanda leadership"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Our Leadership Team</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Dedicated leaders guiding ADTS Rwanda's mission of transformation
          </p>
        </div>
      </section>

      {/* Governance Structure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Governance Structure</h2>
            <p className="text-lg text-foreground/80 mb-12 text-center text-pretty">
              ADTS Rwanda is governed by a robust structure that ensures accountability, transparency, and effective
              program delivery.
            </p>

            <div className="space-y-8">
              <div className="p-8 rounded-lg border bg-card">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">General Assembly</h3>
                    <p className="text-foreground/70 mb-4">
                      The supreme authority of ADTS Rwanda, composed of 32 members who provide strategic direction and
                      oversight.
                    </p>
                    <div className="text-sm text-foreground/60">
                      <strong>Role:</strong> Sets organizational policy, approves strategic plans, elects leadership,
                      and ensures accountability to stakeholders and beneficiaries.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border bg-card">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Internal Audit Committee</h3>
                  <p className="text-foreground/70">
                    Ensures financial integrity, compliance with regulations, and proper use of resources. Conducts
                    regular audits and reports to the General Assembly.
                  </p>
                </div>
                <div className="p-6 rounded-lg border bg-card">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Conflict Resolution Committee</h3>
                  <p className="text-foreground/70">
                    Addresses internal disputes, mediates conflicts, and ensures a harmonious working environment
                    aligned with our values of mutual respect and solidarity.
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-4">National Coordination</h3>
                <p className="text-foreground/70 mb-4">
                  The National Coordination team facilitates day-to-day management and coordinates all programs across
                  Rwanda. This team translates strategic vision into operational reality, manages partnerships, oversees
                  program implementation, and ensures quality and impact.
                </p>
                <div className="text-sm text-foreground/60">
                  <strong>Responsibilities:</strong> Program management, partnership coordination, financial oversight,
                  monitoring and evaluation, staff supervision, and stakeholder engagement.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field-Level Leadership */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Field-Level Leadership</h2>
            <p className="text-lg text-foreground/80 mb-12 text-center text-pretty">
              Our grassroots leadership structures ensure programs are responsive to community needs and driven by local
              ownership.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-3">Ending Domestic Violence Working Groups (EDV WGs)</h3>
                <p className="text-foreground/70 mb-4">
                  Community-based groups that lead GBV prevention efforts, provide peer support, conduct awareness
                  campaigns, and offer counseling and mediation services at the grassroots level.
                </p>
                <div className="text-sm font-semibold text-primary">76,825+ people reached through EDV programs</div>
              </div>

              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-3">Gender Focal Points</h3>
                <p className="text-foreground/70 mb-4">
                  Trained community members who serve as champions for gender equality, monitor GBV cases, facilitate
                  trainings, and link communities to services and support.
                </p>
                <div className="text-sm font-semibold text-primary">Operating across multiple districts</div>
              </div>

              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-3">Field Officers</h3>
                <p className="text-foreground/70 mb-4">
                  ADTS staff members who work directly with communities, facilitating trainings, supporting VSL groups,
                  monitoring programs, and ensuring quality implementation.
                </p>
                <div className="text-sm font-semibold text-primary">
                  Credited in testimonies for family transformation
                </div>
              </div>

              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-3">Community Mobilizers</h3>
                <p className="text-foreground/70 mb-4">
                  Trained facilitators who lead Training for Transformation sessions, organize community dialogues, and
                  mobilize collective action for social change.
                </p>
                <div className="text-sm font-semibold text-primary">6,732 trained across the Great Lakes region</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership Principles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Servant Leadership</h3>
                <p className="text-foreground/70">
                  Our leaders serve the mission and the people, not their own interests. Leadership is about
                  empowerment, not control.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Participatory Decision-Making</h3>
                <p className="text-foreground/70">
                  We value the voices and wisdom of all stakeholders, especially beneficiaries, in shaping our programs
                  and strategies.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Accountability & Transparency</h3>
                <p className="text-foreground/70">
                  We hold ourselves accountable to our beneficiaries, partners, and donors through transparent reporting
                  and evaluation.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Continuous Learning</h3>
                <p className="text-foreground/70">
                  Our leaders are committed to ongoing learning, reflection, and adaptation to improve our impact and
                  effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Connect With Our Team</h2>
            <p className="text-lg mb-8 text-pretty">
              For partnership inquiries, program information, or to learn more about our governance and leadership,
              please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+250788308255"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                +250 788 308 255
              </a>
              <a
                href="mailto:adtsrwanda@yahoo.fr"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                adtsrwanda@yahoo.fr
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
