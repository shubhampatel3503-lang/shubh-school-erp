import { r as reactExports, j as jsxRuntimeExports, a_ as ClipboardList, t as Badge, C as CLASS_ORDER, i as CLASS_LABELS, e as Button, B as BookOpen, a0 as formatDate, U as Users, L as Label, I as Input, a1 as generateId, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle } from "./index-pMBTUEbj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { C as CircleCheckBig } from "./circle-check-big-DCQRnxmS.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-Bzpux5qV.js";
import "./index-Nv6ob_Pe.js";
const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science"
];
const INITIAL_HW = [
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
    createdBy: "Ms. Priya Sharma"
  },
  {
    id: "hw2",
    title: "Essay: My Favourite Season",
    description: "Write a 300-word essay on your favourite season with examples",
    classLevel: "Class8",
    sectionId: "A",
    subjectId: "English",
    assignedDate: "2025-04-24",
    dueDate: "2025-04-27",
    isActive: true,
    createdBy: "Mr. Ramesh Kumar"
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
    createdBy: "Ms. Kavita Verma"
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
    createdBy: "Mr. Suresh Gupta"
  }
];
const STUDENTS_FOR_HW = {
  hw1: [
    { id: "s1", name: "Arjun Mehta" },
    { id: "s2", name: "Sneha Patel" },
    { id: "s3", name: "Rohit Singh" },
    { id: "s4", name: "Priya Agarwal" },
    { id: "s5", name: "Vikram Joshi" }
  ],
  hw2: [
    { id: "s6", name: "Ananya Sharma" },
    { id: "s7", name: "Kabir Das" },
    { id: "s8", name: "Meera Nair" }
  ],
  hw3: [
    { id: "s9", name: "Rahul Gupta" },
    { id: "s10", name: "Simran Kaur" },
    { id: "s11", name: "Amit Yadav" },
    { id: "s12", name: "Neha Singh" }
  ],
  hw4: [
    { id: "s13", name: "Deepak Kumar" },
    { id: "s14", name: "Pooja Verma" }
  ]
};
const INITIAL_SUBS = [
  {
    id: "sub1",
    homeworkId: "hw1",
    studentId: "s1",
    submittedAt: "2025-04-27T10:00:00",
    fileUrl: null,
    remarks: "Good work",
    grade: "A"
  },
  {
    id: "sub2",
    homeworkId: "hw1",
    studentId: "s2",
    submittedAt: "2025-04-27T11:30:00",
    fileUrl: null,
    remarks: "",
    grade: null
  },
  {
    id: "sub3",
    homeworkId: "hw2",
    studentId: "s6",
    submittedAt: "2025-04-26T14:00:00",
    fileUrl: null,
    remarks: "Well written",
    grade: "B+"
  },
  {
    id: "sub4",
    homeworkId: "hw3",
    studentId: "s9",
    submittedAt: "2025-04-26T09:00:00",
    fileUrl: null,
    remarks: "",
    grade: null
  }
];
const CHART_DATA = [
  { class: "Class 7", rate: 72 },
  { class: "Class 8", rate: 85 },
  { class: "Class 9", rate: 68 },
  { class: "Class 10", rate: 91 },
  { class: "Class 11", rate: 78 },
  { class: "Class 12", rate: 95 }
];
function isOverdue(hw) {
  return new Date(hw.dueDate) < /* @__PURE__ */ new Date() && hw.isActive;
}
function HWDialog({
  open,
  onClose,
  onSave
}) {
  const [form, setForm] = reactExports.useState({
    title: "",
    description: "",
    classLevel: "Class9",
    section: "A",
    subject: SUBJECTS[0],
    dueDate: ""
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function handleSave() {
    if (!form.title || !form.dueDate) return;
    onSave({
      id: generateId(),
      title: form.title,
      description: form.description,
      classLevel: form.classLevel,
      sectionId: form.section,
      subjectId: form.subject,
      assignedDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      dueDate: form.dueDate,
      isActive: true,
      createdBy: "Admin"
    });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "homework.add_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Assign Homework" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.title,
            onChange: (e) => set("title", e.target.value),
            placeholder: "Homework title",
            "data-ocid": "homework.title.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            className: "mt-1",
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            placeholder: "Detailed instructions...",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.classLevel,
              onValueChange: (v) => set("classLevel", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "mt-1",
                    "data-ocid": "homework.class.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Section" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.section,
              onChange: (e) => set("section", e.target.value),
              placeholder: "A"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.subject,
              onValueChange: (v) => set("subject", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "mt-1",
                    "data-ocid": "homework.subject.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            className: "mt-1",
            value: form.dueDate,
            onChange: (e) => set("dueDate", e.target.value),
            "data-ocid": "homework.due_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: handleSave,
            "data-ocid": "homework.assign.submit_button",
            children: "Assign Homework"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "homework.assign.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function HomeworkPage() {
  const [homework, setHomework] = reactExports.useState(INITIAL_HW);
  const [submissions, setSubmissions] = reactExports.useState(INITIAL_SUBS);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [selectedHW, setSelectedHW] = reactExports.useState("hw1");
  const [classFilter, setClassFilter] = reactExports.useState("All");
  const [subjectFilter, setSubjectFilter] = reactExports.useState("All");
  const [gradeInput, setGradeInput] = reactExports.useState({});
  const [remarkInput, _setRemarkInput] = reactExports.useState({});
  function addHomework(h) {
    setHomework((p) => [h, ...p]);
  }
  function deleteHomework(id) {
    setHomework((p) => p.filter((h) => h.id !== id));
  }
  function markSubmitted(hwId, studentId) {
    const existing = submissions.find(
      (s) => s.homeworkId === hwId && s.studentId === studentId
    );
    if (existing) return;
    setSubmissions((p) => [
      ...p,
      {
        id: generateId(),
        homeworkId: hwId,
        studentId,
        submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
        fileUrl: null,
        remarks: "",
        grade: null
      }
    ]);
  }
  function saveGrade(hwId, studentId) {
    const key = `${hwId}-${studentId}`;
    setSubmissions(
      (p) => p.map(
        (s) => s.homeworkId === hwId && s.studentId === studentId ? {
          ...s,
          grade: gradeInput[key] ?? s.grade,
          remarks: remarkInput[key] ?? s.remarks
        } : s
      )
    );
  }
  const filteredHW = homework.filter(
    (h) => (classFilter === "All" || h.classLevel === classFilter) && (subjectFilter === "All" || h.subjectId === subjectFilter)
  );
  const overdueCount = homework.filter(isOverdue).length;
  const currentHW = homework.find((h) => h.id === selectedHW);
  const hwStudents = selectedHW ? STUDENTS_FOR_HW[selectedHW] ?? [] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-7xl", "data-ocid": "homework.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Homework" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Assign, track submissions, and detect overdue" })
      ] }),
      overdueCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "destructive",
          className: "ml-auto",
          "data-ocid": "homework.overdue_badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3 mr-1" }),
            overdueCount,
            " Overdue"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "assign", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "assign", "data-ocid": "homework.assign.tab", children: "Assign Homework" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "submissions", "data-ocid": "homework.submissions.tab", children: "Submissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", "data-ocid": "homework.analytics.tab", children: "Analytics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "assign", className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classFilter, onValueChange: setClassFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-36",
                  "data-ocid": "homework.class_filter.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Class" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Classes" }),
                CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: subjectFilter, onValueChange: setSubjectFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-40",
                  "data-ocid": "homework.subject_filter.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Subject" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Subjects" }),
                SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setAddOpen(true),
              "data-ocid": "homework.add.open_modal_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                "Assign Homework"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          filteredHW.map((hw, i) => {
            var _a;
            const overdue = isOverdue(hw);
            const subs = submissions.filter((s) => s.homeworkId === hw.id);
            const total = ((_a = STUDENTS_FOR_HW[hw.id]) == null ? void 0 : _a.length) ?? 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `rounded-xl border bg-card p-4 ${overdue ? "border-destructive/40" : "border-border"}`,
                "data-ocid": `homework.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: hw.title }),
                      overdue && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Overdue" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: hw.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3" }),
                        CLASS_LABELS[hw.classLevel],
                        "-",
                        hw.sectionId
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hw.subjectId }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                        "Due: ",
                        formatDate(hw.dueDate)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3" }),
                        subs.length,
                        "/",
                        total,
                        " submitted"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7",
                        "data-ocid": `homework.edit.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7 text-destructive",
                        onClick: () => deleteHomework(hw.id),
                        "data-ocid": `homework.delete.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] })
                ] })
              },
              hw.id
            );
          }),
          filteredHW.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-card p-12 text-center",
              "data-ocid": "homework.list.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-12 mx-auto text-muted-foreground/30 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "No homework assigned" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Click "Assign Homework" to add new assignments.' })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "submissions", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select Homework" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedHW ?? "", onValueChange: setSelectedHW, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "mt-1 w-full max-w-sm",
                "data-ocid": "homework.select_hw.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose homework..." })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: homework.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: h.id, children: [
              CLASS_LABELS[h.classLevel],
              " — ",
              h.title
            ] }, h.id)) })
          ] })
        ] }),
        currentHW && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: currentHW.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Due: ",
              formatDate(currentHW.dueDate),
              " |",
              " ",
              CLASS_LABELS[currentHW.classLevel],
              "-",
              currentHW.sectionId,
              " |",
              " ",
              currentHW.subjectId
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: hwStudents.map((student, i) => {
            const sub = submissions.find(
              (s) => s.homeworkId === currentHW.id && s.studentId === student.id
            );
            const key = `${currentHW.id}-${student.id}`;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-3 px-4 py-3 ${!sub ? "bg-red-50/30" : ""}`,
                "data-ocid": `homework.submission.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `size-8 rounded-full flex items-center justify-center text-xs font-bold ${sub ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`,
                      children: sub ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: student.name }),
                    sub ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Submitted ",
                      formatDate(sub.submittedAt),
                      " ",
                      sub.grade ? `| Grade: ${sub.grade}` : ""
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500", children: "Not submitted" })
                  ] }),
                  sub ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: gradeInput[key] ?? sub.grade ?? "",
                        onChange: (e) => setGradeInput((p) => ({
                          ...p,
                          [key]: e.target.value
                        })),
                        placeholder: "Grade",
                        className: "w-20 h-7 text-xs"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "h-7 text-xs",
                        onClick: () => saveGrade(currentHW.id, student.id),
                        children: "Save"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-xs",
                      onClick: () => markSubmitted(currentHW.id, student.id),
                      "data-ocid": `homework.mark_submitted.${i + 1}`,
                      children: "Mark Submitted"
                    }
                  )
                ]
              },
              student.id
            );
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "analytics", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
          {
            label: "Total Assigned",
            value: homework.length,
            color: "text-primary"
          },
          {
            label: "Overdue",
            value: overdueCount,
            color: "text-destructive"
          },
          {
            label: "Total Submissions",
            value: submissions.length,
            color: "text-emerald-600"
          }
        ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display ${color}`, children: value })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-4", children: "Submission Rate by Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: CHART_DATA,
              margin: { top: 5, right: 20, left: 0, bottom: 5 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "class",
                    tick: { fontSize: 12 },
                    stroke: "var(--muted-foreground)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    domain: [0, 100],
                    tickFormatter: (v) => `${v}%`,
                    tick: { fontSize: 12 },
                    stroke: "var(--muted-foreground)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v) => [`${v}%`, "Submission Rate"],
                    contentStyle: {
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "rate",
                    name: "Submission Rate %",
                    fill: "oklch(0.49 0.24 264)",
                    radius: [4, 4, 0, 0]
                  }
                )
              ]
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HWDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        onSave: addHomework
      }
    )
  ] });
}
export {
  HomeworkPage as default
};
