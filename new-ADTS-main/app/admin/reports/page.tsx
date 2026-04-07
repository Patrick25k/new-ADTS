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
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
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

type ReportStatus = "Published" | "Draft";
type ReportPriority = "High" | "Medium" | "Low";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: ReportStatus;
  priority: ReportPriority;
  author: string;
  language: string;
  format: string;
  year: string;
  pages: number;
  size: string;
  publishDate: string | null;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReportsManagement() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "published" | "featured" | "recent"
  >("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ReportItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    status: "Draft" as ReportStatus,
    priority: "Medium" as ReportPriority,
    author: "",
    language: "",
    format: "PDF",
    year: "",
    pages: "",
    size: "",
    documentUrl: "",
    publishDate: null as string | null,
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/reports", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();
      setReports(data.reports ?? []);
    } catch (error) {
      console.error("Failed to load reports", error);
      toast({
        title: "Failed to load reports",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        !search ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.category.toLowerCase().includes(search.toLowerCase()) ||
        report.type.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = (() => {
        if (filter === "all") return true;
        if (filter === "published") return report.status === "Published";
        if (filter === "featured") return report.priority === "High";
        if (filter === "recent") {
          if (!report.publishDate) return false;
          const publish = new Date(report.publishDate);
          if (Number.isNaN(publish.getTime())) return false;
          const now = new Date();
          const diffMs = now.getTime() - publish.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          return diffDays <= 90;
        }
        return true;
      })();

      return matchesSearch && matchesFilter;
    });
  }, [reports, search, filter]);

  const stats = useMemo(() => {
    const totalReports = reports.length;
    const published = reports.filter((r) => r.status === "Published").length;
    const drafts = reports.filter((r) => r.status === "Draft").length;
    const highPriority = reports.filter((r) => r.priority === "High").length;

    return [
      {
        label: "Total Reports",
        value: String(totalReports),
        change: "",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Published",
        value: String(published),
        change: "",
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Drafts",
        value: String(drafts),
        change: "",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      {
        label: "High Priority",
        value: String(highPriority),
        change: "",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ];
  }, [reports]);

  const openNewDialog = () => {
    setEditingReport(null);
    setForm({
      title: "",
      description: "",
      type: "",
      category: "",
      status: "Draft",
      priority: "Medium",
      author: "",
      language: "",
      format: "PDF",
      year: "",
      pages: "",
      size: "",
      documentUrl: "",
      publishDate: null,
    });
    setDocumentFile(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (report: ReportItem) => {
    setEditingReport(report);
    setForm({
      title: report.title,
      description: report.description,
      type: report.type,
      category: report.category,
      status: report.status,
      priority: report.priority,
      author: report.author,
      language: report.language,
      format: report.format,
      year: report.year,
      pages: report.pages ? String(report.pages) : "",
      size: report.size,
      documentUrl: report.documentUrl,
      publishDate: report.publishDate,
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
        description: "Report document has been uploaded successfully.",
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
          description:
            "Document is still uploading. Please wait for it to finish.",
        });
        return;
      }

      setIsSubmitting(true);

      const payload = { 
        ...form,
        // Auto-set publish date when status is "Published"
        publishDate: form.status === "Published" && !editingReport ? new Date().toISOString().split('T')[0] : form.publishDate
      };

      const endpoint = editingReport
        ? `/api/admin/reports/${editingReport.id}`
        : "/api/admin/reports";
      const method = editingReport ? "PUT" : "POST";

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
        throw new Error(data?.error || "Failed to save report");
      }

      const data = await response.json();
      const saved: ReportItem = data.report;

      setReports((prev) => {
        if (editingReport) {
          return prev.map((r) => (r.id === saved.id ? saved : r));
        }
        return [saved, ...prev];
      });

      toast({
        title: editingReport ? "Report updated" : "Report created",
        description: editingReport
          ? "Your changes have been saved."
          : "The report has been created.",
      });

      setIsDialogOpen(false);
      setEditingReport(null);

      await loadReports();
    } catch (error: any) {
      console.error("Failed to save report", error);
      toast({
        title: "Failed to save report",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      const response = await fetch(`/api/admin/reports/${reportToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete report");
      }

      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));

      toast({
        title: "Report deleted",
        description: "The report has been removed.",
      });

      setDeleteDialogOpen(false);
      setReportToDelete(null);

      await loadReports();
    } catch (error: any) {
      console.error("Failed to delete report", error);
      toast({
        title: "Failed to delete report",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (report: ReportItem) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Reports Management"
        description="Manage organizational reports and publications"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Plus className="w-4 h-4" />
              Upload Report
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
                  placeholder="Search reports..."
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
                  All Reports
                </Button>
                <Button
                  variant={filter === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("published")}
                >
                  Published
                </Button>
                <Button
                  variant={filter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("featured")}
                >
                  High Priority
                </Button>
                <Button
                  variant={filter === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("recent")}
                >
                  Recent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        {isLoading && reports.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : !isLoading && filteredReports.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No reports found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or create a new report to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.slice(0, 4).map((report) => (
            <Card
              key={report.id}
              className="bg-white hover:shadow-lg transition-all duration-200 group"
            >
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-indigo-500" />
                </div>
                {report.priority === "High" && (
                  <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ High Priority
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={`absolute top-3 right-3 ${
                    report.status === "Published"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-orange-100 text-orange-700 border border-orange-200"
                  }`}
                >
                  {report.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="absolute bottom-3 left-3 text-xs border-blue-200 text-blue-700 bg-blue-50"
                >
                  {report.type || "Report"}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {report.category}
                      </Badge>
                      {report.year && (
                        <span className="text-xs text-green-600 font-medium">
                          {report.year}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Published:{" "}
                        {report.publishDate
                          ? new Date(report.publishDate).toLocaleDateString()
                          : "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>By: {report.author || "ADTS Rwanda"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>
                          {report.pages} pages • {report.size || "--"}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {report.format || "PDF"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {report.documentUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/5"
                        >
                          <a
                            href={report.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </a>
                        </Button>
                      )}
                      {report.documentUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                          <a
                            href={report.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => openEditDialog(report)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(report)}
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
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? "Edit Report" : "Upload Report"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
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
                <label className="text-sm font-medium">Type</label>
                <Input
                  value={form.type}
                  onChange={(event) =>
                    handleFormChange("type", event.target.value)
                  }
                  placeholder="Annual Report, Program Report, ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={form.category}
                  onChange={(event) =>
                    handleFormChange("category", event.target.value)
                  }
                  placeholder="Financial, Impact Assessment, ..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={form.author}
                  onChange={(event) =>
                    handleFormChange("author", event.target.value)
                  }
                  placeholder="e.g. Programs Department"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Input
                  value={form.language}
                  onChange={(event) =>
                    handleFormChange("language", event.target.value)
                  }
                  placeholder="English, Kinyarwanda, ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Input
                  value={form.format}
                  onChange={(event) =>
                    handleFormChange("format", event.target.value)
                  }
                  placeholder="PDF, DOCX, ..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={form.year}
                  onChange={(event) =>
                    handleFormChange("year", event.target.value)
                  }
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pages</label>
                <Input
                  type="number"
                  value={form.pages}
                  onChange={(event) =>
                    handleFormChange("pages", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Size (text)</label>
                <Input
                  value={form.size}
                  onChange={(event) =>
                    handleFormChange("size", event.target.value)
                  }
                  placeholder="e.g. 2.5 MB"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Document</label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,image/*"
                  onChange={handleDocumentFileChange}
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
                    id="published"
                    type="checkbox"
                    checked={form.status === "Published"}
                    onChange={(event) =>
                      handleFormChange(
                        "status",
                        event.target.checked ? "Published" : "Draft",
                      )
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="published" className="text-sm">
                    Published
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="high-priority"
                    type="checkbox"
                    checked={form.priority === "High"}
                    onChange={(event) =>
                      handleFormChange(
                        "priority",
                        event.target.checked ? "High" : "Medium",
                      )
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="high-priority" className="text-sm">
                    High priority
                  </label>
                </div>
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
                    {editingReport ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingReport ? "Save Changes" : "Create Report"}
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
              Delete Report
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{reportToDelete?.title}"? This action cannot be undone and will permanently remove the report from your publications.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {reportToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{reportToDelete.title}</p>
                    <p className="text-sm text-gray-500">{reportToDelete.category}</p>
                    <p className="text-xs text-gray-400">{reportToDelete.format} • {reportToDelete.pages} pages • {reportToDelete.year}</p>
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
                  Delete Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
