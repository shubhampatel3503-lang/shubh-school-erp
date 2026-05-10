import { ae as createLucideIcon, r as reactExports, d as useAppStore, F as ue, j as jsxRuntimeExports, t as Badge, dO as CheckCheck, e as Button, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input, S as Skeleton, k as DialogFooter, G as GraduationCap, U as Users } from "./index-pMBTUEbj.js";
import { b as useUpdateClassTimetable, c as useCopyPasteTimetableCells, d as computeEndTime, g as getPeriodStatus, e as buildDefaultPeriodConfigs, f as useSchoolWideTimetable, h as useClassLinks, i as getCurrentPeriodNumber, j as useSaveClassLinks, k as useClassTimetables, T as TeacherTimetablePanel } from "./TeacherTimetablePanel-BpDGoV8b.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { C as Copy } from "./copy-BDQ1kkni.js";
import { P as PenLine } from "./pen-line-D9tc1r2P.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { C as Camera } from "./camera-owTlFa42.js";
import { L as Link2 } from "./link-2-CVZXb_90.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Separator } from "./separator-jz692S3i.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { L as LayoutGrid } from "./layout-grid-D7TV9swL.js";
import { S as Settings2 } from "./settings-2-CEQY6662.js";
import "./user-C6bo2V5_.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
];
const Clipboard = createLucideIcon("clipboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("radio", __iconNode);
const DAYS$1 = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function ClassTimetableGrid({
  timetable,
  onTimetableChange,
  copiedCell,
  onCopy,
  readOnly = false
}) {
  const updateTimetable = useUpdateClassTimetable();
  const copyPaste = useCopyPasteTimetableCells();
  const [editCell, setEditCell] = reactExports.useState(null);
  const [pasteTarget, setPasteTarget] = reactExports.useState(null);
  const [_currentPeriod, setCurrentPeriod] = reactExports.useState(null);
  const [_tick, setTick] = reactExports.useState(0);
  const gridRef = reactExports.useRef(null);
  const printAreaRef = reactExports.useRef(null);
  const activeSession = useAppStore((s) => s.currentSession);
  const [focusedCell, setFocusedCell] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const refresh = () => {
      setTick((t) => t + 1);
    };
    refresh();
    const id = setInterval(refresh, 6e4);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    if (!timetable.periodConfigs.length) {
      setCurrentPeriod(null);
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    let found = null;
    for (const cfg of timetable.periodConfigs) {
      if (cfg.isInterval) continue;
      const [h, m] = cfg.startTime.split(":").map(Number);
      const start = h * 60 + m;
      const end = start + cfg.durationMinutes;
      if (mins >= start && mins < end) {
        found = cfg.periodNumber;
        break;
      }
    }
    setCurrentPeriod(found);
  }, [timetable.periodConfigs]);
  const getEntry = reactExports.useCallback(
    (day, period) => timetable.entries.find(
      (e) => e.dayOfWeek === day && e.periodNumber === period
    ),
    [timetable.entries]
  );
  const getPeriodCfg = reactExports.useCallback(
    (period) => timetable.periodConfigs.find((p) => p.periodNumber === period),
    [timetable.periodConfigs]
  );
  const cellStatus = (period) => timetable.periodConfigs.length ? getPeriodStatus(period, timetable.periodConfigs) : "upcoming";
  const handleCopyCell = reactExports.useCallback(
    (day, period) => {
      const entry = getEntry(day, period);
      if (!entry) {
        ue.info("Cell is empty — nothing to copy.");
        return;
      }
      onCopy({
        timetableId: timetable.id,
        dayOfWeek: day,
        periodNumber: period,
        subjectName: entry.subjectName,
        teacherName: entry.teacherName,
        teacherStaffId: entry.teacherStaffId,
        classLevel: entry.classLevel,
        sectionName: entry.sectionName
      });
      ue.success(`Copied: ${entry.subjectName} (${entry.teacherName})`);
    },
    [timetable, onCopy, getEntry]
  );
  const handlePaste = reactExports.useCallback(
    async (day, period) => {
      if (!copiedCell) return;
      const cfg = getPeriodCfg(period);
      const ops = [
        {
          source: {
            classId: copiedCell.timetableId,
            dayOfWeek: copiedCell.dayOfWeek,
            periodNumber: BigInt(copiedCell.periodNumber)
          },
          target: {
            classId: timetable.id,
            dayOfWeek: day,
            periodNumber: BigInt(period)
          }
        }
      ];
      try {
        await copyPaste.mutateAsync(ops);
        const newEntry = {
          ...copiedCell,
          dayOfWeek: day,
          periodNumber: period,
          startTime: (cfg == null ? void 0 : cfg.startTime) ?? "",
          endTime: cfg ? computeEndTime(cfg.startTime, cfg.durationMinutes) : ""
        };
        const filtered = timetable.entries.filter(
          (e) => !(e.dayOfWeek === day && e.periodNumber === period)
        );
        onTimetableChange == null ? void 0 : onTimetableChange({
          ...timetable,
          entries: [...filtered, newEntry]
        });
        ue.success(`Pasted: ${copiedCell.subjectName} → ${day} P${period}`);
        setPasteTarget(null);
      } catch {
        ue.error("Failed to paste. Please try again.");
      }
    },
    [copiedCell, timetable, copyPaste, onTimetableChange, getPeriodCfg]
  );
  reactExports.useEffect(() => {
    const handle = (e) => {
      if (readOnly) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && focusedCell) {
        e.preventDefault();
        handleCopyCell(focusedCell.day, focusedCell.period);
      }
      const pasteDestination = pasteTarget ?? focusedCell;
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && copiedCell && pasteDestination) {
        e.preventDefault();
        handlePaste(pasteDestination.day, pasteDestination.period);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [
    copiedCell,
    pasteTarget,
    focusedCell,
    readOnly,
    handleCopyCell,
    handlePaste
  ]);
  const handleEditSave = async () => {
    var _a, _b;
    if (!editCell) return;
    const cfg = getPeriodCfg(editCell.periodNumber);
    const newEntry = {
      periodNumber: editCell.periodNumber,
      dayOfWeek: editCell.dayOfWeek,
      classLevel: ((_a = timetable.entries[0]) == null ? void 0 : _a.classLevel) ?? "",
      sectionName: ((_b = timetable.entries[0]) == null ? void 0 : _b.sectionName) ?? "",
      subjectName: editCell.subjectName,
      teacherName: editCell.teacherName,
      teacherStaffId: editCell.teacherStaffId,
      startTime: (cfg == null ? void 0 : cfg.startTime) ?? editCell.startTime,
      endTime: cfg ? computeEndTime(cfg.startTime, cfg.durationMinutes) : editCell.endTime
    };
    const updated = {
      ...timetable,
      entries: [
        ...timetable.entries.filter(
          (e) => !(e.dayOfWeek === editCell.dayOfWeek && e.periodNumber === editCell.periodNumber)
        ),
        newEntry
      ]
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated
      });
      onTimetableChange == null ? void 0 : onTimetableChange(updated);
      setEditCell(null);
      ue.success("Cell updated.");
    } catch {
      ue.error("Failed to save cell.");
    }
  };
  const handleClearCell = async (day, period) => {
    const updated = {
      ...timetable,
      entries: timetable.entries.filter(
        (e) => !(e.dayOfWeek === day && e.periodNumber === period)
      )
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated
      });
      onTimetableChange == null ? void 0 : onTimetableChange(updated);
      ue.success("Cell cleared.");
    } catch {
      ue.error("Failed to clear cell.");
    }
  };
  const classLabel = (() => {
    const first = timetable.entries[0];
    if (!first) return timetable.name || "";
    const CLASS_LABELS2 = {
      PlayWay: "Play Way",
      LKG: "LKG",
      UKG: "UKG",
      Class1: "Class 1",
      Class2: "Class 2",
      Class3: "Class 3",
      Class4: "Class 4",
      Class5: "Class 5",
      Class6: "Class 6",
      Class7: "Class 7",
      Class8: "Class 8",
      Class9: "Class 9",
      Class10: "Class 10",
      Class11: "Class 11",
      Class12: "Class 12"
    };
    const cl = CLASS_LABELS2[first.classLevel] ?? first.classLevel;
    return `${cl}${first.sectionName ? ` — Section ${first.sectionName}` : ""}`;
  })();
  const handlePrint = () => {
    window.print();
  };
  const periods = timetable.periodConfigs.length ? timetable.periodConfigs : Array.from(
    { length: 8 },
    (_, i) => ({
      periodNumber: i + 1,
      startTime: "",
      durationMinutes: 45,
      isInterval: false
    })
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", ref: gridRef, children: [
    !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: copiedCell ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "flex items-center gap-1.5 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3 w-3" }),
            "Copied: ",
            copiedCell.subjectName,
            " (",
            copiedCell.teacherName,
            ")",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "— Ctrl+V or click cell to paste" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Right-click or hover a cell to copy • Ctrl+V to paste" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          onClick: handlePrint,
          "data-ocid": "timetable.class.print_button",
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5" }),
            "Print"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full border-collapse text-sm select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 z-10 bg-card border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-28", children: "Period" }),
        DAYS$1.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "border border-border px-3 py-2 text-center text-xs font-semibold text-foreground min-w-[130px]",
            children: d
          },
          d
        ))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: periods.map((cfg) => {
        if (cfg.isInterval) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 z-10 bg-muted/40 border border-border px-3 py-1 text-xs text-muted-foreground font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🍽" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cfg.label ?? "Break" }),
              cfg.startTime && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: cfg.startTime })
            ] }) }),
            DAYS$1.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "bg-muted/20 border border-border text-center text-xs text-muted-foreground",
                children: "—"
              },
              d
            ))
          ] }, `interval-${cfg.periodNumber}`);
        }
        const status = cellStatus(cfg.periodNumber);
        const rowBg = status === "current" ? "bg-green-50 dark:bg-green-950/30" : status === "past" ? "bg-muted/30" : "";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: rowBg, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: `sticky left-0 z-10 border border-border px-3 py-2 min-w-[7rem] ${status === "current" ? "bg-green-100 dark:bg-green-900/40" : status === "past" ? "bg-muted/50" : "bg-card"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-xs font-bold ${status === "current" ? "text-green-700 dark:text-green-400" : status === "past" ? "text-muted-foreground" : "text-foreground"}`,
                      children: [
                        "P",
                        cfg.periodNumber
                      ]
                    }
                  ),
                  status === "current" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1 py-0 bg-green-500 text-white border-0", children: "LIVE" })
                ] }),
                cfg.startTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  cfg.startTime,
                  "–",
                  computeEndTime(cfg.startTime, cfg.durationMinutes)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  cfg.durationMinutes,
                  "m"
                ] })
              ] })
            }
          ),
          DAYS$1.map((day) => {
            const entry = getEntry(day, cfg.periodNumber);
            const isPasteTarget = (pasteTarget == null ? void 0 : pasteTarget.day) === day && (pasteTarget == null ? void 0 : pasteTarget.period) === cfg.periodNumber;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ")
                    e.currentTarget.click();
                },
                "data-ocid": `timetable.cell.${day.toLowerCase()}.${cfg.periodNumber}`,
                tabIndex: 0,
                onFocus: () => setFocusedCell({ day, period: cfg.periodNumber }),
                onBlur: () => setFocusedCell(null),
                className: `border border-border px-2 py-1.5 align-top cursor-pointer group relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${(focusedCell == null ? void 0 : focusedCell.day) === day && (focusedCell == null ? void 0 : focusedCell.period) === cfg.periodNumber ? "ring-2 ring-primary/60" : isPasteTarget ? "ring-2 ring-primary ring-offset-1" : copiedCell ? "hover:bg-primary/5" : "hover:bg-accent/30"}`,
                onMouseEnter: () => {
                  if (copiedCell)
                    setPasteTarget({ day, period: cfg.periodNumber });
                },
                onMouseLeave: () => {
                  if (copiedCell) setPasteTarget(null);
                },
                onClick: () => {
                  if (readOnly) return;
                  if (copiedCell) {
                    handlePaste(day, cfg.periodNumber);
                  } else if (entry) {
                    setEditCell({
                      dayOfWeek: day,
                      periodNumber: cfg.periodNumber,
                      subjectName: entry.subjectName,
                      teacherName: entry.teacherName,
                      teacherStaffId: entry.teacherStaffId,
                      startTime: entry.startTime,
                      endTime: entry.endTime
                    });
                  }
                },
                onContextMenu: (e) => {
                  if (readOnly) return;
                  e.preventDefault();
                  handleCopyCell(day, cfg.periodNumber);
                },
                children: [
                  entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-xs text-foreground leading-tight truncate", children: entry.subjectName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: entry.teacherName })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/40 italic", children: copiedCell ? "Paste here" : "Empty" }),
                  !readOnly && !copiedCell && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1 right-1 hidden group-hover:flex gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "Copy cell",
                        className: "p-0.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleCopyCell(day, cfg.periodNumber);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" })
                      }
                    ),
                    entry && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": "Edit cell",
                          className: "p-0.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary",
                          onClick: (e) => {
                            e.stopPropagation();
                            setEditCell({
                              dayOfWeek: day,
                              periodNumber: cfg.periodNumber,
                              subjectName: entry.subjectName,
                              teacherName: entry.teacherName,
                              teacherStaffId: entry.teacherStaffId,
                              startTime: entry.startTime,
                              endTime: entry.endTime
                            });
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3 w-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": "Clear cell",
                          className: "p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive",
                          onClick: (e) => {
                            e.stopPropagation();
                            handleClearCell(day, cfg.periodNumber);
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  ] })
                ]
              },
              day
            );
          })
        ] }, cfg.periodNumber);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: printAreaRef,
        className: "timetable-print-area sr-only",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-letterhead", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-school-name", children: "SHUBH SCHOOL ERP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-report-title", children: [
              "CLASS TIMETABLE — ",
              classLabel
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-session-badge", children: [
              "Session: ",
              activeSession,
              "  |  Printed:",
              " ",
              (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "print-timetable-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "row-header", children: "Period / Day" }),
              DAYS$1.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: d }, d))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: periods.map((cfg) => {
              if (cfg.isInterval) {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "period-cell", children: [
                    cfg.label ?? "Break",
                    cfg.startTime ? ` — ${cfg.startTime}` : ""
                  ] }),
                  DAYS$1.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "interval-cell", children: "—" }, d))
                ] }, `interval-${cfg.periodNumber}`);
              }
              const status = cellStatus(cfg.periodNumber);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: status === "current" ? "current-period" : "",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "period-cell", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        "P",
                        cfg.periodNumber
                      ] }),
                      cfg.startTime && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontWeight: 400,
                            fontSize: "7pt",
                            color: "#555"
                          },
                          children: [
                            cfg.startTime,
                            "–",
                            computeEndTime(cfg.startTime, cfg.durationMinutes)
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            fontWeight: 400,
                            fontSize: "6.5pt",
                            color: "#777"
                          },
                          children: [
                            cfg.durationMinutes,
                            "m"
                          ]
                        }
                      )
                    ] }),
                    DAYS$1.map((day) => {
                      const entry = getEntry(day, cfg.periodNumber);
                      return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-cell-subject", children: entry.subjectName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-cell-teacher", children: entry.teacherName })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-cell-empty", children: "—" }) }, day);
                    })
                  ]
                },
                cfg.periodNumber
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-footer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-summary-info", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "Total Periods: ",
                periods.filter((p) => !p.isInterval).length,
                " per day"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Days: Monday – Saturday" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-label", children: "Principal Signature" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-label", children: [
                "Date:",
                " ",
                (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })
              ] })
            ] })
          ] })
        ]
      }
    ),
    editCell && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && setEditCell(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { style: { zIndex: 9999 }, className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Edit — ",
        editCell.dayOfWeek,
        " Period ",
        editCell.periodNumber
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subjectName", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "subjectName",
              value: editCell.subjectName,
              onChange: (e) => setEditCell({ ...editCell, subjectName: e.target.value }),
              "data-ocid": "timetable.edit_subject_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacherName", children: "Teacher Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "teacherName",
              value: editCell.teacherName,
              onChange: (e) => setEditCell({ ...editCell, teacherName: e.target.value }),
              "data-ocid": "timetable.edit_teacher_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "teacherStaffId", children: "Teacher Staff ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "teacherStaffId",
              value: editCell.teacherStaffId,
              onChange: (e) => setEditCell({ ...editCell, teacherStaffId: e.target.value }),
              "data-ocid": "timetable.edit_staffid_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleEditSave,
              disabled: updateTimetable.isPending,
              "data-ocid": "timetable.edit_save_button",
              children: "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setEditCell(null),
              "data-ocid": "timetable.edit_cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function PeriodConfigPanel({ timetable, onTimetableChange }) {
  const updateTimetable = useUpdateClassTimetable();
  const [configs, setConfigs] = reactExports.useState(
    () => timetable.periodConfigs.length ? [...timetable.periodConfigs] : buildDefaultPeriodConfigs(8, "08:00", 45)
  );
  const [dirty, setDirty] = reactExports.useState(false);
  const update = (idx, patch) => {
    setConfigs(
      (prev) => prev.map((c, i) => i === idx ? { ...c, ...patch } : c)
    );
    setDirty(true);
  };
  const addPeriod = () => {
    const last = configs[configs.length - 1];
    const lastStart = (last == null ? void 0 : last.startTime) ?? "08:00";
    const lastDur = (last == null ? void 0 : last.durationMinutes) ?? 45;
    const [h, m] = lastStart.split(":").map(Number);
    const nextMins = h * 60 + m + lastDur;
    const nh = Math.floor(nextMins / 60);
    const nm = nextMins % 60;
    const nextNum = Math.max(...configs.map((c) => c.periodNumber), 0) + 1;
    setConfigs((prev) => [
      ...prev,
      {
        periodNumber: nextNum,
        startTime: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`,
        durationMinutes: 45,
        isInterval: false
      }
    ]);
    setDirty(true);
  };
  const addInterval = () => {
    const last = configs[configs.length - 1];
    const lastStart = (last == null ? void 0 : last.startTime) ?? "10:30";
    const lastDur = (last == null ? void 0 : last.durationMinutes) ?? 45;
    const [h, m] = lastStart.split(":").map(Number);
    const nextMins = h * 60 + m + lastDur;
    const nh = Math.floor(nextMins / 60);
    const nm = nextMins % 60;
    const existing = configs.filter((c) => c.isInterval).length + 1;
    setConfigs((prev) => [
      ...prev,
      {
        periodNumber: -existing,
        // negative = interval slot
        startTime: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`,
        durationMinutes: 15,
        isInterval: true,
        label: "Break"
      }
    ]);
    setDirty(true);
  };
  const remove = (idx) => {
    setConfigs((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };
  const resetDefaults = () => {
    const fresh = buildDefaultPeriodConfigs(8, "08:00", 45);
    setConfigs(fresh);
    setDirty(true);
  };
  const handleSave = async () => {
    const updated = {
      ...timetable,
      periodConfigs: configs
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated
      });
      onTimetableChange == null ? void 0 : onTimetableChange(updated);
      setDirty(false);
      ue.success("Period configuration saved.");
    } catch {
      ue.error("Failed to save period configuration.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Period Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Set different durations per period. Mark intervals as breaks." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            onClick: resetDefaults,
            "data-ocid": "period-config.reset_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1" }),
              " Defaults"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: handleSave,
            disabled: !dirty || updateTimetable.isPending,
            "data-ocid": "period-config.save_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5 mr-1" }),
              " Save"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-1", children: configs.map((cfg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex items-end gap-2 p-2 rounded-lg border ${cfg.isInterval ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800" : "bg-card border-border"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 w-20 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: cfg.isInterval ? "secondary" : "outline",
              className: "text-[10px] px-1.5 py-0 self-start",
              children: cfg.isInterval ? "Break" : `P${cfg.periodNumber}`
            }
          ) }),
          cfg.isInterval && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Label" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: cfg.label ?? "Break",
                onChange: (e) => update(idx, { label: e.target.value }),
                className: "h-7 text-xs w-24",
                "data-ocid": `period-config.label_input.${idx}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Start Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: cfg.startTime,
                onChange: (e) => update(idx, { startTime: e.target.value }),
                className: "h-7 text-xs w-28",
                "data-ocid": `period-config.start_input.${idx}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Duration (min)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 5,
                max: 120,
                value: cfg.durationMinutes,
                onChange: (e) => update(idx, { durationMinutes: Number(e.target.value) }),
                className: "h-7 text-xs w-20",
                "data-ocid": `period-config.duration_input.${idx}`
              }
            )
          ] }),
          cfg.startTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Ends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 flex items-center text-xs text-muted-foreground", children: computeEndTime(cfg.startTime, cfg.durationMinutes) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px]", children: "Break?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: cfg.isInterval,
                onCheckedChange: (v) => update(idx, { isInterval: v }),
                "data-ocid": `period-config.interval_switch.${idx}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remove period",
              onClick: () => remove(idx),
              className: "mb-0.5 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive",
              "data-ocid": `period-config.delete_button.${idx}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      `${cfg.periodNumber}-${idx}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          onClick: addPeriod,
          "data-ocid": "period-config.add_period_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
            " Add Period"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          onClick: addInterval,
          "data-ocid": "period-config.add_break_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
            " Add Break"
          ]
        }
      )
    ] })
  ] });
}
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function ClassLinksDialog({
  classLabel,
  classLevel,
  sectionName,
  onClose
}) {
  const { data: existingLinks = [] } = useClassLinks();
  const saveLinks = useSaveClassLinks();
  const [cctvUrl, setCctvUrl] = reactExports.useState("");
  const [broadcastUrl, setBroadcastUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    const found = existingLinks.find(
      (l) => l.classLevel === classLevel && l.sectionName === sectionName
    );
    if (found) {
      setCctvUrl(found.cctvUrl);
      setBroadcastUrl(found.broadcastUrl);
    }
  }, [existingLinks, classLevel, sectionName]);
  async function handleSave() {
    const others = existingLinks.filter(
      (l) => !(l.classLevel === classLevel && l.sectionName === sectionName)
    );
    const updated = [
      ...others,
      { classLevel, sectionName, cctvUrl, broadcastUrl }
    ];
    try {
      await saveLinks.mutateAsync(updated);
      ue.success(`Links saved for ${classLabel}`);
      onClose();
    } catch {
      ue.error("Failed to save links. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      style: { zIndex: 9999 },
      "data-ocid": "school-timetable.class_links_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-4 text-primary" }),
          "Class Links — ",
          classLabel
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3.5 text-muted-foreground" }),
              " CCTV Camera URL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. http://192.168.1.100",
                value: cctvUrl,
                onChange: (e) => setCctvUrl(e.target.value),
                "data-ocid": "school-timetable.class_links.cctv_input"
              }
            ),
            cctvUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: cctvUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xs text-primary hover:underline",
                children: "Test link →"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "size-3.5 text-muted-foreground" }),
              " Digital Broadcast / PA System URL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. http://192.168.1.200/broadcast",
                value: broadcastUrl,
                onChange: (e) => setBroadcastUrl(e.target.value),
                "data-ocid": "school-timetable.class_links.broadcast_input"
              }
            ),
            broadcastUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: broadcastUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xs text-primary hover:underline",
                children: "Test link →"
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
              "data-ocid": "school-timetable.class_links.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: saveLinks.isPending,
              "data-ocid": "school-timetable.class_links.save_button",
              children: [
                saveLinks.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 mr-1 animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 mr-1" }),
                "Save Links"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function SchoolWideTimetable({ sessionId }) {
  var _a, _b;
  const {
    data: pairs = [],
    isLoading,
    refetch
  } = useSchoolWideTimetable(sessionId);
  const { data: classLinks = [] } = useClassLinks();
  const activeSession = useAppStore((s) => s.currentSession);
  const [filterDay, setFilterDay] = reactExports.useState("today");
  const [filterPeriod, setFilterPeriod] = reactExports.useState("all");
  const [tick, setTick] = reactExports.useState(0);
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  const [linksDialogFor, setLinksDialogFor] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setNow(/* @__PURE__ */ new Date());
    }, 6e4);
    return () => clearInterval(id);
  }, []);
  const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const todayDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const currentTimeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  const printDateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) });
  }
  if (!pairs.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "school-timetable.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "🗓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No timetables found for this session." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Generate class timetables first from the Class-wise tab." })
        ]
      }
    );
  }
  const classLabels = pairs.map(([label]) => label);
  const allPeriodNumbers = Array.from(
    new Set(
      pairs.flatMap(
        ([, tt]) => tt.periodConfigs.length ? tt.periodConfigs.filter((p) => !p.isInterval).map((p) => p.periodNumber) : tt.entries.map((e) => e.periodNumber)
      )
    )
  ).sort((a, b) => a - b);
  const refPeriodConfigs = ((_b = (_a = pairs[0]) == null ? void 0 : _a[1]) == null ? void 0 : _b.periodConfigs) ?? [];
  const visiblePeriods = filterPeriod === "all" ? allPeriodNumbers : allPeriodNumbers.filter((p) => String(p) === filterPeriod);
  const isTodayInDays = DAYS.includes(todayName);
  const activeDays = filterDay === "today" ? isTodayInDays ? [todayName] : [DAYS[0]] : filterDay === "all" ? DAYS : [filterDay];
  const getEntry = (tt, day, period) => tt.entries.find((e) => e.dayOfWeek === day && e.periodNumber === period);
  const periodStatus = (period) => refPeriodConfigs.length ? getPeriodStatus(period, refPeriodConfigs) : "upcoming";
  const getPeriodCfg = (period) => refPeriodConfigs.find((p) => p.periodNumber === period);
  function getClassLinksFor(label) {
    return classLinks.find(
      (l) => label.includes(l.classLevel) && label.includes(l.sectionName)
    );
  }
  function parseLabelParts(label) {
    const pair = pairs.find(([l]) => l === label);
    if (pair) {
      const first = pair[1].entries[0];
      if (first)
        return {
          classLevel: first.classLevel,
          sectionName: first.sectionName
        };
    }
    return { classLevel: label, sectionName: "" };
  }
  const printDays = DAYS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "school-timetable.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: filterDay === "today" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Today —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
            todayName,
            ", ",
            todayDate
          ] })
        ] }) : "School-Wide Timetable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Current time: ",
          currentTimeStr
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        getCurrentPeriodNumber(refPeriodConfigs) !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 text-white border-0 text-xs", children: [
          "🟢 Period ",
          getCurrentPeriodNumber(refPeriodConfigs),
          " is Live"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => refetch(),
            "data-ocid": "school-timetable.refresh_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1" }),
              " Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => window.print(),
            "data-ocid": "school-timetable.print_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }),
              " Print"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDay, onValueChange: setFilterDay, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-36",
            "data-ocid": "school-timetable.day_filter_select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Today" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { style: { zIndex: 9999 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "today", children: "📅 Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Days" }),
          DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterPeriod, onValueChange: setFilterPeriod, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-36",
            "data-ocid": "school-timetable.period_filter_select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Periods" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { style: { zIndex: 9999 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Periods" }),
          allPeriodNumbers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(p), children: [
            "Period ",
            p
          ] }, p))
        ] })
      ] })
    ] }),
    activeDays.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "overflow-x-auto rounded-lg border border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card px-4 py-2 font-semibold text-sm border-b border-border text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: day }),
            day === todayName && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500 text-white border-0 text-xs py-0", children: "TODAY" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full border-collapse text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-border px-3 py-2 text-left text-muted-foreground w-24", children: "Period" }),
              classLabels.map((label) => {
                const links = getClassLinksFor(label);
                const parts = parseLabelParts(label);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "border border-border px-2 py-2 text-center text-muted-foreground min-w-[120px]",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
                      (links == null ? void 0 : links.cctvUrl) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: links.cctvUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          title: "Open CCTV Camera",
                          className: "text-primary hover:text-primary/80",
                          "data-ocid": `school-timetable.cctv_link.${label.replace(/\s+/g, "_")}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-3" })
                        }
                      ) : null,
                      (links == null ? void 0 : links.broadcastUrl) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: links.broadcastUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          title: "Open Digital Broadcast",
                          className: "text-amber-600 hover:text-amber-500",
                          "data-ocid": `school-timetable.broadcast_link.${label.replace(/\s+/g, "_")}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "size-3" })
                        }
                      ) : null,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          title: "Set CCTV / Broadcast links",
                          onClick: () => setLinksDialogFor({
                            classLabel: label,
                            ...parts
                          }),
                          className: "text-muted-foreground hover:text-foreground transition-colors",
                          "data-ocid": `school-timetable.add_links_button.${label.replace(/\s+/g, "_")}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3" })
                        }
                      )
                    ] })
                  },
                  label
                );
              })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: visiblePeriods.map((period) => {
              const status = periodStatus(period);
              const cfg = getPeriodCfg(period);
              const rowCls = status === "current" ? "bg-green-50 dark:bg-green-950/30" : status === "past" ? "bg-muted/20" : "";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: rowCls, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: `border border-border px-3 py-2 font-medium ${status === "current" ? "text-green-700 dark:text-green-400 bg-green-100/60 dark:bg-green-900/30" : "text-muted-foreground"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "P",
                          period
                        ] }),
                        status === "current" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] px-1 py-0 bg-green-500 text-white border-0", children: "LIVE" })
                      ] }),
                      (cfg == null ? void 0 : cfg.startTime) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-normal", children: [
                        cfg.startTime,
                        "–",
                        computeEndTime(cfg.startTime, cfg.durationMinutes)
                      ] })
                    ] })
                  }
                ),
                pairs.map(([label, tt]) => {
                  const entry = getEntry(tt, day, period);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: "border border-border px-2 py-1.5 align-top",
                      "data-ocid": `school-timetable.cell.${day.toLowerCase()}.${period}.${label.replace(/\s+/g, "_")}`,
                      children: entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground leading-tight", children: entry.subjectName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px]", children: entry.teacherName })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "—" })
                    },
                    label
                  );
                })
              ] }, period);
            }) })
          ] })
        ]
      },
      day
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timetable-print-area sr-only", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-letterhead", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-school-name", children: "SHUBH SCHOOL ERP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-report-title", children: "SCHOOL TIMETABLE — Weekly View" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-session-badge", children: [
          "Session: ",
          activeSession,
          "  |  Generated: ",
          printDateStr
        ] })
      ] }) }),
      printDays.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-day-header", children: [
          day,
          day === todayName ? " ★ TODAY" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "print-timetable-table", style: { marginTop: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "row-header", children: "Period" }),
            classLabels.map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: label }, label))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allPeriodNumbers.map((period) => {
            const status = periodStatus(period);
            const cfg = getPeriodCfg(period);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: status === "current" ? "current-period" : "",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "period-cell", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      "P",
                      period
                    ] }),
                    (cfg == null ? void 0 : cfg.startTime) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          fontWeight: 400,
                          fontSize: "6.5pt",
                          color: "#555"
                        },
                        children: [
                          cfg.startTime,
                          "–",
                          computeEndTime(cfg.startTime, cfg.durationMinutes)
                        ]
                      }
                    )
                  ] }),
                  pairs.map(([label, tt]) => {
                    const entry = getEntry(tt, day, period);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-cell-subject", children: entry.subjectName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-cell-teacher", children: entry.teacherName })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-cell-empty", children: "—" }) }, label);
                  })
                ]
              },
              period
            );
          }) })
        ] })
      ] }, day)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-summary-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Total Classes: ",
            classLabels.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Total Periods: ",
            allPeriodNumbers.length,
            " per day"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Session: ",
            activeSession
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-label", children: "Principal Signature" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-label", children: [
            "Date: ",
            printDateStr
          ] })
        ] })
      ] })
    ] }),
    linksDialogFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClassLinksDialog,
      {
        classLabel: linksDialogFor.classLabel,
        classLevel: linksDialogFor.classLevel,
        sectionName: linksDialogFor.sectionName,
        onClose: () => setLinksDialogFor(null)
      }
    )
  ] });
}
const CLASS_LABELS = {
  PlayWay: "Play Way",
  LKG: "LKG",
  UKG: "UKG",
  Class1: "Class 1",
  Class2: "Class 2",
  Class3: "Class 3",
  Class4: "Class 4",
  Class5: "Class 5",
  Class6: "Class 6",
  Class7: "Class 7",
  Class8: "Class 8",
  Class9: "Class 9",
  Class10: "Class 10",
  Class11: "Class 11",
  Class12: "Class 12"
};
function getTimetableLabel(tt) {
  const first = tt.entries[0];
  if (first) {
    const cl = CLASS_LABELS[first.classLevel] ?? first.classLevel;
    return `${cl} ${first.sectionName ? `- ${first.sectionName}` : ""}`.trim();
  }
  return tt.name || tt.id.slice(0, 8);
}
function TimetablePage() {
  const activeSession = useAppStore((s) => s.currentSession);
  const { data: timetables = [], isLoading } = useClassTimetables(activeSession);
  const [selectedId, setSelectedId] = reactExports.useState("");
  const [localTimetable, setLocalTimetable] = reactExports.useState(null);
  const [copiedCell, setCopiedCell] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("class");
  reactExports.useEffect(() => {
    if (timetables.length && !selectedId) {
      setSelectedId(timetables[0].id);
    }
  }, [timetables, selectedId]);
  reactExports.useEffect(() => {
    const found = timetables.find((t) => t.id === selectedId) ?? null;
    setLocalTimetable(found);
  }, [selectedId, timetables]);
  reactExports.useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") {
        setCopiedCell(null);
        ue.info("Copy cancelled.");
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  const selectedTimetable = localTimetable ?? timetables.find((t) => t.id === selectedId) ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6", "data-ocid": "timetable.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-primary" }),
          "Timetable"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Class-wise and school-wide schedule • Live period highlighting" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        copiedCell && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "secondary",
            className: "flex items-center gap-1.5 cursor-pointer",
            onClick: () => setCopiedCell(null),
            "data-ocid": "timetable.copy_status_badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
              "Copied: ",
              copiedCell.subjectName,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px] ml-1", children: "✕ clear" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
          "Session: ",
          activeSession ?? "2025-26"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: (v) => setActiveTab(v),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-ocid": "timetable.tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "class", "data-ocid": "timetable.class_tab", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4 mr-1.5" }),
              "Class-wise"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "school", "data-ocid": "timetable.school_tab", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-4 w-4 mr-1.5" }),
              "School-wide"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "teacher", "data-ocid": "timetable.teacher_tab", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-1.5" }),
              "Teacher-wise"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "config",
                disabled: !selectedTimetable,
                "data-ocid": "timetable.config_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4 mr-1.5" }),
                  "Period Config"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "class", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Class Timetable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto flex-wrap", children: [
                !copiedCell ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    onClick: () => ue.info(
                      "Hover a cell and click the Copy icon, or right-click a cell."
                    ),
                    "data-ocid": "timetable.copy_help_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5 mr-1.5" }),
                      " Copy Cell"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      onClick: () => setCopiedCell(null),
                      "data-ocid": "timetable.clear_copy_button",
                      children: "✕ Clear Copy"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "h-3 w-3 mr-1" }),
                    "Click any cell to paste"
                  ] })
                ] }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-44" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedId, onValueChange: setSelectedId, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-44",
                      "data-ocid": "timetable.class_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { style: { zIndex: 9999 }, children: timetables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", disabled: true, children: "No timetables yet" }) : timetables.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: tt.id, children: getTimetableLabel(tt) }, tt.id)) })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : !selectedTimetable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-16 text-center",
                "data-ocid": "timetable.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "📅" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No timetable selected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Select a class from the dropdown above, or generate a timetable from the Academics module." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              ClassTimetableGrid,
              {
                timetable: selectedTimetable,
                onTimetableChange: (updated) => {
                  setLocalTimetable(updated);
                },
                copiedCell,
                onCopy: (cell) => setCopiedCell(cell)
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "school", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "School-wide Timetable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All classes side by side • Periods as rows, classes as columns • Live period highlighted in green" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolWideTimetable, { sessionId: activeSession }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "teacher", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Teacher-wise Timetable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auto-generated from class timetables • Print individual teacher schedules" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherTimetablePanel, { sessionId: activeSession ?? "2025-26" }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "config", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Period Configuration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Configure individual period durations and break intervals for",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: selectedTimetable ? getTimetableLabel(selectedTimetable) : "the selected class" }),
                "."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: selectedTimetable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              PeriodConfigPanel,
              {
                timetable: selectedTimetable,
                onTimetableChange: (updated) => {
                  setLocalTimetable(updated);
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "Select a class timetable first from the Class-wise tab." }) })
          ] }) })
        ]
      }
    )
  ] });
}
export {
  TimetablePage as default
};
