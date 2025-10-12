import { Briefcase, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

export default function Jobs() {
  const jobs = [
    {
      title: "Program Officer - Ending Domestic Violence",
      location: "Kigali, Rwanda",
      type: "Full-time",
      deadline: "April 20, 2024",
      description:
        "ADTS Rwanda seeks a passionate Program Officer to coordinate and implement our Ending Domestic Violence programs across multiple districts. The ideal candidate will have experience in GBV prevention, community mobilization, and program management.",
      requirements: [
        "Bachelor's degree in Social Work, Gender Studies, or related field",
        "3+ years experience in GBV prevention or women's empowerment programs",
        "Strong community mobilization and facilitation skills",
        "Fluency in Kinyarwanda and English; French is an asset",
        "Willingness to travel to field sites",
      ],
      status: "Open",
    },
    {
      title: "Field Officer - Socio-Economic Empowerment",
      location: "Multiple Districts",
      type: "Full-time",
      deadline: "April 25, 2024",
      description:
        "We are looking for dedicated Field Officers to support our VSL groups, cooperatives, and entrepreneurship training programs. You will work directly with communities to facilitate economic empowerment and financial literacy.",
      requirements: [
        "Diploma or Bachelor's degree in Economics, Business, or related field",
        "2+ years experience in microfinance, VSL, or cooperative development",
        "Strong training and facilitation skills",
        "Ability to work independently in rural communities",
        "Fluency in Kinyarwanda required",
      ],
      status: "Open",
    },
    {
      title: "Monitoring & Evaluation Officer",
      location: "Kigali, Rwanda",
      type: "Full-time",
      deadline: "March 30, 2024",
      description:
        "ADTS Rwanda seeks an M&E Officer to design and implement monitoring and evaluation systems, conduct data analysis, and produce impact reports for our programs.",
      requirements: [
        "Bachelor's degree in Statistics, Social Sciences, or related field",
        "3+ years experience in M&E for development programs",
        "Proficiency in data analysis tools (SPSS, Excel, etc.)",
        "Strong report writing and documentation skills",
        "Experience with participatory evaluation methods",
      ],
      status: "Closed",
    },
    {
      title: "Finance & Administration Officer",
      location: "Kigali, Rwanda",
      type: "Full-time",
      deadline: "April 15, 2024",
      description:
        "We are seeking a Finance & Administration Officer to manage financial operations, budgeting, reporting, and administrative functions for ADTS Rwanda.",
      requirements: [
        "Bachelor's degree in Accounting, Finance, or Business Administration",
        "CPA or ACCA qualification preferred",
        "3+ years experience in NGO finance and administration",
        "Knowledge of donor financial reporting requirements",
        "Proficiency in accounting software",
      ],
      status: "Open",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image_2.jpeg"
          alt="Career opportunities at ADTS Rwanda"
          fill
          className="object-cover object-[center_40%] brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Career Opportunities</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Join our team in transforming lives and empowering communities across Rwanda
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Work With ADTS Rwanda?</h2>
            <p className="text-lg text-foreground/80 mb-12 text-center text-pretty">
              At ADTS Rwanda, you'll be part of a mission-driven team committed to social transformation, gender
              equality, and sustainable development. We offer meaningful work, professional growth, and the opportunity
              to make a real difference.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">23+</div>
                <div className="text-sm text-foreground/70">Years of Impact</div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">140K+</div>
                <div className="text-sm text-foreground/70">Lives Transformed</div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">Values</div>
                <div className="text-sm text-foreground/70">Integrity, Innovation, Solidarity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Current Openings</h2>
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <div key={index} className="bg-background rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {job.deadline}
                        </span>
                      </div>
                      <p className="text-foreground/70 mb-4">{job.description}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Key Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {job.status === "Open" && (
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Apply Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">How to Apply</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">1. Review Job Description</h3>
                <p className="text-foreground/70">
                  Carefully read the job description, requirements, and responsibilities to ensure you meet the
                  qualifications.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">2. Prepare Application Documents</h3>
                <p className="text-foreground/70">
                  Prepare your CV, cover letter, and copies of relevant certificates and references. Ensure all
                  documents are up to date.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">3. Submit Your Application</h3>
                <p className="text-foreground/70">
                  Email your application to adtsrwanda@yahoo.fr with the job title in the subject line. Applications
                  must be received before the deadline.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">4. Selection Process</h3>
                <p className="text-foreground/70">
                  Shortlisted candidates will be contacted for interviews. Only successful applicants will be notified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equal Opportunity */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Equal Opportunity Employer</h2>
            <p className="text-lg text-foreground/80 text-pretty">
              ADTS Rwanda is an equal opportunity employer. We celebrate diversity and are committed to creating an
              inclusive environment for all employees. We encourage applications from women, people with disabilities,
              and members of historically marginalized communities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Questions About Careers?</h2>
            <p className="text-lg mb-8 text-pretty">
              For inquiries about job openings, application procedures, or working at ADTS Rwanda, please contact our HR
              department.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+250788308255"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                +250 788 308 255
              </a>
              <a
                href="mailto:adtsrwanda@yahoo.fr?subject=Career Inquiry"
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
