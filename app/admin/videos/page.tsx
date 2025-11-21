"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Search, 
  Filter, 
  Calendar,
  User,
  TrendingUp,
  Video,
  Clock,
  Share2,
  Eye,
  Upload
} from "lucide-react"

type VideoStatus = "Draft" | "Published"

interface VideoItem {
  id: string
  title: string
  description: string
  youtubeUrl: string
  category: string
  status: VideoStatus
  featured: boolean
  duration: string
  author: string
  authorAvatar: string
  views: number
  likes: number
  comments: number
  date: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url.trim())

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null
    }

    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v")
      if (v) return v
    }

    return null
  } catch {
    return null
  }
}

function getVideoThumbnailUrl(youtubeUrl: string): string {
  const id = extractYouTubeId(youtubeUrl)
  if (!id) return ""
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

export default function VideosManagement() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | VideoStatus | "featured">("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    category: "",
    status: "Draft" as VideoStatus,
    featured: false,
    duration: "",
    author: "",
  })

  const loadVideos = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/videos", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to load videos")
      }

      const data = await response.json()
      setVideos(data.videos ?? [])
    } catch (error) {
      console.error("Failed to load videos", error)
      toast({
        title: "Failed to load videos",
        description: "Please try again or check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        !search ||
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase()) ||
        video.category.toLowerCase().includes(search.toLowerCase()) ||
        video.author.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
          ? video.featured
          : video.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [videos, search, statusFilter])

  const stats = useMemo(() => {
    const total = videos.length
    const published = videos.filter((v) => v.status === "Published").length
    const totalViews = videos.reduce((sum, v) => sum + (v.views ?? 0), 0)

    return [
      { label: "Total Videos", value: String(total), change: "", icon: Video, color: "text-blue-600", bgColor: "bg-blue-50" },
      { label: "Published", value: String(published), change: "", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
      { label: "Total Views", value: totalViews.toLocaleString(), change: "", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
      { label: "Watch Time", value: "-", change: "", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    ]
  }, [videos])

  const openNewDialog = () => {
    setEditingVideo(null)
    setForm({
      title: "",
      description: "",
      youtubeUrl: "",
      category: "",
      status: "Draft",
      featured: false,
      duration: "",
      author: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video)
    setForm({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
      status: video.status,
      featured: video.featured,
      duration: video.duration,
      author: video.author,
    })
    setIsDialogOpen(true)
  }

  const handleFormChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      const payload = { ...form }

      const endpoint = editingVideo
        ? `/api/admin/videos/${editingVideo.id}`
        : "/api/admin/videos"
      const method = editingVideo ? "PUT" : "POST"

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
        throw new Error(data?.error || "Failed to save video")
      }

      const data = await response.json()
      const saved: VideoItem = data.video

      setVideos((prev) => {
        if (editingVideo) {
          return prev.map((v) => (v.id === saved.id ? saved : v))
        }
        return [saved, ...prev]
      })

      toast({
        title: editingVideo ? "Video updated" : "Video created",
        description: editingVideo
          ? "Your changes have been saved."
          : "Your video has been created.",
      })

      setIsDialogOpen(false)
      setEditingVideo(null)

      await loadVideos()
    } catch (error: any) {
      console.error("Failed to save video", error)
      toast({
        title: "Failed to save video",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (video: VideoItem) => {
    if (!confirm(`Delete video "${video.title}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || "Failed to delete video")
      }

      setVideos((prev) => prev.filter((v) => v.id !== video.id))

      toast({
        title: "Video deleted",
        description: "The video has been removed.",
      })

      await loadVideos()
    } catch (error: any) {
      console.error("Failed to delete video", error)
      toast({
        title: "Failed to delete video",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Video Library"
        description="Manage video content and media library"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Upload className="w-4 h-4" />
              Upload Video
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
                  placeholder="Search videos..."
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
                  All Videos
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

        {/* Videos Grid */}
        {isLoading && videos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading videos...</p>
            </div>
          </div>
        ) : !isLoading && filteredVideos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Video className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No videos found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new video to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const thumbnail = getVideoThumbnailUrl(video.youtubeUrl)

            return (
              <Card key={video.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
                <div className="relative">
                  {thumbnail ? (
                    <div className="h-48 rounded-t-lg flex items-center justify-center relative overflow-hidden bg-black/10">
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-800 ml-1" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-0">
                        {video.duration}
                      </Badge>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <Video className="w-16 h-16 text-blue-400" />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-gray-800 ml-1" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-0">
                        {video.duration}
                      </Badge>
                    </div>
                  )}
                  {video.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary" 
                    className={`absolute top-3 right-3 ${
                      video.status === 'Published' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {video.status}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {video.category}
                      </Badge>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          {video.authorAvatar}
                        </div>
                        <span>{video.author}</span>
                      </div>
                      <span>{video.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{video.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{video.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{video.date ? new Date(video.date).toLocaleDateString() : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/5"
                        >
                          <a href={video.youtubeUrl} target="_blank" rel="noreferrer">
                            <Play className="w-4 h-4 mr-1" />
                            Play
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-700 border-gray-200 hover:bg-gray-50"
                          onClick={() => openEditDialog(video)}
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
                          onClick={() => handleDelete(video)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "New Video"}</DialogTitle>
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
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) => handleFormChange("description", event.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube Video URL</label>
              <Input
                value={form.youtubeUrl}
                onChange={(event) => handleFormChange("youtubeUrl", event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
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
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={form.duration}
                  onChange={(event) => handleFormChange("duration", event.target.value)}
                  placeholder="e.g. 5:32"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Input
                value={form.author}
                onChange={(event) => handleFormChange("author", event.target.value)}
              />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingVideo ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingVideo ? "Save Changes" : "Create Video"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
