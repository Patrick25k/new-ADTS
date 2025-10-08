import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  Share2,
  Eye,
  DollarSign,
  Building
} from "lucide-react"

export default function JobsManagement() {
  const jobs = [
    {
      id: 1,
      title: "Program Coordinator",
      description: "Lead and coordinate community development programs, ensuring effective implementation and impact measurement.",
      department: "Programs",
      location: "Kigali, Rwanda",
      type: "Full-time",
      experience: "3-5 years",
      education: "Bachelor's Degree",
      salary: "$800 - $1,200",
      postDate: "2024-03-01",
      deadline: "2024-04-10",
      applicants: 45,
      views: 234,
      status: "Open",
      priority: "High",
      featured: true,
      requirements: ["Project Management", "Community Development", "Report Writing"],
      benefits: ["Health Insurance", "Professional Development", "Flexible Hours"],
      daysLeft: 12
    },
    {
      id: 2,
      title: "Finance Officer",
      description: "Manage financial operations, budgeting, and ensure compliance with donor requirements and local regulations.",
      department: "Finance",
      location: "Kigali, Rwanda",
      type: "Full-time",
      experience: "2-4 years",
      education: "Bachelor's in Finance/Accounting",
      salary: "$700 - $1,000",
      postDate: "2024-03-05",
      deadline: "2024-04-15",
      applicants: 32,
      views: 189,
      status: "Open",
      priority: "High",
      featured: false,
      requirements: ["Financial Management", "Excel Proficiency", "Audit Experience"],
      benefits: ["Health Insurance", "Training Opportunities", "Performance Bonus"],
      daysLeft: 17
    },
    {
      id: 3,
      title: "Community Mobilizer",
      description: "Engage with local communities to promote awareness and participation in ADTS programs and initiatives.",
      department: "Field Operations",
      location: "Nyarugunga, Rwanda",
      type: "Contract",
      experience: "1-3 years",
      education: "Diploma/Bachelor's Degree",
      salary: "$400 - $600",
      postDate: "2024-02-15",
      deadline: "2024-03-20",
      applicants: 67,
      views: 345,
      status: "Closed",
      priority: "Medium",
      featured: true,
      requirements: ["Community Engagement", "Local Language", "Communication Skills"],
      benefits: ["Transport Allowance", "Training", "Certificate"],
      daysLeft: 0
    },
    {
      id: 4,
      title: "IT Support Specialist",
      description: "Provide technical support for IT infrastructure, maintain systems, and support digital literacy programs.",
      department: "Technology",
      location: "Kigali, Rwanda",
      type: "Part-time",
      experience: "2-3 years",
      education: "Diploma in IT/Computer Science",
      salary: "$500 - $700",
      postDate: "2024-03-10",
      deadline: "2024-05-01",
      applicants: 23,
      views: 156,
      status: "Open",
      priority: "Medium",
      featured: false,
      requirements: ["Network Administration", "Hardware Troubleshooting", "Training Skills"],
      benefits: ["Flexible Schedule", "Skill Development", "Equipment Access"],
      daysLeft: 35
    },
  ]

  const stats = [
    { label: "Active Jobs", value: "6", change: "+2", icon: Briefcase, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Total Applicants", value: "167", change: "+23", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Positions Filled", value: "8", change: "+3", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Closing Soon", value: "2", change: "0", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Job Management"
        description="Manage career opportunities and recruitment"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Post Job
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
                  placeholder="Search jobs..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All Jobs</Button>
                <Button variant="outline" size="sm">Open</Button>
                <Button variant="outline" size="sm">Featured</Button>
                <Button variant="outline" size="sm">Urgent</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <Briefcase className="w-16 h-16 text-purple-500" />
                </div>
                {job.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    job.status === 'Open' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {job.status}
                </Badge>
                {job.daysLeft > 0 && job.daysLeft <= 7 && (
                  <Badge className="absolute bottom-3 left-3 bg-red-100 text-red-800 border border-red-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {job.daysLeft} days left
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {job.department}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          job.priority === 'High' ? 'border-red-200 text-red-700' :
                          job.priority === 'Medium' ? 'border-orange-200 text-orange-700' :
                          'border-gray-200 text-gray-700'
                        }`}
                      >
                        {job.priority} Priority
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{job.location}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {job.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{job.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 2).map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{job.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {benefit}
                        </Badge>
                      ))}
                      {job.benefits.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          +{job.benefits.length - 2} more
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
                        <Users className="w-4 h-4 mr-1" />
                        Applicants
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
