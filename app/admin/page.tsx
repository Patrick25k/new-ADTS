import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  Heart, 
  Mail, 
  TrendingUp, 
  Video, 
  ImageIcon, 
  Briefcase, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Calendar,
  Globe,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Clock
} from "lucide-react"
// Temporarily removing recharts to fix the error
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts"

export default function AdminDashboard() {
  // Enhanced stats with trends
  const stats = [
    {
      title: "Website Visitors",
      value: "24,847",
      change: "+12.5%",
      changeValue: "+2,743",
      period: "vs last month",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: "up"
    },
    {
      title: "Contact Messages",
      value: "156",
      change: "+8.2%",
      changeValue: "+12",
      period: "this month",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      trend: "up"
    },
    {
      title: "Success Stories",
      value: "89",
      change: "+15.3%",
      changeValue: "+12",
      period: "this quarter",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      trend: "up"
    },
    {
      title: "Active Programs",
      value: "12",
      change: "+2",
      changeValue: "new programs",
      period: "this year",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      trend: "up"
    }
  ]

  // Chart data
  const visitorData = [
    { month: 'Jan', visitors: 18500, engagement: 65 },
    { month: 'Feb', visitors: 19200, engagement: 68 },
    { month: 'Mar', visitors: 21800, engagement: 72 },
    { month: 'Apr', visitors: 20400, engagement: 69 },
    { month: 'May', visitors: 22900, engagement: 75 },
    { month: 'Jun', visitors: 24847, engagement: 78 }
  ]

  const contentData = [
    { name: 'Blog Posts', value: 48, color: '#3B82F6' },
    { name: 'Stories', value: 89, color: '#EF4444' },
    { name: 'Videos', value: 32, color: '#F59E0B' },
    { name: 'Gallery', value: 284, color: '#10B981' }
  ]

  const programsData = [
    { program: 'Education', participants: 1250, budget: 85000 },
    { program: 'Healthcare', participants: 890, budget: 65000 },
    { program: 'Community Dev', participants: 2100, budget: 120000 },
    { program: 'Youth Programs', participants: 650, budget: 45000 },
    { program: 'Women Empowerment', participants: 980, budget: 75000 }
  ]

  const recentActivity = [
    {
      action: "New contact message",
      user: "John Doe",
      time: "5 minutes ago",
      type: "message",
    },
    {
      action: "New volunteer application",
      user: "Sarah Smith",
      time: "1 hour ago",
      type: "volunteer",
    },
    {
      action: "Blog post published",
      user: "Admin",
      time: "2 hours ago",
      type: "blog",
    },
    {
      action: "New prayer request",
      user: "Mary Johnson",
      time: "3 hours ago",
      type: "prayer",
    },
    {
      action: "Gallery images uploaded",
      user: "Admin",
      time: "5 hours ago",
      type: "gallery",
    },
  ]

  const upcomingTasks = [
    { task: "Review pending volunteer applications", priority: "high", due: "Today" },
    { task: "Respond to contact messages", priority: "high", due: "Today" },
    { task: "Update job posting deadline", priority: "medium", due: "Tomorrow" },
    { task: "Publish monthly report", priority: "medium", due: "In 3 days" },
    { task: "Review and approve blog drafts", priority: "low", due: "This week" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader title="Dashboard Overview" description="Welcome back! Here's your ADTS Rwanda impact summary." />

      <div className="p-6 space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all duration-200 bg-white`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className={`inline-flex p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.changeValue}</p>
                    <p className="text-xs text-gray-400">{stat.period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Website Analytics - Full Width on Mobile, 2 cols on Desktop */}
          <Card className="lg:col-span-2 bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Website Analytics</CardTitle>
                  <p className="text-gray-600 mt-1">Monthly performance overview</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Growing
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">24.8K</div>
                  <div className="text-sm text-gray-600">Total Visitors</div>
                  <div className="text-xs text-green-600 mt-1">+12.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">78%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                  <div className="text-xs text-green-600 mt-1">+5.2%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
                  <div className="text-sm text-gray-600">New Contacts</div>
                  <div className="text-xs text-blue-600 mt-1">+8 today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">4.2m</div>
                  <div className="text-sm text-gray-600">Page Views</div>
                  <div className="text-xs text-green-600 mt-1">+18%</div>
                </div>
              </div>
              
              {/* Simple Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Monthly Growth</span>
                    <span className="text-gray-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">User Engagement</span>
                    <span className="text-gray-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Content Performance</span>
                    <span className="text-gray-600">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'message' ? 'bg-blue-100' :
                      activity.type === 'volunteer' ? 'bg-green-100' :
                      activity.type === 'blog' ? 'bg-purple-100' :
                      activity.type === 'prayer' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'volunteer' && <Users className="w-4 h-4 text-green-600" />}
                      {activity.type === 'blog' && <FileText className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'prayer' && <Heart className="w-4 h-4 text-orange-600" />}
                      {activity.type === 'gallery' && <ImageIcon className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-sm">
                View All Activity
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Overview and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Overview */}
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Content Overview</CardTitle>
              <p className="text-gray-600 mt-1">Published content across platforms</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Blog Posts</div>
                      <div className="text-sm text-gray-600">Published articles</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">48</div>
                    <div className="text-xs text-green-600">+3 this month</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Success Stories</div>
                      <div className="text-sm text-gray-600">Impact testimonials</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">89</div>
                    <div className="text-xs text-green-600">+12 this month</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Videos</div>
                      <div className="text-sm text-gray-600">Media content</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">32</div>
                    <div className="text-xs text-blue-600">+2 this month</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Gallery</div>
                      <div className="text-sm text-gray-600">Photo collection</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">284</div>
                    <div className="text-xs text-green-600">+15 this month</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-16 bg-primary hover:bg-primary/90 text-white flex flex-col items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">New Blog Post</span>
                </Button>
                <Button variant="outline" className="h-16 border-2 hover:bg-gray-50 flex flex-col items-center gap-2">
                  <Heart className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Add Story</span>
                </Button>
                <Button variant="outline" className="h-16 border-2 hover:bg-gray-50 flex flex-col items-center gap-2">
                  <Video className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Upload Video</span>
                </Button>
                <Button variant="outline" className="h-16 border-2 hover:bg-gray-50 flex flex-col items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Manage Gallery</span>
                </Button>
                <Button variant="outline" className="h-16 border-2 hover:bg-gray-50 flex flex-col items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">Team Settings</span>
                </Button>
                <Button variant="outline" className="h-16 border-2 hover:bg-gray-50 flex flex-col items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium">View Messages</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
