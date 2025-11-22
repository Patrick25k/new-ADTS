"use client"

import { useState, useEffect } from "react"
import { Mail, Users, Download, Search, Calendar, CheckCircle, X, User } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: string
  subscribed_at: string
  created_at: string
}

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    loadSubscribers()
  }, [])

  const loadSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/newsletter-subscribers")
      
      if (!response.ok) {
        throw new Error("Failed to load subscribers")
      }

      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      console.error("Failed to load subscribers:", error)
      setError("Failed to load subscribers")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = !searchTerm || 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && subscriber.status === "active") ||
      (filterStatus === "inactive" && subscriber.status === "inactive")

    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    const headers = ["Email", "Name", "Status", "Subscribed Date"]
    const csvData = filteredSubscribers.map(sub => [
      sub.email,
      sub.name || "",
      sub.status,
      new Date(sub.subscribed_at).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const activeCount = subscribers.filter(s => s.status === "active").length
  const totalCount = subscribers.length

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Newsletter Subscribers"
        description="Manage newsletter subscribers and export data"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Subscriber Overview</h2>
                <p className="text-gray-600">
                  {activeCount} active • {totalCount} total subscribers
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredSubscribers.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

      {error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadSubscribers}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-gray-600">Total Subscribers</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-gray-600">Active Subscribers</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Date().toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-gray-600">Current Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === "active"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === "inactive"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Inactive ({totalCount - activeCount})
                </button>
              </div>
            </div>
          </div>

          {/* Subscribers List */}
          <div className="bg-white rounded-lg border">
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== "all"
                    ? "No subscribers found matching your criteria"
                    : "No subscribers yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Subscriber</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{subscriber.email}</p>
                              {subscriber.name && (
                                <p className="text-sm text-gray-600">{subscriber.name}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subscriber.status === "active" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(subscriber.subscribed_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
)
}
