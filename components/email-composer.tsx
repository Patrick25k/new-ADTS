import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Loader2, Mail, Users, Reply, X, Paperclip } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EmailComposerProps {
  isOpen: boolean
  onClose: () => void
  mode: "compose" | "reply" | "bulk"
  recipients?: string[]
  defaultSubject?: string
  defaultMessage?: string
  replyToMessage?: string
  replyToName?: string
  replyToEmail?: string
}

interface EmailData {
  to: string[]
  subject: string
  message: string
}

export function EmailComposer({
  isOpen,
  onClose,
  mode,
  recipients = [],
  defaultSubject = "",
  defaultMessage = "",
  replyToMessage = "",
  replyToName = "",
  replyToEmail = "",
}: EmailComposerProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    to: recipients,
    subject: defaultSubject,
    message: defaultMessage,
  })
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState("compose")
  const { toast } = useToast()

  useEffect(() => {
    setEmailData({
      to: recipients,
      subject: defaultSubject,
      message: defaultMessage,
    })
  }, [recipients, defaultSubject, defaultMessage])

  const handleSend = async () => {
    if (emailData.to.length === 0) {
      toast({ title: "Error", description: "Please add at least one recipient", variant: "destructive" })
      return
    }
    if (!emailData.subject.trim()) {
      toast({ title: "Error", description: "Please enter a subject", variant: "destructive" })
      return
    }
    if (!emailData.message.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" })
      return
    }

    setIsSending(true)

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          recipientName: mode === "reply" ? (replyToName || replyToEmail) : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      toast({
        title: "Email sent!",
        description: `Successfully sent to ${data.sent} recipient${data.sent !== 1 ? "s" : ""}`,
      })

      setEmailData({ to: recipients, subject: defaultSubject, message: defaultMessage })
      onClose()
    } catch (error) {
      console.error("Email send error:", error)
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const addRecipient = (email: string) => {
    const trimmed = email.trim()
    if (trimmed && !emailData.to.includes(trimmed)) {
      setEmailData((prev) => ({ ...prev, to: [...prev.to, trimmed] }))
    }
  }

  const removeRecipient = (email: string) => {
    setEmailData((prev) => ({ ...prev, to: prev.to.filter((e) => e !== email) }))
  }

  const getModeTitle = () => {
    switch (mode) {
      case "reply": return `Reply to ${replyToName || replyToEmail}`
      case "bulk": return `Email ${emailData.to.length} Subscriber${emailData.to.length !== 1 ? "s" : ""}`
      default: return "Compose Email"
    }
  }

  const getModeIcon = () => {
    switch (mode) {
      case "reply": return <Reply className="w-4 h-4" />
      case "bulk": return <Users className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getModeIcon()}
            {getModeTitle()}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            {(mode === "reply" || replyToMessage) && (
              <TabsTrigger value="original">Original Message</TabsTrigger>
            )}
            <TabsTrigger value="recipients">Recipients ({emailData.to.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipients</label>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-3 border rounded-md bg-gray-50">
                  {emailData.to.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1 pr-1">
                      {email}
                      <button
                        className="w-4 h-4 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeRecipient(email) }}
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {mode === "compose" && (
                    <Input
                      placeholder="Type email and press Enter..."
                      className="border-0 bg-transparent p-0 h-6 text-sm focus-visible:ring-0 min-w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          addRecipient(target.value)
                          target.value = ""
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value) {
                          addRecipient(e.target.value)
                          e.target.value = ""
                        }
                      }}
                    />
                  )}
                  {emailData.to.length === 0 && mode !== "compose" && (
                    <span className="text-sm text-gray-500">No recipients</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={emailData.subject}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject..."
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message here..."
                  className="mt-2 min-h-[200px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" disabled>
                  <Paperclip className="w-4 h-4" />
                  Attach Files
                </Button>
                <span className="text-sm text-muted-foreground">Attachments coming soon</span>
              </div>
            </div>
          </TabsContent>

          {(mode === "reply" || replyToMessage) && (
            <TabsContent value="original">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Original Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div><span className="font-medium">From:</span> {replyToName} ({replyToEmail})</div>
                  <div><span className="font-medium">Subject:</span> {defaultSubject}</div>
                  <div>
                    <span className="font-medium">Message:</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">{replyToMessage}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="recipients">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {emailData.to.length === 0 ? (
                    <p className="text-muted-foreground">No recipients added yet</p>
                  ) : (
                    emailData.to.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{email}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeRecipient(email)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend} disabled={isSending} className="gap-2">
            {isSending ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
            ) : (
              <><Mail className="w-4 h-4" />Send Email</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
