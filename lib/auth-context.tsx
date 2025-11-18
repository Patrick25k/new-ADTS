"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  user: { email: string, fullName: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ email: string, fullName: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check for token in localStorage and cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1]
      
      if (token === 'authenticated-admin-session') {
        setIsAuthenticated(true)
        return
      }

      const response = await fetch('/api/admin/me', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      const data = await response.json()

      if (data?.authenticated && data.user?.email) {
        setIsAuthenticated(true)
        setUser({ email: data.user.email, fullName: data.user.fullName })
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simple authentication - in production, call your API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      // Set cookie with authentication token
      if (data?.success && data.user?.email) {
        setIsAuthenticated(true)
        setUser({ email: data.user.email, fullName: data.user.fullName })
        return true
      }

      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    // Remove authentication cookie
    ;(async () => {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        setIsAuthenticated(false)
        setUser(null)
        router.push('/admin/login')
      }
    })()
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
