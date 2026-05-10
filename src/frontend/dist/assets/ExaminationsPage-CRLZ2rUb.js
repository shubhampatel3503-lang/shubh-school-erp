import { ae as createLucideIcon, d as useAppStore, r as reactExports, aY as useGetExamConfigsByClass, a5 as useStudents, aZ as useSaveExamMarks, j as jsxRuntimeExports, e as Button, l as LoaderCircle, C as CLASS_ORDER, i as CLASS_LABELS, S as Skeleton, a_ as ClipboardList, I as Input, F as ue, a$ as useSessions, b0 as useGetAcademicPerformanceReport, t as Badge, b1 as useGetAllExamConfigs, b2 as useSaveExamConfig, b3 as useDeleteExamConfig, X, L as Label, B as BookOpen, a1 as generateId, b4 as useGetExamResultsByStudent, b5 as Award, ar as useCertificateTemplates, aq as FileText, m as useSubjects, b6 as useGetSmartExamTimetables, b7 as useCreateSmartExamTimetable, b8 as useUpdateSmartExamTimetable, b9 as useDeleteSmartExamTimetable, ba as useGenerateSmartExamSchedule, bb as CalendarDays, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, k as DialogFooter, a0 as formatDate, ab as downloadCSV } from "./index-pMBTUEbj.js";
import { G as GeneratePrintModal } from "./GeneratePrintModal-DKNLACr9.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { C as Checkbox } from "./checkbox-B6f3RDRz.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { C as ChartNoAxesColumn } from "./chart-no-axes-column-FtqDFsff.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { a as ChevronUp, C as ChevronDown } from "./index-Nv6ob_Pe.js";
import { S as Settings2 } from "./settings-2-CEQY6662.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { G as GripVertical } from "./grip-vertical-CWSfxBAQ.js";
import { S as Sparkles } from "./sparkles-u5rnlKDb.js";
import { C as Circle } from "./circle-DVWL3YbQ.js";
import "./FeeReceiptTemplate-BjT7XvY6.js";
import "./calendar-CAegGMND.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function calcGrade(obtained, max) {
  if (max <= 0) return { grade: "—", label: "" };
  const pct = obtained / max * 100;
  if (pct >= 91) return { grade: "A1", label: "Outstanding" };
  if (pct >= 81) return { grade: "A2", label: "Excellent" };
  if (pct >= 71) return { grade: "B1", label: "Very Good" };
  if (pct >= 61) return { grade: "B2", label: "Good" };
  if (pct >= 51) return { grade: "C1", label: "Average" };
  if (pct >= 41) return { grade: "C2", label: "Satisfactory" };
  if (pct >= 33) return { grade: "D", label: "Needs Improvement" };
  return { grade: "E", label: "Fail" };
}
function GradeBadge({ obtained, max }) {
  const { grade } = calcGrade(obtained, max);
  const colorMap = {
    A1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    A2: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    B1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    B2: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    C1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    C2: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    D: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    E: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`,
      children: grade
    }
  );
}
function MarksEntryTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const [classId, setClassId] = reactExports.useState("Class10");
  const [examConfigId, setExamConfigId] = reactExports.useState("");
  const { data: configs = [], isLoading: loadingConfigs } = useGetExamConfigsByClass(sessionId, classId);
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const saveMutation = useSaveExamMarks();
  const students = reactExports.useMemo(
    () => allStudents.filter(
      (s) => s.classLevel === classId && s.sessionId === sessionId && !s.isDiscontinued
    ),
    [allStudents, classId, sessionId]
  );
  const selectedConfig = configs.find((c) => c.id === examConfigId);
  const [marks, setMarks] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  function getMarks(studentId, subjectId) {
    var _a;
    return ((_a = marks[studentId]) == null ? void 0 : _a[subjectId]) ?? 0;
  }
  function setMark(studentId, subjectId, val) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId] ?? {}, [subjectId]: val }
    }));
  }
  async function handleSaveAll() {
    if (!selectedConfig) return;
    setSaving(true);
    let successCount = 0;
    let failCount = 0;
    for (const student of students) {
      const rawMarks = selectedConfig.subjectConfigs.map((sc) => ({
        subjectId: sc.subjectId,
        subjectName: sc.subjectName,
        marksObtained: getMarks(student.id, sc.subjectId),
        maxMarks: sc.maxMarks,
        passingMarks: sc.passingMarks
      }));
      try {
        await saveMutation.mutateAsync({
          examConfigId: selectedConfig.id,
          sessionId,
          classId,
          studentId: student.id,
          rawMarks
        });
        successCount++;
      } catch {
        failCount++;
      }
    }
    setSaving(false);
    if (failCount === 0)
      ue.success(`Marks saved for ${successCount} students!`);
    else ue.warning(`Saved ${successCount}, failed ${failCount}.`);
  }
  const isLoading = loadingConfigs || loadingStudents;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Marks Entry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Enter marks per student — grades computed in real-time" })
      ] }),
      selectedConfig && students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleSaveAll,
          disabled: saving,
          "data-ocid": "marks.save_all_button",
          children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14, className: "mr-1.5" }),
            "Save All Marks"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: classId,
            onValueChange: (v) => {
              setClassId(v);
              setExamConfigId("");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "marks.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Exam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: examConfigId, onValueChange: setExamConfigId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-52", "data-ocid": "marks.exam.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select exam…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: loadingConfigs ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__loading__", disabled: true, children: "Loading…" }) : configs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", disabled: true, children: "No exams configured" }) : configs.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.examName }, c.id)) })
        ] })
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
    ] }),
    !isLoading && !examConfigId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "marks.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ClipboardList,
            {
              size: 32,
              className: "mx-auto text-muted-foreground/40 mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a class and exam to enter marks." })
        ]
      }
    ),
    !isLoading && examConfigId && !selectedConfig && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Exam config not found." }) }),
    !isLoading && selectedConfig && students.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "marks.no_students_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "No active students found in ",
          CLASS_LABELS[classId],
          " for session",
          " ",
          sessionId,
          "."
        ] })
      }
    ),
    !isLoading && selectedConfig && students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "table",
      {
        className: "w-full text-sm border-collapse",
        style: {
          minWidth: `${selectedConfig.subjectConfigs.length * 140 + 220}px`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3 font-semibold text-muted-foreground whitespace-nowrap sticky left-0 bg-muted/40 z-10", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-3 font-semibold text-foreground whitespace-nowrap sticky left-8 bg-muted/40 z-10 min-w-[160px]", children: "Student" }),
            selectedConfig.subjectConfigs.map((sc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "th",
              {
                className: "text-center px-2 py-3 font-semibold text-foreground whitespace-nowrap min-w-[130px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: sc.subjectName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-normal text-muted-foreground", children: [
                    "Max ",
                    sc.maxMarks,
                    " | Pass ",
                    sc.passingMarks
                  ] })
                ]
              },
              sc.subjectId
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[100px]", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[80px]", children: "Grade" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: students.map((student, si) => {
            const totalObtained = selectedConfig.subjectConfigs.reduce(
              (sum, sc) => sum + getMarks(student.id, sc.subjectId),
              0
            );
            const totalMax = selectedConfig.subjectConfigs.reduce(
              (sum, sc) => sum + sc.maxMarks,
              0
            );
            const { grade } = calcGrade(totalObtained, totalMax);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: `border-b border-border last:border-0 ${si % 2 === 0 ? "bg-background" : "bg-muted/10"}`,
                "data-ocid": `marks.row.${si + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-muted-foreground sticky left-0 bg-inherit z-[5]", children: si + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 sticky left-8 bg-inherit z-[5]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-xs", children: student.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: student.admNo })
                  ] }),
                  selectedConfig.subjectConfigs.map((sc, ci) => {
                    const val = getMarks(student.id, sc.subjectId);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-2 py-1.5 text-center",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "number",
                              min: 0,
                              max: sc.maxMarks,
                              value: val === 0 ? "" : val,
                              onChange: (e) => {
                                const n = Math.min(
                                  sc.maxMarks,
                                  Math.max(0, Number(e.target.value) || 0)
                                );
                                setMark(student.id, sc.subjectId, n);
                              },
                              className: "h-7 w-16 text-center text-xs",
                              placeholder: "0",
                              "data-ocid": `marks.cell.${si + 1}.${ci + 1}`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(GradeBadge, { obtained: val, max: sc.maxMarks })
                        ] })
                      },
                      sc.subjectId
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: totalObtained }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                      "/",
                      totalMax
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-bold text-sm ${grade === "E" ? "text-destructive" : grade.startsWith("A") ? "text-emerald-600" : "text-foreground"}`,
                      children: grade
                    }
                  ) })
                ]
              },
              student.id
            );
          }) })
        ]
      }
    ) })
  ] });
}
function GradeCell$1({ grade }) {
  const colorMap = {
    A1: "bg-emerald-100 text-emerald-800",
    A2: "bg-green-100 text-green-800",
    B1: "bg-blue-100 text-blue-800",
    B2: "bg-sky-100 text-sky-800",
    C1: "bg-yellow-100 text-yellow-800",
    C2: "bg-amber-100 text-amber-800",
    D: "bg-orange-100 text-orange-800",
    E: "bg-red-100 text-red-800"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`,
      children: grade
    }
  );
}
function AcademicPerformanceTab() {
  const currentSession = useAppStore((s) => s.currentSession);
  const [sessionId, setSessionId] = reactExports.useState(currentSession);
  const [studentId, setStudentId] = reactExports.useState("");
  const [searchQ, setSearchQ] = reactExports.useState("");
  const { data: sessions = [] } = useSessions();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: report, isLoading: loadingReport } = useGetAcademicPerformanceReport(studentId, sessionId);
  const student = allStudents.find((s) => s.id === studentId);
  const filteredStudents = reactExports.useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return allStudents.slice(0, 50);
    return allStudents.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [allStudents, searchQ]);
  const allSubjects = reactExports.useMemo(() => {
    if (!report) return [];
    const seen = /* @__PURE__ */ new Set();
    const names = [];
    for (const exam of report.examSummaries) {
      for (const sm of exam.subjectMarks) {
        if (!seen.has(sm.subjectName)) {
          seen.add(sm.subjectName);
          names.push(sm.subjectName);
        }
      }
    }
    return names;
  }, [report]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Academic Performance Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Year-end combined report across all exams" })
      ] }),
      report && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => window.print(),
          "data-ocid": "academic.print_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14, className: "mr-1.5" }),
            " Print"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sessionId, onValueChange: setSessionId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "academic.session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              placeholder: "Search by name or admission no…",
              value: searchQ,
              onChange: (e) => setSearchQ(e.target.value),
              "data-ocid": "academic.student_search.input"
            }
          ),
          searchQ && filteredStudents.length > 0 && !studentId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-md max-h-60 overflow-auto", children: filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between",
              onClick: () => {
                setStudentId(s.id);
                setSearchQ(s.fullName);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  s.admNo,
                  " ·",
                  " ",
                  CLASS_LABELS[s.classLevel] ?? s.classLevel
                ] })
              ]
            },
            s.id
          )) })
        ] })
      ] }),
      studentId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => {
            setStudentId("");
            setSearchQ("");
          },
          "data-ocid": "academic.clear_button",
          children: "Clear"
        }
      ) })
    ] }),
    student && report && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden", children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: student.photoUrl,
            alt: student.fullName,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: student.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            CLASS_LABELS[student.classLevel] ?? student.classLevel,
            " ",
            "· Adm: ",
            student.admNo
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Overall %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground text-lg", children: [
            report.combinedPercentage.toFixed(1),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-lg", children: report.combinedGrade })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: sessionId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: report.overallPassed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", children: "PASS" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18, className: "text-red-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "FAIL" })
        ] }) })
      ] })
    ] }),
    (loadingStudents || studentId && loadingReport) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
    ] }),
    !studentId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "academic.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChartNoAxesColumn,
            {
              size: 32,
              className: "mx-auto text-muted-foreground/40 mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Search and select a student to view their academic performance report." })
        ]
      }
    ),
    studentId && !loadingReport && !report && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "academic.no_report_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "No academic performance data found for session ",
          sessionId,
          "."
        ] })
      }
    ),
    studentId && !loadingReport && report && report.examSummaries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "academic.no_exams_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No exams found in the report. Enter marks first via the Marks Entry tab." })
      }
    ),
    report && report.examSummaries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card overflow-hidden print:border-black",
        "data-ocid": "academic.report.table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground font-display", children: [
              "Academic Performance — Session ",
              sessionId
            ] }),
            student && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              student.fullName,
              " ·",
              " ",
              CLASS_LABELS[student.classLevel] ?? student.classLevel,
              " ",
              "· Adm: ",
              student.admNo
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              className: "w-full text-sm border-collapse",
              style: {
                minWidth: `${report.examSummaries.length * 120 + 180}px`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 border-b border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground sticky left-0 bg-muted/30 z-10", children: "Subject" }),
                  report.examSummaries.map((exam) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[110px]",
                      children: exam.examName
                    },
                    exam.examConfigId
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[100px]", children: "Final" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allSubjects.map((subjectName, si) => {
                  const allMarks = report.examSummaries.map((exam) => {
                    const sm = exam.subjectMarks.find(
                      (s) => s.subjectName === subjectName
                    );
                    return sm ?? null;
                  });
                  const validMarks = allMarks.filter(Boolean);
                  const finalObtained = validMarks.reduce(
                    (sum, sm) => sum + ((sm == null ? void 0 : sm.marksObtained) ?? 0),
                    0
                  );
                  const finalMax = validMarks.reduce(
                    (sum, sm) => sum + ((sm == null ? void 0 : sm.maxMarks) ?? 0),
                    0
                  );
                  const { grade: finalGrade } = calcGrade(
                    finalObtained,
                    finalMax
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: `border-b border-border last:border-0 ${si % 2 === 0 ? "bg-background" : "bg-muted/10"}`,
                      "data-ocid": `academic.subject.${si + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground sticky left-0 bg-inherit z-[5]", children: subjectName }),
                        allMarks.map((sm, ei) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: exam columns are ordered and stable
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2", children: sm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                              sm.marksObtained,
                              "/",
                              sm.maxMarks
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              GradeCell$1,
                              {
                                grade: sm.grade || calcGrade(sm.marksObtained, sm.maxMarks).grade
                              }
                            )
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }, ei)
                        )),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                            finalObtained,
                            "/",
                            finalMax
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell$1, { grade: finalGrade })
                        ] }) })
                      ]
                    },
                    subjectName
                  );
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/20 border-t-2 border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-bold text-foreground sticky left-0 bg-muted/20 z-[5]", children: "Overall" }),
                  report.examSummaries.map((exam) => {
                    const { grade } = calcGrade(
                      exam.subjectMarks.reduce(
                        (s, m) => s + m.marksObtained,
                        0
                      ),
                      exam.subjectMarks.reduce((s, m) => s + m.maxMarks, 0)
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "text-center px-3 py-2.5",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-sm text-foreground", children: [
                            exam.percentage.toFixed(1),
                            "%"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell$1, { grade: exam.overallGrade || grade })
                        ] })
                      },
                      exam.examConfigId
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                      report.combinedPercentage.toFixed(1),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell$1, { grade: report.combinedGrade }),
                    report.overallPassed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "text-xs", children: "PASS" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "FAIL" })
                  ] }) })
                ] }) })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
const EXAM_PRESETS = [
  "Quarterly",
  "Half Yearly",
  "Annual",
  "Unit Test",
  "Pre-Board"
];
function blankSubject() {
  return {
    id: generateId(),
    subjectId: generateId(),
    subjectName: "",
    maxMarks: 100,
    passingMarks: 33
  };
}
function blankDraft(classId = "Class10") {
  return {
    id: generateId(),
    examName: "",
    classId,
    subjects: [blankSubject()],
    includeInCombined: true,
    weightage: 100
  };
}
function ExamConfigTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const { data: configs = [], isLoading } = useGetAllExamConfigs(sessionId);
  const saveMutation = useSaveExamConfig();
  const deleteMutation = useDeleteExamConfig();
  const [draft, setDraft] = reactExports.useState(null);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  function openNew() {
    setDraft(blankDraft("Class10"));
  }
  function addSubject() {
    if (!draft) return;
    setDraft(
      (d) => d ? { ...d, subjects: [...d.subjects, blankSubject()] } : d
    );
  }
  function removeSubject(id) {
    if (!draft) return;
    setDraft(
      (d) => d ? { ...d, subjects: d.subjects.filter((s) => s.id !== id) } : d
    );
  }
  function updateSubject(id, field, value) {
    if (!draft) return;
    setDraft(
      (d) => d ? {
        ...d,
        subjects: d.subjects.map(
          (s) => s.id === id ? { ...s, [field]: value } : s
        )
      } : d
    );
  }
  async function handleSave() {
    if (!draft) return;
    if (!draft.examName.trim()) {
      ue.error("Enter an exam name.");
      return;
    }
    if (draft.subjects.length === 0) {
      ue.error("Add at least one subject.");
      return;
    }
    if (draft.subjects.some((s) => !s.subjectName.trim())) {
      ue.error("All subjects need a name.");
      return;
    }
    try {
      await saveMutation.mutateAsync({
        examName: draft.examName,
        sessionId,
        classId: draft.classId,
        subjectConfigs: draft.subjects.map((s) => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          maxMarks: s.maxMarks,
          passingMarks: s.passingMarks
        })),
        includeInCombined: draft.includeInCombined,
        weightage: draft.weightage
      });
      ue.success("Exam configuration saved!");
      setDraft(null);
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to save.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Exam Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Define exam names, classes, and subject marks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openNew, "data-ocid": "exam.config.add_button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
        " New Exam Config"
      ] })
    ] }),
    draft && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-primary/40 bg-card p-5 space-y-4",
        "data-ocid": "exam.config.form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm font-display", children: "New Exam Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-7",
                onClick: () => setDraft(null),
                "data-ocid": "exam.config.cancel_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Exam Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: draft.examName,
                    onChange: (e) => setDraft(
                      (d) => d ? { ...d, examName: e.target.value } : d
                    ),
                    placeholder: "e.g. Quarterly Exam",
                    "data-ocid": "exam.config.name.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    onValueChange: (v) => setDraft((d) => d ? { ...d, examName: v } : d),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "w-36 shrink-0",
                          "data-ocid": "exam.config.preset.select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Presets" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: EXAM_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Class ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: draft.classId,
                  onValueChange: (v) => setDraft((d) => d ? { ...d, classId: v } : d),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "exam.config.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Weightage (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 100,
                  value: draft.weightage,
                  onChange: (e) => setDraft(
                    (d) => d ? { ...d, weightage: Number(e.target.value) } : d
                  ),
                  "data-ocid": "exam.config.weightage.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-2 cursor-pointer text-sm text-foreground",
                "data-ocid": "exam.config.combined.checkbox",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: draft.includeInCombined,
                      onChange: (e) => setDraft(
                        (d) => d ? { ...d, includeInCombined: e.target.checked } : d
                      ),
                      className: "accent-primary"
                    }
                  ),
                  "Include in Academic Performance Report"
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Subjects & Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: addSubject,
                  "data-ocid": "exam.config.add_subject_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
                    " Add Subject"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium text-muted-foreground", children: "Subject Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground w-28", children: "Max Marks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground w-28", children: "Pass Marks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: draft.subjects.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border last:border-0",
                  "data-ocid": `exam.config.subject.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: s.subjectName,
                        onChange: (e) => updateSubject(s.id, "subjectName", e.target.value),
                        placeholder: "e.g. Mathematics",
                        className: "h-7 text-xs",
                        "data-ocid": `exam.config.subject.name.${i + 1}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: 1,
                        value: s.maxMarks,
                        onChange: (e) => updateSubject(
                          s.id,
                          "maxMarks",
                          Number(e.target.value)
                        ),
                        className: "h-7 text-xs text-center",
                        "data-ocid": `exam.config.subject.maxmarks.${i + 1}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        min: 0,
                        value: s.passingMarks,
                        onChange: (e) => updateSubject(
                          s.id,
                          "passingMarks",
                          Number(e.target.value)
                        ),
                        className: "h-7 text-xs text-center",
                        "data-ocid": `exam.config.subject.passmarks.${i + 1}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-6 text-destructive hover:text-destructive",
                        onClick: () => removeSubject(s.id),
                        "data-ocid": `exam.config.subject.delete.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
                      }
                    ) })
                  ]
                },
                s.id
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: saveMutation.isPending,
              "data-ocid": "exam.config.save_button",
              children: [
                saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14, className: "mr-1.5" }),
                "Save Configuration"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground font-display text-sm", children: "Saved Exam Configurations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: configs.length })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" })
      ] }) : configs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", "data-ocid": "exam.config.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookOpen,
          {
            size: 32,
            className: "mx-auto text-muted-foreground/40 mb-2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No exam configs yet. Create one above." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: configs.map((cfg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `exam.config.item.${i + 1}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full px-5 py-3 flex items-center justify-between gap-4 hover:bg-muted/10 cursor-pointer text-left",
            onClick: () => setExpandedId(expandedId === cfg.id ? null : cfg.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 15, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: cfg.examName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    CLASS_LABELS[cfg.classId] ?? cfg.classId,
                    " ",
                    "· ",
                    cfg.subjectConfigs.length,
                    " subjects · Session",
                    " ",
                    cfg.sessionId
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                cfg.includeInCombined && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Combined" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-7 text-destructive hover:text-destructive",
                    onClick: (e) => {
                      e.stopPropagation();
                      deleteMutation.mutateAsync(cfg.id).then(() => ue.success("Deleted.")).catch(() => ue.error("Delete failed."));
                    },
                    "data-ocid": `exam.config.delete.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                ),
                expandedId === cfg.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    size: 14,
                    className: "text-muted-foreground"
                  }
                )
              ] })
            ]
          }
        ),
        expandedId === cfg.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border border-border rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium text-muted-foreground", children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Max Marks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Pass Marks" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: cfg.subjectConfigs.map((sc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-t border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: sc.subjectName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-1.5", children: sc.maxMarks }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-1.5", children: sc.passingMarks })
              ]
            },
            sc.subjectId
          )) })
        ] }) })
      ] }, cfg.id)) })
    ] })
  ] });
}
function GradeCell({ grade }) {
  const colorMap = {
    A1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    A2: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    B1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    B2: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    C1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    C2: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    D: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    E: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`,
      children: grade
    }
  );
}
function ExamResultsTab() {
  const currentSession = useAppStore((s) => s.currentSession);
  const [sessionId, setSessionId] = reactExports.useState(currentSession);
  const [studentId, setStudentId] = reactExports.useState("");
  const [searchQ, setSearchQ] = reactExports.useState("");
  const { data: sessions = [] } = useSessions();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: results = [], isLoading: loadingResults } = useGetExamResultsByStudent(studentId, sessionId);
  const student = allStudents.find((s) => s.id === studentId);
  const filteredStudents = reactExports.useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return allStudents.slice(0, 50);
    return allStudents.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [allStudents, searchQ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Exam Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View student exam result cards" })
      ] }),
      results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => window.print(),
          "data-ocid": "results.print_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14, className: "mr-1.5" }),
            " Print"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sessionId, onValueChange: setSessionId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "results.session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              placeholder: "Search by name or admission no…",
              value: searchQ,
              onChange: (e) => setSearchQ(e.target.value),
              "data-ocid": "results.student_search.input"
            }
          ),
          searchQ && filteredStudents.length > 0 && !studentId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-md max-h-60 overflow-auto", children: filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between",
              onClick: () => {
                setStudentId(s.id);
                setSearchQ(s.fullName);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  s.admNo,
                  " ·",
                  " ",
                  CLASS_LABELS[s.classLevel] ?? s.classLevel
                ] })
              ]
            },
            s.id
          )) })
        ] })
      ] }),
      studentId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => {
            setStudentId("");
            setSearchQ("");
          },
          "data-ocid": "results.clear_button",
          children: "Clear"
        }
      ) })
    ] }),
    student && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden", children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: student.photoUrl,
          alt: student.fullName,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 20, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: student.fullName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          CLASS_LABELS[student.classLevel] ?? student.classLevel,
          " ",
          "· Adm: ",
          student.admNo,
          " · Session: ",
          sessionId
        ] })
      ] })
    ] }),
    (loadingStudents || studentId && loadingResults) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
    ] }),
    !studentId && !searchQ && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "results.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 32, className: "mx-auto text-muted-foreground/40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Search and select a student to view their results." })
        ]
      }
    ),
    studentId && !loadingResults && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "results.no_results_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "No exam results found for this student in session ",
          sessionId,
          "."
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 print:space-y-6", children: results.map((result, ri) => {
      const isPassed = result.overallPassed;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card overflow-hidden print:border-black",
          "data-ocid": `results.card.${ri + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `px-5 py-3 flex items-center justify-between border-b border-border ${isPassed ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-red-50 dark:bg-red-900/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground text-sm", children: result.examName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Session: ",
                      result.sessionId
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Percentage" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground", children: [
                        result.percentage.toFixed(1),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell, { grade: result.overallGrade }),
                    isPassed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18, className: "text-red-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: isPassed ? "default" : "destructive",
                        className: "text-xs",
                        children: isPassed ? "PASS" : "FAIL"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 font-medium text-muted-foreground", children: "Subject" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Max Marks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Pass Marks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Marks Obtained" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: result.subjectMarks.map((sm, smi) => {
                const { grade } = calcGrade(
                  sm.marksObtained,
                  sm.maxMarks
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border last:border-0",
                    "data-ocid": `results.card.${ri + 1}.subject.${smi + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: sm.subjectName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5 text-muted-foreground", children: sm.maxMarks }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5 text-muted-foreground", children: sm.passingMarks }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5 font-semibold text-foreground", children: sm.marksObtained }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell, { grade: sm.grade || grade }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2.5", children: sm.isPassed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-semibold text-xs", children: "Pass" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-semibold text-xs", children: "Fail" }) })
                    ]
                  },
                  `${result.id}-${smi}`
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/20 border-t-2 border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-4 py-2 font-bold text-foreground",
                    colSpan: 3,
                    children: "Total"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "text-center px-3 py-2 font-bold text-foreground", children: [
                  result.totalObtained,
                  "/",
                  result.totalMax
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GradeCell, { grade: result.overallGrade }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: isPassed ? "default" : "destructive",
                    className: "text-xs",
                    children: isPassed ? "PASS" : "FAIL"
                  }
                ) })
              ] }) })
            ] }) }),
            result.remarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t border-border text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Remarks:" }),
              " ",
              result.remarks
            ] })
          ]
        },
        result.id
      );
    }) })
  ] });
}
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const SUBJECT_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
];
function getSubjectColor(subject) {
  const hash = subject.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
}
function getDatesInRange(start, end) {
  const result = [];
  const cur = new Date(start);
  const endDate = new Date(end);
  while (cur <= endDate) {
    const dayIdx = cur.getDay();
    if (dayIdx !== 0) {
      result.push({
        date: cur.toISOString().slice(0, 10),
        day: DAYS[dayIdx]
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}
function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function buildSmartGrid(classes, classSubjects, dates) {
  const grid = {};
  const dateSubjectUsed = {};
  for (let i = 0; i < dates.length; i++) {
    dateSubjectUsed[i] = /* @__PURE__ */ new Set();
  }
  for (const cls of classes) {
    const subjects = [...classSubjects[cls] ?? []];
    if (subjects.length === 0) {
      grid[cls] = dates.map(() => "—");
      continue;
    }
    const assigned = new Array(dates.length).fill("");
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
function SmartTimetableTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const [view, setView] = reactExports.useState("form");
  const { data: allSubjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: savedTimetables = [], isLoading: loadingList } = useGetSmartExamTimetables(sessionId);
  const createMutation = useCreateSmartExamTimetable();
  const updateMutation = useUpdateSmartExamTimetable();
  const deleteMutation = useDeleteSmartExamTimetable();
  const generateMutation = useGenerateSmartExamSchedule();
  const [examName, setExamName] = reactExports.useState("");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState("");
  const [startTime, setStartTime] = reactExports.useState("09:00");
  const [endTime, setEndTime] = reactExports.useState("12:00");
  const [participatingClasses, setParticipatingClasses] = reactExports.useState([]);
  const [classSubjects, setClassSubjects] = reactExports.useState({});
  const [newSubjectInputs, setNewSubjectInputs] = reactExports.useState({});
  const [dates, setDates] = reactExports.useState([]);
  const [grid, setGrid] = reactExports.useState({});
  const dragInfo = reactExports.useRef(null);
  const [dragOver, setDragOver] = reactExports.useState(null);
  const [editingId, setEditingId] = reactExports.useState("");
  function getSubjectsForClass(cls) {
    return allSubjects.filter((s) => s.classLevel === cls).map((s) => s.name);
  }
  function toggleClass(cls) {
    setParticipatingClasses((prev) => {
      if (prev.includes(cls)) return prev.filter((c) => c !== cls);
      if (!classSubjects[cls]) {
        const realSubjects = getSubjectsForClass(cls);
        setClassSubjects((cs) => ({
          ...cs,
          [cls]: { subjects: realSubjects }
        }));
      }
      return [...prev, cls];
    });
  }
  function addSubject(cls) {
    const val = (newSubjectInputs[cls] ?? "").trim();
    if (!val) return;
    setClassSubjects((cs) => {
      var _a;
      return {
        ...cs,
        [cls]: { subjects: [...((_a = cs[cls]) == null ? void 0 : _a.subjects) ?? [], val] }
      };
    });
    setNewSubjectInputs((ni) => ({ ...ni, [cls]: "" }));
  }
  function removeSubject(cls, idx) {
    setClassSubjects((cs) => ({
      ...cs,
      [cls]: { subjects: cs[cls].subjects.filter((_, i) => i !== idx) }
    }));
  }
  async function generateTimetable() {
    var _a, _b;
    if (!examName || !startDate || !endDate || participatingClasses.length === 0) {
      ue.error(
        "Please fill all required fields and select at least one class."
      );
      return;
    }
    const d = getDatesInRange(startDate, endDate);
    if (d.length === 0) {
      ue.error("No valid exam dates in the selected range.");
      return;
    }
    setDates(d);
    const subjectsPerClass = {};
    for (const cls of participatingClasses) {
      subjectsPerClass[cls] = ((_a = classSubjects[cls]) == null ? void 0 : _a.subjects) ?? [];
    }
    let newGrid = null;
    try {
      const backendEntries = await generateMutation.mutateAsync({
        examName,
        examStartDate: startDate,
        examEndDate: endDate,
        startTime,
        endTime,
        participatingClasses,
        subjectsPerClass,
        sessionId
      });
      if (backendEntries && backendEntries.length > 0) {
        const g = {};
        for (const cls of participatingClasses) {
          const entriesForCls = backendEntries.filter((e) => e.classLevel === cls).sort((a, b) => a.position - b.position);
          if (entriesForCls.length > 0) {
            g[cls] = entriesForCls.map((e) => e.subjectName);
          }
        }
        if (Object.keys(g).length > 0) {
          newGrid = g;
        }
      }
    } catch {
    }
    if (!newGrid) {
      const subjectsOnly = {};
      for (const cls of participatingClasses) {
        subjectsOnly[cls] = ((_b = classSubjects[cls]) == null ? void 0 : _b.subjects) ?? [];
      }
      newGrid = buildSmartGrid(participatingClasses, subjectsOnly, d);
    }
    setGrid(newGrid);
    setView("generated");
  }
  function regenerateTimetable() {
    var _a;
    if (dates.length === 0) {
      void generateTimetable();
      return;
    }
    const subjectsOnly = {};
    for (const cls of participatingClasses) {
      subjectsOnly[cls] = ((_a = classSubjects[cls]) == null ? void 0 : _a.subjects) ?? [];
    }
    const newGrid = buildSmartGrid(participatingClasses, subjectsOnly, dates);
    setGrid(newGrid);
    ue.success("Timetable regenerated with new arrangement!");
  }
  const handleDragStart = reactExports.useCallback((cls, idx) => {
    dragInfo.current = { cls, fromIdx: idx };
  }, []);
  const handleDragOver = reactExports.useCallback(
    (e, cls, toIdx) => {
      e.preventDefault();
      setDragOver({ cls, toIdx });
    },
    []
  );
  const handleDrop = reactExports.useCallback((cls, toIdx) => {
    const info = dragInfo.current;
    if (!info || info.cls !== cls || info.fromIdx === toIdx) {
      setDragOver(null);
      dragInfo.current = null;
      return;
    }
    setGrid((g) => {
      const col = [...g[cls] ?? []];
      const [moved] = col.splice(info.fromIdx, 1);
      col.splice(toIdx, 0, moved);
      return { ...g, [cls]: col };
    });
    setDragOver(null);
    dragInfo.current = null;
  }, []);
  const handleDragEnd = reactExports.useCallback(() => {
    setDragOver(null);
    dragInfo.current = null;
  }, []);
  function buildEntries() {
    const entries = [];
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
          isLocked: false
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
      status: "Saved"
    };
    if (editingId) {
      await updateMutation.mutateAsync({ ...payload, id: editingId });
      ue.success("Timetable updated successfully!");
    } else {
      const saved = await createMutation.mutateAsync(payload);
      setEditingId(saved.id);
      ue.success("Timetable saved successfully!");
    }
  }
  async function deleteTimetable(id) {
    await deleteMutation.mutateAsync(id);
    if (editingId === id) resetForm();
    ue.success("Timetable deleted.");
  }
  function exportTimetable(tt) {
    const dateSet = [];
    const dateDay = {};
    const dataMap = {};
    for (const entry of tt.entries) {
      if (!dateSet.includes(entry.date)) dateSet.push(entry.date);
      dateDay[entry.date] = entry.day;
      if (!dataMap[entry.date])
        dataMap[entry.date] = {};
      dataMap[entry.date][entry.classLevel] = entry.subjectName;
    }
    dateSet.sort();
    const rows = dateSet.map((d) => {
      var _a;
      const row = {
        Date: formatDateShort(d),
        Day: dateDay[d] ?? ""
      };
      for (const cls of tt.participatingClasses) {
        row[CLASS_LABELS[cls]] = ((_a = dataMap[d]) == null ? void 0 : _a[cls]) ?? "";
      }
      return row;
    });
    downloadCSV(rows, `exam-timetable-${tt.examName.replace(/\s+/g, "-")}.csv`);
    ue.success("Timetable exported as CSV!");
  }
  function exportCurrentGrid() {
    const entries = buildEntries();
    exportTimetable({
      examName,
      participatingClasses,
      entries
    });
  }
  function resetForm() {
    setExamName("");
    setStartDate("");
    setEndDate("");
    setStartTime("09:00");
    setEndTime("12:00");
    setParticipatingClasses([]);
    setClassSubjects({});
    setDates([]);
    setGrid({});
    setEditingId("");
    setView("form");
  }
  function loadTimetableForEdit(tt) {
    setExamName(tt.examName);
    setStartDate(tt.startDate);
    setEndDate(tt.endDate);
    setStartTime(tt.startTime);
    setEndTime(tt.endTime);
    setParticipatingClasses(tt.participatingClasses);
    const cs = {};
    for (const cls of tt.participatingClasses) {
      const subjects = [
        ...new Set(
          tt.entries.filter((e) => e.classLevel === cls).map((e) => e.subjectName)
        )
      ];
      cs[cls] = { subjects };
    }
    setClassSubjects(cs);
    const dMap = {};
    for (const e of tt.entries) dMap[e.date] = e.day;
    const sortedDates = Object.keys(dMap).sort();
    const d = sortedDates.map((date) => ({ date, day: dMap[date] }));
    setDates(d);
    const g = {};
    for (const cls of tt.participatingClasses) {
      const entriesForCls = tt.entries.filter((e) => e.classLevel === cls).sort((a, b) => a.position - b.position);
      g[cls] = entriesForCls.map((e) => e.subjectName);
    }
    setGrid(g);
    setEditingId(tt.id);
    setView("generated");
  }
  const isGenerating = generateMutation.isPending;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  if (view === "form") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Create Exam Timetable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure exam details — AI will generate a conflict-free schedule" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: resetForm,
            "data-ocid": "smart.timetable.reset_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1.5" }),
              " Reset"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 15, className: "text-primary" }),
          " Exam Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Exam Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: examName,
                onChange: (e) => setExamName(e.target.value),
                placeholder: "e.g. Annual Exam 2025-26",
                "data-ocid": "smart.timetable.name.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DateInput,
            {
              label: "Start Date",
              required: true,
              value: startDate,
              onChange: setStartDate,
              "data-ocid": "smart.timetable.start_date.input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DateInput,
            {
              label: "End Date",
              required: true,
              value: endDate,
              onChange: setEndDate,
              "data-ocid": "smart.timetable.end_date.input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Exam Start Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: startTime,
                onChange: (e) => setStartTime(e.target.value),
                "data-ocid": "smart.timetable.start_time.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Exam End Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: endTime,
                onChange: (e) => setEndTime(e.target.value),
                "data-ocid": "smart.timetable.end_time.input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 15, className: "text-primary" }),
          " Participating Classes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-3 sm:grid-cols-5 gap-3",
            "data-ocid": "smart.timetable.classes.list",
            children: CLASS_ORDER.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleClass(cls),
                className: `flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-left ${participatingClasses.includes(cls) ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-muted/30 text-foreground"}`,
                "data-ocid": `smart.timetable.class.${cls}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      id: `cls-${cls}`,
                      checked: participatingClasses.includes(cls),
                      onCheckedChange: () => toggleClass(cls),
                      className: "shrink-0 pointer-events-none",
                      "aria-label": CLASS_LABELS[cls]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate", children: CLASS_LABELS[cls] })
                ]
              },
              cls
            ))
          }
        ),
        participatingClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          participatingClasses.length,
          " class",
          participatingClasses.length > 1 ? "es" : "",
          " selected"
        ] })
      ] }),
      participatingClasses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15, className: "text-primary" }),
            " Subjects Per Class",
            loadingSubjects && /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoaderCircle,
              {
                size: 13,
                className: "animate-spin text-muted-foreground"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Pre-filled from real subject assignments — add or remove as needed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: participatingClasses.map((cls) => {
          var _a;
          const subjects = ((_a = classSubjects[cls]) == null ? void 0 : _a.subjects) ?? [];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-2 rounded-lg border border-border p-3 bg-muted/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xs text-primary uppercase tracking-wide", children: CLASS_LABELS[cls] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 min-h-8", children: [
                  subjects.map((subj, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(subj)}`,
                      children: [
                        subj,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => removeSubject(cls, i),
                            className: "ml-0.5 opacity-60 hover:opacity-100",
                            "aria-label": `Remove ${subj}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                          }
                        )
                      ]
                    },
                    `${cls}-subj-${subj}`
                  )),
                  subjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "No subjects — add below" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: newSubjectInputs[cls] ?? "",
                      onChange: (e) => setNewSubjectInputs((ni) => ({
                        ...ni,
                        [cls]: e.target.value
                      })),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") addSubject(cls);
                      },
                      placeholder: "Add subject…",
                      className: "h-7 text-xs",
                      "data-ocid": `smart.timetable.subject.input.${cls}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 px-2",
                      onClick: () => addSubject(cls),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
                    }
                  )
                ] })
              ]
            },
            cls
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-start gap-3 text-xs text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Smart Scheduling:" }),
          " Subjects will be automatically spread across exam dates (Mon–Sat), with teacher-level conflict detection — ensuring no two classes share the same teacher on the same day. You can drag subjects to rearrange after generation."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "w-full font-semibold",
          onClick: generateTimetable,
          disabled: !examName || !startDate || !endDate || participatingClasses.length === 0 || isGenerating,
          "data-ocid": "smart.timetable.generate_button",
          children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, className: "mr-2 animate-spin" }),
            " Generating…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, className: "mr-2" }),
            " Generate Smart Timetable"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground font-display", children: "Saved Exam Timetables" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: savedTimetables.length })
        ] }),
        loadingList ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] }) : savedTimetables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-center text-sm text-muted-foreground py-8",
            "data-ocid": "smart.timetable.saved.empty_state",
            children: "No saved timetables yet. Generate one above."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: savedTimetables.map((tt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-5 py-3 flex items-center justify-between gap-4 hover:bg-muted/10",
            "data-ocid": `smart.timetable.saved.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: tt.examName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  formatDateShort(tt.startDate),
                  " –",
                  " ",
                  formatDateShort(tt.endDate),
                  " ·",
                  " ",
                  tt.participatingClasses.length,
                  " classes"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: tt.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => loadTimetableForEdit(tt),
                    "data-ocid": `smart.timetable.edit_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12, className: "mr-1" }),
                      " View/Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => exportTimetable(tt),
                    "data-ocid": `smart.timetable.export_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12, className: "mr-1" }),
                      " Export"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "text-destructive hover:text-destructive",
                    onClick: () => deleteTimetable(tt.id),
                    disabled: deleteMutation.isPending,
                    "data-ocid": `smart.timetable.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                  }
                )
              ] })
            ]
          },
          tt.id
        )) })
      ] })
    ] });
  }
  const sortedClasses = participatingClasses.filter((c) => grid[c]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: examName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          formatDateShort(startDate),
          " – ",
          formatDateShort(endDate),
          " ·",
          " ",
          startTime,
          "–",
          endTime,
          " · ",
          dates.length,
          " exam days ·",
          " ",
          sortedClasses.length,
          " classes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setView("form"),
            "data-ocid": "smart.timetable.back_button",
            children: "← Back to Form"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: regenerateTimetable,
            disabled: isGenerating,
            "data-ocid": "smart.timetable.regenerate_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  size: 13,
                  className: `mr-1.5 ${isGenerating ? "animate-spin" : ""}`
                }
              ),
              " ",
              "Regenerate"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: exportCurrentGrid,
            "data-ocid": "smart.timetable.export_current_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13, className: "mr-1.5" }),
              " Export CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: saveTimetable,
            disabled: isSaving,
            "data-ocid": "smart.timetable.save_button",
            children: [
              isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: "mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13, className: "mr-1.5" }),
              editingId ? "Update Timetable" : "Save Timetable"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-4 py-2 text-xs text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 13 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Drag subject cells up/down within each class column to rearrange. Date and Day columns are locked. Click ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Save" }),
        " to persist changes."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse min-w-[600px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap sticky left-0 bg-muted/40 z-[5]", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap", children: "Day" }),
        sortedClasses.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[130px]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded-md bg-primary/10 text-primary text-xs", children: CLASS_LABELS[cls] })
          },
          cls
        ))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: dates.map((d, rowIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: `border-b border-border last:border-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-muted/10"}`,
          "data-ocid": `smart.timetable.row.${rowIdx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs font-mono whitespace-nowrap sticky left-0 bg-muted/20 border-r border-border z-[5]", children: formatDateShort(d.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap bg-muted/10", children: d.day }),
            sortedClasses.map((cls) => {
              var _a;
              const subject = ((_a = grid[cls]) == null ? void 0 : _a[rowIdx]) ?? "—";
              const isDraggingOver = (dragOver == null ? void 0 : dragOver.cls) === cls && (dragOver == null ? void 0 : dragOver.toIdx) === rowIdx;
              const colorClass = subject !== "—" ? getSubjectColor(subject) : "text-muted-foreground";
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: `px-3 py-2 text-center transition-colors ${isDraggingOver ? "bg-primary/10" : ""}`,
                  onDragOver: (e) => handleDragOver(e, cls, rowIdx),
                  onDrop: () => handleDrop(cls, rowIdx),
                  "data-ocid": `smart.timetable.cell.${cls}.${rowIdx + 1}`,
                  children: subject !== "—" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      draggable: true,
                      onDragStart: () => handleDragStart(cls, rowIdx),
                      onDragEnd: handleDragEnd,
                      className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-grab active:cursor-grabbing select-none ${colorClass} border border-current/20 hover:shadow-sm transition-all`,
                      title: "Drag to reorder",
                      "data-ocid": `smart.timetable.subject.${cls}.${rowIdx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          GripVertical,
                          {
                            size: 10,
                            className: "opacity-50 shrink-0"
                          }
                        ),
                        subject
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" })
                },
                cls
              );
            })
          ]
        },
        d.date
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground font-display text-sm", children: "Saved Timetables" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: resetForm,
            "data-ocid": "smart.timetable.new_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
              " New Timetable"
            ]
          }
        )
      ] }),
      loadingList ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }) }) : savedTimetables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-center text-sm text-muted-foreground py-6",
          "data-ocid": "smart.timetable.list.empty_state",
          children: "No other saved timetables."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: savedTimetables.map((tt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `px-5 py-3 flex items-center justify-between gap-4 ${tt.id === editingId ? "bg-primary/5" : "hover:bg-muted/10"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-sm text-foreground flex items-center gap-2", children: [
                tt.examName,
                tt.id === editingId && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "text-xs", children: "Editing" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                formatDateShort(tt.startDate),
                " –",
                " ",
                formatDateShort(tt.endDate),
                " ·",
                " ",
                tt.participatingClasses.length,
                " classes"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => loadTimetableForEdit(tt),
                  "data-ocid": `smart.timetable.list.edit.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12, className: "mr-1" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => exportTimetable(tt),
                  "data-ocid": `smart.timetable.list.export.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12, className: "mr-1" }),
                    " Export"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "text-destructive hover:text-destructive",
                  onClick: () => deleteTimetable(tt.id),
                  disabled: deleteMutation.isPending,
                  "data-ocid": `smart.timetable.list.delete.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                }
              )
            ] })
          ]
        },
        tt.id
      )) })
    ] })
  ] });
}
function getGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}
function generateQAFromText(text) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);
  if (sentences.length === 0) return [];
  const pairs = [];
  for (const sent of sentences) {
    if (pairs.length >= 4) break;
    const defMatch = sent.match(
      /^([A-Z][^,]+?)\s+(?:is|are|refers to|means|defines?)\s+(.+)$/i
    );
    if (defMatch) {
      const subject = defMatch[1].trim();
      const definition = defMatch[2].trim();
      pairs.push({
        id: generateId(),
        question: `What is ${subject}?`,
        answer: `${subject} is ${definition}.`
      });
    }
  }
  for (const sent of sentences) {
    if (pairs.length >= 7) break;
    const factMatch = sent.match(
      /(?:The|A|An)\s+([a-z]+(?:\s+[a-z]+)?)\s+of\s+([^,]+?)\s+is\s+([^,]+)/i
    );
    if (factMatch) {
      const prop = factMatch[1];
      const entity = factMatch[2];
      const value = factMatch[3];
      pairs.push({
        id: generateId(),
        question: `What is the ${prop} of ${entity}?`,
        answer: `The ${prop} of ${entity} is ${value}.`
      });
    }
  }
  const verbs = [
    "Describe",
    "Explain",
    "Define",
    "Write about",
    "State",
    "Mention"
  ];
  const usedSentences = /* @__PURE__ */ new Set();
  for (const sent of sentences.slice(0, 12)) {
    if (pairs.length >= 10) break;
    if (usedSentences.has(sent)) continue;
    const words = sent.split(" ");
    const topic = words.slice(0, 4).join(" ");
    const verb = verbs[pairs.length % verbs.length];
    pairs.push({
      id: generateId(),
      question: `${verb}: "${topic}…"`,
      answer: `${sent}.`
    });
    usedSentences.add(sent);
  }
  return pairs.slice(0, 10);
}
function SyllabusQATab() {
  const [chapterTitle, setChapterTitle] = reactExports.useState("");
  const [contentText, setContentText] = reactExports.useState("");
  const [generatedQA, setGeneratedQA] = reactExports.useState([]);
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [approvalStatus, setApprovalStatus] = reactExports.useState("draft");
  function handleGenerate() {
    if (!contentText.trim()) {
      ue.error("Please enter chapter content first.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const qa = generateQAFromText(contentText);
      setGeneratedQA(qa);
      setIsGenerating(false);
      ue.success(`${qa.length} Q&A pairs generated from chapter content!`);
    }, 800);
  }
  function updateQA(id, field, value) {
    setGeneratedQA(
      (prev) => prev.map((q) => q.id === id ? { ...q, [field]: value } : q)
    );
  }
  function removeQA(id) {
    setGeneratedQA((prev) => prev.filter((q) => q.id !== id));
  }
  function addManualQA() {
    setGeneratedQA((prev) => [
      ...prev,
      { id: generateId(), question: "", answer: "" }
    ]);
  }
  function submitForApproval() {
    if (!chapterTitle.trim()) {
      ue.error("Please enter a chapter title.");
      return;
    }
    if (generatedQA.length === 0) {
      ue.error("Generate or add at least one Q&A pair before submitting.");
      return;
    }
    setApprovalStatus("pending");
    ue.success(
      "Submitted for Principal approval. Students can view after approval."
    );
  }
  const statusBadge = {
    draft: { label: "Draft", variant: "secondary" },
    pending: { label: "Pending Approval", variant: "outline" },
    approved: { label: "Approved", variant: "default" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Syllabus Content & AI Q&A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload chapter content — AI generates Q&A for students" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: statusBadge[approvalStatus].variant, children: statusBadge[approvalStatus].label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 15, className: "text-primary" }),
        " Chapter Details"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chapter Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: chapterTitle,
              onChange: (e) => setChapterTitle(e.target.value),
              placeholder: "e.g. Chapter 3: Photosynthesis",
              "data-ocid": "syllabus.chapter_title.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chapter Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: contentText,
              onChange: (e) => setContentText(e.target.value),
              rows: 8,
              placeholder: "Paste or type the chapter content here. The AI will generate questions and answers based on this text…",
              className: "resize-none font-body text-sm",
              "data-ocid": "syllabus.content.textarea"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            contentText.length,
            " characters ·",
            " ",
            contentText.trim().split(/\s+/).filter(Boolean).length,
            " words"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleGenerate,
          disabled: isGenerating || !contentText.trim(),
          "data-ocid": "syllabus.generate_button",
          children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "mr-2 animate-spin" }),
            " Generating…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 15, className: "mr-2" }),
            " Generate Q&A with AI"
          ] })
        }
      )
    ] }),
    generatedQA.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground font-display text-sm", children: [
          "Generated Q&A (",
          generatedQA.length,
          " pairs)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: addManualQA,
            "data-ocid": "syllabus.add_qa_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
              " Add Manually"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: generatedQA.map((qa, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 space-y-3",
          "data-ocid": `syllabus.qa.item.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-2", children: editingId === qa.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Question" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: qa.question,
                    onChange: (e) => updateQA(qa.id, "question", e.target.value),
                    "data-ocid": `syllabus.qa.question.${i + 1}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Answer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: qa.answer,
                    onChange: (e) => updateQA(qa.id, "answer", e.target.value),
                    rows: 3,
                    "data-ocid": `syllabus.qa.answer.${i + 1}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setEditingId(null), children: "Done" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                "Q. ",
                qa.question
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary mr-1", children: "Ans:" }),
                qa.answer
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7",
                  onClick: () => setEditingId(editingId === qa.id ? null : qa.id),
                  "data-ocid": `syllabus.qa.edit_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7 text-destructive hover:text-destructive",
                  onClick: () => removeQA(qa.id),
                  "data-ocid": `syllabus.qa.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
                }
              )
            ] })
          ] })
        },
        qa.id
      )) })
    ] }),
    generatedQA.length > 0 && approvalStatus === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full",
        onClick: submitForApproval,
        "data-ocid": "syllabus.submit_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "mr-2" }),
          " Submit for Principal Approval"
        ]
      }
    ),
    approvalStatus === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-4 py-3 flex items-center gap-3 text-sm text-amber-800 dark:text-amber-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 15, className: "shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Awaiting Principal Approval." }),
        " Once approved, students can access this Q&A to verify their notebook answers."
      ] })
    ] })
  ] });
}
function OnlineExamsTab() {
  const [exams, setExams] = reactExports.useState([]);
  const [state, setState] = reactExports.useState({
    view: "list",
    selectedExam: null
  });
  const [examForm, setExamForm] = reactExports.useState({
    title: "",
    classLevel: "Class9",
    subject: "",
    duration: "30"
  });
  const [questions, setQuestions] = reactExports.useState([]);
  const [qForm, setQForm] = reactExports.useState({
    text: "",
    opts: ["", "", "", ""],
    correct: 0,
    marks: 2
  });
  const [addQOpen, setAddQOpen] = reactExports.useState(false);
  const [answers, setAnswers] = reactExports.useState([]);
  const [submitted, setSubmitted] = reactExports.useState(false);
  function startCreate() {
    setExamForm({
      title: "",
      classLevel: "Class9",
      subject: "",
      duration: "30"
    });
    setQuestions([]);
    setState({ view: "create", selectedExam: null });
  }
  function addQuestion() {
    if (!qForm.text) return;
    const q = {
      id: generateId(),
      questionText: qForm.text,
      options: qForm.opts,
      correctOption: qForm.correct,
      marks: qForm.marks
    };
    setQuestions((qs) => [...qs, q]);
    setQForm({ text: "", opts: ["", "", "", ""], correct: 0, marks: 2 });
    setAddQOpen(false);
  }
  function saveExam() {
    const exam = {
      id: generateId(),
      title: examForm.title,
      subjectId: generateId(),
      classLevel: examForm.classLevel,
      durationMinutes: Number(examForm.duration),
      questions,
      scheduledAt: (/* @__PURE__ */ new Date()).toISOString(),
      isActive: true,
      createdBy: "Admin"
    };
    setExams((e) => [...e, exam]);
    setState({ view: "list", selectedExam: null });
  }
  function takeExam(exam) {
    setAnswers(new Array(exam.questions.length).fill(-1));
    setSubmitted(false);
    setState({ view: "take", selectedExam: exam });
  }
  if (state.view === "take" && state.selectedExam) {
    const exam = state.selectedExam;
    const score = submitted ? exam.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctOption ? q.marks : 0),
      0
    ) : 0;
    const maxScore = exam.questions.reduce((acc, q) => acc + q.marks, 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: exam.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            exam.questions.length,
            " questions · ",
            exam.durationMinutes,
            " min"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          !submitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm bg-accent/10 text-accent border border-accent/30 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", children: [
              exam.durationMinutes,
              ":00"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setState({ view: "list", selectedExam: null }),
              "data-ocid": "exam.take.back_button",
              children: "Back"
            }
          )
        ] })
      ] }),
      submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 text-center space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 40, className: "mx-auto text-green-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "Exam Submitted!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "You scored" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-primary font-display", children: [
          score,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl text-muted-foreground", children: [
            "/",
            maxScore
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold", children: [
          (score / maxScore * 100).toFixed(1),
          "% · Grade",
          " ",
          getGrade(score / maxScore * 100)
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        exam.questions.map((q, qi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-card p-4 space-y-3",
            "data-ocid": `exam.take.question.${qi + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                "Q",
                qi + 1,
                ". ",
                q.questionText,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "(",
                  q.marks,
                  " marks)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: q.options.map((opt, oi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setAnswers((a) => {
                    const n = [...a];
                    n[qi] = oi;
                    return n;
                  }),
                  className: `flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${answers[qi] === oi ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:bg-muted/30"}`,
                  "data-ocid": `exam.take.option.${qi + 1}.${oi + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Circle,
                      {
                        size: 14,
                        className: answers[qi] === oi ? "fill-primary text-primary" : "text-muted-foreground"
                      }
                    ),
                    opt
                  ]
                },
                `${q.id}-opt-${oi}`
              )) })
            ]
          },
          q.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full",
            onClick: () => setSubmitted(true),
            "data-ocid": "exam.take.submit_button",
            children: "Submit Exam"
          }
        )
      ] })
    ] });
  }
  if (state.view === "create") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Create Online Exam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setState({ view: "list", selectedExam: null }),
            "data-ocid": "exam.create.back_button",
            children: "Cancel"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Exam Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: examForm.title,
              onChange: (e) => setExamForm((f) => ({ ...f, title: e.target.value })),
              placeholder: "e.g. Math Quiz - Chapter 3",
              "data-ocid": "exam.create.title.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: examForm.classLevel,
              onValueChange: (v) => setExamForm((f) => ({ ...f, classLevel: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "exam.create.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: examForm.subject,
              onChange: (e) => setExamForm((f) => ({ ...f, subject: e.target.value })),
              placeholder: "e.g. Mathematics",
              "data-ocid": "exam.create.subject.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration (minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: examForm.duration,
              onChange: (e) => setExamForm((f) => ({ ...f, duration: e.target.value })),
              placeholder: "30",
              "data-ocid": "exam.create.duration.input"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
            questions.length,
            " Questions Added"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setAddQOpen(true),
              "data-ocid": "exam.create.add_question_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
                " Add MCQ"
              ]
            }
          )
        ] }),
        questions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-center text-sm text-muted-foreground py-8",
            "data-ocid": "exam.create.questions.empty_state",
            children: "No questions yet. Add MCQ questions above."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: questions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-5 py-3 flex items-start justify-between gap-4",
            "data-ocid": `exam.create.question.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "Q",
                  i + 1,
                  ". ",
                  q.questionText
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 mt-1", children: q.options.map((o, oi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-2 py-0.5 rounded ${oi === q.correctOption ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold" : "text-muted-foreground"}`,
                    children: o
                  },
                  `${q.id}-opt-display-${oi}`
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7 shrink-0 text-destructive hover:text-destructive",
                  onClick: () => setQuestions((qs) => qs.filter((x) => x.id !== q.id)),
                  "data-ocid": `exam.create.delete_question.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
                }
              )
            ]
          },
          q.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: saveExam,
          disabled: !examForm.title || questions.length === 0,
          "data-ocid": "exam.create.submit_button",
          children: "Save & Publish Exam"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addQOpen, onOpenChange: setAddQOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "z-[200]", "data-ocid": "exam.question.dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add MCQ Question" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: qForm.text,
                onChange: (e) => setQForm((f) => ({ ...f, text: e.target.value })),
                placeholder: "Enter question text",
                "data-ocid": "exam.question.text.textarea"
              }
            )
          ] }),
          ["A", "B", "C", "D"].map((label, oi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "radio",
                name: "correct",
                checked: qForm.correct === oi,
                onChange: () => setQForm((f) => ({ ...f, correct: oi })),
                className: "accent-primary",
                "data-ocid": `exam.question.correct.${oi + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: qForm.opts[oi],
                onChange: (e) => {
                  const opts = [...qForm.opts];
                  opts[oi] = e.target.value;
                  setQForm((f) => ({ ...f, opts }));
                },
                placeholder: `Option ${oi + 1}`,
                "data-ocid": `exam.question.option.${oi + 1}`
              }
            )
          ] }, label)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Marks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: qForm.marks,
                onChange: (e) => setQForm((f) => ({ ...f, marks: Number(e.target.value) })),
                placeholder: "2",
                "data-ocid": "exam.question.marks.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setAddQOpen(false),
              "data-ocid": "exam.question.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: addQuestion,
              "data-ocid": "exam.question.submit_button",
              children: "Add Question"
            }
          )
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        exams.length,
        " exams configured"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: startCreate,
          "data-ocid": "exam.online.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " Create Exam"
          ]
        }
      )
    ] }),
    exams.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-8 text-center",
        "data-ocid": "exam.online.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 36, className: "mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No online exams yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create your first exam using the button above." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: exams.map((exam, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-4 flex items-center justify-between",
        "data-ocid": `exam.online.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 18, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: exam.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                CLASS_LABELS[exam.classLevel],
                " · ",
                exam.questions.length,
                " ",
                "questions · ",
                exam.durationMinutes,
                " min"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: exam.isActive ? "default" : "secondary", children: exam.isActive ? "Active" : "Inactive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => takeExam(exam),
                "data-ocid": `exam.online.take.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 13, className: "mr-1" }),
                  " Take Exam"
                ]
              }
            )
          ] })
        ]
      },
      exam.id
    )) })
  ] });
}
function PaperMakerTab() {
  const [paper, setPaper] = reactExports.useState({
    schoolName: "Shubh Public School",
    subject: "Mathematics",
    classLevel: "Class10",
    date: "",
    duration: "3 Hours",
    maxMarks: "100",
    instructions: "All questions are compulsory. Write clearly."
  });
  const [sections, setSections] = reactExports.useState([
    {
      id: "sec1",
      title: "Section A – MCQ",
      type: "MCQ",
      questions: [
        "Which of the following is a prime number?",
        "Solve: x² − 5x + 6 = 0"
      ],
      marks: 20
    },
    {
      id: "sec2",
      title: "Section B – Short Answer",
      type: "ShortAnswer",
      questions: [
        "Find the HCF and LCM of 24 and 36.",
        "Prove that √2 is irrational."
      ],
      marks: 30
    },
    {
      id: "sec3",
      title: "Section C – Long Answer",
      type: "LongAnswer",
      questions: [
        "A train travels 360 km in 4 hours. Find its speed in m/s.",
        "Construct a triangle ABC with AB = 5 cm, BC = 7 cm, CA = 6 cm."
      ],
      marks: 50
    }
  ]);
  const [addSecOpen, setAddSecOpen] = reactExports.useState(false);
  const [secForm, setSecForm] = reactExports.useState({
    title: "",
    type: "ShortAnswer",
    marks: "10"
  });
  const [preview, setPreview] = reactExports.useState(false);
  function addSection() {
    setSections((s) => [
      ...s,
      {
        id: generateId(),
        title: secForm.title,
        type: secForm.type,
        questions: [],
        marks: Number(secForm.marks)
      }
    ]);
    setAddSecOpen(false);
    setSecForm({ title: "", type: "ShortAnswer", marks: "10" });
  }
  function addQuestion(secId, q) {
    setSections(
      (ss) => ss.map(
        (s) => s.id === secId ? { ...s, questions: [...s.questions, q] } : s
      )
    );
  }
  function removeQuestion(secId, qi) {
    setSections(
      (ss) => ss.map(
        (s) => s.id === secId ? { ...s, questions: s.questions.filter((_, i) => i !== qi) } : s
      )
    );
  }
  if (preview) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Print Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setPreview(false),
              "data-ocid": "exam.paper.back_button",
              children: "Back to Editor"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => window.print(),
              "data-ocid": "exam.paper.print_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14, className: "mr-1.5" }),
                " Print"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-background text-foreground rounded-xl border border-border shadow-sm p-10 max-w-3xl mx-auto font-serif text-sm",
          "data-ocid": "exam.paper.preview",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center border-b-2 border-foreground pb-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold uppercase tracking-wide", children: paper.schoolName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold mt-1", children: "Examination Paper" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Subject:" }),
                " ",
                paper.subject
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Class:" }),
                " ",
                CLASS_LABELS[paper.classLevel]
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Date:" }),
                " ",
                paper.date ? formatDate(paper.date) : "________"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Time:" }),
                " ",
                paper.duration
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Max Marks:" }),
                " ",
                paper.maxMarks
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded p-2 text-xs mb-4 italic", children: paper.instructions }),
            sections.map((_sec, _si) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-sm border-b border-border pb-1 mb-2", children: [
                _sec.title,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "float-right", children: [
                  "[",
                  _sec.marks,
                  " Marks]"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 space-y-1.5", children: [
                _sec.questions.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs", children: q }, q)),
                _sec.questions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-muted-foreground", children: "No questions added." })
              ] })
            ] }, _sec.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mt-6 pt-2 text-xs text-center text-muted-foreground", children: "— End of Paper —" })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Examination Paper Maker" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setPreview(true),
          "data-ocid": "exam.paper.preview_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 14, className: "mr-1.5" }),
            " Preview & Print"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm font-display", children: "Paper Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "School Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: paper.schoolName,
              onChange: (e) => setPaper((p) => ({ ...p, schoolName: e.target.value })),
              "data-ocid": "exam.paper.school.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: paper.subject,
              onChange: (e) => setPaper((p) => ({ ...p, subject: e.target.value })),
              "data-ocid": "exam.paper.subject.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: paper.classLevel,
              onValueChange: (v) => setPaper((p) => ({ ...p, classLevel: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "exam.paper.class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DateInput,
          {
            label: "Exam Date",
            value: paper.date,
            onChange: (iso) => setPaper((p) => ({ ...p, date: iso })),
            "data-ocid": "exam.paper.date.input"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: paper.duration,
              onChange: (e) => setPaper((p) => ({ ...p, duration: e.target.value })),
              placeholder: "3 Hours",
              "data-ocid": "exam.paper.duration.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Instructions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: paper.instructions,
              onChange: (e) => setPaper((p) => ({ ...p, instructions: e.target.value })),
              rows: 2,
              "data-ocid": "exam.paper.instructions.textarea"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sections.map((sec, si) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaperSectionEditor,
      {
        section: sec,
        index: si,
        onAddQuestion: addQuestion,
        onRemoveQuestion: removeQuestion,
        onRemoveSection: (id) => setSections((ss) => ss.filter((s) => s.id !== id))
      },
      sec.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        onClick: () => setAddSecOpen(true),
        "data-ocid": "exam.paper.add_section_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
          " Add Section"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addSecOpen, onOpenChange: setAddSecOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[200]",
        "data-ocid": "exam.paper.section.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Section" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: secForm.title,
                  onChange: (e) => setSecForm((f) => ({ ...f, title: e.target.value })),
                  placeholder: "e.g. Section A – MCQ",
                  "data-ocid": "exam.paper.section.title.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: secForm.type,
                  onValueChange: (v) => setSecForm((f) => ({ ...f, type: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "exam.paper.section.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MCQ", children: "MCQ" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ShortAnswer", children: "Short Answer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LongAnswer", children: "Long Answer" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: secForm.marks,
                  onChange: (e) => setSecForm((f) => ({ ...f, marks: e.target.value })),
                  placeholder: "10",
                  "data-ocid": "exam.paper.section.marks.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setAddSecOpen(false),
                "data-ocid": "exam.paper.section.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: addSection,
                "data-ocid": "exam.paper.section.submit_button",
                children: "Add Section"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function PaperSectionEditor({
  section,
  index,
  onAddQuestion,
  onRemoveQuestion,
  onRemoveSection
}) {
  const [newQ, setNewQ] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card overflow-hidden",
      "data-ocid": `exam.paper.section.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: section.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              section.type,
              " · ",
              section.marks,
              " marks"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "size-8 text-destructive hover:text-destructive",
              onClick: () => onRemoveSection(section.id),
              "data-ocid": `exam.paper.delete_section.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          section.questions.map((q, qi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 group",
              "data-ocid": `exam.paper.section.question.${index + 1}.${qi + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-5 shrink-0", children: [
                  qi + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground flex-1", children: q }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-6 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive",
                    onClick: () => onRemoveQuestion(section.id, qi),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 })
                  }
                )
              ]
            },
            `${section.id}-q-${qi}`
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newQ,
                onChange: (e) => setNewQ(e.target.value),
                placeholder: "Type a question and press Add",
                className: "text-sm",
                onKeyDown: (e) => {
                  if (e.key === "Enter" && newQ) {
                    onAddQuestion(section.id, newQ);
                    setNewQ("");
                  }
                },
                "data-ocid": `exam.paper.section.new_question.${index + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => {
                  if (newQ) {
                    onAddQuestion(section.id, newQ);
                    setNewQ("");
                  }
                },
                "data-ocid": `exam.paper.section.add_question.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ExaminationsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("timetable");
  const [showAdmitPrint, setShowAdmitPrint] = reactExports.useState(false);
  const { data: allCertTemplates = [] } = useCertificateTemplates();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "examinations.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Examinations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure exams, enter marks, view results & performance reports" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "flex flex-col flex-1 min-h-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-4 flex-shrink-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "h-11 bg-transparent p-0 gap-0.5 flex-nowrap",
              "data-ocid": "examinations.tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "config",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.config.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 13 }),
                      " Exam Config"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "marks",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.marks.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 13 }),
                      " Marks Entry"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "results",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.results.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 13 }),
                      " Results"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "academic",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.academic.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 13 }),
                      " Performance"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "timetable",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.timetable.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
                      " Exam Timetable"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "syllabus",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.syllabus.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 13 }),
                      " Syllabus Q&A"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "online",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.online.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 13 }),
                      " Online Exams"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "paper",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.paper.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
                      " Paper Maker"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "admitcards",
                    className: "gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 text-xs whitespace-nowrap",
                    "data-ocid": "examinations.admitcards.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
                      " Admit Cards"
                    ]
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-auto bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "config", className: "m-0 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExamConfigTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "marks", className: "m-0 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarksEntryTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "results", className: "m-0 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExamResultsTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "academic", className: "m-0 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AcademicPerformanceTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timetable", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartTimetableTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "syllabus", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SyllabusQATab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "online", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OnlineExamsTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "paper", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaperMakerTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "admitcards", className: "m-0 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Print Admit Cards" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Generate and print admit cards for any student using your Certificate Studio template." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
                  "The admit card auto-fills student details and exam schedule from the saved timetable. Customize the template in",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Certificate Studio → Admit Card" }),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => setShowAdmitPrint(true),
                    "data-ocid": "examinations.admit_card.print_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 15, className: "mr-2" }),
                      "Select Student & Print Admit Card"
                    ]
                  }
                )
              ] })
            ] }) })
          ] })
        ]
      }
    ),
    showAdmitPrint && (() => {
      const tmpl = allCertTemplates.find(
        (t) => t.templateType === "AdmitCard" && t.isDefault
      ) ?? allCertTemplates.find((t) => t.templateType === "AdmitCard") ?? null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        GeneratePrintModal,
        {
          template: tmpl,
          forcedType: "AdmitCard",
          onClose: () => setShowAdmitPrint(false)
        }
      );
    })()
  ] });
}
export {
  ExaminationsPage as default
};
