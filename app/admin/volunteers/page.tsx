import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Calendar,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Clock,
  Share2,
  Heart,
  Star,
  MapPin,
  Award
} from "lucide-react"

export default function VolunteersManagement() {
  const volunteers = [
    {
      id: 1,
      name: "Alice Mukamana",
      email: "alice.mukamana@gmail.com",
      phone: "+250 788 111 222",
      location: "Kigali, Rwanda",
      age: 28,
      profession: "Teacher",
      experience: "3 years",
      skills: ["Teaching", "Community Outreach", "Event Planning", "Public Speaking"],
      availability: "Weekends",
      preferredPrograms: ["Education", "Youth Development"],
      languages: ["English", "Kinyarwanda", "French"],
      motivation: "I want to contribute to community development and help children access quality education.",
      date: "2024-03-15",
      status: "Pending",
      rating: 4.8,
      hoursCommitted: 20,
      references: 2,
      background: "Verified"
    },
    {
      id: 2,
      name: "David Niyonzima",
      email: "david.niyonzima@yahoo.com",
      phone: "+250 788 222 333",
      location: "Nyarugunga, Rwanda",
      age: 35,
      profession: "Nurse",
      experience: "8 years",
      skills: ["Healthcare", "Counseling", "First Aid", "Mental Health Support"],
      availability: "Flexible",
      preferredPrograms: ["Health", "Child Protection"],
      languages: ["English", "Kinyarwanda"],
      motivation: "Healthcare is my passion and I believe everyone deserves access to quality medical care.",
      date: "2024-03-12",
      status: "Approved",
      rating: 4.9,
      hoursCommitted: 30,
      references: 3,
      background: "Verified"
    },
    {
      id: 3,
      name: "Grace Uwase",
      email: "grace.uwase@outlook.com",
      phone: "+250 788 333 444",
      location: "Kigali, Rwanda",
      age: 24,
      profession: "Administrative Assistant",
      experience: "2 years",
      skills: ["Administration", "Data Entry", "Microsoft Office", "Communication"],
      availability: "Weekdays",
      preferredPrograms: ["Administration", "Data Management"],
      languages: ["English", "Kinyarwanda"],
      motivation: "I want to use my administrative skills to support meaningful community programs.",
      date: "2024-03-10",
      status: "Approved",
      rating: 4.7,
      hoursCommitted: 25,
      references: 2,
      background: "Pending"
    },
    {
      id: 4,
      name: "Jean Baptiste Habimana",
      email: "jb.habimana@gmail.com",
      phone: "+250 788 444 555",
      location: "Gasabo, Rwanda",
      age: 42,
      profession: "Engineer",
      experience: "15 years",
      skills: ["Project Management", "Technical Training", "Leadership", "Problem Solving"],
      availability: "Evenings & Weekends",
      preferredPrograms: ["Infrastructure", "Technical Training"],
      languages: ["English", "Kinyarwanda", "French"],
      motivation: "I want to share my technical expertise to help build sustainable community infrastructure.",
      date: "2024-03-08",
      status: "Rejected",
      rating: 4.5,
      hoursCommitted: 15,
      references: 4,
      background: "Verified"
    },
  ]

  const stats = [
    { label: "Total Volunteers", value: "45", change: "+8", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Pending Applications", value: "12", change: "+3", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "Active Volunteers", value: "28", change: "+5", icon: Heart, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Total Hours", value: "1,240", change: "+180", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader 
        title="Volunteer Management" 
        description="Review and manage volunteer applications"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Users className="w-4 h-4" />
              Invite Volunteers
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
                  placeholder="Search volunteers..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="outline" size="sm">Pending</Button>
                <Button variant="outline" size="sm">Approved</Button>
                <Button variant="outline" size="sm">Active</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {volunteers.map((volunteer) => (
            <Card key={volunteer.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                  <Heart className="w-12 h-12 text-green-500" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    volunteer.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                      : volunteer.status === 'Approved'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {volunteer.status}
                </Badge>
                <div className="absolute top-3 left-3 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{volunteer.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {volunteer.profession}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          volunteer.background === 'Verified' ? 'border-green-200 text-green-700 bg-green-50' :
                          'border-orange-200 text-orange-700 bg-orange-50'
                        }`}
                      >
                        {volunteer.background}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {volunteer.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {volunteer.experience} experience • Age {volunteer.age}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{volunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{volunteer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{volunteer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Available: {volunteer.availability}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Motivation:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {volunteer.motivation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          +{volunteer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Preferred Programs:</p>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.preferredPrograms.map((program, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{volunteer.hoursCommitted}h/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{volunteer.references} refs</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">Applied {new Date(volunteer.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {volunteer.status === 'Pending' && (
                        <>
                          <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-50">
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-700 border-red-200 hover:bg-red-50">
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
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
