"use client"

import { useCallback, useEffect, useState } from "react"
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
  X,
  FolderOpen,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
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
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 8

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    status: "Draft" as ImageStatus,
    featured: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadMode, setUploadMode] = useState<"single" | "folder">("single")
  const [folderFiles, setFolderFiles] = useState<FileList | null>(null)
  const [isUploadingFolder, setIsUploadingFolder] = useState(false)
  const [folderProgress, setFolderProgress] = useState({ current: 0, total: 0 })

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
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage)
  const startIndex = (currentPage - 1) * imagesPerPage
  const endIndex = startIndex + imagesPerPage
  const paginatedImages = filteredImages.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      status: "Published" as ImageStatus,
      featured: false,
    })
    setImageFile(null)
    setFolderFiles(null)
    setUploadMode("single")
    setFolderProgress({ current: 0, total: 0 })
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

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      setFolderFiles(null)
      return
    }

    setFolderFiles(files)
    setFolderProgress({ current: 0, total: files.length })
  }

  const handleFolderBulkUpload = async () => {
    if (!folderFiles || folderFiles.length === 0) return

    try {
      setIsUploadingFolder(true)
      
      const imagePromises = Array.from(folderFiles).map(async (file, index) => {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            credentials: "include",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`)
          }

          const data = await response.json()
          
          // Create image entry with filename as title and no description
          const imagePayload = {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: "",
            imageUrl: data.url,
            status: form.status,
            featured: false,
          }

          const saveResponse = await fetch("/api/admin/gallery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(imagePayload),
          })

          if (!saveResponse.ok) {
            throw new Error(`Failed to save ${file.name}`)
          }

          setFolderProgress(prev => ({ ...prev, current: index + 1 }))
          return { success: true, file: file.name }
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error)
          return { success: false, file: file.name, error }
        }
      })

      const results = await Promise.all(imagePromises)
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      await loadImages()
      setIsDialogOpen(false)
      resetForm()

      toast({
        title: "Folder upload completed",
        description: `Successfully uploaded ${successful} images${failed > 0 ? `, ${failed} failed` : ""}`,
        variant: failed > 0 ? "destructive" : "default",
      })
    } catch (error: any) {
      console.error("Failed to upload folder", error)
      toast({
        title: "Failed to upload folder",
        description: error?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingFolder(false)
      setFolderFiles(null)
      setFolderProgress({ current: 0, total: 0 })
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
      status: image.status,
      featured: image.featured,
    })
    setEditingImage(image)
    setIsDialogOpen(true)
    setUploadMode("single")
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

      setIsSubmitting(true)

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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!imageToDelete) return

    try {
      const response = await fetch(`/api/admin/gallery?id=${imageToDelete.id}`, {
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

      setDeleteDialogOpen(false)
      setImageToDelete(null)
    } catch (error) {
      console.error("Failed to delete image:", error)
      toast({
        title: "Failed to delete image",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (image: GalleryImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setImageToDelete(null)
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
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          </div>
        ) : paginatedImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <ImageIcon className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No images found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or add new images to get started.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min(endIndex, filteredImages.length)} of {filteredImages.length} images ({paginatedImages.length} on this page)
              </div>
              
              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2 bg-gray-200 rounded-full border border-gray-200 px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-full hover:bg-primary"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                    {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 rounded-full hover:bg-primary"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedImages.map((image) => (
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
                          onClick={() => openDeleteDialog(image)}
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
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Edit Image" : uploadMode === "folder" ? "Upload Folder" : "Add New Image"}
            </DialogTitle>
          </DialogHeader>
          
          {!editingImage && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                type="button"
                variant={uploadMode === "single" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUploadMode("single")}
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Single Image
              </Button>
              <Button
                type="button"
                variant={uploadMode === "folder" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUploadMode("folder")}
                className="flex-1"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Folder Upload
              </Button>
            </div>
          )}
          
          {uploadMode === "folder" && !editingImage ? (
            // Folder Upload Form
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Folder</label>
                <div className="mt-1">
                  <input
                    type="file"
                    {...({ webkitdirectory: "true", directory: "true" } as any)}
                    multiple={true}
                    onChange={handleFolderUpload}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a folder containing images. All images will be uploaded with filenames as titles.
                  </p>
                </div>
              </div>

              {folderFiles && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    {folderFiles.length} images selected
                  </p>
                  <div className="mt-2 text-xs text-gray-600">
                    First few files: {Array.from(folderFiles).slice(0, 3).map(f => f.name).join(", ")}
                    {folderFiles.length > 3 && "..."}
                  </div>
                </div>
              )}

              {isUploadingFolder && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading images...</span>
                    <span>{folderProgress.current} / {folderProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(folderProgress.current / folderProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

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
                    Mark first image as featured
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
                  type="button" 
                  className="ml-auto cursor-pointer"
                  onClick={handleFolderBulkUpload}
                  disabled={!folderFiles || isUploadingFolder}
                >
                  {isUploadingFolder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Folder
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            // Single Image Form
            <form onSubmit={handleSaveImage} className="space-y-4">
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
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(event) => handleFormChange("description", event.target.value)}
                  placeholder="Enter image description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Image</label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="mt-1 cursor-pointer"
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
                      {editingImage ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingImage ? "Save Changes" : "Create Image"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Image
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{imageToDelete?.title}"? This action cannot be undone and will permanently remove the image from your gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {imageToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{imageToDelete.title}</p>
                    <p className="text-sm text-gray-500">{imageToDelete.category}</p>
                    <p className="text-xs text-gray-400">{imageToDelete.dimensions} • {imageToDelete.fileSize}</p>
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
              onClick={handleDeleteImage}
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
                  Delete Image
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
