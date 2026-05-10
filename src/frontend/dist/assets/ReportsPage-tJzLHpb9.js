import { ae as createLucideIcon, r as reactExports, bv as sessionYears, a5 as useStudents, bA as useStaff, by as useGetFeeRegisterBySession, a6 as useRoutes, ck as useInventoryItems, j as jsxRuntimeExports, bz as ChartColumn, U as Users, a_ as ClipboardList, B as BookOpen, G as GraduationCap, ap as Bus, e as Button, L as Label, C as CLASS_ORDER, a7 as getClassLabel, ab as downloadCSV, a0 as formatDate, bk as formatCurrency, a8 as useSections, m as useSubjects, t as Badge, cl as useInventoryTransactions, I as Input, S as Skeleton } from "./index-pMBTUEbj.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { C as ChartNoAxesColumn } from "./chart-no-axes-column-FtqDFsff.js";
import { W as Wallet } from "./wallet-BSqNaYM4.js";
import { D as Download } from "./download-BHLO7mQe.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);
const REPORT_TYPES = [
  {
    id: "students",
    label: "Students",
    icon: Users,
    description: "Enrollment, class-wise counts, gender & category distribution",
    color: "text-blue-600"
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    description: "Fee collection, payment modes, collector-wise summary",
    color: "text-green-600"
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardList,
    description: "Class-wise attendance percentages and daily counts",
    color: "text-orange-600"
  },
  {
    id: "academics",
    label: "Academics",
    icon: BookOpen,
    description: "Classes, sections, subjects and student distribution",
    color: "text-purple-600"
  },
  {
    id: "hr",
    label: "HR / Staff",
    icon: GraduationCap,
    description: "Staff directory, departments, designations and salary",
    color: "text-pink-600"
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    description: "Routes, bus numbers, drivers and student ridership",
    color: "text-yellow-600"
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: ChartNoAxesColumn,
    description: "Stock levels, categories, purchase and sales transactions",
    color: "text-teal-600"
  },
  {
    id: "fees-due",
    label: "Fees Due",
    icon: Wallet,
    description: "Students with outstanding fee balances this session",
    color: "text-red-600"
  }
];
function ReportTable({
  headers,
  rows,
  emptyMessage = "No data available for this session"
}) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
        "data-ocid": "reports.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-10 w-10 mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: emptyMessage })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static report rows
      /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-t border-border hover:bg-muted/20", children: row.map((cell, j) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static report rows
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-foreground", children: cell }, j)
      )) }, i)
    )) })
  ] }) });
}
function StatCard({
  label,
  value,
  color = "text-primary"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-lg text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${color}`, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: label })
  ] });
}
function SkeletonReport() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-lg" })
    ] })
  ] });
}
function StudentReport({
  session,
  classFilter
}) {
  const { data: students = [], isLoading } = useStudents();
  const sessionStudents = reactExports.useMemo(
    () => students.filter((s) => s.sessionId === session),
    [students, session]
  );
  const filtered = reactExports.useMemo(
    () => classFilter === "all" ? sessionStudents : sessionStudents.filter((s) => s.classLevel === classFilter),
    [sessionStudents, classFilter]
  );
  const active = filtered.filter((s) => !s.isDiscontinued);
  const discontinued = filtered.filter((s) => s.isDiscontinued);
  const genderCounts = reactExports.useMemo(() => {
    const m = active.filter((s) => s.gender === "Male").length;
    const f = active.filter((s) => s.gender === "Female").length;
    return { m, f, other: active.length - m - f };
  }, [active]);
  const classRows = reactExports.useMemo(
    () => CLASS_ORDER.map((cl) => {
      const inClass = filtered.filter((s) => s.classLevel === cl);
      const a = inClass.filter((s) => !s.isDiscontinued).length;
      const d = inClass.filter((s) => s.isDiscontinued).length;
      return {
        class: getClassLabel(cl),
        active: a,
        discontinued: d,
        total: a + d
      };
    }).filter((r) => r.total > 0),
    [filtered]
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
      "Student Enrollment — ",
      session
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Active Students", value: active.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Discontinued",
            value: discontinued.length,
            color: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Male / Female",
            value: `${genderCounts.m} / ${genderCounts.f}`,
            color: "text-accent-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total",
            value: filtered.length,
            color: "text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportTable,
        {
          headers: ["Class", "Active", "Discontinued", "Total"],
          rows: classRows.map((r) => [
            r.class,
            String(r.active),
            String(r.discontinued),
            String(r.total)
          ])
        }
      )
    ] })
  ] });
}
function FinanceReport({ session }) {
  const { data: register = [], isLoading } = useGetFeeRegisterBySession(session);
  const active = register.filter((e) => !e.isDeleted);
  const totalCollected = active.reduce((s, e) => s + e.totalAmount, 0);
  const totalBalance = active.reduce((s, e) => s + (e.balance ?? 0), 0);
  const byMode = reactExports.useMemo(() => {
    const map = {};
    for (const e of active) {
      const mode = e.paymentMode || "Cash";
      map[mode] = (map[mode] ?? 0) + e.totalAmount;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);
  const byCollector = reactExports.useMemo(() => {
    const map = {};
    for (const e of active) {
      const c = e.collectedBy || "—";
      map[c] = (map[c] ?? 0) + e.totalAmount;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
      "Finance Summary — ",
      session
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Collected",
            value: formatCurrency(totalCollected),
            color: "text-green-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Balance Carried",
            value: formatCurrency(totalBalance),
            color: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Receipts", value: active.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Payment Mode Breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Mode", "Amount"],
              rows: byMode.map(([mode, amt]) => [mode, formatCurrency(amt)])
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Collector-wise Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Collector", "Amount"],
              rows: byCollector.map(([col, amt]) => [col, formatCurrency(amt)])
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function AttendanceReport({
  session,
  classFilter
}) {
  const { data: students = [], isLoading } = useStudents();
  const sessionStudents = reactExports.useMemo(
    () => students.filter((s) => s.sessionId === session && !s.isDiscontinued),
    [students, session]
  );
  const classRows = reactExports.useMemo(
    () => CLASS_ORDER.filter((cl) => classFilter === "all" || cl === classFilter).map((cl) => {
      const count = sessionStudents.filter(
        (s) => s.classLevel === cl
      ).length;
      return { class: getClassLabel(cl), count };
    }).filter((r) => r.count > 0),
    [sessionStudents, classFilter]
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
      "Attendance Summary — ",
      session
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Active Students",
            value: sessionStudents.length
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Classes with Data", value: classRows.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Session",
            value: session,
            color: "text-accent-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Attendance percentage data is recorded per-student in the Attendance module. This shows enrolled student counts by class for ",
        session,
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportTable,
        {
          headers: ["Class", "Enrolled Students"],
          rows: classRows.map((r) => [r.class, String(r.count)])
        }
      )
    ] })
  ] });
}
function AcademicsReport({ session }) {
  const { data: sections = [], isLoading: sectionsLoading } = useSections();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const sessionStudents = reactExports.useMemo(
    () => students.filter((s) => s.sessionId === session),
    [students, session]
  );
  const classCounts = reactExports.useMemo(() => {
    const map = {};
    for (const s of sessionStudents) {
      map[s.classLevel] = (map[s.classLevel] ?? 0) + 1;
    }
    return map;
  }, [sessionStudents]);
  const uniqueClasses = reactExports.useMemo(() => {
    const cl = new Set(sections.map((s) => s.classLevel));
    return CLASS_ORDER.filter((c) => cl.has(c));
  }, [sections]);
  const isLoading = sectionsLoading || subjectsLoading || studentsLoading;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
      "Academics Overview — ",
      session
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Classes", value: uniqueClasses.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Sections", value: sections.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Subjects", value: subjects.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Enrolled Students", value: sessionStudents.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Students per Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Class", "Students"],
              rows: CLASS_ORDER.filter((cl) => classCounts[cl] > 0).map(
                (cl) => [getClassLabel(cl), String(classCounts[cl] ?? 0)]
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Sections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Class", "Section", "Room"],
              rows: sections.map((s) => [
                getClassLabel(s.classLevel),
                s.name,
                s.roomNo || "—"
              ])
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function HRReport() {
  const { data: staff = [], isLoading } = useStaff();
  const active = staff.filter((s) => s.isActive);
  const inactive = staff.filter((s) => !s.isActive);
  const deptMap = reactExports.useMemo(() => {
    const map = {};
    for (const s of active) {
      const d = s.department || "General";
      map[d] = (map[d] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [active]);
  const totalSalary = active.reduce((s, m) => s + m.basicSalary, 0);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Staff Report" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Staff", value: staff.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Active",
            value: active.length,
            color: "text-green-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Inactive",
            value: inactive.length,
            color: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Monthly Salary",
            value: formatCurrency(totalSalary),
            color: "text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Department-wise Count" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Department", "Staff"],
              rows: deptMap.map(([dept, cnt]) => [dept, String(cnt)])
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Staff Directory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Code", "Name", "Designation", "Joining", "Status"],
              rows: staff.map((s) => [
                s.staffCode,
                s.fullName,
                s.designation,
                formatDate(s.dateOfJoining),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: s.isActive ? "default" : "secondary",
                    children: s.isActive ? "Active" : "Inactive"
                  },
                  s.staffCode
                )
              ])
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function TransportReport() {
  const { data: routes = [], isLoading } = useRoutes();
  const { data: students = [] } = useStudents();
  const routeStudentCounts = reactExports.useMemo(() => {
    const map = {};
    for (const s of students) {
      if (s.transportRouteId) {
        map[s.transportRouteId] = (map[s.transportRouteId] ?? 0) + 1;
      }
    }
    return map;
  }, [students]);
  const totalRiders = Object.values(routeStudentCounts).reduce(
    (sum, c) => sum + c,
    0
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Transport Report" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Routes", value: routes.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Riders", value: totalRiders }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Avg per Route",
            value: routes.length > 0 ? Math.round(totalRiders / routes.length) : 0
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportTable,
        {
          headers: ["Route", "Bus No.", "Driver", "Driver Mobile", "Students"],
          rows: routes.map((r) => [
            r.name,
            r.busNumber || "—",
            r.driverName || "—",
            r.driverMobile || "—",
            String(routeStudentCounts[r.id] ?? 0)
          ])
        }
      )
    ] })
  ] });
}
function InventoryReport() {
  const { data: items = [], isLoading: itemsLoading } = useInventoryItems();
  const { data: transactions = [], isLoading: txLoading } = useInventoryTransactions();
  const totalPurchaseValue = items.reduce(
    (s, it) => s + it.currentStock * it.purchasePrice,
    0
  );
  const totalSaleValue = items.reduce(
    (s, it) => s + it.currentStock * it.salePrice,
    0
  );
  const salesTx = transactions.filter((t) => t.type === "Sale");
  const totalSalesAmount = salesTx.reduce((s, t) => s + t.totalAmount, 0);
  const categoryMap = reactExports.useMemo(() => {
    const map = {};
    for (const it of items) {
      const cat = it.category || "General";
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);
  const isLoading = itemsLoading || txLoading;
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Inventory Report" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Items", value: items.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Purchase Value",
            value: formatCurrency(totalPurchaseValue)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Sale Value",
            value: formatCurrency(totalSaleValue),
            color: "text-green-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Sales Recorded",
            value: formatCurrency(totalSalesAmount),
            color: "text-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Category-wise Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Category", "Items"],
              rows: categoryMap.map(([cat, cnt]) => [cat, String(cnt)])
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2 text-foreground", children: "Stock Levels" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportTable,
            {
              headers: ["Item", "Stock", "Min Stock", "Sale Price"],
              rows: items.map((it) => [
                it.name,
                `${it.currentStock} ${it.unit}`,
                String(it.minStock),
                formatCurrency(it.salePrice)
              ])
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function FeesDueReport({ session }) {
  const { data: register = [], isLoading } = useGetFeeRegisterBySession(session);
  const { data: students = [] } = useStudents();
  const [search, setSearch] = reactExports.useState("");
  const studentMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of students) map.set(s.id, s);
    return map;
  }, [students]);
  const dueMap = reactExports.useMemo(() => {
    const paid = {};
    for (const e of register) {
      if (e.isDeleted) continue;
      paid[e.studentId] = (paid[e.studentId] ?? 0) + e.totalAmount;
    }
    const withBalance = {};
    for (const e of register) {
      if (e.isDeleted || !e.balance || e.balance <= 0) continue;
      if (!withBalance[e.studentId] || withBalance[e.studentId] < e.balance) {
        withBalance[e.studentId] = e.balance;
      }
    }
    return withBalance;
  }, [register]);
  const dueRows = reactExports.useMemo(() => {
    return Object.entries(dueMap).map(([sid, balance]) => {
      const st = studentMap.get(sid);
      return {
        admNo: (st == null ? void 0 : st.admNo) ?? "—",
        name: (st == null ? void 0 : st.fullName) ?? "Unknown",
        class: st ? getClassLabel(st.classLevel) : "—",
        balance,
        mobile: (st == null ? void 0 : st.fatherMobile) ?? "—"
      };
    }).filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.admNo.toLowerCase().includes(q) || r.class.toLowerCase().includes(q);
    }).sort((a, b) => b.balance - a.balance);
  }, [dueMap, studentMap, search]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonReport, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { children: [
      "Outstanding Fees — ",
      session
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Students with Balance",
            value: Object.keys(dueMap).length,
            color: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Outstanding",
            value: formatCurrency(
              Object.values(dueMap).reduce((s, v) => s + v, 0)
            ),
            color: "text-destructive"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Showing", value: dueRows.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name, adm. no. or class…",
            className: "max-w-xs h-8",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "reports.fees_due.search_input"
          }
        ),
        dueRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
          dueRows.length,
          " students with dues"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportTable,
        {
          headers: ["Adm No.", "Name", "Class", "Balance", "Mobile"],
          rows: dueRows.map((r) => [
            r.admNo,
            r.name,
            r.class,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-destructive", children: formatCurrency(r.balance) }, r.admNo),
            r.mobile
          ])
        }
      )
    ] })
  ] });
}
function ReportsPage() {
  var _a;
  const [selected, setSelected] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState("2025-26");
  const [classFilter, setClassFilter] = reactExports.useState("all");
  const sessions = reactExports.useMemo(() => sessionYears(2019).reverse(), []);
  const { data: students = [] } = useStudents();
  const { data: staff = [] } = useStaff();
  const { data: feeRegister = [] } = useGetFeeRegisterBySession(session);
  const { data: routes = [] } = useRoutes();
  const { data: inventory = [] } = useInventoryItems();
  function handleExport(type) {
    if (type === "students") {
      const sessionStudents = students.filter((s) => s.sessionId === session);
      downloadCSV(
        sessionStudents.map((s) => ({
          "Adm No": s.admNo,
          Name: s.fullName,
          Class: getClassLabel(s.classLevel),
          Gender: s.gender,
          Category: s.category,
          "Father Name": s.fatherName,
          Mobile: s.fatherMobile,
          Status: s.isDiscontinued ? "Discontinued" : "Active"
        })),
        `student-report-${session}`
      );
    } else if (type === "finance" || type === "fees-due") {
      downloadCSV(
        feeRegister.filter((e) => !e.isDeleted).map((e) => ({
          "Receipt No": e.receiptNo,
          "Student ID": e.studentId,
          Name: e.studentName,
          Class: e.className,
          Date: formatDate(e.paymentDate),
          Months: e.months.join(", "),
          "Total Due": e.totalDue,
          "Amount Paid": e.totalAmount,
          Balance: e.balance,
          Mode: e.paymentMode,
          "Collected By": e.collectedBy
        })),
        `fees-report-${session}`
      );
    } else if (type === "hr") {
      downloadCSV(
        staff.map((s) => ({
          Code: s.staffCode,
          Name: s.fullName,
          Designation: s.designation,
          Department: s.department,
          Mobile: s.mobile,
          "Joining Date": formatDate(s.dateOfJoining),
          Salary: s.basicSalary,
          Status: s.isActive ? "Active" : "Inactive"
        })),
        "staff-report"
      );
    } else if (type === "transport") {
      downloadCSV(
        routes.map((r) => ({
          Route: r.name,
          "Bus No": r.busNumber,
          Driver: r.driverName,
          "Driver Mobile": r.driverMobile
        })),
        "transport-report"
      );
    } else if (type === "inventory") {
      downloadCSV(
        inventory.map((it) => ({
          Name: it.name,
          Category: it.category,
          Store: it.store,
          Unit: it.unit,
          Stock: it.currentStock,
          "Min Stock": it.minStock,
          "Purchase Price": it.purchasePrice,
          "Sale Price": it.salePrice
        })),
        "inventory-report"
      );
    } else {
      downloadCSV([{ note: "No data" }], `${type}-report`);
    }
  }
  const showClassFilter = selected === "students" || selected === "attendance";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "reports.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Comprehensive reports and analytics — all data is live from the system" })
      ] })
    ] }),
    !selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-4 gap-4",
        "data-ocid": "reports.selector.section",
        children: REPORT_TYPES.map((rt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelected(rt.id),
            className: "group flex flex-col items-start gap-3 p-5 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left",
            "data-ocid": `reports.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `p-2 rounded-lg bg-muted/40 group-hover:scale-110 transition-transform ${rt.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(rt.icon, { className: "h-6 w-6" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: rt.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: rt.description })
              ] })
            ]
          },
          rt.id
        ))
      }
    ),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "reports.view.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setSelected(null),
              "data-ocid": "reports.back.button",
              children: "← Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-foreground", children: [
            (_a = REPORT_TYPES.find((r) => r.id === selected)) == null ? void 0 : _a.label,
            " Report"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: session, onValueChange: setSession, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-28 h-8",
                "data-ocid": "reports.session.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] }),
          showClassFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classFilter, onValueChange: setClassFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-32 h-8",
                "data-ocid": "reports.class.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
              CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: getClassLabel(c) }, c))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => handleExport(selected),
              "data-ocid": "reports.export.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export CSV"
              ]
            }
          )
        ] })
      ] }),
      selected === "students" && /* @__PURE__ */ jsxRuntimeExports.jsx(StudentReport, { session, classFilter }),
      selected === "finance" && /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceReport, { session }),
      selected === "attendance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AttendanceReport, { session, classFilter }),
      selected === "academics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AcademicsReport, { session }),
      selected === "hr" && /* @__PURE__ */ jsxRuntimeExports.jsx(HRReport, {}),
      selected === "transport" && /* @__PURE__ */ jsxRuntimeExports.jsx(TransportReport, {}),
      selected === "inventory" && /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryReport, {}),
      selected === "fees-due" && /* @__PURE__ */ jsxRuntimeExports.jsx(FeesDueReport, { session })
    ] })
  ] });
}
export {
  ReportsPage as default
};
