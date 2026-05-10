import { r as reactExports, j as jsxRuntimeExports, t as Badge, e as Button, S as Skeleton, U as Users, aP as useNavigate, aX as useGetStaffAttendanceBreakdown, d as useAppStore, aW as useGetAttendanceBreakdown, d3 as useMonthlyStudentAttendance, d4 as useHolidays, C as CLASS_ORDER, i as CLASS_LABELS } from "./index-pMBTUEbj.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-DUIdHMSc.js";
import { C as Card, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { A as ArrowLeft } from "./arrow-left-DYhYtdC7.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import "./index-Nv6ob_Pe.js";
function ExcelAttendanceGrid({
  year,
  month,
  rows,
  days,
  isLoading,
  onExport
}) {
  const monthName = reactExports.useMemo(
    () => new Date(year, month - 1, 1).toLocaleString("en-IN", {
      month: "long",
      year: "numeric"
    }),
    [year, month]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm text-foreground", children: [
          "Excel Register — ",
          monthName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          rows.length,
          " students"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onExport,
          "data-ocid": "excel_attendance.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4 mr-1" }),
            "Export Excel"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-xs", children: [
      { label: "P = Present", bg: "#16a34a" },
      { label: "A = Absent", bg: "#dc2626" },
      { label: "L = Leave", bg: "#ca8a04" },
      { label: "Weekend/Holiday", bg: "#8B0000" }
    ].map(({ label, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "inline-block size-3 rounded-sm",
          style: { backgroundColor: bg }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "overflow-auto rounded-md border border-border",
        style: { maxHeight: "60vh" },
        "data-ocid": "excel_attendance.grid",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            className: "text-xs border-collapse",
            style: { minWidth: "max-content" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "sticky top-0 z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "sticky left-0 z-20 border border-border bg-muted/80 px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap",
                    style: { minWidth: 60 },
                    children: "Adm No."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "sticky z-20 border border-border bg-muted/80 px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap",
                    style: { minWidth: 140, left: 60 },
                    children: "Student Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "sticky z-20 border border-border bg-muted/80 px-2 py-1 text-center font-semibold text-muted-foreground",
                    style: { minWidth: 56, left: 200 },
                    children: "Class"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "sticky z-20 border border-border bg-muted/80 px-2 py-1 text-center font-semibold text-muted-foreground",
                    style: { minWidth: 48, left: 256 },
                    children: "Sec"
                  }
                ),
                days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "border border-border text-center font-semibold",
                    style: {
                      minWidth: 32,
                      backgroundColor: d.isWeekend || d.isHoliday ? "#8B0000" : void 0,
                      color: d.isWeekend || d.isHoliday ? "#fff" : void 0,
                      padding: "2px 1px"
                    },
                    title: d.isHoliday ? d.holidayName : d.isWeekend ? "Weekend" : void 0,
                    children: d.isWeekend || d.isHoliday ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          display: "block",
                          fontSize: 9,
                          lineHeight: 1,
                          padding: "4px 0"
                        },
                        children: d.isHoliday ? "HOLIDAY" : "WEEKEND"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: String(d.dayNum).padStart(2, "0") })
                  },
                  d.date
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "border border-border text-center font-semibold whitespace-nowrap",
                    style: {
                      minWidth: 36,
                      backgroundColor: "#166534",
                      color: "#fff",
                      padding: "4px 4px",
                      fontSize: 10
                    },
                    children: "Total P"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "border border-border text-center font-semibold whitespace-nowrap",
                    style: {
                      minWidth: 36,
                      backgroundColor: "#991b1b",
                      color: "#fff",
                      padding: "4px 4px",
                      fontSize: 10
                    },
                    children: "Total A"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? Array.from({ length: 8 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder rows
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  [0, 1, 2, 3].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-border px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }) }, j)),
                  days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-border p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }) }, d.date)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-border p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-border p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }) })
                ] }, `skel-${i}`)
              )) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  colSpan: 4 + days.length + 2,
                  className: "text-center py-12 text-muted-foreground",
                  "data-ocid": "excel_attendance.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 mx-auto mb-2 opacity-30" }),
                    "No student attendance data for this month/class."
                  ]
                }
              ) }) : rows.map((row, idx) => {
                const totalP = days.filter(
                  (d) => row.attendance[d.date] === "P"
                ).length;
                const totalA = days.filter(
                  (d) => !d.isWeekend && !d.isHoliday && row.attendance[d.date] === "A"
                ).length;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:brightness-95",
                    "data-ocid": `excel_attendance.row.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "sticky left-0 z-10 border border-border bg-background px-2 py-0.5 font-mono text-muted-foreground",
                          style: { minWidth: 60 },
                          children: row.admNo
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "sticky z-10 border border-border bg-background px-2 py-0.5 font-medium whitespace-nowrap overflow-hidden text-ellipsis",
                          style: { minWidth: 140, maxWidth: 180, left: 60 },
                          title: row.studentName,
                          children: row.studentName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "sticky z-10 border border-border bg-background px-1 py-0.5 text-center",
                          style: { minWidth: 56, left: 200 },
                          children: row.classLabel
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "sticky z-10 border border-border bg-background px-1 py-0.5 text-center",
                          style: { minWidth: 48, left: 256 },
                          children: row.sectionName
                        }
                      ),
                      days.map((d) => {
                        const status = row.attendance[d.date] ?? "";
                        const isSpecial = d.isWeekend || d.isHoliday;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "border border-border text-center font-bold p-0",
                            style: {
                              minWidth: 32,
                              height: 24,
                              ...isSpecial ? {
                                backgroundColor: "#8B0000",
                                color: "transparent"
                              } : status ? {
                                backgroundColor: status === "P" ? "#16a34a" : status === "A" ? "#dc2626" : "#ca8a04",
                                color: "#fff"
                              } : {}
                            },
                            title: isSpecial ? d.isHoliday ? d.holidayName : "Weekend" : void 0,
                            children: !isSpecial && status ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: status }) : null
                          },
                          d.date
                        );
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "border border-border text-center font-bold",
                          style: {
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                            fontSize: 11
                          },
                          children: totalP
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "border border-border text-center font-bold",
                          style: {
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontSize: 11
                          },
                          children: totalA
                        }
                      )
                    ]
                  },
                  `${row.admNo}-${idx}`
                );
              }) })
            ]
          }
        )
      }
    )
  ] });
}
function buildExcelCsvBlob(rows, days, monthName) {
  const headers = [
    "Adm No.",
    "Student Name",
    "Class",
    "Section",
    ...days.map(
      (d) => d.isWeekend || d.isHoliday ? `${String(d.dayNum).padStart(2, "0")}(${d.isHoliday ? "H" : "W"})` : String(d.dayNum).padStart(2, "0")
    ),
    "Total P",
    "Total A",
    "%"
  ];
  const dataLines = rows.map((row) => {
    const totalP = days.filter((d) => row.attendance[d.date] === "P").length;
    const totalA = days.filter(
      (d) => !d.isWeekend && !d.isHoliday && row.attendance[d.date] === "A"
    ).length;
    const workingDays = days.filter((d) => !d.isWeekend && !d.isHoliday).length;
    const pct = workingDays > 0 ? (totalP / workingDays * 100).toFixed(1) : "0.0";
    const cells = [
      `"${row.admNo}"`,
      `"${row.studentName.replace(/"/g, '""')}"`,
      `"${row.classLabel}"`,
      `"${row.sectionName}"`,
      ...days.map((d) => {
        if (d.isWeekend) return '"W"';
        if (d.isHoliday) return '"H"';
        return `"${row.attendance[d.date] ?? ""}"`;
      }),
      String(totalP),
      String(totalA),
      `"${pct}%"`
    ];
    return cells.join(",");
  });
  const csv = [
    `"Attendance Register — ${monthName}"`,
    headers.map((h) => `"${h}"`).join(","),
    ...dataLines
  ].join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function fmtDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}
function currentYearMonth() {
  const now = /* @__PURE__ */ new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
function exportCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(
      (r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function SummaryCard({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display mt-1 ${color}`, children: value })
  ] }) });
}
function MonthPicker({
  year,
  month,
  onChange
}) {
  const value = `${year}-${String(month).padStart(2, "0")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "month",
      value,
      onChange: (e) => {
        const [y, m] = e.target.value.split("-");
        if (y && m) onChange(Number(y), Number(m));
      },
      className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
      "data-ocid": "excel_attendance.month_input"
    }
  );
}
function buildDayMetas(year, month, holidayDates, holidayNames) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dow = new Date(date).getDay();
    const isWeekend = dow === 0;
    const isHoliday = holidayDates.has(date);
    days.push({
      date,
      dayNum: d,
      isWeekend,
      isHoliday,
      holidayName: holidayNames.get(date)
    });
  }
  return days;
}
function StudentAttendanceReport() {
  const { currentSession, sessions } = useAppStore();
  const [date, setDate] = reactExports.useState(todayStr());
  const [session, setSession] = reactExports.useState(currentSession);
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const [sectionFilter, setSectionFilter] = reactExports.useState("all");
  const [excelYear, setExcelYear] = reactExports.useState(currentYearMonth().year);
  const [excelMonth, setExcelMonth] = reactExports.useState(currentYearMonth().month);
  const [excelClass, setExcelClass] = reactExports.useState("all");
  const navigate = useNavigate();
  const { data: breakdown, isLoading: breakdownLoading } = useGetAttendanceBreakdown(date, session);
  const { data: monthlyRaw = [], isLoading: monthlyLoading } = useMonthlyStudentAttendance(excelYear, excelMonth, session);
  const { data: holidays = [] } = useHolidays(session);
  const holidayDates = reactExports.useMemo(
    () => new Set(holidays.map((h) => h.date)),
    [holidays]
  );
  const holidayNames = reactExports.useMemo(
    () => new Map(holidays.map((h) => [h.date, h.name])),
    [holidays]
  );
  const days = reactExports.useMemo(
    () => buildDayMetas(excelYear, excelMonth, holidayDates, holidayNames),
    [excelYear, excelMonth, holidayDates, holidayNames]
  );
  const CL_DISPLAY = reactExports.useMemo(() => {
    const m = {};
    for (const cl of CLASS_ORDER) m[cl] = CLASS_LABELS[cl] ?? cl;
    return m;
  }, []);
  const excelRows = reactExports.useMemo(() => {
    return monthlyRaw.filter((r) => excelClass === "all" || r.classLevel === excelClass).map((r) => ({
      admNo: r.admNo,
      studentName: r.studentName,
      classLevel: r.classLevel,
      classLabel: CL_DISPLAY[r.classLevel] ?? r.classLevel,
      sectionName: r.sectionName,
      attendance: r.days
    })).sort((a, b) => {
      const ai = CLASS_ORDER.indexOf(a.classLevel);
      const bi = CLASS_ORDER.indexOf(b.classLevel);
      if (ai !== bi) return ai - bi;
      if (a.sectionName < b.sectionName) return -1;
      if (a.sectionName > b.sectionName) return 1;
      return a.studentName.localeCompare(b.studentName);
    });
  }, [monthlyRaw, excelClass, CL_DISPLAY]);
  const excelClasses = reactExports.useMemo(
    () => [...new Set(monthlyRaw.map((r) => r.classLevel))].sort(
      (a, b) => CLASS_ORDER.indexOf(a) - CLASS_ORDER.indexOf(b)
    ),
    [monthlyRaw]
  );
  const classes = reactExports.useMemo(
    () => [...new Set(((breakdown == null ? void 0 : breakdown.rows) ?? []).map((r) => r.classLevel))].sort(),
    [breakdown]
  );
  const sections = reactExports.useMemo(
    () => [
      ...new Set(
        ((breakdown == null ? void 0 : breakdown.rows) ?? []).filter(
          (r) => classFilter === "all" || r.classLevel === classFilter
        ).map((r) => r.sectionName)
      )
    ].sort(),
    [breakdown, classFilter]
  );
  const filteredRows = reactExports.useMemo(
    () => ((breakdown == null ? void 0 : breakdown.rows) ?? []).filter(
      (r) => (classFilter === "all" || r.classLevel === classFilter) && (sectionFilter === "all" || r.sectionName === sectionFilter)
    ),
    [breakdown, classFilter, sectionFilter]
  );
  const totalStudents = filteredRows.reduce((s, r) => s + r.total, 0);
  const totalPresent = filteredRows.reduce((s, r) => s + r.present, 0);
  const totalAbsent = filteredRows.reduce((s, r) => s + r.absent, 0);
  const overallPct = totalStudents > 0 ? (totalPresent / totalStudents * 100).toFixed(1) : "0.0";
  function handleDailyExport() {
    exportCSV(
      filteredRows.map((r) => ({
        Class: r.classLabel,
        Section: r.sectionName,
        Present: String(r.present),
        Absent: String(r.absent),
        Total: String(r.total),
        "%": `${r.percent.toFixed(1)}%`,
        Date: fmtDate(date),
        Session: session
      })),
      `attendance-report-${date}.csv`
    );
  }
  function handleExcelExport() {
    const monthName = new Date(excelYear, excelMonth - 1, 1).toLocaleString(
      "en-IN",
      { month: "long", year: "numeric" }
    );
    const blob = buildExcelCsvBlob(excelRows, days, monthName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-register-${excelYear}-${String(excelMonth).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-4 animate-fade-in",
      "data-ocid": "attendance_report.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: "/dashboard" }),
              "data-ocid": "attendance_report.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground", children: "Attendance Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Session: ",
              session
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 flex flex-wrap gap-3 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: session,
              onValueChange: (v) => {
                setSession(v);
                setSectionFilter("all");
                setClassFilter("all");
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-32 h-8 text-sm",
                    "data-ocid": "attendance_report.session_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: s.name }, s.id)) })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "daily", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", "data-ocid": "attendance_report.tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "daily", "data-ocid": "attendance_report.daily_tab", children: "Daily Breakdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "excel", "data-ocid": "attendance_report.excel_tab", children: "✶ Excel Register" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "daily", className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border border-border",
                "data-ocid": "attendance_report.filters",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-wrap gap-3 items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "att-date",
                        className: "text-xs text-muted-foreground font-medium",
                        children: "Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "att-date",
                        type: "date",
                        value: date,
                        onChange: (e) => {
                          setDate(e.target.value);
                          setSectionFilter("all");
                          setClassFilter("all");
                        },
                        className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
                        "data-ocid": "attendance_report.date_input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "att-class",
                        className: "text-xs text-muted-foreground font-medium",
                        children: "Class"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: classFilter,
                        onValueChange: (v) => {
                          setClassFilter(v);
                          setSectionFilter("all");
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectTrigger,
                            {
                              id: "att-class",
                              className: "w-32 h-9 text-sm",
                              "data-ocid": "attendance_report.class_select",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                            classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CL_DISPLAY[c] ?? c }, c))
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "att-section",
                        className: "text-xs text-muted-foreground font-medium",
                        children: "Section"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sectionFilter, onValueChange: setSectionFilter, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          id: "att-section",
                          className: "w-28 h-9 text-sm",
                          "data-ocid": "attendance_report.section_select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All" }),
                        sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: handleDailyExport,
                      className: "ml-auto",
                      "data-ocid": "attendance_report.export_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
                        "Export CSV"
                      ]
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SummaryCard,
                {
                  label: "Total Students",
                  value: totalStudents,
                  color: "text-foreground"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SummaryCard,
                {
                  label: "Present",
                  value: totalPresent,
                  color: "text-emerald-600"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SummaryCard,
                {
                  label: "Absent",
                  value: totalAbsent,
                  color: "text-red-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SummaryCard,
                {
                  label: "Attendance %",
                  value: `${overallPct}%`,
                  color: Number(overallPct) >= 75 ? "text-emerald-600" : Number(overallPct) >= 50 ? "text-amber-600" : "text-red-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/60 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Class" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Present" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Absent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground", children: "%" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: breakdownLoading ? [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [0, 1, 2, 3, 4, 5].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `cell${i * 10 + j}`)) }, `row${i}`)) : filteredRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  colSpan: 6,
                  className: "text-center py-12 text-muted-foreground",
                  "data-ocid": "attendance_report.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 mx-auto mb-2 opacity-30" }),
                    "No attendance data for this date/session."
                  ]
                }
              ) }) : filteredRows.map((row, i) => {
                const pct = row.percent;
                const pctColor = pct >= 75 ? "text-emerald-600 font-semibold" : pct >= 50 ? "text-amber-600 font-semibold" : "text-red-500 font-semibold";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "hover:bg-muted/30 transition-colors",
                    "data-ocid": `attendance_report.row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: row.classLabel }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: row.sectionName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-emerald-600 font-medium", children: row.present }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-red-500 font-medium", children: row.absent }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: row.total }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `px-4 py-3 text-right ${pctColor}`, children: [
                        pct.toFixed(1),
                        "%"
                      ] })
                    ]
                  },
                  `${row.classLevel}-${row.sectionName}`
                );
              }) }),
              filteredRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "border-t-2 border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 2,
                    className: "px-4 py-3 font-semibold text-sm",
                    children: "Total"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-emerald-600 font-bold", children: totalPresent }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-red-500 font-bold", children: totalAbsent }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-bold", children: totalStudents }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: `px-4 py-3 text-right font-bold ${Number(overallPct) >= 75 ? "text-emerald-600" : Number(overallPct) >= 50 ? "text-amber-600" : "text-red-500"}`,
                    children: [
                      overallPct,
                      "%"
                    ]
                  }
                )
              ] }) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "excel", className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-wrap gap-3 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MonthPicker,
                  {
                    year: excelYear,
                    month: excelMonth,
                    onChange: (y, m) => {
                      setExcelYear(y);
                      setExcelMonth(m);
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Class" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: excelClass, onValueChange: setExcelClass, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-36 h-9 text-sm",
                      "data-ocid": "excel_attendance.class_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                    excelClasses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CL_DISPLAY[c] ?? c }, c))
                  ] })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ExcelAttendanceGrid,
              {
                year: excelYear,
                month: excelMonth,
                rows: excelRows,
                days,
                isLoading: monthlyLoading,
                onExport: handleExcelExport
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function StaffAttendanceReport() {
  const [date, setDate] = reactExports.useState(todayStr());
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const navigate = useNavigate();
  const { data: breakdown, isLoading } = useGetStaffAttendanceBreakdown(date);
  const filteredRows = ((breakdown == null ? void 0 : breakdown.rows) ?? []).filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );
  const totalStaff = (breakdown == null ? void 0 : breakdown.rows.length) ?? 0;
  const present = ((breakdown == null ? void 0 : breakdown.rows) ?? []).filter(
    (r) => r.status === "Present"
  ).length;
  const absent = totalStaff - present;
  function handleExport() {
    exportCSV(
      filteredRows.map((r) => ({
        Name: r.staffName,
        Status: r.status,
        "In Time": r.inTime ?? "",
        "Out Time": r.outTime ?? "",
        Device: r.deviceType,
        Date: fmtDate(date)
      })),
      `staff-attendance-${date}.csv`
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-6 animate-fade-in",
      "data-ocid": "staff_attendance_report.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => navigate({ to: "/dashboard" }),
              "data-ocid": "staff_attendance_report.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground", children: "Staff Attendance Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Date: ",
              fmtDate(date)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border border-border",
            "data-ocid": "staff_attendance_report.filters",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-wrap gap-3 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "staff-att-date",
                    className: "text-xs text-muted-foreground font-medium",
                    children: "Date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "staff-att-date",
                    type: "date",
                    value: date,
                    onChange: (e) => setDate(e.target.value),
                    className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
                    "data-ocid": "staff_attendance_report.date_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "staff-status",
                    className: "text-xs text-muted-foreground font-medium",
                    children: "Status"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: statusFilter,
                    onValueChange: (v) => setStatusFilter(v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          id: "staff-status",
                          className: "w-32 h-9 text-sm",
                          "data-ocid": "staff_attendance_report.status_select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "z-[9999]", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Present", children: "Present" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Absent", children: "Absent" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Late", children: "Late" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleExport,
                  className: "ml-auto",
                  "data-ocid": "staff_attendance_report.export_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-1" }),
                    "Export CSV"
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SummaryCard,
            {
              label: "Total Staff",
              value: totalStaff,
              color: "text-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Present", value: present, color: "text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Absent", value: absent, color: "text-red-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/60 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "In Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Out Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Device" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: isLoading ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [0, 1, 2, 3, 4].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `sc${i * 10 + j}`)) }, `sr${i}`)) : filteredRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 5,
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "staff_attendance_report.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 mx-auto mb-2 opacity-30" }),
                "No staff attendance data for this date."
              ]
            }
          ) }) : filteredRows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "hover:bg-muted/30 transition-colors",
              "data-ocid": `staff_attendance_report.row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: row.staffName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${row.status === "Present" ? "bg-emerald-100 text-emerald-700" : row.status === "Late" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`,
                    children: [
                      row.status === "Present" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
                      row.status
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: row.inTime ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: row.outTime ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: row.deviceType || "Manual" })
              ]
            },
            row.staffId
          )) })
        ] }) }) })
      ]
    }
  );
}
function AttendanceReportPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentAttendanceReport, {});
}
export {
  StaffAttendanceReport,
  StudentAttendanceReport,
  AttendanceReportPage as default
};
