/**
 * Staff Payment System Tab
 * Role-based:
 *   Admin      → full access (salary, payouts, incentives, loans, calculate payroll)
 *   Accountant → record payments, see payout history, see month status (no salary amounts)
 *   Others     → read-only month status grid
 */
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { EnhancedPayrollResult } from "@/hooks/useBackend";
import {
  useAddStaffIncentive,
  useAddStaffLoan,
  useAddStaffPayout,
  useCalculateEnhancedPayroll,
  useDeleteStaffIncentive,
  useDeleteStaffPayout,
  useGetEnhancedPayroll,
  useGetStaffIncentives,
  useGetStaffLoans,
  useGetStaffPaymentSummary,
  useGetStaffPayouts,
  useGetStaffSalary,
  useGetStaffYearEndSummary,
  useStaff,
  useUpdateLoanRepayment,
  useUpdateStaffSalary,
} from "@/hooks/useBackend";
import { getInitials } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { Staff } from "@/types";
import {
  AlertCircle,
  Award,
  Banknote,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  IndianRupee,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Indian FY months (April–March) ───────────────────────────────────────────
const FY_MONTHS = [
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

const MONTH_SHORT: Record<string, string> = {
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

const PAYMENT_MODES = [
  "Cash",
  "Online",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
];
const INCENTIVE_REASONS = [
  "Performance Bonus",
  "Festival Bonus",
  "Special Achievement",
  "Other",
];

function currentFYYear(): string {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  if (mo >= 4) return `${yr}-${String(yr + 1).slice(2)}`;
  return `${yr - 1}-${String(yr).slice(2)}`;
}

function formatINR(n: number): string {
  if (!n && n !== 0) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function isoToDDMMYYYY(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// Convert YYYY-MM or YYYY-MM-DD to month name
function monthFromKey(key: string): string {
  if (!key) return "";
  // "2025-04" or "2025-04-01" → "April"
  const parts = key.split("-");
  const m = Number.parseInt(parts[1] ?? "0");
  const names = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[m] ?? key;
}

function fyMonthKey(month: string, fyYear: string): string {
  const startYear = Number.parseInt(fyYear.split("-")[0]);
  const idx = FY_MONTHS.indexOf(month);
  // idx 0=Apr, idx 8=Dec are in start year; idx 9=Jan, 10=Feb, 11=Mar are in start+1
  const year = idx <= 8 ? startYear : startYear + 1;
  const monthNum = idx + 4 <= 12 ? idx + 4 : idx - 8;
  return `${year}-${String(monthNum).padStart(2, "0")}`;
}

function getMonthStatus(
  status: string,
): "paid" | "partial" | "overdue" | "upcoming" {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "fullypaid" || s === "fully_paid") return "paid";
  if (s === "partial" || s === "partiallypaid" || s === "partially_paid")
    return "partial";
  if (s === "overdue" || s === "unpaid") return "overdue";
  return "upcoming";
}

const STATUS_COLORS = {
  paid: "bg-green-500/15 text-green-700 border-green-500/30",
  partial: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  overdue: "bg-red-500/15 text-red-700 border-red-500/30",
  upcoming: "bg-muted/40 text-muted-foreground border-border",
};

const STATUS_DOT = {
  paid: "bg-green-500",
  partial: "bg-yellow-500",
  overdue: "bg-red-500",
  upcoming: "bg-muted-foreground/30",
};

// ─── Staff Card (left panel) ──────────────────────────────────────────────────
interface StaffCardProps {
  staff: Staff;
  isSelected: boolean;
  summaryMap: Record<string, string>;
  onClick: () => void;
}
function StaffCard({ staff, isSelected, summaryMap, onClick }: StaffCardProps) {
  const last6 = FY_MONTHS.slice(-6);
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`staff_payment.staff_card.${staff.staffCode}`}
      className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-sm ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:bg-muted/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          {getInitials(staff.fullName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm truncate">
            {staff.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {staff.designation}
          </p>
        </div>
        {isSelected && (
          <ChevronRight className="size-4 text-primary shrink-0" />
        )}
      </div>
      <div className="flex gap-1 mt-2 pl-12">
        {last6.map((m) => {
          const st = getMonthStatus(summaryMap[m] ?? "upcoming");
          return (
            <span
              key={m}
              title={`${m}: ${st}`}
              className={`size-2.5 rounded-full inline-block ${STATUS_DOT[st]}`}
            />
          );
        })}
      </div>
    </button>
  );
}

// ─── Month Grid Card ──────────────────────────────────────────────────────────
interface MonthCardProps {
  month: string;
  status: "paid" | "partial" | "overdue" | "upcoming";
  amountPaid: number;
  netSalary?: number;
  isAdmin: boolean;
  onClick: () => void;
}
function MonthCard({
  month,
  status,
  amountPaid,
  netSalary,
  isAdmin,
  onClick,
}: MonthCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border text-left hover:shadow-md transition-all ${STATUS_COLORS[status]}`}
      data-ocid={`staff_payment.month_card.${month.toLowerCase()}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold text-base">{MONTH_SHORT[month]}</span>
        <span
          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
        >
          {status === "paid"
            ? "PAID"
            : status === "partial"
              ? "PART"
              : status === "overdue"
                ? "DUE"
                : "—"}
        </span>
      </div>
      {isAdmin && (
        <div className="mt-1">
          <p className="text-[11px] font-mono font-semibold">
            {formatINR(amountPaid)}
            {netSalary ? ` / ${formatINR(netSalary)}` : ""}
          </p>
        </div>
      )}
    </button>
  );
}

// ─── Record Payment Dialog ────────────────────────────────────────────────────
interface RecordPaymentDialogProps {
  staffId: string;
  recordedBy: string;
  open: boolean;
  defaultMonth?: string;
  onClose: () => void;
  onSaved: () => void;
}
function RecordPaymentDialog({
  staffId,
  recordedBy,
  open,
  defaultMonth,
  onClose,
  onSaved,
}: RecordPaymentDialogProps) {
  const [month, setMonth] = useState(defaultMonth ?? FY_MONTHS[0]);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState("");
  const addPayout = useAddStaffPayout();

  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await addPayout.mutateAsync({
        staffId,
        amount: amt,
        mode,
        date,
        notes: notes || month,
        recordedBy,
      });
      toast.success(`Payment of ${formatINR(amt)} recorded for ${month}`);
      setAmount("");
      setNotes("");
      onSaved();
    } catch {
      toast.error("Failed to record payment");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-md"
        data-ocid="staff_payment.record_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="size-5 text-primary" /> Record Payment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger data-ocid="staff_payment.record.month_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {FY_MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger data-ocid="staff_payment.record.mode_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {PAYMENT_MODES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Amount (₹)</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-ocid="staff_payment.record.amount_input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="staff_payment.record.date_input"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes (optional)</Label>
            <Input
              placeholder="e.g. Advance, Festival bonus part..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-ocid="staff_payment.record.notes_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="staff_payment.record.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={addPayout.isPending}
            data-ocid="staff_payment.record.save_button"
          >
            {addPayout.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Calculate Payroll Dialog ────────────────────────────────────────────────
interface CalcPayrollDialogProps {
  staff: Staff;
  open: boolean;
  onClose: () => void;
}
function CalcPayrollDialog({ staff, open, onClose }: CalcPayrollDialogProps) {
  const [month, setMonth] = useState(FY_MONTHS[0]);
  const [workingDays, setWorkingDays] = useState("26");
  const calcMutation = useCalculateEnhancedPayroll();
  const [result, setResult] = useState<EnhancedPayrollResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fyYear = currentFYYear();

  async function handleCalculate() {
    setLoading(true);
    try {
      const wd = Number.parseFloat(workingDays) || 26;
      const mk = fyMonthKey(month, fyYear);
      const res = await calcMutation.mutateAsync({
        staffId: staff.id,
        month: mk,
        workingDays: wd,
      });
      setResult(res);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to calculate payroll",
      );
    } finally {
      setLoading(false);
    }
  }

  const advancePaid = result?.advancePaid ?? 0;
  const netSalary = result?.netSalary ?? 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-lg"
        data-ocid="staff_payment.calc_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" /> Calculate Payroll —{" "}
            {staff.fullName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Month</Label>
              <Select
                value={month}
                onValueChange={(v) => {
                  setMonth(v);
                  setResult(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {FY_MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Working Days in Month</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={workingDays}
                onChange={(e) => {
                  setWorkingDays(e.target.value);
                  setResult(null);
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full"
            data-ocid="staff_payment.calc.calculate_button"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Calculator className="size-4 mr-2" />
            )}
            Calculate
          </Button>
          {result && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Attendance</div>
                <div className="font-medium text-right">
                  {result.attendanceDays} / {result.workingDays} days
                </div>
                <div className="text-muted-foreground">Absent Days</div>
                <div className="font-medium text-right">
                  {result.absentDays}
                  {result.deductibleDays > 0 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({result.deductibleDays} deductible)
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground">Gross Salary</div>
                <div className="font-mono font-medium text-right">
                  {formatINR(result.grossSalary)}
                </div>
                {result.deductions > 0 && (
                  <>
                    <div className="text-destructive">Deductions</div>
                    <div className="font-mono font-medium text-right text-destructive">
                      -{formatINR(result.deductions)}
                    </div>
                  </>
                )}
                {result.incentives > 0 && (
                  <>
                    <div className="text-green-600">Incentives</div>
                    <div className="font-mono font-medium text-right text-green-600">
                      +{formatINR(result.incentives)}
                    </div>
                  </>
                )}
                {result.loanDeduction > 0 && (
                  <>
                    <div className="text-orange-600">Loan Deduction</div>
                    <div className="font-mono font-medium text-right text-orange-600">
                      -{formatINR(result.loanDeduction)}
                    </div>
                  </>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  NET SALARY
                </span>
                <span className="text-2xl font-bold font-display text-primary">
                  {formatINR(netSalary)}
                </span>
              </div>
              {advancePaid > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Amount Paid So Far
                  </span>
                  <span className="font-mono font-semibold">
                    {formatINR(advancePaid)}
                  </span>
                </div>
              )}
              {netSalary - advancePaid > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-destructive font-semibold">
                    Balance Due
                  </span>
                  <span className="font-mono font-bold text-destructive">
                    {formatINR(netSalary - advancePaid)}
                  </span>
                </div>
              )}
              {result.paymentStatus && (
                <Badge
                  className={
                    STATUS_COLORS[getMonthStatus(result.paymentStatus)]
                  }
                >
                  {result.paymentStatus}
                </Badge>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="staff_payment.calc.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Incentive Dialog ─────────────────────────────────────────────────────
interface AddIncentiveDialogProps {
  staffId: string;
  approvedBy: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}
function AddIncentiveDialog({
  staffId,
  approvedBy,
  open,
  onClose,
  onSaved,
}: AddIncentiveDialogProps) {
  const [month, setMonth] = useState(FY_MONTHS[0]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(INCENTIVE_REASONS[0]);
  const mutation = useAddStaffIncentive();

  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await mutation.mutateAsync({
        staffId,
        amount: amt,
        reason,
        month,
        approvedBy,
      });
      toast.success(`Incentive of ${formatINR(amt)} added`);
      setAmount("");
      onSaved();
    } catch {
      toast.error("Failed to add incentive");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-sm"
        data-ocid="staff_payment.incentive_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="size-5 text-primary" /> Add Incentive
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {FY_MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Amount (₹)</Label>
            <Input
              type="number"
              min={0}
              placeholder="e.g. 2000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="staff_payment.incentive.amount_input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {INCENTIVE_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            data-ocid="staff_payment.incentive.save_button"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Add Incentive"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Loan Dialog ──────────────────────────────────────────────────────────
interface AddLoanDialogProps {
  staffId: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}
function AddLoanDialog({
  staffId,
  open,
  onClose,
  onSaved,
}: AddLoanDialogProps) {
  const [principal, setPrincipal] = useState("");
  const [monthly, setMonthly] = useState("");
  const [startMonth, setStartMonth] = useState(FY_MONTHS[0]);
  const [notes, setNotes] = useState("");
  const mutation = useAddStaffLoan();

  async function handleSave() {
    const p = Number.parseFloat(principal);
    const m = Number.parseFloat(monthly);
    if (!p || p <= 0 || !m || m <= 0) {
      toast.error("Enter valid principal and monthly deduction");
      return;
    }
    try {
      await mutation.mutateAsync({
        staffId,
        principalAmount: p,
        monthlyDeduction: m,
        startMonth,
        notes,
      });
      toast.success(`Loan of ${formatINR(p)} recorded`);
      setPrincipal("");
      setMonthly("");
      setNotes("");
      onSaved();
    } catch {
      toast.error("Failed to add loan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-sm"
        data-ocid="staff_payment.loan_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="size-5 text-primary" /> Add Loan / Advance
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Principal Amount (₹)</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 50000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                data-ocid="staff_payment.loan.principal_input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Monthly Deduction (₹)</Label>
              <Input
                type="number"
                min={0}
                placeholder="e.g. 5000"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                data-ocid="staff_payment.loan.monthly_input"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Start Month</Label>
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {FY_MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea
              rows={2}
              placeholder="Reason for loan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            data-ocid="staff_payment.loan.save_button"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save Loan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Loan Repayment Dialog ────────────────────────────────────────────────────
interface RepaymentDialogProps {
  loanId: string;
  staffId: string;
  remainingAmount: number;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}
function RepaymentDialog({
  loanId,
  staffId,
  remainingAmount,
  open,
  onClose,
  onSaved,
}: RepaymentDialogProps) {
  const [amount, setAmount] = useState("");
  const mutation = useUpdateLoanRepayment();

  async function handleSave() {
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await mutation.mutateAsync({ loanId, amountPaid: amt, staffId });
      toast.success(`Repayment of ${formatINR(amt)} recorded`);
      setAmount("");
      onSaved();
    } catch {
      toast.error("Failed to record repayment");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-xs"
        data-ocid="staff_payment.repayment_dialog"
      >
        <DialogHeader>
          <DialogTitle>Record Repayment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            Remaining: <strong>{formatINR(remainingAmount)}</strong>
          </p>
          <div className="space-y-1">
            <Label className="text-xs">Amount Paid (₹)</Label>
            <Input
              type="number"
              min={0}
              max={remainingAmount}
              placeholder={`max ${remainingAmount}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-ocid="staff_payment.repayment.amount_input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            data-ocid="staff_payment.repayment.save_button"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Salary Dialog ───────────────────────────────────────────────────────
interface EditSalaryDialogProps {
  staffId: string;
  currentSalary: number;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}
function EditSalaryDialog({
  staffId,
  currentSalary,
  open,
  onClose,
  onSaved,
}: EditSalaryDialogProps) {
  const [salary, setSalary] = useState(String(currentSalary || ""));
  const mutation = useUpdateStaffSalary();

  async function handleSave() {
    const s = Number.parseFloat(salary);
    if (!s || s <= 0) {
      toast.error("Enter a valid salary");
      return;
    }
    try {
      await mutation.mutateAsync({ staffId, basicSalary: s });
      toast.success("Salary updated");
      onSaved();
    } catch {
      toast.error("Failed to update salary");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="z-[9999] max-w-xs"
        data-ocid="staff_payment.edit_salary_dialog"
      >
        <DialogHeader>
          <DialogTitle>Edit Basic Salary</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs">Basic Monthly Salary (₹)</Label>
            <Input
              type="number"
              min={0}
              placeholder="e.g. 25000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              data-ocid="staff_payment.salary.input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            data-ocid="staff_payment.salary.save_button"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Update Salary"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Staff Detail Panel ───────────────────────────────────────────────────────
interface StaffDetailPanelProps {
  staff: Staff;
  isAdmin: boolean;
  isAccountant: boolean;
  recordedBy: string;
  onBack: () => void;
}
function StaffDetailPanel({
  staff,
  isAdmin,
  isAccountant,
  recordedBy,
  onBack,
}: StaffDetailPanelProps) {
  const fyYear = currentFYYear();
  const [yearSel, setYearSel] = useState(fyYear);
  const [recordPayOpen, setRecordPayOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [incentiveOpen, setIncentiveOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [editSalaryOpen, setEditSalaryOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [repayLoan, setRepayLoan] = useState<{
    id: string;
    remaining: number;
  } | null>(null);

  const { data: rawSummary = [], refetch: refetchSummary } =
    useGetStaffPaymentSummary(staff.id);
  const { data: rawPayouts = [], refetch: refetchPayouts } = useGetStaffPayouts(
    staff.id,
  );
  const { data: rawIncentives = [], refetch: refetchIncentives } =
    useGetStaffIncentives(staff.id);
  const { data: rawLoans = [], refetch: refetchLoans } = useGetStaffLoans(
    staff.id,
  );
  const { data: salaryData, refetch: refetchSalary } = useGetStaffSalary(
    staff.id,
  );
  const { data: yearEnd, refetch: refetchYearEnd } = useGetStaffYearEndSummary(
    staff.id,
    yearSel,
  );
  const deletePayoutMut = useDeleteStaffPayout();
  const deleteIncentiveMut = useDeleteStaffIncentive();

  // Warm the enhanced payroll cache for selected month
  useGetEnhancedPayroll(
    staff.id,
    selectedMonth ? fyMonthKey(selectedMonth, fyYear) : "",
  );

  // Normalise data from backend types
  const summary = rawSummary as Array<{
    month: string;
    status: string;
    amountPaid: number;
    netSalary?: number;
  }>;
  const payouts = rawPayouts as Array<{
    id: string;
    staffId: string;
    amount: number;
    mode: string;
    date: string;
    notes: string;
    recordedBy: string;
  }>;
  const incentives = rawIncentives as Array<{
    id: string;
    staffId: string;
    amount: number;
    reason: string;
    month: string;
    year: string;
    approvedBy: string;
  }>;
  const loans = rawLoans as Array<{
    id: string;
    staffId: string;
    principalAmount: number;
    remainingAmount: number;
    monthlyDeduction: number;
    startMonth: string;
    notes: string;
  }>;

  // Build month→summary map
  const summaryMap = useMemo(() => {
    const m: Record<
      string,
      { status: string; amountPaid: number; netSalary?: number }
    > = {};
    for (const s of summary) {
      const mn = monthFromKey(s.month);
      if (mn)
        m[mn] = {
          status: s.status,
          amountPaid: s.amountPaid,
          netSalary: s.netSalary,
        };
    }
    return m;
  }, [summary]);

  const currentSalary =
    typeof salaryData === "number" ? salaryData : (staff.basicSalary ?? 0);

  function refetchAll() {
    refetchSummary();
    refetchPayouts();
    refetchIncentives();
    refetchLoans();
    refetchSalary();
    refetchYearEnd();
  }

  async function handleDeletePayout(payoutId: string) {
    try {
      await deletePayoutMut.mutateAsync({ payoutId, staffId: staff.id });
      toast.success("Payment record deleted");
      refetchPayouts();
      refetchSummary();
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleDeleteIncentive(incentiveId: string) {
    try {
      await deleteIncentiveMut.mutateAsync({ incentiveId, staffId: staff.id });
      toast.success("Incentive deleted");
      refetchIncentives();
    } catch {
      toast.error("Failed to delete");
    }
  }

  const yearOptions = [
    fyYear,
    `${Number.parseInt(fyYear) - 1}-${String(Number.parseInt(fyYear)).slice(2)}`,
  ];

  return (
    <div className="space-y-4" data-ocid="staff_payment.detail_panel">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="staff_payment.back_button"
        >
          ← Back
        </Button>
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
          {getInitials(staff.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground">
            {staff.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {staff.designation} · {staff.department}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(isAdmin || isAccountant) && (
            <Button
              size="sm"
              onClick={() => setRecordPayOpen(true)}
              data-ocid="staff_payment.record_payment_button"
            >
              <Plus className="size-4 mr-1" /> Record Payment
            </Button>
          )}
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCalcOpen(true)}
              data-ocid="staff_payment.calculate_button"
            >
              <Calculator className="size-4 mr-1" /> Calculate
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="months">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="months" data-ocid="staff_payment.months_tab">
            <Calendar className="size-4 mr-1" /> Months
          </TabsTrigger>
          {(isAdmin || isAccountant) && (
            <TabsTrigger value="payouts" data-ocid="staff_payment.payouts_tab">
              <Wallet className="size-4 mr-1" /> Payout History
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger
              value="incentives"
              data-ocid="staff_payment.incentives_tab"
            >
              <Gift className="size-4 mr-1" /> Incentives
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="loans" data-ocid="staff_payment.loans_tab">
              <Banknote className="size-4 mr-1" /> Loans
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="yearend" data-ocid="staff_payment.yearend_tab">
              <TrendingUp className="size-4 mr-1" /> Year-End
            </TabsTrigger>
          )}
        </TabsList>

        {/* ── Months */}
        <TabsContent value="months" className="mt-4">
          {isAdmin && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-4">
              <IndianRupee className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Basic Salary</p>
                <p className="font-bold text-lg text-foreground">
                  {formatINR(currentSalary)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => setEditSalaryOpen(true)}
                data-ocid="staff_payment.edit_salary_button"
              >
                <Pencil className="size-3.5 mr-1" /> Edit
              </Button>
            </div>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {FY_MONTHS.map((m) => {
              const info = summaryMap[m];
              const st = getMonthStatus(info?.status ?? "upcoming");
              return (
                <MonthCard
                  key={m}
                  month={m}
                  status={st}
                  amountPaid={info?.amountPaid ?? 0}
                  netSalary={info?.netSalary}
                  isAdmin={isAdmin}
                  onClick={() => setSelectedMonth(m)}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* ── Payout History */}
        {(isAdmin || isAccountant) && (
          <TabsContent value="payouts" className="mt-4">
            {payouts.length === 0 ? (
              <div
                className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center"
                data-ocid="staff_payment.payouts.empty_state"
              >
                <Wallet className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No payment records yet
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">#</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Mode
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Notes
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">By</th>
                      {isAdmin && (
                        <th className="px-4 py-3 text-center font-semibold">
                          Del
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p, i) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-muted/10"
                        data-ocid={`staff_payment.payout.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">{isoToDDMMYYYY(p.date)}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-primary">
                          {formatINR(p.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {p.mode}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-[150px] truncate">
                          {p.notes}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.recordedBy}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeletePayout(p.id)}
                              data-ocid={`staff_payment.payout.delete_button.${i + 1}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        )}

        {/* ── Incentives */}
        {isAdmin && (
          <TabsContent value="incentives" className="mt-4">
            <div className="flex justify-end mb-3">
              <Button
                size="sm"
                onClick={() => setIncentiveOpen(true)}
                data-ocid="staff_payment.add_incentive_button"
              >
                <Plus className="size-4 mr-1" /> Add Incentive
              </Button>
            </div>
            {incentives.length === 0 ? (
              <div
                className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center"
                data-ocid="staff_payment.incentives.empty_state"
              >
                <Gift className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No incentives recorded yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {incentives.map((inc, i) => (
                  <div
                    key={inc.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                    data-ocid={`staff_payment.incentive.item.${i + 1}`}
                  >
                    <Award className="size-5 text-yellow-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {inc.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {inc.month} · Approved by {inc.approvedBy}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-primary">
                      {formatINR(inc.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive"
                      onClick={() => handleDeleteIncentive(inc.id)}
                      data-ocid={`staff_payment.incentive.delete_button.${i + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* ── Loans */}
        {isAdmin && (
          <TabsContent value="loans" className="mt-4">
            <div className="flex justify-end mb-3">
              <Button
                size="sm"
                onClick={() => setLoanOpen(true)}
                data-ocid="staff_payment.add_loan_button"
              >
                <Plus className="size-4 mr-1" /> Add Loan
              </Button>
            </div>
            {loans.length === 0 ? (
              <div
                className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center"
                data-ocid="staff_payment.loans.empty_state"
              >
                <Banknote className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No loans recorded yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan, i) => {
                  const repaid = loan.principalAmount - loan.remainingAmount;
                  const pct =
                    loan.principalAmount > 0
                      ? (repaid / loan.principalAmount) * 100
                      : 0;
                  return (
                    <div
                      key={loan.id}
                      className="p-4 rounded-xl border border-border bg-card space-y-3"
                      data-ocid={`staff_payment.loan.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <Banknote className="size-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            Loan — {loan.startMonth}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {loan.notes || "No notes"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Remaining
                          </p>
                          <p className="font-mono font-bold text-destructive">
                            {formatINR(loan.remainingAmount)}
                          </p>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Repaid: {formatINR(repaid)} of{" "}
                          {formatINR(loan.principalAmount)}
                        </span>
                        <span>Monthly: {formatINR(loan.monthlyDeduction)}</span>
                      </div>
                      {loan.remainingAmount > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            setRepayLoan({
                              id: loan.id,
                              remaining: loan.remainingAmount,
                            })
                          }
                          data-ocid={`staff_payment.loan.repay_button.${i + 1}`}
                        >
                          <CreditCard className="size-4 mr-1" /> Record
                          Repayment
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        )}

        {/* ── Year-End Summary */}
        {isAdmin && (
          <TabsContent value="yearend" className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <Label className="text-sm">Year</Label>
              <Select value={yearSel} onValueChange={setYearSel}>
                <SelectTrigger
                  className="w-36"
                  data-ocid="staff_payment.yearend.year_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {yearEnd ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      label: "Total Earned",
                      value: formatINR(Number(yearEnd.totalEarned)),
                      icon: TrendingUp,
                      color: "text-primary",
                    },
                    {
                      label: "Total Paid",
                      value: formatINR(Number(yearEnd.totalPaid)),
                      icon: CheckCircle2,
                      color: "text-green-600",
                    },
                    {
                      label: "Total Incentives",
                      value: formatINR(Number(yearEnd.totalIncentives)),
                      icon: Gift,
                      color: "text-yellow-600",
                    },
                    {
                      label: "Total Deductions",
                      value: formatINR(Number(yearEnd.totalDeductions)),
                      icon: AlertCircle,
                      color: "text-destructive",
                    },
                    {
                      label: "Months Fully Paid",
                      value: String(yearEnd.monthsFullyPaid),
                      icon: CheckCircle2,
                      color: "text-green-600",
                    },
                    {
                      label: "Months Partial",
                      value: String(yearEnd.monthsPartiallyPaid),
                      icon: Clock,
                      color: "text-yellow-600",
                    },
                    {
                      label: "Months Unpaid",
                      value: String(yearEnd.monthsUnpaid),
                      icon: AlertCircle,
                      color: "text-destructive",
                    },
                  ] as const
                ).map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-card p-4 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${color}`} />
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                    <p className={`text-xl font-bold font-display ${color}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-sm text-muted-foreground">
                Loading year-end summary…
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Month detail modal */}
      {selectedMonth && (
        <Dialog
          open={!!selectedMonth}
          onOpenChange={() => setSelectedMonth(null)}
        >
          <DialogContent
            className="z-[9999] max-w-sm"
            data-ocid="staff_payment.month_detail_dialog"
          >
            <DialogHeader>
              <DialogTitle>
                {selectedMonth} — {staff.fullName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {(() => {
                const info = summaryMap[selectedMonth];
                const st = getMonthStatus(info?.status ?? "upcoming");
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={STATUS_COLORS[st]}>
                        {st.toUpperCase()}
                      </Badge>
                    </div>
                    {isAdmin && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Amount Paid
                          </span>
                          <span className="font-mono font-bold">
                            {formatINR(info?.amountPaid ?? 0)}
                          </span>
                        </div>
                        {info?.netSalary != null && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Net Salary
                            </span>
                            <span className="font-mono font-semibold">
                              {formatINR(info.netSalary)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
            <DialogFooter>
              {(isAdmin || isAccountant) && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMonth(null);
                    setRecordPayOpen(true);
                  }}
                  data-ocid="staff_payment.month_detail.record_button"
                >
                  <Plus className="size-4 mr-1" /> Record Payment
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedMonth(null)}
                data-ocid="staff_payment.month_detail.close_button"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialogs */}
      <RecordPaymentDialog
        staffId={staff.id}
        recordedBy={recordedBy}
        open={recordPayOpen}
        defaultMonth={selectedMonth ?? undefined}
        onClose={() => setRecordPayOpen(false)}
        onSaved={() => {
          setRecordPayOpen(false);
          refetchAll();
        }}
      />
      {calcOpen && (
        <CalcPayrollDialog
          staff={staff}
          open={calcOpen}
          onClose={() => setCalcOpen(false)}
        />
      )}
      {incentiveOpen && (
        <AddIncentiveDialog
          staffId={staff.id}
          approvedBy={recordedBy}
          open={incentiveOpen}
          onClose={() => setIncentiveOpen(false)}
          onSaved={() => {
            setIncentiveOpen(false);
            refetchAll();
          }}
        />
      )}
      {loanOpen && (
        <AddLoanDialog
          staffId={staff.id}
          open={loanOpen}
          onClose={() => setLoanOpen(false)}
          onSaved={() => {
            setLoanOpen(false);
            refetchLoans();
          }}
        />
      )}
      {editSalaryOpen && (
        <EditSalaryDialog
          staffId={staff.id}
          currentSalary={currentSalary}
          open={editSalaryOpen}
          onClose={() => setEditSalaryOpen(false)}
          onSaved={() => {
            setEditSalaryOpen(false);
            refetchSalary();
          }}
        />
      )}
      {repayLoan && (
        <RepaymentDialog
          loanId={repayLoan.id}
          staffId={staff.id}
          remainingAmount={repayLoan.remaining}
          open={!!repayLoan}
          onClose={() => setRepayLoan(null)}
          onSaved={() => {
            setRepayLoan(null);
            refetchLoans();
          }}
        />
      )}
    </div>
  );
}

// ─── Main Staff Payment Tab ───────────────────────────────────────────────────
export function StaffPaymentTab() {
  const { data: staffList = [] } = useStaff();
  const staff = (staffList as Staff[]).filter((s) => s.isActive);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const currentRole = useAppStore((s) => s.currentRole);
  const currentUser = useAppStore((s) => s.currentUser);
  const recordedBy = currentUser?.fullName ?? String(currentRole);

  const isAdmin = currentRole === "Admin";
  const isAccountant = currentRole === "Accountant";

  const selectedStaff = staff.find((s) => s.id === selectedId);

  const filtered = useMemo(
    () =>
      staff.filter(
        (s) =>
          !search ||
          s.fullName.toLowerCase().includes(search.toLowerCase()) ||
          s.staffCode.toLowerCase().includes(search.toLowerCase()),
      ),
    [staff, search],
  );

  return (
    <div className="space-y-4" data-ocid="staff_payment.tab">
      {selectedStaff ? (
        <StaffDetailPanel
          staff={selectedStaff}
          isAdmin={isAdmin}
          isAccountant={isAccountant}
          recordedBy={recordedBy}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search staff…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="staff_payment.search_input"
              />
            </div>
            <div className="flex gap-2 items-center text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full bg-green-500 inline-block" />{" "}
              Paid
              <span className="size-2.5 rounded-full bg-yellow-500 inline-block" />{" "}
              Partial
              <span className="size-2.5 rounded-full bg-red-500 inline-block" />{" "}
              Overdue
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              className="rounded-xl border border-dashed border-border bg-muted/20 py-14 text-center"
              data-ocid="staff_payment.empty_state"
            >
              <IndianRupee className="size-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">No staff found</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  isSelected={s.id === selectedId}
                  summaryMap={{}} // loaded on demand in detail panel
                  onClick={() => setSelectedId(s.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
