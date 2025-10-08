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
  Search, 
  Filter, 
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Share2,
  Eye,
  AlertCircle
} from "lucide-react"

export default function TendersManagement() {
  const tenders = [
    {
      id: 1,
      title: "Construction of Community Center - Kigali",
      description: "Construction and setup of a new community center facility in Kigali district to serve local community programs.",
      reference: "ADTS/TND/2024/001",
      category: "Construction",
      publishDate: "2024-03-01",
      deadline: "2024-04-15",
      budget: "$50,000 - $75,000",
      budgetMin: 50000,
      budgetMax: 75000,
      status: "Open",
      submissions: 12,
      views: 245,
      daysLeft: 15,
      priority: "High",
      featured: true,
      requirements: ["Licensed Construction Company", "5+ Years Experience", "Local Registration"]
    },
    {
      id: 2,
      title: "Supply of Training Materials",
      description: "Procurement of educational and training materials for various community development programs.",
      reference: "ADTS/TND/2024/002",
      category: "Supplies",
      publishDate: "2024-03-05",
      deadline: "2024-04-20",
      budget: "$10,000 - $15,000",
      budgetMin: 10000,
      budgetMax: 15000,
      status: "Open",
      submissions: 8,
      views: 156,
      daysLeft: 20,
      priority: "Medium",
      featured: false,
      requirements: ["Educational Material Supplier", "Quality Certification", "Delivery Capability"]
    },
    {
      id: 3,
      title: "IT Equipment and Software",
      description: "Purchase of computers, software licenses, and IT infrastructure for digital literacy programs.",
      reference: "ADTS/TND/2024/003",
      category: "Technology",
      publishDate: "2024-02-15",
      deadline: "2024-03-10",
      budget: "$20,000 - $30,000",
      budgetMin: 20000,
      budgetMax: 30000,
      status: "Closed",
      submissions: 15,
      views: 389,
      daysLeft: 0,
      priority: "High",
      featured: true,
      requirements: ["IT Equipment Vendor", "Warranty Support", "Technical Training"]
    },
    {
      id: 4,
      title: "Catering Services for Training Programs",
      description: "Provision of catering services for various training sessions and community workshops throughout the year.",
      reference: "ADTS/TND/2024/004",
      category: "Services",
      publishDate: "2024-03-10",
      deadline: "2024-05-01",
      budget: "$5,000 - $8,000",
      budgetMin: 5000,
      budgetMax: 8000,
      status: "Open",
      submissions: 6,
      views: 98,
      daysLeft: 35,
      priority: "Low",
      featured: false,
      requirements: ["Licensed Catering Service", "Health Certification", "Flexible Scheduling"]
    },
  ]

  const stats = [
    { label: "Active Tenders", value: "8", change: "+2", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Submissions", value: "41", change: "+12", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Budget Allocated", value: "$180K", change: "+15%", icon: DollarSign, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Closing Soon", value: "3", change: "0", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Tender Management"
        description="Manage procurement opportunities and submissions"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              New Tender
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
                  placeholder="Search tenders..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Tenders</Button>
                <Button variant="outline" size="sm">Open</Button>
                <Button variant="outline" size="sm">Closing Soon</Button>
                <Button variant="outline" size="sm">Featured</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tenders.map((tender) => (
            <Card key={tender.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-green-500" />
                </div>
                {tender.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    tender.status === 'Open' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {tender.status}
                </Badge>
                {tender.daysLeft > 0 && tender.daysLeft <= 7 && (
                  <Badge className="absolute bottom-3 left-3 bg-red-100 text-red-800 border border-red-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {tender.daysLeft} days left
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {tender.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          tender.priority === 'High' ? 'border-red-200 text-red-700' :
                          tender.priority === 'Medium' ? 'border-orange-200 text-orange-700' :
                          'border-gray-200 text-gray-700'
                        }`}
                      >
                        {tender.priority} Priority
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {tender.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {tender.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-mono text-gray-900">{tender.reference}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold text-gray-900">{tender.budget}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="text-gray-900">{new Date(tender.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{tender.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{tender.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Published {new Date(tender.publishDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {tender.requirements.slice(0, 2).map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {req}
                        </Badge>
                      ))}
                      {tender.requirements.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{tender.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-700 border-gray-200 hover:bg-gray-50">
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
