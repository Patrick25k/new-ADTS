import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Share2,
  BarChart3,
  PieChart,
  Users,
  DollarSign
} from "lucide-react"

export default function ReportsManagement() {
  const reports = [
    {
      id: 1,
      title: "Annual Report 2024",
      description: "Comprehensive overview of ADTS Rwanda's achievements, programs, and impact throughout 2024.",
      type: "Annual Report",
      category: "Organizational",
      date: "2024-03-01",
      publishDate: "March 1, 2024",
      size: "2.5 MB",
      pages: 48,
      downloads: 234,
      views: 1250,
      status: "Published",
      priority: "High",
      author: "ADTS Leadership Team",
      language: "English",
      format: "PDF",
      tags: ["Annual", "Impact", "Programs", "2024"],
      featured: true,
      downloadTrend: "+15%"
    },
    {
      id: 2,
      title: "Q1 2024 Impact Report",
      description: "Quarterly assessment of program outcomes and community impact for the first quarter of 2024.",
      type: "Quarterly Report",
      category: "Impact Assessment",
      date: "2024-02-15",
      publishDate: "February 15, 2024",
      size: "1.8 MB",
      pages: 24,
      downloads: 156,
      views: 890,
      status: "Published",
      priority: "Medium",
      author: "Programs Department",
      language: "English",
      format: "PDF",
      tags: ["Quarterly", "Impact", "Q1", "Assessment"],
      featured: false,
      downloadTrend: "+8%"
    },
    {
      id: 3,
      title: "Women Empowerment Program Evaluation",
      description: "Detailed evaluation of the women empowerment program effectiveness and beneficiary outcomes.",
      type: "Program Report",
      category: "Program Evaluation",
      date: "2024-02-01",
      publishDate: "February 1, 2024",
      size: "3.2 MB",
      pages: 36,
      downloads: 89,
      views: 456,
      status: "Published",
      priority: "High",
      author: "Gender & Development Team",
      language: "English",
      format: "PDF",
      tags: ["Women", "Empowerment", "Evaluation", "Gender"],
      featured: true,
      downloadTrend: "+12%"
    },
    {
      id: 4,
      title: "Financial Statement 2023",
      description: "Audited financial statements and transparency report for the fiscal year 2023.",
      type: "Financial Report",
      category: "Financial",
      date: "2024-01-15",
      publishDate: "January 15, 2024",
      size: "1.2 MB",
      pages: 16,
      downloads: 312,
      views: 1890,
      status: "Published",
      priority: "High",
      author: "Finance Department",
      language: "English",
      format: "PDF",
      tags: ["Financial", "Audit", "2023", "Transparency"],
      featured: false,
      downloadTrend: "+22%"
    },
    {
      id: 5,
      title: "Child Protection Program Report",
      description: "Comprehensive report on child protection initiatives and safeguarding measures implemented.",
      type: "Program Report",
      category: "Child Protection",
      date: "2024-01-01",
      publishDate: "January 1, 2024",
      size: "2.8 MB",
      pages: 32,
      downloads: 145,
      views: 678,
      status: "Draft",
      priority: "Medium",
      author: "Child Protection Team",
      language: "English",
      format: "PDF",
      tags: ["Children", "Protection", "Safeguarding", "Programs"],
      featured: false,
      downloadTrend: "+5%"
    },
  ]

  const stats = [
    { label: "Total Reports", value: "24", change: "+3", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Downloads", value: "2.1K", change: "+156", icon: Download, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Published", value: "18", change: "+2", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Avg Views", value: "892", change: "+67", icon: Eye, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Reports Management"
        description="Manage organizational reports and publications"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Upload Report
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
                  placeholder="Search reports..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Reports</Button>
                <Button variant="outline" size="sm">Published</Button>
                <Button variant="outline" size="sm">Featured</Button>
                <Button variant="outline" size="sm">Recent</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-indigo-500" />
                </div>
                {report.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    report.status === 'Published' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}
                >
                  {report.status}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`absolute bottom-3 left-3 text-xs ${
                    report.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50' :
                    'border-orange-200 text-orange-700 bg-orange-50'
                  }`}
                >
                  {report.priority} Priority
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {report.category}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">{report.downloadTrend}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Published: {report.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>By: {report.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{report.pages} pages • {report.size}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {report.format}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{report.downloads} downloads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{report.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                      {report.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{report.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                      </Button>
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
