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
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  Share2,
  Eye,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type JobStatus = "Open" | "Closed";
type JobPriority = "High" | "Medium" | "Low";

interface JobItem {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  education: string;
  salary: string;
  postDate: string | null;
  deadline: string | null;
  applicants: number;
  views: number;
  status: JobStatus;
  priority: JobPriority;
  featured: boolean;
  requirements: string[];
  benefits: string[];
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

function getDaysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function JobsManagement() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "featured" | "urgent">("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    education: "",
    salary: "",
    postDate: "",
    deadline: "",
    applicants: "",
    views: "",
    status: "Open" as JobStatus,
    priority: "Medium" as JobPriority,
    featured: false,
    requirements: "",
    benefits: "",
    documentUrl: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/jobs", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load jobs");
      }

      const data = await response.json();
      setJobs(data.jobs ?? []);
    } catch (error) {
      console.error("Failed to load jobs", error);
      toast({
        title: "Failed to load jobs",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = (() => {
        if (filter === "all") return true;
        if (filter === "open") return job.status === "Open";
        if (filter === "featured") return job.featured;
        if (filter === "urgent") {
          const days = getDaysLeft(job.deadline);
          return job.status === "Open" && days !== null && days >= 0 && days <= 7;
        }
        return job.status === filter;
      })();

      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt || b.postDate || '0').getTime() - new Date(a.createdAt || a.postDate || '0').getTime()).slice(0, 8)
  }, [jobs, search, filter]);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === "Open").length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicants ?? 0),
      0,
    );
    const positionsFilled = jobs.filter((j) => j.status === "Closed").length;
    const closingSoon = jobs.filter((j) => {
      const days = getDaysLeft(j.deadline);
      return j.status === "Open" && days !== null && days >= 0 && days <= 7;
    }).length;

    return [
      {
        label: "Active Jobs",
        value: String(activeJobs),
        change: "",
        icon: Briefcase,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Total Applicants",
        value: String(totalApplicants),
        change: "",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Positions Filled",
        value: String(positionsFilled),
        change: "",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        label: "Closing Soon",
        value: String(closingSoon),
        change: "",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];
  }, [jobs]);

  const openNewDialog = () => {
    setEditingJob(null);
    setForm({
      title: "",
      description: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      education: "",
      salary: "",
      postDate: "",
      deadline: "",
      applicants: "",
      views: "",
      status: "Open",
      priority: "Medium",
      featured: false,
      requirements: "",
      benefits: "",
      documentUrl: "",
    });
    setDocumentFile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (job: JobItem) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      education: job.education,
      salary: job.salary,
      postDate: job.postDate ?? "",
      deadline: job.deadline ?? "",
      applicants: job.applicants ? String(job.applicants) : "",
      views: job.views ? String(job.views) : "",
      status: job.status,
      priority: job.priority,
      featured: job.featured,
      requirements: job.requirements.join("\n"),
      benefits: job.benefits.join("\n"),
      documentUrl: job.documentUrl,
    });
    setDocumentFile(null);
    setIsDialogOpen(true);
  };

  const handleFormChange = (
    field: keyof typeof form,
    value: string | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setDocumentFile(null);
      return;
    }

    try {
      setIsUploadingDocument(true);
      setDocumentFile(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const response = await fetch("/api/admin/upload-document", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to upload document");
      }

      const data = await response.json();
      const url = data.url as string | undefined;

      if (!url) {
        throw new Error("Upload succeeded but no URL was returned");
      }

      setForm((prev) => ({
        ...prev,
        documentUrl: url,
      }));

      toast({
        title: "Document uploaded",
        description: "Job document has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Failed to upload document", error);
      toast({
        title: "Failed to upload document",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
      setDocumentFile(null);
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isUploadingDocument) {
        toast({
          title: "Please wait",
          description: "Document is still uploading. Please wait for it to finish.",
        });
        return;
      }

      setIsSubmitting(true);

      const payload = { ...form };

      const endpoint = editingJob
        ? `/api/admin/jobs/${editingJob.id}`
        : "/api/admin/jobs";
      const method = editingJob ? "PUT" : "POST";

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
        throw new Error(data?.error || "Failed to save job");
      }

      const data = await response.json();
      const saved: JobItem = data.job;

      setJobs((prev) => {
        if (editingJob) {
          return prev.map((j) => (j.id === saved.id ? saved : j));
        }
        return [saved, ...prev];
      });

      toast({
        title: editingJob ? "Job updated" : "Job created",
        description: editingJob
          ? "Your changes have been saved."
          : "The job has been created.",
      });

      setIsDialogOpen(false);
      setEditingJob(null);

      await loadJobs();
    } catch (error: any) {
      console.error("Failed to save job", error);
      toast({
        title: "Failed to save job",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (job: JobItem) => {
    if (!confirm(`Delete job "${job.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete job");
      }

      setJobs((prev) => prev.filter((j) => j.id !== job.id));

      toast({
        title: "Job deleted",
        description: "The job has been removed.",
      });

      await loadJobs();
    } catch (error: any) {
      console.error("Failed to delete job", error);
      toast({
        title: "Failed to delete job",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Job Management"
        description="Manage career opportunities and recruitment"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Plus className="w-4 h-4" />
              Post Job
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
                  placeholder="Search jobs..."
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
                  All Jobs
                </Button>
                <Button
                  variant={filter === "open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("open")}
                >
                  Open
                </Button>
                <Button
                  variant={filter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("featured")}
                >
                  Featured
                </Button>
                <Button
                  variant={filter === "urgent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("urgent")}
                >
                  Urgent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        {isLoading && jobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : !isLoading && filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Briefcase className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No jobs found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new job posting to get started.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs (most recent)
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysLeft(job.deadline);

            return (
              <Card
                key={job.id}
                className="bg-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-purple-500" />
                  </div>
                  {job.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`absolute top-3 right-3 ${
                      job.status === "Open"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {job.status}
                  </Badge>
                  {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                    <Badge className="absolute bottom-3 left-3 bg-red-100 text-red-800 border border-red-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysLeft} days left
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {job.department}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs flex-shrink-0 ${
                            job.priority === "High"
                              ? "border-red-200 text-red-700"
                              : job.priority === "Medium"
                              ? "border-orange-200 text-orange-700"
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {job.priority}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                        <Badge variant="secondary" className="text-xs ml-auto flex-shrink-0">
                          {job.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {job.deadline
                            ? new Date(job.deadline).toLocaleDateString()
                            : "TBA"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{job.applicants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{job.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">
                        Requirements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {req.length > 15 ? req.substring(0, 15) + "..." : req}
                          </Badge>
                        ))}
                        {job.requirements.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            +{job.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            {benefit.length > 15 ? benefit.substring(0, 15) + "..." : benefit}
                          </Badge>
                        ))}
                        {job.benefits.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            +{job.benefits.length - 2} more
                          </Badge>
                        )}
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
                        {job.documentUrl && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-gray-700 border-gray-200 hover:bg-gray-50"
                          >
                            <a
                              href={job.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Job Details
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          onClick={() => openEditDialog(job)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
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
                          onClick={() => handleDelete(job)}
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
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Job" : "Post Job"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input
                value={form.title}
                onChange={(event) =>
                  handleFormChange("title", event.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  handleFormChange("description", event.target.value)
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={form.department}
                  onChange={(event) =>
                    handleFormChange("department", event.target.value)
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
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input
                  value={form.type}
                  onChange={(event) =>
                    handleFormChange("type", event.target.value)
                  }
                  placeholder="Full-time, Part-time, Contract"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input
                  value={form.experience}
                  onChange={(event) =>
                    handleFormChange("experience", event.target.value)
                  }
                  placeholder="e.g. 3-5 years"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Education</label>
                <Input
                  value={form.education}
                  onChange={(event) =>
                    handleFormChange("education", event.target.value)
                  }
                  placeholder="e.g. Bachelor's Degree"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Salary (text)</label>
                <Input
                  value={form.salary}
                  onChange={(event) =>
                    handleFormChange("salary", event.target.value)
                  }
                  placeholder="$800 - $1,200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Date</label>
                <Input
                  type="date"
                  value={form.postDate}
                  onChange={(event) =>
                    handleFormChange("postDate", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    handleFormChange("deadline", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Applicants (optional)</label>
                <Input
                  type="number"
                  value={form.applicants}
                  onChange={(event) =>
                    handleFormChange("applicants", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Views (optional)</label>
                <Input
                  type="number"
                  value={form.views}
                  onChange={(event) =>
                    handleFormChange("views", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Requirements (one per line)
              </label>
              <Textarea
                value={form.requirements}
                onChange={(event) =>
                  handleFormChange("requirements", event.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Benefits (one per line)
              </label>
              <Textarea
                value={form.benefits}
                onChange={(event) =>
                  handleFormChange("benefits", event.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Document</label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleDocumentFileChange}
                />
                <Input
                  value={form.documentUrl}
                  onChange={(event) =>
                    handleFormChange("documentUrl", event.target.value)
                  }
                  placeholder="https://...pdf"
                />
                {form.documentUrl && (
                  <p className="text-xs text-gray-500 break-all">
                    Current document URL: {form.documentUrl}
                  </p>
                )}
                {isUploadingDocument && (
                  <p className="text-xs text-blue-600">Uploading document...</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
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
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Button
                  type="button"
                  variant={form.status === "Open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("status", "Open")}
                >
                  Open
                </Button>
                <Button
                  type="button"
                  variant={form.status === "Closed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("status", "Closed")}
                >
                  Closed
                </Button>
                <Button
                  type="button"
                  variant={form.priority === "High" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("priority", "High")}
                >
                  High Priority
                </Button>
                <Button
                  type="button"
                  variant={form.priority === "Medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("priority", "Medium")}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  variant={form.priority === "Low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFormChange("priority", "Low")}
                >
                  Low
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="ml-auto cursor-pointer"
                disabled={isSubmitting || isUploadingDocument}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingJob ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingJob ? "Save Changes" : "Create Job"}
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
