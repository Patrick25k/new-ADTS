import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  User,
  TrendingUp,
  Heart,
  Clock,
  Share2,
  FileText
} from "lucide-react"

export default function StoriesManagement() {
  const stories = [
    {
      id: 1,
      title: "From Poverty to Prosperity: Marie's Journey",
      excerpt: "A powerful story of transformation through our economic empowerment program...",
      author: "Marie Uwimana",
      authorAvatar: "MU",
      category: "Economic Empowerment",
      date: "2024-03-12",
      readTime: "4 min read",
      status: "Published",
      views: 2156,
      likes: 145,
      comments: 23,
      featured: true,
      image: "/story-1.jpg"
    },
    {
      id: 2,
      title: "Breaking the Cycle: A Family's Transformation",
      excerpt: "How one family overcame generational poverty with support and determination...",
      author: "Grace Mukamana",
      authorAvatar: "GM",
      category: "Family Support",
      date: "2024-03-08",
      readTime: "6 min read",
      status: "Published",
      views: 1834,
      likes: 98,
      comments: 15,
      featured: false,
      image: "/story-2.jpg"
    },
    {
      id: 3,
      title: "Teen Mother Finds Hope and Purpose",
      excerpt: "A young mother's journey from despair to becoming a community leader...",
      author: "Sarah Nzeyimana",
      authorAvatar: "SN",
      category: "Teen Mothers",
      date: "2024-03-01",
      readTime: "5 min read",
      status: "Published",
      views: 2890,
      likes: 234,
      comments: 45,
      featured: true,
      image: "/story-3.jpg"
    },
    {
      id: 4,
      title: "Education Changes Everything",
      excerpt: "From street child to university graduate - an inspiring educational journey...",
      author: "Jean Kubwimana",
      authorAvatar: "JK",
      category: "Education",
      date: "2024-02-25",
      readTime: "7 min read",
      status: "Draft",
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      image: "/story-4.jpg"
    },
  ]

  const stats = [
    { label: "Total Stories", value: "156", change: "+12", icon: Heart, color: "text-red-600", bgColor: "bg-red-50" },
    { label: "Published", value: "142", change: "+8", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Featured", value: "24", change: "+3", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Impact", value: "45K", change: "+15%", icon: User, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Success Stories"
        description="Manage inspiring stories and testimonials"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
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
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Stories</Button>
                <Button variant="outline" size="sm">Published</Button>
                <Button variant="outline" size="sm">Featured</Button>
                <Button variant="outline" size="sm">Drafts</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-red-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                  <Heart className="w-16 h-16 text-red-400" />
                </div>
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
                      <span>{new Date(story.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View
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
