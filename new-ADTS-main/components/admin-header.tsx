"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Bell, Search, X, User, Mail, MessageSquare, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: 'subscriber' | 'contact'
  title: string
  message: string
  timestamp: string
  link: string
  icon: string
}

interface AdminHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  const email = user?.email ?? "admin@adtsrwanda.org"
  const name = user?.fullName || "Admin"
  const initials = name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "A")
    .slice(0, 2)
    .join("") || "AD"

  useEffect(() => {
    loadNotifications()
    // Check for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoadingNotifications(true)
      const response = await fetch("/api/admin/notifications")
      
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to the relevant page
    router.push(notification.link)
    setShowNotifications(false)
    
    // Mark this notification as read
    markNotificationsAsRead([notification])
  }

  const markNotificationsAsRead = async (notificationsToMark: Notification[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifications: notificationsToMark }),
      })
      
      // Refresh notifications after marking as read
      loadNotifications()
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'subscriber':
        return <Mail className="w-4 h-4 text-blue-600" />
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-green-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 max-w-md">
          <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 text-xs bg-red-500 hover:bg-red-600">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="p-4 text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center">
                      <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="w-full p-4 text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-primary hover:text-primary/80"
                      onClick={() => {
                        markNotificationsAsRead(notifications)
                        setShowNotifications(false)
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-medium break-all">{name}</p>
              <p className="text-xs text-gray-500 break-all">{email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
