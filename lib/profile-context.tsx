"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface ProfileContextValue {
  avatarUrl: string | null
  refreshAvatar: () => void
}

const ProfileContext = createContext<ProfileContextValue>({
  avatarUrl: null,
  refreshAvatar: () => {},
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const fetchAvatar = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/profile")
      if (res.ok) {
        const data = await res.json()
        setAvatarUrl(data.user?.avatar_url ?? null)
      }
    } catch {
      // silently ignore — avatar just stays as initials
    }
  }, [])

  useEffect(() => {
    fetchAvatar()
  }, [fetchAvatar])

  return (
    <ProfileContext.Provider value={{ avatarUrl, refreshAvatar: fetchAvatar }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
