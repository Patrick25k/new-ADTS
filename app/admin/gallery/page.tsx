"use client"

import { useCallback, useEffect, useState } from "react"
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
  Trash2, 
  Search, 
  Filter, 
  Calendar,
  ImageIcon,
  TrendingUp,
  Eye,
  Download,
  Share2,
  Upload,
  Edit,
  X
} from "lucide-react"
import Image from "next/image"

type ImageStatus = "Published" | "Draft"

interface GalleryImage {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  photographer: string
  featured: boolean
  status: ImageStatus
  fileSize: string
  dimensions: string
  views: number
  downloads: number
  altText: string
  tags: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default function GalleryManagement() {
  const { toast } = useToast()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ImageStatus | "featured">("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    photographer: "",
    status: "Draft" as ImageStatus,
    featured: false,
    fileSize: "",
    dimensions: "",
    altText: "",
    tags: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/gallery", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to load images")
      }

      const data = await response.json()
      setImages(data.images ?? [])
    } catch (error) {
      console.error("Failed to load images", error)
      toast({
        title: "Failed to load images",
        description: "Please try again or check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      !search ||
      image.title.toLowerCase().includes(search.toLowerCase()) ||
      image.description.toLowerCase().includes(search.toLowerCase()) ||
      image.category.toLowerCase().includes(search.toLowerCase()) ||
      image.photographer.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "featured"
        ? image.featured
        : image.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      photographer: "",
      status: "Published" as ImageStatus,
      featured: false,
      fileSize: "",
      dimensions: "",
      altText: "",
      tags: "",
    })
    setEditingImage(null)
  }

  const handleFormChange = (
    field: keyof typeof form,
    value: string | boolean,
  ) => {
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
        imageUrl: url,
      }))

      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully.",
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

  const handleAddImage = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditImage = (image: GalleryImage) => {
    setForm({
      title: image.title,
      description: image.description,
      imageUrl: image.imageUrl,
      category: image.category,
      photographer: image.photographer,
      status: image.status,
      featured: image.featured,
      fileSize: image.fileSize,
      dimensions: image.dimensions,
      altText: image.altText,
      tags: image.tags,
    })
    setEditingImage(image)
    setIsDialogOpen(true)
  }

  const handleSaveImage = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      if (isUploadingImage) {
        toast({
          title: "Please wait",
          description: "Image is still uploading. Please wait for it to finish.",
        })
        return
      }

      const payload = editingImage ? { ...form, id: editingImage.id } : form

      const response = await fetch("/api/admin/gallery", {
        method: editingImage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Failed to ${editingImage ? "update" : "create"} image`)
      }

      await loadImages()
      setIsDialogOpen(false)
      resetForm()

      toast({
        title: `Image ${editingImage ? "updated" : "created"} successfully`,
        description: `The image has been ${editingImage ? "updated" : "added"} to the gallery.`,
      })
    } catch (error: any) {
      console.error(`Failed to ${editingImage ? "update" : "create"} image:`, error)
      toast({
        title: `Failed to ${editingImage ? "update" : "create"} image`,
        description: error?.message || "Please try again or check your connection.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/gallery?id=${image.id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      await loadImages()

      toast({
        title: "Image deleted successfully",
        description: `The image has been removed from the gallery.`,
      })
    } catch (error) {
      console.error("Failed to delete image:", error)
      toast({
        title: "Failed to delete image",
        description: "Please try again or check your connection.",
        variant: "destructive",
      })
    }
  }

  const stats = [
    { label: "Total Images", value: images.length.toString(), change: "+15", icon: ImageIcon, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Published", value: images.filter(i => i.status === "Published").length.toString(), change: "+8", icon: Upload, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Total Views", value: images.reduce((sum, i) => sum + i.views, 0).toString(), change: "+22%", icon: Eye, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Downloads", value: images.reduce((sum, i) => sum + i.downloads, 0).toString(), change: "+15%", icon: Download, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]
  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Photo Gallery"
        description="Manage photo gallery and media assets"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button onClick={handleAddImage} className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Image
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
                  placeholder="Search images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All Images
                </Button>
                <Button 
                  variant={statusFilter === "featured" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("featured")}
                >
                  Featured
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
                  Draft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No images found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="bg-white hover:shadow-lg transition-all duration-200 group overflow-hidden">
                <div className="relative">
                  <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.altText || image.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="absolute inset-0 w-16 h-16 text-gray-400 m-auto" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {image.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge 
                    variant="secondary" 
                    className={`absolute top-3 right-3 ${
                      image.status === 'Published' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {image.status}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {image.category || "Uncategorized"}
                      </Badge>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {image.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {image.dimensions || "Unknown"} • {image.photographer || "Unknown"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{image.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{image.downloads}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-primary border-primary/20 hover:bg-primary/5 h-8 px-3"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={() => handleDeleteImage(image)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Image" : "Add New Image"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveImage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  placeholder="Enter image title"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={form.category}
                  onChange={(event) => handleFormChange("category", event.target.value)}
                  placeholder="Enter category"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) => handleFormChange("description", event.target.value)}
                placeholder="Enter image description"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Image</label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="mt-1"
                  />
                  {form.imageUrl && (
                    <p className="text-xs text-gray-500 break-all">
                      Current image URL: {form.imageUrl}
                    </p>
                  )}
                  {isUploadingImage && (
                    <p className="text-xs text-blue-600">Uploading image...</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Photographer</label>
                <Input
                  value={form.photographer}
                  onChange={(event) => handleFormChange("photographer", event.target.value)}
                  placeholder="Photographer name"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={form.tags}
                  onChange={(event) => handleFormChange("tags", event.target.value)}
                  placeholder="Comma-separated tags"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Alt Text</label>
                <Input
                  value={form.altText}
                  onChange={(event) => handleFormChange("altText", event.target.value)}
                  placeholder="Alt text for accessibility"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">File Size</label>
                <Input
                  value={form.fileSize}
                  onChange={(event) => handleFormChange("fileSize", event.target.value)}
                  placeholder="e.g., 2.4 MB"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Dimensions</label>
                <Input
                  value={form.dimensions}
                  onChange={(event) => handleFormChange("dimensions", event.target.value)}
                  placeholder="e.g., 1920x1080"
                  className="mt-1"
                />
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
              <Button type="submit" className="ml-auto">
                {editingImage ? "Save Changes" : "Create Image"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
