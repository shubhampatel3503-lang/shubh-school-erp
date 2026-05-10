import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useBackend";
import { useStudents } from "@/hooks/useBackend";
import {
  CLASS_LEVELS,
  useDirectMessages,
  useSendDirectMessage,
} from "@/hooks/useMessaging";
import type { DirectMessageFE } from "@/hooks/useMessaging";
import { useAppStore } from "@/store/useAppStore";
import {
  CheckCircle2,
  Clock,
  History,
  MessageCircle,
  Phone,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  if (status === "sent")
    return (
      <Badge className="text-xs bg-green-600/15 text-green-700 border-green-300 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Sent
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge className="text-xs bg-destructive/15 text-destructive border-destructive/30 gap-1">
        <XCircle className="h-3 w-3" />
        Failed
      </Badge>
    );
  return (
    <Badge className="text-xs bg-muted text-muted-foreground gap-1">
      <Clock className="h-3 w-3" />
      Pending
    </Badge>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  if (channel === "WhatsApp")
    return (
      <Badge className="text-xs bg-green-600/20 text-green-700 border-green-300">
        📱 WA
      </Badge>
    );
  if (channel === "In-App")
    return (
      <Badge variant="secondary" className="text-xs">
        🔔 In-App
      </Badge>
    );
  return (
    <Badge className="text-xs bg-primary/15 text-primary border-primary/30">
      📡 Both
    </Badge>
  );
}

function formatRelativeTime(sentAt: string): string {
  try {
    const date = new Date(sentAt);
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return "just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return sentAt;
  }
}

interface MessageCardProps {
  msg: DirectMessageFE;
  studentName?: string;
  onRetry?: (msg: DirectMessageFE) => void;
  isRetrying?: boolean;
}

function MessageCard({
  msg,
  studentName,
  onRetry,
  isRetrying,
}: MessageCardProps) {
  const classLabel = msg.toClassLevel
    ? (CLASS_LEVELS.find((c) => c.value === msg.toClassLevel)?.label ??
      msg.toClassLevel)
    : null;

  const recipientLabel = studentName
    ? studentName
    : classLabel
      ? `${classLabel}${msg.toSection ? ` — ${msg.toSection}` : " — All"}`
      : "Unknown";

  return (
    <div
      className="p-3 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors space-y-2"
      data-ocid="history.message_card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground truncate">
              {recipientLabel}
            </span>
            <ChannelBadge channel={msg.channel} />
            <StatusBadge status={msg.deliveryStatus} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {msg.message}
          </p>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {formatRelativeTime(msg.sentAt)}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          From: {msg.fromUsername}
        </span>
        {msg.deliveryStatus === "failed" && onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRetry(msg)}
            disabled={isRetrying}
            data-ocid="history.retry_button"
            className="h-6 text-xs gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            {isRetrying ? "Retrying…" : "Retry"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function SendHistoryPanel() {
  const { data: messages = [], isLoading } = useDirectMessages(100);
  const { data: allStudents = [] } = useStudents();
  const { data: settings } = useSettings();
  const sendMsg = useSendDirectMessage();
  const currentUser = useAppStore((s) => s.currentUser?.fullName ?? "admin");

  // Build student ID → name map
  const studentMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of allStudents) m.set(s.id, s.fullName);
    return m;
  }, [allStudents]);

  // Sort descending by sentAt
  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
      ),
    [messages],
  );

  async function handleRetry(msg: DirectMessageFE) {
    const student = msg.toStudentId
      ? allStudents.find((s) => s.id === msg.toStudentId)
      : null;
    const phone = student
      ? student.fatherMobile || student.motherMobile || student.mobile || ""
      : "";
    try {
      await sendMsg.mutateAsync({
        fromUsername: currentUser,
        toStudentId: msg.toStudentId,
        toClassLevel: msg.toClassLevel,
        toSection: msg.toSection,
        channel: msg.channel as "WhatsApp" | "In-App" | "Both",
        message: msg.message,
        templateKey: msg.templateKey,
        recipientPhone: phone || undefined,
        whatsappApiKey: settings?.whatsappApiKey || "",
        whatsappApiUrl: "",
      });
      toast.success("Message resent successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to resend message",
      );
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Send History
          {messages.length > 0 && (
            <Badge variant="secondary" className="text-xs ml-auto">
              {messages.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground"
            data-ocid="history.empty_state"
          >
            <MessageCircle className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No messages sent yet</p>
            <p className="text-xs mt-1">Sent messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                studentName={
                  msg.toStudentId ? studentMap.get(msg.toStudentId) : undefined
                }
                onRetry={handleRetry}
                isRetrying={sendMsg.isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
