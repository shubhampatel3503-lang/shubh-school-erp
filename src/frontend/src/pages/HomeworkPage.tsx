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
import { Textarea } from "@/components/ui/textarea";
import { CLASS_LABELS, CLASS_ORDER, formatDate, generateId } from "@/lib/utils";
import type { HomeworkEntry, HomeworkSubmission } from "@/types";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Sample Data ──────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science",
];

const INITIAL_HW: HomeworkEntry[] = [
  {
    id: "hw1",
    title: "Quadratic Equations Practice",
    description: "Solve exercises 5.1 to 5.3 from NCERT textbook",
    classLevel: "Class10",
    sectionId: "A",
    subjectId: "Mathematics",
    assignedDate: "2025-04-25",
    dueDate: "2025-04-28",
    isActive: true,
    createdBy: "Ms. Priya Sharma",
  },
  {
    id: "hw2",
    title: "Essay: My Favourite Season",
    description:
      "Write a 300-word essay on your favourite season with examples",
    classLevel: "Class8",
    sectionId: "A",
    subjectId: "English",
    assignedDate: "2025-04-24",
    dueDate: "2025-04-27",
    isActive: true,
    createdBy: "Mr. Ramesh Kumar",
  },
  {
    id: "hw3",
    title: "Newton's Laws Worksheet",
    description: "Fill in the worksheet on all three laws of motion",
    classLevel: "Class9",
    sectionId: "B",
    subjectId: "Science",
    assignedDate: "2025-04-23",
    dueDate: "2025-04-26",
    isActive: true,
    createdBy: "Ms. Kavita Verma",
  },
  {
    id: "hw4",
    title: "Map Work - Rivers of India",
    description: "Mark all major rivers on the blank map of India",
    classLevel: "Class7",
    sectionId: "A",
    subjectId: "Social Studies",
    assignedDate: "2025-04-20",
    dueDate: "2025-04-22",
    isActive: true,
    createdBy: "Mr. Suresh Gupta",
  },
];

const STUDENTS_FOR_HW: Record<string, { id: string; name: string }[]> = {
  hw1: [
    { id: "s1", name: "Arjun Mehta" },
    { id: "s2", name: "Sneha Patel" },
    { id: "s3", name: "Rohit Singh" },
    { id: "s4", name: "Priya Agarwal" },
    { id: "s5", name: "Vikram Joshi" },
  ],
  hw2: [
    { id: "s6", name: "Ananya Sharma" },
    { id: "s7", name: "Kabir Das" },
    { id: "s8", name: "Meera Nair" },
  ],
  hw3: [
    { id: "s9", name: "Rahul Gupta" },
    { id: "s10", name: "Simran Kaur" },
    { id: "s11", name: "Amit Yadav" },
    { id: "s12", name: "Neha Singh" },
  ],
  hw4: [
    { id: "s13", name: "Deepak Kumar" },
    { id: "s14", name: "Pooja Verma" },
  ],
};

const INITIAL_SUBS: HomeworkSubmission[] = [
  {
    id: "sub1",
    homeworkId: "hw1",
    studentId: "s1",
    submittedAt: "2025-04-27T10:00:00",
    fileUrl: null,
    remarks: "Good work",
    grade: "A",
  },
  {
    id: "sub2",
    homeworkId: "hw1",
    studentId: "s2",
    submittedAt: "2025-04-27T11:30:00",
    fileUrl: null,
    remarks: "",
    grade: null,
  },
  {
    id: "sub3",
    homeworkId: "hw2",
    studentId: "s6",
    submittedAt: "2025-04-26T14:00:00",
    fileUrl: null,
    remarks: "Well written",
    grade: "B+",
  },
  {
    id: "sub4",
    homeworkId: "hw3",
    studentId: "s9",
    submittedAt: "2025-04-26T09:00:00",
    fileUrl: null,
    remarks: "",
    grade: null,
  },
];

const CHART_DATA = [
  { class: "Class 7", rate: 72 },
  { class: "Class 8", rate: 85 },
  { class: "Class 9", rate: 68 },
  { class: "Class 10", rate: 91 },
  { class: "Class 11", rate: 78 },
  { class: "Class 12", rate: 95 },
];

function isOverdue(hw: HomeworkEntry) {
  return new Date(hw.dueDate) < new Date() && hw.isActive;
}

// ─── Homework Dialog ──────────────────────────────────────────────────────────
function HWDialog({
  open,
  onClose,
  onSave,
}: { open: boolean; onClose: () => void; onSave: (h: HomeworkEntry) => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    classLevel: "Class9" as keyof typeof CLASS_LABELS,
    section: "A",
    subject: SUBJECTS[0],
    dueDate: "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    if (!form.title || !form.dueDate) return;
    onSave({
      id: generateId(),
      title: form.title,
      description: form.description,
      classLevel: form.classLevel,
      sectionId: form.section,
      subjectId: form.subject,
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: form.dueDate,
      isActive: true,
      createdBy: "Admin",
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="homework.add_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Assign Homework</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Title</Label>
            <Input
              className="mt-1"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Homework title"
              data-ocid="homework.title.input"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-1"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Detailed instructions..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Class</Label>
              <Select
                value={form.classLevel}
                onValueChange={(v) => set("classLevel", v)}
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="homework.class.select"
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
              <Label>Section</Label>
              <Input
                className="mt-1"
                value={form.section}
                onChange={(e) => set("section", e.target.value)}
                placeholder="A"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) => set("subject", v)}
              >
                <SelectTrigger
                  className="mt-1"
                  data-ocid="homework.subject.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              className="mt-1"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
              data-ocid="homework.due_date.input"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              data-ocid="homework.assign.submit_button"
            >
              Assign Homework
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="homework.assign.cancel_button"
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
export default function HomeworkPage() {
  const [homework, setHomework] = useState<HomeworkEntry[]>(INITIAL_HW);
  const [submissions, setSubmissions] =
    useState<HomeworkSubmission[]>(INITIAL_SUBS);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedHW, setSelectedHW] = useState<string | null>("hw1");
  const [classFilter, setClassFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeInput, setGradeInput] = useState<Record<string, string>>({});
  const [remarkInput, _setRemarkInput] = useState<Record<string, string>>({});

  function addHomework(h: HomeworkEntry) {
    setHomework((p) => [h, ...p]);
  }
  function deleteHomework(id: string) {
    setHomework((p) => p.filter((h) => h.id !== id));
  }

  function markSubmitted(hwId: string, studentId: string) {
    const existing = submissions.find(
      (s) => s.homeworkId === hwId && s.studentId === studentId,
    );
    if (existing) return;
    setSubmissions((p) => [
      ...p,
      {
        id: generateId(),
        homeworkId: hwId,
        studentId,
        submittedAt: new Date().toISOString(),
        fileUrl: null,
        remarks: "",
        grade: null,
      },
    ]);
  }

  function saveGrade(hwId: string, studentId: string) {
    const key = `${hwId}-${studentId}`;
    setSubmissions((p) =>
      p.map((s) =>
        s.homeworkId === hwId && s.studentId === studentId
          ? {
              ...s,
              grade: gradeInput[key] ?? s.grade,
              remarks: remarkInput[key] ?? s.remarks,
            }
          : s,
      ),
    );
  }

  const filteredHW = homework.filter(
    (h) =>
      (classFilter === "All" || h.classLevel === classFilter) &&
      (subjectFilter === "All" || h.subjectId === subjectFilter),
  );
  const overdueCount = homework.filter(isOverdue).length;
  const currentHW = homework.find((h) => h.id === selectedHW);
  const hwStudents = selectedHW ? (STUDENTS_FOR_HW[selectedHW] ?? []) : [];

  return (
    <div className="p-6 space-y-5 max-w-7xl" data-ocid="homework.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <ClipboardList className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Homework
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign, track submissions, and detect overdue
          </p>
        </div>
        {overdueCount > 0 && (
          <Badge
            variant="destructive"
            className="ml-auto"
            data-ocid="homework.overdue_badge"
          >
            <AlertCircle className="size-3 mr-1" />
            {overdueCount} Overdue
          </Badge>
        )}
      </div>

      <Tabs defaultValue="assign">
        <TabsList>
          <TabsTrigger value="assign" data-ocid="homework.assign.tab">
            Assign Homework
          </TabsTrigger>
          <TabsTrigger value="submissions" data-ocid="homework.submissions.tab">
            Submissions
          </TabsTrigger>
          <TabsTrigger value="analytics" data-ocid="homework.analytics.tab">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Assign Tab */}
        <TabsContent value="assign" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger
                  className="w-36"
                  data-ocid="homework.class_filter.select"
                >
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger
                  className="w-40"
                  data-ocid="homework.subject_filter.select"
                >
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Subjects</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              data-ocid="homework.add.open_modal_button"
            >
              <Plus className="size-4 mr-2" />
              Assign Homework
            </Button>
          </div>
          <div className="space-y-2">
            {filteredHW.map((hw, i) => {
              const overdue = isOverdue(hw);
              const subs = submissions.filter((s) => s.homeworkId === hw.id);
              const total = STUDENTS_FOR_HW[hw.id]?.length ?? 0;
              return (
                <div
                  key={hw.id}
                  className={`rounded-xl border bg-card p-4 ${overdue ? "border-destructive/40" : "border-border"}`}
                  data-ocid={`homework.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {hw.title}
                        </h3>
                        {overdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {hw.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {CLASS_LABELS[hw.classLevel]}-{hw.sectionId}
                        </span>
                        <span>{hw.subjectId}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          Due: {formatDate(hw.dueDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {subs.length}/{total} submitted
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        data-ocid={`homework.edit.${i + 1}`}
                      >
                        <Edit className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive"
                        onClick={() => deleteHomework(hw.id)}
                        data-ocid={`homework.delete.${i + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredHW.length === 0 && (
              <div
                className="rounded-xl border border-border bg-card p-12 text-center"
                data-ocid="homework.list.empty_state"
              >
                <ClipboardList className="size-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-display font-semibold text-foreground mb-1">
                  No homework assigned
                </p>
                <p className="text-sm text-muted-foreground">
                  Click "Assign Homework" to add new assignments.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="mt-4 space-y-4">
          <div>
            <Label>Select Homework</Label>
            <Select value={selectedHW ?? ""} onValueChange={setSelectedHW}>
              <SelectTrigger
                className="mt-1 w-full max-w-sm"
                data-ocid="homework.select_hw.select"
              >
                <SelectValue placeholder="Choose homework..." />
              </SelectTrigger>
              <SelectContent>
                {homework.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {CLASS_LABELS[h.classLevel]} — {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentHW && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="font-semibold text-foreground">
                  {currentHW.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {formatDate(currentHW.dueDate)} |{" "}
                  {CLASS_LABELS[currentHW.classLevel]}-{currentHW.sectionId} |{" "}
                  {currentHW.subjectId}
                </p>
              </div>
              <div className="divide-y divide-border">
                {hwStudents.map((student, i) => {
                  const sub = submissions.find(
                    (s) =>
                      s.homeworkId === currentHW.id &&
                      s.studentId === student.id,
                  );
                  const key = `${currentHW.id}-${student.id}`;
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 px-4 py-3 ${!sub ? "bg-red-50/30" : ""}`}
                      data-ocid={`homework.submission.item.${i + 1}`}
                    >
                      <div
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${sub ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                      >
                        {sub ? (
                          <CheckCircle className="size-4" />
                        ) : (
                          <AlertCircle className="size-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {student.name}
                        </p>
                        {sub ? (
                          <p className="text-xs text-muted-foreground">
                            Submitted {formatDate(sub.submittedAt)}{" "}
                            {sub.grade ? `| Grade: ${sub.grade}` : ""}
                          </p>
                        ) : (
                          <p className="text-xs text-red-500">Not submitted</p>
                        )}
                      </div>
                      {sub ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={gradeInput[key] ?? sub.grade ?? ""}
                            onChange={(e) =>
                              setGradeInput((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder="Grade"
                            className="w-20 h-7 text-xs"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => saveGrade(currentHW.id, student.id)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() =>
                            markSubmitted(currentHW.id, student.id)
                          }
                          data-ocid={`homework.mark_submitted.${i + 1}`}
                        >
                          Mark Submitted
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                label: "Total Assigned",
                value: homework.length,
                color: "text-primary",
              },
              {
                label: "Overdue",
                value: overdueCount,
                color: "text-destructive",
              },
              {
                label: "Total Submissions",
                value: submissions.length,
                color: "text-emerald-600",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="card-metric text-center">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-bold font-display ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Submission Rate by Class
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={CHART_DATA}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="class"
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Submission Rate"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="rate"
                  name="Submission Rate %"
                  fill="oklch(0.49 0.24 264)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      <HWDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={addHomework}
      />
    </div>
  );
}
