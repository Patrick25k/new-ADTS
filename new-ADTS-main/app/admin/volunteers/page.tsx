"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Clock,
  Share2,
  Heart,
  Star,
  MapPin,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type VolunteerStatus = "Pending" | "Approved" | "Rejected" | "Active";

interface VolunteerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  age: number | null;
  profession: string;
  experience: string;
  skills: string[];
  availability: string;
  preferredPrograms: string[];
  languages: string[];
  motivation: string;
  status: VolunteerStatus;
  rating: number | null;
  hoursCommitted: number;
  references: number;
  background: string;
  appliedAt: string;
}

export default function VolunteersManagement() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "active"
  >("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerItem | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState<VolunteerItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    profession: "",
    experience: "",
    skills: "",
    availability: "",
    preferredPrograms: "",
    languages: "",
    motivation: "",
    status: "Pending" as VolunteerStatus,
    rating: "",
    hoursCommitted: "",
    references: "",
    background: "",
  });

  const loadVolunteers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/volunteers", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load volunteers");
      }

      const data = await response.json();
      setVolunteers(data.volunteers ?? []);
    } catch (error) {
      console.error("Failed to load volunteers", error);
      toast({
        title: "Failed to load volunteers",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadVolunteers();
  }, [loadVolunteers]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const matchesSearch =
        !search ||
        volunteer.name.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.profession.toLowerCase().includes(search.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = (() => {
        if (filter === "all") return true;
        if (filter === "pending") return volunteer.status === "Pending";
        if (filter === "approved") return volunteer.status === "Approved";
        if (filter === "active") return volunteer.status === "Active";
        return true;
      })();

      return matchesSearch && matchesFilter;
    });
  }, [volunteers, search, filter]);

  const stats = useMemo(() => {
    const total = volunteers.length;
    const pending = volunteers.filter((v) => v.status === "Pending").length;
    const active = volunteers.filter((v) => v.status === "Active").length;
    const totalHours = volunteers.reduce(
      (sum, v) => sum + (v.hoursCommitted ?? 0),
      0,
    );

    return [
      {
        label: "Total Volunteers",
        value: String(total),
        change: "",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Pending Applications",
        value: String(pending),
        change: "",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        label: "Active Volunteers",
        value: String(active),
        change: "",
        icon: Heart,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Total Hours",
        value: String(totalHours),
        change: "",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ];
  }, [volunteers]);

  const openNewDialog = () => {
    setEditingVolunteer(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      age: "",
      profession: "",
      experience: "",
      skills: "",
      availability: "",
      preferredPrograms: "",
      languages: "",
      motivation: "",
      status: "Pending",
      rating: "",
      hoursCommitted: "",
      references: "",
      background: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (volunteer: VolunteerItem) => {
    setEditingVolunteer(volunteer);
    setForm({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      location: volunteer.location,
      age: volunteer.age ? String(volunteer.age) : "",
      profession: volunteer.profession,
      experience: volunteer.experience,
      skills: volunteer.skills.join("\n"),
      availability: volunteer.availability,
      preferredPrograms: volunteer.preferredPrograms.join("\n"),
      languages: volunteer.languages.join("\n"),
      motivation: volunteer.motivation,
      status: volunteer.status,
      rating: volunteer.rating ? String(volunteer.rating) : "",
      hoursCommitted: volunteer.hoursCommitted
        ? String(volunteer.hoursCommitted)
        : "",
      references: volunteer.references ? String(volunteer.references) : "",
      background: volunteer.background,
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const endpoint = editingVolunteer
        ? "/api/admin/volunteers"
        : "/api/admin/volunteers";
      const method = editingVolunteer ? "PUT" : "POST";

      const payload = {
        ...(editingVolunteer ? { id: editingVolunteer.id } : {}),
        ...form,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to save volunteer");
      }

      const data = await response.json();
      const saved: VolunteerItem = data.volunteer;

      setVolunteers((prev) => {
        if (editingVolunteer) {
          return prev.map((v) => (v.id === saved.id ? saved : v));
        }
        return [saved, ...prev];
      });

      toast({
        title: editingVolunteer ? "Volunteer updated" : "Volunteer created",
        description: editingVolunteer
          ? "The volunteer has been updated."
          : "The volunteer has been added.",
      });

      setIsDialogOpen(false);
      setEditingVolunteer(null);

      await loadVolunteers();
    } catch (error: any) {
      console.error("Failed to save volunteer", error);
      toast({
        title: "Failed to save volunteer",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateVolunteerStatus = async (
    volunteer: VolunteerItem,
    status: VolunteerStatus,
  ) => {
    try {
      const response = await fetch("/api/admin/volunteers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: volunteer.id, status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to update volunteer");
      }

      const data = await response.json();
      const updated: VolunteerItem = data.volunteer;

      setVolunteers((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v)),
      );
    } catch (error: any) {
      console.error("Failed to update volunteer", error);
      toast({
        title: "Failed to update volunteer",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!volunteerToDelete) return;

    try {
      const url = `/api/admin/volunteers?id=${encodeURIComponent(volunteerToDelete.id)}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete volunteer");
      }

      setVolunteers((prev) => prev.filter((v) => v.id !== volunteerToDelete.id));

      toast({
        title: "Volunteer deleted",
        description: "The volunteer has been removed.",
      });

      setDeleteDialogOpen(false);
      setVolunteerToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete volunteer", error);
      toast({
        title: "Failed to delete volunteer",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (volunteer: VolunteerItem) => {
    setVolunteerToDelete(volunteer);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVolunteerToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Volunteer Management"
        description="Review and manage volunteer applications"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Users className="w-4 h-4" />
              Invite Volunteers
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
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
                      {stat.change} this month
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
                  placeholder="Search volunteers..."
                  className="pl-10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={filter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers Grid */}
        {isLoading && volunteers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading volunteers...</p>
            </div>
          </div>
        ) : !isLoading && filteredVolunteers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Users className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No volunteers found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or check back later for new volunteer applications.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVolunteers.map((volunteer) => {
            const applied = new Date(volunteer.appliedAt);

            return (
              <Card
                key={volunteer.id}
                className="bg-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                    <Heart className="w-12 h-12 text-green-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`absolute top-3 right-3 ${
                      volunteer.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : volunteer.status === "Approved"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : volunteer.status === "Active"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {volunteer.status}
                  </Badge>
                  <div className="absolute top-3 left-3 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-gray-700">
                      {volunteer.rating ?? "-"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {volunteer.profession}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            volunteer.background === "Verified"
                              ? "border-green-200 text-green-700 bg-green-50"
                              : "border-orange-200 text-orange-700 bg-orange-50"
                          }`}
                        >
                          {volunteer.background || "Pending"}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                        {volunteer.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {volunteer.experience} experience • Age {volunteer.age ?? "-"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{volunteer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{volunteer.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Available: {volunteer.availability}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Motivation:
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {volunteer.motivation}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            +{volunteer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">
                        Preferred Programs:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.preferredPrograms.map((program, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-purple-50 text-purple-700"
                          >
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{volunteer.hoursCommitted}h/month</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{volunteer.references} refs</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        Applied {applied.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/5"
                          onClick={() => openEditDialog(volunteer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {volunteer.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-700 border-green-200 hover:bg-green-50"
                              onClick={() =>
                                updateVolunteerStatus(volunteer, "Approved")
                              }
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-700 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                updateVolunteerStatus(volunteer, "Rejected")
                              }
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(volunteer)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVolunteer ? "Edit Volunteer" : "Invite Volunteer"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    handleFormChange("name", event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleFormChange("email", event.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    handleFormChange("phone", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={form.location}
                  onChange={(event) =>
                    handleFormChange("location", event.target.value)
                  }
                  placeholder="Kigali, Rwanda"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input
                  type="number"
                  value={form.age}
                  onChange={(event) =>
                    handleFormChange("age", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Profession</label>
                <Input
                  value={form.profession}
                  onChange={(event) =>
                    handleFormChange("profession", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input
                  value={form.experience}
                  onChange={(event) =>
                    handleFormChange("experience", event.target.value)
                  }
                  placeholder="e.g. 3 years"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (one per line)</label>
              <Textarea
                value={form.skills}
                onChange={(event) =>
                  handleFormChange("skills", event.target.value)
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <Input
                  value={form.availability}
                  onChange={(event) =>
                    handleFormChange("availability", event.target.value)
                  }
                  placeholder="Weekends, Weekdays, ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hours / Month</label>
                <Input
                  type="number"
                  value={form.hoursCommitted}
                  onChange={(event) =>
                    handleFormChange("hoursCommitted", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">References</label>
                <Input
                  type="number"
                  value={form.references}
                  onChange={(event) =>
                    handleFormChange("references", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Preferred Programs (one per line)
              </label>
              <Textarea
                value={form.preferredPrograms}
                onChange={(event) =>
                  handleFormChange("preferredPrograms", event.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Languages (one per line)</label>
              <Textarea
                value={form.languages}
                onChange={(event) =>
                  handleFormChange("languages", event.target.value)
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivation</label>
              <Textarea
                value={form.motivation}
                onChange={(event) =>
                  handleFormChange("motivation", event.target.value)
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(event) =>
                    handleFormChange(
                      "status",
                      event.target.value as VolunteerStatus,
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) =>
                    handleFormChange("rating", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Status</label>
                <Input
                  value={form.background}
                  onChange={(event) =>
                    handleFormChange("background", event.target.value)
                  }
                  placeholder="Verified, Pending, ..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="ml-auto cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingVolunteer ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingVolunteer ? "Save Changes" : "Create Volunteer"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Volunteer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{volunteerToDelete?.name}"? This action cannot be undone and will permanently remove the volunteer from your system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {volunteerToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{volunteerToDelete.name}</p>
                    <p className="text-sm text-gray-500">{volunteerToDelete.profession}</p>
                    <p className="text-xs text-gray-400">{volunteerToDelete.location} • {volunteerToDelete.status}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Volunteer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
