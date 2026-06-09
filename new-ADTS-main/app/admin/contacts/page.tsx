"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmailComposer } from "@/components/email-composer";
import {
  Eye,
  Trash2,
  Mail,
  Search,
  Filter,
  Calendar,
  Phone,
  MessageSquare,
  Clock,
  Share2,
  Reply,
  User,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
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

        {/* Contacts Grid */}
        {isLoading && contacts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          </div>
        ) : !isLoading && filteredContacts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No messages found.</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or check back later for new messages.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => {
            const created = new Date(contact.createdAt);

            return (
              <Card
                key={contact.id}
                className="bg-white hover:shadow-lg transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-lg flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-blue-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`absolute top-3 right-3 ${
                      contact.status === "Unread"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : contact.status === "Read"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {contact.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`absolute top-3 left-3 text-xs ${
                      contact.priority === "High"
                        ? "border-red-200 text-red-700 bg-red-50"
                        : "border-orange-200 text-orange-700 bg-orange-50"
                    }`}
                  >
                    {contact.priority} Priority
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700"
                        >
                          {contact.category || "General"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {created.toLocaleDateString()} at {created.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {contact.subject}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{contact.phone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{contact.organization || "Individual"}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {contact.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 hover:bg-primary/5"
                          onClick={() => {
                            setSelectedContact(contact);
                            if (contact.status === "Unread") {
                              updateContactStatus(contact, { status: "Read" });
                            }
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setEmailMode("reply");
                            setSelectedContactForReply(contact);
                            setIsEmailComposerOpen(true);
                          }}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
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
                          onClick={() => openDeleteDialog(contact)}
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
