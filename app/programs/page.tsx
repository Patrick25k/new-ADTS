import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, TrendingUp, Users, GraduationCap, FileText } from "lucide-react"

export default function ProgramsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(/diverse-community-people-rwanda-hope-gathering.jpg?height=400&width=1920&query=community+training+education+Rwanda+empowerment)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">OUR PROGRAMS</h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Comprehensive initiatives driving social transformation and community empowerment
          </p>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Training for Transformation */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Training for Transformation</h2>
                    <div className="text-4xl font-bold text-primary mb-2">6,732</div>
                    <p className="text-muted-foreground">People Trained</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our Training for Transformation (TFT) program uses Paulo Freire-inspired participatory adult
                      learning methods to build capacity among community mobilizers, trainers, and local leaders across
                      the Great Lakes region.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Self-discovery and leadership development workshops</li>
                      <li>Gender equality and human rights training</li>
                      <li>Community mobilization and facilitation skills</li>
                      <li>Conflict transformation and strategic planning</li>
                      <li>Critical thinking and social conscience building</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ending Domestic Violence */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-secondary/10 p-4 rounded-full w-fit mb-4">
                      <Heart className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Ending Domestic Violence</h2>
                    <div className="text-4xl font-bold text-secondary mb-2">76,825</div>
                    <p className="text-muted-foreground">People Reached</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our EDV program works to prevent gender-based violence and transform family relationships through
                      community mobilization, awareness campaigns, and psychosocial support services.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Ending Domestic Violence Working Groups (EDVWGs) at grassroots level</li>
                      <li>Family conflict transformation and counseling</li>
                      <li>Legal marriage sensitization and human rights education</li>
                      <li>GBV prevention awareness campaigns</li>
                      <li>Psychosocial support for survivors</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Socio-Economic Empowerment */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Socio-Economic Empowerment</h2>
                    <div className="text-4xl font-bold text-primary mb-2">51,259</div>
                    <p className="text-muted-foreground">Members Created</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We empower vulnerable women and communities through entrepreneurship training, cooperative
                      formation, and financial literacy programs that promote savings and income-generating activities.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Voluntary Savings and Loan Groups (VSLGs) formation</li>
                      <li>Entrepreneurship and business skills training</li>
                      <li>Cooperative development and management</li>
                      <li>Financial literacy education</li>
                      <li>Support for income-generating activities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Citizen Participation */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-secondary/10 p-4 rounded-full w-fit mb-4">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Citizen Participation & Governance</h2>
                    <div className="text-4xl font-bold text-secondary mb-2">8,720+</div>
                    <p className="text-muted-foreground">People Reached</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      This program strengthens democratic participation, good governance, and civic engagement through
                      community dialogues, leadership training, and policy monitoring.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Community dialogue and civic participation programs</li>
                      <li>Leadership development for local leaders</li>
                      <li>Policy monitoring and advocacy</li>
                      <li>Unity and reconciliation initiatives</li>
                      <li>Human Rights-Based Approaches to Programming (HRBAP)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teen Mothers */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Teen Mothers Education & Support</h2>
                    <div className="text-4xl font-bold text-primary mb-2">300+</div>
                    <p className="text-muted-foreground">Teen Mothers Trained</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Supporting adolescent mothers through vocational training, health education, and self-help groups
                      to prevent child marriage and restore economic independence.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Vocational training (tailoring, hairdressing, crafts)</li>
                      <li>Sexual and reproductive health education</li>
                      <li>Psychosocial support and counseling</li>
                      <li>Self-help group formation and peer support</li>
                      <li>Child marriage prevention awareness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research & Documentation */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-secondary/10 p-4 rounded-full w-fit mb-4">
                      <FileText className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Research & Documentation</h2>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Program Overview</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our research and documentation efforts create evidence for programming and advocacy, ensuring
                      continuous learning and improvement across all our initiatives.
                    </p>
                    <h4 className="font-bold mb-2">Key Activities:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Monitoring and evaluation of program outcomes</li>
                      <li>Case study development and documentation</li>
                      <li>Impact assessment and reporting</li>
                      <li>Knowledge management and sharing</li>
                      <li>Policy influence and advocacy support</li>
                    </ul>
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
