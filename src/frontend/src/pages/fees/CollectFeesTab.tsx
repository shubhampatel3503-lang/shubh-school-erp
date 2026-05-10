// CollectFeesTab — complete rewrite
// Export: DEFAULT export only (fixes React error #185 import/export mismatch)
// Pattern: load all data via useStudentFeeCollectionData composite hook.
//          Never render fee UI until ALL data is loaded.
//          No conditional hook calls.
//          Transport fee = pickup point monthly fare (not a fee heading).

import { FeeReceiptTemplate } from "@/components/certificates/FeeReceiptTemplate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useFeeHeadings,
  useFeePlans,
  useGetPreviousSessionBalance,
  useRecordPayment,
  useSchoolInfo,
  useStudentFeeCollectionData,
  useStudents,
} from "@/hooks/useBackend";
import {
  CLASS_LABELS,
  SCHOOL_MONTHS,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { FeeHeading, FeePayment, SchoolInfo, Student } from "@/types";
import {
  BookOpen,
  IndianRupee,
  Printer,
  Search,
  Settings,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = SCHOOL_MONTHS; // ['April','May','Jun',...,'March']
const TRANSPORT_MONTHS = MONTHS.filter((m) => m !== "June"); // 11 months (skip June)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function safeNum(v: unknown): number {
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Auto-select months April up to and including current calendar month.
 * Indian academic year: Apr=4 … Mar=3.
 * Today = May 2026  →  {April, May}
 */
function getAutoSelectedMonths(): Set<string> {
  const currentCalMonth = new Date().getMonth() + 1; // 1-12
  const academicOrder = [
    { name: "April", cal: 4 },
    { name: "May", cal: 5 },
    { name: "June", cal: 6 },
    { name: "July", cal: 7 },
    { name: "August", cal: 8 },
    { name: "September", cal: 9 },
    { name: "October", cal: 10 },
    { name: "November", cal: 11 },
    { name: "December", cal: 12 },
    { name: "January", cal: 1 },
    { name: "February", cal: 2 },
    { name: "March", cal: 3 },
  ];
  const selected = new Set<string>();
  for (const m of academicOrder) {
    selected.add(m.name);
    if (m.cal === currentCalMonth) break;
  }
  return selected;
}

// Display helper: blank when value is 0, show number otherwise
function numDisplay(override: string, fallback: number): string {
  if (override !== "") return override;
  if (fallback === 0 || !Number.isFinite(fallback)) return "";
  return String(fallback);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeeRow {
  headingId: string;
  headingName: string;
  month: string;
  amount: number;
  discount: number;
  net: number;
  paid: boolean;
  checked: boolean;
  isTransport: boolean;
}

// ─── Receipt Modal ────────────────────────────────────────────────────────────
function ReceiptModal({
  open,
  onClose,
  payment,
  student,
  schoolInfo,
  feeHeadings,
}: {
  open: boolean;
  onClose: () => void;
  payment: FeePayment | null;
  student: Student | null;
  schoolInfo: SchoolInfo;
  feeHeadings?: FeeHeading[];
}) {
  const [size, setSize] = useState<"a4" | "half" | "quarter">("quarter");
  if (!open || !payment || !student) return null;

  const mobile = student.fatherMobile || student.mobile || "";
  const whatsappText = encodeURIComponent(
    `*Fee Receipt*\nStudent: ${student.fullName}\nAdm No: ${student.admNo}\nClass: ${CLASS_LABELS[student.classLevel as keyof typeof CLASS_LABELS] ?? student.classLevel}\nReceipt No: ${payment.receiptNo}\nDate: ${formatDate(payment.paymentDate)}\nAmount Paid: \u20b9${payment.totalAmount.toLocaleString("en-IN")}\nBalance: \u20b9${(payment.balance ?? 0).toLocaleString("en-IN")}\n\nThank you for your payment!`,
  );
  const whatsappUrl = mobile
    ? `https://wa.me/91${mobile.replace(/\D/g, "")}?text=${whatsappText}`
    : "";

  function handlePrint() {
    const el = document.getElementById("fee-receipt-print");
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    const pageSize =
      size === "quarter"
        ? "105mm 148mm"
        : size === "half"
          ? "210mm 148mm"
          : "210mm 297mm";
    win.document.write(
      `<html><head><title>Fee Receipt</title><style>@page{size:${pageSize};margin:0}body{margin:0;padding:0}@media print{body{margin:0;padding:0}}</style></head><body style="margin:0;padding:0">${el.outerHTML}</body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  function handleEditTemplate() {
    onClose();
    window.location.href =
      "/certificate-studio?type=FeeReceipt&returnTo=%2Ffees";
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-auto z-[60]"
        data-ocid="fees.receipt.dialog"
      >
        <DialogHeader>
          <DialogTitle>Fee Receipt</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-3">
          <Label className="text-xs">Size:</Label>
          {(["half", "a4", "quarter"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                size === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {s === "a4" ? "A4 Full" : s === "half" ? "Half Page" : "Quarter"}
            </button>
          ))}
        </div>

        <div className="overflow-auto border border-border rounded">
          <FeeReceiptTemplate
            payment={payment}
            student={student}
            schoolInfo={schoolInfo}
            feeHeadings={feeHeadings}
            size={size}
          />
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {whatsappUrl && (
            <Button
              variant="outline"
              className="gap-2 border-green-500 text-green-700 hover:bg-green-50"
              onClick={() => window.open(whatsappUrl, "_blank")}
              data-ocid="fees.receipt.whatsapp_button"
            >
              📱 Send WhatsApp
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleEditTemplate}
            data-ocid="fees.receipt.edit_template_button"
          >
            <Settings size={14} /> Edit Template
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handlePrint}
            data-ocid="fees.receipt.print_button"
          >
            <Printer size={14} /> Print Receipt
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="fees.receipt.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component (DEFAULT EXPORT) ─────────────────────────────────────────
export default function CollectFeesTab() {
  const { currentUser, currentSession } = useAppStore();
  const collectedBy = currentUser?.fullName ?? "Admin";
  const isAdmin =
    (currentUser?.role?.toLowerCase() ?? "") === "admin" ||
    (currentUser?.role?.toLowerCase() ?? "") === "accountant";

  // ── All hooks at top level — NEVER conditionally called ───────────────────
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: feeHeadings = [], isLoading: loadingHeadings } =
    useFeeHeadings();
  const { data: feePlans = [], isLoading: loadingPlans } = useFeePlans();
  const { data: schoolInfoData } = useSchoolInfo();
  const recordPaymentMutation = useRecordPayment();

  const schoolInfo: SchoolInfo = schoolInfoData ?? {
    name: "SHUBH SCHOOL ERP",
    tagline: "",
    about: "",
    photoUrl: "",
    address: "",
    phone: "",
    email: "",
  };

  // ── UI state ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [rows, setRows] = useState<FeeRow[]>([]);
  const [payMode, setPayMode] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [receiptAmt, setReceiptAmt] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayIso());
  const [receiptPayment, setReceiptPayment] = useState<FeePayment | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);
  // Summary override fields — empty string = blank (never "0")
  const [discountOverride, setDiscountOverride] = useState("");
  const [lateFees, setLateFees] = useState("");
  const [oldBalOverride, setOldBalOverride] = useState("");
  // Previous year balance panel (current session unpaid balance)
  const [includePrevBalance, setIncludePrevBalance] = useState(false);
  // Previous SESSION due from getPreviousSessionBalance
  const [includePrevSessionDue, setIncludePrevSessionDue] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ── Composite data query — fires after a student is selected ─────────────
  // All hooks ALWAYS called — enabled flag controls execution
  const {
    data: feeData,
    isLoading: loadingFeeData,
    refetch: refetchFeeData,
  } = useStudentFeeCollectionData(selectedStudentId, currentSession);

  // Previous session balance from backend
  const { data: prevSessionData } = useGetPreviousSessionBalance(
    selectedStudentId,
    currentSession,
  );
  const prevSessionDueAmount =
    prevSessionData?.previousYearDue ?? prevSessionData?.amount ?? 0;

  // ── Auto-include previous year balance when fee data loads ───────────────
  useEffect(() => {
    if (!feeData) return;
    const oldBal = safeNum(feeData.oldBalanceAmount ?? 0);
    if (oldBal > 0) {
      setIncludePrevBalance(true);
    }
    setOldBalOverride("");
    setIncludePrevSessionDue(false);
  }, [feeData]);

  // ── Reset on session change ──────────────────────────────────────────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
  useEffect(() => {
    setSelectedStudentId("");
    setSearch("");
    setRows([]);
    setReceiptAmt("");
    setDiscountOverride("");
    setLateFees("");
    setOldBalOverride("");
    setIncludePrevSessionDue(false);
  }, [currentSession]);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Student object from allStudents (safe, always defined) ───────────────
  const student: Student | null = useMemo(() => {
    if (!selectedStudentId) return null;
    return allStudents.find((s) => s.id === selectedStudentId) ?? null;
  }, [allStudents, selectedStudentId]);

  // ── Filtered students for dropdown ──────────────────────────────────────
  const filteredStudents = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return allStudents
      .filter(
        (s) =>
          s?.fullName?.toLowerCase().includes(q) ||
          s?.admNo?.toLowerCase().includes(q) ||
          s?.fatherMobile?.includes(q),
      )
      .slice(0, 8);
  }, [allStudents, search]);

  // ── Family members ───────────────────────────────────────────────────────
  const familyMembers = useMemo((): Student[] => {
    if (!student?.fatherMobile) return [];
    return allStudents.filter(
      (s) =>
        s.id !== student.id &&
        s.fatherMobile === student.fatherMobile &&
        (s.sessionId === currentSession || !s.sessionId),
    );
  }, [allStudents, student, currentSession]);

  // ── Paid keys from payment history ──────────────────────────────────────
  const paidKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const p of feeData?.payments ?? []) {
      for (const it of p?.items ?? []) {
        if (it?.feeHeadingId && it?.month) {
          keys.add(`${it.feeHeadingId}::${it.month}`);
        }
      }
    }
    return keys;
  }, [feeData?.payments]);

  // ── Transport paid keys ──────────────────────────────────────────────────
  const transportPaidMonths = useMemo(() => {
    const months = new Set<string>();
    for (const p of feeData?.payments ?? []) {
      for (const it of p?.items ?? []) {
        if (it?.feeHeadingId === "transport" && it?.month) {
          months.add(it.month);
        }
      }
    }
    return months;
  }, [feeData?.payments]);

  // ── Fee plan amounts for current student's class ─────────────────────────
  const planAmounts = useMemo(() => {
    const map = new Map<string, number>();
    if (!student) return map;
    for (const p of feePlans) {
      if (
        p?.classLevel === student.classLevel &&
        (p.sessionId === currentSession || !p.sessionId)
      ) {
        if (p.feeHeadingId && p.monthlyAmount > 0) {
          map.set(p.feeHeadingId, p.monthlyAmount);
        }
      }
    }
    return map;
  }, [feePlans, student, currentSession]);

  // ── Build fee rows whenever student or data changes ──────────────────────
  useEffect(() => {
    if (!student || loadingFeeData) {
      setRows([]);
      return;
    }
    const autoMonths = getAutoSelectedMonths();
    const discounts = feeData?.discounts ?? [];
    const activeHeadings = feeHeadings.filter((h) => h?.isActive);
    const newRows: FeeRow[] = [];

    // Regular fee heading rows
    for (const heading of activeHeadings) {
      if (!heading?.id) continue;
      const months =
        heading.applicableMonths && heading.applicableMonths.length > 0
          ? heading.applicableMonths
          : MONTHS;
      for (const month of months) {
        const key = `${heading.id}::${month}`;
        const isPaid = paidKeys.has(key);
        const disc = discounts.find((d) => d?.feeHeadingId === heading.id);
        const discAmt = safeNum(disc?.monthlyDiscountAmount ?? 0);
        const baseAmt = planAmounts.get(heading.id) ?? 0;
        const netAmt = Math.max(0, baseAmt - discAmt);
        const autoCheck = !isPaid && netAmt > 0 && autoMonths.has(month);
        newRows.push({
          headingId: heading.id,
          headingName: heading.name ?? "",
          month,
          amount: baseAmt,
          discount: discAmt,
          net: netAmt,
          paid: isPaid,
          checked: autoCheck,
          isTransport: false,
        });
      }
    }

    // Transport fee rows — one per applicable month, if pickup point assigned
    const transportFare = feeData?.transportMonthlyFare ?? 0;
    if (
      student.transportRouteId &&
      (student.pickupPointId || transportFare > 0) &&
      transportFare > 0
    ) {
      const pickupName = feeData?.transportPickupPointName ?? "";
      for (const month of TRANSPORT_MONTHS) {
        const isPaid = transportPaidMonths.has(month);
        const autoCheck = !isPaid && autoMonths.has(month);
        newRows.push({
          headingId: "transport",
          headingName: pickupName
            ? `Transport Fee (Pickup: ${pickupName})`
            : "Transport Fee",
          month,
          amount: transportFare,
          discount: 0,
          net: transportFare,
          paid: isPaid,
          checked: autoCheck,
          isTransport: true,
        });
      }
    }

    setRows(newRows);
  }, [
    student,
    loadingFeeData,
    feeData,
    feeHeadings,
    paidKeys,
    transportPaidMonths,
    planAmounts,
  ]);

  // ── Select student ───────────────────────────────────────────────────────
  const selectStudent = useCallback((s: Student) => {
    setSelectedStudentId(s.id);
    setSearch(s.fullName ?? "");
    setShowDropdown(false);
    setReceiptAmt("");
    setRemarks("");
    setDiscountOverride("");
    setLateFees("");
    setOldBalOverride("");
    setIncludePrevBalance(false);
    setIncludePrevSessionDue(false);
  }, []);

  const clearStudent = useCallback(() => {
    setSelectedStudentId("");
    setSearch("");
    setRows([]);
    setShowDropdown(false);
    setReceiptAmt("");
    setIncludePrevBalance(false);
  }, []);

  // ── Row toggles ──────────────────────────────────────────────────────────
  function toggleRow(headingId: string, month: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.headingId === headingId && r.month === month && !r.paid
          ? { ...r, checked: !r.checked }
          : r,
      ),
    );
  }

  function toggleHeading(headingId: string, checked: boolean) {
    setRows((prev) =>
      prev.map((r) =>
        r.headingId === headingId && !r.paid ? { ...r, checked } : r,
      ),
    );
  }

  function toggleMonthColumn(month: string) {
    const hasUnpaid = rows.some(
      (r) => r.month === month && !r.paid && r.net > 0,
    );
    if (!hasUnpaid) return;
    const allChecked = rows
      .filter((r) => r.month === month && !r.paid && r.net > 0)
      .every((r) => r.checked);
    setRows((prev) =>
      prev.map((r) =>
        r.month === month && !r.paid && r.net > 0
          ? { ...r, checked: !allChecked }
          : r,
      ),
    );
  }

  function selectAllUnpaid() {
    setRows((prev) =>
      prev.map((r) => (!r.paid && r.net > 0 ? { ...r, checked: true } : r)),
    );
  }

  // ── Amount calculations ──────────────────────────────────────────────────
  const checkedRows = useMemo(
    () => rows.filter((r) => r.checked && !r.paid && r.net > 0),
    [rows],
  );
  const subtotal = useMemo(
    () => checkedRows.reduce((s, r) => s + r.net, 0),
    [checkedRows],
  );

  // Previous year balance from backend (oldBalanceAmount)
  const prevYearBalance = useMemo(
    () => safeNum(feeData?.oldBalanceAmount ?? 0),
    [feeData?.oldBalanceAmount],
  );

  const oldBalAmt = useMemo(() => {
    // oldBalOverride is the manual override in summary panel
    if (oldBalOverride !== "") return safeNum(oldBalOverride);
    // current session unpaid: if prev year panel is checked, use prevYearBalance; otherwise 0
    const currentSessionBal = includePrevBalance ? prevYearBalance : 0;
    // previous session due: if checkbox checked
    const prevSessBal = includePrevSessionDue ? prevSessionDueAmount : 0;
    return currentSessionBal + prevSessBal;
  }, [
    oldBalOverride,
    includePrevBalance,
    prevYearBalance,
    includePrevSessionDue,
    prevSessionDueAmount,
  ]);

  const discountAmt = useMemo(() => {
    if (discountOverride !== "") return safeNum(discountOverride);
    const headingIds = new Set(checkedRows.map((r) => r.headingId));
    return (feeData?.discounts ?? [])
      .filter((d) => headingIds.has(d.feeHeadingId))
      .reduce((s, d) => s + safeNum(d.monthlyDiscountAmount), 0);
  }, [feeData?.discounts, checkedRows, discountOverride]);

  const lateFeesAmt = lateFees === "" ? 0 : safeNum(lateFees);

  const computedTotal = Math.max(
    0,
    subtotal + oldBalAmt + lateFeesAmt - discountAmt,
  );
  const receiptAmtNum = receiptAmt === "" ? computedTotal : safeNum(receiptAmt);
  const balanceAmt = computedTotal - receiptAmtNum;

  // ── Distinct headings / visible months ───────────────────────────────────
  const activeHeadingIds = useMemo(
    () => [...new Set(rows.map((r) => r.headingId))],
    [rows],
  );
  const visibleMonths = useMemo(() => {
    const ms = new Set<string>();
    for (const r of rows) ms.add(r.month);
    return MONTHS.filter((m) => ms.has(m));
  }, [rows]);

  // ── Collect payment ──────────────────────────────────────────────────────
  async function handleCollect() {
    if (!student) return;
    if (checkedRows.length === 0) {
      toast.error("Select fee items to collect");
      return;
    }
    if (receiptAmtNum <= 0) {
      toast.error("Enter amount to collect");
      return;
    }
    // Build heading name lookup so the receipt can show proper names immediately
    const headingNameById = new Map<string, string>();
    for (const h of feeHeadings) {
      if (h?.id && h?.name) headingNameById.set(h.id, h.name);
    }
    const items = checkedRows.map((r) => ({
      headingId: r.headingId,
      month: r.month,
      amount: BigInt(Math.round(r.net)),
    }));
    try {
      const result = await recordPaymentMutation.mutateAsync({
        studentId: student.id,
        sessionId: currentSession,
        paymentDate,
        items,
        otherFee: null,
        totalAmount: BigInt(Math.round(receiptAmtNum)),
        totalDue: BigInt(Math.round(computedTotal)),
        paymentMode: payMode,
        upiRef: null,
        remarks: remarks || null,
        createdBy: collectedBy,
      });
      toast.success("Payment recorded!");
      setReceiptAmt("");
      setRemarks("");
      setDiscountOverride("");
      setLateFees("");
      setOldBalOverride("");
      setIncludePrevBalance(false);
      // refresh fee data
      refetchFeeData();
      // Enrich items with resolved heading names for immediate receipt display
      const enrichedResult: FeePayment = {
        ...result,
        items: result.items.map((it) => ({
          ...it,
          feeHeadingName:
            headingNameById.get(it.feeHeadingId) ??
            checkedRows.find(
              (r) => r.headingId === it.feeHeadingId && r.month === it.month,
            )?.headingName ??
            it.feeHeadingName,
        })),
      };
      // show receipt
      setReceiptPayment(enrichedResult);
      setShowReceipt(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to record payment",
      );
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loadingStudents || loadingHeadings || loadingPlans) {
    return (
      <div className="p-6 space-y-4" data-ocid="fees.collect.loading_state">
        <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
          <div className="h-7 w-32 rounded bg-muted animate-pulse" />
          <div className="flex-1 h-8 min-w-[220px] rounded bg-muted animate-pulse" />
        </div>
        <div className="bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading fee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" data-ocid="fees.collect.page">
      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className="border-primary/40 text-primary font-bold px-3 py-1 text-sm"
          data-ocid="fees.collect.session.badge"
        >
          Session: {currentSession}
        </Badge>

        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Date:
          </Label>
          {isAdmin ? (
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="h-8 w-40 text-xs"
              data-ocid="fees.collect.date.input"
            />
          ) : (
            <span
              className="text-xs font-medium text-foreground bg-muted/40 px-2 py-1 rounded border border-border select-none"
              data-ocid="fees.collect.date.readonly"
            >
              {paymentDate.split("-").reverse().join("/")}
            </span>
          )}
        </div>

        {/* Student search */}
        <div ref={searchRef} className="relative flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => search.length >= 2 && setShowDropdown(true)}
              placeholder="Search student by name or admission no..."
              className="pl-8 pr-8 h-8 text-sm"
              data-ocid="fees.collect.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={clearStudent}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear"
                data-ocid="fees.collect.clear_button"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {showDropdown && filteredStudents.length > 0 && (
            <div
              className="absolute top-full mt-1 left-0 right-0 z-[9999] bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
              data-ocid="fees.collect.search.popover"
            >
              {filteredStudents.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectStudent(s)}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
                  data-ocid={`fees.collect.search.item.${idx + 1}`}
                >
                  <div className="font-medium text-foreground text-sm">
                    {s.fullName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.admNo} ·{" "}
                    {CLASS_LABELS[s.classLevel as keyof typeof CLASS_LABELS] ??
                      s.classLevel}{" "}
                    · {s.fatherMobile}
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown &&
            search.length >= 2 &&
            filteredStudents.length === 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 z-[9999] bg-popover border border-border rounded-lg shadow-xl px-4 py-3 text-sm text-muted-foreground">
                No students found
              </div>
            )}
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      {!student ? (
        <div
          className="bg-card border border-dashed border-border rounded-xl py-20 text-center"
          data-ocid="fees.collect.no_student.empty_state"
        >
          <User className="size-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-foreground mb-1">
            Search for a Student
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter name or admission number above to begin fee collection
          </p>
        </div>
      ) : loadingFeeData ? (
        <div
          className="bg-card border border-dashed border-border rounded-xl py-16 text-center flex flex-col items-center gap-3"
          data-ocid="fees.collect.student_loading.loading_state"
        >
          <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading fee data for {student.fullName}...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Student info bar */}
          <div className="bg-card border border-border rounded-lg px-4 py-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Student</p>
              <p className="font-semibold text-foreground">
                {student.fullName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Adm No</p>
              <p className="font-semibold text-foreground">{student.admNo}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Class</p>
              <p className="font-semibold text-foreground">
                {CLASS_LABELS[
                  student.classLevel as keyof typeof CLASS_LABELS
                ] ?? student.classLevel}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Father</p>
              <p className="font-semibold text-foreground">
                {student.fatherName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Mobile</p>
              <p className="font-semibold text-foreground">
                {student.fatherMobile}
              </p>
            </div>
            {(feeData?.oldBalanceAmount ?? 0) > 0 && (
              <div className="bg-orange-50 rounded px-2 py-1">
                <p className="text-muted-foreground">Old Balance</p>
                <p className="font-bold text-orange-700">
                  {formatCurrency(feeData?.oldBalanceAmount ?? 0)}
                </p>
              </div>
            )}
            {feeData?.transportMonthlyFare &&
            feeData.transportMonthlyFare > 0 ? (
              <div className="flex items-center gap-1 bg-blue-50 rounded px-2 py-1">
                <Truck size={12} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-muted-foreground">Transport</p>
                  <p className="font-semibold text-blue-700">
                    {formatCurrency(feeData.transportMonthlyFare)}/mo
                  </p>
                  {feeData.transportPickupPointName && (
                    <p className="text-[10px] text-blue-500">
                      {feeData.transportPickupPointName}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Previous Year Balance Panel ── Only shown when oldBalance > 0 */}
          {prevYearBalance > 0 && (
            <div
              className="border-2 border-orange-400 bg-orange-50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
              data-ocid="fees.collect.prev_balance.panel"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-orange-800 text-sm">
                    Old Balance (Current Session)
                  </h4>
                  <p className="text-2xl font-extrabold text-red-600">
                    {formatCurrency(prevYearBalance)}
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    Unpaid balance from earlier in this session
                  </p>
                </div>
              </div>
              <label
                className="flex items-center gap-3 cursor-pointer select-none shrink-0 bg-white border border-orange-300 rounded-lg px-4 py-3 hover:bg-orange-50 transition-colors"
                data-ocid="fees.collect.prev_balance.include_checkbox"
                htmlFor="include-prev-balance"
              >
                <Checkbox
                  checked={includePrevBalance}
                  onCheckedChange={(c) => setIncludePrevBalance(!!c)}
                  id="include-prev-balance"
                  className="size-5"
                />
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    Include in this payment
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Adds {formatCurrency(prevYearBalance)} to total
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* ── Previous Session Due Panel ── shown when prev session balance exists */}
          {prevSessionDueAmount > 0 && (
            <div
              className="border-2 border-red-400 bg-red-50 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
              data-ocid="fees.collect.prev_session_due.panel"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">💸</span>
                <div>
                  <h4 className="font-bold text-red-800 text-sm">
                    Previous Session Due
                    {prevSessionData?.sessionId ? (
                      <span className="ml-1 text-xs font-normal">
                        ({prevSessionData.sessionId})
                      </span>
                    ) : null}
                  </h4>
                  <p className="text-2xl font-extrabold text-red-600">
                    {formatCurrency(prevSessionDueAmount)}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Outstanding from previous academic year
                  </p>
                </div>
              </div>
              <label
                className="flex items-center gap-3 cursor-pointer select-none shrink-0 bg-white border border-red-300 rounded-lg px-4 py-3 hover:bg-red-50 transition-colors"
                data-ocid="fees.collect.prev_session_due.include_checkbox"
                htmlFor="include-prev-session-due"
              >
                <Checkbox
                  checked={includePrevSessionDue}
                  onCheckedChange={(c) => setIncludePrevSessionDue(!!c)}
                  id="include-prev-session-due"
                  className="size-5"
                />
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    Include in this payment
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Adds {formatCurrency(prevSessionDueAmount)} to total
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Inventory due */}
          {(feeData?.inventoryDue ?? 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="text-xl">📦</span>
              <div>
                <span className="font-semibold text-amber-800">
                  Inventory Due: {formatCurrency(feeData?.inventoryDue ?? 0)}
                </span>
                <span className="ml-2 text-xs text-amber-600">
                  (Collect separately from Inventory module)
                </span>
              </div>
            </div>
          )}

          {/* Fee grid */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">
                Fee Grid
              </h3>
              <button
                type="button"
                className="text-xs text-primary underline hover:no-underline"
                onClick={selectAllUnpaid}
                data-ocid="fees.collect.select_all_button"
              >
                √ Select All Unpaid
              </button>
            </div>
            <div className="overflow-x-auto">
              <table
                className="w-full text-xs"
                data-ocid="fees.collect.fee_table"
              >
                <thead className="bg-muted/20 border-b border-border">
                  <tr>
                    <th className="text-center px-2 py-2 w-8">✓</th>
                    <th className="text-left px-3 py-2 font-semibold text-foreground min-w-[140px]">
                      Fee Head
                    </th>
                    {visibleMonths.map((m) => {
                      const colRows = rows.filter((r) => r.month === m);
                      const colFullyPaid =
                        colRows.length > 0 &&
                        colRows.every((r) => r.paid || r.net === 0);
                      const colAllChecked =
                        !colFullyPaid &&
                        colRows
                          .filter((r) => !r.paid && r.net > 0)
                          .every((r) => r.checked);
                      return (
                        <th
                          key={m}
                          className={`text-right px-2 py-2 font-semibold min-w-[72px] transition-colors select-none ${
                            colFullyPaid
                              ? "text-muted-foreground/40 cursor-default"
                              : "text-foreground cursor-pointer hover:bg-primary/10"
                          } ${
                            colAllChecked && !colFullyPaid
                              ? "bg-primary/10 text-primary"
                              : ""
                          }`}
                          data-ocid={`fees.collect.month_header.${m.toLowerCase()}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleMonthColumn(m)}
                            className="w-full h-full text-inherit font-inherit text-right"
                            tabIndex={0}
                            aria-label={`Toggle ${m} column`}
                          >
                            {m.slice(0, 3)}
                          </button>
                        </th>
                      );
                    })}
                    <th className="text-right px-3 py-2 font-semibold text-foreground w-20">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeHeadingIds.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleMonths.length + 3}
                        className="px-3 py-8 text-center text-muted-foreground"
                        data-ocid="fees.collect.grid.empty_state"
                      >
                        No fee plan configured for this class. Please set up fee
                        headings and fee plan first.
                      </td>
                    </tr>
                  ) : (
                    activeHeadingIds.map((hid, hi) => {
                      const hRows = rows.filter((r) => r.headingId === hid);
                      const hName = hRows[0]?.headingName ?? hid;
                      const isTransportRow = hRows[0]?.isTransport ?? false;
                      const allChecked =
                        hRows.filter((r) => !r.paid).length > 0 &&
                        hRows.filter((r) => !r.paid).every((r) => r.checked);
                      const rowTotal = hRows
                        .filter((r) => r.checked && !r.paid)
                        .reduce((s, r) => s + r.net, 0);

                      return (
                        <tr
                          key={hid}
                          className={`border-b border-border hover:bg-muted/10 transition-colors ${
                            isTransportRow ? "bg-blue-50/30" : ""
                          }`}
                          data-ocid={`fees.collect.row.${hi + 1}`}
                        >
                          <td className="px-2 py-2 text-center">
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={(c) => toggleHeading(hid, !!c)}
                              data-ocid={`fees.collect.heading_checkbox.${hi + 1}`}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium text-foreground">
                            <div className="flex items-center gap-1">
                              {isTransportRow && (
                                <Truck
                                  size={11}
                                  className="text-blue-500 shrink-0"
                                />
                              )}
                              {hName}
                            </div>
                          </td>
                          {visibleMonths.map((m) => {
                            const row = hRows.find((r) => r.month === m);
                            if (!row) {
                              return (
                                <td
                                  key={m}
                                  className="px-2 py-2 text-right text-muted-foreground/30"
                                >
                                  —
                                </td>
                              );
                            }
                            if (row.paid) {
                              return (
                                <td key={m} className="px-2 py-2 text-right">
                                  <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-300 rounded px-1.5 py-0.5">
                                    Paid
                                  </span>
                                </td>
                              );
                            }
                            return (
                              <td
                                key={m}
                                className={`px-2 py-2 text-right transition-colors ${
                                  row.checked ? "bg-primary/5" : ""
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleRow(hid, m)}
                                  className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${
                                    row.checked
                                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                                      : "bg-muted/20 border-border text-muted-foreground"
                                  }`}
                                  data-ocid={`fees.collect.cell.${hi + 1}.${m.toLowerCase()}`}
                                >
                                  ₹{row.net.toLocaleString("en-IN")}
                                </button>
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-right font-semibold text-foreground">
                            {rowTotal > 0
                              ? `₹${rowTotal.toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}

                  {/* Totals row */}
                  {activeHeadingIds.length > 0 && (
                    <tr className="bg-primary/5 font-bold border-t-2 border-primary/20">
                      <td
                        colSpan={2}
                        className="px-3 py-3 text-left text-foreground text-sm"
                      >
                        TOTAL
                      </td>
                      {visibleMonths.map((m) => {
                        const colTotal = rows
                          .filter((r) => r.month === m && r.checked && !r.paid)
                          .reduce((s, r) => s + r.net, 0);
                        return (
                          <td
                            key={m}
                            className="px-2 py-3 text-right text-foreground"
                          >
                            {colTotal > 0
                              ? `₹${colTotal.toLocaleString("en-IN")}`
                              : "—"}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-right text-primary text-sm">
                        {formatCurrency(subtotal)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: mode + remarks */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">
                Payment Details
              </h3>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Mode</Label>
                <Select value={payMode} onValueChange={setPayMode}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    data-ocid="fees.collect.payment_mode.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="NEFT">NEFT / RTGS</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Remarks (optional)</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional remarks..."
                  rows={2}
                  className="text-xs"
                  data-ocid="fees.collect.remarks.textarea"
                />
              </div>
            </div>

            {/* Right: summary */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Total</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {/* Old Balance — manual override (separate from prev balance panels) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Additional Old Balance (₹)
                    </Label>
                    {includePrevBalance && prevYearBalance > 0 && (
                      <span className="text-xs text-orange-600 font-medium">
                        + Prev Bal: {formatCurrency(prevYearBalance)}
                      </span>
                    )}
                    {includePrevSessionDue && prevSessionDueAmount > 0 && (
                      <span className="text-xs text-red-600 font-medium">
                        + Prev Sess: {formatCurrency(prevSessionDueAmount)}
                      </span>
                    )}
                  </div>
                  <Input
                    value={oldBalOverride}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value))
                        setOldBalOverride(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") setOldBalOverride("");
                    }}
                    placeholder=""
                    className="h-8 text-xs"
                    data-ocid="fees.collect.old_balance.input"
                  />
                </div>

                {/* Discount */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Discount Amount (₹)
                  </Label>
                  <Input
                    value={numDisplay(discountOverride, discountAmt)}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value))
                        setDiscountOverride(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") setDiscountOverride("");
                    }}
                    placeholder=""
                    className="h-8 text-xs text-green-700"
                    data-ocid="fees.collect.discount.input"
                  />
                </div>

                {/* Late Fees */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Late Fees (₹)
                  </Label>
                  <Input
                    value={lateFees}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value))
                        setLateFees(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") setLateFees("");
                    }}
                    placeholder=""
                    className="h-8 text-xs"
                    data-ocid="fees.collect.late_fees.input"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-1.5">
                <Label className="text-xs">Receipt Amount (₹)</Label>
                <Input
                  value={
                    receiptAmt === ""
                      ? computedTotal > 0
                        ? String(computedTotal)
                        : ""
                      : receiptAmt
                  }
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value))
                      setReceiptAmt(e.target.value);
                  }}
                  className="h-9 text-base font-bold"
                  placeholder="Amount to collect"
                  data-ocid="fees.collect.receipt_amt.input"
                />
                <div
                  className={`flex justify-between text-sm font-semibold pt-1 ${
                    balanceAmt > 0
                      ? "text-destructive"
                      : balanceAmt < 0
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  <span>Balance</span>
                  <span>
                    {balanceAmt === 0
                      ? "✓ Paid in Full"
                      : balanceAmt < 0
                        ? `Overpaid: ${formatCurrency(Math.abs(balanceAmt))}`
                        : formatCurrency(balanceAmt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Collect button bar */}
          <div
            className="bg-card border border-border rounded-lg px-4 py-3 flex flex-wrap items-center gap-3"
            data-ocid="fees.collect.bottom_bar"
          >
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {checkedRows.length}
              </span>{" "}
              item{checkedRows.length !== 1 ? "s" : ""} ·{" "}
              <span className="font-semibold text-primary">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={clearStudent}
              data-ocid="fees.collect.new_button"
            >
              New Student
            </Button>
            <Button
              size="sm"
              className="gap-2 font-semibold min-w-[140px]"
              onClick={handleCollect}
              disabled={
                checkedRows.length === 0 ||
                receiptAmtNum <= 0 ||
                recordPaymentMutation.isPending
              }
              data-ocid="fees.collect.submit_button"
            >
              <IndianRupee size={14} />
              {recordPaymentMutation.isPending
                ? "Saving..."
                : `Collect ${receiptAmtNum > 0 ? formatCurrency(receiptAmtNum) : ""}`}
            </Button>
          </div>

          {/* Family section */}
          {familyMembers.length > 0 && (
            <div
              className="bg-card border border-border rounded-lg overflow-hidden"
              data-ocid="fees.collect.family.section"
            >
              <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                  Family Members (Same Mobile: {student.fatherMobile})
                </h3>
                <Badge variant="outline" className="text-xs">
                  {familyMembers.length}
                </Badge>
              </div>
              <div className="p-4 space-y-2">
                {familyMembers.map((sib, idx) => (
                  <div
                    key={sib.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    data-ocid={`fees.collect.family.item.${idx + 1}`}
                  >
                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        {sib.fullName}
                      </span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {CLASS_LABELS[
                          sib.classLevel as keyof typeof CLASS_LABELS
                        ] ?? sib.classLevel}{" "}
                        · {sib.admNo}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectStudent(sib)}
                      data-ocid={`fees.collect.family.select_button.${idx + 1}`}
                    >
                      Collect Fees
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment history */}
          <div
            className="bg-card border border-border rounded-lg overflow-hidden"
            data-ocid="fees.collect.history.section"
          >
            <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                  Payment History — {currentSession}
                </h3>
              </div>
              <Badge variant="outline">
                {(feeData?.payments ?? []).length} receipt
                {(feeData?.payments ?? []).length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {(feeData?.payments ?? []).length === 0 ? (
              <div
                className="py-8 text-center text-muted-foreground text-sm"
                data-ocid="fees.collect.history.empty_state"
              >
                No payments recorded yet for this session
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/20 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        Date
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        Receipt No
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        Months
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-foreground">
                        Amount (₹)
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-destructive">
                        Balance
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        Mode
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        By
                      </th>
                      <th className="text-center px-4 py-2.5 font-semibold text-foreground">
                        Print
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(feeData?.payments ?? []).map((p, pi) => {
                      const totalAmt = safeNum(p?.totalAmount ?? 0);
                      const items = Array.isArray(p?.items) ? p.items : [];
                      return (
                        <tr
                          key={p?.id ?? pi}
                          className="border-b border-border last:border-0 hover:bg-muted/10"
                          data-ocid={`fees.collect.history.item.${pi + 1}`}
                        >
                          <td className="px-4 py-2.5 text-muted-foreground">
                            {formatDate(p?.paymentDate ?? "")}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-primary font-medium">
                            {p?.receiptNo ?? "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex flex-wrap gap-1">
                              {items.slice(0, 3).map((it) => (
                                <Badge
                                  key={`${it?.feeHeadingId ?? ""}-${it?.month ?? ""}`}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {it?.month || it?.feeHeadingName || "—"}
                                </Badge>
                              ))}
                              {items.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{items.length - 3}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                            {formatCurrency(totalAmt)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold">
                            {p?.balance != null && p.balance > 0 ? (
                              <span className="text-destructive">
                                {formatCurrency(p.balance)}
                              </span>
                            ) : (
                              <span className="text-emerald-600 text-xs">
                                Paid
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge variant="outline" className="text-xs">
                              {p?.paymentMethod ?? "Cash"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">
                            {p?.collectedBy ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7"
                              title="Print Receipt"
                              onClick={() => {
                                // Enrich history payment items with resolved heading names
                                const headingNameById = new Map<
                                  string,
                                  string
                                >();
                                for (const h of feeHeadings) {
                                  if (h?.id && h?.name)
                                    headingNameById.set(h.id, h.name);
                                }
                                const enriched: FeePayment = {
                                  ...p,
                                  items: (Array.isArray(p?.items)
                                    ? p.items
                                    : []
                                  ).map((it) => ({
                                    ...it,
                                    feeHeadingName:
                                      headingNameById.get(
                                        it?.feeHeadingId ?? "",
                                      ) ??
                                      it?.feeHeadingName ??
                                      it?.feeHeadingId ??
                                      "",
                                  })),
                                };
                                setReceiptPayment(enriched);
                                setShowReceipt(true);
                              }}
                              data-ocid={`fees.collect.reprint_button.${pi + 1}`}
                            >
                              <Printer size={12} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        open={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setReceiptPayment(null);
        }}
        payment={receiptPayment}
        student={student}
        schoolInfo={schoolInfo}
        feeHeadings={feeHeadings}
      />

      {/* Delete confirm (kept for future use) */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          className="sm:max-w-sm z-[60]"
          data-ocid="fees.collect.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Payment?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete this payment record.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="fees.collect.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeletingPayment}
              onClick={() => {
                // delete handled externally
                setIsDeletingPayment(false);
                setDeleteId(null);
              }}
              data-ocid="fees.collect.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
