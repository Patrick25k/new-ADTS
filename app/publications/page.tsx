import { FileText, Briefcase, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Publications() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Publications</h1>
            <p className="text-xl text-foreground/80 text-pretty">
              Access our reports, tenders, and career opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Publications Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              href="/publications/tender"
              className="group p-8 rounded-lg border bg-card hover:shadow-lg transition-all"
            >
              <FileText className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-3">Tenders</h2>
              <p className="text-foreground/70 mb-4">
                View current procurement opportunities and tender announcements from ADTS Rwanda.
              </p>
              <span className="text-primary font-semibold group-hover:underline">View Tenders →</span>
            </Link>

            <Link
              href="/publications/jobs"
              className="group p-8 rounded-lg border bg-card hover:shadow-lg transition-all"
            >
              <Briefcase className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-3">Jobs</h2>
              <p className="text-foreground/70 mb-4">
                Explore career opportunities and join our team in transforming lives across Rwanda.
              </p>
              <span className="text-primary font-semibold group-hover:underline">View Jobs →</span>
            </Link>

            <Link
              href="/publications/reports"
              className="group p-8 rounded-lg border bg-card hover:shadow-lg transition-all"
            >
              <BarChart3 className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-3">Reports</h2>
              <p className="text-foreground/70 mb-4">
                Access our annual reports, program evaluations, and research documentation.
              </p>
              <span className="text-primary font-semibold group-hover:underline">View Reports →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Our Publications */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Transparency & Accountability</h2>
            <p className="text-lg text-foreground/80 mb-6 text-center text-pretty">
              At ADTS Rwanda, we are committed to transparency and accountability in all our operations. Our
              publications section provides access to key organizational documents, opportunities, and impact reports.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">23+</div>
                <div className="text-sm text-foreground/70">Years of Documented Impact</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-foreground/70">Transparent Reporting</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">RGB</div>
                <div className="text-sm text-foreground/70">Compliant & Registered</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
