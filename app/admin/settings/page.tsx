"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/lib/auth-context"
import {
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
  CheckCircle,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { TablePagination } from "@/components/ui/table-pagination"

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

const USERS_PER_PAGE = 10

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [usersPage, setUsersPage] = useState(1)

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "ADTS Rwanda",
    siteEmail: "rwandaadts@gmail.com",
    siteDescription: "Transforming lives and empowering communities through social development",
    phone: "+250 788 308 255",
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

  const handleSaveSettings = async (section: "general" | "social") => {
    setIsSaving(true)
    setMessage(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: "success", text: `${section === "general" ? "General" : "Social Media"} settings saved successfully!` })
    } catch {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const paginatedUsers = adminUsers.slice(
    (usersPage - 1) * USERS_PER_PAGE,
    usersPage * USERS_PER_PAGE
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="System Settings"
        description="Manage site configuration and preferences"
      />

      <div className="px-6 pb-6 space-y-6">
        {/* Feedback message */}
        {message && (
          <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message.type === "success"
              ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
              : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="bg-white">
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">General Settings</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Basic site information and contact details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="siteName" className="text-sm font-medium">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="siteEmail" className="text-sm font-medium">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="siteEmail"
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleInputChange("siteEmail", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="siteDescription" className="text-sm font-medium">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("general")} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Save General Settings</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-white">
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Social Media</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Connect your social media accounts</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/adtsrwanda"
                    value={settings.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="twitter" className="text-sm font-medium">Twitter / X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/adtsrwanda"
                    value={settings.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/adtsrwanda"
                    value={settings.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/company/adtsrwanda"
                    value={settings.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("social")} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Save Social Media</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Users */}
        <Card className="bg-white overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Admin Users</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Current administrator accounts</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingUsers ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading admin users...</p>
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-12 px-4">
                <ShieldCheck className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No admin users found</p>
                <p className="text-sm text-gray-400 mt-1">Check your database connection</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedUsers.map((adminUser) => {
                        const isCurrentUser = user?.email === adminUser.email
                        return (
                          <tr key={adminUser.id} className={`transition-colors ${isCurrentUser ? "bg-primary/5" : "hover:bg-gray-50"}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isCurrentUser ? "bg-primary text-primary-foreground" : "bg-blue-50"
                                }`}>
                                  <Users className={`w-4 h-4 ${isCurrentUser ? "text-white" : "text-blue-500"}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {adminUser.full_name || "Admin User"}
                                    {isCurrentUser && <span className="ml-2 text-xs text-primary font-semibold">(You)</span>}
                                  </p>
                                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {adminUser.role || "Admin"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                adminUser.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                              }`}>
                                {adminUser.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(adminUser.created_at).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                              })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <TablePagination
                  currentPage={usersPage}
                  totalItems={adminUsers.length}
                  itemsPerPage={USERS_PER_PAGE}
                  onPageChange={setUsersPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
