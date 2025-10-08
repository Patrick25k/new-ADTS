import { MapPin, Users, Globe } from "lucide-react"
import Image from "next/image"

export default function WhereWeWork() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/community-development-rwanda-village-transformatio.jpg"
          alt="ADTS Rwanda working across communities"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Where We Work</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Operating across Rwanda with regional reach throughout the Great Lakes region
          </p>
        </div>
      </section>

      {/* Primary Operations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-12">
              <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Rwanda - Our Home Base</h2>
                <p className="text-lg text-foreground/80 mb-6 text-pretty">
                  ADTS Rwanda is headquartered in Kigali and operates programs across multiple districts throughout
                  Rwanda. Our work reaches both urban and rural communities, with a particular focus on areas with high
                  rates of poverty, gender-based violence, and limited access to services.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Office Locations</h3>
                <div className="space-y-2 text-foreground/70">
                  <p>Muhima, KN 55 St, Kigali</p>
                  <p>Kinyinya, KG 380 St 7, Kigali</p>
                  <p>PO Box: 6328 Kigali, Rwanda</p>
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2 text-foreground/70">
                  <p>Phone: +250 788 308 255</p>
                  <p>Email: adtsrwanda@yahoo.fr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Reach */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <Globe className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Great Lakes Region</h2>
                <p className="text-lg text-foreground/80 mb-6 text-pretty">
                  Beyond Rwanda, ADTS extends its Training for Transformation programs to community mobilizers and
                  trainers from across the Great Lakes region, including:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-lg border text-center">
                <h3 className="text-xl font-semibold mb-2">Rwanda</h3>
                <p className="text-foreground/70">Primary operations and programs</p>
              </div>
              <div className="bg-background p-6 rounded-lg border text-center">
                <h3 className="text-xl font-semibold mb-2">Burundi</h3>
                <p className="text-foreground/70">Training and capacity building</p>
              </div>
              <div className="bg-background p-6 rounded-lg border text-center">
                <h3 className="text-xl font-semibold mb-2">Democratic Republic of Congo</h3>
                <p className="text-foreground/70">Training and capacity building</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <Users className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Who We Serve</h2>
                <p className="text-lg text-foreground/80 mb-8 text-pretty">
                  Our programs reach diverse groups across the communities where we work:
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Women & Girls</h3>
                <p className="text-sm text-foreground/70">
                  Especially the poorest women, survivors of domestic violence, and teen mothers
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Youth</h3>
                <p className="text-sm text-foreground/70">Young people seeking education, skills, and opportunities</p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Families & Couples</h3>
                <p className="text-sm text-foreground/70">Households affected by domestic violence and conflict</p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Vulnerable Groups</h3>
                <p className="text-sm text-foreground/70">
                  Widows, historically marginalized communities, and those living in extreme poverty
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Community Leaders</h3>
                <p className="text-sm text-foreground/70">Mobilizers, trainers, and local leaders driving change</p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">General Communities</h3>
                <p className="text-sm text-foreground/70">
                  All community members participating in civic life and development
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-secondary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Our Reach & Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">140K+</div>
                <div className="text-sm opacity-90">People Reached</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">86K+</div>
                <div className="text-sm opacity-90">Women Empowered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">6,732</div>
                <div className="text-sm opacity-90">Trained in TFT</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">51K+</div>
                <div className="text-sm opacity-90">VSL Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
