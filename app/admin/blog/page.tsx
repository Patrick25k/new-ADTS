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
  MoreHorizontal,
  FileText,
  Clock,
  Share2
} from "lucide-react"

export default function BlogManagement() {
  const blogPosts = [
    {
      id: 1,
      title: "Celebrating 25 Years of Transformation",
      excerpt: "A journey through our impact and achievements in Rwanda's development landscape...",
      author: "Jean Kubwimana",
      authorAvatar: "JK",
      date: "2024-03-15",
      readTime: "5 min read",
      status: "Published",
      views: 1234,
      likes: 89,
      comments: 12,
      category: "Impact Stories",
      featured: true,
      image: "/blog-1.jpg"
    },
    {
      id: 2,
      title: "New Training Program Launches in Kigali",
      excerpt: "Empowering youth with digital skills and entrepreneurship training across Rwanda...",
      author: "Marie Uwimana",
      authorAvatar: "MU",
      date: "2024-03-10",
      readTime: "3 min read",
      status: "Published",
      views: 856,
      likes: 67,
      comments: 8,
      category: "Programs",
      featured: false,
      image: "/blog-2.jpg"
    },
    {
      id: 3,
      title: "Women's Empowerment Success Stories",
      excerpt: "Highlighting the incredible achievements of women in our community programs...",
      author: "Grace Mukamana",
      authorAvatar: "GM",
      date: "2024-03-05",
      readTime: "7 min read",
      status: "Draft",
      views: 0,
      likes: 0,
      comments: 0,
      category: "Success Stories",
      featured: false,
      image: "/blog-3.jpg"
    },
    {
      id: 4,
      title: "Community Health Initiative Results",
      excerpt: "Measuring the impact of our healthcare programs in rural communities...",
      author: "Dr. Paul Nzeyimana",
      authorAvatar: "PN",
      date: "2024-02-28",
      readTime: "6 min read",
      status: "Published",
      views: 2156,
      likes: 145,
      comments: 23,
      category: "Healthcare",
      featured: true,
      image: "/blog-4.jpg"
    },
  ]

  const stats = [
    { label: "Total Posts", value: "48", change: "+3", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Published", value: "42", change: "+2", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Drafts", value: "6", change: "+1", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "Total Views", value: "12.5K", change: "+8%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Blog Management"
        description="Create, edit, and manage your blog content"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
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
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Posts</Button>
                <Button variant="outline" size="sm">Published</Button>
                <Button variant="outline" size="sm">Drafts</Button>
                <Button variant="outline" size="sm">Featured</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-primary/60" />
                </div>
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
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {post.authorAvatar}
                      </div>
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime}</span>
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
                      <span>{new Date(post.date).toLocaleDateString()}</span>
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
