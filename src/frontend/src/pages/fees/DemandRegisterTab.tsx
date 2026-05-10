// ─── Demand Register Tab — Fees Dues List ─────────────────────────────────────
// Computes dues by comparing fee plans vs payment records per student per month.
// IMPORTANT: Month assignment per heading is respected (exam fees only in Nov, etc.)
// Supports filtering, printing demand slips via Certificate Studio template.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllStudentOldBalancesBySession,
  useCertificateTemplates,
  useFeeHeadings,
  useFeePlans,
  useGetSections,
  useSchoolInfo,
  useSettings,
  useStudents,
} from "@/hooks/useBackend";
import { useAllFeePaymentsBySession } from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel, FeeHeading } from "@/types";
import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import {
  Bell,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Filter,
  MessageCircle,
  Printer,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  "March",
];
const MONTH_LABELS: Record<string, string> = {
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
  March: "Mar",
};

type SortField = "name" | "class" | "totalDue";

interface DemandEntry {
  studentId: string;
  studentName: string;
  admNo: string;
  className: string;
  section: string;
  fatherName: string;
  phone: string;
  monthsDue: string[];
  duesPerHeading: {
    headingId: string;
    headingName: string;
    amount: number;
    months: string[];
  }[];
  oldBalance: number;
  totalDue: number;
}

// ─── WhatsApp Modal ───────────────────────────────────────────────────────────

function composeMessage(entry: DemandEntry): string {
  const lines = [
    `Dear ${entry.fatherName || "Parent"},`,
    `This is a fee dues reminder for ${entry.studentName} (Class ${entry.className}-${entry.section}, Adm: ${entry.admNo}).`,
    "",
    "Pending fees:",
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
  onClose,
}: {
  entry: DemandEntry;
  apiToken: string;
  onClose: () => void;
}) {
  const [msg, setMsg] = useState(() => composeMessage(entry));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="size-4 text-green-600" />
            Send WhatsApp — {entry.studentName}
          </h3>
          <button type="button" onClick={onClose}>
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <Label className="text-xs font-medium text-muted-foreground mb-1 block">
            Phone: {entry.phone || "—"}
          </Label>
          <textarea
            className="w-full border border-input rounded-lg p-3 text-sm min-h-[200px] bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          {error && <p className="text-destructive text-xs mt-2">{error}</p>}
          {sent && (
            <p className="text-green-600 text-xs mt-2">
              ✓ Message sent successfully!
            </p>
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSend}
            disabled={sending || sent}
          >
            {sending ? "Sending..." : sent ? "Sent!" : "Send via WhatsApp"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk WhatsApp Progress Modal ─────────────────────────────────────────────

function BulkWAModal({
  entries,
  apiToken,
  onClose,
}: {
  entries: DemandEntry[];
  apiToken: string;
  onClose: () => void;
}) {
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const initRef = useRef<{ entries: DemandEntry[]; apiToken: string } | null>(
    null,
  );

  if (!initRef.current) {
    initRef.current = { entries, apiToken };
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount, snapshots are captured inside
  React.useEffect(() => {
    const { entries: es, apiToken: tok } = initRef.current!;
    (async () => {
      const errs: string[] = [];
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

  const totalCount = initRef.current?.entries.length ?? 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 text-center">
        <MessageCircle className="size-8 text-green-600 mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-2">
          Sending WhatsApp Messages
        </h3>
        {!done ? (
          <p className="text-muted-foreground text-sm">
            Sending {progress}/{totalCount}...
          </p>
        ) : (
          <p className="text-green-600 text-sm font-medium">
            Done! {totalCount - errors.length}/{totalCount} sent successfully.
          </p>
        )}
        <div className="w-full bg-muted rounded-full h-2 mt-3 mb-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${totalCount ? (progress / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
        {errors.length > 0 && (
          <ul className="text-xs text-destructive text-left max-h-28 overflow-auto mt-2">
            {errors.map((err) => (
              <li key={err}>• {err}</li>
            ))}
          </ul>
        )}
        {done && (
          <Button type="button" size="sm" className="mt-4" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Print Demand Slip (with Certificate Studio template support) ──────────────

/** Render a single DemandEntry using the Certificate Studio DemandSlip template.
 *  Falls back to the hardcoded layout when no template is configured.
 */
function renderSlipFromTemplate(
  e: DemandEntry,
  template: string | null,
  schoolName: string,
  schoolAddress: string,
  dateStr: string,
): string {
  if (!template) {
    // Fallback hardcoded layout
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
          ${e.duesPerHeading
            .filter((d) => d.amount > 0)
            .map(
              (d) =>
                `<tr><td>${d.headingName}</td><td>${d.months.map((m) => MONTH_LABELS[m] ?? m).join(", ")}</td><td>₹${d.amount}</td></tr>`,
            )
            .join("")}
          ${e.oldBalance > 0 ? `<tr><td colspan="2"><strong>Old Balance</strong></td><td>₹${e.oldBalance}</td></tr>` : ""}
          <tr class="total-row"><td colspan="2"><strong>Total Due</strong></td><td><strong>₹${e.totalDue}</strong></td></tr>
        </tbody>
      </table>
      <p class="notice">Please pay the above dues immediately to avoid late fees.</p>
      <div class="sig-line">Principal Signature: ___________________________</div>
    </div>`;
  }

  // Template-driven: replace placeholders
  const feeTableHtml = `<table style="width:100%;border-collapse:collapse;font-size:11px">
    <thead><tr style="background:#eef3fc">
      <th style="padding:4px 8px;text-align:left;border:1px solid #ccc">Fee Heading</th>
      <th style="padding:4px 8px;text-align:center;border:1px solid #ccc">Months Due</th>
      <th style="padding:4px 8px;text-align:right;border:1px solid #ccc">Amount</th>
    </tr></thead>
    <tbody>
      ${e.duesPerHeading
        .filter((d) => d.amount > 0)
        .map(
          (d) =>
            `<tr><td style="padding:3px 8px;border:1px solid #ddd">${d.headingName}</td><td style="padding:3px 8px;text-align:center;border:1px solid #ddd">${d.months.map((m) => MONTH_LABELS[m] ?? m).join(", ")}</td><td style="padding:3px 8px;text-align:right;border:1px solid #ddd">₹${d.amount}</td></tr>`,
        )
        .join("")}
      ${e.oldBalance > 0 ? `<tr><td style="padding:3px 8px;border:1px solid #ddd" colspan="2"><strong>Old Balance</strong></td><td style="padding:3px 8px;text-align:right;border:1px solid #ddd">₹${e.oldBalance}</td></tr>` : ""}
      <tr style="background:#f0f0f0"><td style="padding:4px 8px;border:1px solid #ccc" colspan="2"><strong>Total Due</strong></td><td style="padding:4px 8px;text-align:right;border:1px solid #ccc"><strong>₹${e.totalDue}</strong></td></tr>
    </tbody></table>`;

  const replacements: Record<string, string> = {
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
    "{{monthsDue}}": [...new Set(e.duesPerHeading.flatMap((d) => d.months))]
      .map((m) => MONTH_LABELS[m] ?? m)
      .join(", "),
  };

  let html = template;
  for (const [k, v] of Object.entries(replacements)) {
    html = html.replaceAll(k, v);
  }

  // Replace fee table element placeholder with real table
  html = html.replace(/Fee Heading \| Months Due \| Amount/g, feeTableHtml);

  return html;
}

function printDemandSlips(
  entries: DemandEntry[],
  schoolName: string,
  schoolAddress: string,
  studioTemplateHtml: string | null = null,
) {
  const today = new Date();
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DemandRegisterTab() {
  const currentSession = useAppStore((s) => s.currentSession);

  // ─ Filter State
  const [selClass, setSelClass] = useState("");
  const [selSection, setSelSection] = useState("");
  const [selMonths, setSelMonths] = useState<string[]>([]);
  const [selHeadings, setSelHeadings] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [sortField, setSortField] = useState<SortField>("class");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [waTarget, setWaTarget] = useState<DemandEntry | null>(null);
  const [bulkWA, setBulkWA] = useState<DemandEntry[] | null>(null);

  // ─ Data Hooks
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: sections = [] } = useGetSections();
  const { data: feeHeadings = [], isLoading: loadingHeadings } =
    useFeeHeadings();
  const { data: feePlans = [], isLoading: loadingPlans } =
    useFeePlans(currentSession);
  const { data: allPayments = [], isLoading: loadingPayments } =
    useAllFeePaymentsBySession(currentSession);
  const { data: settings } = useSettings();
  const { data: schoolInfo } = useSchoolInfo();
  const { data: certTemplates = [] } = useCertificateTemplates();

  // Collect all student IDs for bulk old-balance fetch
  const allStudentIds = useMemo(
    () =>
      students
        .filter((s) => s.sessionId === currentSession && !s.isDiscontinued)
        .map((s) => s.id),
    [students, currentSession],
  );
  const { data: oldBalancesMap = {} } = useAllStudentOldBalancesBySession(
    allStudentIds,
    currentSession,
  );

  const isLoading =
    loadingStudents || loadingHeadings || loadingPlans || loadingPayments;

  // ─ Derived section list filtered by class
  const filteredSections = useMemo(
    () => sections.filter((s) => !selClass || s.classLevel === selClass),
    [sections, selClass],
  );

  // ─ Compute demand entries ─────────────────────────────────────────────────
  const demandEntries: DemandEntry[] = useMemo(() => {
    if (!generated) return [];

    // Build payment lookup: studentId -> Set of "headingId:month" paid
    const paidSet: Record<string, Set<string>> = {};
    for (const p of allPayments) {
      if (!p || !p.studentId) continue;
      if (!paidSet[p.studentId]) paidSet[p.studentId] = new Set();
      for (const it of p.items ?? []) {
        if (it.feeHeadingId && it.month) {
          paidSet[p.studentId].add(`${it.feeHeadingId}:${it.month}`);
        }
      }
    }

    // Build fee plan lookup: classLevel -> headingId -> amount
    const planMap: Record<string, Record<string, number>> = {};
    for (const plan of feePlans) {
      if (!plan.classLevel || !plan.feeHeadingId) continue;
      if (plan.sessionId !== currentSession) continue;
      if (!planMap[plan.classLevel]) planMap[plan.classLevel] = {};
      planMap[plan.classLevel][plan.feeHeadingId] = plan.monthlyAmount;
    }

    // Heading name lookup
    const headingNames: Record<string, string> = {};
    for (const h of feeHeadings) headingNames[h.id] = h.name;

    // Section name lookup
    const sectionNames: Record<string, string> = {};
    for (const s of sections) sectionNames[s.id] = s.name;

    // Months to check
    const monthsToCheck = selMonths.length > 0 ? selMonths : FEE_MONTHS;
    // Headings to check
    const headingsToCheck =
      selHeadings.length > 0 ? selHeadings : feeHeadings.map((h) => h.id);

    const entries: DemandEntry[] = [];

    for (const student of students) {
      if (student.isDiscontinued) continue;
      if (student.sessionId !== currentSession) continue;
      if (selClass && student.classLevel !== selClass) continue;
      if (selSection && student.sectionId !== selSection) continue;

      const classPlans = planMap[student.classLevel] ?? {};
      const paid = paidSet[student.id] ?? new Set<string>();

      const duesPerHeading: DemandEntry["duesPerHeading"] = [];
      let totalDue = 0;

      // Build heading lookup for applicableMonths
      const headingApplicableMonths: Record<string, string[]> = {};
      for (const h of feeHeadings as FeeHeading[]) {
        headingApplicableMonths[h.id] =
          h.applicableMonths && h.applicableMonths.length > 0
            ? h.applicableMonths
            : FEE_MONTHS;
      }

      for (const hid of headingsToCheck) {
        const monthlyAmt = classPlans[hid] ?? 0;
        if (monthlyAmt === 0) continue;
        // KEY FIX: intersect user-selected months with the heading's own assigned months
        const headingAllowedMonths = headingApplicableMonths[hid] ?? FEE_MONTHS;
        const effectiveMonths = monthsToCheck.filter((m) =>
          headingAllowedMonths.includes(m),
        );
        const dueMths: string[] = [];
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
            months: dueMths,
          });
        }
      }

      // Include old balance before the skip check so students with only
      // old balance (no current heading dues) still appear in the register.
      const studentOldBalance = oldBalancesMap[student.id] ?? 0;
      totalDue += studentOldBalance;

      if (totalDue === 0 && duesPerHeading.length === 0) continue;

      entries.push({
        studentId: student.id,
        studentName: student.fullName,
        admNo: student.admNo,
        className:
          CLASS_LABELS[student.classLevel as ClassLevel] ?? student.classLevel,
        section: sectionNames[student.sectionId] ?? student.sectionId,
        fatherName: student.fatherName,
        phone: student.fatherMobile || student.mobile || "",
        monthsDue: [...new Set(duesPerHeading.flatMap((d) => d.months))],
        duesPerHeading,
        oldBalance: studentOldBalance,
        totalDue,
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
    oldBalancesMap,
  ]);

  // ─ Sorted entries
  const sortedEntries = useMemo(() => {
    const copy = [...demandEntries];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name")
        cmp = a.studentName.localeCompare(b.studentName);
      else if (sortField === "class")
        cmp =
          CLASS_ORDER.indexOf(a.className as ClassLevel) -
          CLASS_ORDER.indexOf(b.className as ClassLevel);
      else if (sortField === "totalDue") cmp = a.totalDue - b.totalDue;
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [demandEntries, sortField, sortAsc]);

  // ─ All heading ids present in results (for dynamic columns)
  const resultHeadingIds = useMemo(() => {
    const ids = new Set<string>();
    for (const e of sortedEntries)
      for (const d of e.duesPerHeading) ids.add(d.headingId);
    return [...ids];
  }, [sortedEntries]);

  const headingNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const h of feeHeadings) m[h.id] = h.name;
    return m;
  }, [feeHeadings]);

  // ─ Grand totals
  const grandTotal = useMemo(
    () => sortedEntries.reduce((s, e) => s + e.totalDue, 0),
    [sortedEntries],
  );

  // ─ Sort handler
  const handleSort = (f: SortField) => {
    if (sortField === f) setSortAsc(!sortAsc);
    else {
      setSortField(f);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ f }: { f: SortField }) =>
    sortField === f ? (
      sortAsc ? (
        <ChevronUp className="inline size-3" />
      ) : (
        <ChevronDown className="inline size-3" />
      )
    ) : null;

  // ─ Row selection
  const allChecked =
    sortedEntries.length > 0 &&
    sortedEntries.every((e) => selectedRows.has(e.studentId));
  const toggleAll = () => {
    if (allChecked) setSelectedRows(new Set());
    else setSelectedRows(new Set(sortedEntries.map((e) => e.studentId)));
  };

  // ─ Push notification
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
      (e) => selectedRows.size === 0 || selectedRows.has(e.studentId),
    );
    for (const e of targets) {
      new Notification("Fees Due Reminder", {
        body: `Dear ${e.fatherName || "Parent"}, fees of ₹${e.totalDue} are due for ${e.studentName}. Please pay at the earliest.`,
      });
      await new Promise((r) => setTimeout(r, 200));
    }
    alert(`Push notifications sent to ${targets.length} students.`);
  };

  // ─ Month toggle
  const toggleMonth = (m: string) =>
    setSelMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  // ─ Heading toggle
  const toggleHeading = (id: string) =>
    setSelHeadings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // ─ Clear all
  const clearFilters = () => {
    setSelClass("");
    setSelSection("");
    setSelMonths([]);
    setSelHeadings([]);
    setGenerated(false);
    setSelectedRows(new Set());
  };

  const selectedEntries = sortedEntries.filter((e) =>
    selectedRows.has(e.studentId),
  );

  // ─ Resolve Certificate Studio DemandSlip template
  const demandSlipTemplate = useMemo(() => {
    const t =
      certTemplates.find(
        (t) => t.templateType === "DemandSlip" && t.isDefault,
      ) ?? certTemplates.find((t) => t.templateType === "DemandSlip");
    if (!t) return null;
    try {
      const parsed = JSON.parse(t.elementsJson) as {
        elements?: Array<{ label?: string; type?: string }>;
      };
      // Convert elements to a simple HTML block for injection into print window
      const parts: string[] = [];
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

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ overflowY: "auto" }}
      data-ocid="demand_register.page"
    >
      {/* Filter Panel — sticky at top */}
      <div
        className="bg-card border-b p-4"
        style={{ position: "sticky", top: 0, zIndex: 50 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="size-4 text-primary" />
            <h2 className="font-semibold text-foreground">
              Demand Register — Fees Dues List
            </h2>
            <Badge variant="outline" className="ml-auto text-xs">
              {currentSession}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {/* Class */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Class</Label>
              <select
                className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={selClass}
                onChange={(e) => {
                  setSelClass(e.target.value);
                  setSelSection("");
                }}
                data-ocid="demand_register.class.select"
              >
                <option value="">All Classes</option>
                {CLASS_ORDER.map((cl) => (
                  <option key={cl} value={cl}>
                    {CLASS_LABELS[cl]}
                  </option>
                ))}
              </select>
            </div>
            {/* Section */}
            <div>
              <Label className="text-xs font-medium mb-1 block">Section</Label>
              <select
                className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={selSection}
                onChange={(e) => setSelSection(e.target.value)}
                data-ocid="demand_register.section.select"
              >
                <option value="">All Sections</option>
                {filteredSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Months multi-select */}
          <div className="mb-3">
            <Label className="text-xs font-medium mb-1.5 block">
              Months (select specific months, or leave blank for all)
            </Label>
            <div
              className="flex flex-wrap gap-1.5"
              data-ocid="demand_register.months.filter"
            >
              {FEE_MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMonth(m)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selMonths.includes(m)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                  data-ocid={`demand_register.month.${m.toLowerCase()}`}
                >
                  {MONTH_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Fee Headings multi-select */}
          {feeHeadings.length > 0 && (
            <div className="mb-3">
              <Label className="text-xs font-medium mb-1.5 block">
                Fee Headings (leave blank for all)
              </Label>
              <div
                className="flex flex-wrap gap-2"
                data-ocid="demand_register.headings.filter"
              >
                {feeHeadings.map((h) => (
                  <label
                    key={h.id}
                    htmlFor={`hdg-${h.id}`}
                    className="flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <Checkbox
                      id={`hdg-${h.id}`}
                      checked={selHeadings.includes(h.id)}
                      onCheckedChange={() => toggleHeading(h.id)}
                    />
                    {h.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              onClick={() => {
                setSelectedRows(new Set());
                setGenerated(true);
              }}
              disabled={isLoading}
              data-ocid="demand_register.generate.button"
            >
              {isLoading ? (
                <RefreshCw className="size-3.5 mr-1.5 animate-spin" />
              ) : (
                <Filter className="size-3.5 mr-1.5" />
              )}
              Generate Report
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              data-ocid="demand_register.clear.button"
            >
              <X className="size-3.5 mr-1.5" /> Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Results Area — full scrollable */}
      <div className="p-4" style={{ minHeight: 0 }}>
        <div className="max-w-full">
          {isLoading && generated && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          )}

          {generated && !isLoading && sortedEntries.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="demand_register.empty_state"
            >
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-3">
                ✓
              </div>
              <h3 className="font-semibold text-foreground">No Dues Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All students are up to date with their fees for the selected
                filters.
              </p>
            </div>
          )}

          {generated && !isLoading && sortedEntries.length > 0 && (
            <>
              {/* Action Bar */}
              <div
                className="flex flex-wrap items-center gap-2 mb-3 p-3 bg-muted/40 rounded-lg border"
                data-ocid="demand_register.action_bar"
              >
                <span className="text-sm font-medium text-foreground">
                  {sortedEntries.length} student
                  {sortedEntries.length !== 1 ? "s" : ""} with dues
                  {selectedRows.size > 0 && (
                    <span className="text-primary ml-1">
                      ({selectedRows.size} selected)
                    </span>
                  )}
                </span>
                <div className="flex flex-wrap gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      printDemandSlips(
                        sortedEntries,
                        schoolInfo?.name ?? "School",
                        schoolInfo?.address ?? "",
                        demandSlipTemplate,
                      )
                    }
                    data-ocid="demand_register.print_all.button"
                  >
                    <Printer className="size-3.5 mr-1.5" /> Print All Slips
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setBulkWA(sortedEntries)}
                    data-ocid="demand_register.whatsapp_all.button"
                  >
                    <MessageCircle className="size-3.5 mr-1.5" /> WhatsApp All
                  </Button>
                  {selectedRows.size > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setBulkWA(selectedEntries)}
                      data-ocid="demand_register.whatsapp_selected.button"
                    >
                      <Send className="size-3.5 mr-1.5" /> WhatsApp Selected
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePushNotification}
                    data-ocid="demand_register.push_notification.button"
                  >
                    <Bell className="size-3.5 mr-1.5" /> Push Notification
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div
                className="overflow-x-auto rounded-lg border border-border"
                data-ocid="demand_register.table"
              >
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-muted/60 sticky top-0">
                    <tr>
                      <th className="p-2 border-b border-border">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={toggleAll}
                          aria-label="Select all"
                          data-ocid="demand_register.select_all.checkbox"
                        />
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Sr.
                      </th>
                      <th
                        className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("name")}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSort("name")
                        }
                      >
                        Student Name <SortIcon f="name" />
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Adm. No.
                      </th>
                      <th
                        className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("class")}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSort("class")
                        }
                      >
                        Class <SortIcon f="class" />
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Section
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Father Name
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Phone
                      </th>
                      <th className="p-2 border-b border-border text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Months Due
                      </th>
                      {resultHeadingIds.map((hid) => (
                        <th
                          key={hid}
                          className="p-2 border-b border-border text-right text-xs font-semibold text-muted-foreground whitespace-nowrap"
                        >
                          {headingNameMap[hid] ?? hid}
                        </th>
                      ))}
                      <th
                        className="p-2 border-b border-border text-right text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground"
                        onClick={() => handleSort("totalDue")}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSort("totalDue")
                        }
                      >
                        Total Due <SortIcon f="totalDue" />
                      </th>
                      <th className="p-2 border-b border-border text-center text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        WA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.map((entry, idx) => (
                      <tr
                        key={entry.studentId}
                        className="hover:bg-muted/30 transition-colors border-b border-border/50"
                        data-ocid={`demand_register.item.${idx + 1}`}
                      >
                        <td className="p-2 text-center">
                          <Checkbox
                            checked={selectedRows.has(entry.studentId)}
                            onCheckedChange={() => {
                              setSelectedRows((prev) => {
                                const next = new Set(prev);
                                if (next.has(entry.studentId))
                                  next.delete(entry.studentId);
                                else next.add(entry.studentId);
                                return next;
                              });
                            }}
                            data-ocid={`demand_register.checkbox.${idx + 1}`}
                          />
                        </td>
                        <td className="p-2 text-muted-foreground">{idx + 1}</td>
                        <td className="p-2 font-medium text-foreground whitespace-nowrap">
                          {entry.studentName}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {entry.admNo}
                        </td>
                        <td className="p-2 text-muted-foreground whitespace-nowrap">
                          {entry.className}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {entry.section}
                        </td>
                        <td className="p-2 text-muted-foreground whitespace-nowrap">
                          {entry.fatherName}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {entry.phone}
                        </td>
                        <td className="p-2 text-muted-foreground text-xs">
                          {entry.monthsDue
                            .map((m) => MONTH_LABELS[m] ?? m)
                            .join(", ")}
                        </td>
                        {resultHeadingIds.map((hid) => {
                          const d = entry.duesPerHeading.find(
                            (x) => x.headingId === hid,
                          );
                          return (
                            <td
                              key={hid}
                              className="p-2 text-right text-muted-foreground"
                            >
                              {d && d.amount > 0
                                ? `₹${d.amount.toLocaleString("en-IN")}`
                                : "—"}
                            </td>
                          );
                        })}
                        <td className="p-2 text-right font-bold text-foreground">
                          ₹{entry.totalDue.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-700 transition-colors"
                            onClick={() => setWaTarget(entry)}
                            aria-label={`Send WhatsApp to ${entry.studentName}`}
                            data-ocid={`demand_register.whatsapp.${idx + 1}`}
                          >
                            <MessageCircle className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5 font-semibold">
                      <td
                        colSpan={9 + resultHeadingIds.length}
                        className="p-2 text-sm text-foreground"
                      >
                        <CheckSquare className="size-4 inline mr-1.5 text-primary" />
                        Total: {sortedEntries.length} student
                        {sortedEntries.length !== 1 ? "s" : ""} with dues
                      </td>
                      <td className="p-2 text-right text-sm font-bold text-primary">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Individual WhatsApp Modal */}
      {waTarget && (
        <WhatsAppModal
          entry={waTarget}
          apiToken={settings?.whatsappApiKey ?? ""}
          onClose={() => setWaTarget(null)}
        />
      )}

      {/* Bulk WhatsApp Progress Modal */}
      {bulkWA && (
        <BulkWAModal
          entries={bulkWA}
          apiToken={settings?.whatsappApiKey ?? ""}
          onClose={() => setBulkWA(null)}
        />
      )}
    </div>
  );
}
