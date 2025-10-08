"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "About Us",
      href: "/about",
      dropdown: [
        {
          name: "What Makes Us Different?",
          href: "/about/what-makes-us-different",
        },
        { name: "Who we are & What we do", href: "/about/who-we-are" },
        { name: "Why we exist", href: "/about/why-we-exist" },
        { name: "Where we work", href: "/about/where-we-work" },
        { name: "Historical Background", href: "/about/historical-background" },
        { name: "About ADTS Rwanda", href: "/about/adts" },
        { name: "Our Leadership Team", href: "/about/leadership-team" },
      ],
    },
    {
      name: "Get Involved",
      href: "/get-involved",
      dropdown: [
        { name: "Get Involved", href: "/get-involved" },
        { name: "Prayer", href: "/get-involved/prayer" },
        { name: "Protect a child", href: "/get-involved/protect-a-child" },
      ],
    },
    {
      name: "Media",
      href: "/media",
      dropdown: [
        { name: "Gallery", href: "/gallery" },
        { name: "Videos", href: "/media/videos" },
        { name: "Compassion Stories", href: "/media/stories" },
        { name: "Blog", href: "/media/blog" },
      ],
    },
    {
      name: "Publications",
      href: "/publications",
      dropdown: [
        { name: "Tender", href: "/publications/tender" },
        { name: "Jobs", href: "/publications/jobs" },
        { name: "Reports", href: "/publications/reports" },
      ],
    },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[9999] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+250788308255"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Phone className="h-4 w-4" />
                <span>+250 788 308 255</span>
              </a>
              <a
                href="mailto:adtsrwanda@yahoo.fr"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                <span>adtsrwanda@yahoo.fr</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 ml-5">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="/adts-rwanda-ngo-logo-with-globe-and-people.jpg"
                alt="ADTS Rwanda Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">ADTS</span>
              <span className="text-sm font-bold text-blue-500">RWANDA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button className="flex items-center gap-1 text-lg font-medium text-foreground/80 hover:text-[#FCB20B] transition-colors py-2 hover:cursor-pointer">
                      {item.name}
                      <ChevronDown className="h-6 w-6" />
                    </button>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-64 bg-background border rounded-lg shadow-lg py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-[#FCB20B] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-lg font-medium text-foreground/80 hover:text-[#FCB20B] transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.name ? null : item.name
                        )
                      }
                      className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.name && (
                      <div className="pl-4 space-y-2 mt-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
