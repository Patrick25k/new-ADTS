"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  Heart, 
  Mail, 
  Video, 
  ImageIcon, 
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Calendar,
  Activity,
  Clock,
  Briefcase,
  TrendingUp
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  contacts: {
    total: number
    unread: number
    thisMonth: number
    lastMonth: number
  }
  stories: {
    total: number
    published: number
    thisMonth: number
    thisQuarter: number
  }
  blogs: {
    total: number
    published: number
    thisMonth: number
  }
  videos: {
    total: number
    thisMonth: number
  }
  gallery: {
    total: number
    thisMonth: number
  }
  newsletter: {
    total: number
    active: number
    thisMonth: number
  }
  volunteers: {
    total: number
    pending: number
    thisMonth: number
  }
  jobs: {
    total: number
    active: number
    thisMonth: number
  }
  tenders: {
    total: number
    active: number
    thisMonth: number
  }
}

interface ActivityItem {
  id: string
  action: string
  user: string
  email?: string
  details?: string
  time: string
  type: 'contact' | 'story' | 'blog' | 'video' | 'gallery' | 'newsletter' | 'volunteer' | 'job' | 'tender'
  priority: 'high' | 'medium' | 'low'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setError(null)
      
      // Load stats first
      setIsStatsLoading(true)
      const statsResponse = await fetch('/api/admin/dashboard')
      
      if (!statsResponse.ok) {
        throw new Error(`Stats API Error: ${statsResponse.status} ${statsResponse.statusText}`)
      }
      
      const statsData = await statsResponse.json()
      setStats(statsData.stats)
      setIsStatsLoading(false)
      
      // Then load activities separately
      setIsActivitiesLoading(true)
      const activityResponse = await fetch('/api/admin/activity?limit=4')
      
      if (!activityResponse.ok) {
        throw new Error(`Activity API Error: ${activityResponse.status} ${activityResponse.statusText}`)
      }
      
      const activityData = await activityResponse.json()
      setActivities(activityData.activities)
      setIsActivitiesLoading(false)
      
    } catch (error) {
      console.error('Dashboard data error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
      setIsStatsLoading(false)
      setIsActivitiesLoading(false)
    }
  }

  const getStatsCards = () => {
    if (!stats) return []

    return [
      {
        title: "Contact Messages",
        value: stats.contacts.total.toString(),
        change: stats.contacts.thisMonth > 0 ? "+" + stats.contacts.thisMonth : "0",
        changeValue: `${stats.contacts.unread} unread`,
        period: "this month",
        icon: MessageSquare,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        trend: stats.contacts.thisMonth > stats.contacts.lastMonth ? "up" : "down"
      },
      {
        title: "Success Stories",
        value: stats.stories.published.toString(),
        change: stats.stories.thisMonth > 0 ? "+" + stats.stories.thisMonth : "0",
        changeValue: `${stats.stories.total} total`,
        period: "this month",
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        trend: "up"
      },
      {
        title: "Newsletter Subscribers",
        value: stats.newsletter.active.toString(),
        change: stats.newsletter.thisMonth > 0 ? "+" + stats.newsletter.thisMonth : "0",
        changeValue: `${stats.newsletter.total} total`,
        period: "this month",
        icon: Mail,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        trend: "up"
      },
      {
        title: "Pending Volunteers",
        value: stats.volunteers.pending.toString(),
        change: stats.volunteers.thisMonth > 0 ? "+" + stats.volunteers.thisMonth : "0",
        changeValue: `${stats.volunteers.total} total`,
        period: "this month",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        trend: stats.volunteers.thisMonth > 0 ? "up" : "down"
      }
    ]
  }

  const getContentOverview = () => {
    if (!stats) return []

    return [
      {
        title: "Blog Posts",
        value: stats.blogs.published.toString(),
        change: stats.blogs.thisMonth > 0 ? "+" + stats.blogs.thisMonth : "0",
        details: "Published articles",
        icon: FileText,
        color: "text-primary",
        bgColor: "bg-primary/10"
      },
      {
        title: "Success Stories",
        value: stats.stories.published.toString(),
        change: stats.stories.thisMonth > 0 ? "+" + stats.stories.thisMonth : "0",
        details: "Impact testimonials",
        icon: Heart,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Videos",
        value: stats.videos.total.toString(),
        change: stats.videos.thisMonth > 0 ? "+" + stats.videos.thisMonth : "0",
        details: "Media content",
        icon: Video,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Gallery",
        value: stats.gallery.total.toString(),
        change: stats.gallery.thisMonth > 0 ? "+" + stats.gallery.thisMonth : "0",
        details: "Photo collection",
        icon: ImageIcon,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      }
    ]
  }

  const getQuickActions = () => [
    {
      title: "New Blog Post",
      icon: FileText,
      href: "/admin/blog",
      variant: "outline" as const
    },
    {
      title: "Add Story",
      icon: Heart,
      href: "/admin/stories",
      variant: "outline" as const
    },
    {
      title: "Upload Video",
      icon: Video,
      href: "/admin/videos",
      variant: "outline" as const
    },
    {
      title: "Manage Gallery",
      icon: ImageIcon,
      href: "/admin/gallery",
      variant: "outline" as const
    },
    {
      title: "View Contacts",
      icon: MessageSquare,
      href: "/admin/contacts",
      variant: "outline" as const
    },
    {
      title: "View Volunteers",
      icon: Users,
      href: "/admin/volunteers",
      variant: "outline" as const
    }
  ]

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  if (isStatsLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminHeader title="Dashboard Overview" description="Welcome back! Here's your ADTS Rwanda impact summary." />
        
        <div className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminHeader title="Dashboard Overview" description="Welcome back! Here's your ADTS Rwanda impact summary." />
        
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statsCards = getStatsCards()
  const contentOverview = getContentOverview()
  const quickActions = getQuickActions()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader title="Dashboard Overview" description="Welcome back! Here's your ADTS Rwanda impact summary." />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
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
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white py-4">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {isActivitiesLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'contact' ? 'bg-blue-100' :
                        activity.type === 'volunteer' ? 'bg-green-100' :
                        activity.type === 'blog' ? 'bg-purple-100' :
                        activity.type === 'story' ? 'bg-red-100' :
                        activity.type === 'video' ? 'bg-orange-100' :
                        activity.type === 'gallery' ? 'bg-yellow-100' :
                        activity.type === 'newsletter' ? 'bg-pink-100' :
                        activity.type === 'job' ? 'bg-indigo-100' :
                        activity.type === 'tender' ? 'bg-gray-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'contact' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'volunteer' && <Users className="w-4 h-4 text-green-600" />}
                        {activity.type === 'blog' && <FileText className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'story' && <Heart className="w-4 h-4 text-red-600" />}
                        {activity.type === 'video' && <Video className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'gallery' && <ImageIcon className="w-4 h-4 text-yellow-600" />}
                        {activity.type === 'newsletter' && <Mail className="w-4 h-4 text-pink-600" />}
                        {activity.type === 'job' && <Briefcase className="w-4 h-4 text-indigo-600" />}
                        {activity.type === 'tender' && <Briefcase className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        {activity.details && <p className="text-xs text-gray-400 mt-1">{activity.details}</p>}
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                      </div>
                      {activity.priority === 'high' && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs flex-shrink-0">
                          High
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white py-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Unread Messages</div>
                      <div className="text-xs text-gray-600">Need attention</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">{stats?.contacts.unread || 0}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Pending Volunteers</div>
                      <div className="text-xs text-gray-600">Awaiting review</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{stats?.volunteers.pending || 0}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">New Subscribers</div>
                      <div className="text-xs text-gray-600">This month</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-600">{stats?.newsletter.thisMonth || 0}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Active Jobs</div>
                      <div className="text-xs text-gray-600">Currently open</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">{stats?.jobs.active || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Overview and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Overview */}
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 py-4">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Content Overview</CardTitle>
              <p className="text-gray-600 mt-1">Published content across platforms</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contentOverview.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${content.bgColor} rounded-lg flex items-center justify-center`}>
                        <content.icon className={`w-6 h-6 ${content.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-600">{content.details}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{content.value}</div>
                      <div className="text-xs text-green-600">{content.change} this month</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 py-4">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="h-16 border-2 hover:bg-primary/90 flex flex-col items-center gap-2"
                    onClick={() => router.push(action.href)}
                  >
                    <action.icon className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
