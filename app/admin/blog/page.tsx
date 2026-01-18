"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  Share2,
  AlertTriangle,
} from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

type BlogStatus = "Draft" | "Published"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  status: BlogStatus
  featured: boolean
  coverImageUrl: string
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  authorName: string | null
  authorEmail: string | null
}

export default function BlogManagement() {
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus | "featured">("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "Draft" as BlogStatus,
    featured: false,
    coverImageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/blogs", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to load blogs")
      }

      const data = await response.json()
      setBlogs(data.blogs ?? [])
    } catch (error) {
      console.error("Failed to load blogs", error)
      toast({
        title: "Failed to load blogs",
        description: "Please try again or check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadBlogs()
  }, [loadBlogs])

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        !search ||
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        blog.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
          ? blog.featured
          : blog.status === statusFilter

      return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  }, [blogs, search, statusFilter])

  const stats = useMemo(() => {
    const total = blogs.length
    const published = blogs.filter((b) => b.status === "Published").length
    const drafts = blogs.filter((b) => b.status === "Draft").length
    const totalViews = blogs.reduce((sum, b) => sum + (b.views ?? 0), 0)

    return [
      { label: "Total Posts", value: String(total), change: "", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
      { label: "Published", value: String(published), change: "", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
      { label: "Drafts", value: String(drafts), change: "", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
      { label: "Total Views", value: String(totalViews), change: "", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    ]
  }, [blogs])

  const openNewDialog = () => {
    setEditingBlog(null)
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      status: "Draft",
      featured: false,
      coverImageUrl: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      status: blog.status,
      featured: blog.featured,
      coverImageUrl: blog.coverImageUrl,
    })
    setIsDialogOpen(true)
  }

  const handleFormChange = (
    field: keyof typeof form,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCoverImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      setCoverImageFile(null)
      return
    }

    try {
      setIsUploadingImage(true)
      setCoverImageFile(file)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to upload image")
      }

      const data = await response.json()
      const url = data.url as string | undefined

      if (!url) {
        throw new Error("Upload succeeded but no URL was returned")
      }

      setForm((prev) => ({
        ...prev,
        coverImageUrl: url,
      }))

      toast({
        title: "Image uploaded",
        description: "Cover image has been uploaded successfully.",
      })
    } catch (error: any) {
      console.error("Failed to upload image", error)
      toast({
        title: "Failed to upload image",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
      setCoverImageFile(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      if (isUploadingImage) {
        toast({
          title: "Please wait",
          description: "Image is still uploading. Please wait for it to finish.",
        })
        return
      }

      setIsSubmitting(true)

      const payload = { ...form }

      const endpoint = editingBlog
        ? `/api/admin/blogs/${editingBlog.id}`
        : "/api/admin/blogs"
      const method = editingBlog ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to save blog post")
      }

      const data = await response.json()
      const saved: BlogPost = data.blog

      setBlogs((prev) => {
        if (editingBlog) {
          return prev.map((b) => (b.id === saved.id ? saved : b))
        }
        return [saved, ...prev]
      })

      toast({
        title: editingBlog ? "Blog updated" : "Blog created",
        description: editingBlog
          ? "Your changes have been saved."
          : "Your blog post has been created.",
      })

      setIsDialogOpen(false)
      setEditingBlog(null)

      await loadBlogs()
    } catch (error: any) {
      console.error("Failed to save blog post", error)
      toast({
        title: "Failed to save blog post",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!blogToDelete) return

    try {
      const response = await fetch(`/api/admin/blogs/${blogToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to delete blog post")
      }

      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id))

      toast({
        title: "Blog deleted",
        description: "The blog post has been removed.",
      })

      setDeleteDialogOpen(false)
      setBlogToDelete(null)

      await loadBlogs()
    } catch (error: any) {
      console.error("Failed to delete blog post", error)
      toast({
        title: "Failed to delete blog post",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (blog: BlogPost) => {
    setBlogToDelete(blog)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setBlogToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Blog Management"
        description="Create, edit, and manage your blog content"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All Posts
                </Button>
                <Button
                  variant={statusFilter === "Published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Published")}
                >
                  Published
                </Button>
                <Button
                  variant={statusFilter === "Draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Draft")}
                >
                  Drafts
                </Button>
                <Button
                  variant={statusFilter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("featured")}
                >
                  Featured
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        {isLoading && blogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        ) : !isLoading && filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No posts found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new post to get started.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredBlogs.length} of {blogs.length} posts (most recent)
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredBlogs.map((post) => (
            <Card
              key={post.id}
              className="bg-white hover:shadow-lg transition-all duration-200 group h-full flex flex-col"
            >
              <div className="relative">
                {post.coverImageUrl ? (
                  <div className="h-50 overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary/60" />
                  </div>
                )}
                {post.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    post.status === 'Published' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}
                >
                  {post.status}
                </Badge>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-4">
                  <div>
                    {post.category && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {post.category}
                      </Badge>
                    )}
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {post.authorName && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          {post.authorName
                            .split(" ")
                            .filter(Boolean)
                            .map((part) => part[0]?.toUpperCase())
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                      <span>{post.authorName ?? "Unknown author"}</span>
                    </div>
                    <span>
                      {post.publishedAt
                        ? "Published " + new Date(post.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {(() => {
                          const dateString = post.publishedAt ?? post.createdAt
                          if (!dateString) return "-"
                          return new Date(dateString).toLocaleDateString()
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                        onClick={() => openEditDialog(post)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(post)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBlog ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={form.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Textarea
                  value={form.excerpt}
                  onChange={(event) => handleFormChange("excerpt", event.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={form.content}
                  onChange={(event) => handleFormChange("content", event.target.value)}
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={form.category}
                    onChange={(event) => handleFormChange("category", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image</label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageFileChange}
                    />
                    {form.coverImageUrl && (
                      <p className="text-xs text-gray-500 break-all">
                        Current image URL: {form.coverImageUrl}
                      </p>
                    )}
                    {isUploadingImage && (
                      <p className="text-xs text-blue-600">Uploading image...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => handleFormChange("featured", event.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Button
                    type="button"
                    variant={form.status === "Draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFormChange("status", "Draft")}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    variant={form.status === "Published" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFormChange("status", "Published")}
                  >
                    Publish
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="ml-auto cursor-pointer"
                  disabled={isSubmitting || isUploadingImage}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingBlog ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingBlog ? "Save Changes" : "Create Post"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Blog Post
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone and will permanently remove the blog post from your website.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {blogToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{blogToDelete.title}</p>
                    <p className="text-sm text-gray-500">{blogToDelete.category}</p>
                    <p className="text-xs text-gray-400">By {blogToDelete.authorName || "Unknown author"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
