import { Play } from "lucide-react"
import Image from "next/image"

export default function Videos() {
  const videos = [
    {
      title: "Training for Transformation in Action",
      description: "See how our TFT methodology empowers community mobilizers across the Great Lakes region.",
      thumbnail: "/community-training-workshop-rwanda.jpg",
    },
    {
      title: "Ending Domestic Violence: Community Stories",
      description: "Hear from families transformed through our EDV working groups and gender focal points.",
      thumbnail: "/family-counseling-support-rwanda.jpg",
    },
    {
      title: "Women's Economic Empowerment Through VSL",
      description: "Discover how Voluntary Savings and Loan groups are lifting women out of poverty.",
      thumbnail: "/women-savings-group-meeting-rwanda.jpg",
    },
    {
      title: "Teen Mothers: From Despair to Hope",
      description: "Follow the journey of teen mothers receiving vocational training and psychosocial support.",
      thumbnail: "/vocational-training-sewing-rwanda.jpg",
    },
    {
      title: "Community Mobilization for Social Change",
      description: "Watch how trained mobilizers are leading transformation in their communities.",
      thumbnail: "/community-meeting-dialogue-rwanda.jpg",
    },
    {
      title: "23 Years of Impact: ADTS Rwanda Story",
      description: "A comprehensive look at our journey from 1998 to today and the lives we've transformed.",
      thumbnail: "/rwanda-community-celebration-success.jpg",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/community-training-workshop-rwanda.jpg"
          alt="ADTS Rwanda video stories"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Videos</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Watch stories of transformation, hope, and empowerment from across Rwanda
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {videos.map((video, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-accent">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-foreground/70">{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Want to Share Your Story?</h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              If you've been impacted by ADTS Rwanda's programs and would like to share your testimony, we'd love to
              hear from you.
            </p>
            <a
              href="mailto:adtsrwanda@yahoo.fr?subject=Video Testimony"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
