"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  User,
  TrendingUp,
  Heart,
  Clock,
  Share2,
  FileText,
  BookOpen,
  AlertTriangle
} from "lucide-react"

type StoryStatus = "Draft" | "Published"

interface Story {
  id: string
  title: string
  excerpt: string
  story: string
  impact: string
  category: string
  status: StoryStatus
  featured: boolean
  image: string
  author: string
  authorAvatar: string
  readTime: string
  views: number
  likes: number
  comments: number
  date: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export default function StoriesManagement() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | StoryStatus | "featured">("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    story: "",
    impact: "",
    category: "",
    status: "Draft" as StoryStatus,
    featured: false,
    image: "",
    author: "",
    readTime: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const loadStories = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/stories", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to load stories")
      }

      const data = await response.json()
      setStories(data.stories ?? [])
    } catch (error) {
      console.error("Failed to load stories", error)
      toast({
        title: "Failed to load stories",
        description: "Please try again or check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadStories()
  }, [loadStories])

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch =
        !search ||
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        story.category.toLowerCase().includes(search.toLowerCase()) ||
        story.author.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
          ? story.featured
          : story.status === statusFilter

      return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  }, [stories, search, statusFilter])

  const stats = useMemo(() => {
    const total = stories.length
    const published = stories.filter((s) => s.status === "Published").length
    const featured = stories.filter((s) => s.featured).length
    const totalImpact = stories.reduce((sum, s) => sum + (s.views ?? 0), 0)

    return [
      { label: "Total Stories", value: String(total), change: "", icon: Heart, color: "text-red-600", bgColor: "bg-red-50" },
      { label: "Published", value: String(published), change: "", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
      { label: "Featured", value: String(featured), change: "", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50" },
      { label: "Total Impact", value: String(totalImpact), change: "", icon: User, color: "text-purple-600", bgColor: "bg-purple-50" },
    ]
  }, [stories])

  const openNewDialog = () => {
    setEditingStory(null)
    setForm({
      title: "",
      excerpt: "",
      story: "",
      impact: "",
      category: "",
      status: "Draft",
      featured: false,
      image: "",
      author: "",
      readTime: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (story: Story) => {
    setEditingStory(story)
    setForm({
      title: story.title,
      excerpt: story.excerpt,
      story: story.story,
      impact: story.impact,
      category: story.category,
      status: story.status,
      featured: story.featured,
      image: story.image,
      author: story.author,
      readTime: story.readTime,
    })
    setIsDialogOpen(true)
  }

  const handleFormChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImageFile(null)
      return
    }

    try {
      setIsUploadingImage(true)
      setImageFile(file)

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
        image: url,
      }))

      toast({
        title: "Image uploaded",
        description: "Story image has been uploaded successfully.",
      })
    } catch (error: any) {
      console.error("Failed to upload image", error)
      toast({
        title: "Failed to upload image",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
      setImageFile(null)
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

      const endpoint = editingStory
        ? `/api/admin/stories/${editingStory.id}`
        : "/api/admin/stories"
      const method = editingStory ? "PUT" : "POST"

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
        throw new Error(data?.error || "Failed to save story")
      }

      const data = await response.json()
      const saved: Story = data.story

      setStories((prev) => {
        if (editingStory) {
          return prev.map((s) => (s.id === saved.id ? saved : s))
        }
        return [saved, ...prev]
      })

      toast({
        title: editingStory ? "Story updated" : "Story created",
        description: editingStory
          ? "Your changes have been saved."
          : "Your story has been created.",
      })

      setIsDialogOpen(false)
      setEditingStory(null)

      await loadStories()
    } catch (error: any) {
      console.error("Failed to save story", error)
      toast({
        title: "Failed to save story",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!storyToDelete) return

    try {
      const response = await fetch(`/api/admin/stories/${storyToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to delete story")
      }

      setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id))

      toast({
        title: "Story deleted",
        description: "The story has been removed.",
      })

      setDeleteDialogOpen(false)
      setStoryToDelete(null)

      await loadStories()
    } catch (error: any) {
      console.error("Failed to delete story", error)
      toast({
        title: "Failed to delete story",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (story: Story) => {
    setStoryToDelete(story)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setStoryToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Success Stories"
        description="Manage inspiring stories and testimonials"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Plus className="w-4 h-4" />
              New Story
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
                  placeholder="Search stories..."
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
                  All Stories
                </Button>
                <Button
                  variant={statusFilter === "Published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Published")}
                >
                  Published
                </Button>
                <Button
                  variant={statusFilter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("featured")}
                >
                  Featured
                </Button>
                <Button
                  variant={statusFilter === "Draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Draft")}
                >
                  Drafts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        {isLoading && stories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading stories...</p>
            </div>
          </div>
        ) : !isLoading && filteredStories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <BookOpen className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No stories found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new story to get started.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredStories.length} of {stories.length} stories (most recent)
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                {story.image ? (
                  <div className="h-40 overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-red-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                    <Heart className="w-16 h-16 text-red-400" />
                  </div>
                )}
                {story.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    story.status === 'Published' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}
                >
                  {story.status}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {story.category}
                    </Badge>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-medium text-red-600">
                        {story.authorAvatar}
                      </div>
                      <span>{story.author}</span>
                    </div>
                    <span>{story.readTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{story.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{story.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{story.date ? new Date(story.date).toLocaleDateString() : "No date"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                        onClick={() => openEditDialog(story)}
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
                        onClick={() => openDeleteDialog(story)}
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStory ? "Edit Story" : "New Story"}</DialogTitle>
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
                rows={2}
                placeholder="Brief summary of the story"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Story</label>
              <Textarea
                value={form.story}
                onChange={(event) => handleFormChange("story", event.target.value)}
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
                  placeholder="e.g. Success Story, Impact"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={form.author}
                  onChange={(event) => handleFormChange("author", event.target.value)}
                  placeholder="Story author name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Story Image</label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {form.image && (
                  <p className="text-xs text-gray-500 break-all">
                    Current image: {form.image}
                  </p>
                )}
                {isUploadingImage && (
                  <p className="text-xs text-blue-600">Uploading image...</p>
                )}
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
                    {editingStory ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingStory ? "Save Changes" : "Create Story"}
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
              Delete Story
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{storyToDelete?.title}"? This action cannot be undone and will permanently remove the story from your success stories.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {storyToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{storyToDelete.title}</p>
                    <p className="text-sm text-gray-500">{storyToDelete.category}</p>
                    <p className="text-xs text-gray-400">By {storyToDelete.author} • {storyToDelete.readTime} read</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isSubmitting || isUploadingImage}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isUploadingImage}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Story
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
