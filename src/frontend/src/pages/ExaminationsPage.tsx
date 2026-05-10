import { GeneratePrintModal } from "@/components/certificates/GeneratePrintModal";
import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCertificateTemplates,
  useCreateSmartExamTimetable,
  useDeleteSmartExamTimetable,
  useGenerateSmartExamSchedule,
  useGetSmartExamTimetables,
  useSubjects,
  useUpdateSmartExamTimetable,
} from "@/hooks/useBackend";
import {
  CLASS_LABELS,
  CLASS_ORDER,
  downloadCSV,
  formatDate,
  generateId,
} from "@/lib/utils";
import AcademicPerformanceTab from "@/pages/exam/AcademicPerformanceTab";
import ExamConfigTab from "@/pages/exam/ExamConfigTab";
import ExamResultsTab from "@/pages/exam/ExamResultsTab";
import MarksEntryTab from "@/pages/exam/MarksEntryTab";
import { useAppStore } from "@/store/useAppStore";
import type {
  ClassLevel,
  MCQQuestion,
  OnlineExam,
  SmartExamTimetable,
  SmartTimetableEntry,
} from "@/types";
import {
  Award,
  BarChart2,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Download,
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Play,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Settings2,
  Sparkles,
  TimerIcon,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Subject badge colors (cycling palette)
const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
];

function getSubjectColor(subject: string): string {
  const hash = subject.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
}

// ─── Date utilities ──────────────────────────────────────────────────────────
function getDatesInRange(
  start: string,
  end: string,
): { date: string; day: string }[] {
  const result: { date: string; day: string }[] = [];
  const cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const dayIdx = cur.getDay();
    if (dayIdx !== 0) {
      result.push({
        date: cur.toISOString().slice(0, 10),
        day: DAYS[dayIdx],
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Local smart scheduling fallback.
 * - Subjects distributed evenly across dates
 * - Avoids same subject name on same day (teacher proxy)
 */
function buildSmartGrid(
  classes: ClassLevel[],
  classSubjects: Record<ClassLevel, string[]>,
  dates: { date: string; day: string }[],
): Record<ClassLevel, string[]> {
  const grid: Record<ClassLevel, string[]> = {} as Record<ClassLevel, string[]>;
  const dateSubjectUsed: Record<number, Set<string>> = {};
  for (let i = 0; i < dates.length; i++) {
    dateSubjectUsed[i] = new Set<string>();
  }
  for (const cls of classes) {
    const subjects = [...(classSubjects[cls] ?? [])];
    if (subjects.length === 0) {
      grid[cls] = dates.map(() => "—");
      continue;
    }
    const assigned: string[] = new Array(dates.length).fill("");
    const subjectQueue = [...subjects];
    let qi = 0;
    for (let di = 0; di < dates.length; di++) {
      let found = false;
      for (let attempt = 0; attempt < subjectQueue.length; attempt++) {
        const candidate = subjectQueue[(qi + attempt) % subjectQueue.length];
        if (!dateSubjectUsed[di].has(candidate)) {
          assigned[di] = candidate;
          dateSubjectUsed[di].add(candidate);
          qi = (qi + attempt + 1) % subjectQueue.length;
          found = true;
          break;
        }
      }
      if (!found) {
        assigned[di] = subjectQueue[qi % subjectQueue.length];
        dateSubjectUsed[di].add(assigned[di]);
        qi = (qi + 1) % subjectQueue.length;
      }
    }
    grid[cls] = assigned;
  }
  return grid;
}

// ─── Smart Timetable Tab ──────────────────────────────────────────────────────
interface ClassSubjectState {
  subjects: string[];
}

type TimetableGrid = Record<ClassLevel, string[]>;

function SmartTimetableTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const [view, setView] = useState<"form" | "generated">("form");

  // Real subjects from backend
  const { data: allSubjects = [], isLoading: loadingSubjects } = useSubjects();

  // Backend hooks
  const { data: savedTimetables = [], isLoading: loadingList } =
    useGetSmartExamTimetables(sessionId);
  const createMutation = useCreateSmartExamTimetable();
  const updateMutation = useUpdateSmartExamTimetable();
  const deleteMutation = useDeleteSmartExamTimetable();
  const generateMutation = useGenerateSmartExamSchedule();

  // Form fields
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [participatingClasses, setParticipatingClasses] = useState<
    ClassLevel[]
  >([]);
  const [classSubjects, setClassSubjects] = useState<
    Record<ClassLevel, ClassSubjectState>
  >({} as Record<ClassLevel, ClassSubjectState>);
  const [newSubjectInputs, setNewSubjectInputs] = useState<
    Record<ClassLevel, string>
  >({} as Record<ClassLevel, string>);

  // Generated grid
  const [dates, setDates] = useState<{ date: string; day: string }[]>([]);
  const [grid, setGrid] = useState<TimetableGrid>({} as TimetableGrid);

  // Drag state
  const dragInfo = useRef<{ cls: ClassLevel; fromIdx: number } | null>(null);
  const [dragOver, setDragOver] = useState<{
    cls: ClassLevel;
    toIdx: number;
  } | null>(null);

  // Current editing id (empty string = new)
  const [editingId, setEditingId] = useState<string>("");

  // Get real subjects for a class from backend data
  function getSubjectsForClass(cls: ClassLevel): string[] {
    return allSubjects.filter((s) => s.classLevel === cls).map((s) => s.name);
  }

  function toggleClass(cls: ClassLevel) {
    setParticipatingClasses((prev) => {
      if (prev.includes(cls)) return prev.filter((c) => c !== cls);
      // Pre-fill with real backend subjects for this class
      if (!classSubjects[cls]) {
        const realSubjects = getSubjectsForClass(cls);
        setClassSubjects((cs) => ({
          ...cs,
          [cls]: { subjects: realSubjects },
        }));
      }
      return [...prev, cls];
    });
  }

  function addSubject(cls: ClassLevel) {
    const val = (newSubjectInputs[cls] ?? "").trim();
    if (!val) return;
    setClassSubjects((cs) => ({
      ...cs,
      [cls]: { subjects: [...(cs[cls]?.subjects ?? []), val] },
    }));
    setNewSubjectInputs((ni) => ({ ...ni, [cls]: "" }));
  }

  function removeSubject(cls: ClassLevel, idx: number) {
    setClassSubjects((cs) => ({
      ...cs,
      [cls]: { subjects: cs[cls].subjects.filter((_, i) => i !== idx) },
    }));
  }

  async function generateTimetable() {
    if (
      !examName ||
      !startDate ||
      !endDate ||
      participatingClasses.length === 0
    ) {
      toast.error(
        "Please fill all required fields and select at least one class.",
      );
      return;
    }
    const d = getDatesInRange(startDate, endDate);
    if (d.length === 0) {
      toast.error("No valid exam dates in the selected range.");
      return;
    }
    setDates(d);

    const subjectsPerClass: Record<string, string[]> = {};
    for (const cls of participatingClasses) {
      subjectsPerClass[cls] = classSubjects[cls]?.subjects ?? [];
    }

    let newGrid: TimetableGrid | null = null;

    try {
      const backendEntries = await generateMutation.mutateAsync({
        examName,
        examStartDate: startDate,
        examEndDate: endDate,
        startTime,
        endTime,
        participatingClasses,
        subjectsPerClass,
        sessionId,
      });

      if (backendEntries && backendEntries.length > 0) {
        const g: TimetableGrid = {} as TimetableGrid;
        for (const cls of participatingClasses) {
          const entriesForCls = backendEntries
            .filter((e) => e.classLevel === cls)
            .sort((a, b) => a.position - b.position);
          if (entriesForCls.length > 0) {
            g[cls] = entriesForCls.map((e) => e.subjectName);
          }
        }
        if (Object.keys(g).length > 0) {
          newGrid = g;
        }
      }
    } catch {
      // Fall through to local algorithm
    }

    // Local smart scheduling fallback
    if (!newGrid) {
      const subjectsOnly: Record<ClassLevel, string[]> = {} as Record<
        ClassLevel,
        string[]
      >;
      for (const cls of participatingClasses) {
        subjectsOnly[cls] = classSubjects[cls]?.subjects ?? [];
      }
      newGrid = buildSmartGrid(participatingClasses, subjectsOnly, d);
    }

    setGrid(newGrid);
    setView("generated");
  }

  function regenerateTimetable() {
    if (dates.length === 0) {
      void generateTimetable();
      return;
    }
    const subjectsOnly: Record<ClassLevel, string[]> = {} as Record<
      ClassLevel,
      string[]
    >;
    for (const cls of participatingClasses) {
      subjectsOnly[cls] = classSubjects[cls]?.subjects ?? [];
    }
    const newGrid = buildSmartGrid(participatingClasses, subjectsOnly, dates);
    setGrid(newGrid);
    toast.success("Timetable regenerated with new arrangement!");
  }

  // Drag handlers
  const handleDragStart = useCallback((cls: ClassLevel, idx: number) => {
    dragInfo.current = { cls, fromIdx: idx };
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, cls: ClassLevel, toIdx: number) => {
      e.preventDefault();
      setDragOver({ cls, toIdx });
    },
    [],
  );

  const handleDrop = useCallback((cls: ClassLevel, toIdx: number) => {
    const info = dragInfo.current;
    if (!info || info.cls !== cls || info.fromIdx === toIdx) {
      setDragOver(null);
      dragInfo.current = null;
      return;
    }
    setGrid((g) => {
      const col = [...(g[cls] ?? [])];
      const [moved] = col.splice(info.fromIdx, 1);
      col.splice(toIdx, 0, moved);
      return { ...g, [cls]: col };
    });
    setDragOver(null);
    dragInfo.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragOver(null);
    dragInfo.current = null;
  }, []);

  function buildEntries(): SmartTimetableEntry[] {
    const entries: SmartTimetableEntry[] = [];
    for (const cls of participatingClasses) {
      const col = grid[cls] ?? [];
      col.forEach((subjectName, pos) => {
        const d = dates[pos];
        if (!d) return;
        entries.push({
          date: d.date,
          day: d.day,
          classLevel: cls,
          subjectName,
          position: pos,
          isLocked: false,
        });
      });
    }
    return entries;
  }

  async function saveTimetable() {
    const entries = buildEntries();
    const payload = {
      examName,
      startDate,
      endDate,
      startTime,
      endTime,
      participatingClasses,
      entries,
      status: "Saved",
    };

    if (editingId) {
      await updateMutation.mutateAsync({ ...payload, id: editingId });
      toast.success("Timetable updated successfully!");
    } else {
      const saved = await createMutation.mutateAsync(payload);
      setEditingId(saved.id);
      toast.success("Timetable saved successfully!");
    }
  }

  async function deleteTimetable(id: string) {
    await deleteMutation.mutateAsync(id);
    if (editingId === id) resetForm();
    toast.success("Timetable deleted.");
  }

  function exportTimetable(tt: SmartExamTimetable) {
    const dateSet: string[] = [];
    const dateDay: Record<string, string> = {};
    const dataMap: Record<string, Record<ClassLevel, string>> = {};

    for (const entry of tt.entries) {
      if (!dateSet.includes(entry.date)) dateSet.push(entry.date);
      dateDay[entry.date] = entry.day;
      if (!dataMap[entry.date])
        dataMap[entry.date] = {} as Record<ClassLevel, string>;
      dataMap[entry.date][entry.classLevel] = entry.subjectName;
    }

    dateSet.sort();
    const rows = dateSet.map((d) => {
      const row: Record<string, string> = {
        Date: formatDateShort(d),
        Day: dateDay[d] ?? "",
      };
      for (const cls of tt.participatingClasses) {
        row[CLASS_LABELS[cls]] = dataMap[d]?.[cls] ?? "";
      }
      return row;
    });

    downloadCSV(rows, `exam-timetable-${tt.examName.replace(/\s+/g, "-")}.csv`);
    toast.success("Timetable exported as CSV!");
  }

  function exportCurrentGrid() {
    const entries = buildEntries();
    exportTimetable({
      id: editingId || "preview",
      examName,
      startDate,
      endDate,
      startTime,
      endTime,
      participatingClasses,
      entries,
      status: "Preview",
    });
  }

  function resetForm() {
    setExamName("");
    setStartDate("");
    setEndDate("");
    setStartTime("09:00");
    setEndTime("12:00");
    setParticipatingClasses([]);
    setClassSubjects({} as Record<ClassLevel, ClassSubjectState>);
    setDates([]);
    setGrid({} as TimetableGrid);
    setEditingId("");
    setView("form");
  }

  function loadTimetableForEdit(tt: SmartExamTimetable) {
    setExamName(tt.examName);
    setStartDate(tt.startDate);
    setEndDate(tt.endDate);
    setStartTime(tt.startTime);
    setEndTime(tt.endTime);
    setParticipatingClasses(tt.participatingClasses);
    const cs: Record<ClassLevel, ClassSubjectState> = {} as Record<
      ClassLevel,
      ClassSubjectState
    >;
    for (const cls of tt.participatingClasses) {
      const subjects = [
        ...new Set(
          tt.entries
            .filter((e) => e.classLevel === cls)
            .map((e) => e.subjectName),
        ),
      ];
      cs[cls] = { subjects };
    }
    setClassSubjects(cs);
    const dMap: Record<string, string> = {};
    for (const e of tt.entries) dMap[e.date] = e.day;
    const sortedDates = Object.keys(dMap).sort();
    const d = sortedDates.map((date) => ({ date, day: dMap[date] }));
    setDates(d);
    const g: TimetableGrid = {} as TimetableGrid;
    for (const cls of tt.participatingClasses) {
      const entriesForCls = tt.entries
        .filter((e) => e.classLevel === cls)
        .sort((a, b) => a.position - b.position);
      g[cls] = entriesForCls.map((e) => e.subjectName);
    }
    setGrid(g);
    setEditingId(tt.id);
    setView("generated");
  }

  const isGenerating = generateMutation.isPending;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ─── Form View ───────────────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">
              Create Exam Timetable
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure exam details — AI will generate a conflict-free schedule
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={resetForm}
            data-ocid="smart.timetable.reset_button"
          >
            <RefreshCw size={14} className="mr-1.5" /> Reset
          </Button>
        </div>

        {/* Basic Details */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <p className="font-semibold text-foreground text-sm font-display flex items-center gap-2">
            <CalendarDays size={15} className="text-primary" /> Exam Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>
                Exam Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. Annual Exam 2025-26"
                data-ocid="smart.timetable.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <DateInput
                label="Start Date"
                required
                value={startDate}
                onChange={setStartDate}
                data-ocid="smart.timetable.start_date.input"
              />
            </div>
            <div className="space-y-1.5">
              <DateInput
                label="End Date"
                required
                value={endDate}
                onChange={setEndDate}
                data-ocid="smart.timetable.end_date.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Exam Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                data-ocid="smart.timetable.start_time.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Exam End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                data-ocid="smart.timetable.end_time.input"
              />
            </div>
          </div>
        </div>

        {/* Participating Classes */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <p className="font-semibold text-foreground text-sm font-display flex items-center gap-2">
            <Award size={15} className="text-primary" /> Participating Classes
          </p>
          <div
            className="grid grid-cols-3 sm:grid-cols-5 gap-3"
            data-ocid="smart.timetable.classes.list"
          >
            {CLASS_ORDER.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => toggleClass(cls)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-left ${
                  participatingClasses.includes(cls)
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:bg-muted/30 text-foreground"
                }`}
                data-ocid={`smart.timetable.class.${cls}`}
              >
                <Checkbox
                  id={`cls-${cls}`}
                  checked={participatingClasses.includes(cls)}
                  onCheckedChange={() => toggleClass(cls)}
                  className="shrink-0 pointer-events-none"
                  aria-label={CLASS_LABELS[cls]}
                />
                <span className="text-xs truncate">{CLASS_LABELS[cls]}</span>
              </button>
            ))}
          </div>
          {participatingClasses.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {participatingClasses.length} class
              {participatingClasses.length > 1 ? "es" : ""} selected
            </p>
          )}
        </div>

        {/* Subjects per class — real data from backend */}
        {participatingClasses.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground text-sm font-display flex items-center gap-2">
                <FileText size={15} className="text-primary" /> Subjects Per
                Class
                {loadingSubjects && (
                  <Loader2
                    size={13}
                    className="animate-spin text-muted-foreground"
                  />
                )}
              </p>
              <span className="text-xs text-muted-foreground">
                Pre-filled from real subject assignments — add or remove as
                needed
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {participatingClasses.map((cls) => {
                const subjects = classSubjects[cls]?.subjects ?? [];
                return (
                  <div
                    key={cls}
                    className="space-y-2 rounded-lg border border-border p-3 bg-muted/20"
                  >
                    <p className="font-semibold text-xs text-primary uppercase tracking-wide">
                      {CLASS_LABELS[cls]}
                    </p>
                    <div className="flex flex-wrap gap-1.5 min-h-8">
                      {subjects.map((subj, i) => (
                        <span
                          key={`${cls}-subj-${subj}`}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(subj)}`}
                        >
                          {subj}
                          <button
                            type="button"
                            onClick={() => removeSubject(cls, i)}
                            className="ml-0.5 opacity-60 hover:opacity-100"
                            aria-label={`Remove ${subj}`}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      {subjects.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">
                          No subjects — add below
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSubjectInputs[cls] ?? ""}
                        onChange={(e) =>
                          setNewSubjectInputs((ni) => ({
                            ...ni,
                            [cls]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addSubject(cls);
                        }}
                        placeholder="Add subject…"
                        className="h-7 text-xs"
                        data-ocid={`smart.timetable.subject.input.${cls}`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        onClick={() => addSubject(cls)}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Scheduling Info */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3 text-xs text-primary">
          <CalendarDays size={14} className="shrink-0 mt-0.5" />
          <span>
            <b>Smart Scheduling:</b> Subjects will be automatically spread
            across exam dates (Mon–Sat), with teacher-level conflict detection —
            ensuring no two classes share the same teacher on the same day. You
            can drag subjects to rearrange after generation.
          </span>
        </div>

        {/* Generate Button */}
        <Button
          size="lg"
          className="w-full font-semibold"
          onClick={generateTimetable}
          disabled={
            !examName ||
            !startDate ||
            !endDate ||
            participatingClasses.length === 0 ||
            isGenerating
          }
          data-ocid="smart.timetable.generate_button"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <CalendarDays size={16} className="mr-2" /> Generate Smart
              Timetable
            </>
          )}
        </Button>

        {/* Saved Timetables List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
            <p className="font-semibold text-foreground font-display">
              Saved Exam Timetables
            </p>
            <Badge variant="secondary">{savedTimetables.length}</Badge>
          </div>
          {loadingList ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : savedTimetables.length === 0 ? (
            <p
              className="text-center text-sm text-muted-foreground py-8"
              data-ocid="smart.timetable.saved.empty_state"
            >
              No saved timetables yet. Generate one above.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {savedTimetables.map((tt, i) => (
                <div
                  key={tt.id}
                  className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-muted/10"
                  data-ocid={`smart.timetable.saved.item.${i + 1}`}
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {tt.examName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateShort(tt.startDate)} –{" "}
                      {formatDateShort(tt.endDate)} ·{" "}
                      {tt.participatingClasses.length} classes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{tt.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadTimetableForEdit(tt)}
                      data-ocid={`smart.timetable.edit_button.${i + 1}`}
                    >
                      <Pencil size={12} className="mr-1" /> View/Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportTimetable(tt)}
                      data-ocid={`smart.timetable.export_button.${i + 1}`}
                    >
                      <Download size={12} className="mr-1" /> Export
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteTimetable(tt.id)}
                      disabled={deleteMutation.isPending}
                      data-ocid={`smart.timetable.delete_button.${i + 1}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Generated Timetable View ────────────────────────────────────────────
  const sortedClasses = participatingClasses.filter((c) => grid[c]);

  return (
    <div className="p-6 space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            {examName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDateShort(startDate)} – {formatDateShort(endDate)} ·{" "}
            {startTime}–{endTime} · {dates.length} exam days ·{" "}
            {sortedClasses.length} classes
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setView("form")}
            data-ocid="smart.timetable.back_button"
          >
            ← Back to Form
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={regenerateTimetable}
            disabled={isGenerating}
            data-ocid="smart.timetable.regenerate_button"
          >
            <RefreshCw
              size={13}
              className={`mr-1.5 ${isGenerating ? "animate-spin" : ""}`}
            />{" "}
            Regenerate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={exportCurrentGrid}
            data-ocid="smart.timetable.export_current_button"
          >
            <Download size={13} className="mr-1.5" /> Export CSV
          </Button>
          <Button
            size="sm"
            onClick={saveTimetable}
            disabled={isSaving}
            data-ocid="smart.timetable.save_button"
          >
            {isSaving ? (
              <RefreshCw size={13} className="mr-1.5 animate-spin" />
            ) : (
              <Save size={13} className="mr-1.5" />
            )}
            {editingId ? "Update Timetable" : "Save Timetable"}
          </Button>
        </div>
      </div>

      {/* Drag hint */}
      <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary">
        <GripVertical size={13} />
        <span>
          Drag subject cells up/down within each class column to rearrange. Date
          and Day columns are locked. Click <b>Save</b> to persist changes.
        </span>
      </div>

      {/* Timetable Grid */}
      <div className="rounded-xl border border-border bg-card overflow-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap sticky left-0 bg-muted/40 z-[5]">
                Date
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">
                Day
              </th>
              {sortedClasses.map((cls) => (
                <th
                  key={cls}
                  className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[130px]"
                >
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                    {CLASS_LABELS[cls]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((d, rowIdx) => (
              <tr
                key={d.date}
                className={`border-b border-border last:border-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                data-ocid={`smart.timetable.row.${rowIdx + 1}`}
              >
                {/* Locked date cell */}
                <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono whitespace-nowrap sticky left-0 bg-muted/20 border-r border-border z-[5]">
                  {formatDateShort(d.date)}
                </td>
                {/* Locked day cell */}
                <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap bg-muted/10">
                  {d.day}
                </td>
                {/* Draggable subject cells per class */}
                {sortedClasses.map((cls) => {
                  const subject = grid[cls]?.[rowIdx] ?? "—";
                  const isDraggingOver =
                    dragOver?.cls === cls && dragOver?.toIdx === rowIdx;
                  const colorClass =
                    subject !== "—"
                      ? getSubjectColor(subject)
                      : "text-muted-foreground";

                  return (
                    <td
                      key={cls}
                      className={`px-3 py-2 text-center transition-colors ${isDraggingOver ? "bg-primary/10" : ""}`}
                      onDragOver={(e) => handleDragOver(e, cls, rowIdx)}
                      onDrop={() => handleDrop(cls, rowIdx)}
                      data-ocid={`smart.timetable.cell.${cls}.${rowIdx + 1}`}
                    >
                      {subject !== "—" ? (
                        <div
                          draggable
                          onDragStart={() => handleDragStart(cls, rowIdx)}
                          onDragEnd={handleDragEnd}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-grab active:cursor-grabbing select-none ${colorClass} border border-current/20 hover:shadow-sm transition-all`}
                          title="Drag to reorder"
                          data-ocid={`smart.timetable.subject.${cls}.${rowIdx + 1}`}
                        >
                          <GripVertical
                            size={10}
                            className="opacity-50 shrink-0"
                          />
                          {subject}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Saved Timetables Quick List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden mt-4">
        <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
          <p className="font-semibold text-foreground font-display text-sm">
            Saved Timetables
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetForm}
            data-ocid="smart.timetable.new_button"
          >
            <Plus size={13} className="mr-1" /> New Timetable
          </Button>
        </div>
        {loadingList ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : savedTimetables.length === 0 ? (
          <p
            className="text-center text-sm text-muted-foreground py-6"
            data-ocid="smart.timetable.list.empty_state"
          >
            No other saved timetables.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {savedTimetables.map((tt, i) => (
              <div
                key={tt.id}
                className={`px-5 py-3 flex items-center justify-between gap-4 ${tt.id === editingId ? "bg-primary/5" : "hover:bg-muted/10"}`}
              >
                <div>
                  <p className="font-medium text-sm text-foreground flex items-center gap-2">
                    {tt.examName}
                    {tt.id === editingId && (
                      <Badge variant="default" className="text-xs">
                        Editing
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateShort(tt.startDate)} –{" "}
                    {formatDateShort(tt.endDate)} ·{" "}
                    {tt.participatingClasses.length} classes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadTimetableForEdit(tt)}
                    data-ocid={`smart.timetable.list.edit.${i + 1}`}
                  >
                    <Pencil size={12} className="mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportTimetable(tt)}
                    data-ocid={`smart.timetable.list.export.${i + 1}`}
                  >
                    <Download size={12} className="mr-1" /> Export
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteTimetable(tt.id)}
                    disabled={deleteMutation.isPending}
                    data-ocid={`smart.timetable.list.delete.${i + 1}`}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Grades helper ────────────────────────────────────────────────────────────
function getGrade(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}

// ─── Syllabus Q&A Tab ────────────────────────────────────────────────────────
interface QAPair {
  id: string;
  question: string;
  answer: string;
}

/** Built-in smart Q&A generator — no external API needed.
 * Generates questions from chapter text using pattern matching on sentences.
 */
function generateQAFromText(text: string): QAPair[] {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) return [];

  const pairs: QAPair[] = [];

  // Pattern 1: Definition sentences ("X is Y", "X are Y", "X refers to Y")
  for (const sent of sentences) {
    if (pairs.length >= 4) break;
    const defMatch = sent.match(
      /^([A-Z][^,]+?)\s+(?:is|are|refers to|means|defines?)\s+(.+)$/i,
    );
    if (defMatch) {
      const subject = defMatch[1].trim();
      const definition = defMatch[2].trim();
      pairs.push({
        id: generateId(),
        question: `What is ${subject}?`,
        answer: `${subject} is ${definition}.`,
      });
    }
  }

  // Pattern 2: Factual "The [noun] of [topic] is [value]" statements
  for (const sent of sentences) {
    if (pairs.length >= 7) break;
    const factMatch = sent.match(
      /(?:The|A|An)\s+([a-z]+(?:\s+[a-z]+)?)\s+of\s+([^,]+?)\s+is\s+([^,]+)/i,
    );
    if (factMatch) {
      const prop = factMatch[1];
      const entity = factMatch[2];
      const value = factMatch[3];
      pairs.push({
        id: generateId(),
        question: `What is the ${prop} of ${entity}?`,
        answer: `The ${prop} of ${entity} is ${value}.`,
      });
    }
  }

  // Pattern 3: Generic comprehension — one question per sentence
  const verbs = [
    "Describe",
    "Explain",
    "Define",
    "Write about",
    "State",
    "Mention",
  ];
  const usedSentences = new Set<string>();
  for (const sent of sentences.slice(0, 12)) {
    if (pairs.length >= 10) break;
    if (usedSentences.has(sent)) continue;
    const words = sent.split(" ");
    const topic = words.slice(0, 4).join(" ");
    const verb = verbs[pairs.length % verbs.length];
    pairs.push({
      id: generateId(),
      question: `${verb}: "${topic}…"`,
      answer: `${sent}.`,
    });
    usedSentences.add(sent);
  }

  return pairs.slice(0, 10);
}

function SyllabusQATab() {
  const [chapterTitle, setChapterTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [generatedQA, setGeneratedQA] = useState<QAPair[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    "draft" | "pending" | "approved"
  >("draft");

  function handleGenerate() {
    if (!contentText.trim()) {
      toast.error("Please enter chapter content first.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const qa = generateQAFromText(contentText);
      setGeneratedQA(qa);
      setIsGenerating(false);
      toast.success(`${qa.length} Q&A pairs generated from chapter content!`);
    }, 800);
  }

  function updateQA(id: string, field: "question" | "answer", value: string) {
    setGeneratedQA((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  }

  function removeQA(id: string) {
    setGeneratedQA((prev) => prev.filter((q) => q.id !== id));
  }

  function addManualQA() {
    setGeneratedQA((prev) => [
      ...prev,
      { id: generateId(), question: "", answer: "" },
    ]);
  }

  function submitForApproval() {
    if (!chapterTitle.trim()) {
      toast.error("Please enter a chapter title.");
      return;
    }
    if (generatedQA.length === 0) {
      toast.error("Generate or add at least one Q&A pair before submitting.");
      return;
    }
    setApprovalStatus("pending");
    toast.success(
      "Submitted for Principal approval. Students can view after approval.",
    );
  }

  const statusBadge = {
    draft: { label: "Draft", variant: "secondary" as const },
    pending: { label: "Pending Approval", variant: "outline" as const },
    approved: { label: "Approved", variant: "default" as const },
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Syllabus Content &amp; AI Q&amp;A
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload chapter content — AI generates Q&amp;A for students
          </p>
        </div>
        <Badge variant={statusBadge[approvalStatus].variant}>
          {statusBadge[approvalStatus].label}
        </Badge>
      </div>

      {/* Chapter Details */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="font-semibold text-foreground text-sm font-display flex items-center gap-2">
          <BookOpen size={15} className="text-primary" /> Chapter Details
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <Label>Chapter Title</Label>
            <Input
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. Chapter 3: Photosynthesis"
              data-ocid="syllabus.chapter_title.input"
            />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>Chapter Content</Label>
            <Textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={8}
              placeholder="Paste or type the chapter content here. The AI will generate questions and answers based on this text…"
              className="resize-none font-body text-sm"
              data-ocid="syllabus.content.textarea"
            />
            <p className="text-xs text-muted-foreground">
              {contentText.length} characters ·{" "}
              {contentText.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !contentText.trim()}
          data-ocid="syllabus.generate_button"
        >
          {isGenerating ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles size={15} className="mr-2" /> Generate Q&amp;A with AI
            </>
          )}
        </Button>
      </div>

      {/* Generated Q&A list */}
      {generatedQA.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
            <p className="font-semibold text-foreground font-display text-sm">
              Generated Q&amp;A ({generatedQA.length} pairs)
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={addManualQA}
              data-ocid="syllabus.add_qa_button"
            >
              <Plus size={13} className="mr-1" /> Add Manually
            </Button>
          </div>
          <div className="divide-y divide-border">
            {generatedQA.map((qa, i) => (
              <div
                key={qa.id}
                className="p-4 space-y-3"
                data-ocid={`syllabus.qa.item.${i + 1}`}
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    {editingId === qa.id ? (
                      <>
                        <div className="space-y-1">
                          <Label className="text-xs">Question</Label>
                          <Input
                            value={qa.question}
                            onChange={(e) =>
                              updateQA(qa.id, "question", e.target.value)
                            }
                            data-ocid={`syllabus.qa.question.${i + 1}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Answer</Label>
                          <Textarea
                            value={qa.answer}
                            onChange={(e) =>
                              updateQA(qa.id, "answer", e.target.value)
                            }
                            rows={3}
                            data-ocid={`syllabus.qa.answer.${i + 1}`}
                          />
                        </div>
                        <Button size="sm" onClick={() => setEditingId(null)}>
                          Done
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-foreground">
                          Q. {qa.question}
                        </p>
                        <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                          <span className="text-xs font-semibold text-primary mr-1">
                            Ans:
                          </span>
                          {qa.answer}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() =>
                        setEditingId(editingId === qa.id ? null : qa.id)
                      }
                      data-ocid={`syllabus.qa.edit_button.${i + 1}`}
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => removeQA(qa.id)}
                      data-ocid={`syllabus.qa.delete_button.${i + 1}`}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit for approval */}
      {generatedQA.length > 0 && approvalStatus === "draft" && (
        <Button
          className="w-full"
          onClick={submitForApproval}
          data-ocid="syllabus.submit_button"
        >
          <CheckCircle2 size={15} className="mr-2" /> Submit for Principal
          Approval
        </Button>
      )}

      {approvalStatus === "pending" && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-4 py-3 flex items-center gap-3 text-sm text-amber-800 dark:text-amber-300">
          <Clock size={15} className="shrink-0" />
          <span>
            <b>Awaiting Principal Approval.</b> Once approved, students can
            access this Q&amp;A to verify their notebook answers.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Online Exams Tab ──────────────────────────────────────────────────────────
interface OnlineExamTabState {
  view: "list" | "create" | "take";
  selectedExam: OnlineExam | null;
}

function OnlineExamsTab() {
  const [exams, setExams] = useState<OnlineExam[]>([]);
  const [state, setState] = useState<OnlineExamTabState>({
    view: "list",
    selectedExam: null,
  });
  const [examForm, setExamForm] = useState({
    title: "",
    classLevel: "Class9" as ClassLevel,
    subject: "",
    duration: "30",
  });
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [qForm, setQForm] = useState({
    text: "",
    opts: ["", "", "", ""],
    correct: 0,
    marks: 2,
  });
  const [addQOpen, setAddQOpen] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function startCreate() {
    setExamForm({
      title: "",
      classLevel: "Class9",
      subject: "",
      duration: "30",
    });
    setQuestions([]);
    setState({ view: "create", selectedExam: null });
  }

  function addQuestion() {
    if (!qForm.text) return;
    const q: MCQQuestion = {
      id: generateId(),
      questionText: qForm.text,
      options: qForm.opts,
      correctOption: qForm.correct,
      marks: qForm.marks,
    };
    setQuestions((qs) => [...qs, q]);
    setQForm({ text: "", opts: ["", "", "", ""], correct: 0, marks: 2 });
    setAddQOpen(false);
  }

  function saveExam() {
    const exam: OnlineExam = {
      id: generateId(),
      title: examForm.title,
      subjectId: generateId(),
      classLevel: examForm.classLevel,
      durationMinutes: Number(examForm.duration),
      questions,
      scheduledAt: new Date().toISOString(),
      isActive: true,
      createdBy: "Admin",
    };
    setExams((e) => [...e, exam]);
    setState({ view: "list", selectedExam: null });
  }

  function takeExam(exam: OnlineExam) {
    setAnswers(new Array(exam.questions.length).fill(-1));
    setSubmitted(false);
    setState({ view: "take", selectedExam: exam });
  }

  if (state.view === "take" && state.selectedExam) {
    const exam = state.selectedExam;
    const score = submitted
      ? exam.questions.reduce(
          (acc, q, i) => acc + (answers[i] === q.correctOption ? q.marks : 0),
          0,
        )
      : 0;
    const maxScore = exam.questions.reduce((acc, q) => acc + q.marks, 0);
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">
              {exam.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {exam.questions.length} questions · {exam.durationMinutes} min
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!submitted && (
              <div className="flex items-center gap-1 text-sm bg-accent/10 text-accent border border-accent/30 rounded-lg px-3 py-1.5">
                <TimerIcon size={14} />
                <span className="font-mono font-semibold">
                  {exam.durationMinutes}:00
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState({ view: "list", selectedExam: null })}
              data-ocid="exam.take.back_button"
            >
              Back
            </Button>
          </div>
        </div>
        {submitted ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-green-500" />
            <h3 className="font-display text-xl font-bold text-foreground">
              Exam Submitted!
            </h3>
            <p className="text-muted-foreground">You scored</p>
            <p className="text-4xl font-bold text-primary font-display">
              {score}
              <span className="text-xl text-muted-foreground">/{maxScore}</span>
            </p>
            <p className="text-lg font-semibold">
              {((score / maxScore) * 100).toFixed(1)}% · Grade{" "}
              {getGrade((score / maxScore) * 100)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {exam.questions.map((q, qi) => (
              <div
                key={q.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
                data-ocid={`exam.take.question.${qi + 1}`}
              >
                <p className="font-semibold text-foreground text-sm">
                  Q{qi + 1}. {q.questionText}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({q.marks} marks)
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button
                      type="button"
                      key={`${q.id}-opt-${oi}`}
                      onClick={() =>
                        setAnswers((a) => {
                          const n = [...a];
                          n[qi] = oi;
                          return n;
                        })
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${answers[qi] === oi ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-muted/30"}`}
                      data-ocid={`exam.take.option.${qi + 1}.${oi + 1}`}
                    >
                      <Circle
                        size={14}
                        className={
                          answers[qi] === oi
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }
                      />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => setSubmitted(true)}
              data-ocid="exam.take.submit_button"
            >
              Submit Exam
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (state.view === "create") {
    return (
      <div className="p-6 space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-foreground">
            Create Online Exam
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState({ view: "list", selectedExam: null })}
            data-ocid="exam.create.back_button"
          >
            Cancel
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label>Exam Title</Label>
              <Input
                value={examForm.title}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Math Quiz - Chapter 3"
                data-ocid="exam.create.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select
                value={examForm.classLevel}
                onValueChange={(v) =>
                  setExamForm((f) => ({ ...f, classLevel: v as ClassLevel }))
                }
              >
                <SelectTrigger data-ocid="exam.create.class.select">
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
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input
                value={examForm.subject}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="e.g. Mathematics"
                data-ocid="exam.create.subject.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (minutes)</Label>
              <Input
                value={examForm.duration}
                onChange={(e) =>
                  setExamForm((f) => ({ ...f, duration: e.target.value }))
                }
                placeholder="30"
                data-ocid="exam.create.duration.input"
              />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
            <p className="font-semibold text-foreground">
              {questions.length} Questions Added
            </p>
            <Button
              size="sm"
              onClick={() => setAddQOpen(true)}
              data-ocid="exam.create.add_question_button"
            >
              <Plus size={13} className="mr-1" /> Add MCQ
            </Button>
          </div>
          {questions.length === 0 ? (
            <p
              className="text-center text-sm text-muted-foreground py-8"
              data-ocid="exam.create.questions.empty_state"
            >
              No questions yet. Add MCQ questions above.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="px-5 py-3 flex items-start justify-between gap-4"
                  data-ocid={`exam.create.question.${i + 1}`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Q{i + 1}. {q.questionText}
                    </p>
                    <div className="flex gap-3 mt-1">
                      {q.options.map((o, oi) => (
                        <span
                          key={`${q.id}-opt-display-${oi}`}
                          className={`text-xs px-2 py-0.5 rounded ${
                            oi === q.correctOption
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-destructive hover:text-destructive"
                    onClick={() =>
                      setQuestions((qs) => qs.filter((x) => x.id !== q.id))
                    }
                    data-ocid={`exam.create.delete_question.${i + 1}`}
                  >
                    <X size={13} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={saveExam}
          disabled={!examForm.title || questions.length === 0}
          data-ocid="exam.create.submit_button"
        >
          Save &amp; Publish Exam
        </Button>

        <Dialog open={addQOpen} onOpenChange={setAddQOpen}>
          <DialogContent className="z-[200]" data-ocid="exam.question.dialog">
            <DialogHeader>
              <DialogTitle>Add MCQ Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Question</Label>
                <Textarea
                  value={qForm.text}
                  onChange={(e) =>
                    setQForm((f) => ({ ...f, text: e.target.value }))
                  }
                  placeholder="Enter question text"
                  data-ocid="exam.question.text.textarea"
                />
              </div>
              {(["A", "B", "C", "D"] as const).map((label, oi) => (
                <div key={label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={qForm.correct === oi}
                    onChange={() => setQForm((f) => ({ ...f, correct: oi }))}
                    className="accent-primary"
                    data-ocid={`exam.question.correct.${oi + 1}`}
                  />
                  <Input
                    value={qForm.opts[oi]}
                    onChange={(e) => {
                      const opts = [...qForm.opts];
                      opts[oi] = e.target.value;
                      setQForm((f) => ({ ...f, opts }));
                    }}
                    placeholder={`Option ${oi + 1}`}
                    data-ocid={`exam.question.option.${oi + 1}`}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label>Marks</Label>
                <Input
                  value={qForm.marks}
                  onChange={(e) =>
                    setQForm((f) => ({ ...f, marks: Number(e.target.value) }))
                  }
                  placeholder="2"
                  data-ocid="exam.question.marks.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddQOpen(false)}
                data-ocid="exam.question.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={addQuestion}
                data-ocid="exam.question.submit_button"
              >
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {exams.length} exams configured
        </p>
        <Button
          size="sm"
          onClick={startCreate}
          data-ocid="exam.online.create_button"
        >
          <Plus size={14} className="mr-1.5" /> Create Exam
        </Button>
      </div>
      {exams.length === 0 ? (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="exam.online.empty_state"
        >
          <Play size={36} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground">No online exams yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first exam using the button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam, i) => (
            <div
              key={exam.id}
              className="rounded-xl border border-border bg-card p-4 flex items-center justify-between"
              data-ocid={`exam.online.item.${i + 1}`}
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{exam.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {CLASS_LABELS[exam.classLevel]} · {exam.questions.length}{" "}
                    questions · {exam.durationMinutes} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={exam.isActive ? "default" : "secondary"}>
                  {exam.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => takeExam(exam)}
                  data-ocid={`exam.online.take.${i + 1}`}
                >
                  <Play size={13} className="mr-1" /> Take Exam
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Paper Maker Tab ───────────────────────────────────────────────────────────
interface PaperSection {
  id: string;
  title: string;
  type: "MCQ" | "ShortAnswer" | "LongAnswer";
  questions: string[];
  marks: number;
}

function PaperMakerTab() {
  const [paper, setPaper] = useState({
    schoolName: "Shubh Public School",
    subject: "Mathematics",
    classLevel: "Class10" as ClassLevel,
    date: "",
    duration: "3 Hours",
    maxMarks: "100",
    instructions: "All questions are compulsory. Write clearly.",
  });
  const [sections, setSections] = useState<PaperSection[]>([
    {
      id: "sec1",
      title: "Section A – MCQ",
      type: "MCQ",
      questions: [
        "Which of the following is a prime number?",
        "Solve: x² − 5x + 6 = 0",
      ],
      marks: 20,
    },
    {
      id: "sec2",
      title: "Section B – Short Answer",
      type: "ShortAnswer",
      questions: [
        "Find the HCF and LCM of 24 and 36.",
        "Prove that √2 is irrational.",
      ],
      marks: 30,
    },
    {
      id: "sec3",
      title: "Section C – Long Answer",
      type: "LongAnswer",
      questions: [
        "A train travels 360 km in 4 hours. Find its speed in m/s.",
        "Construct a triangle ABC with AB = 5 cm, BC = 7 cm, CA = 6 cm.",
      ],
      marks: 50,
    },
  ]);
  const [addSecOpen, setAddSecOpen] = useState(false);
  const [secForm, setSecForm] = useState({
    title: "",
    type: "ShortAnswer" as PaperSection["type"],
    marks: "10",
  });
  const [preview, setPreview] = useState(false);

  function addSection() {
    setSections((s) => [
      ...s,
      {
        id: generateId(),
        title: secForm.title,
        type: secForm.type,
        questions: [],
        marks: Number(secForm.marks),
      },
    ]);
    setAddSecOpen(false);
    setSecForm({ title: "", type: "ShortAnswer", marks: "10" });
  }

  function addQuestion(secId: string, q: string) {
    setSections((ss) =>
      ss.map((s) =>
        s.id === secId ? { ...s, questions: [...s.questions, q] } : s,
      ),
    );
  }

  function removeQuestion(secId: string, qi: number) {
    setSections((ss) =>
      ss.map((s) =>
        s.id === secId
          ? { ...s, questions: s.questions.filter((_, i) => i !== qi) }
          : s,
      ),
    );
  }

  if (preview) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-foreground">
            Print Preview
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(false)}
              data-ocid="exam.paper.back_button"
            >
              Back to Editor
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              data-ocid="exam.paper.print_button"
            >
              <Printer size={14} className="mr-1.5" /> Print
            </Button>
          </div>
        </div>
        <div
          className="bg-background text-foreground rounded-xl border border-border shadow-sm p-10 max-w-3xl mx-auto font-serif text-sm"
          data-ocid="exam.paper.preview"
        >
          <div className="text-center border-b-2 border-foreground pb-3 mb-4">
            <h1 className="text-xl font-bold uppercase tracking-wide">
              {paper.schoolName}
            </h1>
            <h2 className="text-base font-semibold mt-1">Examination Paper</h2>
          </div>
          <div className="flex justify-between text-xs mb-4">
            <div>
              <b>Subject:</b> {paper.subject}
            </div>
            <div>
              <b>Class:</b> {CLASS_LABELS[paper.classLevel]}
            </div>
            <div>
              <b>Date:</b> {paper.date ? formatDate(paper.date) : "________"}
            </div>
            <div>
              <b>Time:</b> {paper.duration}
            </div>
            <div>
              <b>Max Marks:</b> {paper.maxMarks}
            </div>
          </div>
          <div className="border border-border rounded p-2 text-xs mb-4 italic">
            {paper.instructions}
          </div>
          {sections.map((_sec, _si) => (
            <div key={_sec.id} className="mb-4">
              <p className="font-bold text-sm border-b border-border pb-1 mb-2">
                {_sec.title}{" "}
                <span className="float-right">[{_sec.marks} Marks]</span>
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                {_sec.questions.map((q) => (
                  <li key={q} className="text-xs">
                    {q}
                  </li>
                ))}
                {_sec.questions.length === 0 && (
                  <li className="text-xs text-muted-foreground">
                    No questions added.
                  </li>
                )}
              </ol>
            </div>
          ))}
          <div className="border-t border-border mt-6 pt-2 text-xs text-center text-muted-foreground">
            — End of Paper —
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground">
          Examination Paper Maker
        </h2>
        <Button
          size="sm"
          onClick={() => setPreview(true)}
          data-ocid="exam.paper.preview_button"
        >
          <FileText size={14} className="mr-1.5" /> Preview &amp; Print
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="font-semibold text-foreground text-sm font-display">
          Paper Details
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <Label>School Name</Label>
            <Input
              value={paper.schoolName}
              onChange={(e) =>
                setPaper((p) => ({ ...p, schoolName: e.target.value }))
              }
              data-ocid="exam.paper.school.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input
              value={paper.subject}
              onChange={(e) =>
                setPaper((p) => ({ ...p, subject: e.target.value }))
              }
              data-ocid="exam.paper.subject.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Class</Label>
            <Select
              value={paper.classLevel}
              onValueChange={(v) =>
                setPaper((p) => ({ ...p, classLevel: v as ClassLevel }))
              }
            >
              <SelectTrigger data-ocid="exam.paper.class.select">
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
          <div className="space-y-1.5">
            <DateInput
              label="Exam Date"
              value={paper.date}
              onChange={(iso) => setPaper((p) => ({ ...p, date: iso }))}
              data-ocid="exam.paper.date.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Input
              value={paper.duration}
              onChange={(e) =>
                setPaper((p) => ({ ...p, duration: e.target.value }))
              }
              placeholder="3 Hours"
              data-ocid="exam.paper.duration.input"
            />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>Instructions</Label>
            <Textarea
              value={paper.instructions}
              onChange={(e) =>
                setPaper((p) => ({ ...p, instructions: e.target.value }))
              }
              rows={2}
              data-ocid="exam.paper.instructions.textarea"
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {sections.map((sec, si) => (
          <PaperSectionEditor
            key={sec.id}
            section={sec}
            index={si}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            onRemoveSection={(id) =>
              setSections((ss) => ss.filter((s) => s.id !== id))
            }
          />
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() => setAddSecOpen(true)}
        data-ocid="exam.paper.add_section_button"
      >
        <Plus size={14} className="mr-1.5" /> Add Section
      </Button>
      <Dialog open={addSecOpen} onOpenChange={setAddSecOpen}>
        <DialogContent
          className="z-[200]"
          data-ocid="exam.paper.section.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Section Title</Label>
              <Input
                value={secForm.title}
                onChange={(e) =>
                  setSecForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Section A – MCQ"
                data-ocid="exam.paper.section.title.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={secForm.type}
                onValueChange={(v) =>
                  setSecForm((f) => ({ ...f, type: v as PaperSection["type"] }))
                }
              >
                <SelectTrigger data-ocid="exam.paper.section.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                  <SelectItem value="LongAnswer">Long Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Total Marks</Label>
              <Input
                value={secForm.marks}
                onChange={(e) =>
                  setSecForm((f) => ({ ...f, marks: e.target.value }))
                }
                placeholder="10"
                data-ocid="exam.paper.section.marks.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddSecOpen(false)}
              data-ocid="exam.paper.section.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={addSection}
              data-ocid="exam.paper.section.submit_button"
            >
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PaperSectionEditor({
  section,
  index,
  onAddQuestion,
  onRemoveQuestion,
  onRemoveSection,
}: {
  section: PaperSection;
  index: number;
  onAddQuestion: (id: string, q: string) => void;
  onRemoveQuestion: (id: string, qi: number) => void;
  onRemoveSection: (id: string) => void;
}) {
  const [newQ, setNewQ] = useState("");
  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid={`exam.paper.section.${index + 1}`}
    >
      <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{section.title}</p>
          <p className="text-xs text-muted-foreground">
            {section.type} · {section.marks} marks
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onRemoveSection(section.id)}
          data-ocid={`exam.paper.delete_section.${index + 1}`}
        >
          <Trash2 size={13} />
        </Button>
      </div>
      <div className="p-4 space-y-2">
        {section.questions.map((q, qi) => (
          <div
            key={`${section.id}-q-${qi}`}
            className="flex items-center gap-2 group"
            data-ocid={`exam.paper.section.question.${index + 1}.${qi + 1}`}
          >
            <span className="text-xs text-muted-foreground w-5 shrink-0">
              {qi + 1}.
            </span>
            <span className="text-sm text-foreground flex-1">{q}</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
              onClick={() => onRemoveQuestion(section.id, qi)}
            >
              <X size={11} />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <Input
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Type a question and press Add"
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newQ) {
                onAddQuestion(section.id, newQ);
                setNewQ("");
              }
            }}
            data-ocid={`exam.paper.section.new_question.${index + 1}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (newQ) {
                onAddQuestion(section.id, newQ);
                setNewQ("");
              }
            }}
            data-ocid={`exam.paper.section.add_question.${index + 1}`}
          >
            <Plus size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ExaminationsPage() {
  const [activeTab, setActiveTab] = useState("timetable");
  const [showAdmitPrint, setShowAdmitPrint] = useState(false);
  const { data: allCertTemplates = [] } = useCertificateTemplates();

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="examinations.page">
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Examinations
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure exams, enter marks, view results &amp; performance
              reports
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="bg-card border-b px-4 flex-shrink-0 overflow-x-auto">
          <TabsList
            className="h-11 bg-transparent p-0 gap-0.5 flex-nowrap"
            data-ocid="examinations.tabs"
          >
            <TabsTrigger
              value="config"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.config.tab"
            >
              <Settings2 size={13} /> Exam Config
            </TabsTrigger>
            <TabsTrigger
              value="marks"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.marks.tab"
            >
              <ClipboardList size={13} /> Marks Entry
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.results.tab"
            >
              <Award size={13} /> Results
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.academic.tab"
            >
              <BarChart2 size={13} /> Performance
            </TabsTrigger>
            <TabsTrigger
              value="timetable"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.timetable.tab"
            >
              <Clock size={13} /> Exam Timetable
            </TabsTrigger>
            <TabsTrigger
              value="syllabus"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.syllabus.tab"
            >
              <BookOpen size={13} /> Syllabus Q&amp;A
            </TabsTrigger>
            <TabsTrigger
              value="online"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.online.tab"
            >
              <Play size={13} /> Online Exams
            </TabsTrigger>
            <TabsTrigger
              value="paper"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.paper.tab"
            >
              <FileText size={13} /> Paper Maker
            </TabsTrigger>
            <TabsTrigger
              value="admitcards"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap"
              data-ocid="examinations.admitcards.tab"
            >
              <Printer size={13} /> Admit Cards
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 min-h-0 overflow-auto bg-background">
          <TabsContent value="config" className="m-0 p-0">
            <ExamConfigTab />
          </TabsContent>
          <TabsContent value="marks" className="m-0 p-0">
            <MarksEntryTab />
          </TabsContent>
          <TabsContent value="results" className="m-0 p-0">
            <ExamResultsTab />
          </TabsContent>
          <TabsContent value="academic" className="m-0 p-0">
            <AcademicPerformanceTab />
          </TabsContent>
          <TabsContent value="timetable" className="m-0 p-0 h-full">
            <SmartTimetableTab />
          </TabsContent>
          <TabsContent value="syllabus" className="m-0 p-0 h-full">
            <SyllabusQATab />
          </TabsContent>
          <TabsContent value="online" className="m-0 p-0 h-full">
            <OnlineExamsTab />
          </TabsContent>
          <TabsContent value="paper" className="m-0 p-0 h-full">
            <PaperMakerTab />
          </TabsContent>
          <TabsContent value="admitcards" className="m-0 p-6">
            <div className="max-w-xl space-y-4">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  Print Admit Cards
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate and print admit cards for any student using your
                  Certificate Studio template.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <p className="text-sm text-foreground">
                  The admit card auto-fills student details and exam schedule
                  from the saved timetable. Customize the template in{" "}
                  <strong>Certificate Studio → Admit Card</strong>.
                </p>
                <Button
                  onClick={() => setShowAdmitPrint(true)}
                  data-ocid="examinations.admit_card.print_button"
                >
                  <Printer size={15} className="mr-2" />
                  Select Student &amp; Print Admit Card
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {showAdmitPrint &&
        (() => {
          const tmpl =
            allCertTemplates.find(
              (t) => t.templateType === "AdmitCard" && t.isDefault,
            ) ??
            allCertTemplates.find((t) => t.templateType === "AdmitCard") ??
            null;
          return (
            <GeneratePrintModal
              template={tmpl}
              forcedType="AdmitCard"
              onClose={() => setShowAdmitPrint(false)}
            />
          );
        })()}
    </div>
  );
}
