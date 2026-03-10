import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Heart, Church, Users, TrendingUp, Award, BookOpen } from "lucide-react"
import { HeroSlider } from "@/components/hero-slider"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSlider />

      {/* Who We Are Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">WHO WE ARE</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The <strong>Association pour le Développement et la Transformation Sociale (ADTS)</strong> is a <strong>Non Gouvernemental Organisation (NGO)</strong>, categorized as a <strong>public interests' organization</strong>. It was established on April 1st, 1998 by a group of 18 people comprised of individuals, professionals and trainers of adult learning methodology known at that time on the name of <strong>Development Education and Leadership Teams in Action (DELTA)</strong>, with a passion of contributing to social cohesion, peace building through trust building among Rwandans, unity and reconciliation, social justice, effective leadership self-reliance, social transformation and sustainable development.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/about">
                Read More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">OUR CORE VALUES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Christ Centered */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6">
                  <img
                    src="/images/image_3.jpeg"
                    alt="Christ Centered"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Innovation</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We encourage creativity and use of new ideas and methods in all aspects of our work.  
                </p>
                <Button asChild variant="link" className="mt-4 p-0 text-primary">
                  <Link href="/about">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community Based */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6">
                  <img
                    src="/images/image_31.jpeg"
                    alt="Community Based"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Church className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Participation</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                 We value and promote participation in our processes and in communities where we work. 
                </p>
                <Button asChild variant="link" className="mt-4 p-0 text-primary">
                  <Link href="/programs">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* People Focused */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6">
                  <img
                    src="/images/image_25.jpeg"
                    alt="People Focused"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Solidarity</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We value and promote solidarity to reach equality, inclusion and social justice in cooperation with others in all aspects of our work
                </p>
                <Button asChild variant="link" className="mt-4 p-0 text-primary">
                  <Link href="/programs">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">OUR IMPACT</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-foreground/10 p-4 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">27+</div>
              <div className="text-lg opacity-90">Years of Service</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-foreground/10 p-4 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">140K+</div>
              <div className="text-lg opacity-90">People Reached</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-foreground/10 p-4 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">86K+</div>
              <div className="text-lg opacity-90">Women Empowered</div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-foreground/10 p-4 rounded-full">
                  <BookOpen className="h-8 w-8" />
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">600+</div>
              <div className="text-lg opacity-90">Teen Mothers Trained</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">WHAT WE DO</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We work across multiple programs to create lasting change in communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Training for Transformation</h3>
                <p className="text-muted-foreground mb-4">
                  Capacity building for trainers and community mobilizers through participatory adult learning.
                </p>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link href="/programs">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ending Domestic Violence</h3>
                <p className="text-muted-foreground mb-4">
                  Community mobilization, awareness, and counseling to prevent gender-based violence.
                </p>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link href="/programs">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Socio-Economic Empowerment</h3>
                <p className="text-muted-foreground mb-4">
                  Entrepreneurship training, cooperatives, and savings groups for vulnerable women.
                </p>
                <Button asChild variant="link" className="p-0 text-primary">
                  <Link href="/programs">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/programs">
                View All Programs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary/80 text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">GET INVOLVED</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join us in transforming lives and empowering communities across Rwanda
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90"
            >
              <Link href="/get-involved">Volunteer Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
