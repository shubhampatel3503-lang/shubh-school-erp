import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLASS_LABELS, CLASS_ORDER } from "@/lib/utils";
import type { VirtualClass } from "@/types";
import {
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Plus,
  Send,
  Video,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SAMPLE_CLASSES: VirtualClass[] = [
  {
    id: "1",
    title: "Mathematics - Quadratic Equations",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "abc-defg-hij",
    classLevel: "Class10",
    subjectId: "math",
    teacherId: "t1",
    scheduledAt: "2025-04-28T10:00:00",
    durationMinutes: 60,
    isCompleted: false,
  },
  {
    id: "2",
    title: "Science - Newton's Laws",
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/1234567890",
    meetingId: "1234567890",
    classLevel: "Class9",
    subjectId: "sci",
    teacherId: "t2",
    scheduledAt: "2025-04-27T14:00:00",
    durationMinutes: 45,
    isCompleted: true,
  },
  {
    id: "3",
    title: "English Literature - Hamlet",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/xyz-pqrs-tuv",
    meetingId: "xyz-pqrs-tuv",
    classLevel: "Class11",
    subjectId: "eng",
    teacherId: "t1",
    scheduledAt: "2025-04-29T11:00:00",
    durationMinutes: 50,
    isCompleted: false,
  },
  {
    id: "4",
    title: "Hindi Grammar Workshop",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/ijk-lmno-pqr",
    meetingId: "ijk-lmno-pqr",
    classLevel: "Class8",
    subjectId: "hindi",
    teacherId: "t3",
    scheduledAt: "2025-04-30T09:00:00",
    durationMinutes: 40,
    isCompleted: false,
  },
];

const INITIAL_INSTANT_MEETS = [
  {
    id: "im1",
    link: "https://meet.google.com/qwe-rty-uio",
    createdAt: "2025-04-27T08:00:00",
  },
  {
    id: "im2",
    link: "https://meet.google.com/asd-fgh-jkl",
    createdAt: "2025-04-26T15:30:00",
  },
];

function generateMeetCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) =>
    Array.from(
      { length: n },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `${seg(3)}-${seg(4)}-${seg(3)}`;
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PLATFORM_COLORS: Record<VirtualClass["platform"], string> = {
  GoogleMeet: "bg-emerald-100 text-emerald-700",
  Zoom: "bg-blue-100 text-blue-700",
};

// ─── Schedule Dialog ──────────────────────────────────────────────────────────
function ScheduleDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (v: Omit<VirtualClass, "id" | "isCompleted">) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    classLevel: "Class9" as keyof typeof CLASS_LABELS,
    subject: "",
    platform: "GoogleMeet" as VirtualClass["platform"],
    link: "",
    date: "",
    time: "",
    duration: "45",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    if (!form.title || !form.date || !form.time) return;
    onSave({
      title: form.title,
      platform: form.platform,
      meetingLink: form.link || `https://meet.google.com/${generateMeetCode()}`,
      meetingId: generateMeetCode(),
      classLevel: form.classLevel,
      subjectId: form.subject,
      teacherId: "t1",
      scheduledAt: `${form.date}T${form.time}:00`,
      durationMinutes: Number(form.duration),
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="virtual.schedule_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            Schedule Virtual Class
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Title</Label>
            <Input
              className="mt-1"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Mathematics - Chapter 3"
              data-ocid="virtual.title.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Class</Label>
              <Select
                value={form.classLevel}
                onValueChange={(v) => set("classLevel", v)}
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="virtual.class.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="mt-1"
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                placeholder="Subject name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) =>
                  set("platform", v as VirtualClass["platform"])
                }
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="virtual.platform.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GoogleMeet">Google Meet</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input
                className="mt-1"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Meeting Link (optional)</Label>
            <Input
              className="mt-1"
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://meet.google.com/..."
              data-ocid="virtual.link.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                className="mt-1"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                className="mt-1"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              data-ocid="virtual.schedule.submit_button"
            >
              Schedule Class
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="virtual.schedule.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VirtualClassesPage() {
  const [classes, setClasses] = useState<VirtualClass[]>(SAMPLE_CLASSES);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [instantMeet, setInstantMeet] = useState<string | null>(null);
  const [instantMeets, setInstantMeets] = useState(INITIAL_INSTANT_MEETS);
  const [copied, setCopied] = useState(false);

  function handleSchedule(data: Omit<VirtualClass, "id" | "isCompleted">) {
    setClasses((p) => [
      { ...data, id: `vc-${Date.now()}`, isCompleted: false },
      ...p,
    ]);
  }

  function startInstantMeet() {
    const code = generateMeetCode();
    const link = `https://meet.google.com/${code}`;
    setInstantMeet(link);
    setInstantMeets((p) => [
      { id: `im-${Date.now()}`, link, createdAt: new Date().toISOString() },
      ...p.slice(0, 4),
    ]);
    setCopied(false);
  }

  function copyLink(link: string) {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 space-y-5 max-w-6xl" data-ocid="virtual.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Video className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Virtual Classes
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule and manage online classes
            </p>
          </div>
        </div>
        <Button
          onClick={() => setScheduleOpen(true)}
          data-ocid="virtual.schedule.open_modal_button"
        >
          <Plus className="size-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      <Tabs defaultValue="scheduled">
        <TabsList>
          <TabsTrigger value="scheduled" data-ocid="virtual.scheduled.tab">
            Scheduled Classes
          </TabsTrigger>
          <TabsTrigger value="instant" data-ocid="virtual.instant.tab">
            Quick Meet
          </TabsTrigger>
        </TabsList>

        {/* Scheduled Classes */}
        <TabsContent value="scheduled" className="mt-4">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {[
                      "Title",
                      "Class",
                      "Platform",
                      "Date & Time",
                      "Duration",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-semibold text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls, i) => (
                    <tr
                      key={cls.id}
                      className="border-b border-border/50 hover:bg-muted/20 table-row-alt"
                      data-ocid={`virtual.class.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {cls.title}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {CLASS_LABELS[cls.classLevel]}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${PLATFORM_COLORS[cls.platform]}`}
                        >
                          {cls.platform === "GoogleMeet"
                            ? "Google Meet"
                            : "Zoom"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {formatScheduled(cls.scheduledAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {cls.durationMinutes} min
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {cls.isCompleted ? (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 border-0"
                          >
                            Completed
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 border-0"
                          >
                            Upcoming
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(cls.meetingLink, "_blank")
                            }
                            disabled={cls.isCompleted}
                            data-ocid={`virtual.join.button.${i + 1}`}
                          >
                            <ExternalLink className="size-3.5 mr-1" />
                            Join
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            data-ocid={`virtual.send_link.button.${i + 1}`}
                          >
                            <Send className="size-3.5 mr-1" />
                            Send
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Quick Meet */}
        <TabsContent value="instant" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="size-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-foreground text-xl">
                  Start Instant Meet
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate a Google Meet link and share instantly
                </p>
              </div>
              <Button
                size="lg"
                onClick={startInstantMeet}
                className="w-full max-w-xs"
                data-ocid="virtual.instant_meet.button"
              >
                <Zap className="size-4 mr-2" />
                Start Instant Meeting
              </Button>
              {instantMeet && (
                <div
                  className="w-full rounded-lg bg-muted/40 p-3 space-y-2"
                  data-ocid="virtual.instant_meet.result"
                >
                  <p className="text-xs text-muted-foreground font-semibold uppercase">
                    Meeting Link
                  </p>
                  <p className="text-sm text-primary font-mono break-all">
                    {instantMeet}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyLink(instantMeet)}
                      data-ocid="virtual.copy_link.button"
                    >
                      {copied ? (
                        <CheckCircle className="size-3.5 mr-1 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5 mr-1" />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(instantMeet, "_blank")}
                      data-ocid="virtual.open_meet.button"
                    >
                      <ExternalLink className="size-3.5 mr-1" />
                      Join Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Recent Instant Meets
              </h3>
              {instantMeets.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="virtual.instant_meets.empty_state"
                >
                  No instant meets yet
                </div>
              ) : (
                <div className="space-y-2">
                  {instantMeets.slice(0, 5).map((m, i) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      data-ocid={`virtual.instant_meet.item.${i + 1}`}
                    >
                      <div>
                        <p className="text-sm font-mono text-primary truncate max-w-[200px]">
                          {m.link.replace("https://meet.google.com/", "")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(m.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(m.link, "_blank")}
                      >
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ScheduleDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSave={handleSchedule}
      />
    </div>
  );
}
