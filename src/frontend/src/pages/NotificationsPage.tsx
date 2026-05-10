import { ComposePanel } from "@/components/notifications/ComposePanel";
import { SendHistoryPanel } from "@/components/notifications/SendHistoryPanel";
import { TemplateEditor } from "@/components/notifications/TemplateEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { Bell, History, MessageSquare, Send, Settings2 } from "lucide-react";

export default function NotificationsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const role = currentUser?.role ?? "Admin";
  const username = currentUser?.fullName ?? "admin";
  const isAdmin = role === "Admin";

  return (
    <div
      className="flex flex-col h-full min-h-0"
      data-ocid="notifications.page"
    >
      {/* Page Header */}
      <div className="bg-card border-b px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            Notifications
          </h1>
          <p className="text-xs text-muted-foreground">
            Send messages via WhatsApp, In-App, or both
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto text-xs capitalize">
          {role}
        </Badge>
      </div>

      {/* Main content */}
      <Tabs
        defaultValue="send"
        className="flex flex-col flex-1 min-h-0 px-4 py-4"
      >
        <TabsList className="shrink-0 w-full justify-start bg-muted/40 mb-4 h-9">
          <TabsTrigger
            value="send"
            className="text-xs gap-1.5"
            data-ocid="notifications.send_tab"
          >
            <Send className="h-3.5 w-3.5" />
            Send Message
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-xs gap-1.5"
            data-ocid="notifications.history_tab"
          >
            <History className="h-3.5 w-3.5" />
            History
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger
              value="templates"
              className="text-xs gap-1.5"
              data-ocid="notifications.templates_tab"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Templates
            </TabsTrigger>
          )}
        </TabsList>

        {/* Send tab — two-panel layout */}
        <TabsContent value="send" className="flex-1 min-h-0 mt-0">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full"
            style={{ minHeight: 0 }}
          >
            <div className="overflow-y-auto">
              <ComposePanel currentUser={username} />
            </div>
            <div className="overflow-y-auto">
              <SendHistoryPanel />
            </div>
          </div>
        </TabsContent>

        {/* History tab */}
        <TabsContent
          value="history"
          className="flex-1 min-h-0 mt-0 overflow-y-auto"
        >
          <SendHistoryPanel />
        </TabsContent>

        {/* Templates tab — admin only */}
        {isAdmin && (
          <TabsContent
            value="templates"
            className="flex-1 min-h-0 mt-0 overflow-y-auto"
          >
            <div className="max-w-2xl">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Message Templates
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Edit templates used for WhatsApp and In-App notifications. Use
                  placeholders like{" "}
                  <code className="bg-muted px-1 rounded text-xs">
                    {"{ student_name }"}
                  </code>{" "}
                  which are filled in automatically when sending.
                </p>
              </div>
              <TemplateEditor />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
