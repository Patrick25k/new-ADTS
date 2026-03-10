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
              <p className="text-lg leading-relaxed mb-6">
                The <strong>Association pour le Développement et la Transformation Sociale (ADTS)</strong> is a <strong>Non Gouvernemental Organisation (NGO)</strong>, categorized as a <strong>public interests' organization</strong>. It was established on April 1st, 1998 by a group of 18 people comprised of individuals, professionals and trainers of adult learning methodology known at that time on the name of <strong>Development Education and Leadership Teams in Action (DELTA)</strong>, with a passion of contributing to social cohesion, peace building through trust building among Rwandans, unity and reconciliation, social justice, effective leadership self-reliance, social transformation and sustainable development.
              </p>

              <p className="text-lg leading-relaxed mb-4">
                ADTS was <strong>legally recognized in 2003</strong> by the Government of Rwanda and was granted <strong>Legal Personality No. 092/11</strong>. Through a thorough assessment and evaluation of its activities and reports, and after having complied with the requirements of the new NGO law N°04/2012 du 17/02/2012, governing the organization and functioning of national non-governmental organizations in Rwanda, it was granted a <strong>certificate of compliance by the Rwanda Governance Board on May 29th 2013</strong>.
              </p>

              <h3 className="text-2xl font-semibold mb-4 mt-8">The creation of ADTS was mainly motivated by the following reasons:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-primary">●</span>
                  <p className="text-lg">
                    The context of after Genocide against Tutsi in 1994 where there was a huge need of rebuilding trust, social cohesion, unity and reconciliation.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-primary">●</span>
                  <p className="text-lg">
                    A need for mind set and behavior change to be able to promote sustainable development, social transformation, human rights protection, peace, leadership, good governance and gender equality.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-primary">●</span>
                  <p className="text-lg">
                    A need for critical thinking and consciousness of community members, groups, organizations and society for a better and justice world.
                  </p>
                </div>
              </div>
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
                  ADTS envisages cohesive, just and prosperous world.
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
                  ADTS works for social transformation and sustainable development to contribute to
                  the society where all members are active, cohesive andautonomous and actively
                  participate in achieving a just and prosperous world.
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
                  We encourage creativity and use of new ideas and methods in all aspects of our work.
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
                  We attach a great value to the quality of being honest and have strong principles that promote integrity in all aspects of our work.
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
                  We attach great value to self-reliance to promote the habit of independence and interdependence.
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
                  We attach great value to mutual respect among our staff, membership and partners.
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
                  We value and promote participation in our processes and in communities where we work.
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
                  We value and promote solidarity to reach equality, inclusion and social justice in cooperation with others in all aspects of our work.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Credibility</h3>
                </div>
                <p className="text-muted-foreground">
                  We strive to be a credible, being believable and trusted organization in the eyes of our members, partners, communities and the society in general.
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
