import { createActor } from "@/backend";
import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  type FrontendExamCalendarEntry,
  useAddExamDateToCalendar,
  useGetCalendarStats,
  useGetExamDatesForCalendar,
} from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────────────────
interface Holiday {
  id: string;
  name: string;
  date: string;
  description: string;
  isRecurring: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────────────────
function formatDateDisplay(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Holiday Hooks ─────────────────────────────────────────────────────────────────────────
function useHolidays(sessionId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Holiday[]>({
    queryKey: ["holidays", sessionId],
    queryFn: async (): Promise<Holiday[]> => {
      if (!actor) return [];
      try {
        const result = await actor.getHolidays(sessionId);
        return (result as unknown as Record<string, unknown>[]).map((h) => ({
          id: String(h.id ?? ""),
          name: String(h.name ?? ""),
          date: String(h.date ?? ""),
          description: String(h.description ?? ""),
          isRecurring: Boolean(h.isRecurring),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

function useAddHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h: {
      name: string;
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.addHoliday(h.name, h.date, h.description, false);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    },
  });
}

function useUpdateHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h: {
      id: string;
      name: string;
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.updateHoliday(h.id, h.name, h.date, h.description, false);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    },
  });
}

function useDeleteHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deleteHoliday(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    },
  });
}

// ─── Holiday Form Dialog ────────────────────────────────────────────────────────────────────
interface HolidayFormProps {
  open: boolean;
  onClose: () => void;
  editing: Holiday | null;
}
function HolidayFormDialog({ open, onClose, editing }: HolidayFormProps) {
  const [name, setName] = useState(editing?.name ?? "");
  const [date, setDate] = useState(editing?.date ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const addHoliday = useAddHoliday();
  const updateHoliday = useUpdateHoliday();

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setDate(editing?.date ?? "");
      setDescription(editing?.description ?? "");
    }
  }, [open, editing]);

  const isSaving = addHoliday.isPending || updateHoliday.isPending;

  async function handleSave() {
    if (!name.trim() || !date) {
      toast.error("Holiday name and date are required.");
      return;
    }
    try {
      if (editing) {
        await updateHoliday.mutateAsync({
          id: editing.id,
          name: name.trim(),
          date,
          description,
        });
        toast.success("Holiday updated successfully");
      } else {
        await addHoliday.mutateAsync({ name: name.trim(), date, description });
        toast.success("Holiday added successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save holiday. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !isSaving) onClose();
      }}
    >
      <DialogContent data-ocid="calendar.holiday_dialog">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>
              Holiday Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Republic Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="calendar.holiday_form.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Date <span className="text-destructive">*</span>
            </Label>
            <DateInput
              value={date}
              onChange={(iso) => setDate(iso)}
              data-ocid="calendar.holiday_form.date_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              rows={2}
              placeholder="Additional details about this holiday"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="calendar.holiday_form.description_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            data-ocid="calendar.holiday_form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !name.trim() || !date}
            data-ocid="calendar.holiday_form.submit_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" /> Saving…
              </>
            ) : editing ? (
              "Save Changes"
            ) : (
              "Add Holiday"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Exam Date Form Dialog ───────────────────────────────────────────────────────────────────
function ExamDateFormDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const addExam = useAddExamDateToCalendar();

  useEffect(() => {
    if (open) {
      setExamName("");
      setDate("");
      setClassName("");
    }
  }, [open]);

  async function handleSave() {
    if (!examName.trim() || !date) {
      toast.error("Exam name and date are required.");
      return;
    }
    try {
      await addExam.mutateAsync({
        examName: examName.trim(),
        date,
        className: className.trim(),
      });
      toast.success("Exam date added to calendar.");
      onClose();
    } catch {
      toast.error("Failed to add exam date.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !addExam.isPending) onClose();
      }}
    >
      <DialogContent data-ocid="calendar.exam_dialog">
        <DialogHeader>
          <DialogTitle>Add Exam Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>
              Exam Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Quarterly Exam, Half Yearly"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              data-ocid="calendar.exam_form.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Date <span className="text-destructive">*</span>
            </Label>
            <DateInput
              value={date}
              onChange={(iso) => setDate(iso)}
              data-ocid="calendar.exam_form.date_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Class (optional)</Label>
            <Input
              placeholder="e.g. Class 10, All Classes"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              data-ocid="calendar.exam_form.class_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={addExam.isPending}
            data-ocid="calendar.exam_form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={addExam.isPending || !examName.trim() || !date}
            data-ocid="calendar.exam_form.submit_button"
          >
            {addExam.isPending ? (
              <Loader2 className="size-4 animate-spin mr-1" />
            ) : null}
            Add Exam Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Calendar Grid ──────────────────────────────────────────────────────────────────────────────
function CalendarGrid({
  sessionId,
  holidays,
  examEntries,
}: {
  sessionId: string;
  holidays: Holiday[];
  examEntries: FrontendExamCalendarEntry[];
}) {
  const match = sessionId.match(/(\d{4})-(\d{2})/);
  if (!match) return null;
  const startYear = Number.parseInt(match[1]);
  const months = [
    { year: startYear, month: 3 },
    { year: startYear, month: 4 },
    { year: startYear, month: 5 },
    { year: startYear, month: 6 },
    { year: startYear, month: 7 },
    { year: startYear, month: 8 },
    { year: startYear, month: 9 },
    { year: startYear, month: 10 },
    { year: startYear, month: 11 },
    { year: startYear + 1, month: 0 },
    { year: startYear + 1, month: 1 },
    { year: startYear + 1, month: 2 },
  ];

  const holidaySet = new Set(holidays.map((h) => h.date.split("T")[0]));
  const examSet = new Map<string, string>();
  for (const e of examEntries) {
    const d = e.date.split("T")[0];
    examSet.set(d, e.examName + (e.className ? ` (${e.className})` : ""));
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map(({ year, month }) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const allDays = [...blanks, ...days];
        return (
          <div
            key={`${year}-${month}`}
            className="rounded-lg border border-border bg-card p-3"
          >
            <p className="text-xs font-semibold text-foreground mb-2 text-center">
              {MONTH_NAMES[month]} {year}
            </p>
            <div className="grid grid-cols-7 gap-0.5 text-[10px]">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center font-semibold text-muted-foreground py-0.5"
                >
                  {d}
                </div>
              ))}
              {allDays.map((day, idx) => {
                if (day === null)
                  return (
                    <div
                      key={`blank-${month}-${String(day ?? idx)}-pos${idx}`}
                    />
                  );
                const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayOfWeek = new Date(year, month, day).getDay();
                const isSunday = dayOfWeek === 0;
                const isHoliday = holidaySet.has(isoDate);
                const isExam = examSet.has(isoDate);
                const examTitle = examSet.get(isoDate);
                let cls =
                  "text-center py-0.5 rounded text-foreground hover:bg-muted/50";
                if (isSunday)
                  cls =
                    "text-center py-0.5 rounded bg-orange-100 text-orange-700 font-semibold";
                if (isHoliday)
                  cls =
                    "text-center py-0.5 rounded bg-red-100 text-red-700 font-bold";
                if (isExam)
                  cls =
                    "text-center py-0.5 rounded bg-purple-100 text-purple-700 font-bold ring-1 ring-purple-400";
                return (
                  <div
                    key={isoDate}
                    className={cls}
                    title={
                      isExam
                        ? `Exam: ${examTitle}`
                        : isHoliday
                          ? holidays.find((h) => h.date.startsWith(isoDate))
                              ?.name
                          : isSunday
                            ? "Sunday"
                            : ""
                    }
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────────────────
export default function AcademicCalendarPage() {
  const { currentSession } = useAppStore();
  const session = currentSession ?? "2025-26";
  const { data: holidays = [], isLoading } = useHolidays(session);
  const { data: calStats } = useGetCalendarStats();
  const { data: examEntries = [] } = useGetExamDatesForCalendar();
  const deleteHoliday = useDeleteHoliday();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [examFormOpen, setExamFormOpen] = useState(false);
  const [examFilter, setExamFilter] = useState("all");

  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    const in7 = new Date();
    in7.setDate(today.getDate() + 7);
    return holidays.filter((h) => {
      const d = new Date(h.date);
      return d >= today && d <= in7;
    });
  }, [holidays]);

  const filteredExams = useMemo(() => {
    if (examFilter === "all") return examEntries;
    return examEntries.filter((e) =>
      e.className.toLowerCase().includes(examFilter.toLowerCase()),
    );
  }, [examEntries, examFilter]);

  // Stats: prefer real backend stats; fall back to local counts
  const statCards = [
    {
      label: "Total Days (Apr 1 – Today)",
      value: calStats?.totalDaysFromApril1 ?? "...",
      color: "text-foreground",
      desc: "From 1st April of this session",
    },
    {
      label: "Working Days",
      value: calStats?.workingDays ?? "...",
      color: "text-green-600",
      desc: "School open (excl. Sundays & holidays)",
    },
    {
      label: "Sundays",
      value: calStats?.sundayCount ?? "...",
      color: "text-orange-600",
      desc: "Auto-counted, always non-working",
    },
    {
      label: "Holidays",
      value: calStats?.holidayCount ?? holidays.length,
      color: "text-red-600",
      desc: "Manually added holidays",
    },
  ];

  function openEdit(h: Holiday) {
    setEditing(h);
    setFormOpen(true);
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteHoliday.mutateAsync(deleteId);
      toast.success("Holiday deleted");
    } catch {
      toast.error("Failed to delete holiday");
    }
    setDeleteId(null);
  }

  function sendWhatsAppNotification(h: Holiday) {
    const msg = encodeURIComponent(
      `Dear Parent, ${h.name} on ${formatDateDisplay(h.date)} is a school holiday. School will remain closed.`,
    );
    window.open(`https://wacoder.in/send?message=${msg}`, "_blank");
    toast.success(`WhatsApp notification queued for ${h.name}`);
  }

  return (
    <div className="flex flex-col h-full" data-ocid="calendar.page">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Academic Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              Holidays, working days &amp; exam dates — Session {session}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setViewMode((v) => (v === "list" ? "calendar" : "list"))
              }
              data-ocid="calendar.view_toggle"
            >
              {viewMode === "list" ? "Calendar View" : "List View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExamFormOpen(true)}
              data-ocid="calendar.add_exam_button"
            >
              <BookOpen className="size-4 mr-1" /> Add Exam Date
            </Button>
            <Button size="sm" onClick={openAdd} data-ocid="calendar.add_button">
              <Plus className="size-4 mr-1" /> Add Holiday
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 bg-background">
        {/* Stats — from real backend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <p
                className={`text-3xl font-bold font-display ${
                  calStats ? c.color : "text-muted-foreground"
                }`}
              >
                {c.value}
              </p>
              <p className="text-xs font-medium text-foreground mt-1">
                {c.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-red-200" /> Holiday
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-orange-200" />{" "}
            Sunday
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded bg-purple-200 ring-1 ring-purple-400" />{" "}
            Exam Date
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded border border-border" />{" "}
            Working Day
          </span>
        </div>

        {/* Exam Dates section */}
        {examEntries.length > 0 && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-200">
              <BookOpen className="size-4 text-purple-600" />
              <h2 className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                Exam Dates
              </h2>
              <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs ml-auto">
                {examEntries.length} exam date
                {examEntries.length !== 1 ? "s" : ""}
              </Badge>
              <Input
                className="w-40 h-7 text-xs"
                placeholder="Filter by class"
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value || "all")}
                data-ocid="calendar.exam_filter_input"
              />
            </div>
            <table className="w-full text-sm">
              <thead className="bg-purple-50/80 dark:bg-purple-950/30 border-b border-purple-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700">
                    Exam Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((e, i) => (
                  <tr
                    key={e.id}
                    className="border-b border-purple-100 last:border-0 hover:bg-purple-50/40"
                    data-ocid={`calendar.exam.item.${i + 1}`}
                  >
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-mono text-sm text-foreground">
                        {formatDateDisplay(e.date)}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-foreground">
                      {e.examName}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground text-xs">
                      {e.className || "All Classes"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Calendar or List view */}
        {viewMode === "calendar" ? (
          <CalendarGrid
            sessionId={session}
            holidays={holidays}
            examEntries={examEntries}
          />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
              <h2 className="font-semibold text-foreground text-sm">
                Holidays — {session}
              </h2>
              <Badge variant="secondary" className="ml-auto text-xs">
                {holidays.length} manual holidays
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Holiday Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border bg-orange-50/60">
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-xs text-orange-700 font-semibold"
                  >
                    Sundays: {calStats?.sundayCount ?? "..."} — automatically
                    non-working days
                  </td>
                </tr>

                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                      data-ocid="calendar.loading_state"
                    >
                      Loading holidays…
                    </td>
                  </tr>
                ) : holidays.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                      data-ocid="calendar.empty_state"
                    >
                      No holidays added yet. Click “Add Holiday” to add the
                      first one.
                    </td>
                  </tr>
                ) : (
                  holidays.map((h, i) => (
                    <tr
                      key={h.id}
                      className="border-b border-border last:border-0 hover:bg-muted/10"
                      data-ocid={`calendar.holiday.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-foreground">
                          {formatDateDisplay(h.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {h.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                        {h.description || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => openEdit(h)}
                            data-ocid={`calendar.edit_button.${i + 1}`}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(h.id)}
                            data-ocid={`calendar.delete_button.${i + 1}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-green-600"
                            onClick={() => sendWhatsAppNotification(h)}
                            title="Send WhatsApp notification"
                            data-ocid={`calendar.notify_button.${i + 1}`}
                          >
                            <Send className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Upcoming holidays in next 7 days */}
        {upcomingHolidays.length > 0 && (
          <div className="rounded-xl border border-border bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm">
              🔔 Upcoming Holidays (next 7 days)
            </h3>
            <div className="space-y-2">
              {upcomingHolidays.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/70 dark:bg-card border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {h.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateDisplay(h.date)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-700 border-green-500/40 hover:bg-green-500/10 gap-1.5"
                    onClick={() => sendWhatsAppNotification(h)}
                    data-ocid={`calendar.upcoming_notify.${h.id}`}
                  >
                    <Send className="size-3.5" /> Send Notification
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-blue-500" />
          <span>
            <strong>Working days</strong> count from 1st April, automatically
            excluding Sundays and added holidays. Holidays here are also
            excluded from staff salary working-day calculations in HR &amp;
            Payroll.
          </span>
        </div>
      </div>

      {/* Add/Edit dialog */}
      {formOpen && (
        <HolidayFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          editing={editing}
        />
      )}

      {/* Exam Date dialog */}
      {examFormOpen && (
        <ExamDateFormDialog
          open={examFormOpen}
          onClose={() => setExamFormOpen(false)}
        />
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="calendar.delete_dialog">
          <DialogHeader>
            <DialogTitle>Delete Holiday?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove this holiday from the calendar. Working
            day calculations will be updated automatically.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="calendar.delete_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteHoliday.isPending}
              data-ocid="calendar.delete_dialog.confirm_button"
            >
              {deleteHoliday.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
