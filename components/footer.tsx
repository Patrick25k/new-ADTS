import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-2xl font-bold">ADTS</span>
              <span className="text-sm font-bold text-blue-500">RWANDA</span>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Transforming lives and empowering communities through social transformation, sustainable and equitable
              development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-background/80 hover:text-[#FCB20B] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-background/80 hover:text-[#FCB20B] transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="text-background/80 hover:text-[#FCB20B] transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-background/80 hover:text-[#FCB20B] transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-background/80">
                  Muhima, KN 55 St
                  <br />
                  Kigali, Rwanda
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+250788308255" className="text-background/80 hover:text-[#FCB20B] transition-colors">
                  +250 788 308 255
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:adtsrwanda@yahoo.fr"
                  className="text-background/80 hover:text-[#FCB20B] transition-colors"
                >
                  adtsrwanda@yahoo.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://web.facebook.com/profile.php?id=61574066652041"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-[#FCB20B] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/adts_rwanda250/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-[#FCB20B] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/AdtsrwandaAdts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-[#FCB20B] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>&copy; {new Date().getFullYear()} ADTS Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
