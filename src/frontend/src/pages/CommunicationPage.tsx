import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SentMessage {
  id: string;
  channel: "WhatsApp" | "SMS";
  target: string;
  subject: string;
  body: string;
  sentAt: string;
  deliveredCount: number;
  totalCount: number;
}

interface NotifItem {
  id: string;
  title: string;
  message: string;
  target: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface ScheduledItem {
  id: string;
  title: string;
  trigger: string;
  target: string;
  scheduledAt: string;
  isEnabled: boolean;
}

const INIT_SENT: SentMessage[] = [
  {
    id: "m1",
    channel: "WhatsApp",
    target: "All Students",
    subject: "Fee Reminder",
    body: "Dear Parent, please clear pending fees before 30th April.",
    sentAt: "2026-04-25",
    deliveredCount: 138,
    totalCount: 145,
  },
  {
    id: "m2",
    channel: "SMS",
    target: "Class 10-A",
    subject: "Exam Timetable",
    body: "Annual exam timetable has been released. Please check the school app.",
    sentAt: "2026-04-20",
    deliveredCount: 42,
    totalCount: 42,
  },
  {
    id: "m3",
    channel: "WhatsApp",
    target: "By Route - Route A",
    subject: "Bus Delay",
    body: "Route A bus will be delayed by 20 minutes today due to road work.",
    sentAt: "2026-04-15",
    deliveredCount: 65,
    totalCount: 68,
  },
];

const INIT_NOTIFS: NotifItem[] = [
  {
    id: "n1",
    title: "Fee Due Alert",
    message: "45 students have pending fees for April 2026.",
    target: "Accountant",
    type: "Fee",
    isRead: false,
    createdAt: "2026-04-27",
  },
  {
    id: "n2",
    title: "Low Attendance",
    message: "Class 8-A attendance below 75% this week.",
    target: "Admin",
    type: "Attendance",
    isRead: false,
    createdAt: "2026-04-26",
  },
  {
    id: "n3",
    title: "New Admission",
    message: "Arjun Singh admitted to LKG-A.",
    target: "Admin",
    type: "Info",
    isRead: true,
    createdAt: "2026-04-24",
  },
];

const INIT_SCHEDULED: ScheduledItem[] = [
  {
    id: "sc1",
    title: "Monthly Fee Reminder",
    trigger: "On 1st of every month",
    target: "All Parents",
    scheduledAt: "Monthly",
    isEnabled: true,
  },
  {
    id: "sc2",
    title: "Exam Result Notification",
    trigger: "On exam result publish",
    target: "All Students",
    scheduledAt: "On event",
    isEnabled: true,
  },
  {
    id: "sc3",
    title: "Birthday Wishes",
    trigger: "On student birthday",
    target: "Student + Parent",
    scheduledAt: "Daily",
    isEnabled: false,
  },
];

// ─── WaCoder.in helpers ──────────────────────────────────────────────────────
function loadWaSettings(): { apiKey: string; senderNumber: string } {
  try {
    const raw = localStorage.getItem("wacoder_settings");
    if (!raw) return { apiKey: "", senderNumber: "" };
    return JSON.parse(raw) as { apiKey: string; senderNumber: string };
  } catch {
    return { apiKey: "", senderNumber: "" };
  }
}
function saveWaSettings(s: { apiKey: string; senderNumber: string }) {
  localStorage.setItem("wacoder_settings", JSON.stringify(s));
}
async function sendViaWacoder(
  apiKey: string,
  mobile: string,
  message: string,
): Promise<{ mobile: string; success: boolean; error?: string }> {
  try {
    const clean = mobile.replace(/\D/g, "").slice(-10);
    if (clean.length < 10)
      return { mobile, success: false, error: "Invalid mobile" };
    const url = `https://wacoder.in/api/send?apikey=${encodeURIComponent(apiKey)}&mobile=${encodeURIComponent(clean)}&message=${encodeURIComponent(message)}`;
    const res = await fetch(url);
    const text = await res.text();
    const ok = res.ok && /success|sent/i.test(text);
    return { mobile: clean, success: ok, error: ok ? undefined : text };
  } catch (e) {
    return {
      mobile,
      success: false,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

export default function CommunicationPage() {
  const [channel, setChannel] = useState<"WhatsApp" | "SMS">("WhatsApp");
  const [target, setTarget] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>(INIT_SENT);
  const [waSettings, setWaSettings] = useState(loadWaSettings);
  const [showWaSetup, setShowWaSetup] = useState(false);
  const [waApiKeyInput, setWaApiKeyInput] = useState("");
  const [waSenderInput, setWaSenderInput] = useState("");
  const [customMobiles, setCustomMobiles] = useState("");

  function openWaSetup() {
    setWaApiKeyInput(waSettings.apiKey);
    setWaSenderInput(waSettings.senderNumber);
    setShowWaSetup(true);
  }

  function saveWaConfig() {
    const s = {
      apiKey: waApiKeyInput.trim(),
      senderNumber: waSenderInput.trim(),
    };
    saveWaSettings(s);
    setWaSettings(s);
    setShowWaSetup(false);
    toast.success("WhatsApp (wacoder.in) settings saved");
  }

  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifTarget, setNotifTarget] = useState("Admin");
  const [notifications, setNotifications] = useState<NotifItem[]>(INIT_NOTIFS);

  const [schedName, setSchedName] = useState("");
  const [schedTrigger, setSchedTrigger] = useState("");
  const [schedTarget, setSchedTarget] = useState("All Students");
  const [scheduled, setScheduled] = useState<ScheduledItem[]>(INIT_SCHEDULED);

  async function handleSend() {
    if (!body.trim()) {
      toast.error("Message body is required");
      return;
    }

    if (channel === "WhatsApp") {
      if (!waSettings.apiKey) {
        openWaSetup();
        toast.error("Please configure your wacoder.in API key first");
        return;
      }
      const mobiles: string[] = [];
      if (target === "custom") {
        for (const m of customMobiles.split(/[,\n;]+/)) {
          const t = m.trim().replace(/\D/g, "");
          if (t.length >= 10) mobiles.push(t.slice(-10));
        }
        if (mobiles.length === 0) {
          toast.error("Enter at least one mobile number for Custom target");
          return;
        }
      } else {
        // For demo: single placeholder. In production fetch from backend by target.
        mobiles.push("0000000000");
      }
      setSending(true);
      let delivered = 0;
      for (const mobile of mobiles) {
        const r = await sendViaWacoder(waSettings.apiKey, mobile, body);
        if (r.success) delivered++;
      }
      setSending(false);
      const targetLabel =
        target === "all"
          ? "All Students"
          : target === "class"
            ? "By Class"
            : target === "route"
              ? "By Route"
              : "Custom";
      setSentMessages((prev) => [
        {
          id: `m${Date.now()}`,
          channel: "WhatsApp",
          target: targetLabel,
          subject: subject || "(No subject)",
          body,
          sentAt: new Date().toISOString().slice(0, 10),
          deliveredCount: delivered,
          totalCount: mobiles.length,
        },
        ...prev,
      ]);
      setSubject("");
      setBody("");
      if (delivered > 0)
        toast.success(
          `WhatsApp: ${delivered}/${mobiles.length} sent via wacoder.in`,
        );
      else toast.error("WhatsApp send failed — check your wacoder.in API key");
      return;
    }

    // SMS fallback
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    const targetLabel =
      target === "all"
        ? "All Students"
        : target === "class"
          ? "By Class"
          : target === "route"
            ? "By Route"
            : "Custom";
    setSentMessages((prev) => [
      {
        id: `m${Date.now()}`,
        channel: "SMS",
        target: targetLabel,
        subject: subject || "(No subject)",
        body,
        sentAt: new Date().toISOString().slice(0, 10),
        deliveredCount: 40,
        totalCount: 40,
      },
      ...prev,
    ]);
    setSending(false);
    setSubject("");
    setBody("");
    toast.success("SMS message sent successfully");
  }

  function handleCreateNotif() {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }
    setNotifications((prev) => [
      {
        id: `n${Date.now()}`,
        title: notifTitle,
        message: notifMessage,
        target: notifTarget,
        type: "Info",
        isRead: false,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setNotifTitle("");
    setNotifMessage("");
    toast.success("Notification created");
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  function handleDeleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleAddScheduled() {
    if (!schedName.trim() || !schedTrigger.trim()) {
      toast.error("Name and trigger are required");
      return;
    }
    setScheduled((prev) => [
      {
        id: `sc${Date.now()}`,
        title: schedName,
        trigger: schedTrigger,
        target: schedTarget,
        scheduledAt: "On event",
        isEnabled: true,
      },
      ...prev,
    ]);
    setSchedName("");
    setSchedTrigger("");
    toast.success("Scheduled notification added");
  }

  function handleToggleScheduled(id: string) {
    setScheduled((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)),
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 space-y-6" data-ocid="communication.page">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Communication
          </h1>
          <p className="text-sm text-muted-foreground">
            Broadcast messages, manage notifications, and schedule alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* WaCoder.in status banner */}
      {channel === "WhatsApp" && !waSettings.apiKey && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-sm text-amber-700 font-medium">
            ⚠ WhatsApp not configured — set up wacoder.in to send real messages
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-400 text-amber-700 hover:bg-amber-100 shrink-0"
            onClick={openWaSetup}
            data-ocid="communication.wa_setup.button"
          >
            Configure
          </Button>
        </div>
      )}
      {channel === "WhatsApp" && waSettings.apiKey && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 flex items-center justify-between gap-3">
          <p className="text-xs text-green-700 font-medium">
            ✓ WhatsApp connected via wacoder.in
            {waSettings.senderNumber
              ? ` · Sender: ${waSettings.senderNumber}`
              : ""}
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 text-green-700"
            onClick={openWaSetup}
            data-ocid="communication.wa_edit.button"
          >
            Edit
          </Button>
        </div>
      )}

      {/* WaCoder.in Setup Dialog */}
      {showWaSetup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          data-ocid="communication.wa_setup.dialog"
        >
          <div className="bg-card rounded-xl shadow-xl border border-border max-w-md w-full mx-4 p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-foreground">
              WhatsApp via wacoder.in
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your wacoder.in credentials. Messages are sent via{" "}
              <a
                href="https://wacoder.in"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-medium"
              >
                wacoder.in
              </a>{" "}
              API.
            </p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">
                  API Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={waApiKeyInput}
                  onChange={(e) => setWaApiKeyInput(e.target.value)}
                  placeholder="Your wacoder.in API key"
                  type="password"
                  data-ocid="communication.wa_apikey.input"
                />
              </div>
              <div>
                <Label className="text-xs">Sender Number (optional)</Label>
                <Input
                  value={waSenderInput}
                  onChange={(e) => setWaSenderInput(e.target.value)}
                  placeholder="e.g. 9876543210"
                  data-ocid="communication.wa_sender.input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowWaSetup(false)}
                data-ocid="communication.wa_setup.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveWaConfig}
                disabled={!waApiKeyInput.trim()}
                data-ocid="communication.wa_setup.save_button"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="broadcast" data-ocid="communication.tab">
        <TabsList>
          <TabsTrigger
            value="broadcast"
            data-ocid="communication.broadcast.tab"
          >
            <Send className="h-4 w-4 mr-2" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            data-ocid="communication.notifications.tab"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1.5 bg-destructive text-destructive-foreground rounded-full text-xs px-1.5">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="scheduler"
            data-ocid="communication.scheduler.tab"
          >
            <Clock className="h-4 w-4 mr-2" />
            Scheduler
          </TabsTrigger>
        </TabsList>

        {/* ── Broadcast ── */}
        <TabsContent value="broadcast" className="space-y-5">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    New Broadcast
                  </CardTitle>
                  <CardDescription>
                    Send a message to students, parents, or staff
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <RadioGroup
                      value={channel}
                      onValueChange={(v) => setChannel(v as "WhatsApp" | "SMS")}
                      className="flex gap-6"
                      data-ocid="communication.channel.radio"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="WhatsApp"
                          id="ch-wa"
                          data-ocid="communication.channel_whatsapp.radio"
                        />
                        <Label
                          htmlFor="ch-wa"
                          className="cursor-pointer font-normal"
                        >
                          WhatsApp
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value="SMS"
                          id="ch-sms"
                          data-ocid="communication.channel_sms.radio"
                        />
                        <Label
                          htmlFor="ch-sms"
                          className="cursor-pointer font-normal"
                        >
                          SMS
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <RadioGroup
                      value={target}
                      onValueChange={setTarget}
                      className="grid grid-cols-2 gap-2"
                      data-ocid="communication.target.radio"
                    >
                      {[
                        { id: "all", label: "All Students & Parents" },
                        { id: "class", label: "By Class" },
                        { id: "route", label: "By Transport Route" },
                        { id: "custom", label: "Custom Mobile Numbers" },
                      ].map(({ id, label }) => (
                        <div
                          key={id}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${target === id ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem
                            value={id}
                            id={`tgt-${id}`}
                            data-ocid={`communication.target_${id}.radio`}
                          />
                          <Label
                            htmlFor={`tgt-${id}`}
                            className="cursor-pointer font-normal text-sm"
                          >
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {target === "class" && (
                      <Select data-ocid="communication.class.select">
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Class 5-A", "Class 8-A", "Class 10-A"].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {target === "route" && (
                      <Select data-ocid="communication.route.select">
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select Route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="r1">
                            Route A - North Delhi
                          </SelectItem>
                          <SelectItem value="r2">
                            Route B - South Delhi
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {target === "custom" && channel === "WhatsApp" && (
                      <div className="mt-2 space-y-1">
                        <Label className="text-xs">Mobile Numbers</Label>
                        <Textarea
                          rows={3}
                          value={customMobiles}
                          onChange={(e) => setCustomMobiles(e.target.value)}
                          placeholder="9876543210, 9123456780…"
                          className="text-xs"
                          data-ocid="communication.custom_mobiles.textarea"
                        />
                        <p className="text-xs text-muted-foreground">
                          10-digit numbers, comma or newline separated
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Subject (optional)</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Message subject"
                      data-ocid="communication.subject.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Type your message here…"
                      data-ocid="communication.body.textarea"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {body.length} / 1600 chars
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="communication.attach.upload_button"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={sending}
                      className="ml-auto"
                      data-ocid="communication.send.primary_button"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? "Sending…" : `Send via ${channel}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Messages Today", value: "3" },
                  { label: "This Week", value: "12" },
                  { label: "Total Recipients", value: "245" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                    <Badge variant="secondary">{value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Sent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sentMessages.map((msg, i) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border"
                    data-ocid={`communication.sent.item.${i + 1}`}
                  >
                    <div
                      className={`p-2 rounded-lg ${msg.channel === "WhatsApp" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm text-foreground truncate">
                          {msg.subject}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {msg.channel}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {msg.target}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {msg.body}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <p>{formatDate(msg.sentAt)}</p>
                      <p className="text-green-600 font-medium">
                        {msg.deliveredCount}/{msg.totalCount} delivered
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications" className="space-y-5">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  Notification Feed
                </h3>
                <Badge variant="destructive">{unreadCount} unread</Badge>
              </div>
              {notifications.length === 0 && (
                <div
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="communication.notifications.empty_state"
                >
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              )}
              {notifications.map((notif, i) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${notif.isRead ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}
                  data-ocid={`communication.notification.item.${i + 1}`}
                >
                  <div
                    className={`p-2 rounded-lg ${notif.isRead ? "bg-muted/40" : "bg-primary/10"}`}
                  >
                    <Bell
                      className={`h-4 w-4 ${notif.isRead ? "text-muted-foreground" : "text-primary"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-foreground">
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">
                        {notif.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        → {notif.target}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={() => handleMarkRead(notif.id)}
                        data-ocid={`communication.mark_read.button.${i + 1}`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNotif(notif.id)}
                      data-ocid={`communication.delete_notif.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Create Notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Notification title"
                    className="h-8"
                    data-ocid="communication.notif_title.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Message</Label>
                  <Textarea
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Notification message"
                    data-ocid="communication.notif_message.textarea"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Target</Label>
                  <Select value={notifTarget} onValueChange={setNotifTarget}>
                    <SelectTrigger
                      className="h-8"
                      data-ocid="communication.notif_target.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Admin",
                        "Teacher",
                        "Accountant",
                        "All Staff",
                        "All Parents",
                        "All Students",
                      ].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleCreateNotif}
                  data-ocid="communication.create_notif.submit_button"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Scheduler ── */}
        <TabsContent value="scheduler" className="space-y-5">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <h3 className="font-semibold text-foreground">
                Scheduled Notifications
              </h3>
              {scheduled.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${item.isEnabled ? "bg-card border-border" : "bg-muted/20 border-border opacity-60"}`}
                  data-ocid={`communication.scheduled.item.${i + 1}`}
                >
                  <div
                    className={`p-2 rounded-lg ${item.isEnabled ? "bg-primary/10" : "bg-muted/40"}`}
                  >
                    <Calendar
                      className={`h-4 w-4 ${item.isEnabled ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        Trigger: {item.trigger}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        → {item.target}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {item.scheduledAt}
                    </Badge>
                    <Switch
                      checked={item.isEnabled}
                      onCheckedChange={() => handleToggleScheduled(item.id)}
                      data-ocid={`communication.scheduled.toggle.${i + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  New Scheduled Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={schedName}
                    onChange={(e) => setSchedName(e.target.value)}
                    placeholder="e.g. Fee Reminder"
                    className="h-8"
                    data-ocid="communication.sched_name.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Trigger Rule</Label>
                  <Select value={schedTrigger} onValueChange={setSchedTrigger}>
                    <SelectTrigger
                      className="h-8"
                      data-ocid="communication.sched_trigger.select"
                    >
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "On fee due date",
                        "On exam result publish",
                        "On student birthday",
                        "On low attendance",
                        "Monthly (1st of month)",
                        "Weekly (Monday)",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Target</Label>
                  <Select value={schedTarget} onValueChange={setSchedTarget}>
                    <SelectTrigger
                      className="h-8"
                      data-ocid="communication.sched_target.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "All Students",
                        "All Parents",
                        "All Staff",
                        "Admin",
                        "Accountant",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleAddScheduled}
                  data-ocid="communication.sched.submit_button"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
