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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  generateQAFromContent,
  useApproveChapter,
  useChapters,
  useCreateChapter,
  useCreateSection,
  useCreateSubject,
  useDeleteChapter,
  useDeleteSection,
  useDeleteSubject,
  useGetAllSubjectClassMaps,
  useGetEnrolledCountByClass,
  useGetEnrolledCountBySection,
  useGetSections,
  useGetStudentsByClassAndSession,
  useRejectChapter,
  useSaveSyllabusContent,
  useSubjects,
  useSubmitChapterForApproval,
  useSyllabusContent,
  useUpdateChapterProgress,
  useUpdateSection,
  useUpdateSubject,
  useUpdateSubjectClasses,
} from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import type {
  ClassLevel,
  Section,
  Student,
  Subject,
  SyllabusApprovalStatus,
  SyllabusChapter,
  SyllabusContent,
  SyllabusQAPair,
} from "@/types";
import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Filter,
  GraduationCap,
  LayoutGrid,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  Printer,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Timetable static data ────────────────────────────────────────────────────
type PeriodDef =
  | {
      label: string;
      startTime: string;
      endTime: string;
      durationMins: number;
      isBreak?: false;
    }
  | {
      label: "BREAK";
      startTime: string;
      endTime: string;
      durationMins: number;
      isBreak: true;
    };

// School starts at 08:00; periods are 45 min each; break after P3 is 15 min
const PERIODS: PeriodDef[] = [
  { label: "P1", startTime: "08:00", endTime: "08:45", durationMins: 45 },
  { label: "P2", startTime: "08:45", endTime: "09:30", durationMins: 45 },
  { label: "P3", startTime: "09:30", endTime: "10:15", durationMins: 45 },
  {
    label: "BREAK",
    startTime: "10:15",
    endTime: "10:30",
    durationMins: 15,
    isBreak: true,
  },
  { label: "P4", startTime: "10:30", endTime: "11:15", durationMins: 45 },
  { label: "P5", startTime: "11:15", endTime: "12:00", durationMins: 45 },
  { label: "P6", startTime: "12:00", endTime: "12:45", durationMins: 45 },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type TimetableSlot = { subject: string; teacher: string } | null;
// Key is period label (P1, P2, ... or BREAK)
type TimetableGrid = Record<string, Record<string, TimetableSlot>>;

const sampleTimetable: TimetableGrid = {
  P1: {
    Monday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Tuesday: { subject: "Science", teacher: "Kavita Mishra" },
    Wednesday: { subject: "English", teacher: "Priya Sharma" },
    Thursday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Friday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Saturday: { subject: "Art", teacher: "Reena Joshi" },
  },
  P2: {
    Monday: { subject: "English", teacher: "Priya Sharma" },
    Tuesday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Wednesday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Thursday: { subject: "Science", teacher: "Kavita Mishra" },
    Friday: { subject: "Social Studies", teacher: "Meena Rao" },
    Saturday: { subject: "PE", teacher: "Suresh Kumar" },
  },
  P3: {
    Monday: { subject: "Science", teacher: "Kavita Mishra" },
    Tuesday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Wednesday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Thursday: { subject: "English", teacher: "Priya Sharma" },
    Friday: { subject: "Computer", teacher: "Rohit Dev" },
    Saturday: null,
  },
  P4: {
    Monday: { subject: "Social Studies", teacher: "Meena Rao" },
    Tuesday: { subject: "Computer", teacher: "Rohit Dev" },
    Wednesday: { subject: "Science", teacher: "Kavita Mishra" },
    Thursday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Friday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Saturday: null,
  },
  P5: {
    Monday: { subject: "Computer", teacher: "Rohit Dev" },
    Tuesday: { subject: "Social Studies", teacher: "Meena Rao" },
    Wednesday: { subject: "Social Studies", teacher: "Meena Rao" },
    Thursday: { subject: "Computer", teacher: "Rohit Dev" },
    Friday: { subject: "English", teacher: "Priya Sharma" },
    Saturday: null,
  },
  P6: {
    Monday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Tuesday: { subject: "Art", teacher: "Reena Joshi" },
    Wednesday: { subject: "PE", teacher: "Suresh Kumar" },
    Thursday: { subject: "Art", teacher: "Reena Joshi" },
    Friday: { subject: "Science", teacher: "Kavita Mishra" },
    Saturday: null,
  },
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Science: "bg-green-500/10 text-green-700 border-green-500/20",
  English: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  Hindi: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Social Studies": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Computer: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  Art: "bg-pink-500/10 text-pink-700 border-pink-500/20",
  PE: "bg-red-500/10 text-red-700 border-red-500/20",
};

function subjectColor(name: string) {
  return SUBJECT_COLORS[name] ?? "bg-muted text-foreground border-border";
}

// ─── Status badge helper ──────────────────────────────────────────────────────
function ApprovalBadge({ status }: { status: SyllabusApprovalStatus }) {
  const cfg: Record<SyllabusApprovalStatus, { label: string; cls: string }> = {
    Draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
    Pending: { label: "Pending Approval", cls: "bg-amber-100 text-amber-800" },
    Approved: { label: "Published", cls: "bg-green-100 text-green-800" },
    Rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  };
  const c = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.cls}`}
    >
      {status === "Approved" && <CheckCircle2 className="size-3" />}
      {status === "Rejected" && <XCircle className="size-3" />}
      {c.label}
    </span>
  );
}

// ─── Class Drill-down View ────────────────────────────────────────────────────
function ClassDrillDown({
  classLevel,
  sessionId,
  onBack,
}: {
  classLevel: ClassLevel;
  sessionId: string;
  onBack: () => void;
}) {
  const { data: students = [], isLoading } = useGetStudentsByClassAndSession(
    classLevel,
    sessionId,
  );
  const { data: sections = [] } = useGetSections();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.admNo.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        s.fatherMobile.includes(q),
    );
  }, [students, search]);

  function getSectionName(sectionId: string) {
    return sections.find((s) => s.id === sectionId)?.name ?? sectionId;
  }

  return (
    <div className="space-y-4" data-ocid="academics.class_drilldown">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="academics.drilldown_back_button"
        >
          <ArrowLeft className="size-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          <h2 className="text-lg font-semibold font-display text-foreground">
            {CLASS_LABELS[classLevel]} — Enrolled Students
          </h2>
          <Badge variant="secondary">{students.length} Students</Badge>
        </div>
        <div className="flex-1" />
        <Input
          className="w-52 h-8 text-sm"
          placeholder="Search students…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="academics.drilldown_search_input"
        />
      </div>

      {isLoading && (
        <div
          className="space-y-2"
          data-ocid="academics.drilldown_loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center"
          data-ocid="academics.drilldown_empty_state"
        >
          <Users className="size-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            {search
              ? "No students match your search."
              : "No students enrolled in this class for the selected session."}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  #
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Adm No
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Student Name
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Section
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Father Name
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Contact
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">
                  Gender
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: Student, i: number) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/10"
                  data-ocid={`academics.drilldown.student.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    {s.admNo}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {s.fullName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {s.sectionId
                      ? `Section ${getSectionName(s.sectionId)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {s.fatherName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                    {s.fatherMobile}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge
                      variant={s.gender === "Female" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {s.gender}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────
function ClassCard({
  cls,
  clsSections,
  sessionId,
  onDrillDown,
}: {
  cls: ClassLevel;
  clsSections: Section[];
  sessionId: string;
  onDrillDown: (cl: ClassLevel) => void;
}) {
  const { data: count = 0 } = useGetEnrolledCountByClass(cls, sessionId);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2">
        <GraduationCap className="size-4 text-primary" />
        <span className="font-semibold text-foreground font-display">
          {CLASS_LABELS[cls]}
        </span>
        <Badge variant="secondary" className="ml-1">
          {clsSections.length} Section{clsSections.length !== 1 ? "s" : ""}
        </Badge>
        <button
          type="button"
          onClick={() => onDrillDown(cls)}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary transition-colors"
          data-ocid={`academics.class_enrolled_count.${cls}`}
        >
          <Users className="size-3.5" />
          {count} Students
        </button>
      </div>
      <ClassSectionsTable clsSections={clsSections} sessionId={sessionId} />
    </div>
  );
}

function ClassSectionsTable({
  clsSections,
  sessionId,
}: { clsSections: Section[]; sessionId: string }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/30 border-b border-border">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-foreground">
            Section
          </th>
          <th className="px-4 py-2 text-left font-semibold text-foreground">
            Room No
          </th>
          <th className="px-4 py-2 text-left font-semibold text-foreground">
            Class Teacher
          </th>
          <th className="px-4 py-2 text-left font-semibold text-foreground">
            Capacity
          </th>
          <th className="px-4 py-2 text-left font-semibold text-foreground">
            Enrolled
          </th>
        </tr>
      </thead>
      <tbody>
        {clsSections.map((s, i) => (
          <SectionRow key={s.id} section={s} sessionId={sessionId} index={i} />
        ))}
      </tbody>
    </table>
  );
}

function SectionRow({
  section: s,
  sessionId,
  index: i,
}: { section: Section; sessionId: string; index: number }) {
  const { data: enrolled = 0 } = useGetEnrolledCountBySection(s.id, sessionId);
  return (
    <tr
      className="border-b border-border last:border-0 hover:bg-muted/10"
      data-ocid={`academics.section.item.${i + 1}`}
    >
      <td className="px-4 py-2.5 font-medium text-foreground">
        Section {s.name}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">
        {(s as Section & { roomNo?: string }).roomNo || "—"}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">
        {(s as Section & { teacherId?: string }).teacherId || "—"}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">{s.capacity}</td>
      <td className="px-4 py-2.5">
        <Badge variant="outline" className="text-xs">
          <Users className="size-3 mr-1" />
          {enrolled}
        </Badge>
      </td>
    </tr>
  );
}

// ─── Classes & Sections Tab ───────────────────────────────────────────────────
function ClassesSectionsTab() {
  const { data: sections = [], isLoading } = useGetSections();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const { currentSession } = useAppStore();
  const sessionId = currentSession ?? "2025-26";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [drillDownClass, setDrillDownClass] = useState<ClassLevel | null>(null);
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [deleteBlockedDialog, setDeleteBlockedDialog] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });
  const [form, setForm] = useState({
    classLevel: "" as ClassLevel | "",
    name: "",
    roomNo: "",
    classTeacher: "",
  });

  const grouped = useMemo(() => {
    const map = new Map<ClassLevel, Section[]>();
    for (const cl of CLASS_ORDER) {
      const items = sections.filter((s) => s.classLevel === cl);
      if (items.length > 0) map.set(cl, items);
    }
    return map;
  }, [sections]);

  function openAdd() {
    setEditId(null);
    setForm({ classLevel: "", name: "", roomNo: "", classTeacher: "" });
    setDialogOpen(true);
  }

  function openEdit(s: Section) {
    setEditId(s.id);
    setForm({
      classLevel: s.classLevel,
      name: s.name,
      roomNo: (s as Section & { roomNo?: string }).roomNo ?? "",
      classTeacher: (s as Section & { teacherId?: string }).teacherId ?? "",
    });
    setDialogOpen(true);
  }

  async function saveSection() {
    if (!form.classLevel || !form.name.trim()) return;
    const roomNo = form.roomNo.trim() || null;
    const teacherId = form.classTeacher.trim() || null;
    if (editId) {
      try {
        await updateSection.mutateAsync({
          id: editId,
          classLevel: form.classLevel as ClassLevel,
          sectionName: form.name.trim(),
          roomNo,
          teacherId,
        });
        toast.success("Section updated successfully.");
        setDialogOpen(false);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to update section.";
        setDialogOpen(false);
        setErrorDialog({
          open: true,
          message:
            msg.toLowerCase().includes("already exists") ||
            msg.toLowerCase().includes("duplicate")
              ? `A section "${form.name.trim()}" already exists for ${CLASS_LABELS[form.classLevel as ClassLevel]}.`
              : msg,
        });
      }
    } else {
      try {
        await createSection.mutateAsync({
          classLevel: form.classLevel as ClassLevel,
          sectionName: form.name.trim(),
          roomNo,
          teacherId,
        });
        toast.success(`Section "${form.name.trim()}" added successfully.`);
        setForm({ classLevel: "", name: "", roomNo: "", classTeacher: "" });
        setDialogOpen(false);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to add section.";
        setDialogOpen(false);
        setErrorDialog({
          open: true,
          message:
            msg.toLowerCase().includes("already exists") ||
            msg.toLowerCase().includes("duplicate")
              ? `A section "${form.name.trim()}" already exists for ${CLASS_LABELS[form.classLevel as ClassLevel]}.`
              : msg,
        });
      }
    }
  }

  async function confirmDelete(enrolledCount?: number) {
    if (!deleteId) return;
    if (enrolledCount && enrolledCount > 0) {
      setDeleteBlockedDialog({
        open: true,
        message: `Cannot delete this section — ${enrolledCount} student${enrolledCount !== 1 ? "s are" : " is"} currently enrolled. Please transfer or remove all students first.`,
      });
      setDeleteId(null);
      return;
    }
    try {
      await deleteSection.mutateAsync(deleteId);
      toast.success("Section deleted.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete section.";
      if (
        msg.toLowerCase().includes("enrolled") ||
        msg.toLowerCase().includes("student")
      ) {
        setDeleteBlockedDialog({
          open: true,
          message:
            "Cannot delete this section — students are currently enrolled.",
        });
      } else {
        setErrorDialog({ open: true, message: msg });
      }
    }
    setDeleteId(null);
  }

  const isSaving = createSection.isPending || updateSection.isPending;

  if (drillDownClass) {
    return (
      <ClassDrillDown
        classLevel={drillDownClass}
        sessionId={sessionId}
        onBack={() => setDrillDownClass(null)}
      />
    );
  }

  return (
    <div className="space-y-4" data-ocid="academics.classes_sections">
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Session:{" "}
          <span className="font-semibold text-foreground">{sessionId}</span>
          {" — "}Click "Students" badge to see enrolled students.
        </p>
        <div className="flex-1" />
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="academics.add_section_button"
        >
          <Plus className="size-4 mr-1" /> Add Section
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3" data-ocid="academics.sections_loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && grouped.size === 0 && (
        <div
          className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center"
          data-ocid="academics.sections_empty_state"
        >
          <GraduationCap className="size-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            No sections yet. Add your first section.
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([cls, clsSections]) => (
            <ClassCard
              key={cls}
              cls={cls}
              clsSections={clsSections}
              sessionId={sessionId}
              onDrillDown={(cl) => setDrillDownClass(cl)}
            />
          ))}
        </div>
      )}

      {!isLoading && grouped.size > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
            <p className="text-sm font-semibold text-foreground">
              Manage Sections
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Class
                </th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Section
                </th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Room
                </th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Teacher
                </th>
                <th className="px-4 py-2 text-center font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(grouped.entries()).flatMap(([, clsSections]) =>
                clsSections.map((s, i) => (
                  <ManageSectionRow
                    key={s.id}
                    section={s}
                    sessionId={sessionId}
                    index={i}
                    onEdit={() => openEdit(s)}
                    onDelete={(enrolledCount) => {
                      setDeleteId(s.id);
                      if (enrolledCount > 0) {
                        setDeleteId(null);
                        setDeleteBlockedDialog({
                          open: true,
                          message: `Cannot delete — ${enrolledCount} student${enrolledCount !== 1 ? "s are" : " is"} enrolled.`,
                        });
                      }
                    }}
                  />
                )),
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!isSaving) setDialogOpen(open);
        }}
      >
        <DialogContent
          className="z-[9999]"
          data-ocid="academics.section_dialog"
        >
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Section" : "Add Section"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Class <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.classLevel}
                onValueChange={(v) =>
                  setForm({ ...form, classLevel: v as ClassLevel })
                }
              >
                <SelectTrigger data-ocid="academics.section_form.class_select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                Section Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. A, B, C"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="academics.section_form.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Room No</Label>
              <Input
                placeholder="e.g. Room 201"
                value={form.roomNo}
                onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
                data-ocid="academics.section_form.room_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Class Teacher</Label>
              <Input
                placeholder="Teacher name"
                value={form.classTeacher}
                onChange={(e) =>
                  setForm({ ...form, classTeacher: e.target.value })
                }
                data-ocid="academics.section_form.teacher_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
              data-ocid="academics.section_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSection}
              disabled={!form.classLevel || !form.name.trim() || isSaving}
              data-ocid="academics.section_form.submit_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Add Section"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          className="z-[9999]"
          data-ocid="academics.delete_section_dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Section?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the section.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteSection.isPending}
              data-ocid="academics.delete_section_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete()}
              disabled={deleteSection.isPending}
              data-ocid="academics.delete_section_dialog.confirm_button"
            >
              {deleteSection.isPending ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={errorDialog.open}
        onOpenChange={(open) =>
          !open && setErrorDialog({ open: false, message: "" })
        }
      >
        <DialogContent
          className="z-[9999] max-w-sm"
          data-ocid="academics.section_error_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <span>✕</span> Cannot Save Section
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground">{errorDialog.message}</p>
          <DialogFooter>
            <Button
              onClick={() => setErrorDialog({ open: false, message: "" })}
              data-ocid="academics.section_error_dialog.ok_button"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteBlockedDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteBlockedDialog({ open: false, message: "" })
        }
      >
        <DialogContent
          className="z-[9999] max-w-sm"
          data-ocid="academics.delete_blocked_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-amber-600 flex items-center gap-2">
              <Users className="size-5" /> Cannot Delete Section
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground">
            {deleteBlockedDialog.message}
          </p>
          <DialogFooter>
            <Button
              onClick={() =>
                setDeleteBlockedDialog({ open: false, message: "" })
              }
              data-ocid="academics.delete_blocked_dialog.ok_button"
            >
              OK, I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ManageSectionRow({
  section: s,
  sessionId,
  index: i,
  onEdit,
  onDelete,
}: {
  section: Section;
  sessionId: string;
  index: number;
  onEdit: () => void;
  onDelete: (enrolledCount: number) => void;
}) {
  const { data: enrolled = 0 } = useGetEnrolledCountBySection(s.id, sessionId);
  const hasStudents = enrolled > 0;
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/10">
      <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
        {CLASS_LABELS[s.classLevel]}
      </td>
      <td className="px-4 py-2.5 font-medium text-foreground">
        Section {s.name}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">
        {(s as Section & { roomNo?: string }).roomNo || "—"}
      </td>
      <td className="px-4 py-2.5 text-muted-foreground">
        {(s as Section & { teacherId?: string }).teacherId || "—"}
      </td>
      <td className="px-4 py-2.5 text-center">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onEdit}
            data-ocid={`academics.edit_section.${i + 1}`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`size-7 ${hasStudents ? "text-muted-foreground cursor-not-allowed opacity-50" : "text-destructive hover:text-destructive"}`}
            onClick={() => onDelete(enrolled)}
            title={
              hasStudents
                ? `${enrolled} student${enrolled !== 1 ? "s" : ""} enrolled`
                : "Delete section"
            }
            data-ocid={`academics.delete_section.${i + 1}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Assign Classes Dialog ────────────────────────────────────────────────────
function AssignClassesDialog({
  subject,
  currentClasses,
  onSave,
  onClose,
  isSaving,
}: {
  subject: Subject;
  currentClasses: string[];
  onSave: (classes: string[]) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentClasses),
  );

  function toggle(cl: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cl)) next.delete(cl);
      else next.add(cl);
      return next;
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-sm"
        data-ocid="academics.assign_classes_dialog"
      >
        <DialogHeader>
          <DialogTitle>Assign Classes — {subject.name}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-1">
          Select the classes that study this subject.
        </p>
        <div className="grid grid-cols-2 gap-2 py-2 max-h-72 overflow-y-auto">
          {CLASS_ORDER.map((cl) => (
            <Label
              key={cl}
              htmlFor={`assign-${subject.id}-${cl}`}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 px-3 py-2 cursor-pointer transition-colors"
              data-ocid={`academics.assign_classes.${cl}`}
            >
              <Checkbox
                checked={selected.has(cl)}
                onCheckedChange={() => toggle(cl)}
                id={`assign-${subject.id}-${cl}`}
              />
              <span className="text-sm text-foreground">
                {CLASS_LABELS[cl]}
              </span>
            </Label>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            data-ocid="academics.assign_classes_dialog.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(Array.from(selected))}
            disabled={isSaving}
            data-ocid="academics.assign_classes_dialog.save_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 mr-1.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Subjects Tab (real backend data) ─────────────────────────────────────────
function SubjectsTab() {
  const [classFilter, setClassFilter] = useState<ClassLevel | "all">("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [assignSubject, setAssignSubject] = useState<Subject | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    maxMarks: "100",
    passingMarks: "35",
  });
  // Class checkboxes embedded in the Add/Edit Subject dialog
  const [dialogSelectedClasses, setDialogSelectedClasses] = useState<
    Set<string>
  >(new Set());

  const { data: subjects = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const updateSubjectClasses = useUpdateSubjectClasses();
  const { data: allClassMaps = {} } = useGetAllSubjectClassMaps();

  function getAssignedClasses(subjectId: string): string[] {
    return allClassMaps[subjectId] ?? [];
  }

  // Active subjects = those with at least 1 class assigned
  const activeSubjects = useMemo(
    () => subjects.filter((s) => (allClassMaps[s.id] ?? []).length > 0),
    [subjects, allClassMaps],
  );

  const filtered = useMemo(() => {
    const pool = activeOnly ? activeSubjects : subjects;
    if (classFilter === "all") return pool;
    return pool.filter((s) => s.classLevel === classFilter);
  }, [subjects, activeSubjects, activeOnly, classFilter]);

  function openAdd() {
    setEditId(null);
    setForm({
      name: "",
      code: "",
      maxMarks: "100",
      passingMarks: "35",
    });
    setDialogSelectedClasses(new Set());
    setDialogOpen(true);
  }

  function openEdit(s: Subject) {
    setEditId(s.id);
    setForm({
      name: s.name,
      code: s.code,
      maxMarks: "100",
      passingMarks: "35",
    });
    // Pre-populate checkboxes from saved assignments.
    // If none are saved, seed with the subject's primary classLevel.
    const assigned = allClassMaps[s.id] ?? [];
    setDialogSelectedClasses(
      new Set(assigned.length > 0 ? assigned : [s.classLevel]),
    );
    setDialogOpen(true);
  }

  async function saveSubject() {
    if (!form.name.trim()) return;
    // Derive classLevel from the first selected class (sorted by CLASS_ORDER)
    const selectedSorted = CLASS_ORDER.filter((cl) =>
      dialogSelectedClasses.has(cl),
    );
    // Use first selected class as primary classLevel; fall back to CLASS_ORDER[0]
    const derivedClassLevel: ClassLevel =
      (selectedSorted[0] as ClassLevel) ?? CLASS_ORDER[0];
    try {
      let subjectId = editId;
      if (editId) {
        await updateSubject.mutateAsync({
          id: editId,
          name: form.name,
          code: form.code,
          classLevel: derivedClassLevel,
          maxMarks: Number(form.maxMarks) || 100,
          passingMarks: Number(form.passingMarks) || 35,
        });
      } else {
        const created = await createSubject.mutateAsync({
          name: form.name,
          code: form.code,
          classLevel: derivedClassLevel,
          maxMarks: Number(form.maxMarks) || 100,
          passingMarks: Number(form.passingMarks) || 35,
        });
        subjectId = created.id;
      }
      // Always save class assignments immediately in the same flow
      if (subjectId) {
        await updateSubjectClasses.mutateAsync({
          subjectId,
          classLevels: Array.from(dialogSelectedClasses),
        });
      }
      toast.success(
        editId ? "Subject updated." : `Subject "${form.name}" added.`,
      );
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save subject.");
    }
  }

  async function handleDeleteSubject() {
    if (!deleteId) return;
    try {
      await deleteSubject.mutateAsync(deleteId);
      toast.success("Subject deleted.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete subject.");
    }
    setDeleteId(null);
  }

  async function handleSaveAssignClasses(classes: string[]) {
    if (!assignSubject) return;
    const subjectName = assignSubject.name;
    const subjectId = assignSubject.id;
    // Keep dialog open while saving (close only on success)
    try {
      await updateSubjectClasses.mutateAsync({
        subjectId,
        classLevels: classes,
      });
      toast.success(
        classes.length > 0
          ? `"${subjectName}" assigned to ${classes.length} class${classes.length !== 1 ? "es" : ""} successfully.`
          : `"${subjectName}" class assignments cleared.`,
      );
      setAssignSubject(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? `Failed to save: ${err.message}`
          : "Failed to save class assignments.",
      );
      // Leave the dialog open so the user can retry
    }
  }

  const isSaving = createSubject.isPending || updateSubject.isPending;

  return (
    <div className="space-y-4" data-ocid="academics.subjects">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Count summary */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
          </span>
          <Badge
            variant="secondary"
            className="text-xs bg-green-500/15 text-green-700 border-green-500/30"
          >
            <Check className="size-3 mr-1" />
            {activeSubjects.length} active
          </Badge>
        </div>

        {/* Active-only toggle */}
        <button
          type="button"
          onClick={() => setActiveOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeOnly
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
          }`}
          data-ocid="academics.subjects_active_filter_toggle"
        >
          <Filter className="size-3.5" />
          {activeOnly ? "Active subjects only" : "All subjects"}
        </button>

        <Select
          value={classFilter}
          onValueChange={(v) => setClassFilter(v as ClassLevel | "all")}
        >
          <SelectTrigger
            className="w-48"
            data-ocid="academics.subjects_class_filter"
          >
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
            <SelectItem value="all">All Classes</SelectItem>
            {CLASS_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CLASS_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="academics.add_subject_button"
        >
          <Plus className="size-4 mr-1" /> Add Subject
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Subject Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Assigned Classes
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="academics.subjects_empty_state"
                  >
                    {subjects.length === 0
                      ? "No subjects yet. Add your first subject."
                      : activeOnly
                        ? 'No active subjects (assigned to a class). Toggle "All subjects" to see all.'
                        : "No subjects match this filter."}
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => {
                const assignedClasses = getAssignedClasses(s.id);
                const isActive = assignedClasses.length > 0;
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-muted/10"
                    data-ocid={`academics.subject.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${subjectColor(s.name)}`}
                        >
                          {s.name}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-green-500/15 text-green-700">
                            <Check className="size-3" /> Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-xs">
                      {s.code}
                    </td>
                    <td className="px-4 py-3">
                      {assignedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {assignedClasses.slice(0, 3).map((cl) => (
                            <Badge
                              key={cl}
                              variant="secondary"
                              className="text-xs"
                            >
                              {CLASS_LABELS[cl as ClassLevel] ?? cl}
                            </Badge>
                          ))}
                          {assignedClasses.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{assignedClasses.length - 3} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not assigned to any class
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={s.isOptional ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {s.isOptional ? "Optional" : "Core"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => setAssignSubject(s)}
                          data-ocid={`academics.assign_classes_button.${i + 1}`}
                        >
                          <GraduationCap className="size-3 mr-1" />
                          Classes
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => openEdit(s)}
                          data-ocid={`academics.edit_subject.${i + 1}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(s.id)}
                          data-ocid={`academics.delete_subject.${i + 1}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {assignSubject && (
        <AssignClassesDialog
          subject={assignSubject}
          currentClasses={getAssignedClasses(assignSubject.id)}
          onSave={handleSaveAssignClasses}
          onClose={() => setAssignSubject(null)}
          isSaving={updateSubjectClasses.isPending}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="z-[9999]"
          data-ocid="academics.subject_dialog"
        >
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Subject" : "Add Subject"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>
                Subject Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Mathematics"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="academics.subject_form.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Subject Code</Label>
              <Input
                placeholder="e.g. MAT"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                data-ocid="academics.subject_form.code_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Marks</Label>
              <Input
                placeholder="100"
                value={form.maxMarks}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxMarks: e.target.value.replace(/\D/g, ""),
                  })
                }
                data-ocid="academics.subject_form.max_marks_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Passing Marks</Label>
              <Input
                placeholder="35"
                value={form.passingMarks}
                onChange={(e) =>
                  setForm({
                    ...form,
                    passingMarks: e.target.value.replace(/\D/g, ""),
                  })
                }
                data-ocid="academics.subject_form.passing_marks_input"
              />
            </div>
          </div>
          {/* ── Assign to Classes (inline checkboxes) ── */}
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Assign to Classes{" "}
                <span className="normal-case font-normal text-destructive">
                  *
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setDialogSelectedClasses(new Set(CLASS_ORDER))}
                  data-ocid="academics.subject_form.select_all_classes"
                >
                  Select All
                </button>
                <span className="text-muted-foreground text-xs">|</span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline"
                  onClick={() => setDialogSelectedClasses(new Set())}
                  data-ocid="academics.subject_form.clear_all_classes"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {CLASS_ORDER.map((cl) => {
                const isChecked = dialogSelectedClasses.has(cl);
                return (
                  <Label
                    key={cl}
                    htmlFor={`dialog-assign-${cl}`}
                    className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 cursor-pointer transition-colors text-sm ${
                      isChecked
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-muted/20 hover:bg-muted/40"
                    }`}
                    data-ocid={`academics.subject_form.class_checkbox.${cl}`}
                  >
                    <Checkbox
                      id={`dialog-assign-${cl}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        setDialogSelectedClasses((prev) => {
                          const next = new Set(prev);
                          if (checked) next.add(cl);
                          else next.delete(cl);
                          return next;
                        });
                      }}
                    />
                    <span>{CLASS_LABELS[cl]}</span>
                  </Label>
                );
              })}
            </div>
            {dialogSelectedClasses.size > 0 ? (
              <p className="text-xs text-primary">
                Assigned to {dialogSelectedClasses.size} class
                {dialogSelectedClasses.size !== 1 ? "es" : ""}
              </p>
            ) : (
              <p className="text-xs text-destructive">
                Please select at least one class.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="academics.subject_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSubject}
              disabled={
                !form.name.trim() ||
                dialogSelectedClasses.size === 0 ||
                isSaving ||
                updateSubjectClasses.isPending
              }
              data-ocid="academics.subject_form.submit_button"
            >
              {isSaving || updateSubjectClasses.isPending ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Add Subject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          className="z-[9999]"
          data-ocid="academics.delete_subject_dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Subject?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the subject and all its syllabus data.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="academics.delete_subject_dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubject}
              disabled={deleteSubject.isPending}
              data-ocid="academics.delete_subject_dialog.confirm_button"
            >
              {deleteSubject.isPending ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Deleting…
                </>
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

// ─── Chapter Content Panel (Q&A + Approval workflow) ─────────────────────────
function ChapterContentPanel({
  chapter,
  role,
  onClose,
}: {
  chapter: SyllabusChapter;
  role: string;
  onClose: () => void;
}) {
  const { data: content } = useSyllabusContent(chapter.id);
  const saveContent = useSaveSyllabusContent();
  const submitApproval = useSubmitChapterForApproval();
  const approveChapter = useApproveChapter();
  const rejectChapter = useRejectChapter();

  const [contentText, setContentText] = useState(content?.contentText ?? "");
  const [qaPairs, setQAPairs] = useState<SyllabusQAPair[]>(
    content?.qaPairs ?? [],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const status: SyllabusApprovalStatus = content?.status ?? "Draft";
  const isPrincipal = role === "Principal" || role === "Admin";
  const isTeacher = role === "Teacher" || role === "Admin";

  // Sync local state when content loads
  const [synced, setSynced] = useState(false);
  if (!synced && content) {
    setContentText(content.contentText);
    setQAPairs(content.qaPairs);
    setSynced(true);
  }

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateQAFromContent(contentText);
      setQAPairs(generated);
      setIsGenerating(false);
      toast.success(
        `Generated ${generated.length} Q&A pairs from chapter content.`,
      );
    }, 800);
  }

  async function handleSaveQA() {
    const newContent: SyllabusContent = {
      chapterId: chapter.id,
      contentText,
      userProvidedQuestions: content?.userProvidedQuestions ?? [],
      qaPairs,
      status: content?.status ?? "Draft",
      rejectionReason: content?.rejectionReason ?? "",
      submittedAt: content?.submittedAt ?? null,
      approvedAt: content?.approvedAt ?? null,
    };
    await saveContent.mutateAsync(newContent);
    toast.success("Content and Q&A saved.");
  }

  async function handleSubmit() {
    if (!content && !contentText.trim()) {
      toast.error("Please add chapter content and Q&A before submitting.");
      return;
    }
    // Save first then submit
    await saveContent.mutateAsync({
      chapterId: chapter.id,
      contentText,
      userProvidedQuestions: content?.userProvidedQuestions ?? [],
      qaPairs,
      status: "Draft",
      rejectionReason: "",
      submittedAt: null,
      approvedAt: null,
    });
    await submitApproval.mutateAsync(chapter.id);
    toast.success("Chapter submitted for principal approval.");
  }

  async function handleApprove() {
    await approveChapter.mutateAsync(chapter.id);
    toast.success("Chapter approved and published for students.");
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    await rejectChapter.mutateAsync({
      chapterId: chapter.id,
      reason: rejectReason,
    });
    toast.success("Chapter rejected. Teacher will be notified.");
    setShowRejectForm(false);
    setRejectReason("");
  }

  return (
    <div className="space-y-4" data-ocid="academics.chapter_content_panel">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          data-ocid="academics.chapter_content_back_button"
        >
          <ArrowLeft className="size-4 mr-1" /> Back to Chapters
        </Button>
        <div className="flex-1" />
        <ApprovalBadge status={status} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        <p className="font-semibold text-foreground text-sm">
          Chapter {chapter.chapterNo}: {chapter.title}
        </p>
        {chapter.topics.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Topics: {chapter.topics.join(", ")}
          </p>
        )}
      </div>

      {/* Rejection reason banner */}
      {status === "Rejected" && content?.rejectionReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xs font-semibold text-red-700 mb-0.5">
            Rejection Reason:
          </p>
          <p className="text-sm text-red-700">{content.rejectionReason}</p>
        </div>
      )}

      {/* Student view — read only */}
      {!isPrincipal && !isTeacher && status === "Approved" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground mb-2">
              Chapter Content
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contentText}
            </p>
          </div>
          {qaPairs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Questions & Answers
              </p>
              {qaPairs.map((qa, i) => (
                <div
                  key={qa.id}
                  className="rounded-lg border border-border bg-card p-3 space-y-1"
                >
                  <p className="text-sm font-medium text-foreground">
                    Q{i + 1}. {qa.question}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ans: {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teacher / Admin content editor */}
      {isTeacher && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">
              Chapter Content Text
            </Label>
            <Textarea
              placeholder="Type or paste the chapter content here. The more text you provide, the better Q&A will be generated."
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={8}
              className="resize-none text-sm"
              disabled={status === "Pending" || status === "Approved"}
              data-ocid="academics.chapter_content_textarea"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={
                !contentText.trim() ||
                isGenerating ||
                status === "Pending" ||
                status === "Approved"
              }
              data-ocid="academics.generate_qa_button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-1.5" />
                  Generate Q&A
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveQA}
              disabled={
                saveContent.isPending ||
                status === "Pending" ||
                status === "Approved"
              }
              data-ocid="academics.save_qa_button"
            >
              {saveContent.isPending ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="size-4 mr-1.5" />
                  Save Q&A
                </>
              )}
            </Button>
            {(status === "Draft" || status === "Rejected") &&
              qaPairs.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="ml-auto"
                  onClick={handleSubmit}
                  disabled={submitApproval.isPending}
                  data-ocid="academics.submit_for_approval_button"
                >
                  {submitApproval.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-1.5 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-1.5" />
                      Submit for Approval
                    </>
                  )}
                </Button>
              )}
          </div>

          {/* Q&A pairs list */}
          {qaPairs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Q&A Pairs ({qaPairs.length})
              </p>
              <ScrollArea className="max-h-64">
                <div className="space-y-2 pr-2">
                  {qaPairs.map((qa, i) => (
                    <div
                      key={qa.id}
                      className="rounded-lg border border-border bg-muted/10 p-3 space-y-1.5"
                      data-ocid={`academics.qa_pair.${i + 1}`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="size-3.5 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Input
                            className="h-7 text-xs mb-1"
                            value={qa.question}
                            onChange={(e) =>
                              setQAPairs((prev) =>
                                prev.map((p, idx) =>
                                  idx === i
                                    ? { ...p, question: e.target.value }
                                    : p,
                                ),
                              )
                            }
                            disabled={
                              status === "Pending" || status === "Approved"
                            }
                            data-ocid={`academics.qa_question_input.${i + 1}`}
                          />
                          <Textarea
                            className="resize-none text-xs"
                            rows={2}
                            value={qa.answer}
                            onChange={(e) =>
                              setQAPairs((prev) =>
                                prev.map((p, idx) =>
                                  idx === i
                                    ? { ...p, answer: e.target.value }
                                    : p,
                                ),
                              )
                            }
                            disabled={
                              status === "Pending" || status === "Approved"
                            }
                            data-ocid={`academics.qa_answer_input.${i + 1}`}
                          />
                        </div>
                        {status !== "Pending" && status !== "Approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setQAPairs((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* Principal review panel */}
      {isPrincipal && status === "Pending" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-amber-800">
            Principal Review
          </p>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs font-semibold text-foreground mb-1">
              Chapter Content:
            </p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contentText || "(No content)"}
            </p>
          </div>
          {qaPairs.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">
                Q&A ({qaPairs.length} pairs):
              </p>
              {qaPairs.slice(0, 3).map((qa, _i) => (
                <div key={qa.id} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Q: {qa.question}
                  </span>
                  <br />
                  A: {qa.answer}
                </div>
              ))}
              {qaPairs.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  ...and {qaPairs.length - 3} more
                </p>
              )}
            </div>
          )}
          {!showRejectForm ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={approveChapter.isPending}
                data-ocid="academics.approve_chapter_button"
              >
                <CheckCircle2 className="size-4 mr-1.5" />
                Approve & Publish
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowRejectForm(true)}
                data-ocid="academics.reject_chapter_button"
              >
                <XCircle className="size-4 mr-1.5" />
                Reject
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                data-ocid="academics.reject_reason_textarea"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={rejectChapter.isPending}
                  data-ocid="academics.confirm_reject_button"
                >
                  {rejectChapter.isPending ? (
                    <>
                      <Loader2 className="size-4 mr-1.5 animate-spin" />
                      Rejecting…
                    </>
                  ) : (
                    "Confirm Reject"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Syllabus Tab (real backend chapters) ─────────────────────────────────────
function SyllabusTab() {
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const [classFilter, setClassFilter] = useState<ClassLevel | "">(
    CLASS_ORDER[3] ?? "Class1",
  );
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<SyllabusChapter | null>(
    null,
  );
  const [form, setForm] = useState({ title: "", topics: "", chapterNo: "1" });
  const { currentRole } = useAppStore();

  const classSubjects = subjects.filter((s) => s.classLevel === classFilter);

  // Auto-select first subject when class changes
  const effectiveSubject =
    subjectFilter && classSubjects.some((s) => s.id === subjectFilter)
      ? subjectFilter
      : (classSubjects[0]?.id ?? "");

  const { data: chapters = [], isLoading: chaptersLoading } =
    useChapters(effectiveSubject);
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();
  const updateProgress = useUpdateChapterProgress();
  const [progressEdit, setProgressEdit] = useState<{
    id: string;
    value: string;
  } | null>(null);

  function openAdd() {
    setEditId(null);
    setForm({ title: "", topics: "", chapterNo: String(chapters.length + 1) });
    setDialogOpen(true);
  }

  async function saveChapter() {
    if (!form.title || !effectiveSubject) return;
    const topics = form.topics.trim()
      ? form.topics
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    try {
      await createChapter.mutateAsync({
        subjectId: effectiveSubject,
        chapterNo: Number(form.chapterNo) || chapters.length + 1,
        title: form.title,
        topics,
      });
      toast.success(`Chapter "${form.title}" added.`);
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add chapter.");
    }
  }

  async function handleDeleteChapter(id: string) {
    try {
      await deleteChapter.mutateAsync({ id, subjectId: effectiveSubject });
      toast.success("Chapter deleted.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete chapter.");
    }
  }

  async function saveProgress(chapter: SyllabusChapter) {
    if (!progressEdit) return;
    const pct = Math.min(
      100,
      Math.max(0, Number.parseInt(progressEdit.value) || 0),
    );
    try {
      await updateProgress.mutateAsync({
        id: chapter.id,
        subjectId: effectiveSubject,
        completionPercent: pct,
      });
      setProgressEdit(null);
    } catch (_e) {
      toast.error("Failed to update progress.");
    }
  }

  if (activeChapter) {
    return (
      <ChapterContentPanel
        chapter={activeChapter}
        role={currentRole}
        onClose={() => setActiveChapter(null)}
      />
    );
  }

  return (
    <div className="space-y-4" data-ocid="academics.syllabus">
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={classFilter}
          onValueChange={(v) => {
            setClassFilter(v as ClassLevel);
            setSubjectFilter("");
          }}
        >
          <SelectTrigger
            className="w-44"
            data-ocid="academics.syllabus_class_filter"
          >
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
            {CLASS_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CLASS_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={effectiveSubject} onValueChange={setSubjectFilter}>
          <SelectTrigger
            className="w-48"
            data-ocid="academics.syllabus_subject_filter"
          >
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {classSubjects.length === 0 && (
              <SelectItem value="_none" disabled>
                No subjects
              </SelectItem>
            )}
            {classSubjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />
        <Button
          size="sm"
          onClick={openAdd}
          disabled={!effectiveSubject}
          data-ocid="academics.add_chapter_button"
        >
          <Plus className="size-4 mr-1" /> Add Chapter
        </Button>
      </div>

      {(subjectsLoading || chaptersLoading) && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!chaptersLoading && chapters.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center"
          data-ocid="academics.syllabus_empty_state"
        >
          <BookOpen className="size-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            {!effectiveSubject
              ? "Select a subject to view chapters."
              : "No chapters added yet for this subject."}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {chapters.map((c: SyllabusChapter, i: number) => {
          const isEditingProgress = progressEdit?.id === c.id;
          return (
            <div
              key={c.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
              data-ocid={`academics.chapter.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {c.chapterNo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{c.title}</p>
                    <ChapterStatusBadge chapterId={c.id} />
                    <div className="flex items-center gap-1 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() => setActiveChapter(c)}
                        data-ocid={`academics.open_content.${i + 1}`}
                      >
                        <BookOpen className="size-3 mr-1" />
                        Content & Q&A
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteChapter(c.id)}
                        data-ocid={`academics.delete_chapter.${i + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {c.topics.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Topics: {c.topics.join(", ")}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={c.completionPercent} className="h-2" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {c.completionPercent}%
                    </span>
                    {isEditingProgress ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          className="w-16 h-7 text-center text-xs"
                          value={progressEdit.value}
                          onChange={(e) =>
                            setProgressEdit({
                              ...progressEdit,
                              value: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          data-ocid={`academics.progress_input.${i + 1}`}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => saveProgress(c)}
                          data-ocid={`academics.save_progress.${i + 1}`}
                        >
                          Set
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={() => setProgressEdit(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                          setProgressEdit({
                            id: c.id,
                            value: String(c.completionPercent),
                          })
                        }
                        data-ocid={`academics.edit_progress.${i + 1}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="z-[9999]"
          data-ocid="academics.chapter_dialog"
        >
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Chapter No</Label>
                <Input
                  placeholder="1"
                  value={form.chapterNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      chapterNo: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  data-ocid="academics.chapter_form.no_input"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>
                  Chapter Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Number System"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  data-ocid="academics.chapter_form.title_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Topics (comma-separated)</Label>
              <Input
                placeholder="e.g. Integers, Fractions, Decimals"
                value={form.topics}
                onChange={(e) => setForm({ ...form, topics: e.target.value })}
                data-ocid="academics.chapter_form.topics_input"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple topics with commas.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="academics.chapter_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveChapter}
              disabled={!form.title || createChapter.isPending}
              data-ocid="academics.chapter_form.submit_button"
            >
              {createChapter.isPending ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Adding…
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Add Chapter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Small inline component to show approval badge on chapter row without prop-drilling content
function ChapterStatusBadge({ chapterId }: { chapterId: string }) {
  const { data: content } = useSyllabusContent(chapterId);
  if (!content) return null;
  return <ApprovalBadge status={content.status} />;
}

// ─── Timetable Overview Tab ───────────────────────────────────────────────────
function TimetableTab() {
  const { data: sections = [] } = useGetSections();
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("Class5");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const classSections = sections.filter((s) => s.classLevel === selectedClass);

  // Determine if today is a school day
  const todayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][currentTime.getDay()];
  const isSchoolDay = DAYS.includes(todayName);

  function timeStrToMins(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function getCurrentPeriodStatus(
    startTimeStr: string,
    endTimeStr: string,
    isToday: boolean,
  ): "current" | "past" | "upcoming" {
    if (!isToday) return "upcoming";
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMins = timeStrToMins(startTimeStr);
    const endMins = timeStrToMins(endTimeStr);
    if (currentMins >= startMins && currentMins < endMins) return "current";
    if (currentMins >= endMins) return "past";
    return "upcoming";
  }

  return (
    <div className="space-y-4" data-ocid="academics.timetable">
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={selectedClass}
          onValueChange={(v) => {
            setSelectedClass(v as ClassLevel);
            const secs = sections.filter((s) => s.classLevel === v);
            setSelectedSection(secs[0]?.id ?? "");
          }}
        >
          <SelectTrigger
            className="w-44"
            data-ocid="academics.timetable_class_select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
            {CLASS_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CLASS_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger
            className="w-36"
            data-ocid="academics.timetable_section_select"
          >
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {classSections.length === 0 && (
              <SelectItem value="_none" disabled>
                No sections
              </SelectItem>
            )}
            {classSections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                Section {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {currentTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          data-ocid="academics.print_timetable_button"
        >
          <Printer className="size-4 mr-1" /> Print Timetable
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <div className="px-4 py-3 border-b border-border bg-primary/5">
          <p className="font-semibold font-display text-foreground">
            {CLASS_LABELS[selectedClass]} — Section{" "}
            {classSections.find((s) => s.id === selectedSection)?.name ?? "—"} ·
            Weekly Timetable
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold text-foreground w-32">
                Period
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className={`px-3 py-2.5 text-center font-semibold text-foreground ${
                    d === todayName ? "text-primary" : ""
                  }`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => {
              if (period.isBreak) {
                return (
                  <tr
                    key="BREAK"
                    className="border-b border-border bg-amber-50/60"
                    data-ocid={`academics.timetable.row.${pi + 1}`}
                  >
                    <td
                      className="px-3 py-1.5 align-middle"
                      colSpan={DAYS.length + 1}
                    >
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                        ☕ Break — {period.durationMins} min &nbsp;·&nbsp;{" "}
                        {period.startTime}–{period.endTime}
                      </span>
                    </td>
                  </tr>
                );
              }

              const status = getCurrentPeriodStatus(
                period.startTime,
                period.endTime,
                isSchoolDay,
              );
              const rowCls =
                status === "current"
                  ? "border-b border-border bg-green-50 border-l-4 border-l-green-500"
                  : status === "past"
                    ? "border-b border-border bg-red-50/40 opacity-70"
                    : "border-b border-border last:border-0 hover:bg-muted/10";

              const slot = sampleTimetable[period.label];
              return (
                <tr
                  key={period.label}
                  className={rowCls}
                  data-ocid={`academics.timetable.row.${pi + 1}`}
                >
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex items-center gap-1.5">
                      <div>
                        <div className="text-xs font-bold text-foreground leading-tight">
                          {period.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-tight">
                          {period.startTime}–{period.endTime}
                        </div>
                      </div>
                      {status === "current" && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const cell = slot?.[day] ?? null;
                    return (
                      <td
                        key={day}
                        className="px-2 py-2 text-center align-middle"
                      >
                        {cell ? (
                          <div
                            className={`inline-flex flex-col items-center rounded-md px-2 py-1 text-xs border ${subjectColor(
                              cell.subject,
                            )}`}
                          >
                            <span className="font-semibold leading-tight">
                              {cell.subject}
                            </span>
                            <span className="text-[10px] opacity-75 leading-tight">
                              {cell.teacher.split(" ")[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Free
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AcademicsPage() {
  return (
    <div className="p-6 space-y-6" data-ocid="academics.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <GraduationCap className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Academics
          </h1>
          <p className="text-sm text-muted-foreground">
            Classes, sections, subjects, syllabus, and timetables
          </p>
        </div>
      </div>

      <Tabs defaultValue="classes" data-ocid="academics.tabs">
        <TabsList className="mb-2">
          <TabsTrigger value="classes" data-ocid="academics.classes_tab">
            <GraduationCap className="size-4 mr-1.5" />
            Classes &amp; Sections
          </TabsTrigger>
          <TabsTrigger value="subjects" data-ocid="academics.subjects_tab">
            <BookOpen className="size-4 mr-1.5" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="syllabus" data-ocid="academics.syllabus_tab">
            <Filter className="size-4 mr-1.5" />
            Syllabus
          </TabsTrigger>
          <TabsTrigger value="timetable" data-ocid="academics.timetable_tab">
            <LayoutGrid className="size-4 mr-1.5" />
            Timetable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="classes">
          <ClassesSectionsTab />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectsTab />
        </TabsContent>
        <TabsContent value="syllabus">
          <SyllabusTab />
        </TabsContent>
        <TabsContent value="timetable">
          <TimetableTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
