import { Calendar, FileText, Download } from "lucide-react";
import Image from "next/image";

export default function Tender() {
  const tenders = [
    {
      title: "Supply of Training Materials for Community Mobilization Programs",
      reference: "ADTS/TENDER/2024/001",
      deadline: "April 30, 2024",
      category: "Goods",
      description:
        "ADTS Rwanda invites qualified suppliers to submit bids for the supply of training materials including flip charts, markers, notebooks, and other educational materials for our Training for Transformation programs across multiple districts.",
      status: "Open",
    },
    {
      title: "Construction of Community Training Center - Kigali District",
      reference: "ADTS/TENDER/2024/002",
      deadline: "May 15, 2024",
      category: "Works",
      description:
        "ADTS Rwanda seeks qualified contractors to construct a community training center in Kigali District. The facility will include training rooms, offices, and community meeting spaces.",
      status: "Open",
    },
    {
      title:
        "Consultancy Services for Program Evaluation and Impact Assessment",
      reference: "ADTS/TENDER/2024/003",
      deadline: "March 31, 2024",
      category: "Services",
      description:
        "ADTS Rwanda invites qualified consultants to conduct a comprehensive evaluation of our Ending Domestic Violence and Socio-Economic Empowerment programs, including impact assessment and recommendations for improvement.",
      status: "Closed",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image2.jpg"
          alt="ADTS Rwanda tenders and procurement"
          fill
          className="object-cover object-[center_30%] brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            Tenders
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Current procurement opportunities and tender announcements
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Procurement Opportunities
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              ADTS Rwanda is committed to transparent and competitive
              procurement processes. We invite qualified suppliers, contractors,
              and service providers to participate in our tenders. All
              procurement follows Rwanda Governance Board (RGB) guidelines and
              best practices.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">Fair</div>
                <div className="text-sm text-foreground/70">
                  Competitive & Transparent Process
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">Open</div>
                <div className="text-sm text-foreground/70">
                  Equal Opportunity for All
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">RGB</div>
                <div className="text-sm text-foreground/70">
                  Compliant Procurement
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Tenders */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Current Tenders</h2>
            <div className="space-y-6">
              {tenders.map((tender, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg border p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tender.status === "Open"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {tender.status}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {tender.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {tender.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {tender.reference}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {tender.deadline}
                        </span>
                      </div>
                      <p className="text-foreground/70">{tender.description}</p>
                    </div>
                  </div>
                  {tender.status === "Open" && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      <Download className="h-4 w-4" />
                      Download Tender Document
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
            <h2 className="text-3xl font-bold mb-8">How to Submit a Bid</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">
                  1. Review Tender Documents
                </h3>
                <p className="text-foreground/70">
                  Download and carefully review all tender documents, including
                  terms of reference, specifications, and submission
                  requirements.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">
                  2. Prepare Your Bid
                </h3>
                <p className="text-foreground/70">
                  Prepare your technical and financial proposals according to
                  the specifications outlined in the tender document. Ensure all
                  required documents are included.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">
                  3. Submit Before Deadline
                </h3>
                <p className="text-foreground/70">
                  Submit your sealed bid to ADTS Rwanda offices before the
                  deadline. Late submissions will not be accepted.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">
                  4. Evaluation & Award
                </h3>
                <p className="text-foreground/70">
                  Bids will be evaluated based on technical and financial
                  criteria. Successful bidders will be notified and contracts
                  awarded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Questions About Tenders?
            </h2>
            <p className="text-lg mb-8 text-pretty">
              For inquiries about tender documents, clarifications, or
              submission procedures, please contact our procurement office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+250788308255"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                +250 788 605 493
              </a>
              <a
                href="mailto:rwandaadts@gmail.com?subject=Tender Inquiry"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                rwandaadts@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
