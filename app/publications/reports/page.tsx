"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface PublicReport {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  pages: number;
  size: string;
  documentUrl: string;
}

export default function Reports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<PublicReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reports");

        if (!response.ok) {
          throw new Error("Failed to load reports");
        }

        const data = await response.json();
        const items: PublicReport[] = (data.reports ?? []).map((report: any) => ({
          id: report.id as string,
          title: (report.title as string) ?? "",
          description: (report.description as string) ?? "",
          category: (report.category as string) ?? "",
          year: (report.year as string) ?? "",
          pages: Number(report.pages ?? 0),
          size: (report.size as string) ?? "",
          documentUrl: (report.documentUrl as string) ?? "",
        }));

        setReports(items);
      } catch (error) {
        console.error("Failed to load reports", error);
        toast({
          title: "Failed to load reports",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [toast]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image3.jpg"
          alt="ADTS Rwanda reports and publications"
          fill
          className="object-cover brightness-90"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            Reports & Publications
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Access our annual reports, program evaluations, and research
            documentation
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Transparency & Evidence-Based Programming
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              At ADTS Rwanda, we are committed to transparency, accountability,
              and evidence-based programming. Our reports document our impact,
              share lessons learned, and contribute to the broader knowledge
              base on social transformation and community development.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">23+</div>
                <div className="text-sm text-foreground/70">
                  Years Documented
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-foreground/70">
                  Transparent Reporting
                </div>
              </div>
              <div className="p-6 rounded-lg border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-2">RGB</div>
                <div className="text-sm text-foreground/70">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Available Reports</h2>
            {isLoading && reports.length === 0 && (
              <p className="text-sm text-foreground/60">
                Loading reports...
              </p>
            )}
            {!isLoading && reports.length === 0 && (
              <p className="text-sm text-foreground/60">
                No reports are available at the moment. Please check back later.
              </p>
            )}
            <div className="space-y-6">
              {reports.slice(0, showMore ? reports.length : 2).map((report) => (
                <div
                  key={report.id}
                  className="bg-background rounded-lg border p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {report.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-foreground/60">
                          <Calendar className="h-4 w-4" />
                          {report.year || ""}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {report.title}
                      </h3>
                      <p className="text-foreground/70 mb-4">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                        <span>
                          {report.pages
                            ? `${report.pages} pages`
                            : "Pages: N/A"}
                        </span>
                        <span>•</span>
                        <span>{report.size || "Size: N/A"}</span>
                      </div>
                      {report.documentUrl && (
                        <a
                          href={report.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                          <Download className="h-4 w-4" />
                          Download Report
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Show More/Less Button */}
              {reports.length > 2 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                  >
                    {showMore ? (
                      <>
                        <ChevronDown className="h-4 w-4 rotate-180" />
                        Show Less Reports
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show More Reports ({reports.length - 2} more)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Request Custom Reports */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Request Custom Reports or Data
            </h2>
            <p className="text-lg text-foreground/80 mb-8 text-center text-pretty">
              Researchers, partners, and stakeholders can request additional
              data, custom reports, or access to our research documentation. We
              support evidence-based policy and program development.
            </p>
            <div className="text-center">
              <a
                href="mailto:rwandaadts@gmail.com?subject=Report Request"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Request Report or Data
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Research & Documentation */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Our Approach to Research & Documentation
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Rigorous Monitoring & Evaluation
                </h3>
                <p className="text-foreground/70">
                  We use robust M&E systems to track program outputs, outcomes,
                  and impact. Our data collection methods include surveys, focus
                  groups, case studies, and participatory evaluation.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Participatory Documentation
                </h3>
                <p className="text-foreground/70">
                  We involve beneficiaries and communities in documenting their
                  own stories and outcomes, ensuring that their voices and
                  perspectives are central to our reporting.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Learning & Adaptation
                </h3>
                <p className="text-foreground/70">
                  Our research and documentation inform continuous program
                  improvement. We use evidence to adapt strategies, refine
                  methodologies, and scale what works.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-background">
                <h3 className="text-xl font-semibold mb-2">
                  Knowledge Sharing
                </h3>
                <p className="text-foreground/70">
                  We share our findings with partners, policymakers, and the
                  broader development community to contribute to collective
                  learning and evidence-based practice.
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
              Questions About Our Reports?
            </h2>
            <p className="text-lg mb-8 text-pretty">
              For inquiries about our reports, research methodology, or to
              request additional documentation, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+250788308255"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                +250 788 605 493
              </a>
              <a
                href="mailto:rwandaadts@gmail.com?subject=Report Inquiry"
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
