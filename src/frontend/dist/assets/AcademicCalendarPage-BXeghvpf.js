import { d as useAppStore, e4 as useGetCalendarStats, e5 as useGetExamDatesForCalendar, r as reactExports, j as jsxRuntimeExports, bb as CalendarDays, e as Button, B as BookOpen, t as Badge, I as Input, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, k as DialogFooter, l as LoaderCircle, F as ue, a3 as useActor, am as useQuery, ao as useQueryClient, an as useMutation, L as Label, e6 as useAddExamDateToCalendar, ad as createActor } from "./index-pMBTUEbj.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { S as Send } from "./send-ByllD6tM.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import "./calendar-CAegGMND.js";
function formatDateDisplay(iso) {
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
  "Dec"
];
function useHolidays(sessionId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["holidays", sessionId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getHolidays(sessionId);
        return result.map((h) => ({
          id: String(h.id ?? ""),
          name: String(h.name ?? ""),
          date: String(h.date ?? ""),
          description: String(h.description ?? ""),
          isRecurring: Boolean(h.isRecurring)
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1e3
  });
}
function useAddHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h) => {
      if (!actor) throw new Error("Backend not available");
      return actor.addHoliday(h.name, h.date, h.description, false);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    }
  });
}
function useUpdateHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h) => {
      if (!actor) throw new Error("Backend not available");
      return actor.updateHoliday(h.id, h.name, h.date, h.description, false);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    }
  });
}
function useDeleteHoliday() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deleteHoliday(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendarStatsV2"] });
    }
  });
}
function HolidayFormDialog({ open, onClose, editing }) {
  const [name, setName] = reactExports.useState((editing == null ? void 0 : editing.name) ?? "");
  const [date, setDate] = reactExports.useState((editing == null ? void 0 : editing.date) ?? "");
  const [description, setDescription] = reactExports.useState((editing == null ? void 0 : editing.description) ?? "");
  const addHoliday = useAddHoliday();
  const updateHoliday = useUpdateHoliday();
  reactExports.useEffect(() => {
    if (open) {
      setName((editing == null ? void 0 : editing.name) ?? "");
      setDate((editing == null ? void 0 : editing.date) ?? "");
      setDescription((editing == null ? void 0 : editing.description) ?? "");
    }
  }, [open, editing]);
  const isSaving = addHoliday.isPending || updateHoliday.isPending;
  async function handleSave() {
    if (!name.trim() || !date) {
      ue.error("Holiday name and date are required.");
      return;
    }
    try {
      if (editing) {
        await updateHoliday.mutateAsync({
          id: editing.id,
          name: name.trim(),
          date,
          description
        });
        ue.success("Holiday updated successfully");
      } else {
        await addHoliday.mutateAsync({ name: name.trim(), date, description });
        ue.success("Holiday added successfully");
      }
      onClose();
    } catch {
      ue.error("Failed to save holiday. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v && !isSaving) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "calendar.holiday_dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Holiday" : "Add Holiday" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Holiday Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Republic Day",
                value: name,
                onChange: (e) => setName(e.target.value),
                "data-ocid": "calendar.holiday_form.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Date ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DateInput,
              {
                value: date,
                onChange: (iso) => setDate(iso),
                "data-ocid": "calendar.holiday_form.date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 2,
                placeholder: "Additional details about this holiday",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                "data-ocid": "calendar.holiday_form.description_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              disabled: isSaving,
              "data-ocid": "calendar.holiday_form.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: isSaving || !name.trim() || !date,
              "data-ocid": "calendar.holiday_form.submit_button",
              children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }),
                " Saving…"
              ] }) : editing ? "Save Changes" : "Add Holiday"
            }
          )
        ] })
      ] })
    }
  );
}
function ExamDateFormDialog({
  open,
  onClose
}) {
  const [examName, setExamName] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [className, setClassName] = reactExports.useState("");
  const addExam = useAddExamDateToCalendar();
  reactExports.useEffect(() => {
    if (open) {
      setExamName("");
      setDate("");
      setClassName("");
    }
  }, [open]);
  async function handleSave() {
    if (!examName.trim() || !date) {
      ue.error("Exam name and date are required.");
      return;
    }
    try {
      await addExam.mutateAsync({
        examName: examName.trim(),
        date,
        className: className.trim()
      });
      ue.success("Exam date added to calendar.");
      onClose();
    } catch {
      ue.error("Failed to add exam date.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v && !addExam.isPending) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "calendar.exam_dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Exam Date" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Exam Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Quarterly Exam, Half Yearly",
                value: examName,
                onChange: (e) => setExamName(e.target.value),
                "data-ocid": "calendar.exam_form.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Date ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DateInput,
              {
                value: date,
                onChange: (iso) => setDate(iso),
                "data-ocid": "calendar.exam_form.date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Class 10, All Classes",
                value: className,
                onChange: (e) => setClassName(e.target.value),
                "data-ocid": "calendar.exam_form.class_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              disabled: addExam.isPending,
              "data-ocid": "calendar.exam_form.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: addExam.isPending || !examName.trim() || !date,
              "data-ocid": "calendar.exam_form.submit_button",
              children: [
                addExam.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }) : null,
                "Add Exam Date"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function CalendarGrid({
  sessionId,
  holidays,
  examEntries
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
    { year: startYear + 1, month: 2 }
  ];
  const holidaySet = new Set(holidays.map((h) => h.date.split("T")[0]));
  const examSet = /* @__PURE__ */ new Map();
  for (const e of examEntries) {
    const d = e.date.split("T")[0];
    examSet.set(d, e.examName + (e.className ? ` (${e.className})` : ""));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: months.map(({ year, month }) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allDays = [...blanks, ...days];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-border bg-card p-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground mb-2 text-center", children: [
            MONTH_NAMES[month],
            " ",
            year
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-0.5 text-[10px]", children: [
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center font-semibold text-muted-foreground py-0.5",
                children: d
              },
              d
            )),
            allDays.map((day, idx) => {
              var _a;
              if (day === null)
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {},
                  `blank-${month}-${String(day ?? idx)}-pos${idx}`
                );
              const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayOfWeek = new Date(year, month, day).getDay();
              const isSunday = dayOfWeek === 0;
              const isHoliday = holidaySet.has(isoDate);
              const isExam = examSet.has(isoDate);
              const examTitle = examSet.get(isoDate);
              let cls = "text-center py-0.5 rounded text-foreground hover:bg-muted/50";
              if (isSunday)
                cls = "text-center py-0.5 rounded bg-orange-100 text-orange-700 font-semibold";
              if (isHoliday)
                cls = "text-center py-0.5 rounded bg-red-100 text-red-700 font-bold";
              if (isExam)
                cls = "text-center py-0.5 rounded bg-purple-100 text-purple-700 font-bold ring-1 ring-purple-400";
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cls,
                  title: isExam ? `Exam: ${examTitle}` : isHoliday ? (_a = holidays.find((h) => h.date.startsWith(isoDate))) == null ? void 0 : _a.name : isSunday ? "Sunday" : "",
                  children: day
                },
                isoDate
              );
            })
          ] })
        ]
      },
      `${year}-${month}`
    );
  }) });
}
function AcademicCalendarPage() {
  const { currentSession } = useAppStore();
  const session = currentSession ?? "2025-26";
  const { data: holidays = [], isLoading } = useHolidays(session);
  const { data: calStats } = useGetCalendarStats();
  const { data: examEntries = [] } = useGetExamDatesForCalendar();
  const deleteHoliday = useDeleteHoliday();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [examFormOpen, setExamFormOpen] = reactExports.useState(false);
  const [examFilter, setExamFilter] = reactExports.useState("all");
  const upcomingHolidays = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    const in7 = /* @__PURE__ */ new Date();
    in7.setDate(today.getDate() + 7);
    return holidays.filter((h) => {
      const d = new Date(h.date);
      return d >= today && d <= in7;
    });
  }, [holidays]);
  const filteredExams = reactExports.useMemo(() => {
    if (examFilter === "all") return examEntries;
    return examEntries.filter(
      (e) => e.className.toLowerCase().includes(examFilter.toLowerCase())
    );
  }, [examEntries, examFilter]);
  const statCards = [
    {
      label: "Total Days (Apr 1 – Today)",
      value: (calStats == null ? void 0 : calStats.totalDaysFromApril1) ?? "...",
      color: "text-foreground",
      desc: "From 1st April of this session"
    },
    {
      label: "Working Days",
      value: (calStats == null ? void 0 : calStats.workingDays) ?? "...",
      color: "text-green-600",
      desc: "School open (excl. Sundays & holidays)"
    },
    {
      label: "Sundays",
      value: (calStats == null ? void 0 : calStats.sundayCount) ?? "...",
      color: "text-orange-600",
      desc: "Auto-counted, always non-working"
    },
    {
      label: "Holidays",
      value: (calStats == null ? void 0 : calStats.holidayCount) ?? holidays.length,
      color: "text-red-600",
      desc: "Manually added holidays"
    }
  ];
  function openEdit(h) {
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
      ue.success("Holiday deleted");
    } catch {
      ue.error("Failed to delete holiday");
    }
    setDeleteId(null);
  }
  function sendWhatsAppNotification(h) {
    const msg = encodeURIComponent(
      `Dear Parent, ${h.name} on ${formatDateDisplay(h.date)} is a school holiday. School will remain closed.`
    );
    window.open(`https://wacoder.in/send?message=${msg}`, "_blank");
    ue.success(`WhatsApp notification queued for ${h.name}`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "calendar.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Academic Calendar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Holidays, working days & exam dates — Session ",
          session
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setViewMode((v) => v === "list" ? "calendar" : "list"),
            "data-ocid": "calendar.view_toggle",
            children: viewMode === "list" ? "Calendar View" : "List View"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setExamFormOpen(true),
            "data-ocid": "calendar.add_exam_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 mr-1" }),
              " Add Exam Date"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openAdd, "data-ocid": "calendar.add_button", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
          " Add Holiday"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-6 space-y-6 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: statCards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-3xl font-bold font-display ${calStats ? c.color : "text-muted-foreground"}`,
                children: c.value
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mt-1", children: c.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: c.desc })
          ]
        },
        c.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded bg-red-200" }),
          " Holiday"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded bg-orange-200" }),
          " ",
          "Sunday"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded bg-purple-200 ring-1 ring-purple-400" }),
          " ",
          "Exam Date"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded border border-border" }),
          " ",
          "Working Day"
        ] })
      ] }),
      examEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-purple-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 text-purple-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-purple-800 dark:text-purple-300 text-sm", children: "Exam Dates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-100 text-purple-700 border-purple-300 text-xs ml-auto", children: [
            examEntries.length,
            " exam date",
            examEntries.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "w-40 h-7 text-xs",
              placeholder: "Filter by class",
              value: examFilter,
              onChange: (e) => setExamFilter(e.target.value || "all"),
              "data-ocid": "calendar.exam_filter_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-purple-50/80 dark:bg-purple-950/30 border-b border-purple-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-purple-700", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-purple-700", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-purple-700", children: "Exam Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-purple-700", children: "Class" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredExams.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-purple-100 last:border-0 hover:bg-purple-50/40",
              "data-ocid": `calendar.exam.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground text-xs", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: formatDateDisplay(e.date) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-medium text-foreground", children: e.examName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground text-xs", children: e.className || "All Classes" })
              ]
            },
            e.id
          )) })
        ] })
      ] }),
      viewMode === "calendar" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        CalendarGrid,
        {
          sessionId: session,
          holidays,
          examEntries
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground text-sm", children: [
            "Holidays — ",
            session
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
            holidays.length,
            " manual holidays"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Holiday Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-semibold text-foreground", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-orange-50/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                colSpan: 5,
                className: "px-4 py-2 text-xs text-orange-700 font-semibold",
                children: [
                  "Sundays: ",
                  (calStats == null ? void 0 : calStats.sundayCount) ?? "...",
                  " — automatically non-working days"
                ]
              }
            ) }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 5,
                className: "px-4 py-12 text-center text-muted-foreground",
                "data-ocid": "calendar.loading_state",
                children: "Loading holidays…"
              }
            ) }) : holidays.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 5,
                className: "px-4 py-12 text-center text-muted-foreground",
                "data-ocid": "calendar.empty_state",
                children: "No holidays added yet. Click “Add Holiday” to add the first one."
              }
            ) }) : holidays.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/10",
                "data-ocid": `calendar.holiday.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground", children: formatDateDisplay(h.date) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: h.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate", children: h.description || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-8",
                        onClick: () => openEdit(h),
                        "data-ocid": `calendar.edit_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-8 text-destructive hover:text-destructive",
                        onClick: () => setDeleteId(h.id),
                        "data-ocid": `calendar.delete_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-8 text-green-600",
                        onClick: () => sendWhatsAppNotification(h),
                        title: "Send WhatsApp notification",
                        "data-ocid": `calendar.notify_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              h.id
            ))
          ] })
        ] })
      ] }),
      upcomingHolidays.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-amber-700 dark:text-amber-400 text-sm", children: "🔔 Upcoming Holidays (next 7 days)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: upcomingHolidays.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-white/70 dark:bg-card border border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: h.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDateDisplay(h.date) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-green-700 border-green-500/40 hover:bg-green-500/10 gap-1.5",
                  onClick: () => sendWhatsAppNotification(h),
                  "data-ocid": `calendar.upcoming_notify.${h.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" }),
                    " Send Notification"
                  ]
                }
              )
            ]
          },
          h.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0 mt-0.5 text-blue-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Working days" }),
          " count from 1st April, automatically excluding Sundays and added holidays. Holidays here are also excluded from staff salary working-day calculations in HR & Payroll."
        ] })
      ] })
    ] }),
    formOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HolidayFormDialog,
      {
        open: formOpen,
        onClose: () => {
          setFormOpen(false);
          setEditing(null);
        },
        editing
      }
    ),
    examFormOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExamDateFormDialog,
      {
        open: examFormOpen,
        onClose: () => setExamFormOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "calendar.delete_dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Holiday?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently remove this holiday from the calendar. Working day calculations will be updated automatically." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteId(null),
            "data-ocid": "calendar.delete_dialog.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            onClick: handleDelete,
            disabled: deleteHoliday.isPending,
            "data-ocid": "calendar.delete_dialog.confirm_button",
            children: deleteHoliday.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AcademicCalendarPage as default
};
