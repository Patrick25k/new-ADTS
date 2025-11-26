"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  User,
  Share2,
  Eye,
  UserPlus,
} from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type TeamStatus = "Active" | "On Leave" | "Inactive";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: TeamStatus;
  featured: boolean;
  image: string;
  avatar: string;
  bio: string;
  skills: string[];
  joinDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function TeamManagement() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | TeamStatus | "featured" | "leadership">("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    location: "",
    status: "Active" as TeamStatus,
    featured: false,
    image: "",
    bio: "",
    skills: "",
    joinDate: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/team", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load team members");
      }

      const data = await response.json();
      setMembers(data.members ?? []);
    } catch (error) {
      console.error("Failed to load team members", error);
      toast({
        title: "Failed to load team members",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.position.toLowerCase().includes(search.toLowerCase()) ||
        member.department.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = (() => {
        if (statusFilter === "all") return true;
        if (statusFilter === "featured") return member.featured;
        if (statusFilter === "leadership")
          return member.department.toLowerCase().includes("leadership");
        return member.status === statusFilter;
      })();

      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt || b.joinDate || '0').getTime() - new Date(a.createdAt || a.joinDate || '0').getTime()).slice(0, 8);
  }, [members, search, statusFilter]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "Active").length;
    const departments = new Set(
      members.map((m) => m.department).filter((d) => d && d.trim().length > 0),
    ).size;
    const currentYear = new Date().getFullYear();
    const newThisYear = members.filter((m) => {
      if (!m.joinDate) return false;
      const date = new Date(m.joinDate);
      return !Number.isNaN(date.getTime()) && date.getFullYear() === currentYear;
    }).length;

    return [
      {
        label: "Total Team",
        value: String(total),
        change: "",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Active Members",
        value: String(active),
        change: "",
        icon: User,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Departments",
        value: String(departments),
        change: "",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        label: "New This Year",
        value: String(newThisYear),
        change: "",
        icon: UserPlus,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];
  }, [members]);

  const openNewDialog = () => {
    setEditingMember(null);
    setForm({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      location: "",
      status: "Active",
      featured: false,
      image: "",
      bio: "",
      skills: "",
      joinDate: "",
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      position: member.position,
      department: member.department,
      email: member.email,
      phone: member.phone,
      location: member.location,
      status: member.status,
      featured: member.featured,
      image: member.image,
      bio: member.bio,
      skills: member.skills.join(", "),
      joinDate: member.joinDate ?? "",
    });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleFormChange = (
    field: keyof typeof form,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }

    try {
      setIsUploadingImage(true);
      setImageFile(file);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to upload image");
      }

      const data = await response.json();
      const url = data.url as string | undefined;

      if (!url) {
        throw new Error("Upload succeeded but no URL was returned");
      }

      setForm((prev) => ({
        ...prev,
        image: url,
      }));

      toast({
        title: "Image uploaded",
        description: "Team member photo has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Failed to upload image", error);
      toast({
        title: "Failed to upload image",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
      setImageFile(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isUploadingImage) {
        toast({
          title: "Please wait",
          description: "Image is still uploading. Please wait for it to finish.",
        });
        return;
      }

      setIsSubmitting(true);

      const payload = { ...form };

      const endpoint = editingMember
        ? `/api/admin/team/${editingMember.id}`
        : "/api/admin/team";
      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to save team member");
      }

      const data = await response.json();
      const saved: TeamMember = data.member;

      setMembers((prev) => {
        if (editingMember) {
          return prev.map((m) => (m.id === saved.id ? saved : m));
        }
        return [saved, ...prev];
      });

      toast({
        title: editingMember ? "Team member updated" : "Team member created",
        description: editingMember
          ? "Your changes have been saved."
          : "The team member has been created.",
      });

      setIsDialogOpen(false);
      setEditingMember(null);

      await loadMembers();
    } catch (error: any) {
      console.error("Failed to save team member", error);
      toast({
        title: "Failed to save team member",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`Delete team member "${member.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/team/${member.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete team member");
      }

      setMembers((prev) => prev.filter((m) => m.id !== member.id));

      toast({
        title: "Team member deleted",
        description: "The team member has been removed.",
      });

      await loadMembers();
    } catch (error: any) {
      console.error("Failed to delete team member", error);
      toast({
        title: "Failed to delete team member",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Team Management"
        description="Manage team members and organizational structure"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {stat.change} this year
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search team members..."
                  className="pl-10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All Members
                </Button>
                <Button
                  variant={statusFilter === "Active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Active")}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "leadership" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("leadership")}
                >
                  Leadership
                </Button>
                <Button
                  variant={statusFilter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("featured")}
                >
                  Featured
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        {isLoading && members.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading team members...</p>
            </div>
          </div>
        ) : !isLoading && filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Users className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No team members found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new team member to get started.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredMembers.length} of {members.length} team members (most recent)
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-white hover:shadow-lg transition-all duration-200 group"
            >
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {member.avatar}
                      </span>
                    )}
                  </div>
                </div>
                {member.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={`absolute top-3 right-3 ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-orange-100 text-orange-700 border border-orange-200"
                  }`}
                >
                  {member.status}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {member.position}
                    </p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {member.department}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 text-center line-clamp-2">
                    {member.bio}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {member.joinDate
                          ? `Joined ${new Date(
                              member.joinDate,
                            ).toLocaleDateString()}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary/20 hover:bg-primary/5"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-200 hover:bg-gray-50"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "New Team Member"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={form.position}
                  onChange={(event) =>
                    handleFormChange("position", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={form.department}
                  onChange={(event) =>
                    handleFormChange("department", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleFormChange("email", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    handleFormChange("phone", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={form.location}
                  onChange={(event) =>
                    handleFormChange("location", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input
                  type="date"
                  value={form.joinDate}
                  onChange={(event) =>
                    handleFormChange("joinDate", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={form.bio}
                onChange={(event) => handleFormChange("bio", event.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input
                value={form.skills}
                onChange={(event) =>
                  handleFormChange("skills", event.target.value)
                }
                placeholder="Leadership, Strategic Planning, Community Development"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo</label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {form.image && (
                  <p className="text-xs text-gray-500 break-all">
                    Current image URL: {form.image}
                  </p>
                )}
                {isUploadingImage && (
                  <p className="text-xs text-blue-600">Uploading image...</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    handleFormChange("featured", event.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm">
                  Mark as featured
                </label>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Button
                  type="button"
                  variant={form.status === "Active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("status", "Active")}
                >
                  Active
                </Button>
                <Button
                  type="button"
                  variant={form.status === "On Leave" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("status", "On Leave")}
                >
                  On Leave
                </Button>
                <Button
                  type="button"
                  variant={form.status === "Inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("status", "Inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="ml-auto cursor-pointer"
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingMember ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingMember ? "Save Changes" : "Create Team Member"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
