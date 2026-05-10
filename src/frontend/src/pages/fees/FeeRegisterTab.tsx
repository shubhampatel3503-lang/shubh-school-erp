import { createActor } from "@/backend";
import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type {
  FeeRegisterEntry,
  FeeRegisterEntryDetailed,
} from "@/hooks/useBackend";
import {
  useAllFeePaymentsBySession,
  useGetFeeRegisterBySession,
  useGetFeeRegisterByUser,
  useStudents,
} from "@/hooks/useBackend";
import {
  CLASS_LABELS,
  CLASS_ORDER,
  SCHOOL_MONTHS,
  downloadCSV,
  formatCurrency,
  formatDate,
  sessionYears,
} from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel, FeePayment } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Download,
  Loader2,
  Pencil,
  ScrollText,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Edit fee payment mutation ─────────────────────────────────────────────────────
function useUpdatePayment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: string;
      paymentDate: string;
      totalAmount: number;
      paymentMode: string;
    }) => {
      if (!actor) throw new Error("Backend not available");
      return actor.updateFeePayment(
        p.id,
        {
          paymentDate: p.paymentDate,
          totalAmount: p.totalAmount,
          paymentMode: p.paymentMode,
        },
        "admin",
        "Admin",
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feePayments"] });
      qc.invalidateQueries({ queryKey: ["feeRegister"] });
      qc.invalidateQueries({ queryKey: ["allFeePaymentsBySession"] });
    },
  });
}

function useDeletePaymentLocal() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend not available");
      return actor.deletePayment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feePayments"] });
      qc.invalidateQueries({ queryKey: ["feeRegister"] });
      qc.invalidateQueries({ queryKey: ["allFeePaymentsBySession"] });
    },
  });
}

interface FeeAuditEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  paymentId: string;
  studentId: string;
}

function AuditLogModal({
  studentId,
  onClose,
}: { studentId: string | null; onClose: () => void }) {
  const { data: logs = [], isLoading } = useGetFeeAuditLogs(studentId, null);
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-3xl max-h-[80vh] overflow-y-auto z-[9999]"
        data-ocid="fees.audit_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="size-4" /> Fee Audit Trail
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No audit records found.
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Timestamp
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Admin
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Action
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Field
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Old Value
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    New Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {(logs as FeeAuditEntry[]).map((l, i) => (
                  <tr
                    key={l.id ?? i}
                    className="border-b border-border last:border-0 hover:bg-muted/10"
                  >
                    <td className="px-3 py-2 text-muted-foreground">
                      {l.timestamp ?? "—"}
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {l.adminName ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="text-[10px]">
                        {l.action ?? "—"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {l.fieldChanged ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-destructive">
                      {l.oldValue ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-green-600">
                      {l.newValue ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="fees.audit_dialog.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditPaymentForm {
  id: string;
  paymentDate: string;
  totalAmount: string;
  paymentMode: string;
}

function EditPaymentModal({
  payment,
  onClose,
}: { payment: EditPaymentForm; onClose: () => void }) {
  const [date, setDate] = useState(payment.paymentDate);
  const [amount, setAmount] = useState(payment.totalAmount);
  const [mode, setMode] = useState(payment.paymentMode || "Cash");
  const updatePayment = useUpdatePayment();

  async function handleSave() {
    try {
      await updatePayment.mutateAsync({
        id: payment.id,
        paymentDate: date,
        totalAmount: Number(amount),
        paymentMode: mode,
      });
      toast.success("Payment record updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update payment. Please try again.");
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v && !updatePayment.isPending) onClose();
      }}
    >
      <DialogContent className="z-[9999]" data-ocid="fees.edit_payment_dialog">
        <DialogHeader>
          <DialogTitle>Edit Payment Record</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Payment Date</Label>
            <DateInput
              value={date}
              onChange={(iso) => setDate(iso)}
              data-ocid="fees.edit_payment.date_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="fees.edit_payment.amount_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Payment Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger data-ocid="fees.edit_payment.mode_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {["Cash", "UPI", "Cheque", "NEFT", "Online"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updatePayment.isPending}
            data-ocid="fees.edit_payment.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePayment.isPending}
            data-ocid="fees.edit_payment.save_button"
          >
            {updatePayment.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" /> Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectorLabel(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function studentName(
  studentId: string,
  students: { id: string; fullName: string }[],
) {
  return students.find((s) => s.id === studentId)?.fullName ?? studentId;
}

function studentClass(
  studentId: string,
  students: { id: string; classLevel: ClassLevel }[],
) {
  const s = students.find((st) => st.id === studentId);
  return s
    ? (CLASS_LABELS[s.classLevel as keyof typeof CLASS_LABELS] ?? s.classLevel)
    : "—";
}

function studentSection(
  studentId: string,
  students: { id: string; sectionId?: string }[],
) {
  return students.find((s) => s.id === studentId)?.sectionId ?? "—";
}

function paymentModeBadge(mode: string) {
  const variants: Record<string, string> = {
    Cash: "bg-blue-100 text-blue-700 border-blue-300",
    UPI: "bg-green-100 text-green-700 border-green-300",
    Cheque: "bg-yellow-100 text-yellow-700 border-yellow-300",
    NEFT: "bg-purple-100 text-purple-700 border-purple-300",
    Online: "bg-indigo-100 text-indigo-700 border-indigo-300",
  };
  return variants[mode] ?? "bg-muted text-muted-foreground border-border";
}

// ─── Collector Row ────────────────────────────────────────────────────────────

interface CollectorGroup {
  collectorId: string;
  payments: FeeRegisterEntry[];
  total: number;
}

function CollectorRow({
  group,
  students,
  index,
}: {
  group: CollectorGroup;
  students: { id: string; fullName: string; classLevel: ClassLevel }[];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
        onClick={() => setExpanded((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((p) => !p);
        }}
        tabIndex={0}
        data-ocid={`fees.collector.row.${index}`}
      >
        <td className="px-3 py-3 w-8">
          {expanded ? (
            <ChevronDown size={14} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={14} className="text-muted-foreground" />
          )}
        </td>
        <td className="px-3 py-3 font-semibold text-foreground">
          <span className="flex items-center gap-2">
            <span className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center uppercase">
              {collectorLabel(group.collectorId).charAt(0)}
            </span>
            {collectorLabel(group.collectorId)}
            <Badge variant="outline" className="text-xs font-normal">
              {group.collectorId}
            </Badge>
          </span>
        </td>
        <td className="px-3 py-3 text-right text-foreground font-medium">
          {group.payments.length}
        </td>
        <td className="px-3 py-3 text-right font-bold text-green-600">
          {formatCurrency(group.total)}
        </td>
      </tr>

      {expanded &&
        group.payments.map((p, pi) => (
          <tr
            key={p.id}
            className="bg-muted/20 border-b border-border/50 text-xs"
            data-ocid={`fees.collector.detail.${index}.${pi + 1}`}
          >
            <td className="px-3 py-2" />
            <td className="px-3 py-2">
              <div className="font-medium text-foreground">
                {studentName(p.studentId, students)}
              </div>
              <div className="text-muted-foreground">
                {studentClass(p.studentId, students)}
              </div>
            </td>
            <td className="px-3 py-2 text-right">
              <div className="text-foreground">{formatDate(p.paymentDate)}</div>
              <div className="text-muted-foreground">
                Receipt: {p.receiptNo}
              </div>
            </td>
            <td className="px-3 py-2 text-right">
              <div className="font-bold text-green-600">
                {formatCurrency(Number(p.totalAmount))}
              </div>
            </td>
          </tr>
        ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FeeRegisterTab() {
  // Use global session as source of truth
  const globalSession = useAppStore((s) => s.currentSession);
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";

  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: byUserRaw = [], isLoading: loadingRegister } =
    useGetFeeRegisterByUser();

  const sessions = sessionYears();

  // Filter session initialized to global session, kept in sync
  const [filterSession, setFilterSession] = useState(globalSession);
  const [filterClass, setFilterClass] = useState<ClassLevel | "all">("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterCollector, setFilterCollector] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterPrevDuesOnly, setFilterPrevDuesOnly] = useState(false);
  const [view, setView] = useState<"detailed" | "date" | "collector">(
    "detailed",
  );
  const [detailPage, setDetailPage] = useState(1);
  const DETAIL_PAGE_SIZE = 25;

  // Admin-only edit/delete/audit state
  const [editPayment, setEditPayment] = useState<EditPaymentForm | null>(null);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [showAudit, setShowAudit] = useState(false);
  const deletePaymentMut = useDeletePaymentLocal();

  // Sync filterSession when globalSession changes
  useEffect(() => {
    setFilterSession(globalSession);
  }, [globalSession]);

  // ── All payments for session (detailed view) ────────────────────────────────────
  const { data: allSessionPayments = [], isLoading: loadingAllPayments } =
    useAllFeePaymentsBySession(filterSession);
  const {
    data: sessionRegisterEntries = [],
    isLoading: loadingRegisterEntries,
  } = useGetFeeRegisterBySession(filterSession);

  // ── By Student view ───────────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const studentSession =
        (s as { session?: string }).session ??
        (s as { sessionId?: string }).sessionId ??
        "";
      if (filterClass !== "all" && s.classLevel !== filterClass) return false;
      if (studentSession && studentSession !== filterSession) return false;
      if (filterPrevDuesOnly) {
        const oldBalance =
          (s as { oldBalance?: number; balance?: number }).oldBalance ??
          (s as { oldBalance?: number; balance?: number }).balance ??
          0;
        if (oldBalance <= 0) return false;
      }
      return true;
    });
  }, [students, filterClass, filterSession, filterPrevDuesOnly]);

  const allCollectorPayments = useMemo(
    () => byUserRaw.flatMap(([, pmts]) => pmts),
    [byUserRaw],
  );

  const paidByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of allCollectorPayments) {
      if (!p.isDeleted) {
        map[p.studentId] = (map[p.studentId] ?? 0) + Number(p.totalAmount);
      }
    }
    return map;
  }, [allCollectorPayments]);

  const totalCollected = useMemo(
    () =>
      allCollectorPayments
        .filter((p) => !p.isDeleted)
        .reduce((sum, p) => sum + Number(p.totalAmount), 0),
    [allCollectorPayments],
  );

  // ── By Collector view ─────────────────────────────────────────────────────
  const collectorGroups = useMemo<CollectorGroup[]>(
    () =>
      byUserRaw.map(([id, payments]) => ({
        collectorId: id,
        payments: payments.filter((p) => !p.isDeleted),
        total: payments
          .filter((p) => !p.isDeleted)
          .reduce((s, p) => s + Number(p.totalAmount), 0),
      })),
    [byUserRaw],
  );

  const grandTotal = useMemo(
    () => collectorGroups.reduce((s, g) => s + g.total, 0),
    [collectorGroups],
  );
  const totalTxns = useMemo(
    () => collectorGroups.reduce((s, g) => s + g.payments.length, 0),
    [collectorGroups],
  );

  // ── Unique collectors for filter ─────────────────────────────────────────
  const uniqueCollectors = useMemo(() => {
    const set = new Set<string>();
    for (const p of allSessionPayments) {
      if (p.collectedBy) set.add(p.collectedBy);
    }
    return Array.from(set);
  }, [allSessionPayments]);

  // ── Detailed view filtered payments ──────────────────────────────────────
  const detailedPayments = useMemo(() => {
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
    students,
  ]);

  const detailTotalPages = Math.max(
    1,
    Math.ceil(detailedPayments.length / DETAIL_PAGE_SIZE),
  );
  const detailPagedPayments = useMemo(
    () =>
      detailedPayments.slice(
        (detailPage - 1) * DETAIL_PAGE_SIZE,
        detailPage * DETAIL_PAGE_SIZE,
      ),
    [detailedPayments, detailPage],
  );

  // ── Export handlers ───────────────────────────────────────────────────────
  function handleExportDetailed() {
    const exportRows: FeeRegisterEntryDetailed[] =
      sessionRegisterEntries.length > 0
        ? sessionRegisterEntries.filter((e) => !e.isDeleted)
        : detailedPayments.map((p) => {
            const s = students.find((st) => st.id === p.studentId);
            const months = [
              ...new Set(p.items.map((it) => it.month).filter(Boolean)),
            ];
            return {
              id: p.id,
              studentId: p.studentId,
              studentName: s?.fullName ?? p.studentId,
              className: s
                ? (CLASS_LABELS[s.classLevel as keyof typeof CLASS_LABELS] ??
                  s.classLevel)
                : "",
              sectionName: s?.sectionId ?? "",
              receiptNo: p.receiptNo,
              paymentDate: p.paymentDate,
              months,
              totalDue: (p as { totalDue?: number }).totalDue ?? 0,
              totalAmount: p.totalAmount,
              discountTotal: 0,
              lateFees: 0,
              balance: (p as { balance?: number }).balance ?? 0,
              paymentMode: p.paymentMethod ?? "Cash",
              collectedBy: p.collectedBy ?? "",
              sessionId: filterSession,
              isDeleted: false,
            };
          });
    const data = exportRows.map((e) => {
      const s = students.find((st) => st.id === e.studentId);
      return {
        Date: formatDate(e.paymentDate),
        "Receipt No": e.receiptNo,
        "Student Name": e.studentName || s?.fullName || e.studentId,
        Class:
          e.className ||
          (s
            ? (CLASS_LABELS[s.classLevel as keyof typeof CLASS_LABELS] ??
              s.classLevel)
            : "—"),
        Section: e.sectionName || s?.sectionId || "—",
        "Months Paid": e.months.join(", ") || "—",
        "Total Due (₹)": e.totalDue,
        "Amount Paid (₹)": e.totalAmount,
        "Balance (₹)": e.balance,
        "Fee Receiver": e.collectedBy,
        "Mode of Payment": e.paymentMode,
      };
    });
    downloadCSV(data, `fee-register-${filterSession}.csv`);
  }

  function handleExportByDate() {
    const data = filteredStudents.map((s) => ({
      "Adm No": s.admNo,
      "Student Name": s.fullName,
      Class:
        CLASS_LABELS[s.classLevel as keyof typeof CLASS_LABELS] ?? s.classLevel,
      "Total Paid": paidByStudent[s.id] ?? 0,
    }));
    downloadCSV(data, `fee-register-${filterSession}.csv`);
  }

  function handleExportByCollector() {
    const data = collectorGroups.flatMap((g) =>
      g.payments.map((p) => ({
        Collector: collectorLabel(g.collectorId),
        "Collector ID": g.collectorId,
        "Receipt No": p.receiptNo,
        Student: studentName(p.studentId, students),
        Class: studentClass(p.studentId, students),
        "Amount (₹)": Number(p.totalAmount),
        Date: formatDate(p.paymentDate),
      })),
    );
    downloadCSV(data, "fee-register-by-collector.csv");
  }

  const isLoading = loadingStudents || loadingRegister;
  const isDetailedLoading =
    loadingStudents || loadingAllPayments || loadingRegisterEntries;

  return (
    <div className="p-6 space-y-5">
      {/* Session badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Fee Register
          </h2>
          <p className="text-sm text-muted-foreground">
            View and export all fee collections
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
          data-ocid="fees.register.session.badge"
        >
          Session: {globalSession}
        </span>
      </div>
      {/* View toggle */}
      <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg w-fit border border-border">
        <button
          type="button"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "detailed" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setView("detailed")}
          data-ocid="fees.register.view.detailed.tab"
        >
          Detailed View
        </button>
        <button
          type="button"
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "date" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setView("date")}
          data-ocid="fees.register.view.date.tab"
        >
          By Student
        </button>
        {isAdmin && (
          <button
            type="button"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "collector" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setView("collector")}
            data-ocid="fees.register.view.collector.tab"
          >
            By Collector
          </button>
        )}
      </div>

      {/* ── DETAILED VIEW ───────────────────────────────────────────────────── */}
      {view === "detailed" && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.detail.collected.card"
            >
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Filtered Total
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(
                    detailedPayments.reduce((s, p) => s + p.totalAmount, 0),
                  )}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.detail.receipts.card"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Receipts</div>
                <div className="text-xl font-bold text-foreground">
                  {detailedPayments.length}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.detail.session.card"
            >
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Session</div>
                <div className="text-xl font-bold text-foreground">
                  {filterSession}
                </div>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Session</span>
              <Select
                value={filterSession}
                onValueChange={(v) => {
                  setFilterSession(v);
                  setDetailPage(1);
                }}
              >
                <SelectTrigger
                  className="w-28 h-8"
                  data-ocid="fees.register.detail.session.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Class</span>
              <Select
                value={filterClass}
                onValueChange={(v) => {
                  setFilterClass(v as ClassLevel | "all");
                  setDetailPage(1);
                }}
              >
                <SelectTrigger
                  className="w-32 h-8"
                  data-ocid="fees.register.detail.class.select"
                >
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c as keyof typeof CLASS_LABELS] ?? c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Month</span>
              <Select
                value={filterMonth}
                onValueChange={(v) => {
                  setFilterMonth(v);
                  setDetailPage(1);
                }}
              >
                <SelectTrigger
                  className="w-28 h-8"
                  data-ocid="fees.register.detail.month.select"
                >
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {SCHOOL_MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Mode</span>
              <Select
                value={filterMode}
                onValueChange={(v) => {
                  setFilterMode(v);
                  setDetailPage(1);
                }}
              >
                <SelectTrigger
                  className="w-28 h-8"
                  data-ocid="fees.register.detail.mode.select"
                >
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  {["Cash", "UPI", "Cheque", "NEFT", "Online"].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {uniqueCollectors.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Receiver</span>
                <Select
                  value={filterCollector}
                  onValueChange={(v) => {
                    setFilterCollector(v);
                    setDetailPage(1);
                  }}
                >
                  <SelectTrigger
                    className="w-32 h-8"
                    data-ocid="fees.register.detail.collector.select"
                  >
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueCollectors.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">From</span>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => {
                  setFilterDateFrom(e.target.value);
                  setDetailPage(1);
                }}
                className="h-8 w-36 text-xs"
                data-ocid="fees.register.detail.date_from.input"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">To</span>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => {
                  setFilterDateTo(e.target.value);
                  setDetailPage(1);
                }}
                className="h-8 w-36 text-xs"
                data-ocid="fees.register.detail.date_to.input"
              />
            </div>

            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDetailed}
                className="gap-2"
                data-ocid="fees.register.detail.export_button"
              >
                <Download size={14} /> Export CSV
              </Button>
            </div>
          </div>

          {/* Detailed table */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Receipt No
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground min-w-[120px]">
                      Student Name
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Adm No
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Class
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Section
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground min-w-[120px]">
                      Months
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Total Amount
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Paid Amount
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Balance
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Fee Receiver
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Mode
                    </th>
                    {isAdmin && (
                      <th className="text-center px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isDetailedLoading ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.register.detail.loading_state"
                      >
                        Loading fee register...
                      </td>
                    </tr>
                  ) : detailPagedPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.register.detail.empty_state"
                      >
                        No payments found for the selected filters
                      </td>
                    </tr>
                  ) : (
                    detailPagedPayments.map((p, ri) => {
                      const payment = p as FeePayment;
                      const s = students.find(
                        (st) => st.id === payment.studentId,
                      );
                      const months = [
                        ...new Set(
                          (payment.items ?? [])
                            .map((it) => it.month)
                            .filter(Boolean),
                        ),
                      ].join(", ");
                      const mode = payment.paymentMethod ?? "Cash";
                      return (
                        <tr
                          key={payment.id ?? ri}
                          className="border-b border-border last:border-0 hover:bg-muted/10"
                          data-ocid={`fees.register.detail.row.${ri + 1}`}
                        >
                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-3 py-2 font-mono text-primary font-medium">
                            {payment.receiptNo || "—"}
                          </td>
                          <td className="px-3 py-2 font-medium text-foreground">
                            {s?.fullName ?? payment.studentId}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {s?.admNo ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="secondary" className="text-xs">
                              {s
                                ? (CLASS_LABELS[
                                    s.classLevel as keyof typeof CLASS_LABELS
                                  ] ?? s.classLevel)
                                : "—"}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {studentSection(payment.studentId, students)}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {months || "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-foreground">
                            {formatCurrency(payment.totalAmount)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-green-600">
                            {formatCurrency(payment.totalAmount)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {(() => {
                              const bal =
                                (payment as FeePayment & { balance?: number })
                                  .balance ?? 0;
                              return bal > 0 ? (
                                <span className="text-destructive">
                                  {formatCurrency(bal)}
                                </span>
                              ) : (
                                <span className="text-emerald-600 text-xs">
                                  Paid
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">
                            {payment.collectedBy || "—"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${paymentModeBadge(mode)}`}
                            >
                              {mode}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                  onClick={() =>
                                    setEditPayment({
                                      id: payment.id ?? "",
                                      paymentDate: payment.paymentDate ?? "",
                                      totalAmount: String(payment.totalAmount),
                                      paymentMode:
                                        payment.paymentMethod ?? "Cash",
                                    })
                                  }
                                  data-ocid={`fees.register.detail.edit.${ri + 1}`}
                                >
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-destructive"
                                  onClick={() =>
                                    setDeletePaymentId(payment.id ?? "")
                                  }
                                  data-ocid={`fees.register.detail.delete.${ri + 1}`}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {detailedPayments.length > 0 && (
                  <tfoot className="bg-muted/30 border-t border-border">
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-2.5 font-bold text-foreground text-xs"
                      >
                        Total ({detailedPayments.length} receipts)
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-foreground">
                        {formatCurrency(
                          detailedPayments.reduce(
                            (s, p) => s + p.totalAmount,
                            0,
                          ),
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-600">
                        {formatCurrency(
                          detailedPayments.reduce(
                            (s, p) => s + p.totalAmount,
                            0,
                          ),
                        )}
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            {detailTotalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Page {detailPage} of {detailTotalPages} ·{" "}
                  {detailedPayments.length} records
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={detailPage <= 1}
                    onClick={() => setDetailPage((p) => p - 1)}
                    data-ocid="fees.register.detail.pagination_prev"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={detailPage >= detailTotalPages}
                    onClick={() => setDetailPage((p) => p + 1)}
                    data-ocid="fees.register.detail.pagination_next"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={() => setShowAudit(true)}
                data-ocid="fees.register.audit_button"
              >
                <ScrollText size={14} /> View Audit Trail
              </Button>
            </div>
          )}
        </>
      )}

      {/* ── BY STUDENT VIEW ──────────────────────────────────────── */}
      {/* ── BY STUDENT VIEW ──────────────────────────────────────────────────── */}
      {view === "date" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.collected.card"
            >
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Total Collected
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(totalCollected)}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.students.card"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Students (Filtered)
                </div>
                <div className="text-xl font-bold text-foreground">
                  {filteredStudents.length}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.register.transactions.card"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Total Transactions
                </div>
                <div className="text-xl font-bold text-foreground">
                  {allCollectorPayments.filter((p) => !p.isDeleted).length}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label
                className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors select-none px-2 py-1.5 rounded border border-border bg-card hover:bg-muted/40"
                data-ocid="fees.register.prev_dues.toggle"
              >
                <input
                  type="checkbox"
                  className="size-3.5 accent-primary rounded"
                  checked={filterPrevDuesOnly}
                  onChange={(e) => setFilterPrevDuesOnly(e.target.checked)}
                />
                <span>Prev Year Dues Only</span>
              </label>
              <Select value={filterSession} onValueChange={setFilterSession}>
                <SelectTrigger
                  className="w-32"
                  data-ocid="fees.register.session.select"
                >
                  <SelectValue placeholder="Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterClass}
                onValueChange={(v) => setFilterClass(v as ClassLevel | "all")}
              >
                <SelectTrigger
                  className="w-36"
                  data-ocid="fees.register.class.select"
                >
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c as keyof typeof CLASS_LABELS] ?? c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={handleExportByDate}
              className="gap-2"
              data-ocid="fees.register.export_button"
            >
              <Download size={14} /> Export CSV
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 border-b border-border sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Adm No
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground min-w-[140px]">
                      Name
                    </th>
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Class
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Total Paid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.register.loading_state"
                      >
                        Loading fee register...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.register.empty_state"
                      >
                        No students found for selected filters
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, ri) => {
                      const paid = paidByStudent[s.id] ?? 0;
                      return (
                        <tr
                          key={s.id}
                          className="border-b border-border last:border-0 hover:bg-muted/10"
                          data-ocid={`fees.register.row.${ri + 1}`}
                        >
                          <td className="px-3 py-2 font-mono text-muted-foreground">
                            {s.admNo}
                          </td>
                          <td className="px-3 py-2 font-medium text-foreground">
                            {s.fullName}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="secondary" className="text-xs">
                              {CLASS_LABELS[
                                s.classLevel as keyof typeof CLASS_LABELS
                              ] ?? s.classLevel}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-green-600">
                            {paid > 0 ? formatCurrency(paid) : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {filteredStudents.length > 0 && (
                  <tfoot className="bg-muted/30 border-t border-border">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-2.5 font-bold text-foreground text-xs"
                      >
                        Total ({filteredStudents.length} students)
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-600">
                        {formatCurrency(totalCollected)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── BY COLLECTOR VIEW ────────────────────────────────────────────────── */}
      {view === "collector" && isAdmin && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.collector.total.card"
            >
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  Total Collected
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.collector.collectors.card"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  No. of Collectors
                </div>
                <div className="text-xl font-bold text-foreground">
                  {collectorGroups.length}
                </div>
              </div>
            </div>
            <div
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
              data-ocid="fees.collector.txns.card"
            >
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  No. of Transactions
                </div>
                <div className="text-xl font-bold text-foreground">
                  {totalTxns}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleExportByCollector}
              className="gap-2"
              data-ocid="fees.collector.export_button"
            >
              <Download size={14} /> Export CSV
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="w-8 px-3 py-2.5" />
                    <th className="text-left px-3 py-2.5 font-semibold text-foreground">
                      Collector
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Transactions
                    </th>
                    <th className="text-right px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">
                      Total Collected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.collector.loading_state"
                      >
                        Loading collection records...
                      </td>
                    </tr>
                  ) : collectorGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 text-center text-muted-foreground"
                        data-ocid="fees.collector.empty_state"
                      >
                        No fee collection records found
                      </td>
                    </tr>
                  ) : (
                    collectorGroups.map((g, gi) => (
                      <CollectorRow
                        key={g.collectorId}
                        group={g}
                        students={students}
                        index={gi + 1}
                      />
                    ))
                  )}
                </tbody>
                {collectorGroups.length > 0 && (
                  <tfoot className="bg-muted/30 border-t border-border">
                    <tr>
                      <td
                        colSpan={2}
                        className="px-3 py-2.5 font-bold text-foreground text-xs"
                      >
                        Grand Total ({collectorGroups.length} collectors)
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-foreground">
                        {totalTxns}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-600">
                        {formatCurrency(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-right">
            ℹ️ Click any row to expand and view individual transactions. Records
            are permanent.
          </p>
        </>
      )}
      {isAdmin && editPayment && (
        <EditPaymentModal
          payment={editPayment}
          onClose={() => setEditPayment(null)}
        />
      )}
      {isAdmin && deletePaymentId && (
        <Dialog open onOpenChange={() => setDeletePaymentId(null)}>
          <DialogContent
            className="z-[9999]"
            data-ocid="fees.delete_payment_dialog"
          >
            <DialogHeader>
              <DialogTitle>Delete Payment Record?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Delete this payment record? Student fee balance will be
              recalculated.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletePaymentId(null)}
                data-ocid="fees.delete_payment.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deletePaymentMut.isPending}
                onClick={async () => {
                  try {
                    await deletePaymentMut.mutateAsync(deletePaymentId);
                    toast.success("Payment deleted");
                  } catch {
                    toast.error("Failed to delete");
                  } finally {
                    setDeletePaymentId(null);
                  }
                }}
                data-ocid="fees.delete_payment.confirm_button"
              >
                {deletePaymentMut.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isAdmin && showAudit && (
        <AuditLogModal studentId={null} onClose={() => setShowAudit(false)} />
      )}
    </div>
  );
}

function useGetFeeAuditLogs(_s: string | null, _p: string | null) {
  return { data: [], isLoading: false };
}
