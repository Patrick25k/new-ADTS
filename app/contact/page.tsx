"use client";

import type React from "react";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useEffect } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Form submission started");

    // Validate form data before proceeding
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      console.log("❌ Form validation failed - missing fields");
      setSubmitStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      console.log("📤 Sending form data via EmailJS:", formData);

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey =
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      if (!serviceId || !templateId || !publicKey) {
        console.warn("EmailJS environment variables are not set");
        setSubmitStatus("error");
        setStatusMessage(
          "Email service not configured. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
        );
        return;
      }

      // Admin notification params (include reply_to so admin can reply to the sender)
      // include both sets of keys: the EmailJS template in your dashboard is using {{name}} and {{email}}
      // so send those names (and keep from_name/from_email for compatibility)
      const templateParams = {
        name: formData.name,
        email: formData.email,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      console.log("📨 EmailJS admin send result:", result);

      // Optionally send an auto-reply if an auto-reply template id is configured
      const autoTemplateId =
        process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID;
      if (autoTemplateId) {
        try {
          // auto-reply template variables (match template fields you create)
          const autoParams = {
            name: formData.name,
            email: formData.email,
            subject: `Re: ${formData.subject}`,
            message: `Hi ${formData.name},\n\nThank you for contacting ADTS Rwanda. We received your message and will get back to you soon.\n\n--- Your message ---\n${formData.message}`,
          };
          const autoResult = await emailjs.send(
            serviceId,
            autoTemplateId,
            autoParams,
            publicKey
          );
          console.log("📨 EmailJS auto-reply send result:", autoResult);
        } catch (autoErr) {
          console.warn("Auto-reply failed:", autoErr);
        }
      }

      setSubmitStatus("success");
      setStatusMessage(
        "Thank you! Your message was sent. We will get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("💥 EmailJS error:", error);
      setSubmitStatus("error");
      setStatusMessage(
        "Failed to send message via EmailJS. Please try again or contact us directly."
      );
    } finally {
      console.log("🏁 Form submission completed");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Map initialization (client-only) — removed because the dynamic-import useEffect below performs Leaflet setup.
  useEffect(() => {
    // Intentionally left blank: the dynamic-import useEffect that follows initializes Leaflet and the map.
  }, []);
  // Map initialization (client-only) — dynamically import Leaflet inside an async init
  useEffect(() => {
    let map: any = null;
    let cssLink: HTMLLinkElement | null = null;

    const init = async () => {
      if (typeof window === "undefined") return;
      const container = document.getElementById(
        "adts-map"
      ) as HTMLElement | null;
      if (!container) return;
      if ((container as any).__mapInitialized) return;

      // Inject Leaflet CSS from CDN if not already present
      if (!document.querySelector("link[data-leaflet]")) {
        cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        cssLink.setAttribute("data-leaflet", "true");
        document.head.appendChild(cssLink);
      }

      // dynamic import of leaflet (client only)
      const mod = await import("leaflet");
      const L = (mod && (mod as any).default) || mod;

      map = L.map(container, { scrollWheelZoom: false }).setView(
        [-1.9596, 30.0605],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Try to geocode address and show a circle marker; fall back on Muhima coords
      try {
        const address = "Kinyinya, KG 380 St 7, Kigali, Rwanda";
        const q = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          const lat = parseFloat(json[0].lat);
          const lon = parseFloat(json[0].lon);
          map.setView([lat, lon], 16);
          const circle = L.circleMarker([lat, lon], {
            radius: 8,
            color: "#1e40af",
            fillColor: "#1e40af",
            fillOpacity: 0.9,
          }).addTo(map);
          circle
            .bindPopup("<b>ADTS Rwanda</b><br/>Kinyinya, KG 380 St 7")
            .openPopup();
        } else {
          const circle = L.circleMarker([-1.9596, 30.0605], {
            radius: 8,
            color: "#1e40af",
            fillColor: "#1e40af",
            fillOpacity: 0.9,
          }).addTo(map);
          circle
            .bindPopup("<b>ADTS Rwanda</b><br/>Muhima, Nyarugenge District")
            .openPopup();
        }
      } catch (e) {
        console.warn("Geocoding failed, falling back to fixed coords", e);
        const circle = L.circleMarker([-1.9596, 30.0605], {
          radius: 8,
          color: "#1e40af",
          fillColor: "#1e40af",
          fillOpacity: 0.9,
        }).addTo(map);
        circle
          .bindPopup("<b>ADTS Rwanda</b><br/>Muhima, Nyarugenge District")
          .openPopup();
      }

      (container as any).__mapInitialized = true;
    };

    init();

    return () => {
      try {
        if (map) map.remove();
      } catch (e) {
        // ignore
      }
      if (cssLink && cssLink.parentNode)
        cssLink.parentNode.removeChild(cssLink);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(/diverse-community-people-rwanda-hope-gathering.jpg?height=400&width=1920&query=Rwanda+landscape+beautiful+nature)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FCB20B] mb-4">
            CONTACT US
          </h1>
          <p className="text-xl text-background/90 max-w-2xl mx-auto">
            Get in touch with us to learn more about our work or get involved
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">GET IN TOUCH</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We'd love to hear from you. Whether you have questions about our
                programs, want to volunteer, or are interested in partnering
                with us, please reach out.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Our Location</h3>
                        <p className="text-muted-foreground">
                          Kigali, Rwanda
                          <br />
                          Muhima, Nyarugenge District
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Phone</h3>
                        <p className="text-muted-foreground">
                          +250 788 123 456
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Email</h3>
                        <p className="text-muted-foreground">
                          info@adtsrwanda.org
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Office Hours */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Office Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">SEND US A MESSAGE</h2>

                  {/* Status Messages */}
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 font-medium">
                          Message Sent Successfully!
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          {statusMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-medium">
                          Error Sending Message
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          {statusMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    method="POST"
                    action="#"
                    noValidate
                  >
                    {/* Debug info */}
                    <div style={{ display: "none" }}>
                      <p>
                        Form Debug:{" "}
                        {JSON.stringify({ isSubmitting, submitStatus })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full hover:cursor-pointer"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        console.log("🖱️ Button clicked!");
                        // Don't prevent default here, let the form handle it
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">FIND US</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[400px] bg-muted">
                  <div id="adts-map" style={{ height: 400 }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">READY TO MAKE AN IMPACT?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join us in our mission to transform lives and empower communities
            across Rwanda
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <a href="mailto:info@adtsrwanda.org">Email Us</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <a href="tel:+250788123456">Call Us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
