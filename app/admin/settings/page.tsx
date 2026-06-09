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
  Plus,
  UserCheck,
  UserX,
  Trash2,
  AlertTriangle,
  Shield,
} from "lucide-react"
import { TablePagination } from "@/components/ui/table-pagination"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

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
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [usersPage, setUsersPage] = useState(1)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  /* ── Settings form ── */
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

  /* ── Admin users ── */
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  /* ── Create user dialog ── */
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ full_name: "", email: "", role: "admin" })
  const [isCreating, setIsCreating] = useState(false)

  /* ── Toggle active dialog ── */
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  /* ── Delete dialog ── */
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete user")

      setAdminUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      toast({
        title: "User deleted",
        description: `${deleteTarget.full_name || deleteTarget.email} has been permanently removed.`,
      })
      setDeleteTarget(null)
    } catch (err: any) {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    loadAdminUsers()
  }, [])

  const loadAdminUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setAdminUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to load admin users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Determine if current user is super_admin from the loaded list
  useEffect(() => {
    if (user?.email && adminUsers.length > 0) {
      const me = adminUsers.find((u) => u.email === user.email)
      setIsSuperAdmin(me?.role === "super_admin")
    }
  }, [user, adminUsers])

  const handleSaveSettings = async (section: "general" | "social") => {
    setIsSaving(true)
    setMessage(null)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setMessage({ type: "success", text: `${section === "general" ? "General" : "Social Media"} settings saved successfully!` })
    } catch {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  /* ── Create user ── */
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.full_name.trim() || !createForm.email.trim()) {
      toast({ title: "Error", description: "Full name and email are required.", variant: "destructive" })
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to create user")

      setAdminUsers((prev) => [data.user, ...prev])
      setCreateDialogOpen(false)
      setCreateForm({ full_name: "", email: "", role: "admin" })

      toast({
        title: "Admin created",
        description: data.emailSent
          ? `Invitation email sent to ${createForm.email}.`
          : `User created. Check server logs for the set-password link (email failed).`,
      })
    } catch (err: any) {
      toast({ title: "Failed to create user", description: err.message, variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  /* ── Activate / Deactivate ── */
  const handleToggleActive = async () => {
    if (!toggleTarget) return
    setIsToggling(true)
    try {
      const res = await fetch(`/api/admin/users/${toggleTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !toggleTarget.is_active }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update user")

      setAdminUsers((prev) => prev.map((u) => u.id === toggleTarget.id ? { ...u, is_active: !u.is_active } : u))
      toast({
        title: toggleTarget.is_active ? "User deactivated" : "User activated",
        description: `${toggleTarget.full_name || toggleTarget.email} has been ${toggleTarget.is_active ? "deactivated" : "activated"}.`,
      })
      setToggleTarget(null)
    } catch (err: any) {
      toast({ title: "Failed to update user", description: err.message, variant: "destructive" })
    } finally {
      setIsToggling(false)
    }
  }

  const paginatedUsers = adminUsers.slice(
    (usersPage - 1) * USERS_PER_PAGE,
    usersPage * USERS_PER_PAGE
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader title="System Settings" description="Manage site configuration and preferences" />

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
                <div className="p-2 bg-blue-50 rounded-lg"><Globe className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <CardTitle className="text-base">General Settings</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Basic site information and contact details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="siteName" className="text-sm font-medium">Site Name</Label>
                <Input id="siteName" value={settings.siteName} onChange={(e) => setSettings(p => ({ ...p, siteName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="siteEmail" className="text-sm font-medium">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="siteEmail" type="email" value={settings.siteEmail} onChange={(e) => setSettings(p => ({ ...p, siteEmail: e.target.value }))} className="pl-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="siteDescription" className="text-sm font-medium">Site Description</Label>
                <Textarea id="siteDescription" value={settings.siteDescription} onChange={(e) => setSettings(p => ({ ...p, siteDescription: e.target.value }))} rows={3} className="resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="phone" value={settings.phone} onChange={(e) => setSettings(p => ({ ...p, phone: e.target.value }))} className="pl-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="address" value={settings.address} onChange={(e) => setSettings(p => ({ ...p, address: e.target.value }))} className="pl-10" />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("general")} disabled={isSaving} className="w-full">
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save General Settings</>}
              </Button>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-white">
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg"><Globe className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <CardTitle className="text-base">Social Media</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Connect your social media accounts</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 space-y-4">
              {[
                { id: "facebook", label: "Facebook", Icon: Facebook, placeholder: "https://facebook.com/adtsrwanda" },
                { id: "twitter", label: "Twitter / X", Icon: Twitter, placeholder: "https://twitter.com/adtsrwanda" },
                { id: "instagram", label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/adtsrwanda" },
                { id: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/company/adtsrwanda" },
              ].map(({ id, label, Icon, placeholder }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id={id}
                      placeholder={placeholder}
                      value={settings[id as keyof SiteSettings]}
                      onChange={(e) => setSettings(p => ({ ...p, [id]: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleSaveSettings("social")} disabled={isSaving} className="w-full">
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Social Media</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Users */}
        <Card className="bg-white overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><Users className="w-5 h-5 text-green-600" /></div>
                <div>
                  <CardTitle className="text-base">Admin Users</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isSuperAdmin ? "Manage administrator accounts" : "Current administrator accounts (read-only)"}
                  </p>
                </div>
              </div>
              {isSuperAdmin && (
                <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Add Admin
                </Button>
              )}
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
                        {isSuperAdmin && (
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        )}
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
                                  isCurrentUser ? "bg-primary text-white" : "bg-blue-50"
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
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                adminUser.role === "super_admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {adminUser.role === "super_admin" && <Shield className="w-3 h-3" />}
                                {adminUser.role === "super_admin" ? "Super Admin" : "Admin"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                adminUser.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {adminUser.is_active ? "Active" : "Pending / Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(adminUser.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </td>
                            {isSuperAdmin && (
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                  {!isCurrentUser && (
                                    <>
                                      <Button
                                        variant="ghost" size="sm"
                                        className={`h-8 w-8 p-0 ${adminUser.is_active ? "text-gray-500 hover:text-orange-600 hover:bg-orange-50" : "text-gray-500 hover:text-green-600 hover:bg-green-50"}`}
                                        title={adminUser.is_active ? "Deactivate user" : "Activate user"}
                                        onClick={() => setToggleTarget(adminUser)}
                                      >
                                        {adminUser.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                      </Button>
                                      <Button
                                        variant="ghost" size="sm"
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                        title="Delete user"
                                        onClick={() => setDeleteTarget(adminUser)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            )}
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

      {/* ── Create Admin Dialog ── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Admin User
            </DialogTitle>
            <DialogDescription>
              The new user will receive an email with a link to set their own password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="new-name"
                placeholder="Jane Doe"
                value={createForm.full_name}
                onChange={(e) => setCreateForm(p => ({ ...p, full_name: e.target.value }))}
                required
                disabled={isCreating}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="new-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))}
                  className="pl-10"
                  required
                  disabled={isCreating}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-role" className="text-sm font-medium">Role</Label>
              <select
                id="new-role"
                value={createForm.role}
                onChange={(e) => setCreateForm(p => ({ ...p, role: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isCreating}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className="gap-2">
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <><Mail className="w-4 h-4" />Create & Send Invite</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete User Dialog ── */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Admin User
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. The user will lose all access immediately.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{deleteTarget.full_name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{deleteTarget.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{deleteTarget.role === "super_admin" ? "Super Admin" : "Admin"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting} className="gap-2">
              {isDeleting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</>
                : <><Trash2 className="w-4 h-4" />Delete Permanently</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toggle Active Dialog ── */}
      <Dialog open={!!toggleTarget} onOpenChange={(open) => !open && setToggleTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              {toggleTarget?.is_active ? "Deactivate" : "Activate"} User
            </DialogTitle>
            <DialogDescription>
              {toggleTarget?.is_active
                ? `Deactivating ${toggleTarget?.full_name || toggleTarget?.email} will prevent them from logging in.`
                : `Activating ${toggleTarget?.full_name || toggleTarget?.email} will allow them to log in.`}
            </DialogDescription>
          </DialogHeader>
          {toggleTarget && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{toggleTarget.full_name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{toggleTarget.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleTarget(null)} disabled={isToggling}>Cancel</Button>
            <Button
              variant={toggleTarget?.is_active ? "destructive" : "default"}
              onClick={handleToggleActive}
              disabled={isToggling}
              className="gap-2"
            >
              {isToggling
                ? <><Loader2 className="w-4 h-4 animate-spin" />{toggleTarget?.is_active ? "Deactivating..." : "Activating..."}</>
                : <>{toggleTarget?.is_active ? <><UserX className="w-4 h-4" />Deactivate</> : <><UserCheck className="w-4 h-4" />Activate</>}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
