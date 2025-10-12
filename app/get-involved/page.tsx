import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Handshake, ArrowRight } from "lucide-react"

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 brightness-300"
          style={{
            backgroundImage:
              "url(/images/image4.jpg?height=400&width=1920&query=volunteers+helping+community+Rwanda+together)",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">GET INVOLVED</h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Join us in transforming lives and empowering communities across Rwanda
          </p>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">WAYS TO GET INVOLVED</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Donate */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/images/image2a.jpeg"
                    alt="Donate to Meet a Need"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Donate to Meet a Need</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Your financial support helps us meet critical needs for children and families, providing resources
                    for education, healthcare, and economic empowerment.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">
                      Make a Donation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Volunteer */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/images/act2.jpg"
                    alt="Become a Volunteer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold">Become a Volunteer</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Use your talents and time to deliver direct positive impact to families and communities. Join our
                    team of dedicated volunteers making a difference.
                  </p>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="/contact">
                      Volunteer Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Partner */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  <img src="/images/image_12.jpeg" alt="Partner With Us" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Handshake className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Partner With Us</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Organizations and institutions can partner with us to scale impact, share resources, and create
                    sustainable change in communities.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">OUR PARTNERS</h2>

          <div className="max-w-5xl mx-auto">
            <p className="text-center text-lg text-muted-foreground mb-12">
              We work with leading organizations to maximize our impact and reach more communities
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Trocaire</h3>
                  <p className="text-sm text-muted-foreground">
                    Longstanding support for governance, training, peace, and capacity building since 1998
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Norwegian People's Aid (NPA)</h3>
                  <p className="text-sm text-muted-foreground">
                    Gender equality, GBV programs, and policy monitoring initiatives
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">CARE International</h3>
                  <p className="text-sm text-muted-foreground">
                    Economic empowerment and savings-related programs for vulnerable women
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">World Bank</h3>
                  <p className="text-sm text-muted-foreground">Unity and reconciliation project support</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">UNICEF</h3>
                  <p className="text-sm text-muted-foreground">
                    Capacity building on Human Rights-Based Approaches to Programming
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Korea Hope Foundation (KHF)</h3>
                  <p className="text-sm text-muted-foreground">Teen mothers project and vocational training support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">READY TO MAKE A DIFFERENCE?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you want to volunteer, donate, or partner with us, your involvement can transform lives
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
