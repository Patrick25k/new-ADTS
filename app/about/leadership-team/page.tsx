"use client"

import { useState, useEffect } from "react";
import { Users, Shield, Target } from "lucide-react";
import Image from "next/image";

interface PublicTeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  featured: boolean;
  imageUrl: string;
  bio: string;
  skills: string[];
  joinDate: string | null;
  createdAt: string;
}

export default function LeadershipTeam() {
  const [members, setMembers] = useState<PublicTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/team");
        if (!response.ok) throw new Error("Failed to load team members");
        
        const data = await response.json();
        setMembers(data.members || []);
      } catch (error) {
        console.error("Failed to load leadership team", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, []);

  const leadershipMembers = members.filter((m) =>
    m.department.toLowerCase().includes("leadership"),
  );
  const featuredMembers = members.filter((m) => m.featured);
  const displayMembers = leadershipMembers.length > 0 ? leadershipMembers : featuredMembers;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <Image
          src="/images/image_39.jpeg"
          alt="ADTS Rwanda leadership"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">
            Our Leadership Team
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Dedicated leaders guiding ADTS Rwanda's mission of transformation
          </p>
        </div>
      </section>

      {/* Governance Structure */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Governance Structure
            </h2>
            <p className="text-lg text-foreground/80 mb-12 text-center text-pretty">
              ADTS Rwanda is governed by a robust structure that ensures
              accountability, transparency, and effective program delivery.
            </p>

            <div className="space-y-8">
              <div className="p-8 rounded-lg border bg-card">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      General Assembly
                    </h3>
                    <p className="text-foreground/70 mb-4">
                      The supreme authority of ADTS Rwanda, composed of 32
                      members who provide strategic direction and oversight.
                    </p>
                    <div className="text-sm text-foreground/60">
                      <strong>Role:</strong> Sets organizational policy,
                      approves strategic plans, elects leadership, and ensures
                      accountability to stakeholders and beneficiaries.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border bg-card">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Internal Audit Committee
                  </h3>
                  <p className="text-foreground/70">
                    Ensures financial integrity, compliance with regulations,
                    and proper use of resources. Conducts regular audits and
                    reports to the General Assembly.
                  </p>
                </div>
                <div className="p-6 rounded-lg border bg-card">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Conflict Resolution Committee
                  </h3>
                  <p className="text-foreground/70">
                    Addresses internal disputes, mediates conflicts, and ensures
                    a harmonious working environment aligned with our values of
                    mutual respect and solidarity.
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-lg border bg-card">
                <h3 className="text-2xl font-semibold mb-4">
                  National Coordination
                </h3>
                <p className="text-foreground/70 mb-4">
                  The National Coordination team facilitates day-to-day
                  management and coordinates all programs across Rwanda. This
                  team translates strategic vision into operational reality,
                  manages partnerships, oversees program implementation, and
                  ensures quality and impact.
                </p>
                <div className="text-sm text-foreground/60">
                  <strong>Responsibilities:</strong> Program management,
                  partnership coordination, financial oversight, monitoring and
                  evaluation, staff supervision, and stakeholder engagement.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profiles (real data) */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Leadership Profiles
            </h2>
            <p className="text-lg text-foreground/80 mb-12 text-center text-pretty">
              These leaders oversee programs, governance, and day-to-day management of
              ADTS Rwanda, ensuring our work remains rooted in communities and driven by
              our core values.
            </p>

            {isLoading ? (
              <p className="text-center text-sm text-foreground/60">
                Loading leadership team...
              </p>
            ) : displayMembers.length === 0 ? (
              <p className="text-center text-sm text-foreground/60">
                Leadership profiles will appear here once team members are added in the
                admin dashboard.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {displayMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 rounded-lg border bg-background flex flex-col gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-primary">
                            {member.name
                              .split(" ")
                              .filter(Boolean)
                              .map((part) => part[0]?.toUpperCase())
                              .slice(0, 2)
                              .join("") || "TM"}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-primary font-medium mb-1">
                          {member.position || "Leadership"}
                        </p>
                        {member.department && (
                          <p className="text-xs text-foreground/70 mb-1">
                            {member.department}
                          </p>
                        )}
                        {member.location && (
                          <p className="text-xs text-foreground/60">
                            {member.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {member.bio && (
                      <p className="text-foreground/70 text-sm">{member.bio}</p>
                    )}
                    {member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Leadership Principles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Leadership Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Servant Leadership
                </h3>
                <p className="text-foreground/70">
                  Our leaders serve the mission and the people, not their own
                  interests. Leadership is about empowerment, not control.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Participatory Decision-Making
                </h3>
                <p className="text-foreground/70">
                  We value the voices and wisdom of all stakeholders, especially
                  beneficiaries, in shaping our programs and strategies.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Accountability & Transparency
                </h3>
                <p className="text-foreground/70">
                  We hold ourselves accountable to our beneficiaries, partners,
                  and donors through transparent reporting and evaluation.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">
                  Continuous Learning
                </h3>
                <p className="text-foreground/70">
                  Our leaders are committed to ongoing learning, reflection, and
                  adaptation to improve our impact and effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-secondary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Connect With Our Team</h2>
            <p className="text-lg mb-8 text-pretty">
              For partnership inquiries, program information, or to learn more
              about our governance and leadership, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+250788308255"
                className="inline-block px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                +250 788 605 493
              </a>
              <a
                href="mailto:rwandaadts@gmail.com"
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
