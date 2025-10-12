import { Shield, Heart, Users, BookOpen, Home, Utensils } from "lucide-react";
import Image from "next/image";

export default function ProtectAChild() {
  const protectionAreas = [
    {
      icon: Shield,
      title: "Protection from Violence",
      description:
        "Through our EDV programs, we create safe environments for children by transforming family dynamics and preventing domestic violence.",
    },
    {
      icon: BookOpen,
      title: "Education & Skills",
      description:
        "We provide educational support, vocational training, and life skills to equip children and youth for a successful future.",
    },
    {
      icon: Utensils,
      title: "Nutrition & Health",
      description:
        "We support families to provide adequate nutrition and healthcare for their children through economic empowerment programs.",
    },
    {
      icon: Home,
      title: "Stable Families",
      description:
        "We strengthen families through counseling, conflict resolution, and economic support so children can grow up in loving, stable homes.",
    },
    {
      icon: Heart,
      title: "Psychosocial Support",
      description:
        "We provide counseling and emotional support for children and families affected by trauma, violence, or poverty.",
    },
    {
      icon: Users,
      title: "Community Protection",
      description:
        "We mobilize communities to create protective environments where children's rights are respected and upheld.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image6.jpg"
          alt="Children learning in Rwanda"
          fill
          className="object-cover object-[center_30%] brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            Protect a Child
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Help us create safe, nurturing environments where every child can
            thrive
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Every Child Deserves Protection
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              Children are the most vulnerable members of our society. When
              families are trapped in poverty, violence, or instability,
              children suffer the most. At ADTS Rwanda, we believe every child
              deserves to grow up safe, loved, educated, and empowered.
            </p>
            <p className="text-lg text-foreground/80 text-pretty">
              Our child protection approach is holistic—we don't just address
              symptoms, we transform the root causes by strengthening families,
              empowering parents, preventing violence, and mobilizing
              communities to create protective environments.
            </p>
          </div>
        </div>
      </section>

      {/* How We Protect Children */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              How We Protect Children
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {protectionAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg border bg-background hover:shadow-lg transition-shadow"
                  >
                    <Icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                    <p className="text-foreground/70">{area.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Protecting Children */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our Child Protection Programs
            </h2>
            <div className="space-y-8">
              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-3 text-primary">
                  Ending Domestic Violence
                </h3>
                <p className="text-foreground/70 mb-4">
                  Our EDV programs directly protect children by preventing
                  domestic violence in their homes. We work with parents to
                  transform harmful behaviors, resolve conflicts peacefully, and
                  create loving family environments.
                </p>
                <div className="text-sm font-semibold text-primary">
                  76,825+ people reached, countless children protected
                </div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-3 text-primary">
                  Teen Mothers' Support
                </h3>
                <p className="text-foreground/70 mb-4">
                  We support teen mothers with vocational training, education,
                  and psychosocial support so they can provide for their
                  children and break the cycle of poverty. We also work to
                  prevent child marriage and early pregnancy.
                </p>
                <div className="text-sm font-semibold text-primary">
                  300+ teen mothers trained, protecting their children's futures
                </div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-3 text-primary">
                  Socio-Economic Empowerment
                </h3>
                <p className="text-foreground/70 mb-4">
                  When we empower mothers economically through VSL groups and
                  cooperatives, children benefit directly. Families can afford
                  school fees, healthcare, nutritious food, and safe housing.
                </p>
                <div className="text-sm font-semibold text-primary">
                  51,259 VSL members (42,265 women) supporting their children
                </div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-3 text-primary">
                  Community Mobilization
                </h3>
                <p className="text-foreground/70 mb-4">
                  We train community mobilizers to recognize and respond to
                  child protection issues, advocate for children's rights, and
                  create community-level child protection mechanisms.
                </p>
                <div className="text-sm font-semibold text-primary">
                  6,732 trained mobilizers protecting children in their
                  communities
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Stories of Protection
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-background">
                <p className="text-foreground/70 italic mb-4">
                  "Before ADTS, my children witnessed violence every day. Now
                  our home is peaceful. My husband and I resolve conflicts
                  calmly, and our children are thriving in school. The EDV
                  working group saved our family."
                </p>
                <p className="text-sm font-semibold">
                  — Mother of three, EDV program beneficiary
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-background">
                <p className="text-foreground/70 italic mb-4">
                  "As a teen mother, I thought my life was over. But ADTS gave
                  me vocational training and hope. Now I can provide for my
                  child, and I'm teaching other young mothers to do the same."
                </p>
                <p className="text-sm font-semibold">
                  — Teen mother, vocational training graduate
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-background">
                <p className="text-foreground/70 italic mb-4">
                  "Through the VSL group, I saved enough money to pay school
                  fees for all my children. They no longer have to drop out.
                  Education is their path out of poverty."
                </p>
                <p className="text-sm font-semibold">
                  — VSL group member and mother of five
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              How You Can Help Protect Children
            </h2>
            <p className="text-lg text-foreground/80 mb-12 text-pretty">
              Your support can transform the life of a child. Whether through
              donations, volunteering, or partnership, you can help us create
              safe, nurturing environments where every child can thrive.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Donate</h3>
                <p className="text-foreground/70 mb-4">
                  Your financial support funds programs that directly protect
                  and empower children and families.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Volunteer</h3>
                <p className="text-foreground/70 mb-4">
                  Use your skills and time to support our child protection and
                  family empowerment programs.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-3">Partner</h3>
                <p className="text-foreground/70 mb-4">
                  Organizations can partner with us to scale child protection
                  initiatives across Rwanda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Join Us in Protecting Children
            </h2>
            <p className="text-lg mb-8 text-pretty">
              Every child deserves a safe, loving environment to grow and
              thrive. Together, we can make that a reality for thousands of
              children across Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Involved
              </a>
              <a
                href="mailto:rwandaadts@gmail.com"
                className="inline-block px-8 py-3 border-2 border-background text-background rounded-lg font-semibold hover:bg-background hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
