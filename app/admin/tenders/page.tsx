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
  Search,
  FileText,
  DollarSign,
  Users,
  Clock,
  Eye,
  AlertCircle,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
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

type TenderStatus = "Open" | "Closed";
type TenderPriority = "High" | "Medium" | "Low";

interface TenderItem {
  id: string;
  title: string;
  description: string;
  reference: string;
  category: string;
  status: TenderStatus;
  featured: boolean;
  priority: TenderPriority;
  publishDate: string | null;
  deadline: string | null;
  budget: string;
  budgetMin: number | null;
  budgetMax: number | null;
  submissions: number;
  views: number;
  requirements: string[];
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

export default function TendersManagement() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "closing" | "featured">("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<TenderItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenderToDelete, setTenderToDelete] = useState<TenderItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [form, setForm] = useState({
    title: "",
    description: "",
    reference: "",
    category: "",
    status: "Open" as TenderStatus,
    featured: false,
    priority: "Medium" as TenderPriority,
    publishDate: "",
    deadline: "",
    budget: "",
    budgetMin: "",
    budgetMax: "",
    requirements: "",
    documentUrl: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const loadTenders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/tenders", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load tenders");
      }

      const data = await response.json();
      setTenders(data.tenders ?? []);
    } catch (error) {
      console.error("Failed to load tenders", error);
      toast({
        title: "Failed to load tenders",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTenders();
  }, [loadTenders]);

  const filteredTenders = useMemo(() => {
    return tenders.filter((tender) => {
      const matchesSearch =
        !search ||
        tender.title.toLowerCase().includes(search.toLowerCase()) ||
        tender.description.toLowerCase().includes(search.toLowerCase()) ||
        tender.reference.toLowerCase().includes(search.toLowerCase()) ||
        tender.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = (() => {
        if (filter === "all") return true;
        if (filter === "open") return tender.status === "Open";
        if (filter === "featured") return tender.featured;
        if (filter === "closing") {
          const days = getDaysLeft(tender.deadline);
          return tender.status === "Open" && days !== null && days >= 0 && days <= 7;
        }
        return tender.status === filter;
      })();

      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt || b.publishDate || '0').getTime() - new Date(a.createdAt || a.publishDate || '0').getTime());
  }, [tenders, search, filter]);

  const paginatedTenders = filteredTenders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const activeTenders = tenders.filter((t) => t.status === "Open").length;
    const totalSubmissions = tenders.reduce(
      (sum, t) => sum + (t.submissions ?? 0),
      0,
    );
    const totalBudgetMax = tenders.reduce(
      (sum, t) => sum + (t.budgetMax ?? 0),
      0,
    );
    const closingSoon = tenders.filter((t) => {
      const days = getDaysLeft(t.deadline);
      return t.status === "Open" && days !== null && days >= 0 && days <= 7;
    }).length;

    const formatMoney = (value: number) =>
      value > 0 ? `$${value.toLocaleString()}` : "-";

    return [
      {
        label: "Active Tenders",
        value: String(activeTenders),
        change: "",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Total Submissions",
        value: String(totalSubmissions),
        change: "",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Budget (Max)",
        value: formatMoney(totalBudgetMax),
        change: "",
        icon: DollarSign,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        label: "Closing Soon",
        value: String(closingSoon),
        change: "",
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];
  }, [tenders]);

  const openNewDialog = () => {
    setEditingTender(null);
    setForm({
      title: "",
      description: "",
      reference: "",
      category: "",
      status: "Open",
      featured: false,
      priority: "Medium",
      publishDate: "",
      deadline: "",
      budget: "",
      budgetMin: "",
      budgetMax: "",
      requirements: "",
      documentUrl: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (tender: TenderItem) => {
    setEditingTender(tender);
    setForm({
      title: tender.title,
      description: tender.description,
      reference: tender.reference,
      category: tender.category,
      status: tender.status,
      featured: tender.featured,
      priority: tender.priority,
      publishDate: tender.publishDate ?? "",
      deadline: tender.deadline ?? "",
      budget: tender.budget,
      budgetMin:
        tender.budgetMin !== null ? String(tender.budgetMin) : "",
      budgetMax:
        tender.budgetMax !== null ? String(tender.budgetMax) : "",
      requirements: tender.requirements.join("\n"),
      documentUrl: tender.documentUrl,
    });
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
        description: "Tender document has been uploaded successfully.",
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

      const endpoint = editingTender
        ? `/api/admin/tenders/${editingTender.id}`
        : "/api/admin/tenders";
      const method = editingTender ? "PUT" : "POST";

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
        throw new Error(data?.error || "Failed to save tender");
      }

      const data = await response.json();
      const saved: TenderItem = data.tender;

      setTenders((prev) => {
        if (editingTender) {
          return prev.map((t) => (t.id === saved.id ? saved : t));
        }
        return [saved, ...prev];
      });

      toast({
        title: editingTender ? "Tender updated" : "Tender created",
        description: editingTender
          ? "Your changes have been saved."
          : "The tender has been created.",
      });

      setIsDialogOpen(false);
      setEditingTender(null);

      await loadTenders();
    } catch (error: any) {
      console.error("Failed to save tender", error);
      toast({
        title: "Failed to save tender",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tenderToDelete) return;

    try {
      const response = await fetch(`/api/admin/tenders/${tenderToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete tender");
      }

      setTenders((prev) => prev.filter((t) => t.id !== tenderToDelete.id));

      toast({
        title: "Tender deleted",
        description: "The tender has been removed.",
      });

      setDeleteDialogOpen(false);
      setTenderToDelete(null);

      await loadTenders();
    } catch (error: any) {
      console.error("Failed to delete tender", error);
      toast({
        title: "Failed to delete tender",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (tender: TenderItem) => {
    setTenderToDelete(tender);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTenderToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Tender Management"
        description="Manage procurement opportunities and submissions"
        action={
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={openNewDialog}
            >
              <Plus className="w-4 h-4" />
              New Tender
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
                  placeholder="Search tenders..."
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
                  All Tenders
                </Button>
                <Button
                  variant={filter === "open" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("open")}
                >
                  Open
                </Button>
                <Button
                  variant={filter === "closing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("closing")}
                >
                  Closing Soon
                </Button>
                <Button
                  variant={filter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("featured")}
                >
                  Featured
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenders Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {isLoading && tenders.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-gray-500">Loading tenders...</p>
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No tenders found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search || filter !== "all" ? "Try adjusting your filters" : "Create your first tender to get started"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submissions</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedTenders.map((tender) => {
                      const daysLeft = getDaysLeft(tender.deadline);
                      return (
                        <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{tender.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {tender.featured && <span className="text-xs text-yellow-600">⭐ Featured</span>}
                              <span className={`text-xs ${tender.priority === "High" ? "text-red-500" : tender.priority === "Medium" ? "text-orange-500" : "text-gray-400"}`}>
                                {tender.priority} priority
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{tender.reference || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{tender.category || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{tender.budget || "—"}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600">{tender.deadline ? new Date(tender.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</p>
                            {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />{daysLeft}d left
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              tender.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {tender.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-3 h-3 text-gray-400" />
                              {tender.submissions}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {tender.documentUrl && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50" asChild title="Download document">
                                  <a href={tender.documentUrl} target="_blank" rel="noreferrer"><Download className="w-4 h-4" /></a>
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/5" title="Edit" onClick={() => openEditDialog(tender)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50" title="Delete" onClick={() => openDeleteDialog(tender)}>
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
                totalItems={filteredTenders.length}
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
              {editingTender ? "Edit Tender" : "New Tender"}
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
                <label className="text-sm font-medium">Reference</label>
                <Input
                  value={form.reference}
                  onChange={(event) =>
                    handleFormChange("reference", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={form.category}
                  onChange={(event) =>
                    handleFormChange("category", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Publish Date</label>
                <Input
                  type="date"
                  value={form.publishDate}
                  onChange={(event) =>
                    handleFormChange("publishDate", event.target.value)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget (text)</label>
                <Input
                  placeholder="$10,000 - $15,000"
                  value={form.budget}
                  onChange={(event) =>
                    handleFormChange("budget", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Min</label>
                <Input
                  type="number"
                  value={form.budgetMin}
                  onChange={(event) =>
                    handleFormChange("budgetMin", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Max</label>
                <Input
                  type="number"
                  value={form.budgetMax}
                  onChange={(event) =>
                    handleFormChange("budgetMax", event.target.value)
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
              <label className="text-sm font-medium">Tender Document</label>
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
                    {editingTender ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingTender ? "Save Changes" : "Create Tender"}
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
              Delete Tender
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{tenderToDelete?.title}"? This action cannot be undone and will permanently remove the tender from your procurement opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {tenderToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tenderToDelete.title}</p>
                    <p className="text-sm text-gray-500">{tenderToDelete.category}</p>
                    <p className="text-xs text-gray-400">{tenderToDelete.reference} • {tenderToDelete.budget}</p>
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
                  Delete Tender
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
