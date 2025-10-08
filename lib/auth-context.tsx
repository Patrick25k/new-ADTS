"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  user: { email: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      // Check for token in localStorage and cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1]
      
      if (token === 'authenticated-admin-session') {
        setIsAuthenticated(true)
        setUser({ email: 'admin@adtsrwanda.org' }) // In production, decode from JWT
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simple authentication - in production, call your API
      if (email === 'admin@adtsrwanda.org' && password === 'admin123') {
        // Set cookie with authentication token
        document.cookie = 'admin-token=authenticated-admin-session; path=/; max-age=86400' // 24 hours
        
        setIsAuthenticated(true)
        setUser({ email })
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
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    setIsAuthenticated(false)
    setUser(null)
    router.push('/admin/login')
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
