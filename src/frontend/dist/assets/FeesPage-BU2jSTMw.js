const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CollectFeesTab-CN2twe67.js","assets/index-pMBTUEbj.js","assets/index-yepDJybJ.css","assets/FeeReceiptTemplate-BjT7XvY6.js","assets/checkbox-B6f3RDRz.js","assets/index-Nv6ob_Pe.js","assets/select-CB1mPRaz.js","assets/textarea-CDK2p2Hu.js","assets/search-ByT9I9Ba.js","assets/user-C6bo2V5_.js","assets/printer-Bk2BNhY3.js"])))=>i.map(i=>d[i]);
import { ae as createLucideIcon, d as useAppStore, r as reactExports, a5 as useStudents, u as useGetSections, bm as useFeeHeadings, bn as useFeePlans, bo as useAllFeePaymentsBySession, aB as useSettings, bp as useSchoolInfo, ar as useCertificateTemplates, bq as useAllStudentOldBalancesBySession, i as CLASS_LABELS, C as CLASS_ORDER, j as jsxRuntimeExports, t as Badge, L as Label, e as Button, X, S as Skeleton, aC as MessageCircle, aD as Bell, br as React, bs as useAddFeeHeading, bt as useUpdateFeeHeading, bu as useDeleteFeeHeading, bb as CalendarDays, B as BookOpen, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, I as Input, k as DialogFooter, l as LoaderCircle, F as ue, bv as sessionYears, bw as useSetFeePlan, bx as useGetFeeRegisterByUser, by as useGetFeeRegisterBySession, a2 as TrendingUp, bk as formatCurrency, bz as ChartColumn, U as Users, bl as SCHOOL_MONTHS, a0 as formatDate, a3 as useActor, ao as useQueryClient, an as useMutation, ab as downloadCSV, aw as ChevronRight, ad as createActor, aR as IndianRupee, a4 as CreditCard, aq as FileText, ac as __vitePreload } from "./index-pMBTUEbj.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { C as Checkbox } from "./checkbox-B6f3RDRz.js";
import { F as Funnel } from "./funnel-Qd2zbjyV.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { S as Send } from "./send-ByllD6tM.js";
import { a as ChevronUp, C as ChevronDown } from "./index-Nv6ob_Pe.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CJmvANa3.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { C as Copy } from "./copy-BDQ1kkni.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { S as ScrollText } from "./scroll-text-CsnFEtDp.js";
import "./calendar-CAegGMND.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }],
  ["path", { d: "M14 4h7", key: "3xa0d5" }],
  ["path", { d: "M14 9h7", key: "1icrd9" }],
  ["path", { d: "M14 15h7", key: "1mj8o2" }],
  ["path", { d: "M14 20h7", key: "11slyb" }]
];
const LayoutList = createLucideIcon("layout-list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5", key: "1uzm8b" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const SquareCheckBig = createLucideIcon("square-check-big", __iconNode);
const FEE_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March"
];
const MONTH_LABELS = {
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
  January: "Jan",
  February: "Feb",
  March: "Mar"
};
function composeMessage(entry) {
  const lines = [
    `Dear ${entry.fatherName || "Parent"},`,
    `This is a fee dues reminder for ${entry.studentName} (Class ${entry.className}-${entry.section}, Adm: ${entry.admNo}).`,
    "",
    "Pending fees:"
  ];
  for (const d of entry.duesPerHeading) {
    if (d.amount > 0) {
      const mStr = d.months.map((m) => MONTH_LABELS[m] ?? m).join(", ");
      lines.push(`• ${d.headingName}: ₹${d.amount} (Months: ${mStr})`);
    }
  }
  if (entry.oldBalance > 0) lines.push(`• Old Balance: ₹${entry.oldBalance}`);
  lines.push("");
  lines.push(`Total Due: ₹${entry.totalDue}`);
  lines.push("Please clear dues at the earliest. Thank you.");
  return lines.join("\n");
}
function WhatsAppModal({
  entry,
  apiToken,
  onClose
}) {
  const [msg, setMsg] = reactExports.useState(() => composeMessage(entry));
  const [sending, setSending] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleSend = async () => {
    const phone = entry.phone.replace(/\D/g, "");
    if (!phone) {
      setError("No phone number for this student.");
      return;
    }
    if (!apiToken) {
      setError("WhatsApp API key not configured in Settings.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const url = `https://wacoder.in/api/send?token=${encodeURIComponent(apiToken)}&phone=${encodeURIComponent(phone)}&msg=${encodeURIComponent(msg)}`;
      await fetch(url);
      setSent(true);
      setTimeout(onClose, 1500);
    } catch {
      setError("Failed to send. Check your API key and connection.");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4",
      style: { zIndex: 9999 },
      onClick: (e) => e.target === e.currentTarget && onClose(),
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4 text-green-600" }),
            "Send WhatsApp — ",
            entry.studentName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4 text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-muted-foreground mb-1 block", children: [
            "Phone: ",
            entry.phone || "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "w-full border border-input rounded-lg p-3 text-sm min-h-[200px] bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring",
              value: msg,
              onChange: (e) => setMsg(e.target.value)
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs mt-2", children: error }),
          sent && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-600 text-xs mt-2", children: "✓ Message sent successfully!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "bg-green-600 hover:bg-green-700 text-white",
              onClick: handleSend,
              disabled: sending || sent,
              children: sending ? "Sending..." : sent ? "Sent!" : "Send via WhatsApp"
            }
          )
        ] })
      ] })
    }
  );
}
function BulkWAModal({
  entries,
  apiToken,
  onClose
}) {
  var _a;
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const initRef = reactExports.useRef(
    null
  );
  if (!initRef.current) {
    initRef.current = { entries, apiToken };
  }
  React.useEffect(() => {
    const { entries: es, apiToken: tok } = initRef.current;
    (async () => {
      const errs = [];
      for (let i = 0; i < es.length; i++) {
        const e = es[i];
        const phone = e.phone.replace(/\D/g, "");
        if (phone && tok) {
          try {
            const msg = composeMessage(e);
            const url = `https://wacoder.in/api/send?token=${encodeURIComponent(tok)}&phone=${encodeURIComponent(phone)}&msg=${encodeURIComponent(msg)}`;
            await fetch(url);
          } catch {
            errs.push(`${e.studentName}: send failed`);
          }
        } else {
          errs.push(`${e.studentName}: no phone or API key`);
        }
        setProgress(i + 1);
        await new Promise((r) => setTimeout(r, 400));
      }
      setErrors(errs);
      setDone(true);
    })();
  }, [initRef]);
  const totalCount = ((_a = initRef.current) == null ? void 0 : _a.entries.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4",
      style: { zIndex: 9999 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-2xl w-full max-w-md p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-8 text-green-600 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-2", children: "Sending WhatsApp Messages" }),
        !done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
          "Sending ",
          progress,
          "/",
          totalCount,
          "..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-600 text-sm font-medium", children: [
          "Done! ",
          totalCount - errors.length,
          "/",
          totalCount,
          " sent successfully."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-2 mt-3 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-green-600 h-2 rounded-full transition-all duration-300",
            style: {
              width: `${totalCount ? progress / totalCount * 100 : 0}%`
            }
          }
        ) }),
        errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-xs text-destructive text-left max-h-28 overflow-auto mt-2", children: errors.map((err) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          err
        ] }, err)) }),
        done && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", className: "mt-4", onClick: onClose, children: "Close" })
      ] })
    }
  );
}
function renderSlipFromTemplate(e, template, schoolName, schoolAddress, dateStr) {
  if (!template) {
    return `<div class="slip">
      <div class="school-header">
        <div class="school-name">${schoolName}</div>
        <div class="school-addr">${schoolAddress}</div>
        <div class="slip-title">DEMAND NOTICE / FEES DUE SLIP</div>
      </div>
      <div class="meta-row">
        <span>Date: ${dateStr}</span>
        <span>Adm. No: ${e.admNo}</span>
      </div>
      <table class="info-table">
        <tr><td>Student Name</td><td>${e.studentName}</td><td>Class</td><td>${e.className}-${e.section}</td></tr>
        <tr><td>Father Name</td><td>${e.fatherName}</td><td>Phone</td><td>${e.phone}</td></tr>
      </table>
      <table class="fee-table">
        <thead><tr><th>Fee Heading</th><th>Months Due</th><th>Amount</th></tr></thead>
        <tbody>
          ${e.duesPerHeading.filter((d) => d.amount > 0).map(
      (d) => `<tr><td>${d.headingName}</td><td>${d.months.map((m) => MONTH_LABELS[m] ?? m).join(", ")}</td><td>₹${d.amount}</td></tr>`
    ).join("")}
          ${e.oldBalance > 0 ? `<tr><td colspan="2"><strong>Old Balance</strong></td><td>₹${e.oldBalance}</td></tr>` : ""}
          <tr class="total-row"><td colspan="2"><strong>Total Due</strong></td><td><strong>₹${e.totalDue}</strong></td></tr>
        </tbody>
      </table>
      <p class="notice">Please pay the above dues immediately to avoid late fees.</p>
      <div class="sig-line">Principal Signature: ___________________________</div>
    </div>`;
  }
  const feeTableHtml = `<table style="width:100%;border-collapse:collapse;font-size:11px">
    <thead><tr style="background:#eef3fc">
      <th style="padding:4px 8px;text-align:left;border:1px solid #ccc">Fee Heading</th>
      <th style="padding:4px 8px;text-align:center;border:1px solid #ccc">Months Due</th>
      <th style="padding:4px 8px;text-align:right;border:1px solid #ccc">Amount</th>
    </tr></thead>
    <tbody>
      ${e.duesPerHeading.filter((d) => d.amount > 0).map(
    (d) => `<tr><td style="padding:3px 8px;border:1px solid #ddd">${d.headingName}</td><td style="padding:3px 8px;text-align:center;border:1px solid #ddd">${d.months.map((m) => MONTH_LABELS[m] ?? m).join(", ")}</td><td style="padding:3px 8px;text-align:right;border:1px solid #ddd">₹${d.amount}</td></tr>`
  ).join("")}
      ${e.oldBalance > 0 ? `<tr><td style="padding:3px 8px;border:1px solid #ddd" colspan="2"><strong>Old Balance</strong></td><td style="padding:3px 8px;text-align:right;border:1px solid #ddd">₹${e.oldBalance}</td></tr>` : ""}
      <tr style="background:#f0f0f0"><td style="padding:4px 8px;border:1px solid #ccc" colspan="2"><strong>Total Due</strong></td><td style="padding:4px 8px;text-align:right;border:1px solid #ccc"><strong>₹${e.totalDue}</strong></td></tr>
    </tbody></table>`;
  const replacements = {
    "{{schoolName}}": schoolName,
    "{{schoolAddress}}": schoolAddress,
    "{{todayDate}}": dateStr,
    "{{studentName}}": e.studentName,
    "{{admNo}}": e.admNo,
    "{{className}}": e.className,
    "{{section}}": e.section,
    "{{fatherName}}": e.fatherName,
    "{{phone}}": e.phone,
    "{{totalDue}}": `₹${e.totalDue}`,
    "{{oldBalance}}": e.oldBalance > 0 ? `₹${e.oldBalance}` : "—",
    "{{monthsDue}}": [...new Set(e.duesPerHeading.flatMap((d) => d.months))].map((m) => MONTH_LABELS[m] ?? m).join(", ")
  };
  let html = template;
  for (const [k, v] of Object.entries(replacements)) {
    html = html.replaceAll(k, v);
  }
  html = html.replace(/Fee Heading \| Months Due \| Amount/g, feeTableHtml);
  return html;
}
function printDemandSlips(entries, schoolName, schoolAddress, studioTemplateHtml = null) {
  const today = /* @__PURE__ */ new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  const html = `<!DOCTYPE html><html><head><style>
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; }
    .slip { border: 1px solid #333; padding: 12px; margin: 8px; break-inside: avoid; page-break-inside: avoid; }
    .school-name { font-size: 15px; font-weight: bold; text-align: center; }
    .school-addr { font-size: 10px; text-align: center; color: #555; }
    .slip-title { text-align: center; font-size: 12px; font-weight: bold; margin: 6px 0; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #999; padding-top: 4px; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 10px; }
    .info-table, .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; font-size: 10px; }
    .info-table td { padding: 2px 4px; }
    .info-table td:first-child, .info-table td:nth-child(3) { font-weight: bold; color: #444; width: 25%; }
    .fee-table th { background: #f0f0f0; border: 1px solid #ccc; padding: 3px 6px; text-align: left; }
    .fee-table td { border: 1px solid #ccc; padding: 3px 6px; }
    .fee-table .total-row td { background: #f9f9f9; font-weight: bold; }
    .notice { font-size: 10px; color: #c00; margin: 6px 0; }
    .sig-line { font-size: 10px; margin-top: 8px; }
    @media print { @page { margin: 10mm; } .slip { margin: 4px; } }
  </style></head><body>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      ${entries.map((e) => renderSlipFromTemplate(e, studioTemplateHtml, schoolName, schoolAddress, dateStr)).join("")}
    </div>
  </body></html>`;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
}
function DemandRegisterTab() {
  const currentSession = useAppStore((s) => s.currentSession);
  const [selClass, setSelClass] = reactExports.useState("");
  const [selSection, setSelSection] = reactExports.useState("");
  const [selMonths, setSelMonths] = reactExports.useState([]);
  const [selHeadings, setSelHeadings] = reactExports.useState([]);
  const [generated, setGenerated] = reactExports.useState(false);
  const [sortField, setSortField] = reactExports.useState("class");
  const [sortAsc, setSortAsc] = reactExports.useState(true);
  const [selectedRows, setSelectedRows] = reactExports.useState(/* @__PURE__ */ new Set());
  const [waTarget, setWaTarget] = reactExports.useState(null);
  const [bulkWA, setBulkWA] = reactExports.useState(null);
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: sections = [] } = useGetSections();
  const { data: feeHeadings = [], isLoading: loadingHeadings } = useFeeHeadings();
  const { data: feePlans = [], isLoading: loadingPlans } = useFeePlans(currentSession);
  const { data: allPayments = [], isLoading: loadingPayments } = useAllFeePaymentsBySession(currentSession);
  const { data: settings } = useSettings();
  const { data: schoolInfo } = useSchoolInfo();
  const { data: certTemplates = [] } = useCertificateTemplates();
  const allStudentIds = reactExports.useMemo(
    () => students.filter((s) => s.sessionId === currentSession && !s.isDiscontinued).map((s) => s.id),
    [students, currentSession]
  );
  const { data: oldBalancesMap = {} } = useAllStudentOldBalancesBySession(
    allStudentIds,
    currentSession
  );
  const isLoading = loadingStudents || loadingHeadings || loadingPlans || loadingPayments;
  const filteredSections = reactExports.useMemo(
    () => sections.filter((s) => !selClass || s.classLevel === selClass),
    [sections, selClass]
  );
  const demandEntries = reactExports.useMemo(() => {
    if (!generated) return [];
    const paidSet = {};
    for (const p of allPayments) {
      if (!p || !p.studentId) continue;
      if (!paidSet[p.studentId]) paidSet[p.studentId] = /* @__PURE__ */ new Set();
      for (const it of p.items ?? []) {
        if (it.feeHeadingId && it.month) {
          paidSet[p.studentId].add(`${it.feeHeadingId}:${it.month}`);
        }
      }
    }
    const planMap = {};
    for (const plan of feePlans) {
      if (!plan.classLevel || !plan.feeHeadingId) continue;
      if (plan.sessionId !== currentSession) continue;
      if (!planMap[plan.classLevel]) planMap[plan.classLevel] = {};
      planMap[plan.classLevel][plan.feeHeadingId] = plan.monthlyAmount;
    }
    const headingNames = {};
    for (const h of feeHeadings) headingNames[h.id] = h.name;
    const sectionNames = {};
    for (const s of sections) sectionNames[s.id] = s.name;
    const monthsToCheck = selMonths.length > 0 ? selMonths : FEE_MONTHS;
    const headingsToCheck = selHeadings.length > 0 ? selHeadings : feeHeadings.map((h) => h.id);
    const entries = [];
    for (const student of students) {
      if (student.isDiscontinued) continue;
      if (student.sessionId !== currentSession) continue;
      if (selClass && student.classLevel !== selClass) continue;
      if (selSection && student.sectionId !== selSection) continue;
      const classPlans = planMap[student.classLevel] ?? {};
      const paid = paidSet[student.id] ?? /* @__PURE__ */ new Set();
      const duesPerHeading = [];
      let totalDue = 0;
      const headingApplicableMonths = {};
      for (const h of feeHeadings) {
        headingApplicableMonths[h.id] = h.applicableMonths && h.applicableMonths.length > 0 ? h.applicableMonths : FEE_MONTHS;
      }
      for (const hid of headingsToCheck) {
        const monthlyAmt = classPlans[hid] ?? 0;
        if (monthlyAmt === 0) continue;
        const headingAllowedMonths = headingApplicableMonths[hid] ?? FEE_MONTHS;
        const effectiveMonths = monthsToCheck.filter(
          (m) => headingAllowedMonths.includes(m)
        );
        const dueMths = [];
        for (const month of effectiveMonths) {
          if (!paid.has(`${hid}:${month}`)) {
            dueMths.push(month);
          }
        }
        if (dueMths.length > 0) {
          const amt = monthlyAmt * dueMths.length;
          totalDue += amt;
          duesPerHeading.push({
            headingId: hid,
            headingName: headingNames[hid] ?? hid,
            amount: amt,
            months: dueMths
          });
        }
      }
      const studentOldBalance = oldBalancesMap[student.id] ?? 0;
      totalDue += studentOldBalance;
      if (totalDue === 0 && duesPerHeading.length === 0) continue;
      entries.push({
        studentId: student.id,
        studentName: student.fullName,
        admNo: student.admNo,
        className: CLASS_LABELS[student.classLevel] ?? student.classLevel,
        section: sectionNames[student.sectionId] ?? student.sectionId,
        fatherName: student.fatherName,
        phone: student.fatherMobile || student.mobile || "",
        monthsDue: [...new Set(duesPerHeading.flatMap((d) => d.months))],
        duesPerHeading,
        oldBalance: studentOldBalance,
        totalDue
      });
    }
    return entries;
  }, [
    generated,
    students,
    allPayments,
    feePlans,
    feeHeadings,
    sections,
    selClass,
    selSection,
    selMonths,
    selHeadings,
    currentSession,
    oldBalancesMap
  ]);
  const sortedEntries = reactExports.useMemo(() => {
    const copy = [...demandEntries];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name")
        cmp = a.studentName.localeCompare(b.studentName);
      else if (sortField === "class")
        cmp = CLASS_ORDER.indexOf(a.className) - CLASS_ORDER.indexOf(b.className);
      else if (sortField === "totalDue") cmp = a.totalDue - b.totalDue;
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [demandEntries, sortField, sortAsc]);
  const resultHeadingIds = reactExports.useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    for (const e of sortedEntries)
      for (const d of e.duesPerHeading) ids.add(d.headingId);
    return [...ids];
  }, [sortedEntries]);
  const headingNameMap = reactExports.useMemo(() => {
    const m = {};
    for (const h of feeHeadings) m[h.id] = h.name;
    return m;
  }, [feeHeadings]);
  const grandTotal = reactExports.useMemo(
    () => sortedEntries.reduce((s, e) => s + e.totalDue, 0),
    [sortedEntries]
  );
  const handleSort = (f) => {
    if (sortField === f) setSortAsc(!sortAsc);
    else {
      setSortField(f);
      setSortAsc(true);
    }
  };
  const SortIcon = ({ f }) => sortField === f ? sortAsc ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "inline size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "inline size-3" }) : null;
  const allChecked = sortedEntries.length > 0 && sortedEntries.every((e) => selectedRows.has(e.studentId));
  const toggleAll = () => {
    if (allChecked) setSelectedRows(/* @__PURE__ */ new Set());
    else setSelectedRows(new Set(sortedEntries.map((e) => e.studentId)));
  };
  const handlePushNotification = async () => {
    if (!window.Notification) {
      alert("Push notifications are not supported in this browser.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      alert("Permission denied for notifications.");
      return;
    }
    const targets = sortedEntries.filter(
      (e) => selectedRows.size === 0 || selectedRows.has(e.studentId)
    );
    for (const e of targets) {
      new Notification("Fees Due Reminder", {
        body: `Dear ${e.fatherName || "Parent"}, fees of ₹${e.totalDue} are due for ${e.studentName}. Please pay at the earliest.`
      });
      await new Promise((r) => setTimeout(r, 200));
    }
    alert(`Push notifications sent to ${targets.length} students.`);
  };
  const toggleMonth = (m) => setSelMonths(
    (prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
  );
  const toggleHeading = (id) => setSelHeadings(
    (prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
  const clearFilters = () => {
    setSelClass("");
    setSelSection("");
    setSelMonths([]);
    setSelHeadings([]);
    setGenerated(false);
    setSelectedRows(/* @__PURE__ */ new Set());
  };
  const selectedEntries = sortedEntries.filter(
    (e) => selectedRows.has(e.studentId)
  );
  const demandSlipTemplate = reactExports.useMemo(() => {
    const t = certTemplates.find(
      (t2) => t2.templateType === "DemandSlip" && t2.isDefault
    ) ?? certTemplates.find((t2) => t2.templateType === "DemandSlip");
    if (!t) return null;
    try {
      const parsed = JSON.parse(t.elementsJson);
      const parts = [];
      for (const el of parsed.elements ?? []) {
        if (el.type === "text" || el.type === "field") {
          parts.push(`<div>${el.label ?? ""}</div>`);
        } else if (el.type === "table") {
          parts.push(`<div>${el.label ?? ""}</div>`);
        }
      }
      return parts.join("") || null;
    } catch {
      return null;
    }
  }, [certTemplates]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-screen",
      style: { overflowY: "auto" },
      "data-ocid": "demand_register.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-card border-b p-4",
            style: { position: "sticky", top: 0, zIndex: 50 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Demand Register — Fees Dues List" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-auto text-xs", children: currentSession })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Class" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: "w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                      value: selClass,
                      onChange: (e) => {
                        setSelClass(e.target.value);
                        setSelSection("");
                      },
                      "data-ocid": "demand_register.class.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Classes" }),
                        CLASS_ORDER.map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cl, children: CLASS_LABELS[cl] }, cl))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1 block", children: "Section" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: "w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                      value: selSection,
                      onChange: (e) => setSelSection(e.target.value),
                      "data-ocid": "demand_register.section.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Sections" }),
                        filteredSections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1.5 block", children: "Months (select specific months, or leave blank for all)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-wrap gap-1.5",
                    "data-ocid": "demand_register.months.filter",
                    children: FEE_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleMonth(m),
                        className: `px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${selMonths.includes(m) ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`,
                        "data-ocid": `demand_register.month.${m.toLowerCase()}`,
                        children: MONTH_LABELS[m]
                      },
                      m
                    ))
                  }
                )
              ] }),
              feeHeadings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium mb-1.5 block", children: "Fee Headings (leave blank for all)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-wrap gap-2",
                    "data-ocid": "demand_register.headings.filter",
                    children: feeHeadings.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        htmlFor: `hdg-${h.id}`,
                        className: "flex items-center gap-1.5 text-xs cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Checkbox,
                            {
                              id: `hdg-${h.id}`,
                              checked: selHeadings.includes(h.id),
                              onCheckedChange: () => toggleHeading(h.id)
                            }
                          ),
                          h.name
                        ]
                      },
                      h.id
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedRows(/* @__PURE__ */ new Set());
                      setGenerated(true);
                    },
                    disabled: isLoading,
                    "data-ocid": "demand_register.generate.button",
                    children: [
                      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "size-3.5 mr-1.5" }),
                      "Generate Report"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: clearFilters,
                    "data-ocid": "demand_register.clear.button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-1.5" }),
                      " Clear"
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", style: { minHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-full", children: [
          isLoading && generated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, i)) }),
          generated && !isLoading && sortedEntries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-center",
              "data-ocid": "demand_register.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-3", children: "✓" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "No Dues Found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "All students are up to date with their fees for the selected filters." })
              ]
            }
          ),
          generated && !isLoading && sortedEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-wrap items-center gap-2 mb-3 p-3 bg-muted/40 rounded-lg border",
                "data-ocid": "demand_register.action_bar",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
                    sortedEntries.length,
                    " student",
                    sortedEntries.length !== 1 ? "s" : "",
                    " with dues",
                    selectedRows.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary ml-1", children: [
                      "(",
                      selectedRows.size,
                      " selected)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 ml-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        onClick: () => printDemandSlips(
                          sortedEntries,
                          (schoolInfo == null ? void 0 : schoolInfo.name) ?? "School",
                          (schoolInfo == null ? void 0 : schoolInfo.address) ?? "",
                          demandSlipTemplate
                        ),
                        "data-ocid": "demand_register.print_all.button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 mr-1.5" }),
                          " Print All Slips"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        className: "bg-green-600 hover:bg-green-700 text-white",
                        onClick: () => setBulkWA(sortedEntries),
                        "data-ocid": "demand_register.whatsapp_all.button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5 mr-1.5" }),
                          " WhatsApp All"
                        ]
                      }
                    ),
                    selectedRows.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        className: "bg-green-600 hover:bg-green-700 text-white",
                        onClick: () => setBulkWA(selectedEntries),
                        "data-ocid": "demand_register.whatsapp_selected.button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5 mr-1.5" }),
                          " WhatsApp Selected"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        onClick: handlePushNotification,
                        "data-ocid": "demand_register.push_notification.button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-3.5 mr-1.5" }),
                          " Push Notification"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "overflow-x-auto rounded-lg border border-border",
                "data-ocid": "demand_register.table",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/60 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        checked: allChecked,
                        onCheckedChange: toggleAll,
                        "aria-label": "Select all",
                        "data-ocid": "demand_register.select_all.checkbox"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Sr." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "th",
                      {
                        className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground",
                        onClick: () => handleSort("name"),
                        onKeyDown: (e) => e.key === "Enter" && handleSort("name"),
                        children: [
                          "Student Name ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { f: "name" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Adm. No." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "th",
                      {
                        className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground",
                        onClick: () => handleSort("class"),
                        onKeyDown: (e) => e.key === "Enter" && handleSort("class"),
                        children: [
                          "Class ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { f: "class" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Section" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Father Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Phone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "Months Due" }),
                    resultHeadingIds.map((hid) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "p-2 border-b border-border text-right text-xs font-semibold text-muted-foreground whitespace-nowrap",
                        children: headingNameMap[hid] ?? hid
                      },
                      hid
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "th",
                      {
                        className: "p-2 border-b border-border text-right text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground",
                        onClick: () => handleSort("totalDue"),
                        onKeyDown: (e) => e.key === "Enter" && handleSort("totalDue"),
                        children: [
                          "Total Due ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { f: "totalDue" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 border-b border-border text-center text-xs font-semibold text-muted-foreground whitespace-nowrap", children: "WA" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedEntries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-muted/30 transition-colors border-b border-border/50",
                      "data-ocid": `demand_register.item.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox,
                          {
                            checked: selectedRows.has(entry.studentId),
                            onCheckedChange: () => {
                              setSelectedRows((prev) => {
                                const next = new Set(prev);
                                if (next.has(entry.studentId))
                                  next.delete(entry.studentId);
                                else next.add(entry.studentId);
                                return next;
                              });
                            },
                            "data-ocid": `demand_register.checkbox.${idx + 1}`
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground", children: idx + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 font-medium text-foreground whitespace-nowrap", children: entry.studentName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground", children: entry.admNo }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground whitespace-nowrap", children: entry.className }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground", children: entry.section }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground whitespace-nowrap", children: entry.fatherName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground", children: entry.phone }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-muted-foreground text-xs", children: entry.monthsDue.map((m) => MONTH_LABELS[m] ?? m).join(", ") }),
                        resultHeadingIds.map((hid) => {
                          const d = entry.duesPerHeading.find(
                            (x) => x.headingId === hid
                          );
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: "p-2 text-right text-muted-foreground",
                              children: d && d.amount > 0 ? `₹${d.amount.toLocaleString("en-IN")}` : "—"
                            },
                            hid
                          );
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2 text-right font-bold text-foreground", children: [
                          "₹",
                          entry.totalDue.toLocaleString("en-IN")
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "text-green-600 hover:text-green-700 transition-colors",
                            onClick: () => setWaTarget(entry),
                            "aria-label": `Send WhatsApp to ${entry.studentName}`,
                            "data-ocid": `demand_register.whatsapp.${idx + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" })
                          }
                        ) })
                      ]
                    },
                    entry.studentId
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-primary/5 font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        colSpan: 9 + resultHeadingIds.length,
                        className: "p-2 text-sm text-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "size-4 inline mr-1.5 text-primary" }),
                          "Total: ",
                          sortedEntries.length,
                          " student",
                          sortedEntries.length !== 1 ? "s" : "",
                          " with dues"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2 text-right text-sm font-bold text-primary", children: [
                      "₹",
                      grandTotal.toLocaleString("en-IN")
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {})
                  ] }) })
                ] })
              }
            )
          ] })
        ] }) }),
        waTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
          WhatsAppModal,
          {
            entry: waTarget,
            apiToken: (settings == null ? void 0 : settings.whatsappApiKey) ?? "",
            onClose: () => setWaTarget(null)
          }
        ),
        bulkWA && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BulkWAModal,
          {
            entries: bulkWA,
            apiToken: (settings == null ? void 0 : settings.whatsappApiKey) ?? "",
            onClose: () => setBulkWA(null)
          }
        )
      ]
    }
  );
}
const ACADEMIC_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March"
];
const MONTH_PRESETS = [
  {
    id: "all12",
    label: "All 12 Months",
    description: "Entire academic year",
    months: ACADEMIC_MONTHS
  },
  {
    id: "quarterly",
    label: "Quarterly",
    description: "Apr · Jul · Oct · Jan",
    months: ["April", "July", "October", "January"]
  },
  {
    id: "halfyearly",
    label: "Half-Yearly",
    description: "April · October only",
    months: ["April", "October"]
  },
  {
    id: "custom",
    label: "Pick Months",
    description: "Choose specific months",
    months: []
  }
];
function MonthPicker({
  value,
  onChange
}) {
  const activePreset = MONTH_PRESETS.find(
    (p) => p.id !== "custom" && p.months.length === value.length && p.months.every((m) => value.includes(m))
  );
  function applyPreset(preset) {
    if (preset.id === "custom") return;
    onChange([...preset.months]);
  }
  function toggleMonth(month) {
    onChange(
      value.includes(month) ? value.filter((m) => m !== month) : [...value, month]
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: MONTH_PRESETS.map((preset) => {
      const isActive = preset.id !== "custom" ? (activePreset == null ? void 0 : activePreset.id) === preset.id : !activePreset && value.length > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => applyPreset(preset),
          className: `px-2.5 py-2 rounded-lg border text-left transition-all text-xs ${isActive ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40 text-foreground"}`,
          "data-ocid": `fees.heading.month_preset.${preset.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: preset.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] mt-0.5 truncate", children: preset.description })
          ]
        },
        preset.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg p-3 bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: [
        "Selected months (",
        value.length,
        "/12)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-x-4 gap-y-2", children: ACADEMIC_MONTHS.map((month) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            id: `month-${month}`,
            checked: value.includes(month),
            onCheckedChange: () => toggleMonth(month),
            "data-ocid": `fees.heading.month.${month.toLowerCase()}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: `month-${month}`,
            className: "text-xs cursor-pointer select-none",
            children: month
          }
        )
      ] }, month)) }),
      value.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-2", children: "Select at least one month." })
    ] })
  ] });
}
function MonthPills$1({ months }) {
  if (!months || months.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs italic", children: "—" });
  if (months.length === 12)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "All 12 months" });
  if (months.length <= 4)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: months.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs px-1.5", children: m.slice(0, 3) }, m)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
    months.length,
    " months"
  ] });
}
function FeeHeadingsTab() {
  const { data: headings = [], isLoading } = useFeeHeadings();
  const addMutation = useAddFeeHeading();
  const updateMutation = useUpdateFeeHeading();
  const deleteMutation = useDeleteFeeHeading();
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    description: "",
    isActive: true,
    applicableMonths: [...ACADEMIC_MONTHS]
  });
  function openAdd() {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      isActive: true,
      applicableMonths: [...ACADEMIC_MONTHS]
    });
    setDialogOpen(true);
  }
  function openEdit(h) {
    setEditId(h.id);
    setForm({
      name: h.name,
      description: h.description,
      isActive: h.isActive,
      applicableMonths: h.applicableMonths ?? [...ACADEMIC_MONTHS]
    });
    setDialogOpen(true);
  }
  async function handleSave() {
    if (!form.name.trim()) return;
    if (form.applicableMonths.length === 0) {
      ue.error("Please select at least one applicable month.");
      return;
    }
    try {
      if (editId) {
        await updateMutation.mutateAsync({
          id: editId,
          name: form.name.trim(),
          description: form.description,
          isActive: form.isActive,
          applicableMonths: form.applicableMonths
        });
        ue.success("Fee heading updated");
      } else {
        await addMutation.mutateAsync({
          name: form.name.trim(),
          description: form.description,
          applicableMonths: form.applicableMonths
        });
        ue.success("Fee heading added");
      }
      setDialogOpen(false);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save fee heading"
      );
    }
  }
  async function handleToggle(h) {
    try {
      await updateMutation.mutateAsync({
        id: h.id,
        name: h.name,
        description: h.description,
        isActive: !h.isActive,
        applicableMonths: h.applicableMonths ?? [...ACADEMIC_MONTHS]
      });
      ue.success("Status updated");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  }
  async function handleDelete(id) {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteId(null);
      ue.success("Fee heading deleted");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete fee heading"
      );
    }
  }
  const isSaving = addMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Fee Headings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Define fee types and specify which months each fee applies" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: openAdd,
          className: "gap-2",
          "data-ocid": "fees.heading.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            " Add Heading"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Heading Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 13, className: "text-primary" }),
          "Applies To"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 font-semibold text-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? Array.from({ length: 4 }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full" }) }) }, key)) : headings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "py-12 text-center",
          "data-ocid": "fees.headings.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 mx-auto text-muted-foreground/30 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No fee headings yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Click "Add Heading" to create your first fee type' })
          ]
        }
      ) }) }) : headings.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border last:border-0 table-row-alt",
          "data-ocid": `fees.heading.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: h.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: h.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              MonthPills$1,
              {
                months: h.applicableMonths ?? ACADEMIC_MONTHS
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: h.isActive,
                onCheckedChange: () => handleToggle(h),
                disabled: updateMutation.isPending,
                "data-ocid": `fees.heading.toggle.${i + 1}`
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: h.isActive ? "default" : "secondary",
                  className: "text-xs mr-2",
                  children: h.isActive ? "Active" : "Inactive"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "size-8",
                  onClick: () => openEdit(h),
                  "data-ocid": `fees.heading.edit_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 text-destructive hover:text-destructive",
                  onClick: () => setDeleteId(h.id),
                  "data-ocid": `fees.heading.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] }) })
          ]
        },
        h.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
        "data-ocid": "fees.heading.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editId ? "Edit Fee Heading" : "Add Fee Heading" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Heading Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.name,
                  onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                  placeholder: "e.g. Tuition Fee",
                  "data-ocid": "fees.heading.name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.description,
                  onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
                  placeholder: "Brief description",
                  "data-ocid": "fees.heading.description.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: form.isActive,
                  onCheckedChange: (v) => setForm((f) => ({ ...f, isActive: v })),
                  "data-ocid": "fees.heading.active.switch"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "text-primary" }),
                "Applicable Months"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: "Which months is this fee charged? (Indian academic year: Apr–Mar)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MonthPicker,
                {
                  value: form.applicableMonths,
                  onChange: (months) => setForm((f) => ({ ...f, applicableMonths: months }))
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
                "data-ocid": "fees.heading.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSave,
                disabled: !form.name.trim() || form.applicableMonths.length === 0 || isSaving,
                "data-ocid": "fees.heading.save_button",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin mr-1" }),
                  " Saving…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  editId ? "Update" : "Add",
                  " Heading"
                ] })
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteId,
        onOpenChange: (open) => {
          if (!open) setDeleteId(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "fees.heading.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Fee Heading?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently remove this fee heading. This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                onClick: () => setDeleteId(null),
                disabled: isDeleting,
                "data-ocid": "fees.heading.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                onClick: () => {
                  if (deleteId) handleDelete(deleteId);
                },
                disabled: isDeleting,
                "data-ocid": "fees.heading.delete.confirm_button",
                children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin mr-1" }),
                  " Deleting…"
                ] }) : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function amtKey(cls, sess, sid, hid) {
  return `${cls}||${sess}||${sid}||${hid}`;
}
function headingMonthCount(h) {
  return h.applicableMonths && h.applicableMonths.length > 0 ? h.applicableMonths.length : 12;
}
const MONTH_ABBR = {
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
  January: "Jan",
  February: "Feb",
  March: "Mar"
};
function MonthPills({ months }) {
  if (!months || months.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "All 12 months" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-0.5 mt-0.5", children: months.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-block bg-primary/10 text-primary border border-primary/20 rounded px-1 py-0 text-[9px] font-medium leading-4",
      children: MONTH_ABBR[m] ?? m
    },
    m
  )) });
}
function AmountCell({
  value,
  onChange,
  isInherited,
  dataOcid
}) {
  const ref = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      ref,
      type: "text",
      value,
      placeholder: "—",
      onChange: (e) => {
        if (/^\d*$/.test(e.target.value)) onChange(e.target.value);
      },
      onFocus: () => {
        var _a;
        return (_a = ref.current) == null ? void 0 : _a.select();
      },
      className: `w-[80px] text-right border rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${isInherited ? "border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground hover:border-input hover:bg-background hover:text-foreground focus:border-input focus:bg-background focus:text-foreground" : "border-transparent hover:border-input focus:border-input bg-transparent hover:bg-background focus:bg-background text-foreground"}`,
      "data-ocid": dataOcid
    }
  ) });
}
function PlanGroupCard({
  classLevel,
  sessionId,
  sectionId,
  sectionName,
  headings,
  amounts,
  inheritedAmounts,
  onAmtChange,
  onSave,
  onDelete,
  isSaving,
  groupIndex
}) {
  const annualTotal = headings.reduce((sum, h) => {
    const key = amtKey(classLevel, sessionId, sectionId, h.id);
    const raw = amounts.get(key) ?? "";
    const val = raw !== "" ? Number(raw) : Number(
      inheritedAmounts.get(amtKey(classLevel, sessionId, "null", h.id)) ?? "0"
    );
    return sum + val * headingMonthCount(h);
  }, 0);
  const monthlyTotal = headings.reduce((sum, h) => {
    const key = amtKey(classLevel, sessionId, sectionId, h.id);
    const raw = amounts.get(key) ?? "";
    const val = raw !== "" ? Number(raw) : Number(
      inheritedAmounts.get(amtKey(classLevel, sessionId, "null", h.id)) ?? "0"
    );
    return sum + val;
  }, 0);
  const isSectionPlan = sectionId !== "null";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-lg bg-card overflow-hidden",
      "data-ocid": `fees.plans.item.${groupIndex}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-semibold", children: CLASS_LABELS[classLevel] }),
            isSectionPlan && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-primary border-primary/30 bg-primary/5",
                children: sectionName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: sessionId }),
            monthlyTotal > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Monthly: ₹",
              monthlyTotal.toLocaleString("en-IN"),
              " · Annual: ₹",
              annualTotal.toLocaleString("en-IN")
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5", children: "No amounts yet" }),
            isSectionPlan && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10 }),
              "Dashed = inherited from class plan"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-7 text-xs gap-1",
                onClick: () => onSave(classLevel, sessionId, sectionId),
                disabled: isSaving,
                "data-ocid": `fees.plans.save_button.${groupIndex}`,
                children: [
                  isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 }),
                  "Save"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "size-7 text-destructive hover:text-destructive",
                onClick: () => onDelete(classLevel, sessionId, sectionId),
                "data-ocid": `fees.plans.delete_button.${groupIndex}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/20 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-foreground min-w-[180px] sticky left-0 bg-muted/20 z-10", children: "Fee Heading" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-foreground min-w-[180px]", children: "Applicable Months" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-2 py-2 font-semibold text-foreground w-28", children: "Per Month (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-semibold text-foreground w-28", children: "Annual (₹)" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            headings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 4,
                className: "px-3 py-6 text-center text-xs text-muted-foreground",
                children: "No fee headings configured. Add headings in the Fee Headings tab first."
              }
            ) }) : headings.map((h, hi) => {
              const key = amtKey(classLevel, sessionId, sectionId, h.id);
              const ownVal = amounts.get(key) ?? "";
              const fallbackVal = inheritedAmounts.get(
                amtKey(classLevel, sessionId, "null", h.id)
              ) ?? "";
              const isInherited = isSectionPlan && ownVal === "";
              const displayVal = isInherited ? fallbackVal : ownVal;
              const numVal = Number(displayVal) || 0;
              const mCount = headingMonthCount(h);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border last:border-0 hover:bg-muted/10 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-1.5 sticky left-0 bg-card z-10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: h.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                        "× ",
                        mCount,
                        " month",
                        mCount !== 1 ? "s" : ""
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthPills, { months: h.applicableMonths ?? [] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AmountCell,
                      {
                        value: displayVal,
                        onChange: (v) => onAmtChange(classLevel, sessionId, sectionId, h.id, v),
                        isInherited,
                        dataOcid: `fees.plans.cell.${groupIndex}.${hi + 1}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-right text-muted-foreground", children: numVal > 0 ? `₹${(numVal * mCount).toLocaleString("en-IN")}` : "—" })
                  ]
                },
                h.id
              );
            }),
            headings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-primary/5 border-t-2 border-primary/20 font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  colSpan: 2,
                  className: "px-3 py-2.5 sticky left-0 bg-primary/5 z-10 text-foreground",
                  children: "Grand Total"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-2.5 text-right text-foreground", children: [
                "₹",
                monthlyTotal.toLocaleString("en-IN")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-right text-primary font-bold", children: [
                "₹",
                annualTotal.toLocaleString("en-IN")
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
function entryKey(e) {
  return `${e.classLevel}||${e.sessionId}||${e.sectionId}`;
}
function FeePlansTab() {
  const sessions = sessionYears();
  const { currentSession: storeSession } = useAppStore();
  const { data: backendPlans = [], isLoading: loadingPlans } = useFeePlans(storeSession);
  const { data: backendHeadings = [], isLoading: loadingHeadings } = useFeeHeadings();
  const { data: allSections = [], isLoading: loadingSections } = useGetSections();
  const setFeePlanMutation = useSetFeePlan();
  const headings = backendHeadings.filter((h) => h.isActive);
  const [filterSession, setFilterSession] = reactExports.useState(storeSession);
  const [filterClass, setFilterClass] = reactExports.useState("all");
  const [filterSection, setFilterSection] = reactExports.useState("all");
  const [lastFilterClass, setLastFilterClass] = reactExports.useState(
    filterClass
  );
  if (lastFilterClass !== filterClass) {
    setLastFilterClass(filterClass);
    setFilterSection("all");
  }
  reactExports.useEffect(() => {
    setFilterSession(storeSession);
    initialized.current = false;
  }, [storeSession]);
  const [localEntries, setLocalEntries] = reactExports.useState(/* @__PURE__ */ new Set());
  const [amounts, setAmounts] = reactExports.useState(/* @__PURE__ */ new Map());
  const [copySourceClass, setCopySourceClass] = reactExports.useState("");
  const [addClass, setAddClass] = reactExports.useState("");
  const [addSection, setAddSection] = reactExports.useState("class");
  const [savingKey, setSavingKey] = reactExports.useState(null);
  const initialized = reactExports.useRef(false);
  const sectionsForFilterClass = reactExports.useMemo(
    () => filterClass === "all" ? [] : allSections.filter((s) => s.classLevel === filterClass),
    [allSections, filterClass]
  );
  const sectionsForAddClass = reactExports.useMemo(
    () => addClass ? allSections.filter((s) => s.classLevel === addClass) : [],
    [allSections, addClass]
  );
  reactExports.useEffect(() => {
    initialized.current = false;
  }, [filterSession]);
  reactExports.useEffect(() => {
    if (!loadingPlans && !loadingHeadings && !initialized.current) {
      initialized.current = true;
      const map = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set();
      for (const p of backendPlans) {
        const sid = p.sectionId ?? "null";
        keys.add(`${p.classLevel}||${p.sessionId}||${sid}`);
        map.set(
          amtKey(p.classLevel, p.sessionId, sid, p.feeHeadingId),
          String(p.monthlyAmount)
        );
      }
      setAmounts(map);
      setLocalEntries(keys);
    }
  }, [backendPlans, loadingPlans, loadingHeadings]);
  const filteredEntries = reactExports.useMemo(() => {
    const all = Array.from(localEntries).map((k) => {
      const [cls, sess, sid] = k.split("||");
      return { classLevel: cls, sessionId: sess, sectionId: sid };
    });
    return all.filter((e) => {
      if (e.sessionId !== filterSession) return false;
      if (filterClass !== "all" && e.classLevel !== filterClass) return false;
      if (filterSection === "all") return true;
      if (filterSection === "class") return e.sectionId === "null";
      return e.sectionId === filterSection;
    }).sort((a, b) => {
      const ai = CLASS_ORDER.indexOf(a.classLevel);
      const bi = CLASS_ORDER.indexOf(b.classLevel);
      const ci = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      if (ci !== 0) return ci;
      if (a.sectionId === "null") return -1;
      if (b.sectionId === "null") return 1;
      return a.sectionId.localeCompare(b.sectionId);
    });
  }, [localEntries, filterSession, filterClass, filterSection]);
  const classLevelInSession = reactExports.useMemo(
    () => Array.from(localEntries).filter((k) => k.endsWith(`||${filterSession}||null`)).map((k) => k.split("||")[0]),
    [localEntries, filterSession]
  );
  function getInheritedAmounts() {
    return amounts;
  }
  function setAmt(cls, sess, sid, hid, val) {
    setAmounts((prev) => {
      const next = new Map(prev);
      next.set(amtKey(cls, sess, sid, hid), val);
      return next;
    });
  }
  function getSectionName(sectionId, classLevel) {
    if (sectionId === "null") return "All Sections";
    const sec = allSections.find(
      (s) => s.id === sectionId && s.classLevel === classLevel
    );
    return sec ? `Section ${sec.name}` : sectionId;
  }
  async function saveGroup(cls, sess, sid) {
    const key = `${cls}||${sess}||${sid}`;
    setSavingKey(key);
    const monthlyAmounts = headings.map((h) => {
      const own = amounts.get(amtKey(cls, sess, sid, h.id)) ?? "";
      const val = own !== "" ? Number(own) : sid !== "null" ? Number(amounts.get(amtKey(cls, sess, "null", h.id)) ?? "0") : 0;
      return [h.id, val];
    }).filter(([, amt]) => amt > 0);
    try {
      await setFeePlanMutation.mutateAsync({
        classLevel: cls,
        sectionId: sid === "null" ? null : sid,
        sessionId: sess,
        monthlyAmounts
      });
      const label = sid === "null" ? `${CLASS_LABELS[cls]} (class-level)` : `${CLASS_LABELS[cls]} – ${getSectionName(sid, cls)}`;
      ue.success(`${label} fee plan saved`);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save fee plan"
      );
    } finally {
      setSavingKey(null);
    }
  }
  function deleteGroup(cls, sess, sid) {
    const key = `${cls}||${sess}||${sid}`;
    setLocalEntries((prev) => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });
    setAmounts((prev) => {
      const n = new Map(prev);
      for (const h of headings) n.delete(amtKey(cls, sess, sid, h.id));
      return n;
    });
    ue.success("Fee plan removed");
  }
  function addNewEntry() {
    if (!addClass) {
      ue.error("Select a class to add");
      return;
    }
    const sid = addSection === "class" ? "null" : addSection;
    const key = `${addClass}||${filterSession}||${sid}`;
    if (localEntries.has(key)) {
      ue.error("A plan for this class/section already exists");
      return;
    }
    setLocalEntries((prev) => /* @__PURE__ */ new Set([...prev, key]));
    setAddClass("");
    setAddSection("class");
    const label = sid === "null" ? CLASS_LABELS[addClass] : `${CLASS_LABELS[addClass]} – ${getSectionName(sid, addClass)}`;
    ue.success(`Added ${label} — enter amounts and click Save`);
  }
  function copyToClass(targetCls, sourceCls) {
    setAmounts((prev) => {
      const next = new Map(prev);
      for (const h of headings) {
        const srcVal = prev.get(amtKey(sourceCls, filterSession, "null", h.id)) ?? "";
        next.set(amtKey(targetCls, filterSession, "null", h.id), srcVal);
      }
      return next;
    });
    const targetKey = `${targetCls}||${filterSession}||null`;
    setLocalEntries((prev) => /* @__PURE__ */ new Set([...prev, targetKey]));
    ue.success(
      `Amounts copied from ${CLASS_LABELS[sourceCls]} — click Save to persist`
    );
  }
  const isLoading = loadingPlans || loadingHeadings || loadingSections;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-6 flex items-center justify-center gap-2 text-muted-foreground text-sm py-20",
        "data-ocid": "fees.plans.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin size-4" }),
          " Loading fee plans…"
        ]
      }
    );
  }
  const existingClassKeys = Array.from(localEntries).filter((k) => k.endsWith(`||${filterSession}||null`)).map((k) => k.split("||")[0]);
  const availableToAdd = CLASS_ORDER.filter(
    (c) => !existingClassKeys.includes(c)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Fee Plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Set monthly amounts per heading · Annual total = amount × heading's applicable months" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20", children: [
          "Session: ",
          storeSession
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filterSession,
            onValueChange: (v) => {
              setFilterSession(v);
              initialized.current = false;
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-32",
                  "data-ocid": "fees.plans.session.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Session" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filterClass,
            onValueChange: (v) => setFilterClass(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-36",
                  "data-ocid": "fees.plans.class_filter.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c))
              ] })
            ]
          }
        ),
        filterClass !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSection, onValueChange: setFilterSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-40",
              "data-ocid": "fees.plans.section_filter.select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Sections" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Sections" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "class", children: "Class-Level Plan" }),
            sectionsForFilterClass.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
              "Section ",
              s.name
            ] }, s.id))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 px-4 py-2.5 bg-muted/20 border border-border rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Add plan for:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: addClass,
          onValueChange: (v) => {
            setAddClass(v);
            setAddSection("class");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-7 w-36 text-xs",
                "data-ocid": "fees.plans.new_class.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              availableToAdd.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "_none", disabled: true, children: "All classes added" }) : availableToAdd.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)),
              existingClassKeys.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c, children: [
                CLASS_LABELS[c],
                " (section)"
              ] }, `existing-${c}`))
            ] })
          ]
        }
      ),
      addClass && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: addSection, onValueChange: setAddSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "h-7 w-40 text-xs",
            "data-ocid": "fees.plans.new_section.select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Class-level plan" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "class", children: "Class-Level Plan" }),
          sectionsForAddClass.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
            "Section ",
            s.name
          ] }, s.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "h-7 text-xs gap-1",
          onClick: addNewEntry,
          "data-ocid": "fees.plans.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
            " Add"
          ]
        }
      )
    ] }),
    classLevelInSession.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 px-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "Copy class-level amounts from" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: copySourceClass,
          onValueChange: (v) => setCopySourceClass(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-7 w-36 text-xs",
                "data-ocid": "fees.plans.copy_source.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Source class" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: classLevelInSession.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "to" }),
      classLevelInSession.filter((c) => c !== copySourceClass).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-7 text-xs",
          onClick: () => copySourceClass && copyToClass(c, copySourceClass),
          "data-ocid": `fees.plans.copy_to.${c}`,
          children: CLASS_LABELS[c]
        },
        c
      ))
    ] }),
    filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border rounded-lg bg-card py-14 text-center",
        "data-ocid": "fees.plans.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "size-10 mx-auto text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground", children: [
            "No fee plans for ",
            filterSession
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: 'Use "Add plan for" above to create a fee structure for a class or section' })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filteredEntries.map((entry, gi) => {
      const key = entryKey(entry);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        PlanGroupCard,
        {
          classLevel: entry.classLevel,
          sessionId: entry.sessionId,
          sectionId: entry.sectionId,
          sectionName: getSectionName(entry.sectionId, entry.classLevel),
          headings,
          amounts,
          inheritedAmounts: getInheritedAmounts(),
          onAmtChange: setAmt,
          onSave: saveGroup,
          onDelete: deleteGroup,
          isSaving: savingKey === key,
          groupIndex: gi + 1
        },
        key
      );
    }) })
  ] });
}
function useUpdatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p) => {
      if (!actor) throw new Error("Backend not available");
      return actor.updateFeePayment(
        p.id,
        {
          paymentDate: p.paymentDate,
          totalAmount: p.totalAmount,
          paymentMode: p.paymentMode
        },
        "admin",
        "Admin"
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feePayments"] });
      qc.invalidateQueries({ queryKey: ["feeRegister"] });
      qc.invalidateQueries({ queryKey: ["allFeePaymentsBySession"] });
    }
  });
}
function useDeletePaymentLocal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deletePayment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feePayments"] });
      qc.invalidateQueries({ queryKey: ["feeRegister"] });
      qc.invalidateQueries({ queryKey: ["allFeePaymentsBySession"] });
    }
  });
}
function AuditLogModal({
  studentId,
  onClose
}) {
  const { data: logs = [] } = useGetFeeAuditLogs();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: true,
      onOpenChange: (v) => {
        if (!v) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-3xl max-h-[80vh] overflow-y-auto z-[9999]",
          "data-ocid": "fees.audit_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "size-4" }),
              " Fee Audit Trail"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-10 text-sm", children: "No audit records found." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Timestamp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Admin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Action" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Field" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "Old Value" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-foreground", children: "New Value" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: logs.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border last:border-0 hover:bg-muted/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: l.timestamp ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: l.adminName ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: l.action ?? "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: l.fieldChanged ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-destructive", children: l.oldValue ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-green-600", children: l.newValue ?? "—" })
                  ]
                },
                l.id ?? i
              )) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: onClose,
                "data-ocid": "fees.audit_dialog.close_button",
                children: "Close"
              }
            ) })
          ]
        }
      )
    }
  );
}
function EditPaymentModal({
  payment,
  onClose
}) {
  const [date, setDate] = reactExports.useState(payment.paymentDate);
  const [amount, setAmount] = reactExports.useState(payment.totalAmount);
  const [mode, setMode] = reactExports.useState(payment.paymentMode || "Cash");
  const updatePayment = useUpdatePayment();
  async function handleSave() {
    try {
      await updatePayment.mutateAsync({
        id: payment.id,
        paymentDate: date,
        totalAmount: Number(amount),
        paymentMode: mode
      });
      ue.success("Payment record updated successfully");
      onClose();
    } catch {
      ue.error("Failed to update payment. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: true,
      onOpenChange: (v) => {
        if (!v && !updatePayment.isPending) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "z-[9999]", "data-ocid": "fees.edit_payment_dialog", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Payment Record" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DateInput,
              {
                value: date,
                onChange: (iso) => setDate(iso),
                "data-ocid": "fees.edit_payment.date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                "data-ocid": "fees.edit_payment.amount_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: mode, onValueChange: setMode, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "fees.edit_payment.mode_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: ["Cash", "UPI", "Cheque", "NEFT", "Online"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              disabled: updatePayment.isPending,
              "data-ocid": "fees.edit_payment.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: updatePayment.isPending,
              "data-ocid": "fees.edit_payment.save_button",
              children: updatePayment.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1" }),
                " Saving…"
              ] }) : "Save Changes"
            }
          )
        ] })
      ] })
    }
  );
}
function collectorLabel(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
function studentName(studentId, students) {
  var _a;
  return ((_a = students.find((s) => s.id === studentId)) == null ? void 0 : _a.fullName) ?? studentId;
}
function studentClass(studentId, students) {
  const s = students.find((st) => st.id === studentId);
  return s ? CLASS_LABELS[s.classLevel] ?? s.classLevel : "—";
}
function studentSection(studentId, students) {
  var _a;
  return ((_a = students.find((s) => s.id === studentId)) == null ? void 0 : _a.sectionId) ?? "—";
}
function paymentModeBadge(mode) {
  const variants = {
    Cash: "bg-blue-100 text-blue-700 border-blue-300",
    UPI: "bg-green-100 text-green-700 border-green-300",
    Cheque: "bg-yellow-100 text-yellow-700 border-yellow-300",
    NEFT: "bg-purple-100 text-purple-700 border-purple-300",
    Online: "bg-indigo-100 text-indigo-700 border-indigo-300"
  };
  return variants[mode] ?? "bg-muted text-muted-foreground border-border";
}
function CollectorRow({
  group,
  students,
  index
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-border hover:bg-muted/30 cursor-pointer transition-colors",
        onClick: () => setExpanded((p) => !p),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p);
        },
        tabIndex: 0,
        "data-ocid": `fees.collector.row.${index}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 w-8", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-semibold text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center uppercase", children: collectorLabel(group.collectorId).charAt(0) }),
            collectorLabel(group.collectorId),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-normal", children: group.collectorId })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-foreground font-medium", children: group.payments.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-bold text-green-600", children: formatCurrency(group.total) })
        ]
      }
    ),
    expanded && group.payments.map((p, pi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "bg-muted/20 border-b border-border/50 text-xs",
        "data-ocid": `fees.collector.detail.${index}.${pi + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: studentName(p.studentId, students) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: studentClass(p.studentId, students) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground", children: formatDate(p.paymentDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
              "Receipt: ",
              p.receiptNo
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-green-600", children: formatCurrency(Number(p.totalAmount)) }) })
        ]
      },
      p.id
    ))
  ] });
}
function FeeRegisterTab() {
  const globalSession = useAppStore((s) => s.currentSession);
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: byUserRaw = [], isLoading: loadingRegister } = useGetFeeRegisterByUser();
  const sessions = sessionYears();
  const [filterSession, setFilterSession] = reactExports.useState(globalSession);
  const [filterClass, setFilterClass] = reactExports.useState("all");
  const [filterMonth, setFilterMonth] = reactExports.useState("all");
  const [filterMode, setFilterMode] = reactExports.useState("all");
  const [filterCollector, setFilterCollector] = reactExports.useState("all");
  const [filterDateFrom, setFilterDateFrom] = reactExports.useState("");
  const [filterDateTo, setFilterDateTo] = reactExports.useState("");
  const [filterPrevDuesOnly, setFilterPrevDuesOnly] = reactExports.useState(false);
  const [view, setView] = reactExports.useState(
    "detailed"
  );
  const [detailPage, setDetailPage] = reactExports.useState(1);
  const DETAIL_PAGE_SIZE = 25;
  const [editPayment, setEditPayment] = reactExports.useState(null);
  const [deletePaymentId, setDeletePaymentId] = reactExports.useState(null);
  const [showAudit, setShowAudit] = reactExports.useState(false);
  const deletePaymentMut = useDeletePaymentLocal();
  reactExports.useEffect(() => {
    setFilterSession(globalSession);
  }, [globalSession]);
  const { data: allSessionPayments = [], isLoading: loadingAllPayments } = useAllFeePaymentsBySession(filterSession);
  const {
    data: sessionRegisterEntries = [],
    isLoading: loadingRegisterEntries
  } = useGetFeeRegisterBySession(filterSession);
  const filteredStudents = reactExports.useMemo(() => {
    return students.filter((s) => {
      const studentSession = s.session ?? s.sessionId ?? "";
      if (filterClass !== "all" && s.classLevel !== filterClass) return false;
      if (studentSession && studentSession !== filterSession) return false;
      if (filterPrevDuesOnly) {
        const oldBalance = s.oldBalance ?? s.balance ?? 0;
        if (oldBalance <= 0) return false;
      }
      return true;
    });
  }, [students, filterClass, filterSession, filterPrevDuesOnly]);
  const allCollectorPayments = reactExports.useMemo(
    () => byUserRaw.flatMap(([, pmts]) => pmts),
    [byUserRaw]
  );
  const paidByStudent = reactExports.useMemo(() => {
    const map = {};
    for (const p of allCollectorPayments) {
      if (!p.isDeleted) {
        map[p.studentId] = (map[p.studentId] ?? 0) + Number(p.totalAmount);
      }
    }
    return map;
  }, [allCollectorPayments]);
  const totalCollected = reactExports.useMemo(
    () => allCollectorPayments.filter((p) => !p.isDeleted).reduce((sum, p) => sum + Number(p.totalAmount), 0),
    [allCollectorPayments]
  );
  const collectorGroups = reactExports.useMemo(
    () => byUserRaw.map(([id, payments]) => ({
      collectorId: id,
      payments: payments.filter((p) => !p.isDeleted),
      total: payments.filter((p) => !p.isDeleted).reduce((s, p) => s + Number(p.totalAmount), 0)
    })),
    [byUserRaw]
  );
  const grandTotal = reactExports.useMemo(
    () => collectorGroups.reduce((s, g) => s + g.total, 0),
    [collectorGroups]
  );
  const totalTxns = reactExports.useMemo(
    () => collectorGroups.reduce((s, g) => s + g.payments.length, 0),
    [collectorGroups]
  );
  const uniqueCollectors = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const p of allSessionPayments) {
      if (p.collectedBy) set.add(p.collectedBy);
    }
    return Array.from(set);
  }, [allSessionPayments]);
  const detailedPayments = reactExports.useMemo(() => {
    return allSessionPayments.filter((p) => {
      if (filterClass !== "all") {
        const s = students.find((st) => st.id === p.studentId);
        if (!s || s.classLevel !== filterClass) return false;
      }
      if (filterMonth !== "all") {
        const hasMonth = p.items.some((it) => it.month === filterMonth);
        if (!hasMonth) return false;
      }
      if (filterMode !== "all" && p.paymentMethod !== filterMode) return false;
      if (filterCollector !== "all" && p.collectedBy !== filterCollector)
        return false;
      if (filterDateFrom && p.paymentDate < filterDateFrom) return false;
      if (filterDateTo && p.paymentDate > filterDateTo) return false;
      return true;
    });
  }, [
    allSessionPayments,
    filterClass,
    filterMonth,
    filterMode,
    filterCollector,
    filterDateFrom,
    filterDateTo,
    students
  ]);
  const detailTotalPages = Math.max(
    1,
    Math.ceil(detailedPayments.length / DETAIL_PAGE_SIZE)
  );
  const detailPagedPayments = reactExports.useMemo(
    () => detailedPayments.slice(
      (detailPage - 1) * DETAIL_PAGE_SIZE,
      detailPage * DETAIL_PAGE_SIZE
    ),
    [detailedPayments, detailPage]
  );
  function handleExportDetailed() {
    const exportRows = sessionRegisterEntries.length > 0 ? sessionRegisterEntries.filter((e) => !e.isDeleted) : detailedPayments.map((p) => {
      const s = students.find((st) => st.id === p.studentId);
      const months = [
        ...new Set(p.items.map((it) => it.month).filter(Boolean))
      ];
      return {
        id: p.id,
        studentId: p.studentId,
        studentName: (s == null ? void 0 : s.fullName) ?? p.studentId,
        className: s ? CLASS_LABELS[s.classLevel] ?? s.classLevel : "",
        sectionName: (s == null ? void 0 : s.sectionId) ?? "",
        receiptNo: p.receiptNo,
        paymentDate: p.paymentDate,
        months,
        totalDue: p.totalDue ?? 0,
        totalAmount: p.totalAmount,
        discountTotal: 0,
        lateFees: 0,
        balance: p.balance ?? 0,
        paymentMode: p.paymentMethod ?? "Cash",
        collectedBy: p.collectedBy ?? "",
        sessionId: filterSession,
        isDeleted: false
      };
    });
    const data = exportRows.map((e) => {
      const s = students.find((st) => st.id === e.studentId);
      return {
        Date: formatDate(e.paymentDate),
        "Receipt No": e.receiptNo,
        "Student Name": e.studentName || (s == null ? void 0 : s.fullName) || e.studentId,
        Class: e.className || (s ? CLASS_LABELS[s.classLevel] ?? s.classLevel : "—"),
        Section: e.sectionName || (s == null ? void 0 : s.sectionId) || "—",
        "Months Paid": e.months.join(", ") || "—",
        "Total Due (₹)": e.totalDue,
        "Amount Paid (₹)": e.totalAmount,
        "Balance (₹)": e.balance,
        "Fee Receiver": e.collectedBy,
        "Mode of Payment": e.paymentMode
      };
    });
    downloadCSV(data, `fee-register-${filterSession}.csv`);
  }
  function handleExportByDate() {
    const data = filteredStudents.map((s) => ({
      "Adm No": s.admNo,
      "Student Name": s.fullName,
      Class: CLASS_LABELS[s.classLevel] ?? s.classLevel,
      "Total Paid": paidByStudent[s.id] ?? 0
    }));
    downloadCSV(data, `fee-register-${filterSession}.csv`);
  }
  function handleExportByCollector() {
    const data = collectorGroups.flatMap(
      (g) => g.payments.map((p) => ({
        Collector: collectorLabel(g.collectorId),
        "Collector ID": g.collectorId,
        "Receipt No": p.receiptNo,
        Student: studentName(p.studentId, students),
        Class: studentClass(p.studentId, students),
        "Amount (₹)": Number(p.totalAmount),
        Date: formatDate(p.paymentDate)
      }))
    );
    downloadCSV(data, "fee-register-by-collector.csv");
  }
  const isLoading = loadingStudents || loadingRegister;
  const isDetailedLoading = loadingStudents || loadingAllPayments || loadingRegisterEntries;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Fee Register" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View and export all fee collections" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20",
          "data-ocid": "fees.register.session.badge",
          children: [
            "Session: ",
            globalSession
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 p-1 bg-muted/40 rounded-lg w-fit border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "detailed" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          onClick: () => setView("detailed"),
          "data-ocid": "fees.register.view.detailed.tab",
          children: "Detailed View"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "date" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          onClick: () => setView("date"),
          "data-ocid": "fees.register.view.date.tab",
          children: "By Student"
        }
      ),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "collector" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          onClick: () => setView("collector"),
          "data-ocid": "fees.register.view.collector.tab",
          children: "By Collector"
        }
      )
    ] }),
    view === "detailed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.detail.collected.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-green-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Filtered Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-green-600", children: formatCurrency(
                  detailedPayments.reduce((s, p) => s + p.totalAmount, 0)
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.detail.receipts.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Receipts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: detailedPayments.length })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.detail.session.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-blue-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Session" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: filterSession })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterSession,
              onValueChange: (v) => {
                setFilterSession(v);
                setDetailPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-28 h-8",
                    "data-ocid": "fees.register.detail.session.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterClass,
              onValueChange: (v) => {
                setFilterClass(v);
                setDetailPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-32 h-8",
                    "data-ocid": "fees.register.detail.class.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                  CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] ?? c }, c))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterMonth,
              onValueChange: (v) => {
                setFilterMonth(v);
                setDetailPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-28 h-8",
                    "data-ocid": "fees.register.detail.month.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Months" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Months" }),
                  SCHOOL_MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterMode,
              onValueChange: (v) => {
                setFilterMode(v);
                setDetailPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-28 h-8",
                    "data-ocid": "fees.register.detail.mode.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Modes" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Modes" }),
                  ["Cash", "UPI", "Cheque", "NEFT", "Online"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m))
                ] })
              ]
            }
          )
        ] }),
        uniqueCollectors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Receiver" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterCollector,
              onValueChange: (v) => {
                setFilterCollector(v);
                setDetailPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-32 h-8",
                    "data-ocid": "fees.register.detail.collector.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All" }),
                  uniqueCollectors.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "From" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: filterDateFrom,
              onChange: (e) => {
                setFilterDateFrom(e.target.value);
                setDetailPage(1);
              },
              className: "h-8 w-36 text-xs",
              "data-ocid": "fees.register.detail.date_from.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: filterDateTo,
              onChange: (e) => {
                setFilterDateTo(e.target.value);
                setDetailPage(1);
              },
              className: "h-8 w-36 text-xs",
              "data-ocid": "fees.register.detail.date_to.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleExportDetailed,
            className: "gap-2",
            "data-ocid": "fees.register.detail.export_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
              " Export CSV"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-lg overflow-hidden bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Receipt No" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground min-w-[120px]", children: "Student Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Adm No" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground min-w-[120px]", children: "Months" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Paid Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Fee Receiver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Mode" }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isDetailedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 12,
              className: "py-12 text-center text-muted-foreground",
              "data-ocid": "fees.register.detail.loading_state",
              children: "Loading fee register..."
            }
          ) }) : detailPagedPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 12,
              className: "py-12 text-center text-muted-foreground",
              "data-ocid": "fees.register.detail.empty_state",
              children: "No payments found for the selected filters"
            }
          ) }) : detailPagedPayments.map((p, ri) => {
            const payment = p;
            const s = students.find(
              (st) => st.id === payment.studentId
            );
            const months = [
              ...new Set(
                (payment.items ?? []).map((it) => it.month).filter(Boolean)
              )
            ].join(", ");
            const mode = payment.paymentMethod ?? "Cash";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/10",
                "data-ocid": `fees.register.detail.row.${ri + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap", children: formatDate(payment.paymentDate) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-primary font-medium", children: payment.receiptNo || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: (s == null ? void 0 : s.fullName) ?? payment.studentId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: (s == null ? void 0 : s.admNo) ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: s ? CLASS_LABELS[s.classLevel] ?? s.classLevel : "—" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: studentSection(payment.studentId, students) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: months || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium text-foreground", children: formatCurrency(payment.totalAmount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium text-green-600", children: formatCurrency(payment.totalAmount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium", children: (() => {
                    const bal = payment.balance ?? 0;
                    return bal > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: formatCurrency(bal) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 text-xs", children: "Paid" });
                  })() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-muted-foreground", children: payment.collectedBy || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-[10px] px-1.5 py-0.5 rounded border font-medium ${paymentModeBadge(mode)}`,
                      children: mode
                    }
                  ) }),
                  isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-7",
                        onClick: () => setEditPayment({
                          id: payment.id ?? "",
                          paymentDate: payment.paymentDate ?? "",
                          totalAmount: String(payment.totalAmount),
                          paymentMode: payment.paymentMethod ?? "Cash"
                        }),
                        "data-ocid": `fees.register.detail.edit.${ri + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-7 text-destructive",
                        onClick: () => setDeletePaymentId(payment.id ?? ""),
                        "data-ocid": `fees.register.detail.delete.${ri + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              payment.id ?? ri
            );
          }) }),
          detailedPayments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                colSpan: 7,
                className: "px-3 py-2.5 font-bold text-foreground text-xs",
                children: [
                  "Total (",
                  detailedPayments.length,
                  " receipts)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-foreground", children: formatCurrency(
              detailedPayments.reduce(
                (s, p) => s + p.totalAmount,
                0
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-green-600", children: formatCurrency(
              detailedPayments.reduce(
                (s, p) => s + p.totalAmount,
                0
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3 })
          ] }) })
        ] }) }),
        detailTotalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Page ",
            detailPage,
            " of ",
            detailTotalPages,
            " ·",
            " ",
            detailedPayments.length,
            " records"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: detailPage <= 1,
                onClick: () => setDetailPage((p) => p - 1),
                "data-ocid": "fees.register.detail.pagination_prev",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: detailPage >= detailTotalPages,
                onClick: () => setDetailPage((p) => p + 1),
                "data-ocid": "fees.register.detail.pagination_next",
                children: "Next"
              }
            )
          ] })
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-2 text-muted-foreground",
          onClick: () => setShowAudit(true),
          "data-ocid": "fees.register.audit_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { size: 14 }),
            " View Audit Trail"
          ]
        }
      ) })
    ] }),
    view === "date" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.collected.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-green-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Collected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-green-600", children: formatCurrency(totalCollected) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.students.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Students (Filtered)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: filteredStudents.length })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.register.transactions.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Transactions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: allCollectorPayments.filter((p) => !p.isDeleted).length })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none px-2 py-1.5 rounded border border-border bg-card hover:bg-muted/40",
              "data-ocid": "fees.register.prev_dues.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "size-3.5 accent-primary rounded",
                    checked: filterPrevDuesOnly,
                    onChange: (e) => setFilterPrevDuesOnly(e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Prev Year Dues Only" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSession, onValueChange: setFilterSession, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-32",
                "data-ocid": "fees.register.session.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Session" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: filterClass,
              onValueChange: (v) => setFilterClass(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "w-36",
                    "data-ocid": "fees.register.class.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Classes" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Classes" }),
                  CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] ?? c }, c))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleExportByDate,
            className: "gap-2",
            "data-ocid": "fees.register.export_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
              " Export CSV"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Adm No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground min-w-[140px]", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Total Paid" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 4,
            className: "py-12 text-center text-muted-foreground",
            "data-ocid": "fees.register.loading_state",
            children: "Loading fee register..."
          }
        ) }) : filteredStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 4,
            className: "py-12 text-center text-muted-foreground",
            "data-ocid": "fees.register.empty_state",
            children: "No students found for selected filters"
          }
        ) }) : filteredStudents.map((s, ri) => {
          const paid = paidByStudent[s.id] ?? 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/10",
              "data-ocid": `fees.register.row.${ri + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-muted-foreground", children: s.admNo }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: s.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: CLASS_LABELS[s.classLevel] ?? s.classLevel }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium text-green-600", children: paid > 0 ? formatCurrency(paid) : "—" })
              ]
            },
            s.id
          );
        }) }),
        filteredStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 3,
              className: "px-3 py-2.5 font-bold text-foreground text-xs",
              children: [
                "Total (",
                filteredStudents.length,
                " students)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-green-600", children: formatCurrency(totalCollected) })
        ] }) })
      ] }) }) })
    ] }),
    view === "collector" && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.collector.total.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-green-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total Collected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-green-600", children: formatCurrency(grandTotal) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.collector.collectors.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No. of Collectors" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: collectorGroups.length })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 flex items-center gap-3",
            "data-ocid": "fees.collector.txns.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5 text-blue-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No. of Transactions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: totalTxns })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleExportByCollector,
          className: "gap-2",
          "data-ocid": "fees.collector.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
            " Export CSV"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-8 px-3 py-2.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-semibold text-foreground", children: "Collector" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Transactions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap", children: "Total Collected" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 4,
            className: "py-12 text-center text-muted-foreground",
            "data-ocid": "fees.collector.loading_state",
            children: "Loading collection records..."
          }
        ) }) : collectorGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 4,
            className: "py-12 text-center text-muted-foreground",
            "data-ocid": "fees.collector.empty_state",
            children: "No fee collection records found"
          }
        ) }) : collectorGroups.map((g, gi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectorRow,
          {
            group: g,
            students,
            index: gi + 1
          },
          g.collectorId
        )) }),
        collectorGroups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { className: "bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 2,
              className: "px-3 py-2.5 font-bold text-foreground text-xs",
              children: [
                "Grand Total (",
                collectorGroups.length,
                " collectors)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-foreground", children: totalTxns }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-bold text-green-600", children: formatCurrency(grandTotal) })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-right", children: "ℹ️ Click any row to expand and view individual transactions. Records are permanent." })
    ] }),
    isAdmin && editPayment && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditPaymentModal,
      {
        payment: editPayment,
        onClose: () => setEditPayment(null)
      }
    ),
    isAdmin && deletePaymentId && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: () => setDeletePaymentId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "fees.delete_payment_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Payment Record?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-2", children: "Delete this payment record? Student fee balance will be recalculated." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeletePaymentId(null),
                "data-ocid": "fees.delete_payment.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                disabled: deletePaymentMut.isPending,
                onClick: async () => {
                  try {
                    await deletePaymentMut.mutateAsync(deletePaymentId);
                    ue.success("Payment deleted");
                  } catch {
                    ue.error("Failed to delete");
                  } finally {
                    setDeletePaymentId(null);
                  }
                },
                "data-ocid": "fees.delete_payment.confirm_button",
                children: deletePaymentMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Delete"
              }
            )
          ] })
        ]
      }
    ) }),
    isAdmin && showAudit && /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogModal, { studentId: null, onClose: () => setShowAudit(false) })
  ] });
}
function useGetFeeAuditLogs(_s, _p) {
  return { data: [], isLoading: false };
}
const CollectFeesTab = React.lazy(() => __vitePreload(() => import("./CollectFeesTab-CN2twe67.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]) : void 0));
function CollectFeesSuspenseFallback() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 space-y-4",
      "data-ocid": "fees.collect.suspense_loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-28 rounded-full bg-muted animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-32 rounded bg-muted animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-8 min-w-[220px] rounded bg-muted animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading fee collection..." })
        ] })
      ]
    }
  );
}
class CollectFeesErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("[CollectFeesErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4 text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-destructive/10 flex items-center justify-center text-2xl", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Collect Fees failed to load" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "An error occurred. Your data is safe." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity",
              onClick: () => this.setState((s) => ({
                hasError: false,
                errorCount: s.errorCount + 1
              })),
              children: "Reload"
            }
          )
        ] })
      ] });
    }
    return this.props.children;
  }
}
function FeesPage() {
  const [activeTab, setActiveTab] = reactExports.useState("collect");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "fees.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Fee Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage fee headings, plans, collections, and registers" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "flex flex-col flex-1 min-h-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "h-12 bg-transparent p-0 gap-1",
              "data-ocid": "fees.tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "headings",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "fees.headings.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 14 }),
                      " Fee Headings"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "plans",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "fees.plans.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { size: 14 }),
                      " Fee Plans"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "collect",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "fees.collect.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 14 }),
                      " Collect Fees"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "register",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "fees.register.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 14 }),
                      " Fee Register"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "demand",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "fees.demand.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 14 }),
                      " Demand Register"
                    ]
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-auto bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "headings",
                className: "m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeeHeadingsTab, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "plans",
                className: "m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeePlansTab, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "collect",
                className: "m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CollectFeesErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(CollectFeesSuspenseFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CollectFeesTab, {}) }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "register",
                className: "m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeeRegisterTab, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsContent,
              {
                value: "demand",
                className: "m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(DemandRegisterTab, {})
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  FeesPage as default
};
