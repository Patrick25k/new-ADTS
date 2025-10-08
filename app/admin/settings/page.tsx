import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Globe, 
  Users, 
  Shield, 
  Bell, 
  Mail, 
  Database, 
  Palette, 
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  MapPin,
  Clock,
  CheckCircle
} from "lucide-react"

export default function SettingsPage() {
  const adminUsers = [
    {
      id: 1,
      name: "Jean Damour",
      email: "admin@adtsrwanda.org",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2 hours ago",
      permissions: ["Full Access"]
    },
    {
      id: 2,
      name: "Sarah Uwimana",
      email: "sarah@adtsrwanda.org",
      role: "Content Manager",
      status: "Active",
      lastLogin: "1 day ago",
      permissions: ["Blog", "Stories", "Gallery"]
    },
    {
      id: 3,
      name: "David Nkurunziza",
      email: "david@adtsrwanda.org",
      role: "Program Manager",
      status: "Inactive",
      lastLogin: "1 week ago",
      permissions: ["Reports", "Programs"]
    }
  ]

  const systemStats = [
    { label: "System Status", value: "Operational", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Last Backup", value: "2 hours ago", icon: Database, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Active Users", value: "3", icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Storage Used", value: "2.4 GB", icon: Database, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader 
        title="System Settings" 
        description="Manage site configuration and system preferences"
        action={
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Settings</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Basic site information and contact details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium">Site Name</Label>
                <Input id="siteName" defaultValue="ADTS Rwanda" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteEmail" className="text-sm font-medium">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="siteEmail" type="email" defaultValue="adtsrwanda@yahoo.fr" className="pl-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-sm font-medium">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  defaultValue="Transforming lives and empowering communities through social development"
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="phone" defaultValue="+250 788 308 255" className="pl-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="address" defaultValue="KG 567 St, Nyarugunga, Kigali" className="pl-10 h-10" />
                </div>
              </div>
              <Button className="w-full mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Settings */}
          <Card className="bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Social Media</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Connect your social media accounts</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="facebook" placeholder="https://facebook.com/adtsrwanda" className="pl-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm font-medium">Twitter/X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="twitter" placeholder="https://twitter.com/adtsrwanda" className="pl-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="instagram" placeholder="https://instagram.com/adtsrwanda" className="pl-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="linkedin" placeholder="https://linkedin.com/company/adtsrwanda" className="pl-10 h-10" />
                </div>
              </div>
              <Button className="w-full mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Social Media
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Notification Settings</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure email and system notifications</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Contact Messages</p>
                    <p className="text-sm text-gray-500">Get notified of new contact form submissions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-gray-500">Receive system maintenance notifications</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-500">Get weekly analytics reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-gray-500">Important security notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Notifications</p>
                    <p className="text-sm text-gray-500">Get notified when backups complete</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users Management */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Admin Users</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage administrator accounts and permissions</p>
                </div>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Admin
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>Last login: {user.lastLogin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Configure security and access controls</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add extra security to admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Attempts Limit</p>
                    <p className="text-sm text-gray-500">Block accounts after failed attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Session Duration (hours)</Label>
                  <Input type="number" defaultValue="8" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Max Login Attempts</Label>
                  <Input type="number" defaultValue="5" className="h-10" />
                </div>
                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
