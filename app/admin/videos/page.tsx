import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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

export default function VideosManagement() {
  const videos = [
    {
      id: 1,
      title: "ADTS Rwanda 2024 Impact Report",
      description: "Comprehensive overview of our achievements and impact in 2024...",
      duration: "5:32",
      date: "2024-03-10",
      views: 2341,
      likes: 156,
      comments: 23,
      status: "Published",
      category: "Annual Reports",
      author: "ADTS Communications",
      authorAvatar: "AC",
      featured: true,
      thumbnail: "/video-1.jpg"
    },
    {
      id: 2,
      title: "Women's Empowerment Training Session",
      description: "Highlights from our women's empowerment program training sessions...",
      duration: "8:15",
      date: "2024-03-05",
      views: 1876,
      likes: 98,
      comments: 15,
      status: "Published",
      category: "Training",
      author: "Marie Uwimana",
      authorAvatar: "MU",
      featured: false,
      thumbnail: "/video-2.jpg"
    },
    {
      id: 3,
      title: "Community Transformation Stories",
      description: "Real stories from community members about positive changes...",
      duration: "6:45",
      date: "2024-02-28",
      views: 3421,
      likes: 234,
      comments: 45,
      status: "Published",
      category: "Success Stories",
      author: "Jean Kubwimana",
      authorAvatar: "JK",
      featured: true,
      thumbnail: "/video-3.jpg"
    },
    {
      id: 4,
      title: "Youth Leadership Development Program",
      description: "Behind the scenes of our youth leadership training initiatives...",
      duration: "7:22",
      date: "2024-02-20",
      views: 0,
      likes: 0,
      comments: 0,
      status: "Draft",
      category: "Youth Programs",
      author: "Grace Mukamana",
      authorAvatar: "GM",
      featured: false,
      thumbnail: "/video-4.jpg"
    },
  ]

  const stats = [
    { label: "Total Videos", value: "32", change: "+4", icon: Video, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Published", value: "28", change: "+3", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Total Views", value: "45.2K", change: "+18%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Watch Time", value: "2.8K hrs", change: "+25%", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

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
            <Button className="gap-2 bg-primary hover:bg-primary/90">
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
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Videos</Button>
                <Button variant="outline" size="sm">Published</Button>
                <Button variant="outline" size="sm">Featured</Button>
                <Button variant="outline" size="sm">Drafts</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
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
                      <span>{new Date(video.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-700 border-gray-200 hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
    </div>
  )
}
