"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmailComposer } from "@/components/email-composer";
import {
  Eye,
  Trash2,
  Mail,
  Search,
  Phone,
  MessageSquare,
  Clock,
  Reply,
  User,
  AlertCircle,
  AlertTriangle,
  Inbox,
  Edit,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ContactStatus = "Unread" | "Read" | "Replied";
type ContactPriority = "High" | "Medium" | "Low";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  location: string;
  organization: string;
  status: ContactStatus;
  priority: ContactPriority;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsManagement() {
  const { toast } = useToast();

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "unread" | "high" | "today"
  >("all");

  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null,
  );

  // Email composer states
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<"compose" | "reply">("compose");
  const [selectedContactForReply, setSelectedContactForReply] = useState<ContactItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<ContactItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/contacts", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load contacts");
      }

      const data = await response.json();
      setContacts(data.contacts ?? []);
    } catch (error) {
      console.error("Failed to load contacts", error);
      toast({
        title: "Failed to load contacts",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filteredContacts = useMemo(() => {
    const now = new Date();

    return contacts.filter((contact) => {
      const matchesSearch =
        !search ||
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase()) ||
        contact.subject.toLowerCase().includes(search.toLowerCase()) ||
        contact.message.toLowerCase().includes(search.toLowerCase()) ||
        contact.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = (() => {
        if (filter === "all") return true;
        if (filter === "unread") return contact.status === "Unread";
        if (filter === "high") return contact.priority === "High";
        if (filter === "today") {
          const created = new Date(contact.createdAt);
          if (Number.isNaN(created.getTime())) return false;
          return (
            created.getFullYear() === now.getFullYear() &&
            created.getMonth() === now.getMonth() &&
            created.getDate() === now.getDate()
          );
        }
        return true;
      })();

      return matchesSearch && matchesFilter;
    });
  }, [contacts, search, filter]);

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const total = contacts.length;
    const unread = contacts.filter((c) => c.status === "Unread").length;
    const replied = contacts.filter((c) => c.status === "Replied").length;

    return [
      {
        label: "Total Messages",
        value: String(total),
        change: "",
        icon: MessageSquare,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Unread",
        value: String(unread),
        change: "",
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        label: "Replied",
        value: String(replied),
        change: "",
        icon: Reply,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Avg Response",
        value: "-",
        change: "",
        icon: Clock,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ];
  }, [contacts]);

  const updateContactStatus = async (
    contact: ContactItem,
    updates: Partial<Pick<ContactItem, "status" | "priority">>,
  ) => {
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: contact.id, ...updates }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to update contact");
      }

      const data = await response.json();
      const updated: ContactItem = data.contact;

      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
    } catch (error: any) {
      console.error("Failed to update contact", error);
      toast({
        title: "Failed to update contact",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    try {
      const url = `/api/admin/contacts?id=${encodeURIComponent(contactToDelete.id)}`;
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete contact");
      }

      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));

      toast({
        title: "Message deleted",
        description: "The contact message has been removed.",
      });

      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete contact", error);
      toast({
        title: "Failed to delete contact",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (contact: ContactItem) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="Contact Management"
        description="Manage contact form submissions and inquiries"
        action={
          <div className="flex items-center gap-3">
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => {
                setEmailMode("compose");
                setSelectedContactForReply(null);
                setIsEmailComposerOpen(true);
              }}
            >
              <Mail className="w-4 h-4" />
              Compose
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
                      {stat.change} this week
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
                  placeholder="Search contacts..."
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
                  variant={filter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("high")}
                >
                  High Priority
                </Button>
                <Button
                  variant={filter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("today")}
                >
                  Today
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {isLoading && contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No messages found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search || filter !== "all"
                  ? "Try adjusting your filters"
                  : "Contact messages from the website will appear here"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedContacts.map((contact) => {
                      const created = new Date(contact.createdAt);
                      return (
                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{contact.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-900 font-medium truncate max-w-[200px]">{contact.subject}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{contact.message}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              contact.status === "Unread"
                                ? "bg-red-100 text-red-700"
                                : contact.status === "Read"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              contact.priority === "High"
                                ? "bg-red-50 text-red-600"
                                : contact.priority === "Medium"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {contact.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {created.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/5"
                                title="Read message"
                                onClick={() => {
                                  setSelectedContact(contact);
                                  if (contact.status === "Unread") {
                                    updateContactStatus(contact, { status: "Read" });
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                title="Reply"
                                onClick={() => {
                                  setEmailMode("reply");
                                  setSelectedContactForReply(contact);
                                  setIsEmailComposerOpen(true);
                                }}
                              >
                                <Reply className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete"
                                onClick={() => openDeleteDialog(contact)}
                              >
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
                totalItems={filteredContacts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <Dialog
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContact ? selectedContact.subject : "Message"}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">From: </span>
                  {selectedContact.name} ({selectedContact.email})
                </p>
                {selectedContact.phone && (
                  <p>
                    <span className="font-medium">Phone: </span>
                    {selectedContact.phone}
                  </p>
                )}
                {selectedContact.organization && (
                  <p>
                    <span className="font-medium">Organization: </span>
                    {selectedContact.organization}
                  </p>
                )}
              </div>
              <div className="border rounded-md p-3 bg-gray-50 text-sm whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Contact Message
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the message from "{contactToDelete?.name}"? This action cannot be undone and will permanently remove the contact message.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {contactToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{contactToDelete.name}</p>
                    <p className="text-sm text-gray-500">{contactToDelete.email}</p>
                    <p className="text-xs text-gray-400">{contactToDelete.subject}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Composer */}
      <EmailComposer
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        mode={emailMode}
        recipients={emailMode === "reply" && selectedContactForReply ? [selectedContactForReply.email] : []}
        defaultSubject={emailMode === "reply" && selectedContactForReply ? `Re: ${selectedContactForReply.subject}` : ""}
        defaultMessage={emailMode === "reply" && selectedContactForReply ? `\n\n---\nOriginal Message:\n${selectedContactForReply.message}` : ""}
        replyToMessage={selectedContactForReply?.message || ""}
        replyToName={selectedContactForReply?.name || ""}
        replyToEmail={selectedContactForReply?.email || ""}
      />
    </div>
  );
}
