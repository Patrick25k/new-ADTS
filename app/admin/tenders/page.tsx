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
  Filter,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Share2,
  Eye,
  AlertCircle,
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

  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "closing" | "featured">("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<TenderItem | null>(null);
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
        return true;
      })();

      return matchesSearch && matchesFilter;
    });
  }, [tenders, search, filter]);

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

      const response = await fetch("/api/admin/upload-image", {
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
    }
  };

  const handleDelete = async (tender: TenderItem) => {
    if (!confirm(`Delete tender "${tender.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tenders/${tender.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete tender");
      }

      setTenders((prev) => prev.filter((t) => t.id !== tender.id));

      toast({
        title: "Tender deleted",
        description: "The tender has been removed.",
      });

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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Tender Management"
        description="Manage procurement opportunities and submissions"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
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

        {/* Tenders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading && tenders.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              Loading tenders...
            </p>
          )}
          {!isLoading && filteredTenders.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              No tenders found. Try creating a new one.
            </p>
          )}
          {filteredTenders.map((tender) => {
            const daysLeft = getDaysLeft(tender.deadline);

            return (
              <Card
                key={tender.id}
                className="bg-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                    <FileText className="w-16 h-16 text-green-500" />
                  </div>
                  {tender.featured && (
                    <Badge className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ⭐ Featured
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`absolute top-3 right-3 ${
                      tender.status === "Open"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {tender.status}
                  </Badge>
                  {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                    <Badge className="absolute bottom-3 left-3 bg-red-100 text-red-800 border border-red-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysLeft} days left
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {tender.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            tender.priority === "High"
                              ? "border-red-200 text-red-700"
                              : tender.priority === "Medium"
                              ? "border-orange-200 text-orange-700"
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {tender.priority} Priority
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {tender.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {tender.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-mono text-gray-900">
                          {tender.reference}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-semibold text-gray-900">
                          {tender.budget}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="text-gray-900">
                          {tender.deadline
                            ? new Date(tender.deadline).toLocaleDateString()
                            : "TBA"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{tender.submissions} submissions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{tender.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {tender.publishDate
                            ? `Published ${new Date(
                                tender.publishDate,
                              ).toLocaleDateString()}`
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">
                        Requirements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tender.requirements.slice(0, 2).map((req, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {req}
                          </Badge>
                        ))}
                        {tender.requirements.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            +{tender.requirements.length - 2} more
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
                        {tender.documentUrl && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="text-gray-700 border-gray-200 hover:bg-gray-50"
                          >
                            <a
                              href={tender.documentUrl}
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
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(tender)}
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
              <Button type="submit" className="ml-auto">
                {editingTender ? "Save Changes" : "Create Tender"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
