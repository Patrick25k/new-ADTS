"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/lib/auth-context"
import {
  Settings,
  Globe,
  Users,
  Mail,
  Phone,
  MapPin,
  Save,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react"

interface SiteSettings {
  siteName: string
  siteEmail: string
  siteDescription: string
  phone: string
  address: string
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
}

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  is_active: boolean
  created_at: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "ADTS Rwanda",
    siteEmail: "rwandaadts@gmail.com",
    siteDescription: "Transforming lives and empowering communities through social development",
    phone: "+250 788 605 493",
    address: "KG 567 St, Nyarugunga, Kigali",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    loadAdminUsers()
  }, [])

  const loadAdminUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      
      if (response.ok) {
        const data = await response.json()
        setAdminUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to load admin users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSaveSettings = async (section: 'general' | 'social') => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Simulate API call - replace with actual API later
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: `${section === 'general' ? 'General' : 'Social Media'} settings saved successfully!` })
    } catch (error) {
      console.error("Failed to save settings:", error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="System Settings"
        description="Manage site configuration and preferences"
      />

      <div className="p-6 space-y-6">
        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

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
                  <p className="text-sm text-gray-600 mt-1">
                    Basic site information and contact details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteEmail" className="text-sm font-medium">
                  Contact Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleInputChange('siteEmail', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="siteDescription"
                  className="text-sm font-medium"
                >
                  Site Description
                </Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSaveSettings('general')}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save General Settings
                  </>
                )}
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
                  <p className="text-sm text-gray-600 mt-1">
                    Connect your social media accounts
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm font-medium">
                  Facebook
                </Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/adtsrwanda"
                    value={settings.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm font-medium">
                  Twitter/X
                </Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/adtsrwanda"
                    value={settings.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm font-medium">
                  Instagram
                </Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/adtsrwanda"
                    value={settings.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium">
                  LinkedIn
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/adtsrwanda"
                    value={settings.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSaveSettings('social')}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Social Media
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Users */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Admin Users</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Current administrator accounts
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading admin users...</p>
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No admin users found</p>
                <p className="text-sm text-gray-500 mt-2">Check your database connection</p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers.map((adminUser) => {
                  const isCurrentUser = user?.email === adminUser.email
                  return (
                    <div
                      key={adminUser.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        isCurrentUser 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gradient-to-r from-blue-100 to-purple-100'
                        }`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {adminUser.full_name || 'Admin User'}
                            {isCurrentUser && (
                              <span className="ml-2 text-primary font-semibold">(You)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{adminUser.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {adminUser.role || 'Admin'}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                adminUser.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {adminUser.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {isCurrentUser && (
                              <Badge className="text-xs bg-primary text-primary-foreground">
                                Current User
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Joined: {new Date(adminUser.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
