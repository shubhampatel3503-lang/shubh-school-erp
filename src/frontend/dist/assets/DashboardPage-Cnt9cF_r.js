import { ae as createLucideIcon, d as useAppStore, aN as useDashboardKPIs, aO as useNotifications, aP as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, U as Users, aQ as Briefcase, aR as IndianRupee, a2 as TrendingUp, aS as ClipboardCheck, B as BookOpen, aT as Link, e as Button, a9 as motion, t as Badge, aU as useStudentSearch, I as Input, X, i as CLASS_LABELS, aw as ChevronRight, aV as useGetDailyFeeBreakdown, aW as useGetAttendanceBreakdown, a5 as useStudents, a8 as useSections, $ as Phone, aX as useGetStaffAttendanceBreakdown } from "./index-pMBTUEbj.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { L as Layers } from "./layers-Bs6dh7gP.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-Bzpux5qV.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8", key: "1w3rig" }],
  ["path", { d: "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1", key: "n2jgmb" }],
  ["path", { d: "M2 21h20", key: "1nyx9w" }],
  ["path", { d: "M7 8v3", key: "1qtyvj" }],
  ["path", { d: "M12 8v3", key: "hwp4zt" }],
  ["path", { d: "M17 8v3", key: "1i6e5u" }],
  ["path", { d: "M7 4h.01", key: "1bh4kh" }],
  ["path", { d: "M12 4h.01", key: "1ujb9j" }],
  ["path", { d: "M17 4h.01", key: "1upcoc" }]
];
const Cake = createLucideIcon("cake", __iconNode);
function formatINR(amount) {
  if (!Number.isFinite(amount)) return "₹0";
  const absAmt = Math.abs(Math.round(amount));
  const str = absAmt.toString();
  let result = "";
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, -3);
    result = `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
  }
  return (amount < 0 ? "-₹" : "₹") + result;
}
function FeesTodayModal({
  date,
  totalAmount,
  onClose
}) {
  const { data: rows = [], isLoading } = useGetDailyFeeBreakdown(date);
  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;
  const computedTotal = rows.reduce((sum, r) => sum + r.amountCollected, 0);
  const displayTotal = computedTotal > 0 ? computedTotal : totalAmount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center p-4",
      style: { zIndex: 9999 },
      "data-ocid": "fees_today_modal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/50",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose(),
            "aria-hidden": "true",
            role: "presentation"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold font-display text-foreground", children: "Fees Collected Today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                displayDate,
                " · Total:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-600", children: formatINR(displayTotal) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors",
                "aria-label": "Close",
                "data-ocid": "fees_today_modal.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto flex-1 p-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "Loading fee collections…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/80 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Student" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Collector" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Receipt" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 6,
                className: "text-center py-10 text-muted-foreground",
                "data-ocid": "fees_today_modal.empty_state",
                children: "No fee collections recorded today."
              }
            ) }) : rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "hover:bg-muted/30 transition-colors",
                "data-ocid": `fees_today_modal.row.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium", children: row.studentName || row.studentId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: row.className || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-emerald-600", children: formatINR(row.amountCollected) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: row.collectorName || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary", children: row.paymentMode }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-muted-foreground", children: row.receiptNo || "—" })
                ]
              },
              `${row.receiptNo}-${i}`
            )) }),
            rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "border-t-2 border-border bg-muted/50 sticky bottom-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  colSpan: 2,
                  className: "px-4 py-2.5 font-semibold text-sm",
                  children: [
                    "Total (",
                    rows.length,
                    " transaction",
                    rows.length !== 1 ? "s" : "",
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-emerald-600 font-bold", children: formatINR(displayTotal) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3 })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-2 p-4 border-t border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium",
              "data-ocid": "fees_today_modal.close_button",
              children: "Close"
            }
          ) })
        ] })
      ]
    }
  );
}
function AttendanceBreakdownModal({
  date,
  session,
  onClose,
  onDetails
}) {
  var _a;
  const { data, isLoading } = useGetAttendanceBreakdown(date, session);
  const { data: allStudents = [] } = useStudents();
  const { data: sections = [] } = useSections();
  const [drillRow, setDrillRow] = reactExports.useState(null);
  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;
  const drillSectionId = drillRow ? ((_a = sections.find(
    (sec) => sec.classLevel === drillRow.classLevel && sec.name === drillRow.sectionName
  )) == null ? void 0 : _a.id) ?? null : null;
  const drillStudents = drillRow ? allStudents.filter(
    (s) => s.classLevel === drillRow.classLevel && (!drillSectionId || s.sectionId === drillSectionId) && !s.isDiscontinued
  ) : [];
  if (drillRow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 flex items-center justify-center p-4",
        style: { zIndex: 9999 },
        "data-ocid": "attendance_drill.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50",
              onClick: () => setDrillRow(null),
              onKeyDown: (e) => e.key === "Escape" && setDrillRow(null),
              "aria-hidden": "true",
              role: "presentation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold font-display text-foreground", children: [
                  drillRow.classLabel,
                  " — Section ",
                  drillRow.sectionName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  displayDate,
                  " · Click student to call"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setDrillRow(null),
                  className: "size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors",
                  "aria-label": "Back to summary",
                  "data-ocid": "attendance_drill.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto flex-1 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/80 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Adm No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Father" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Mobile" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: drillStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 4,
                  className: "text-center py-8 text-muted-foreground text-sm",
                  children: "No students found."
                }
              ) }) : drillStudents.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/30 transition-colors",
                  "data-ocid": `attendance_drill.student.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground tabular-nums", children: s.admNo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium", children: s.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-sm", children: s.fatherName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: s.fatherMobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: `tel:${s.fatherMobile}`,
                        className: "inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors",
                        "data-ocid": `attendance_drill.call_button.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
                          s.fatherMobile
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
                  ]
                },
                s.id
              )) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end p-4 border-t border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setDrillRow(null),
                className: "px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium",
                "data-ocid": "attendance_drill.back_button",
                children: "Back to Summary"
              }
            ) })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center p-4",
      style: { zIndex: 9999 },
      "data-ocid": "attendance_modal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/50",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose(),
            "aria-hidden": "true",
            role: "presentation"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold font-display text-foreground", children: "Today's Attendance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                displayDate,
                " · Session ",
                session,
                " · Click a row to see students"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors",
                "aria-label": "Close",
                "data-ocid": "attendance_modal.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto flex-1 p-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "Loading attendance data…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/80 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Class" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Present" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Absent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "%" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: ((data == null ? void 0 : data.rows) ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 6,
                className: "text-center py-10 text-muted-foreground",
                "data-ocid": "attendance_modal.empty_state",
                children: "No attendance data for today."
              }
            ) }) : ((data == null ? void 0 : data.rows) ?? []).map((row, i) => {
              const pct = row.percent;
              const pctColor = pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "hover:bg-muted/30 transition-colors cursor-pointer",
                  tabIndex: 0,
                  onClick: () => setDrillRow({
                    classLevel: row.classLevel,
                    classLabel: row.classLabel,
                    sectionName: row.sectionName
                  }),
                  onKeyDown: (e) => e.key === "Enter" && setDrillRow({
                    classLevel: row.classLevel,
                    classLabel: row.classLabel,
                    sectionName: row.sectionName
                  }),
                  "data-ocid": `attendance_modal.row.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium", children: row.classLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: row.sectionName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-emerald-600 font-medium", children: row.present }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-red-500 font-medium", children: row.absent }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: row.total }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        className: `px-4 py-2.5 text-right font-semibold ${pctColor}`,
                        children: [
                          pct.toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ]
                },
                `${row.classLevel}-${row.sectionName}`
              );
            }) }),
            ((data == null ? void 0 : data.rows) ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "border-t-2 border-border bg-muted/50 sticky bottom-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 2,
                  className: "px-4 py-2.5 font-semibold text-sm",
                  children: "Total"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-emerald-600 font-bold", children: data == null ? void 0 : data.totalPresent }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-red-500 font-bold", children: data == null ? void 0 : data.totalAbsent }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-bold", children: data == null ? void 0 : data.totalStudents }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  className: `px-4 py-2.5 text-right font-bold ${((data == null ? void 0 : data.overallPercent) ?? 0) >= 75 ? "text-emerald-600" : ((data == null ? void 0 : data.overallPercent) ?? 0) >= 50 ? "text-amber-600" : "text-red-500"}`,
                  children: [
                    ((data == null ? void 0 : data.overallPercent) ?? 0).toFixed(1),
                    "%"
                  ]
                }
              )
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 p-4 border-t border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/40 transition-colors",
                "data-ocid": "attendance_modal.cancel_button",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onDetails,
                className: "px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium",
                "data-ocid": "attendance_modal.details_button",
                children: "Details"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function StaffAttendanceModal({
  date,
  onClose,
  onDetails
}) {
  const { data, isLoading } = useGetStaffAttendanceBreakdown(date);
  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center p-4",
      style: { zIndex: 9999 },
      "data-ocid": "staff_modal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/50",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose(),
            "aria-hidden": "true",
            role: "presentation"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold font-display text-foreground", children: "Staff Attendance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                displayDate,
                " · ",
                (data == null ? void 0 : data.presentCount) ?? 0,
                "/",
                (data == null ? void 0 : data.totalCount) ?? 0,
                " Present"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors",
                "aria-label": "Close",
                "data-ocid": "staff_modal.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto flex-1 p-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/80 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground", children: "Call" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: ((data == null ? void 0 : data.rows) ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 4,
                className: "text-center py-10 text-muted-foreground",
                "data-ocid": "staff_modal.empty_state",
                children: "No staff attendance data for today."
              }
            ) }) : ((data == null ? void 0 : data.rows) ?? []).map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "hover:bg-muted/30 transition-colors",
                "data-ocid": `staff_modal.row.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium", children: row.staffName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${row.status === "Present" ? "bg-emerald-100 text-emerald-700" : row.status === "Late" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`,
                      children: [
                        row.status === "Present" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
                        row.status
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: row.inTime ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: row.outTime ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: row.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: `tel:${row.mobile}`,
                      className: "inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors",
                      "data-ocid": `staff_modal.call_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
                        row.mobile
                      ]
                    }
                  ) : null })
                ]
              },
              row.staffId
            )) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 p-4 border-t border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/40 transition-colors",
                "data-ocid": "staff_modal.cancel_button",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onDetails,
                className: "px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium",
                "data-ocid": "staff_modal.details_button",
                children: "Details"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function StudentSearchBar() {
  const [query, setQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const results = useStudentSearch(debouncedQuery);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);
  reactExports.useEffect(() => {
    setOpen(debouncedQuery.length > 0);
  }, [debouncedQuery]);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  function clearSearch() {
    setQuery("");
    setDebouncedQuery("");
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative w-full max-w-2xl",
      "data-ocid": "dashboard.search_bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 size-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search students by name, mobile, village, father or mother name…",
              className: "pl-9 pr-9 h-11 text-sm bg-card border-border shadow-sm",
              "data-ocid": "dashboard.student_search.input",
              onFocus: () => debouncedQuery.length > 0 && setOpen(true)
            }
          ),
          query.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearSearch,
              className: "absolute right-3 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Clear search",
              "data-ocid": "dashboard.student_search.clear_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-full mt-1.5 w-full z-dropdown bg-card border border-border rounded-xl shadow-lg overflow-hidden",
            "data-ocid": "dashboard.student_search.popover",
            children: results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 py-6 text-center text-sm text-muted-foreground",
                "data-ocid": "dashboard.student_search.empty_state",
                children: [
                  'No students found for "',
                  debouncedQuery,
                  '"'
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-80 overflow-y-auto", children: results.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/students",
                onClick: () => setOpen(false),
                "data-ocid": `dashboard.student_search.item.${i + 1}`,
                className: "flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary", children: s.fullName.charAt(0) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: s.fullName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                        "#",
                        s.admNo,
                        " · ",
                        CLASS_LABELS[s.classLevel],
                        " · Father:",
                        " ",
                        s.fatherName
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" })
                ]
              },
              s.id
            )) })
          }
        )
      ]
    }
  );
}
function SessionSelector() {
  const { currentSession, sessions, setSession } = useAppStore();
  const sortedSessions = [...sessions].sort(
    (a, b) => b.startYear - a.startYear
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2",
      "data-ocid": "dashboard.session_selector",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground hidden sm:block", children: "Session:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: currentSession, onValueChange: setSession, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-9 w-[140px] text-sm border-primary/40 bg-primary/5 text-primary font-semibold focus:ring-primary/30",
              "data-ocid": "dashboard.session_selector.select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[200]", children: sortedSessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            s.name === currentSession ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-primary shrink-0" }) : s.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-emerald-500 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-muted-foreground/30 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: s.name === currentSession ? "font-semibold text-primary" : "",
                children: s.name
              }
            ),
            s.isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "(Archived)" })
          ] }) }, s.id)) })
        ] })
      ]
    }
  );
}
function DashboardPage() {
  const { currentSession } = useAppStore();
  const { data: kpis, isLoading } = useDashboardKPIs(currentSession);
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();
  const [showAttModal, setShowAttModal] = reactExports.useState(false);
  const [showStaffModal, setShowStaffModal] = reactExports.useState(false);
  const [showFeesTodayModal, setShowFeesTodayModal] = reactExports.useState(false);
  const todayISO = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const v2 = (kpis == null ? void 0 : kpis.v2) ?? null;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "dashboard.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-lg" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-lg" })
    ] });
  }
  const pendingAmt = (v2 == null ? void 0 : v2.pendingFeesTotal) ?? (kpis == null ? void 0 : kpis.pendingFees) ?? 0;
  const attendancePct = (v2 == null ? void 0 : v2.attendanceTodayPercent) ?? (kpis == null ? void 0 : kpis.attendancePercent) ?? null;
  const attPresent = (v2 == null ? void 0 : v2.attendanceTodayPresent) ?? null;
  const attTotal = (v2 == null ? void 0 : v2.attendanceTodayTotal) ?? null;
  const attDisplayValue = attPresent != null && attTotal != null && attTotal > 0 ? `${attPresent} / ${attTotal}` : attendancePct != null ? `${attendancePct.toFixed(1)}%` : "—";
  const staffPresent = (v2 == null ? void 0 : v2.staffAttendanceTodayPresent) ?? null;
  const staffTotal = (v2 == null ? void 0 : v2.staffAttendanceTodayTotal) ?? null;
  const staffTotalCount = (v2 == null ? void 0 : v2.totalStaff) ?? (kpis == null ? void 0 : kpis.totalStaff) ?? 0;
  const staffDisplayValue = staffPresent != null && staffTotal != null && staffTotal > 0 ? `${staffPresent} / ${staffTotal}` : staffTotalCount.toLocaleString("en-IN");
  const kpiCards = [
    {
      title: "Total Students",
      value: ((v2 == null ? void 0 : v2.totalStudents) ?? (kpis == null ? void 0 : kpis.totalStudents) ?? 0).toLocaleString(
        "en-IN"
      ),
      sub: v2 ? `${v2.totalClasses} classes · ${v2.totalSections} sections` : void 0,
      icon: Users,
      ocid: "dashboard.students_kpi",
      highlight: false
    },
    {
      title: "Staff Attendance",
      value: staffDisplayValue,
      sub: staffPresent != null ? "Present / Total · Click for details" : "Click to see attendance",
      icon: Briefcase,
      ocid: "dashboard.staff_kpi",
      highlight: false,
      clickable: "staff"
    },
    {
      title: "Fees Collected Today",
      value: formatINR((v2 == null ? void 0 : v2.feesCollectedToday) ?? (kpis == null ? void 0 : kpis.feesCollectedToday) ?? 0),
      sub: `This month: ${formatINR((v2 == null ? void 0 : v2.feesCollectedThisMonth) ?? (kpis == null ? void 0 : kpis.feesCollectedMonth) ?? 0)}`,
      icon: IndianRupee,
      ocid: "dashboard.fees_today_kpi",
      highlight: false,
      clickable: "feesToday"
    },
    {
      title: "Fees This Year",
      value: formatINR((v2 == null ? void 0 : v2.feesCollectedThisYear) ?? 0),
      sub: `Session ${currentSession}`,
      icon: TrendingUp,
      ocid: "dashboard.fees_year_kpi",
      highlight: false
    },
    {
      title: "Pending Fees",
      value: formatINR(pendingAmt),
      sub: pendingAmt > 0 ? "Outstanding dues" : "No pending dues",
      icon: CircleAlert,
      ocid: "dashboard.pending_fees_kpi",
      highlight: pendingAmt > 0
    },
    {
      title: "Today's Attendance",
      value: attDisplayValue,
      sub: attPresent != null ? "Present / Total · Click for breakdown" : attendancePct != null ? "Click to see breakdown" : "No data yet today",
      icon: ClipboardCheck,
      ocid: "dashboard.attendance_kpi",
      highlight: false,
      clickable: "attendance"
    },
    {
      title: "Classes",
      value: ((v2 == null ? void 0 : v2.totalClasses) ?? 0).toLocaleString("en-IN"),
      sub: `${(v2 == null ? void 0 : v2.totalSections) ?? 0} sections total`,
      icon: BookOpen,
      ocid: "dashboard.classes_kpi",
      highlight: false
    },
    {
      title: "Sessions",
      value: currentSession,
      sub: "Active academic session",
      icon: Layers,
      ocid: "dashboard.session_kpi",
      highlight: false
    }
  ];
  const recentActivity = ((v2 == null ? void 0 : v2.recentActivity) ?? []).slice(0, 10);
  function formatActivityTime(ts) {
    const ms = Number(ts) / 1e6;
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const HH = String(d.getHours()).padStart(2, "0");
    const MM = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  }
  const activityBadgeColor = {
    Payment: "border-green-500 text-green-600 bg-green-50",
    Student: "border-blue-500 text-blue-600 bg-blue-50",
    Attendance: "border-yellow-500 text-yellow-700 bg-yellow-50",
    Staff: "border-purple-500 text-purple-600 bg-purple-50",
    Fee: "border-orange-500 text-orange-600 bg-orange-50",
    Exam: "border-pink-500 text-pink-600 bg-pink-50",
    Transport: "border-cyan-500 text-cyan-600 bg-cyan-50"
  };
  function getBadgeColor(actionType) {
    for (const [key, cls] of Object.entries(activityBadgeColor)) {
      if (actionType.toLowerCase().includes(key.toLowerCase())) return cls;
    }
    return "border-border text-muted-foreground bg-muted/40";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 sm:p-6 space-y-6 animate-fade-in",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              "Data for session",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: currentSession })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SessionSelector, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/students", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", "data-ocid": "dashboard.add_student_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              "Add Student"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.search_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StudentSearchBar, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: kpiCards.map((card, i) => {
          const Icon = card.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.06 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  className: `card-metric ${card.highlight ? "border-orange-400 bg-orange-50/60 dark:bg-orange-950/20" : ""} ${card.clickable ? "cursor-pointer hover:shadow-md hover:border-primary/40 transition-all" : ""}`,
                  "data-ocid": card.ocid,
                  onClick: card.clickable === "attendance" ? () => setShowAttModal(true) : card.clickable === "staff" ? () => setShowStaffModal(true) : card.clickable === "feesToday" ? () => setShowFeesTodayModal(true) : void 0,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: card.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: `text-xl font-bold font-display mt-1 truncate ${card.highlight ? "text-orange-600" : "text-foreground"}`,
                          children: card.value
                        }
                      ),
                      card.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 truncate", children: card.sub })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `size-9 rounded-lg flex items-center justify-center shrink-0 ${card.highlight ? "bg-orange-100 dark:bg-orange-900/40" : "bg-primary/10"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Icon,
                          {
                            className: `size-4 ${card.highlight ? "text-orange-500" : "text-primary"}`
                          }
                        )
                      }
                    )
                  ] }) })
                }
              )
            },
            card.ocid
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "lg:col-span-2 border border-border",
              "data-ocid": "dashboard.fee_chart",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-4 text-accent" }),
                  "Fee Collection — Monthly"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  BarChart,
                  {
                    data: (kpis == null ? void 0 : kpis.monthlyFeeChart) ?? [],
                    margin: { top: 4, right: 4, bottom: 0, left: 0 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CartesianGrid,
                        {
                          strokeDasharray: "3 3",
                          stroke: "oklch(var(--border))"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        XAxis,
                        {
                          dataKey: "month",
                          tick: { fontSize: 11 },
                          tickLine: false,
                          axisLine: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        YAxis,
                        {
                          tick: { fontSize: 11 },
                          tickLine: false,
                          axisLine: false,
                          tickFormatter: (v) => `₹${(v / 1e3).toFixed(0)}K`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tooltip,
                        {
                          formatter: (value) => [formatINR(value), "Fees"],
                          contentStyle: {
                            backgroundColor: "oklch(var(--card))",
                            border: "1px solid oklch(var(--border))",
                            borderRadius: "8px",
                            fontSize: 12
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Bar,
                        {
                          dataKey: "amount",
                          fill: "oklch(var(--accent))",
                          radius: [4, 4, 0, 0]
                        }
                      )
                    ]
                  }
                ) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border border-border",
                "data-ocid": "dashboard.birthdays_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Cake, { className: "size-4 text-accent" }),
                    "Today's Birthdays"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: ((kpis == null ? void 0 : kpis.todayBirthdays) ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No birthdays today." }) : ((kpis == null ? void 0 : kpis.todayBirthdays) ?? []).map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 py-1.5 border-b border-border last:border-0",
                      "data-ocid": `dashboard.birthday.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent", children: "🎂" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: b.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            b.classLabel,
                            " · #",
                            b.admNo
                          ] })
                        ] })
                      ]
                    },
                    b.admNo
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border border-border",
                "data-ocid": "dashboard.notifications_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 text-primary" }),
                    "Recent Alerts"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: (notifications ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-muted-foreground",
                      "data-ocid": "dashboard.notifications.empty_state",
                      children: "No announcements yet."
                    }
                  ) : (notifications ?? []).slice(0, 3).map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-2 py-1.5 border-b border-border last:border-0",
                      "data-ocid": `dashboard.notification.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: `text-[10px] shrink-0 mt-0.5 ${!n.isRead ? "border-accent text-accent" : ""}`,
                            children: n.type
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: n.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2", children: n.message })
                        ] })
                      ]
                    },
                    n.id
                  )) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
            "data-ocid": "dashboard.quick_actions",
            children: [
              { label: "Collect Fee", href: "/fees", icon: IndianRupee },
              {
                label: "Mark Attendance",
                href: "/attendance",
                icon: ClipboardCheck
              },
              { label: "Add Student", href: "/students", icon: Users },
              { label: "View Reports", href: "/reports", icon: TrendingUp }
            ].map((action, i) => {
              const Icon = action.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: action.href, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full h-auto py-4 flex flex-col gap-2 font-medium",
                  "data-ocid": `dashboard.quick_action.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: action.label })
                  ]
                }
              ) }, action.label);
            })
          }
        ),
        showFeesTodayModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FeesTodayModal,
          {
            date: todayISO,
            totalAmount: (v2 == null ? void 0 : v2.feesCollectedToday) ?? (kpis == null ? void 0 : kpis.feesCollectedToday) ?? 0,
            onClose: () => setShowFeesTodayModal(false)
          }
        ),
        showAttModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AttendanceBreakdownModal,
          {
            date: todayISO,
            session: currentSession,
            onClose: () => setShowAttModal(false),
            onDetails: () => {
              setShowAttModal(false);
              navigate({ to: "/attendance-report" });
            }
          }
        ),
        showStaffModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          StaffAttendanceModal,
          {
            date: todayISO,
            onClose: () => setShowStaffModal(false),
            onDetails: () => {
              setShowStaffModal(false);
              navigate({ to: "/staff-attendance-report" });
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border border-border",
                "data-ocid": "dashboard.recent_activity",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-primary" }),
                    "Recent Activity",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "ml-auto text-xs font-normal",
                        children: "Last 10 actions"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: recentActivity.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center justify-center py-8 text-center",
                      "data-ocid": "dashboard.recent_activity.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-8 text-muted-foreground/40 mb-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recent activity" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Actions like fee payments, student additions, and attendance marks will appear here." })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute left-[11px] top-2 bottom-2 w-px bg-border",
                        "aria-hidden": true
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "space-y-4",
                        "data-ocid": "dashboard.recent_activity.list",
                        children: recentActivity.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "relative flex items-start gap-4 pl-8",
                            "data-ocid": `dashboard.recent_activity.item.${i + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-1.5 size-[10px] rounded-full bg-primary/60 border-2 border-background ring-1 ring-primary/30" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    Badge,
                                    {
                                      variant: "outline",
                                      className: `text-[10px] px-1.5 py-0 shrink-0 ${getBadgeColor(entry.actionType)}`,
                                      children: entry.actionType
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: formatActivityTime(entry.timestamp) }),
                                  entry.userName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                                    "· ",
                                    entry.userName
                                  ] })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-0.5 leading-snug", children: entry.description })
                              ] })
                            ]
                          },
                          `${Number(entry.timestamp)}-${i}`
                        ))
                      }
                    )
                  ] }) })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  DashboardPage as default
};
