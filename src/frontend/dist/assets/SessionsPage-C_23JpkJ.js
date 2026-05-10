import { ae as createLucideIcon, d as useAppStore, r as reactExports, cA as DEFAULT_SESSIONS, j as jsxRuntimeExports, cd as CalendarClock, e as Button, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input, k as DialogFooter, a1 as generateId, aM as cn, a$ as useSessions, C as CLASS_ORDER, cB as usePromotionPreview, cC as usePromoteBulkStudents, i as CLASS_LABELS, l as LoaderCircle, aw as ChevronRight, F as ue } from "./index-pMBTUEbj.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CJmvANa3.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { S as Star } from "./star-DQ476nqQ.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
];
const Archive = createLucideIcon("archive", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function SessionCard({
  session,
  onActivate,
  onArchive
}) {
  const [archiveConfirm, setArchiveConfirm] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-xl border bg-card p-5 transition-all duration-200",
        session.isActive && "border-primary ring-2 ring-primary/20",
        session.isArchived && "opacity-60"
      ),
      "data-ocid": `sessions.item.${session.name}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "size-10 rounded-lg flex items-center justify-center shrink-0",
                  session.isActive ? "bg-primary/10" : "bg-muted/60"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CalendarClock,
                  {
                    size: 18,
                    className: session.isActive ? "text-primary" : "text-muted-foreground"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: session.name }),
                session.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-emerald-500" }),
                  "Active"
                ] }),
                session.isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground", children: "Archived" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "April ",
                session.startYear,
                " – March ",
                session.startYear + 1
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            !session.isActive && !session.isArchived && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => onActivate(session.id),
                "data-ocid": `sessions.activate.${session.name}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 13, className: "mr-1" }),
                  " Set Active"
                ]
              }
            ),
            !session.isArchived && !session.isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "text-muted-foreground",
                onClick: () => setArchiveConfirm(true),
                "data-ocid": `sessions.archive_open.${session.name}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { size: 13, className: "mr-1" }),
                  " Archive"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: archiveConfirm, onOpenChange: setArchiveConfirm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "sessions.archive.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
              "Archive Session ",
              session.name,
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Archived sessions are read-only. Only the Super Admin can restore them. This action cannot be undone easily." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "sessions.archive.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => {
                  onArchive(session.id);
                  setArchiveConfirm(false);
                },
                "data-ocid": "sessions.archive.confirm_button",
                children: "Yes, Archive"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
function BulkPromote({
  activeSession: _activeSession
}) {
  const { sessions } = useAppStore();
  const { data: backendSessions = [] } = useSessions();
  const allSessionNames = [
    ...new Set(
      [...backendSessions, ...sessions.map((s) => s.name)].filter(Boolean).sort((a, b) => b.localeCompare(a))
    )
  ];
  const [step, setStep] = reactExports.useState("select");
  const [fromClass, setFromClass] = reactExports.useState("Class9");
  const [fromSession, setFromSession] = reactExports.useState(
    (_activeSession == null ? void 0 : _activeSession.name) ?? "2024-25"
  );
  const [toSession, setToSession] = reactExports.useState((_activeSession == null ? void 0 : _activeSession.name) ?? "2025-26");
  const [targetSection, setTargetSection] = reactExports.useState("");
  const [carryBalance, setCarryBalance] = reactExports.useState(true);
  const [carryDiscounts, setCarryDiscounts] = reactExports.useState(true);
  const [carryTransport, setCarryTransport] = reactExports.useState(true);
  const [result, setResult] = reactExports.useState(null);
  const toClassIdx = CLASS_ORDER.indexOf(fromClass) + 1;
  const toClass = toClassIdx < CLASS_ORDER.length ? CLASS_ORDER[toClassIdx] : null;
  const isClass12 = fromClass === "Class12";
  const {
    data: previewItems = [],
    isLoading: previewLoading,
    refetch: refetchPreview
  } = usePromotionPreview(fromClass, fromSession);
  const promoteMutation = usePromoteBulkStudents();
  async function executePromotion() {
    setStep("promoting");
    try {
      const res = await promoteMutation.mutateAsync({
        fromClass,
        fromSession,
        newSession: toSession,
        targetSection: targetSection.trim() || null,
        carryBalance,
        carryDiscounts,
        carryTransport
      });
      setResult(res);
      if (res.promoted > 0)
        ue.success(`${res.promoted} student(s) promoted successfully`);
      if (res.failed > 0) ue.error(`${res.failed} student(s) failed`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Promotion failed";
      setResult({ promoted: 0, failed: previewItems.length, errors: [msg] });
      ue.error(msg);
    }
    setStep("result");
  }
  function reset() {
    setStep("select");
    setResult(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "Bulk Student Promotion" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "Promote all students from one class & session to the next class in a new session." }),
    (step === "select" || step === "preview") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: fromClass,
              onValueChange: (v) => {
                setFromClass(v);
                setStep("select");
                setResult(null);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "sessions.promote.from.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 h-10 px-3 rounded-md border border-border bg-muted/30", children: isClass12 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-destructive", children: "Graduate" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: toClass ? CLASS_LABELS[toClass] : "—" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "From Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: fromSession,
              onValueChange: (v) => {
                setFromSession(v);
                setStep("select");
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "sessions.promote.from_session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allSessionNames.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "To Session (Destination)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: toSession,
              onValueChange: (v) => {
                setToSession(v);
                setStep("select");
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "sessions.promote.to_session.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allSessionNames.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Target Section (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g. A (leave blank to keep current section)",
              value: targetSection,
              onChange: (e) => setTargetSection(e.target.value),
              "data-ocid": "sessions.promote.target_section.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Carry Old Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pending fees carry over to new session" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: carryBalance,
              onCheckedChange: setCarryBalance,
              "data-ocid": "sessions.promote.carry_dues.switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Carry Discounts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Student discounts transfer to new session" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: carryDiscounts,
              onCheckedChange: setCarryDiscounts,
              "data-ocid": "sessions.promote.carry_discounts.switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Carry Transport Route" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bus route assignment carries over" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: carryTransport,
              onCheckedChange: setCarryTransport,
              "data-ocid": "sessions.promote.carry_transport.switch"
            }
          )
        ] })
      ] }),
      isClass12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300", children: [
        "Class 12 students will be marked as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Graduated" }),
        " ",
        "(discontinued) after promotion."
      ] }),
      step === "select" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            refetchPreview();
            setStep("preview");
          },
          disabled: !fromClass || !fromSession || !toSession,
          "data-ocid": "sessions.promote.preview_button",
          children: "Preview Students"
        }
      ),
      step === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border-b border-border px-4 py-2.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: previewLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin" }),
              " Loading preview…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              previewItems.length,
              " student(s) from",
              " ",
              CLASS_LABELS[fromClass],
              !isClass12 && toClass && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                " ",
                "→ ",
                CLASS_LABELS[toClass]
              ] }),
              isClass12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
                " ",
                "→ Graduate"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              fromSession,
              " → ",
              toSession
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border max-h-60 overflow-y-auto", children: [
            previewItems.length === 0 && !previewLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-sm text-muted-foreground text-center py-6",
                "data-ocid": "sessions.promote.empty_state",
                children: [
                  "No students found for ",
                  CLASS_LABELS[fromClass],
                  " in",
                  " ",
                  fromSession,
                  "."
                ]
              }
            ),
            previewItems.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 py-2 flex items-center justify-between",
                "data-ocid": `sessions.promote.student.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono w-16 shrink-0", children: s.admNo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate", children: s.fullName })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2", children: [
                    s.oldBalance > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-600", children: [
                      "₹",
                      s.oldBalance.toFixed(0),
                      " due"
                    ] }),
                    s.discountCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                      s.discountCount,
                      " disc"
                    ] }),
                    !isClass12 && toClass && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 11 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary", children: CLASS_LABELS[toClass] })
                    ] }),
                    isClass12 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-medium", children: "Graduate" })
                  ] })
                ]
              },
              s.studentId
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setStep("select"),
              "data-ocid": "sessions.promote.back_button",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: executePromotion,
              disabled: previewItems.length === 0 || previewLoading,
              "data-ocid": "sessions.promote.execute_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "mr-1" }),
                "Confirm & Promote ",
                previewItems.length,
                " Students"
              ]
            }
          )
        ] })
      ] })
    ] }),
    step === "promoting" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-8",
        "data-ocid": "sessions.promote.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 32, className: "animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Promoting students… please wait" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            CLASS_LABELS[fromClass],
            " →",
            " ",
            isClass12 ? "Graduated" : toClass ? CLASS_LABELS[toClass] : "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-full animate-pulse w-3/4" }) })
        ]
      }
    ),
    step === "result" && result !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "sessions.promote.result", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center dark:bg-emerald-900/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-emerald-700 dark:text-emerald-400", children: result.promoted }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600 dark:text-emerald-500 mt-1", children: "Students promoted" })
        ] }),
        result.failed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-destructive", children: result.failed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 mt-1", children: "Failed" })
        ] })
      ] }),
      result.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-32 overflow-y-auto space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-destructive mb-1", children: "Errors:" }),
        result.errors.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: e }, e.slice(0, 60)))
      ] }),
      result.promoted > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400",
          "data-ocid": "sessions.promote.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Promotion complete! ",
              result.promoted,
              " students moved from",
              " ",
              CLASS_LABELS[fromClass],
              " (",
              fromSession,
              ") →",
              " ",
              isClass12 ? "Graduated" : toClass ? `${CLASS_LABELS[toClass]} (${toSession})` : toSession,
              "."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: reset,
          variant: "outline",
          "data-ocid": "sessions.promote.done_button",
          children: "Promote Another Class"
        }
      )
    ] })
  ] }) });
}
function SessionsPage() {
  const { sessions, setSessions, currentSession, setSession } = useAppStore();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ name: "", startDate: "", endDate: "" });
  const allSessions = (() => {
    const existingNames = new Set(sessions.map((s) => s.name));
    const missing = DEFAULT_SESSIONS.filter((s) => !existingNames.has(s.name));
    return missing.length > 0 ? [...sessions, ...missing] : sessions;
  })();
  const activeSession = allSessions.find((s) => s.isActive);
  function activateSession(id) {
    const updated = allSessions.map((s) => ({ ...s, isActive: s.id === id }));
    setSessions(updated);
    const activated = updated.find((s) => s.id === id);
    if (activated) setSession(activated.name);
  }
  function archiveSession(id) {
    setSessions(
      allSessions.map((s) => s.id === id ? { ...s, isArchived: true } : s)
    );
  }
  function createSession() {
    if (!form.name) return;
    const newSess = {
      id: generateId(),
      name: form.name,
      startYear: Number(form.name.split("-")[0]) || (/* @__PURE__ */ new Date()).getFullYear(),
      isActive: false,
      isArchived: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setSessions([...allSessions, newSess]);
    setCreateOpen(false);
    setForm({ name: "", startDate: "", endDate: "" });
  }
  const sorted = [...allSessions].sort((a, b) => b.startYear - a.startYear);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "sessions.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "size-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Sessions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Manage academic sessions · Active:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: (activeSession == null ? void 0 : activeSession.name) ?? "None" }),
            " ",
            "· Viewing:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: currentSession })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setCreateOpen(true),
          "data-ocid": "sessions.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " New Session"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border px-4 py-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Historical Data:" }),
        " ",
        "Sessions from 2019-20 onwards are preserved. Archived sessions are read-only — you can view student details and fee records for any past session."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "All Sessions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: sorted.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SessionCard,
          {
            session: s,
            onActivate: activateSession,
            onArchive: archiveSession
          },
          s.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Bulk Student Promotion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BulkPromote, { activeSession })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "sessions.create.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create New Session" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Session Name (YYYY-YY format)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "e.g. 2026-27",
              "data-ocid": "sessions.create.name.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use format like 2026-27 for the academic year" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.startDate,
                onChange: (e) => setForm((f) => ({ ...f, startDate: e.target.value })),
                "data-ocid": "sessions.create.start.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: form.endDate,
                onChange: (e) => setForm((f) => ({ ...f, endDate: e.target.value })),
                "data-ocid": "sessions.create.end.input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setCreateOpen(false),
            "data-ocid": "sessions.create.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: createSession,
            disabled: !form.name,
            "data-ocid": "sessions.create.submit_button",
            children: "Create Session"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  SessionsPage as default
};
