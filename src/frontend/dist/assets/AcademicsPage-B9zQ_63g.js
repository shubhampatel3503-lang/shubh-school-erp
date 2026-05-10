import { j as jsxRuntimeExports, G as GraduationCap, B as BookOpen, u as useGetSections, a as useCreateSection, b as useUpdateSection, c as useDeleteSection, d as useAppStore, r as reactExports, C as CLASS_ORDER, e as Button, S as Skeleton, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, i as CLASS_LABELS, I as Input, k as DialogFooter, l as LoaderCircle, U as Users, m as useSubjects, n as useCreateSubject, o as useUpdateSubject, p as useDeleteSubject, q as useUpdateSubjectClasses, s as useGetAllSubjectClassMaps, t as Badge, v as useChapters, w as useCreateChapter, x as useDeleteChapter, y as useUpdateChapterProgress, z as useGetStudentsByClassAndSession, A as useGetEnrolledCountByClass, E as useGetEnrolledCountBySection, F as ue, H as useSyllabusContent, J as useSaveSyllabusContent, K as useSubmitChapterForApproval, M as useApproveChapter, N as useRejectChapter, O as ScrollArea, P as MessageSquare, X, Q as generateQAFromContent } from "./index-pMBTUEbj.js";
import { C as Checkbox } from "./checkbox-B6f3RDRz.js";
import { P as Progress } from "./progress-DX4jJmWr.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Check } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { F as Funnel } from "./funnel-Qd2zbjyV.js";
import { L as LayoutGrid } from "./layout-grid-D7TV9swL.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { A as ArrowLeft } from "./arrow-left-DYhYtdC7.js";
import { S as Sparkles } from "./sparkles-u5rnlKDb.js";
import { S as Send } from "./send-ByllD6tM.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import "./index-Nv6ob_Pe.js";
const PERIODS = [
  { label: "P1", startTime: "08:00", endTime: "08:45", durationMins: 45 },
  { label: "P2", startTime: "08:45", endTime: "09:30", durationMins: 45 },
  { label: "P3", startTime: "09:30", endTime: "10:15", durationMins: 45 },
  {
    label: "BREAK",
    startTime: "10:15",
    endTime: "10:30",
    durationMins: 15,
    isBreak: true
  },
  { label: "P4", startTime: "10:30", endTime: "11:15", durationMins: 45 },
  { label: "P5", startTime: "11:15", endTime: "12:00", durationMins: 45 },
  { label: "P6", startTime: "12:00", endTime: "12:45", durationMins: 45 }
];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const sampleTimetable = {
  P1: {
    Monday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Tuesday: { subject: "Science", teacher: "Kavita Mishra" },
    Wednesday: { subject: "English", teacher: "Priya Sharma" },
    Thursday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Friday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Saturday: { subject: "Art", teacher: "Reena Joshi" }
  },
  P2: {
    Monday: { subject: "English", teacher: "Priya Sharma" },
    Tuesday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Wednesday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Thursday: { subject: "Science", teacher: "Kavita Mishra" },
    Friday: { subject: "Social Studies", teacher: "Meena Rao" },
    Saturday: { subject: "PE", teacher: "Suresh Kumar" }
  },
  P3: {
    Monday: { subject: "Science", teacher: "Kavita Mishra" },
    Tuesday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Wednesday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Thursday: { subject: "English", teacher: "Priya Sharma" },
    Friday: { subject: "Computer", teacher: "Rohit Dev" },
    Saturday: null
  },
  P4: {
    Monday: { subject: "Social Studies", teacher: "Meena Rao" },
    Tuesday: { subject: "Computer", teacher: "Rohit Dev" },
    Wednesday: { subject: "Science", teacher: "Kavita Mishra" },
    Thursday: { subject: "Mathematics", teacher: "Ramesh Gupta" },
    Friday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Saturday: null
  },
  P5: {
    Monday: { subject: "Computer", teacher: "Rohit Dev" },
    Tuesday: { subject: "Social Studies", teacher: "Meena Rao" },
    Wednesday: { subject: "Social Studies", teacher: "Meena Rao" },
    Thursday: { subject: "Computer", teacher: "Rohit Dev" },
    Friday: { subject: "English", teacher: "Priya Sharma" },
    Saturday: null
  },
  P6: {
    Monday: { subject: "Hindi", teacher: "Anil Tiwari" },
    Tuesday: { subject: "Art", teacher: "Reena Joshi" },
    Wednesday: { subject: "PE", teacher: "Suresh Kumar" },
    Thursday: { subject: "Art", teacher: "Reena Joshi" },
    Friday: { subject: "Science", teacher: "Kavita Mishra" },
    Saturday: null
  }
};
const SUBJECT_COLORS = {
  Mathematics: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Science: "bg-green-500/10 text-green-700 border-green-500/20",
  English: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  Hindi: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Social Studies": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Computer: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  Art: "bg-pink-500/10 text-pink-700 border-pink-500/20",
  PE: "bg-red-500/10 text-red-700 border-red-500/20"
};
function subjectColor(name) {
  return SUBJECT_COLORS[name] ?? "bg-muted text-foreground border-border";
}
function ApprovalBadge({ status }) {
  const cfg = {
    Draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
    Pending: { label: "Pending Approval", cls: "bg-amber-100 text-amber-800" },
    Approved: { label: "Published", cls: "bg-green-100 text-green-800" },
    Rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" }
  };
  const c = cfg[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.cls}`,
      children: [
        status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
        status === "Rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
        c.label
      ]
    }
  );
}
function ClassDrillDown({
  classLevel,
  sessionId,
  onBack
}) {
  const { data: students = [], isLoading } = useGetStudentsByClassAndSession(
    classLevel,
    sessionId
  );
  const { data: sections = [] } = useGetSections();
  const [search, setSearch] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q) || s.fatherName.toLowerCase().includes(q) || s.fatherMobile.includes(q)
    );
  }, [students, search]);
  function getSectionName(sectionId) {
    var _a;
    return ((_a = sections.find((s) => s.id === sectionId)) == null ? void 0 : _a.name) ?? sectionId;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.class_drilldown", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          "data-ocid": "academics.drilldown_back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold font-display text-foreground", children: [
          CLASS_LABELS[classLevel],
          " — Enrolled Students"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          students.length,
          " Students"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "w-52 h-8 text-sm",
          placeholder: "Search students…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          "data-ocid": "academics.drilldown_search_input"
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "space-y-2",
        "data-ocid": "academics.drilldown_loading_state",
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i))
      }
    ),
    !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center",
        "data-ocid": "academics.drilldown_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-10 mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: search ? "No students match your search." : "No students enrolled in this class for the selected session." })
        ]
      }
    ),
    !isLoading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Adm No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Student Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Father Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-semibold text-foreground", children: "Gender" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border last:border-0 hover:bg-muted/10",
          "data-ocid": `academics.drilldown.student.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-muted-foreground", children: s.admNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: s.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.sectionId ? `Section ${getSectionName(s.sectionId)}` : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.fatherName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground font-mono text-xs", children: s.fatherMobile }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: s.gender === "Female" ? "secondary" : "outline",
                className: "text-xs",
                children: s.gender
              }
            ) })
          ]
        },
        s.id
      )) })
    ] }) })
  ] });
}
function ClassCard({
  cls,
  clsSections,
  sessionId,
  onDrillDown
}) {
  const { data: count = 0 } = useGetEnrolledCountByClass(cls, sessionId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 bg-primary/5 border-b border-border flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground font-display", children: CLASS_LABELS[cls] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-1", children: [
        clsSections.length,
        " Section",
        clsSections.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onDrillDown(cls),
          className: "ml-auto flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary transition-colors",
          "data-ocid": `academics.class_enrolled_count.${cls}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3.5" }),
            count,
            " Students"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClassSectionsTable, { clsSections, sessionId })
  ] });
}
function ClassSectionsTable({
  clsSections,
  sessionId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Section" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Room No" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Class Teacher" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Capacity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Enrolled" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: clsSections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SectionRow, { section: s, sessionId, index: i }, s.id)) })
  ] });
}
function SectionRow({
  section: s,
  sessionId,
  index: i
}) {
  const { data: enrolled = 0 } = useGetEnrolledCountBySection(s.id, sessionId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border last:border-0 hover:bg-muted/10",
      "data-ocid": `academics.section.item.${i + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-medium text-foreground", children: [
          "Section ",
          s.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.roomNo || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.teacherId || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.capacity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3 mr-1" }),
          enrolled
        ] }) })
      ]
    }
  );
}
function ClassesSectionsTab() {
  const { data: sections = [], isLoading } = useGetSections();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const { currentSession } = useAppStore();
  const sessionId = currentSession ?? "2025-26";
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [drillDownClass, setDrillDownClass] = reactExports.useState(null);
  const [errorDialog, setErrorDialog] = reactExports.useState({ open: false, message: "" });
  const [deleteBlockedDialog, setDeleteBlockedDialog] = reactExports.useState({ open: false, message: "" });
  const [form, setForm] = reactExports.useState({
    classLevel: "",
    name: "",
    roomNo: "",
    classTeacher: ""
  });
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
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
  function openEdit(s) {
    setEditId(s.id);
    setForm({
      classLevel: s.classLevel,
      name: s.name,
      roomNo: s.roomNo ?? "",
      classTeacher: s.teacherId ?? ""
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
          classLevel: form.classLevel,
          sectionName: form.name.trim(),
          roomNo,
          teacherId
        });
        ue.success("Section updated successfully.");
        setDialogOpen(false);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to update section.";
        setDialogOpen(false);
        setErrorDialog({
          open: true,
          message: msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("duplicate") ? `A section "${form.name.trim()}" already exists for ${CLASS_LABELS[form.classLevel]}.` : msg
        });
      }
    } else {
      try {
        await createSection.mutateAsync({
          classLevel: form.classLevel,
          sectionName: form.name.trim(),
          roomNo,
          teacherId
        });
        ue.success(`Section "${form.name.trim()}" added successfully.`);
        setForm({ classLevel: "", name: "", roomNo: "", classTeacher: "" });
        setDialogOpen(false);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to add section.";
        setDialogOpen(false);
        setErrorDialog({
          open: true,
          message: msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("duplicate") ? `A section "${form.name.trim()}" already exists for ${CLASS_LABELS[form.classLevel]}.` : msg
        });
      }
    }
  }
  async function confirmDelete(enrolledCount) {
    if (!deleteId) return;
    try {
      await deleteSection.mutateAsync(deleteId);
      ue.success("Section deleted.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete section.";
      if (msg.toLowerCase().includes("enrolled") || msg.toLowerCase().includes("student")) {
        setDeleteBlockedDialog({
          open: true,
          message: "Cannot delete this section — students are currently enrolled."
        });
      } else {
        setErrorDialog({ open: true, message: msg });
      }
    }
    setDeleteId(null);
  }
  const isSaving = createSection.isPending || updateSection.isPending;
  if (drillDownClass) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClassDrillDown,
      {
        classLevel: drillDownClass,
        sessionId,
        onBack: () => setDrillDownClass(null)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.classes_sections", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Session:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: sessionId }),
        " — ",
        'Click "Students" badge to see enrolled students.'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAdd,
          "data-ocid": "academics.add_section_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
            " Add Section"
          ]
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "academics.sections_loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }),
    !isLoading && grouped.size === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center",
        "data-ocid": "academics.sections_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-10 mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No sections yet. Add your first section." })
        ]
      }
    ),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from(grouped.entries()).map(([cls, clsSections]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClassCard,
      {
        cls,
        clsSections,
        sessionId,
        onDrillDown: (cl) => setDrillDownClass(cl)
      },
      cls
    )) }),
    !isLoading && grouped.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Manage Sections" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/20 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Section" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Room" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-semibold text-foreground", children: "Teacher" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-center font-semibold text-foreground", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Array.from(grouped.entries()).flatMap(
          ([, clsSections]) => clsSections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ManageSectionRow,
            {
              section: s,
              sessionId,
              index: i,
              onEdit: () => openEdit(s),
              onDelete: (enrolledCount) => {
                setDeleteId(s.id);
                if (enrolledCount > 0) {
                  setDeleteId(null);
                  setDeleteBlockedDialog({
                    open: true,
                    message: `Cannot delete — ${enrolledCount} student${enrolledCount !== 1 ? "s are" : " is"} enrolled.`
                  });
                }
              }
            },
            s.id
          ))
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: dialogOpen,
        onOpenChange: (open) => {
          if (!isSaving) setDialogOpen(open);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "z-[9999]",
            "data-ocid": "academics.section_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Section" : "Add Section" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                    "Class ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: form.classLevel,
                      onValueChange: (v) => setForm({ ...form, classLevel: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "academics.section_form.class_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                    "Section Name ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. A, B, C",
                      value: form.name,
                      onChange: (e) => setForm({ ...form, name: e.target.value }),
                      "data-ocid": "academics.section_form.name_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Room No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. Room 201",
                      value: form.roomNo,
                      onChange: (e) => setForm({ ...form, roomNo: e.target.value }),
                      "data-ocid": "academics.section_form.room_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class Teacher" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "Teacher name",
                      value: form.classTeacher,
                      onChange: (e) => setForm({ ...form, classTeacher: e.target.value }),
                      "data-ocid": "academics.section_form.teacher_input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setDialogOpen(false),
                    disabled: isSaving,
                    "data-ocid": "academics.section_form.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: saveSection,
                    disabled: !form.classLevel || !form.name.trim() || isSaving,
                    "data-ocid": "academics.section_form.submit_button",
                    children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                      "Saving…"
                    ] }) : editId ? "Save Changes" : "Add Section"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "academics.delete_section_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Section?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently remove the section." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteId(null),
                disabled: deleteSection.isPending,
                "data-ocid": "academics.delete_section_dialog.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => confirmDelete(),
                disabled: deleteSection.isPending,
                "data-ocid": "academics.delete_section_dialog.confirm_button",
                children: deleteSection.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                  "Deleting…"
                ] }) : "Delete"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: errorDialog.open,
        onOpenChange: (open) => !open && setErrorDialog({ open: false, message: "" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "z-[9999] max-w-sm",
            "data-ocid": "academics.section_error_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-destructive flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✕" }),
                " Cannot Save Section"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: errorDialog.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => setErrorDialog({ open: false, message: "" }),
                  "data-ocid": "academics.section_error_dialog.ok_button",
                  children: "OK"
                }
              ) })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: deleteBlockedDialog.open,
        onOpenChange: (open) => !open && setDeleteBlockedDialog({ open: false, message: "" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "z-[9999] max-w-sm",
            "data-ocid": "academics.delete_blocked_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-amber-600 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5" }),
                " Cannot Delete Section"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: deleteBlockedDialog.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => setDeleteBlockedDialog({ open: false, message: "" }),
                  "data-ocid": "academics.delete_blocked_dialog.ok_button",
                  children: "OK, I understand"
                }
              ) })
            ]
          }
        )
      }
    )
  ] });
}
function ManageSectionRow({
  section: s,
  sessionId,
  index: i,
  onEdit,
  onDelete
}) {
  const { data: enrolled = 0 } = useGetEnrolledCountBySection(s.id, sessionId);
  const hasStudents = enrolled > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-medium text-muted-foreground", children: CLASS_LABELS[s.classLevel] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-medium text-foreground", children: [
      "Section ",
      s.name
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.roomNo || "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: s.teacherId || "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "size-7",
          onClick: onEdit,
          "data-ocid": `academics.edit_section.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: `size-7 ${hasStudents ? "text-muted-foreground cursor-not-allowed opacity-50" : "text-destructive hover:text-destructive"}`,
          onClick: () => onDelete(enrolled),
          title: hasStudents ? `${enrolled} student${enrolled !== 1 ? "s" : ""} enrolled` : "Delete section",
          "data-ocid": `academics.delete_section.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
        }
      )
    ] }) })
  ] });
}
function AssignClassesDialog({
  subject,
  currentClasses,
  onSave,
  onClose,
  isSaving
}) {
  const [selected, setSelected] = reactExports.useState(
    new Set(currentClasses)
  );
  function toggle(cl) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cl)) next.delete(cl);
      else next.add(cl);
      return next;
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "z-[9999] max-w-sm",
      "data-ocid": "academics.assign_classes_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
          "Assign Classes — ",
          subject.name
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Select the classes that study this subject." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 py-2 max-h-72 overflow-y-auto", children: CLASS_ORDER.map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: `assign-${subject.id}-${cl}`,
            className: "flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 px-3 py-2 cursor-pointer transition-colors",
            "data-ocid": `academics.assign_classes.${cl}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: selected.has(cl),
                  onCheckedChange: () => toggle(cl),
                  id: `assign-${subject.id}-${cl}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: CLASS_LABELS[cl] })
            ]
          },
          cl
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              disabled: isSaving,
              "data-ocid": "academics.assign_classes_dialog.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => onSave(Array.from(selected)),
              disabled: isSaving,
              "data-ocid": "academics.assign_classes_dialog.save_button",
              children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                "Saving…"
              ] }) : "Save"
            }
          )
        ] })
      ]
    }
  ) });
}
function SubjectsTab() {
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [activeOnly, setActiveOnly] = reactExports.useState(false);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [assignSubject, setAssignSubject] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    code: "",
    maxMarks: "100",
    passingMarks: "35"
  });
  const [dialogSelectedClasses, setDialogSelectedClasses] = reactExports.useState(/* @__PURE__ */ new Set());
  const { data: subjects = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const updateSubjectClasses = useUpdateSubjectClasses();
  const { data: allClassMaps = {} } = useGetAllSubjectClassMaps();
  function getAssignedClasses(subjectId) {
    return allClassMaps[subjectId] ?? [];
  }
  const activeSubjects = reactExports.useMemo(
    () => subjects.filter((s) => (allClassMaps[s.id] ?? []).length > 0),
    [subjects, allClassMaps]
  );
  const filtered = reactExports.useMemo(() => {
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
      passingMarks: "35"
    });
    setDialogSelectedClasses(/* @__PURE__ */ new Set());
    setDialogOpen(true);
  }
  function openEdit(s) {
    setEditId(s.id);
    setForm({
      name: s.name,
      code: s.code,
      maxMarks: "100",
      passingMarks: "35"
    });
    const assigned = allClassMaps[s.id] ?? [];
    setDialogSelectedClasses(
      new Set(assigned.length > 0 ? assigned : [s.classLevel])
    );
    setDialogOpen(true);
  }
  async function saveSubject() {
    if (!form.name.trim()) return;
    const selectedSorted = CLASS_ORDER.filter(
      (cl) => dialogSelectedClasses.has(cl)
    );
    const derivedClassLevel = selectedSorted[0] ?? CLASS_ORDER[0];
    try {
      let subjectId = editId;
      if (editId) {
        await updateSubject.mutateAsync({
          id: editId,
          name: form.name,
          code: form.code,
          classLevel: derivedClassLevel,
          maxMarks: Number(form.maxMarks) || 100,
          passingMarks: Number(form.passingMarks) || 35
        });
      } else {
        const created = await createSubject.mutateAsync({
          name: form.name,
          code: form.code,
          classLevel: derivedClassLevel,
          maxMarks: Number(form.maxMarks) || 100,
          passingMarks: Number(form.passingMarks) || 35
        });
        subjectId = created.id;
      }
      if (subjectId) {
        await updateSubjectClasses.mutateAsync({
          subjectId,
          classLevels: Array.from(dialogSelectedClasses)
        });
      }
      ue.success(
        editId ? "Subject updated." : `Subject "${form.name}" added.`
      );
      setDialogOpen(false);
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to save subject.");
    }
  }
  async function handleDeleteSubject() {
    if (!deleteId) return;
    try {
      await deleteSubject.mutateAsync(deleteId);
      ue.success("Subject deleted.");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to delete subject.");
    }
    setDeleteId(null);
  }
  async function handleSaveAssignClasses(classes) {
    if (!assignSubject) return;
    const subjectName = assignSubject.name;
    const subjectId = assignSubject.id;
    try {
      await updateSubjectClasses.mutateAsync({
        subjectId,
        classLevels: classes
      });
      ue.success(
        classes.length > 0 ? `"${subjectName}" assigned to ${classes.length} class${classes.length !== 1 ? "es" : ""} successfully.` : `"${subjectName}" class assignments cleared.`
      );
      setAssignSubject(null);
    } catch (err) {
      ue.error(
        err instanceof Error ? `Failed to save: ${err.message}` : "Failed to save class assignments."
      );
    }
  }
  const isSaving = createSubject.isPending || updateSubject.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.subjects", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
          subjects.length,
          " subject",
          subjects.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "secondary",
            className: "text-xs bg-green-500/15 text-green-700 border-green-500/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 mr-1" }),
              activeSubjects.length,
              " active"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveOnly((v) => !v),
          className: `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${activeOnly ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"}`,
          "data-ocid": "academics.subjects_active_filter_toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-3.5" }),
            activeOnly ? "Active subjects only" : "All subjects"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: classFilter,
          onValueChange: (v) => setClassFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-48",
                "data-ocid": "academics.subjects_class_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by class" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
              CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAdd,
          "data-ocid": "academics.add_subject_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
            " Add Subject"
          ]
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Subject Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Assigned Classes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-10 text-center text-muted-foreground",
            "data-ocid": "academics.subjects_empty_state",
            children: subjects.length === 0 ? "No subjects yet. Add your first subject." : activeOnly ? 'No active subjects (assigned to a class). Toggle "All subjects" to see all.' : "No subjects match this filter."
          }
        ) }),
        filtered.map((s, i) => {
          const assignedClasses = getAssignedClasses(s.id);
          const isActive = assignedClasses.length > 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/10",
              "data-ocid": `academics.subject.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${subjectColor(s.name)}`,
                      children: s.name
                    }
                  ),
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-green-500/15 text-green-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
                    " Active"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-muted-foreground text-xs", children: s.code }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: assignedClasses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                  assignedClasses.slice(0, 3).map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs",
                      children: CLASS_LABELS[cl] ?? cl
                    },
                    cl
                  )),
                  assignedClasses.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                    "+",
                    assignedClasses.length - 3,
                    " more"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Not assigned to any class" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: s.isOptional ? "secondary" : "default",
                    className: "text-xs",
                    children: s.isOptional ? "Optional" : "Core"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "h-7 text-xs px-2",
                      onClick: () => setAssignSubject(s),
                      "data-ocid": `academics.assign_classes_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-3 mr-1" }),
                        "Classes"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7",
                      onClick: () => openEdit(s),
                      "data-ocid": `academics.edit_subject.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7 text-destructive hover:text-destructive",
                      onClick: () => setDeleteId(s.id),
                      "data-ocid": `academics.delete_subject.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                    }
                  )
                ] }) })
              ]
            },
            s.id
          );
        })
      ] })
    ] }) }),
    assignSubject && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AssignClassesDialog,
      {
        subject: assignSubject,
        currentClasses: getAssignedClasses(assignSubject.id),
        onSave: handleSaveAssignClasses,
        onClose: () => setAssignSubject(null),
        isSaving: updateSubjectClasses.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "academics.subject_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Subject" : "Add Subject" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Subject Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Mathematics",
                  value: form.name,
                  onChange: (e) => setForm({ ...form, name: e.target.value }),
                  "data-ocid": "academics.subject_form.name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. MAT",
                  value: form.code,
                  onChange: (e) => setForm({ ...form, code: e.target.value }),
                  "data-ocid": "academics.subject_form.code_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Max Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "100",
                  value: form.maxMarks,
                  onChange: (e) => setForm({
                    ...form,
                    maxMarks: e.target.value.replace(/\D/g, "")
                  }),
                  "data-ocid": "academics.subject_form.max_marks_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Passing Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "35",
                  value: form.passingMarks,
                  onChange: (e) => setForm({
                    ...form,
                    passingMarks: e.target.value.replace(/\D/g, "")
                  }),
                  "data-ocid": "academics.subject_form.passing_marks_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t border-border pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                "Assign to Classes",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-primary hover:underline",
                    onClick: () => setDialogSelectedClasses(new Set(CLASS_ORDER)),
                    "data-ocid": "academics.subject_form.select_all_classes",
                    children: "Select All"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-muted-foreground hover:underline",
                    onClick: () => setDialogSelectedClasses(/* @__PURE__ */ new Set()),
                    "data-ocid": "academics.subject_form.clear_all_classes",
                    children: "Clear All"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1", children: CLASS_ORDER.map((cl) => {
              const isChecked = dialogSelectedClasses.has(cl);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: `dialog-assign-${cl}`,
                  className: `flex items-center gap-2 rounded-md border px-2.5 py-1.5 cursor-pointer transition-colors text-sm ${isChecked ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/20 hover:bg-muted/40"}`,
                  "data-ocid": `academics.subject_form.class_checkbox.${cl}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: `dialog-assign-${cl}`,
                        checked: isChecked,
                        onCheckedChange: (checked) => {
                          setDialogSelectedClasses((prev) => {
                            const next = new Set(prev);
                            if (checked) next.add(cl);
                            else next.delete(cl);
                            return next;
                          });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: CLASS_LABELS[cl] })
                  ]
                },
                cl
              );
            }) }),
            dialogSelectedClasses.size > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary", children: [
              "Assigned to ",
              dialogSelectedClasses.size,
              " class",
              dialogSelectedClasses.size !== 1 ? "es" : ""
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Please select at least one class." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDialogOpen(false),
                "data-ocid": "academics.subject_form.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: saveSubject,
                disabled: !form.name.trim() || dialogSelectedClasses.size === 0 || isSaving || updateSubjectClasses.isPending,
                "data-ocid": "academics.subject_form.submit_button",
                children: isSaving || updateSubjectClasses.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                  "Saving…"
                ] }) : editId ? "Save Changes" : "Add Subject"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "academics.delete_subject_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Subject?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will remove the subject and all its syllabus data." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteId(null),
                "data-ocid": "academics.delete_subject_dialog.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: handleDeleteSubject,
                disabled: deleteSubject.isPending,
                "data-ocid": "academics.delete_subject_dialog.confirm_button",
                children: deleteSubject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                  "Deleting…"
                ] }) : "Delete"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function ChapterContentPanel({
  chapter,
  role,
  onClose
}) {
  const { data: content } = useSyllabusContent(chapter.id);
  const saveContent = useSaveSyllabusContent();
  const submitApproval = useSubmitChapterForApproval();
  const approveChapter = useApproveChapter();
  const rejectChapter = useRejectChapter();
  const [contentText, setContentText] = reactExports.useState((content == null ? void 0 : content.contentText) ?? "");
  const [qaPairs, setQAPairs] = reactExports.useState(
    (content == null ? void 0 : content.qaPairs) ?? []
  );
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [showRejectForm, setShowRejectForm] = reactExports.useState(false);
  const status = (content == null ? void 0 : content.status) ?? "Draft";
  const isPrincipal = role === "Principal" || role === "Admin";
  const isTeacher = role === "Teacher" || role === "Admin";
  const [synced, setSynced] = reactExports.useState(false);
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
      ue.success(
        `Generated ${generated.length} Q&A pairs from chapter content.`
      );
    }, 800);
  }
  async function handleSaveQA() {
    const newContent = {
      chapterId: chapter.id,
      contentText,
      userProvidedQuestions: (content == null ? void 0 : content.userProvidedQuestions) ?? [],
      qaPairs,
      status: (content == null ? void 0 : content.status) ?? "Draft",
      rejectionReason: (content == null ? void 0 : content.rejectionReason) ?? "",
      submittedAt: (content == null ? void 0 : content.submittedAt) ?? null,
      approvedAt: (content == null ? void 0 : content.approvedAt) ?? null
    };
    await saveContent.mutateAsync(newContent);
    ue.success("Content and Q&A saved.");
  }
  async function handleSubmit() {
    if (!content && !contentText.trim()) {
      ue.error("Please add chapter content and Q&A before submitting.");
      return;
    }
    await saveContent.mutateAsync({
      chapterId: chapter.id,
      contentText,
      userProvidedQuestions: (content == null ? void 0 : content.userProvidedQuestions) ?? [],
      qaPairs,
      status: "Draft",
      rejectionReason: "",
      submittedAt: null,
      approvedAt: null
    });
    await submitApproval.mutateAsync(chapter.id);
    ue.success("Chapter submitted for principal approval.");
  }
  async function handleApprove() {
    await approveChapter.mutateAsync(chapter.id);
    ue.success("Chapter approved and published for students.");
  }
  async function handleReject() {
    if (!rejectReason.trim()) {
      ue.error("Please enter a rejection reason.");
      return;
    }
    await rejectChapter.mutateAsync({
      chapterId: chapter.id,
      reason: rejectReason
    });
    ue.success("Chapter rejected. Teacher will be notified.");
    setShowRejectForm(false);
    setRejectReason("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.chapter_content_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onClose,
          "data-ocid": "academics.chapter_content_back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
            " Back to Chapters"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ApprovalBadge, { status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
        "Chapter ",
        chapter.chapterNo,
        ": ",
        chapter.title
      ] }),
      chapter.topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Topics: ",
        chapter.topics.join(", ")
      ] })
    ] }),
    status === "Rejected" && (content == null ? void 0 : content.rejectionReason) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-red-200 bg-red-50 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-red-700 mb-0.5", children: "Rejection Reason:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-700", children: content.rejectionReason })
    ] }),
    !isPrincipal && !isTeacher && status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-2", children: "Chapter Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: contentText })
      ] }),
      qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Questions & Answers" }),
        qaPairs.map((qa, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-card p-3 space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                "Q",
                i + 1,
                ". ",
                qa.question
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Ans: ",
                qa.answer
              ] })
            ]
          },
          qa.id
        ))
      ] })
    ] }),
    isTeacher && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Chapter Content Text" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Type or paste the chapter content here. The more text you provide, the better Q&A will be generated.",
            value: contentText,
            onChange: (e) => setContentText(e.target.value),
            rows: 8,
            className: "resize-none text-sm",
            disabled: status === "Pending" || status === "Approved",
            "data-ocid": "academics.chapter_content_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleGenerate,
            disabled: !contentText.trim() || isGenerating || status === "Pending" || status === "Approved",
            "data-ocid": "academics.generate_qa_button",
            children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
              "Generating…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 mr-1.5" }),
              "Generate Q&A"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: handleSaveQA,
            disabled: saveContent.isPending || status === "Pending" || status === "Approved",
            "data-ocid": "academics.save_qa_button",
            children: saveContent.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
              "Saving…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 mr-1.5" }),
              "Save Q&A"
            ] })
          }
        ),
        (status === "Draft" || status === "Rejected") && qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "default",
            className: "ml-auto",
            onClick: handleSubmit,
            disabled: submitApproval.isPending,
            "data-ocid": "academics.submit_for_approval_button",
            children: submitApproval.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
              "Submitting…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4 mr-1.5" }),
              "Submit for Approval"
            ] })
          }
        )
      ] }),
      qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
          "Q&A Pairs (",
          qaPairs.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 pr-2", children: qaPairs.map((qa, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-border bg-muted/10 p-3 space-y-1.5",
            "data-ocid": `academics.qa_pair.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3.5 text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "h-7 text-xs mb-1",
                    value: qa.question,
                    onChange: (e) => setQAPairs(
                      (prev) => prev.map(
                        (p, idx) => idx === i ? { ...p, question: e.target.value } : p
                      )
                    ),
                    disabled: status === "Pending" || status === "Approved",
                    "data-ocid": `academics.qa_question_input.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    className: "resize-none text-xs",
                    rows: 2,
                    value: qa.answer,
                    onChange: (e) => setQAPairs(
                      (prev) => prev.map(
                        (p, idx) => idx === i ? { ...p, answer: e.target.value } : p
                      )
                    ),
                    disabled: status === "Pending" || status === "Approved",
                    "data-ocid": `academics.qa_answer_input.${i + 1}`
                  }
                )
              ] }),
              status !== "Pending" && status !== "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-6 shrink-0 text-muted-foreground hover:text-destructive",
                  onClick: () => setQAPairs(
                    (prev) => prev.filter((_, idx) => idx !== i)
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
                }
              )
            ] })
          },
          qa.id
        )) }) })
      ] })
    ] }),
    isPrincipal && status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-800", children: "Principal Review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-1", children: "Chapter Content:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: contentText || "(No content)" })
      ] }),
      qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground", children: [
          "Q&A (",
          qaPairs.length,
          " pairs):"
        ] }),
        qaPairs.slice(0, 3).map((qa, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
            "Q: ",
            qa.question
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "A: ",
          qa.answer
        ] }, qa.id)),
        qaPairs.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "...and ",
          qaPairs.length - 3,
          " more"
        ] })
      ] }),
      !showRejectForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleApprove,
            disabled: approveChapter.isPending,
            "data-ocid": "academics.approve_chapter_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 mr-1.5" }),
              "Approve & Publish"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "destructive",
            onClick: () => setShowRejectForm(true),
            "data-ocid": "academics.reject_chapter_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 mr-1.5" }),
              "Reject"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Enter rejection reason...",
            value: rejectReason,
            onChange: (e) => setRejectReason(e.target.value),
            rows: 2,
            "data-ocid": "academics.reject_reason_textarea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: handleReject,
              disabled: rejectChapter.isPending,
              "data-ocid": "academics.confirm_reject_button",
              children: rejectChapter.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                "Rejecting…"
              ] }) : "Confirm Reject"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => setShowRejectForm(false),
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function SyllabusTab() {
  var _a;
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const [classFilter, setClassFilter] = reactExports.useState(
    CLASS_ORDER[3] ?? "Class1"
  );
  const [subjectFilter, setSubjectFilter] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [activeChapter, setActiveChapter] = reactExports.useState(
    null
  );
  const [form, setForm] = reactExports.useState({ title: "", topics: "", chapterNo: "1" });
  const { currentRole } = useAppStore();
  const classSubjects = subjects.filter((s) => s.classLevel === classFilter);
  const effectiveSubject = subjectFilter && classSubjects.some((s) => s.id === subjectFilter) ? subjectFilter : ((_a = classSubjects[0]) == null ? void 0 : _a.id) ?? "";
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(effectiveSubject);
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();
  const updateProgress = useUpdateChapterProgress();
  const [progressEdit, setProgressEdit] = reactExports.useState(null);
  function openAdd() {
    setEditId(null);
    setForm({ title: "", topics: "", chapterNo: String(chapters.length + 1) });
    setDialogOpen(true);
  }
  async function saveChapter() {
    if (!form.title || !effectiveSubject) return;
    const topics = form.topics.trim() ? form.topics.split(",").map((t) => t.trim()).filter(Boolean) : [];
    try {
      await createChapter.mutateAsync({
        subjectId: effectiveSubject,
        chapterNo: Number(form.chapterNo) || chapters.length + 1,
        title: form.title,
        topics
      });
      ue.success(`Chapter "${form.title}" added.`);
      setDialogOpen(false);
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to add chapter.");
    }
  }
  async function handleDeleteChapter(id) {
    try {
      await deleteChapter.mutateAsync({ id, subjectId: effectiveSubject });
      ue.success("Chapter deleted.");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to delete chapter.");
    }
  }
  async function saveProgress(chapter) {
    if (!progressEdit) return;
    const pct = Math.min(
      100,
      Math.max(0, Number.parseInt(progressEdit.value) || 0)
    );
    try {
      await updateProgress.mutateAsync({
        id: chapter.id,
        subjectId: effectiveSubject,
        completionPercent: pct
      });
      setProgressEdit(null);
    } catch (_e) {
      ue.error("Failed to update progress.");
    }
  }
  if (activeChapter) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChapterContentPanel,
      {
        chapter: activeChapter,
        role: currentRole,
        onClose: () => setActiveChapter(null)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.syllabus", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: classFilter,
          onValueChange: (v) => {
            setClassFilter(v);
            setSubjectFilter("");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-44",
                "data-ocid": "academics.syllabus_class_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Class" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: effectiveSubject, onValueChange: setSubjectFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-48",
            "data-ocid": "academics.syllabus_subject_filter",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Subject" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
          classSubjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_none", disabled: true, children: "No subjects" }),
          classSubjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAdd,
          disabled: !effectiveSubject,
          "data-ocid": "academics.add_chapter_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
            " Add Chapter"
          ]
        }
      )
    ] }),
    (subjectsLoading || chaptersLoading) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }),
    !chaptersLoading && chapters.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center",
        "data-ocid": "academics.syllabus_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: !effectiveSubject ? "Select a subject to view chapters." : "No chapters added yet for this subject." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: chapters.map((c, i) => {
      const isEditingProgress = (progressEdit == null ? void 0 : progressEdit.id) === c.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4 space-y-3",
          "data-ocid": `academics.chapter.item.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0", children: c.chapterNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: c.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterStatusBadge, { chapterId: c.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "h-7 text-xs px-2",
                      onClick: () => setActiveChapter(c),
                      "data-ocid": `academics.open_content.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3 mr-1" }),
                        "Content & Q&A"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7 text-destructive hover:text-destructive",
                      onClick: () => handleDeleteChapter(c.id),
                      "data-ocid": `academics.delete_chapter.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                    }
                  )
                ] })
              ] }),
              c.topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Topics: ",
                c.topics.join(", ")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: c.completionPercent, className: "h-2" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground", children: [
                  c.completionPercent,
                  "%"
                ] }),
                isEditingProgress ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      className: "w-16 h-7 text-center text-xs",
                      value: progressEdit.value,
                      onChange: (e) => setProgressEdit({
                        ...progressEdit,
                        value: e.target.value.replace(/\D/g, "")
                      }),
                      "data-ocid": `academics.progress_input.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "h-7 text-xs px-2",
                      onClick: () => saveProgress(c),
                      "data-ocid": `academics.save_progress.${i + 1}`,
                      children: "Set"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 text-xs px-2",
                      onClick: () => setProgressEdit(null),
                      children: "✕"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-7",
                    onClick: () => setProgressEdit({
                      id: c.id,
                      value: String(c.completionPercent)
                    }),
                    "data-ocid": `academics.edit_progress.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                  }
                )
              ] })
            ] })
          ] })
        },
        c.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "academics.chapter_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Chapter" : "Add Chapter" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chapter No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "1",
                    value: form.chapterNo,
                    onChange: (e) => setForm({
                      ...form,
                      chapterNo: e.target.value.replace(/\D/g, "")
                    }),
                    "data-ocid": "academics.chapter_form.no_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Chapter Title ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "e.g. Number System",
                    value: form.title,
                    onChange: (e) => setForm({ ...form, title: e.target.value }),
                    "data-ocid": "academics.chapter_form.title_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Topics (comma-separated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Integers, Fractions, Decimals",
                  value: form.topics,
                  onChange: (e) => setForm({ ...form, topics: e.target.value }),
                  "data-ocid": "academics.chapter_form.topics_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Separate multiple topics with commas." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDialogOpen(false),
                "data-ocid": "academics.chapter_form.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: saveChapter,
                disabled: !form.title || createChapter.isPending,
                "data-ocid": "academics.chapter_form.submit_button",
                children: createChapter.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1.5 animate-spin" }),
                  "Adding…"
                ] }) : editId ? "Save Changes" : "Add Chapter"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function ChapterStatusBadge({ chapterId }) {
  const { data: content } = useSyllabusContent(chapterId);
  if (!content) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ApprovalBadge, { status: content.status });
}
function TimetableTab() {
  var _a;
  const { data: sections = [] } = useGetSections();
  const [selectedClass, setSelectedClass] = reactExports.useState("Class5");
  const [selectedSection, setSelectedSection] = reactExports.useState("");
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const t = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(t);
  }, []);
  const classSections = sections.filter((s) => s.classLevel === selectedClass);
  const todayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ][currentTime.getDay()];
  const isSchoolDay = DAYS.includes(todayName);
  function timeStrToMins(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
  function getCurrentPeriodStatus(startTimeStr, endTimeStr, isToday) {
    if (!isToday) return "upcoming";
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMins = timeStrToMins(startTimeStr);
    const endMins = timeStrToMins(endTimeStr);
    if (currentMins >= startMins && currentMins < endMins) return "current";
    if (currentMins >= endMins) return "past";
    return "upcoming";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "academics.timetable", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: selectedClass,
          onValueChange: (v) => {
            var _a2;
            setSelectedClass(v);
            const secs = sections.filter((s) => s.classLevel === v);
            setSelectedSection(((_a2 = secs[0]) == null ? void 0 : _a2.id) ?? "");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-44",
                "data-ocid": "academics.timetable_class_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedSection, onValueChange: setSelectedSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-36",
            "data-ocid": "academics.timetable_section_select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Section" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
          classSections.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_none", disabled: true, children: "No sections" }),
          classSections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
            "Section ",
            s.name
          ] }, s.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: currentTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => window.print(),
          "data-ocid": "academics.print_timetable_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-1" }),
            " Print Timetable"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold font-display text-foreground", children: [
        CLASS_LABELS[selectedClass],
        " — Section",
        " ",
        ((_a = classSections.find((s) => s.id === selectedSection)) == null ? void 0 : _a.name) ?? "—",
        " · Weekly Timetable"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left font-semibold text-foreground w-32", children: "Period" }),
          DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-3 py-2.5 text-center font-semibold text-foreground ${d === todayName ? "text-primary" : ""}`,
              children: d
            },
            d
          ))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: PERIODS.map((period, pi) => {
          if (period.isBreak) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "tr",
              {
                className: "border-b border-border bg-amber-50/60",
                "data-ocid": `academics.timetable.row.${pi + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-3 py-1.5 align-middle",
                    colSpan: DAYS.length + 1,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-amber-700 uppercase tracking-wide", children: [
                      "☕ Break — ",
                      period.durationMins,
                      " min  · ",
                      " ",
                      period.startTime,
                      "–",
                      period.endTime
                    ] })
                  }
                )
              },
              "BREAK"
            );
          }
          const status = getCurrentPeriodStatus(
            period.startTime,
            period.endTime,
            isSchoolDay
          );
          const rowCls = status === "current" ? "border-b border-border bg-green-50 border-l-4 border-l-green-500" : status === "past" ? "border-b border-border bg-red-50/40 opacity-70" : "border-b border-border last:border-0 hover:bg-muted/10";
          const slot = sampleTimetable[period.label];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: rowCls,
              "data-ocid": `academics.timetable.row.${pi + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 align-middle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground leading-tight", children: period.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground leading-tight", children: [
                      period.startTime,
                      "–",
                      period.endTime
                    ] })
                  ] }),
                  status === "current" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 inline-flex items-center rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide animate-pulse", children: "LIVE" })
                ] }) }),
                DAYS.map((day) => {
                  const cell = (slot == null ? void 0 : slot[day]) ?? null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "px-2 py-2 text-center align-middle",
                      children: cell ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `inline-flex flex-col items-center rounded-md px-2 py-1 text-xs border ${subjectColor(
                            cell.subject
                          )}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold leading-tight", children: cell.subject }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-75 leading-tight", children: cell.teacher.split(" ")[0] })
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Free" })
                    },
                    day
                  );
                })
              ]
            },
            period.label
          );
        }) })
      ] })
    ] })
  ] });
}
function AcademicsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "academics.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Academics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Classes, sections, subjects, syllabus, and timetables" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "classes", "data-ocid": "academics.tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "classes", "data-ocid": "academics.classes_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4 mr-1.5" }),
          "Classes & Sections"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "subjects", "data-ocid": "academics.subjects_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 mr-1.5" }),
          "Subjects"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "syllabus", "data-ocid": "academics.syllabus_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 mr-1.5" }),
          "Syllabus"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "timetable", "data-ocid": "academics.timetable_tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "size-4 mr-1.5" }),
          "Timetable"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "classes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClassesSectionsTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "subjects", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubjectsTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "syllabus", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SyllabusTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timetable", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimetableTab, {}) })
    ] })
  ] });
}
export {
  AcademicsPage as default
};
