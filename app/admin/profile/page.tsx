"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/lib/profile-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Camera,
  Save,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Calendar,
} from "lucide-react"
import Image from "next/image"

interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  avatar_url: string | null
  created_at: string
}

type FeedbackMsg = { type: "success" | "error"; text: string } | null

function Feedback({ msg }: { msg: FeedbackMsg }) {
  if (!msg) return null
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
      msg.type === "success"
        ? "bg-green-50 text-green-800 border border-green-200"
        : "bg-red-50 text-red-800 border border-red-200"
    }`}>
      {msg.type === "success"
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {msg.text}
    </div>
  )
}

export default function ProfilePage() {
  const { refreshAvatar } = useProfile()
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* ── Profile info form ── */
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<FeedbackMsg>(null)

  /* ── Avatar ── */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── Password form ── */
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<FeedbackMsg>(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile")
      if (!res.ok) throw new Error("Failed to load profile")
      const data = await res.json()
      setProfile(data.user)
      setFullName(data.user.full_name ?? "")
      setEmail(data.user.email ?? "")
      setAvatarUrl(data.user.avatar_url ?? null)
    } catch {
      // silently fail — page still renders with empty fields
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Avatar upload ── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setProfileMsg({ type: "error", text: "Please select an image file." })
      return
    }

    try {
      setIsUploadingAvatar(true)
      setProfileMsg(null)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await res.json()
      setAvatarUrl(data.url)

      // Save avatar_url to profile and refresh the top-bar avatar
      await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.url }),
      })

      refreshAvatar()
      setProfileMsg({ type: "success", text: "Profile photo updated." })
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Failed to upload photo." })
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  /* ── Save profile info ── */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setProfileMsg({ type: "error", text: "Full name is required." })
      return
    }
    if (!email.trim()) {
      setProfileMsg({ type: "error", text: "Email is required." })
      return
    }

    setIsSavingProfile(true)
    setProfileMsg(null)

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save profile")

      setProfile(data.user)
      setProfileMsg({ type: "success", text: "Profile information saved successfully." })
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Failed to save profile." })
    } finally {
      setIsSavingProfile(false)
    }
  }

  /* ── Change password ── */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Please enter your current password." })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." })
      return
    }

    setIsSavingPassword(true)

    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to change password")

      setPasswordMsg({ type: "success", text: "Password changed successfully." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to change password." })
    } finally {
      setIsSavingPassword(false)
    }
  }

  /* ── Avatar display ── */
  const initials = (fullName || profile?.full_name || "A")
    .split(/[\s._-]/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("")

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "—"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="px-6 pb-6 pt-6 space-y-6 max-w-4xl mx-auto">
        {/* Page title — aligned with the cards below */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and security</p>
        </div>

        {/* ── Profile header card ── */}
        <Card className="bg-white overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/80 to-primary" />
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-primary flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile photo"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  )}
                </div>
                {/* Camera button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
                  title="Change photo"
                >
                  {isUploadingAvatar
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Camera className="w-3.5 h-3.5 text-white" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name + meta */}
              <div className="flex-1 pt-2 sm:pt-0">
                <h2 className="text-xl font-bold text-gray-900">{profile?.full_name || "Admin User"}</h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Shield className="w-3.5 h-3.5" />
                    {profile?.role ?? "Admin"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {memberSince}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    profile?.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {profile?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Personal information ── */}
        <Card className="bg-white">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Personal Information</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Update your name and email address</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <Feedback msg={profileMsg} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10"
                      disabled={isSavingProfile}
                    />
                  </div>
                </div>

                {/* Role (read-only) */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={profile?.role ?? "Admin"}
                      className="pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-400">Role is managed by a super admin</p>
                </div>

                {/* Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      disabled={isSavingProfile}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    If you change your email, use the new address to sign in next time.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" disabled={isSavingProfile} className="gap-2 px-6">
                  {isSavingProfile
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                    : <><Save className="w-4 h-4" />Save Changes</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── Change password ── */}
        <Card className="bg-white">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">Change Password</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Choose a strong password of at least 8 characters</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <form onSubmit={handleChangePassword} className="space-y-5">
              <Feedback msg={passwordMsg} />

              {/* Current password — full width */}
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="pl-10 pr-10"
                    disabled={isSavingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New + Confirm — two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="pl-10 pr-10"
                      disabled={isSavingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {newPassword.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = Math.min(
                          4,
                          (newPassword.length >= 8 ? 1 : 0) +
                          (/[A-Z]/.test(newPassword) ? 1 : 0) +
                          (/[0-9]/.test(newPassword) ? 1 : 0) +
                          (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0)
                        )
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= strength
                                ? strength <= 1 ? "bg-red-400"
                                  : strength <= 2 ? "bg-orange-400"
                                  : strength <= 3 ? "bg-yellow-400"
                                  : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className={`pl-10 pr-10 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-400 focus-visible:ring-red-300"
                          : ""
                      }`}
                      disabled={isSavingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={isSavingPassword || (!!confirmPassword && confirmPassword !== newPassword)}
                  className="gap-2 px-6"
                >
                  {isSavingPassword
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Changing...</>
                    : <><Lock className="w-4 h-4" />Change Password</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

