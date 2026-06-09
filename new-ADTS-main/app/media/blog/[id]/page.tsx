"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  coverImageUrl: string
  authorName: string
  publishedAt: string
  createdAt: string
  date: string
  featured: boolean
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = params.id as string
        if (!postId) {
          setError("Post not found")
          return
        }

        const response = await fetch(`/api/blogs/${postId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Post not found")
          } else {
            setError("Failed to load post")
          }
          return
        }

        const data = await response.json()
        setPost(data.post)
      } catch (error) {
        console.error("Failed to load blog post", error)
        setError("Failed to load post")
      } finally {
        setIsLoading(false)
      }
    }

    loadPost()
  }, [params.id])

  const handleShare = (platform: string) => {
    if (!post) return

    const url = window.location.href
    const text = `Check out this article: ${post.title}`

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
        break
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-32 mx-auto mb-4"></div>
              <div className="h-12 bg-white/20 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Content Loading */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-50"></div>
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Post Not Found</h1>
            <p className="text-xl max-w-3xl mx-auto">The blog post you're looking for doesn't exist or has been removed.</p>
          </div>
        </section>

        {/* Error Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg">
                  <ArrowLeft className="w-4 h-4" />
                  {error || "Post not found"}
                </div>
              </div>
              <Link
                href="/media/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Cover Image */}
      <section className="relative h-[400px] flex items-center justify-center">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"></div>
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="mb-6">
            <Link
              href="/media/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="ml-2 inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="mb-12 pb-8 border-b">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                </div>
                
                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 mr-2">Share:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors hover:cursor-pointer"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors hover:cursor-pointer"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors hover:cursor-pointer"
                    title="Share via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-8">
                <div className="text-xl text-gray-600 italic leading-relaxed border-l-4 border-primary pl-4">
                  {post.excerpt}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags/Categories */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Back to Blog Button */}
            <div className="mt-12 text-center">
              <Link
                href="/media/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-content {
          line-height: 1.8;
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .blog-content h1 { font-size: 2.5rem; }
        .blog-content h2 { font-size: 2rem; }
        .blog-content h3 { font-size: 1.5rem; }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #4b5563;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .blog-content blockquote {
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background-color: #f9fafb;
          border-left: 4px solid #3b82f6;
          font-style: italic;
          color: #6b7280;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #ef4444;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .blog-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </main>
  )
}
