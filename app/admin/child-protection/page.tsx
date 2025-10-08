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
  Shield,
  Baby,
  Heart,
  MapPin,
  FileText,
  AlertTriangle
} from "lucide-react"

export default function ChildProtectionManagement() {
  const applications = [
    {
      id: 1,
      name: "Robert Kamanzi",
      email: "robert.kamanzi@gmail.com",
      phone: "+250 788 555 666",
      location: "Kigali, Rwanda",
      occupation: "Teacher",
      relationship: "Community Member",
      childName: "Jean Paul Uwimana",
      childAge: 8,
      childGender: "Male",
      childLocation: "Nyarugunga, Rwanda",
      childSchool: "Nyarugunga Primary School",
      familySituation: "Single mother struggling with school fees and healthcare costs",
      supportType: "Education & Healthcare",
      monthlyCommitment: "$50",
      duration: "2 years",
      reason: "I want to support Jean Paul's education and ensure he receives proper healthcare. His mother is working hard but needs assistance.",
      documents: ["ID Copy", "Reference Letter", "Income Statement"],
      date: "2024-03-15",
      status: "Pending Review",
      priority: "High",
      caseWorker: "Sarah Uwimana",
      backgroundCheck: "Pending",
      homeVisit: "Scheduled",
      references: 3
    },
    {
      id: 2,
      name: "Josephine Mukeshimana",
      email: "josephine.mukeshimana@yahoo.com",
      phone: "+250 788 666 777",
      location: "Gasabo, Rwanda",
      occupation: "Nurse",
      relationship: "Family Friend",
      childName: "Marie Grace Ingabire",
      childAge: 10,
      childGender: "Female",
      childLocation: "Kigali, Rwanda",
      childSchool: "Kigali International Primary",
      familySituation: "Father passed away, mother working multiple jobs to support family",
      supportType: "Mentorship & Education",
      monthlyCommitment: "$75",
      duration: "3 years",
      reason: "Marie Grace is a bright student who needs mentorship and educational support. I want to help her achieve her dreams.",
      documents: ["ID Copy", "Reference Letter", "Medical Certificate", "Police Clearance"],
      date: "2024-03-12",
      status: "Approved",
      priority: "Medium",
      caseWorker: "David Nkurunziza",
      backgroundCheck: "Completed",
      homeVisit: "Completed",
      references: 4
    },
    {
      id: 3,
      name: "Samuel Nshimiyimana",
      email: "samuel.nshimiyimana@outlook.com",
      phone: "+250 788 777 888",
      location: "Nyarugunga, Rwanda",
      occupation: "Engineer",
      relationship: "Neighbor",
      childName: "Emmanuel Habimana",
      childAge: 7,
      childGender: "Male",
      childLocation: "Nyarugunga, Rwanda",
      childSchool: "Hope Primary School",
      familySituation: "Both parents unemployed, struggling to provide basic needs",
      supportType: "Basic Needs & Education",
      monthlyCommitment: "$60",
      duration: "1 year",
      reason: "Emmanuel's family is going through difficult times. I want to help ensure he continues his education and has basic needs met.",
      documents: ["ID Copy", "Reference Letter"],
      date: "2024-03-10",
      status: "Under Review",
      priority: "High",
      caseWorker: "Grace Uwase",
      backgroundCheck: "In Progress",
      homeVisit: "Pending",
      references: 2
    },
    {
      id: 4,
      name: "Alice Nyirahabimana",
      email: "alice.nyirahabimana@gmail.com",
      phone: "+250 788 888 999",
      location: "Kicukiro, Rwanda",
      occupation: "Business Owner",
      relationship: "Community Member",
      childName: "Divine Mukamana",
      childAge: 9,
      childGender: "Female",
      childLocation: "Kicukiro, Rwanda",
      childSchool: "St. Mary's Primary School",
      familySituation: "Mother is disabled, unable to work consistently",
      supportType: "Healthcare & Education",
      monthlyCommitment: "$80",
      duration: "2 years",
      reason: "Divine is a talented child who deserves every opportunity to succeed. Her mother's disability makes it challenging to provide consistent support.",
      documents: ["ID Copy", "Reference Letter", "Business License", "Bank Statement"],
      date: "2024-03-08",
      status: "Rejected",
      priority: "Medium",
      caseWorker: "Jean Baptiste",
      backgroundCheck: "Completed",
      homeVisit: "Completed",
      references: 2
    },
  ]

  const stats = [
    { label: "Active Cases", value: "24", change: "+3", icon: Shield, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Pending Reviews", value: "8", change: "+2", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { label: "Children Protected", value: "156", change: "+12", icon: Baby, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Monthly Support", value: "$4,200", change: "+$320", icon: Heart, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader 
        title="Child Protection Program" 
        description="Review and manage protect-a-child applications"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Shield className="w-4 h-4" />
              New Application
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
                  placeholder="Search applications..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="outline" size="sm">Pending</Button>
                <Button variant="outline" size="sm">Approved</Button>
                <Button variant="outline" size="sm">High Priority</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-24 bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  <Baby className="w-12 h-12 text-pink-500" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    app.status === 'Pending Review' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                      : app.status === 'Approved'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : app.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {app.status}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`absolute top-3 left-3 text-xs ${
                    app.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50' :
                    'border-orange-200 text-orange-700 bg-orange-50'
                  }`}
                >
                  {app.priority} Priority
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {app.relationship}
                      </Badge>
                      <span className="text-xs text-gray-500">Case: {app.caseWorker}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {app.occupation} • {app.location}
                    </p>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Baby className="w-4 h-4 text-pink-600" />
                      <span className="font-medium text-pink-800">Child Information</span>
                    </div>
                    <p className="font-medium text-gray-900">{app.childName}</p>
                    <p className="text-sm text-gray-600">{app.childAge} years old • {app.childGender}</p>
                    <p className="text-sm text-gray-600">{app.childSchool}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{app.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span>{app.monthlyCommitment}/month for {app.duration}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Family Situation:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {app.familySituation}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Support Motivation:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {app.reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Support Type:</p>
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      {app.supportType}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{app.documents.length} docs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{app.references} refs</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">Applied {new Date(app.date).toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Verification Status:</p>
                    <div className="flex gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          app.backgroundCheck === 'Completed' ? 'bg-green-50 text-green-700' :
                          app.backgroundCheck === 'In Progress' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-50 text-gray-700'
                        }`}
                      >
                        Background: {app.backgroundCheck}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          app.homeVisit === 'Completed' ? 'bg-green-50 text-green-700' :
                          app.homeVisit === 'Scheduled' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-50 text-gray-700'
                        }`}
                      >
                        Visit: {app.homeVisit}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                      {app.status === 'Pending Review' && (
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
