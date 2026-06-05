"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Clock,
  Eye,
  DollarSign,
  AlertTriangle,
  Inbox,
  Download,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
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
    }).sort((a, b) => new Date(b.createdAt || b.postDate || '0').getTime() - new Date(a.createdAt || a.postDate || '0').getTime());
  }, [jobs, search, filter]);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/admin/jobs/${jobToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete job");
      }

      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));

      toast({
        title: "Job deleted",
        description: "The job has been removed.",
      });

      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete job", error);
      toast({
        title: "Failed to delete job",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (job: JobItem) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
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

        {/* Jobs Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {isLoading && jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No jobs found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search || filter !== "all" ? "Try adjusting your filters" : "Create your first job posting to get started"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicants</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedJobs.map((job) => {
                      const daysLeft = getDaysLeft(job.deadline);
                      return (
                        <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{job.title}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {job.featured && <span className="text-xs text-yellow-600">⭐ Featured</span>}
                                  <span className={`text-xs ${job.priority === "High" ? "text-red-500" : job.priority === "Medium" ? "text-orange-500" : "text-gray-400"}`}>
                                    {job.priority} priority
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{job.department || "—"}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              {job.location || "—"}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">{job.type}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600">{job.deadline ? new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</p>
                            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />{daysLeft}d left
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-3 h-3 text-gray-400" />
                              {job.applicants}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {job.documentUrl && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50" asChild title="Download document">
                                  <a href={job.documentUrl} target="_blank" rel="noreferrer"><Download className="w-4 h-4" /></a>
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/5" title="Edit" onClick={() => openEditDialog(job)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50" title="Delete" onClick={() => openDeleteDialog(job)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <TablePagination
                currentPage={currentPage}
                totalItems={filteredJobs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Job Posting
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone and will permanently remove the job posting from your careers page.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {jobToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{jobToDelete.title}</p>
                    <p className="text-sm text-gray-500">{jobToDelete.department}</p>
                    <p className="text-xs text-gray-400">{jobToDelete.location} • {jobToDelete.type}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={isSubmitting || isUploadingDocument}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isUploadingDocument}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
