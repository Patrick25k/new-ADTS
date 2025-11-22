"use client"

import { useState, useEffect } from "react"
import { Calendar, User, ArrowRight, ChevronDown, Mail, CheckCircle } from "lucide-react"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  date: string
  author: string
  category: string
  excerpt: string
  image: string
  featured: boolean
}

const staticBlogPosts: BlogPost[] = [
    {
      id: "1",
      title: "25 Years of Transformation: Reflecting on ADTS Rwanda's Journey",
      date: "March 15, 2024",
      author: "ADTS Rwanda Team",
      category: "Organizational Updates",
      excerpt:
        "As we celebrate over two decades of service, we reflect on the journey from post-genocide recovery to sustainable community transformation. Discover the milestones, challenges, and triumphs that have shaped ADTS Rwanda.",
      image: "/images/image1.jpg",
      featured: true,
    },
    {
      id: "2",
      title: "The Power of Training for Transformation: A Methodology That Changes Lives",
      date: "February 28, 2024",
      author: "Program Team",
      category: "Methodologies",
      excerpt:
        "Training for Transformation (TFT) is more than a training program—it's a philosophy of empowerment. Learn how this Paulo Freire-inspired approach has trained 6,732 community mobilizers and transformed countless communities.",
      image: "/images/image3.jpg",
      featured: false,
    },
    {
      id: "3",
      title: "Breaking the Cycle: How VSL Groups Are Lifting Women Out of Poverty",
      date: "February 10, 2024",
      author: "Economic Empowerment Team",
      category: "Socio-Economic Empowerment",
      excerpt:
        "Voluntary Savings and Loan groups have created 51,259 members, with 82% being women. Discover how this simple yet powerful model is transforming economic realities for Rwanda's poorest women.",
      image: "/images/image_37.jpeg",
      featured: false,
    },
    {
      id: "4",
      title: "Ending Domestic Violence: A Community-Led Approach",
      date: "January 25, 2024",
      author: "EDV Program Team",
      category: "Gender Equality",
      excerpt:
        "Domestic violence doesn't end with laws and policies alone—it requires community mobilization, behavior change, and grassroots action. Learn how our EDV working groups are creating peaceful families across Rwanda.",
      image: "/images/image4.jpg",
      featured: false,
    },
    {
      id: "5",
      title: "Teen Mothers: From Stigma to Success",
      date: "January 10, 2024",
      author: "Youth Programs Team",
      category: "Youth Empowerment",
      excerpt:
        "Teen pregnancy often leads to rejection, poverty, and lost opportunities. But it doesn't have to. Discover how our teen mothers' program is restoring hope and creating pathways to success for 300+ young mothers.",
      image: "/images/image_9.jpeg",
      featured: false,
    },
    {
      id: "6",
      title: "The Role of Gender Focal Points in Preventing GBV",
      date: "December 20, 2023",
      author: "Gender Team",
      category: "Gender Equality",
      excerpt:
        "Gender focal points are unsung heroes in the fight against gender-based violence. Learn how these trained community members are monitoring, preventing, and responding to GBV at the grassroots level.",
      image: "/images/image6.jpg",
      featured: false,
    },
]

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMore, setShowMore] = useState(false)
  const POSTS_PER_PAGE = 6 // 2 rows × 3 columns

  // Newsletter subscription state
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionMessage, setSubscriptionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/blogs", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to load blogs: ${response.status}`)
        }

        const data = await response.json()
        const dynamicPosts = (data.blogs ?? []).map((post: any) => ({
          id: post.id as string,
          title: post.title as string,
          date: (post.date as string) ?? "",
          author: (post.authorName as string) || "ADTS Rwanda Team",
          category: (post.category as string) || "Blog",
          excerpt: (post.excerpt as string) ?? "",
          image: (post.coverImageUrl as string) || "/placeholder.svg",
          featured: Boolean(post.featured),
        })) as BlogPost[]

        setBlogPosts(dynamicPosts)
      } catch (error) {
        console.error("Failed to load public blogs", error)
        setError("Failed to load blog posts")
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
  }, [])

  // Separate featured and regular posts
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)
  
  // Pagination for recent posts
  const displayedPosts = showMore ? regularPosts : regularPosts.slice(0, POSTS_PER_PAGE)
  const hasMorePosts = regularPosts.length > POSTS_PER_PAGE

  // If no featured posts, use the most recent regular post as featured
  const mainFeaturedPost = featuredPosts.length > 0 ? featuredPosts[0] : (blogPosts.length > 0 ? blogPosts[0] : null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setSubscriptionMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSubscriptionMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setIsSubscribing(true)
    setSubscriptionMessage(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || null }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscriptionMessage({ type: 'success', text: data.message })
        setEmail('')
        setName('')
      } else {
        setSubscriptionMessage({ type: 'error', text: data.error || 'Subscription failed' })
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setSubscriptionMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubscribing(false)
    }
  }

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
      {!isLoading && !error && mainFeaturedPost && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="mb-4 text-sm font-semibold text-primary">Featured Post</div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-video rounded-lg overflow-hidden bg-accent">
                  <img
                    src={mainFeaturedPost.image || "/placeholder.svg"}
                    alt={mainFeaturedPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {mainFeaturedPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {mainFeaturedPost.author}
                    </span>
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                    {mainFeaturedPost.category}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{mainFeaturedPost.title}</h2>
                  <p className="text-foreground/70 mb-6">{mainFeaturedPost.excerpt}</p>
                  <a
                    href={`/media/blog/${mainFeaturedPost.id}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Recent Posts</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground/60">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">No blog posts available yet.</p>
                <p className="text-sm text-foreground/50">Check back soon for new content!</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-background rounded-lg border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                    >
                      <div className="aspect-video bg-accent overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-xs text-foreground/60 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                        </div>
                        <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                          {post.category}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-foreground/70 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        <a
                          href={`/media/blog/${post.id}`}
                          className="mt-auto inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
                        >
                          Read More <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Show More Button */}
                {hasMorePosts && (
                  <div className="text-center pt-8">
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {showMore ? (
                        <>
                          <ChevronDown className="h-4 w-4 rotate-180" />
                          Show Less Posts
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show More Posts ({regularPosts.length - POSTS_PER_PAGE} more)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Stay Updated</h2>
            </div>
            <p className="text-lg text-foreground/80 mb-8 text-pretty">
              Subscribe to receive our latest blog posts, program updates, and stories of transformation directly in
              your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  required
                />
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>

            {/* Subscription Message */}
            {subscriptionMessage && (
              <div className={`mt-6 p-4 rounded-lg inline-flex items-center gap-2 ${
                subscriptionMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {subscriptionMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                <span>{subscriptionMessage.text}</span>
              </div>
            )}

            <p className="text-sm text-foreground/60 mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
