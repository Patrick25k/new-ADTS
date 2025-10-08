import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Trash2, 
  Mail, 
  Search, 
  Filter, 
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
  Clock,
  Share2,
  Reply,
  User,
  AlertCircle
} from "lucide-react"

export default function ContactsManagement() {
  const contacts = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+250 788 123 456",
      subject: "Partnership Inquiry",
      message: "I would like to discuss potential partnership opportunities with ADTS Rwanda. Our organization focuses on community development and we believe there could be great synergy between our missions. Could we schedule a meeting to explore this further?",
      fullMessage: "Dear ADTS Team, I hope this message finds you well. I represent a community development organization based in Kigali, and I've been following your excellent work in the region. I would like to discuss potential partnership opportunities with ADTS Rwanda. Our organization focuses on community development and we believe there could be great synergy between our missions. Could we schedule a meeting to explore this further? Best regards, John Doe",
      date: "2024-03-15",
      time: "14:30",
      status: "Unread",
      priority: "High",
      category: "Partnership",
      location: "Kigali, Rwanda",
      organization: "Community Dev Partners",
      responseTime: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+250 788 234 567",
      subject: "Volunteer Application",
      message: "I am interested in volunteering with your organization. I have experience in education and community outreach. I would love to contribute to your programs and make a positive impact in the community.",
      fullMessage: "Hello ADTS Team, My name is Sarah Smith and I am writing to express my interest in volunteering with your organization. I have a background in education with 5 years of experience working with children and youth. I am particularly interested in your education and community outreach programs. I would love to contribute my skills and time to make a positive impact in the community. Please let me know about available volunteer opportunities and the application process. Thank you for your time and consideration. Sincerely, Sarah Smith",
      date: "2024-03-14",
      time: "09:15",
      status: "Read",
      priority: "Medium",
      category: "Volunteer",
      location: "Nyarugunga, Rwanda",
      organization: "Individual",
      responseTime: "1 day ago"
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+250 788 345 678",
      subject: "Donation Information",
      message: "Could you provide more information about donation options and how funds are utilized? I'm interested in supporting your education programs specifically.",
      fullMessage: "Dear ADTS Rwanda, I hope you are doing well. I have been learning about your organization and the wonderful work you do in the community. Could you provide more information about donation options and how funds are utilized? I'm particularly interested in supporting your education programs and would like to understand how my contribution would make a difference. I would also appreciate information about tax receipts and regular updates on program progress. Thank you for your dedication to the community. Best wishes, Michael Johnson",
      date: "2024-03-13",
      time: "16:45",
      status: "Replied",
      priority: "Medium",
      category: "Donation",
      location: "Kigali, Rwanda",
      organization: "Johnson Foundation",
      responseTime: "2 days ago"
    },
    {
      id: 4,
      name: "Grace Uwimana",
      email: "grace.uwimana@gmail.com",
      phone: "+250 788 456 789",
      subject: "Program Inquiry",
      message: "Hello, I would like to know more about your child protection programs and how my children can benefit from them.",
      fullMessage: "Dear ADTS Team, Greetings! My name is Grace Uwimana and I am a mother of three children aged 8, 12, and 15. I have heard wonderful things about your child protection and education programs. I would like to know more about these programs and how my children can benefit from them. We live in Nyarugunga and I believe your programs could provide valuable support for my family. Could someone please contact me to discuss enrollment procedures and program schedules? Thank you very much for your time. Warm regards, Grace Uwimana",
      date: "2024-03-12",
      time: "11:20",
      status: "Unread",
      priority: "High",
      category: "Program",
      location: "Nyarugunga, Rwanda",
      organization: "Individual",
      responseTime: "3 days ago"
    },
  ]

  const stats = [
    { label: "Total Messages", value: "156", change: "+12", icon: MessageSquare, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Unread", value: "23", change: "+5", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50" },
    { label: "Replied", value: "98", change: "+8", icon: Reply, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Avg Response", value: "2.4h", change: "-0.3h", icon: Clock, color: "text-purple-600", bgColor: "bg-purple-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader 
        title="Contact Management" 
        description="Manage contact form submissions and inquiries"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Mail className="w-4 h-4" />
              Compose
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
                    <p className="text-sm text-green-600 mt-1">{stat.change} this week</p>
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
                  placeholder="Search contacts..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">All</Button>
                <Button variant="outline" size="sm">Unread</Button>
                <Button variant="outline" size="sm">High Priority</Button>
                <Button variant="outline" size="sm">Today</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="bg-white hover:shadow-lg transition-all duration-200 group">
              <div className="relative">
                <div className="h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-lg flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-blue-500" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${
                    contact.status === 'Unread' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : contact.status === 'Read'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  {contact.status}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`absolute top-3 left-3 text-xs ${
                    contact.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50' :
                    'border-orange-200 text-orange-700 bg-orange-50'
                  }`}
                >
                  {contact.priority} Priority
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {contact.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{contact.responseTime}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                      {contact.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {contact.subject}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(contact.date).toLocaleDateString()} at {contact.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{contact.organization}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {contact.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        Read
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
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
