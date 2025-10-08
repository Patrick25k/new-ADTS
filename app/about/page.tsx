import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Lightbulb, Shield, Users, Handshake, Heart, Briefcase } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/diverse-community-people-rwanda-hope-gathering.jpg?height=400&width=1920&query=Rwanda+community+development+teamwork)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">ABOUT US</h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Learn about our journey, mission, and commitment to transforming communities
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">WHO WE ARE</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                ADTS (Association pour le Développement et la Transformation Sociale) is a Rwandan non-governmental
                organization established in 1998 and legally registered in 2003. With more than two decades of community
                work, ADTS supports social transformation through community-led education and training, GBV prevention
                and family rehabilitation, socio-economic empowerment of vulnerable women, teen mothers' support, and
                civic participation programs informed by human-rights principles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ADTS was formed in the wake of Rwanda's post-genocide recovery needs. Our founders identified critical
                gaps: social cohesion, community trust, economic vulnerability, gender-based violence, and limited
                participation in governance. Our programming focuses on behavior and mindset change through pedagogy and
                participatory training, aimed at restoring dignity, strengthening families, and promoting equitable
                development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold">Our Vision</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A society where all members are active, cohesive and autonomous and actively participate in achieving
                  a just and prosperous world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-secondary/10 p-4 rounded-full">
                    <Target className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-3xl font-bold">Our Mission</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  ADTS works for social transformation, sustainable and equitable development through community-driven
                  education, training and grassroots programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">OUR VALUES</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Innovation</h3>
                </div>
                <p className="text-muted-foreground">
                  Embracing creative solutions and new approaches to address community challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Integrity</h3>
                </div>
                <p className="text-muted-foreground">
                  Maintaining honesty, transparency, and ethical standards in all our work.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Self-reliance</h3>
                </div>
                <p className="text-muted-foreground">
                  Empowering communities to become independent and self-sustaining.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Handshake className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Mutual Respect</h3>
                </div>
                <p className="text-muted-foreground">
                  Valuing the dignity and worth of every individual and community.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Participation</h3>
                </div>
                <p className="text-muted-foreground">
                  Ensuring inclusive engagement and ownership at all levels of our work.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Solidarity</h3>
                </div>
                <p className="text-muted-foreground">
                  Standing together with communities in their journey toward transformation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Meaningful Work</h3>
                </div>
                <p className="text-muted-foreground">
                  Creating lasting impact through purposeful and transformative programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">GOVERNANCE & STRUCTURE</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3">General Assembly</h3>
                    <p className="text-muted-foreground">
                      Our supreme authority, composed of 32 members who guide the strategic direction of the
                      organization.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">National Coordination</h3>
                    <p className="text-muted-foreground">
                      Facilitates day-to-day management and coordinates programs across all regions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Field-Level Structures</h3>
                    <p className="text-muted-foreground">
                      Ending Domestic Violence Working Groups (EDV WGs) and gender focal points operate at the
                      grassroots level, ensuring direct community engagement and impact.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
