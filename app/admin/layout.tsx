"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  Video,
  Briefcase,
  Settings,
  LogOut,
  Heart,
  Mail,
  UserCheck,
  BookOpen,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth-context";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">ADTS Rwanda</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </Link>
        </div> */}

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Content Management
              </p>
            </div>

            <Link
              href="/admin/blog"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Blog Posts</span>
            </Link>

            <Link
              href="/admin/stories"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Stories</span>
            </Link>

            <Link
              href="/admin/videos"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Video className="w-5 h-5" />
              <span className="font-medium">Videos</span>
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Gallery</span>
            </Link>

            <Link
              href="/admin/team"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Team Members</span>
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Publications
              </p>
            </div>

            <Link
              href="/admin/tenders"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span className="font-medium">Tenders</span>
            </Link>

            <Link
              href="/admin/jobs"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Jobs</span>
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="font-medium">Reports</span>
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Submissions
              </p>
            </div>

            <Link
              href="/admin/contacts"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact Messages</span>
            </Link>

            <Link
              href="/admin/volunteers"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Volunteers</span>
            </Link>

            <Link
              href="/admin/prayers"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Prayer Requests</span>
            </Link>

            <Link
              href="/admin/child-protection"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Child Protection</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors mb-2"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide sidebar for the login page so it shows a clean, full-width login view
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return (
      <AuthProvider>
        <div className="min-h-screen">{children}</div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  );
}
