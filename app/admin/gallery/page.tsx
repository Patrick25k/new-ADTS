import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Edit
} from "lucide-react"
import Image from "next/image"

export default function GalleryManagement() {
  const images = [
    { 
      id: 1, 
      title: "Children Education Program",
      url: "/rwanda-children-education.jpg", 
      date: "2024-03-15",
      category: "Education",
      views: 1234,
      downloads: 45,
      size: "2.4 MB",
      dimensions: "1920x1080",
      photographer: "ADTS Team",
      featured: true
    },
    { 
      id: 2, 
      title: "Women Empowerment Workshop",
      url: "/women-empowerment-rwanda.jpg", 
      date: "2024-03-14",
      category: "Empowerment",
      views: 987,
      downloads: 32,
      size: "1.8 MB",
      dimensions: "1600x900",
      photographer: "Marie Uwimana",
      featured: false
    },
    { 
      id: 3, 
      title: "Community Gathering",
      url: "/community-gathering-rwanda.jpg", 
      date: "2024-03-13",
      category: "Community",
      views: 1567,
      downloads: 78,
      size: "3.1 MB",
      dimensions: "2048x1152",
      photographer: "Jean Kubwimana",
      featured: true
    },
    { 
      id: 4, 
      title: "Vocational Training Session",
      url: "/vocational-training-rwanda.jpg", 
      date: "2024-03-12",
      category: "Training",
      views: 756,
      downloads: 23,
      size: "2.1 MB",
      dimensions: "1920x1080",
      photographer: "Grace Mukamana",
      featured: false
    },
    { 
      id: 5, 
      title: "Teen Mothers Support Group",
      url: "/teen-mothers-support-rwanda.jpg", 
      date: "2024-03-11",
      category: "Support",
      views: 1890,
      downloads: 67,
      size: "2.7 MB",
      dimensions: "1800x1200",
      photographer: "Sarah Nzeyimana",
      featured: true
    },
    { 
      id: 6, 
      title: "Family Counseling Session",
      url: "/family-counseling-rwanda.jpg", 
      date: "2024-03-10",
      category: "Counseling",
      views: 654,
      downloads: 19,
      size: "1.9 MB",
      dimensions: "1600x900",
      photographer: "ADTS Team",
      featured: false
    },
  ]

  const stats = [
    { label: "Total Images", value: "284", change: "+15", icon: ImageIcon, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "This Month", value: "23", change: "+8", icon: Upload, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Total Views", value: "12.4K", change: "+22%", icon: Eye, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Downloads", value: "1.2K", change: "+15%", icon: Download, color: "text-orange-600", bgColor: "bg-orange-50" },
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
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4" />
              Upload Images
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
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Images</Button>
                <Button variant="outline" size="sm">Featured</Button>
                <Button variant="outline" size="sm">Recent</Button>
                <Button variant="outline" size="sm">Popular</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="bg-white hover:shadow-lg transition-all duration-200 group overflow-hidden">
              <div className="relative">
                <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200">
                  <ImageIcon className="absolute inset-0 w-16 h-16 text-gray-400 m-auto" />
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
                <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 text-gray-700">
                  {image.size}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {image.category}
                    </Badge>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {image.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {image.dimensions} • {image.photographer}
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
                      <span>{new Date(image.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5 h-8 px-3">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-700 border-gray-200 hover:bg-gray-50 h-8 px-3">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
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
    </div>
  )
}
