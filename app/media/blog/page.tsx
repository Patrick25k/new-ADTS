import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Blog() {
  const blogPosts = [
    {
      title: "25 Years of Transformation: Reflecting on ADTS Rwanda's Journey",
      date: "March 15, 2024",
      author: "ADTS Rwanda Team",
      category: "Organizational Updates",
      excerpt:
        "As we celebrate over two decades of service, we reflect on the journey from post-genocide recovery to sustainable community transformation. Discover the milestones, challenges, and triumphs that have shaped ADTS Rwanda.",
      image: "/images/image1.jpg",
    },
    {
      title: "The Power of Training for Transformation: A Methodology That Changes Lives",
      date: "February 28, 2024",
      author: "Program Team",
      category: "Methodologies",
      excerpt:
        "Training for Transformation (TFT) is more than a training program—it's a philosophy of empowerment. Learn how this Paulo Freire-inspired approach has trained 6,732 community mobilizers and transformed countless communities.",
      image: "/images/image3.jpg",
    },
    {
      title: "Breaking the Cycle: How VSL Groups Are Lifting Women Out of Poverty",
      date: "February 10, 2024",
      author: "Economic Empowerment Team",
      category: "Socio-Economic Empowerment",
      excerpt:
        "Voluntary Savings and Loan groups have created 51,259 members, with 82% being women. Discover how this simple yet powerful model is transforming economic realities for Rwanda's poorest women.",
      image: "/images/image_37.jpeg",
    },
    {
      title: "Ending Domestic Violence: A Community-Led Approach",
      date: "January 25, 2024",
      author: "EDV Program Team",
      category: "Gender Equality",
      excerpt:
        "Domestic violence doesn't end with laws and policies alone—it requires community mobilization, behavior change, and grassroots action. Learn how our EDV working groups are creating peaceful families across Rwanda.",
      image: "/images/image4.jpg",
    },
    {
      title: "Teen Mothers: From Stigma to Success",
      date: "January 10, 2024",
      author: "Youth Programs Team",
      category: "Youth Empowerment",
      excerpt:
        "Teen pregnancy often leads to rejection, poverty, and lost opportunities. But it doesn't have to. Discover how our teen mothers' program is restoring hope and creating pathways to success for 300+ young mothers.",
      image: "/images/image_9.jpeg",
    },
    {
      title: "The Role of Gender Focal Points in Preventing GBV",
      date: "December 20, 2023",
      author: "Gender Team",
      category: "Gender Equality",
      excerpt:
        "Gender focal points are unsung heroes in the fight against gender-based violence. Learn how these trained community members are monitoring, preventing, and responding to GBV at the grassroots level.",
      image: "/images/image6.jpg",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/images/image5.jpg"
          alt="ADTS Rwanda blog and insights"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FCB20B]">Blog</h1>
          <p className="text-xl max-w-3xl mx-auto text-pretty">
            Insights, updates, and reflections on social transformation in Rwanda
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4 text-sm font-semibold text-primary">Featured Post</div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-video rounded-lg overflow-hidden bg-accent">
                <img
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blogPosts[0].author}
                  </span>
                </div>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                  {blogPosts[0].category}
                </div>
                <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                <p className="text-foreground/70 mb-6">{blogPosts[0].excerpt}</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-accent overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-foreground/60 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                    </div>
                    <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              Subscribe to receive our latest blog posts, program updates, and stories of transformation directly in
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
