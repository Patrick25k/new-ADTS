"use client";

import type React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  Video,
  Briefcase,
  Heart,
  Mail,
  UserCheck,
  BookOpen,
  FileSpreadsheet,
  Bell,
  X,
  MessageSquare,
  ExternalLink,
  Settings,
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ProfileProvider, useProfile } from "@/lib/profile-context";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "subscriber" | "contact";
  title: string;
  message: string;
  timestamp: string;
  link: string;
}

function TopBar() {
  const { user, logout } = useAuth();
  const { avatarUrl } = useProfile();
  const router = useRouter();

  const name = user?.fullName || "Admin";
  const email = user?.email ?? "";
  const initials = name
    .split(/[._\s-]/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? "A")
    .slice(0, 2)
    .join("") || "AD";

  /* ── Notifications ── */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  /* ── Profile dropdown ── */
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch { /* silent */ } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = (n: Notification) => {
    router.push(n.link);
    setShowNotifications(false);
    markRead([n]);
  };

  const markRead = async (list: Notification[]) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: list }),
      });
      loadNotifications();
    } catch { /* silent */ }
  };

  const formatTs = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Company name */}
      <span className="text-base font-bold text-gray-900 tracking-tight">
        ADTS Rwanda
      </span>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Bell */}
        <div className="relative" ref={bellRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => { setShowNotifications((p) => !p); setShowProfile(false); }}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((n) => (
                      <button key={n.id} onClick={() => handleNotificationClick(n)}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors group">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex-shrink-0">
                            {n.type === "contact"
                              ? <MessageSquare className="w-4 h-4 text-green-600" />
                              : <Mail className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-medium text-gray-900 truncate">{n.title}</p>
                              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatTs(n.timestamp)}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <Button variant="ghost" size="sm"
                    className="w-full text-xs text-primary hover:text-primary/80"
                    onClick={() => { markRead(notifications); setShowNotifications(false); }}>
                    Mark all as read
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile avatar + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile((p) => !p); setShowNotifications(false); }}
            className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${showProfile ? "rotate-180" : ""}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-11 w-60 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setShowProfile(false)}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  Help
                </button>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLink = (href: string, icon: React.ReactNode, label: string) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        pathname === href
          ? "bg-primary/10 text-primary font-semibold"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar — logo only at top, nav in middle */}
      <aside className="w-64 bg-white flex flex-col">
        <Link
          href="/"
          className="h-14 flex items-center justify-center border-b-2 border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0"
          title="Back to public site"
        >
          <Image
            src="/images/ADTS LOGO.jpg"
            alt="ADTS Rwanda"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
        </Link>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-0.5">
            {navLink("/admin", <LayoutDashboard className="w-5 h-5" />, "Dashboard")}

            <div className="pt-4 pb-1.5">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</p>
            </div>
            {navLink("/admin/blog", <FileText className="w-5 h-5" />, "Blog Posts")}
            {navLink("/admin/stories", <Heart className="w-5 h-5" />, "Stories")}
            {navLink("/admin/videos", <Video className="w-5 h-5" />, "Videos")}
            {navLink("/admin/gallery", <ImageIcon className="w-5 h-5" />, "Gallery")}
            {navLink("/admin/team", <Users className="w-5 h-5" />, "Team Members")}

            <div className="pt-4 pb-1.5">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Publications</p>
            </div>
            {navLink("/admin/tenders", <Briefcase className="w-5 h-5" />, "Tenders")}
            {navLink("/admin/jobs", <UserCheck className="w-5 h-5" />, "Jobs")}
            {navLink("/admin/reports", <FileSpreadsheet className="w-5 h-5" />, "Reports")}

            <div className="pt-4 pb-1.5">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submissions</p>
            </div>
            {navLink("/admin/contacts", <Mail className="w-5 h-5" />, "Contact Messages")}
            {navLink("/admin/newsletter", <BookOpen className="w-5 h-5" />, "Subscribers")}
            {navLink("/admin/volunteers", <Users className="w-5 h-5" />, "Volunteers")}
            {navLink("/admin/child-protection", <Heart className="w-5 h-5" />, "Child Protection")}
          </div>
        </nav>
      </aside>

      {/* Right column: top bar + page content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/forgot-password/" ||
    pathname === "/admin/set-password" ||
    pathname === "/admin/set-password/"
  ) {
    return (
      <AuthProvider>
        <div className="min-h-screen">{children}</div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </ProfileProvider>
    </AuthProvider>
  );
}
