import { createActor } from "@/backend";
import type { BackupPayload, RestoreResult } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileJson,
  Info,
  Mail,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

// Extended RestoreStats that covers all entity types; older backends may
// return a subset — every field is optional to survive schema evolution.
type FullRestoreStats = Partial<
  Record<
    | "students"
    | "staff"
    | "sections"
    | "sessions"
    | "subjects"
    | "subjectClassMaps"
    | "feeHeadings"
    | "feePlans"
    | "feeCollections"
    | "studentDiscounts"
    | "studentOldBalances"
    | "classTimetables"
    | "examTimetables"
    | "attendance"
    | "deviceAttendance"
    | "staffAttendance"
    | "faceEnrollments"
    | "routes"
    | "pickupPoints"
    | "inventory"
    | "inventoryTx"
    | "payrollRecords"
    | "staffPayouts"
    | "staffIncentives"
    | "staffLoans"
    | "enhancedPayroll"
    | "subjectAssignments"
    | "expenseHeads"
    | "expenseEntries"
    | "libraryBooks"
    | "libraryIssues"
    | "alumniRecords"
    | "notifications"
    | "chatRooms"
    | "syllabusChapters"
    | "syllabusContents"
    | "userAccounts"
    | "total",
    bigint | number
  >
>;

interface BackupPreview {
  payload: BackupPayload;
  filename: string;
  backupDate: string;
  backupVersion: string;
  counts: EntityCount[];
}

interface EntityCount {
  label: string;
  count: number;
}

function extractCounts(payload: BackupPayload): EntityCount[] {
  return (
    [
      { label: "Students", count: payload.students?.length ?? 0 },
      { label: "Staff", count: payload.staff?.length ?? 0 },
      { label: "Sections", count: payload.sections?.length ?? 0 },
      { label: "Sessions", count: payload.sessions?.length ?? 0 },
      { label: "Subjects", count: payload.subjects?.length ?? 0 },
      {
        label: "Subject-Class Maps",
        count: payload.subjectClassMaps?.length ?? 0,
      },
      { label: "Fee Headings", count: payload.feeHeadings?.length ?? 0 },
      { label: "Fee Plans", count: payload.feePlans?.length ?? 0 },
      { label: "Fee Collections", count: payload.feeCollections?.length ?? 0 },
      {
        label: "Student Discounts",
        count: payload.studentDiscounts?.length ?? 0,
      },
      { label: "Old Balances", count: payload.studentOldBalances?.length ?? 0 },
      {
        label: "Class Timetables",
        count: payload.classTimetables?.length ?? 0,
      },
      { label: "Exam Timetables", count: payload.examTimetables?.length ?? 0 },
      {
        label: "Attendance Records",
        count: payload.attendanceRecords?.length ?? 0,
      },
      {
        label: "Device Attendance",
        count: payload.deviceAttendance?.length ?? 0,
      },
      {
        label: "Staff Attendance",
        count: payload.staffAttendance?.length ?? 0,
      },
      {
        label: "Face Enrollments",
        count: payload.faceEnrollments?.length ?? 0,
      },
      { label: "Routes", count: payload.routes?.length ?? 0 },
      { label: "Pickup Points", count: payload.pickupPoints?.length ?? 0 },
      { label: "Inventory Items", count: payload.inventoryItems?.length ?? 0 },
      {
        label: "Inventory Transactions",
        count: payload.inventoryTx?.length ?? 0,
      },
      { label: "Payroll Records", count: payload.payrollRecords?.length ?? 0 },
      { label: "Staff Payouts", count: payload.staffPayouts?.length ?? 0 },
      {
        label: "Staff Incentives",
        count: payload.staffIncentives?.length ?? 0,
      },
      { label: "Staff Loans", count: payload.staffLoans?.length ?? 0 },
      {
        label: "Enhanced Payroll",
        count: payload.enhancedPayroll?.length ?? 0,
      },
      {
        label: "Subject Assignments",
        count: payload.subjectAssignments?.length ?? 0,
      },
      { label: "Expense Heads", count: payload.expenseHeads?.length ?? 0 },
      { label: "Expense Entries", count: payload.expenseEntries?.length ?? 0 },
      { label: "Library Books", count: payload.libraryBooks?.length ?? 0 },
      { label: "Library Issues", count: payload.libraryIssues?.length ?? 0 },
      { label: "Alumni Records", count: payload.alumniRecords?.length ?? 0 },
      { label: "Notifications", count: payload.notifications?.length ?? 0 },
      { label: "Chat Rooms", count: payload.chatRooms?.length ?? 0 },
      {
        label: "Syllabus Chapters",
        count: payload.syllabusChapters?.length ?? 0,
      },
      {
        label: "Syllabus Contents",
        count: payload.syllabusContents?.length ?? 0,
      },
      { label: "User Accounts", count: payload.userAccounts?.length ?? 0 },
      { label: "Payroll Records", count: payload.payrollRecords?.length ?? 0 },
      { label: "Staff Payouts", count: payload.staffPayouts?.length ?? 0 },
      {
        label: "Face Enrollments",
        count: payload.faceEnrollments?.length ?? 0,
      },
    ]
      .filter((e) => e.count > 0)
      // de-dup labels (some were listed twice for completeness)
      .filter((e, i, arr) => arr.findIndex((x) => x.label === e.label) === i)
  );
}

// ── Restore Stats Modal ───────────────────────────────────────────────────────

interface RestoreSuccessModalProps {
  open: boolean;
  onClose: () => void;
  result: RestoreResult;
  onRetryFailed?: () => void;
  hasFailedRecords?: boolean;
}

function RestoreSuccessModal({
  open,
  onClose,
  result,
  onRetryFailed,
  hasFailedRecords,
}: RestoreSuccessModalProps) {
  const stats = result.recordCounts as unknown as FullRestoreStats;
  const successCount = Number(result.successCount);
  const failCount = Number(result.failCount);
  const skippedCount = Number(result.skippedCount);

  // Determine overall state
  const isFullSuccess = result.success && failCount === 0;
  const isPartial = result.success && failCount > 0;
  const isFailed = !result.success;

  // Build entity rows from the full stats — safe access with ?? 0n fallback
  const n = (v: bigint | number | undefined) => Number(v ?? 0);
  const rows: EntityCount[] = [
    { label: "Students", count: n(stats?.students) },
    { label: "Staff", count: n(stats?.staff) },
    { label: "Sections", count: n(stats?.sections) },
    { label: "Sessions", count: n(stats?.sessions) },
    { label: "Subjects", count: n(stats?.subjects) },
    { label: "Fee Headings", count: n(stats?.feeHeadings) },
    { label: "Fee Plans", count: n(stats?.feePlans) },
    { label: "Fee Collections", count: n(stats?.feeCollections) },
    { label: "Student Discounts", count: n(stats?.studentDiscounts) },
    { label: "Old Balances", count: n(stats?.studentOldBalances) },
    { label: "Class Timetables", count: n(stats?.classTimetables) },
    { label: "Exam Timetables", count: n(stats?.examTimetables) },
    { label: "Attendance Records", count: n(stats?.attendance) },
    { label: "Routes", count: n(stats?.routes) },
    { label: "Pickup Points", count: n(stats?.pickupPoints) },
    { label: "Inventory Items", count: n(stats?.inventory) },
    { label: "Inventory Transactions", count: n(stats?.inventoryTx) },
    { label: "Payroll Records", count: n(stats?.payrollRecords) },
    { label: "Staff Payouts", count: n(stats?.staffPayouts) },
    { label: "Expense Heads", count: n(stats?.expenseHeads) },
    { label: "Expense Entries", count: n(stats?.expenseEntries) },
    { label: "Library Books", count: n(stats?.libraryBooks) },
    { label: "Library Issues", count: n(stats?.libraryIssues) },
    { label: "Alumni Records", count: n(stats?.alumniRecords) },
    { label: "Syllabus Chapters", count: n(stats?.syllabusChapters) },
    { label: "Syllabus Contents", count: n(stats?.syllabusContents) },
    { label: "User Accounts", count: n(stats?.userAccounts) },
    { label: "Subject Assignments", count: n(stats?.subjectAssignments) },
    { label: "Chat Rooms", count: n(stats?.chatRooms) },
  ].filter((r) => r.count > 0);

  const headerColor = isFailed
    ? "text-destructive"
    : isPartial
      ? "text-amber-600"
      : "text-green-600";

  const headerIcon = isFailed ? (
    <AlertTriangle className="h-5 w-5" />
  ) : isPartial ? (
    <AlertTriangle className="h-5 w-5" />
  ) : (
    <CheckCircle2 className="h-5 w-5" />
  );

  const headerText = isFailed
    ? "Restore Failed"
    : isPartial
      ? "Restore Partially Completed"
      : "Restore Successful";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg"
        style={{ zIndex: 9999 }}
        data-ocid="backup.restore_success.dialog"
      >
        <DialogHeader>
          <DialogTitle className={cn("flex items-center gap-2", headerColor)}>
            {headerIcon}
            {headerText}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Summary bar */}
          <div
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border text-sm font-medium",
              isFullSuccess
                ? "bg-green-50 border-green-200 text-green-800"
                : isPartial
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-destructive/10 border-destructive/30 text-destructive",
            )}
            data-ocid="backup.restore_success.summary"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                <span className="font-bold">
                  {successCount.toLocaleString()}
                </span>{" "}
                restored
              </span>
            </div>
            {failCount > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span>
                  <span className="font-bold">
                    {failCount.toLocaleString()}
                  </span>{" "}
                  failed
                </span>
              </div>
            )}
            {skippedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-bold">
                    {skippedCount.toLocaleString()}
                  </span>{" "}
                  skipped
                </span>
              </div>
            )}
          </div>

          {result.message && (
            <p className="text-sm text-muted-foreground">{result.message}</p>
          )}

          {/* Entity breakdown */}
          {rows.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/60">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                      Entity
                    </th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                      Restored
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-t border-border">
                      <td className="px-3 py-2 text-foreground">{r.label}</td>
                      <td className="px-3 py-2 text-right font-mono font-medium text-primary">
                        {r.count.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-muted/20">
                    <td className="px-3 py-2 font-semibold text-foreground">
                      Total Records
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-primary">
                      {Number(stats?.total ?? 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Failed records list */}
          {result.errors && result.errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {result.errors.length} record
                {result.errors.length !== 1 ? "s" : ""} failed to restore:
              </p>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-destructive/30 bg-destructive/5 text-xs divide-y divide-destructive/10">
                {result.errors.map((err, i) => (
                  <div
                    key={`${err.recordId}-${i}`}
                    className="px-3 py-2 flex items-start gap-2"
                    data-ocid={`backup.restore_error.${i + 1}`}
                  >
                    <span className="shrink-0 font-mono text-muted-foreground">
                      {err.entityType}
                    </span>
                    <span className="text-muted-foreground">
                      #{err.recordId}
                    </span>
                    <span className="text-destructive ml-auto text-right">
                      {err.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          {hasFailedRecords && onRetryFailed && (
            <Button
              variant="outline"
              onClick={onRetryFailed}
              data-ocid="backup.restore_success.retry_button"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Failed Records
            </Button>
          )}
          <Button
            onClick={onClose}
            data-ocid="backup.restore_success.close_button"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Preview Panel ─────────────────────────────────────────────────────────────

interface PreviewPanelProps {
  preview: BackupPreview;
  onRestore: () => void;
  onCancel: () => void;
  isRestoring: boolean;
}

function RestorePreviewPanel({
  preview,
  onRestore,
  onCancel,
  isRestoring,
}: PreviewPanelProps) {
  return (
    <Card
      className="border-primary/30 bg-primary/5"
      data-ocid="backup.preview.panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileJson className="h-4 w-4 text-primary" />
          Backup Preview — {preview.filename}
        </CardTitle>
        <CardDescription className="text-xs">
          Backed up on {preview.backupDate} · Version {preview.backupVersion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border overflow-hidden max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                  Entity
                </th>
                <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                  Records
                </th>
              </tr>
            </thead>
            <tbody>
              {preview.counts.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-1.5 text-foreground">{row.label}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-primary font-medium">
                    {row.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Restoring will <strong>merge</strong> backup data with existing
            records. Existing data that overlaps will be overwritten.
          </span>
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isRestoring}
            className="flex-1"
            data-ocid="backup.restore.cancel_button"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onRestore}
            disabled={isRestoring}
            className="flex-1"
            data-ocid="backup.restore.confirm_button"
          >
            {isRestoring ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Restoring…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Restore (Merge)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Factory Reset Dialog ──────────────────────────────────────────────────────

interface FactoryResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isResetting: boolean;
}

function FactoryResetDialog({
  open,
  onClose,
  onConfirm,
  isResetting,
}: FactoryResetDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const ready = confirmText === "DELETE";

  function handleClose() {
    setConfirmText("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        style={{ zIndex: 9999 }}
        data-ocid="backup.factory_reset.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            Confirm Factory Reset
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            This will permanently delete <strong>ALL data</strong> — students,
            staff, fees, attendance, timetables, inventory, and all records.
            This action <strong>cannot be undone</strong>.
          </p>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            <strong>Warning:</strong> Take a full backup before proceeding. Once
            reset, data cannot be recovered.
          </div>
          <div className="space-y-2">
            <Label htmlFor="reset-confirm">
              Type <strong>DELETE</strong> to confirm
            </Label>
            <Input
              id="reset-confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-destructive/50"
              data-ocid="backup.reset_confirm.input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isResetting}
            data-ocid="backup.factory_reset.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!ready || isResetting}
            data-ocid="backup.factory_reset.confirm_button"
          >
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Resetting…
              </>
            ) : (
              <>Reset Everything</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

// ── Scheduled backup check ────────────────────────────────────────────────────
const LS_BACKUP_DATE = "shubh_last_backup_date";
const LS_BACKUP_FREQ = "shubh_backup_frequency";

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function BackupRestoreTab() {
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin";
  const { actor } = useActor(createActor);

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupInfo, setLastBackupInfo] = useState<string | null>(null);

  // Gmail backup settings
  const [gmailAddress, setGmailAddress] = useState("");
  const [backupFrequency, setBackupFrequency] = useState<
    "daily" | "weekly" | "monthly" | "never"
  >("weekly");
  const [lastBackupTs, setLastBackupTs] = useState<string | null>(null);
  const [savingGmail, setSavingGmail] = useState(false);
  const [scheduleReminderVisible, setScheduleReminderVisible] = useState(false);

  // Load Gmail backup settings on mount + check scheduled backup reminder
  useEffect(() => {
    async function load() {
      if (!actor) return;
      try {
        const s = await actor.getBackupSettings();
        if (s.backupGmail?.[0]) setGmailAddress(s.backupGmail[0]);
        const freq = s.backupSchedule?.[0];
        if (
          freq === "daily" ||
          freq === "weekly" ||
          freq === "monthly" ||
          freq === "never"
        ) {
          setBackupFrequency(freq);
        }
        if (s.lastBackupTimestamp?.[0]) {
          const ts = Number(s.lastBackupTimestamp[0]) / 1_000_000;
          setLastBackupTs(new Date(ts).toLocaleString("en-IN"));
        }
      } catch {
        // use defaults
      }
    }
    load();

    // Scheduled backup reminder check using localStorage
    const savedFreq = (localStorage.getItem(LS_BACKUP_FREQ) ??
      "weekly") as typeof backupFrequency;
    const lastBackupDateStr = localStorage.getItem(LS_BACKUP_DATE);
    if (savedFreq !== "never" && lastBackupDateStr) {
      const last = new Date(lastBackupDateStr);
      const now = new Date();
      const daysDiff = daysBetween(last, now);
      const threshold =
        savedFreq === "daily" ? 1 : savedFreq === "weekly" ? 7 : 30;
      if (daysDiff >= threshold) {
        setScheduleReminderVisible(true);
      }
    } else if (savedFreq !== "never" && !lastBackupDateStr) {
      setScheduleReminderVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  async function handleSaveGmailSettings() {
    if (!actor) {
      toast.error("Backend not connected");
      return;
    }
    setSavingGmail(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await actor.saveBackupSettings({
        backupGmail: gmailAddress ? gmailAddress : undefined,
        backupSchedule: backupFrequency as any,
        // Do NOT pass lastBackupTimestamp here — it is set only when a
        // backup is actually downloaded via recordBackupDone().
      } as any);
      localStorage.setItem(LS_BACKUP_FREQ, backupFrequency);
      toast.success("Gmail backup settings saved");
    } catch {
      toast.error("Failed to save Gmail backup settings");
    } finally {
      setSavingGmail(false);
    }
  }

  async function recordBackupDone() {
    const now = new Date();
    localStorage.setItem(LS_BACKUP_DATE, now.toISOString());
    localStorage.setItem(LS_BACKUP_FREQ, backupFrequency);
    setScheduleReminderVisible(false);
    if (actor) {
      try {
        await actor.recordBackupTimestamp(
          BigInt(Date.now()) * BigInt(1_000_000),
        );
        setLastBackupTs(now.toLocaleString("en-IN"));
      } catch {
        // non-critical
      }
    }
  }

  // Restore state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreProgressMsg, setRestoreProgressMsg] = useState("");
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null,
  );
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [failedPayload, setFailedPayload] = useState<BackupPayload | null>(
    null,
  );

  // Factory reset state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // ── Backup ──────────────────────────────────────────────────────────────────

  async function handleBackup() {
    if (!actor) {
      toast.error("Backend not connected. Please try again.");
      return;
    }
    setIsBackingUp(true);
    try {
      const payload = await actor.createFullBackup();

      // Convert bigints for JSON serialization
      const jsonStr = JSON.stringify(
        payload,
        (_key, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      );

      const now = new Date();
      const ts = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
        "_",
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0"),
      ].join("");
      const filename = `shubh-erp-backup_${ts}.json`;

      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Build summary counts
      const counts = extractCounts(payload);
      const topCounts = counts
        .slice(0, 4)
        .map((c) => `${c.count.toLocaleString()} ${c.label.toLowerCase()}`)
        .join(", ");
      const info = `${now.toLocaleString("en-IN")} — ${topCounts}${
        counts.length > 4 ? " and more" : ""
      }`;
      setLastBackupInfo(info);
      toast.success("Full backup downloaded", { description: topCounts });
      await recordBackupDone();
    } catch (err) {
      toast.error("Backup failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsBackingUp(false);
    }
  }

  // ── File parsing ────────────────────────────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      toast.error("Only .json backup files are accepted");
      return;
    }
    setRestoreError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = ev.target?.result as string;
        // Key-based bigint reviver: only convert fields that are known to be
        // stored as bigint in the Motoko backend. Avoids accidentally converting
        // numeric strings like admission numbers (e.g. "2024001234").
        const BIGINT_KEYS = new Set([
          "backupTimestamp",
          "createdAt",
          "updatedAt",
          "addedAt",
          "generatedAt",
          "salary",
          "totalAmount",
          "totalDue",
          "totalPaid",
          "balance",
          "lateFees",
          "amount",
          "discountTotal",
          "balanceAmount",
          "receivedAmount",
          "netSalary",
          "basicSalary",
          "netPay",
          "monthlySalary",
          "presentDays",
          "totalDays",
          "workingDays",
          "deductions",
          "additions",
          "chapterNo",
          "completionPercent",
          "periodNumber",
          "durationMinutes",
          "capacity",
          "availableCopies",
          "totalCopies",
          "fine",
          "inventoryDue",
          "purchasePrice",
          "salePrice",
          "currentStock",
          "minStock",
          "unitPrice",
          "quantity",
          "totalAmount",
          "presentCount",
          "totalCount",
          "faceCount",
          "rfidCount",
          "monthsUnpaid",
          "monthsPartiallyPaid",
          "monthsFullyPaid",
          "totalPromoted",
          "totalGraduated",
          "totalFailed",
          "feesCollectedToday",
          "feesCollectedThisMonth",
          "feesCollectedThisYear",
          "pendingFeesTotal",
          "totalStudents",
          "totalStaff",
          "totalClasses",
          "totalSections",
          "graduated",
          "failed",
          "promoted",
        ]);
        const payload = JSON.parse(raw, (key, value) => {
          // Re-hydrate known bigint fields stored as numeric strings
          if (
            BIGINT_KEYS.has(key) &&
            typeof value === "string" &&
            /^-?\d+$/.test(value)
          ) {
            return BigInt(value);
          }
          return value;
        }) as BackupPayload;

        if (!payload.backupVersion || !Array.isArray(payload.students)) {
          throw new Error("Invalid backup file format.");
        }

        const ts =
          typeof payload.backupTimestamp === "bigint"
            ? new Date(
                Number(payload.backupTimestamp) / 1_000_000,
              ).toLocaleString("en-IN")
            : new Date().toLocaleString("en-IN");

        setPreview({
          payload,
          filename: file.name,
          backupDate: ts,
          backupVersion: payload.backupVersion,
          counts: extractCounts(payload),
        });
      } catch (err) {
        setRestoreError(
          err instanceof Error ? err.message : "Failed to parse backup file.",
        );
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  // ── Restore ─────────────────────────────────────────────────────────────────

  async function handleRestore(payloadOverride?: BackupPayload) {
    const targetPayload = payloadOverride ?? preview?.payload;
    if (!actor || !targetPayload) return;
    setIsRestoring(true);
    setRestoreError(null);
    setRestoreProgress(0);
    setRestoreProgressMsg("Preparing restore…");

    // Compute total record count for progress bar
    const totalRecords = Object.values(targetPayload).reduce(
      (sum, v) => sum + (Array.isArray(v) ? v.length : 0),
      0,
    );

    // Simulate staged progress ticks while the backend processes
    let progressTick = 0;
    const stages = [
      { pct: 10, msg: "Validating backup file…" },
      { pct: 25, msg: "Writing students & staff…" },
      { pct: 45, msg: "Restoring fee data…" },
      { pct: 60, msg: "Restoring timetables & attendance…" },
      { pct: 75, msg: "Restoring HR & payroll…" },
      { pct: 85, msg: "Restoring inventory & transport…" },
      { pct: 92, msg: "Restoring syllabus, library & alumni…" },
      { pct: 97, msg: "Finalising…" },
    ];
    const tickInterval = setInterval(() => {
      if (progressTick < stages.length) {
        const stage = stages[progressTick];
        setRestoreProgress(stage.pct);
        setRestoreProgressMsg(
          `${stage.msg} (${totalRecords.toLocaleString()} records total)`,
        );
        progressTick++;
      }
    }, 600);

    try {
      const result = await actor.restoreFromBackup(targetPayload);
      clearInterval(tickInterval);
      setRestoreProgress(100);
      setRestoreProgressMsg("Complete!");

      if (result.success) {
        // Store failed records payload for retry
        if (result.errors && result.errors.length > 0) {
          // Build a minimal payload containing only the failed records
          const failedIds = new Set(result.errors.map((e) => e.recordId));
          const failedSubset: BackupPayload = {
            ...targetPayload,
            students:
              targetPayload.students?.filter((s) => failedIds.has(s.id)) ?? [],
            staff:
              targetPayload.staff?.filter((s) => failedIds.has(s.id)) ?? [],
            feeCollections:
              targetPayload.feeCollections?.filter((s) =>
                failedIds.has(s.id),
              ) ?? [],
          };
          setFailedPayload(failedSubset);
        } else {
          setFailedPayload(null);
        }
        setRestoreResult(result);
        setPreview(null);
        toast.success("Data restored successfully");
      } else {
        setRestoreError(result.message || "Restore failed.");
      }
    } catch (err) {
      clearInterval(tickInterval);
      setRestoreError(err instanceof Error ? err.message : "Restore failed.");
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
      setRestoreProgressMsg("");
    }
  }

  // ── Factory Reset ────────────────────────────────────────────────────────────

  async function handleFactoryReset() {
    if (!actor) {
      toast.error("Backend not connected. Please try again.");
      return;
    }
    setIsResetting(true);
    try {
      // Restore with a minimal empty payload to wipe data
      const emptyPayload = {
        students: [],
        staff: [],
        feePlans: [],
        feeCollections: [],
        feeHeadings: [],
        classTimetables: [],
        examTimetables: [],
        attendanceRecords: [],
        deviceAttendance: [],
        staffAttendance: [],
        routes: [],
        pickupPoints: [],
        inventoryItems: [],
        inventoryTx: [],
        expenseHeads: [],
        expenseEntries: [],
        subjects: [],
        syllabusChapters: [],
        syllabusContents: [],
        libraryBooks: [],
        libraryIssues: [],
        alumniRecords: [],
        notifications: [],
        userAccounts: [],
        sessions: [],
        sections: [],
        payrollRecords: [],
        enhancedPayroll: [],
        staffPayouts: [],
        staffLoans: [],
        staffIncentives: [],
        faceEnrollments: [],
        chatRooms: [],
        subjectClassMaps: [],
        subjectAssignments: [],
        studentOldBalances: [],
        studentDiscounts: [],
        schoolInfo: {
          name: "",
          about: "",
          address: "",
          phone: "",
          email: "",
          website: undefined,
          photoUrl: undefined,
        },
        appSettings: {
          gpayEnabled: false,
          payuEnabled: false,
          razorpayEnabled: false,
          activeTheme: "navy-gold",
          messageTemplates: [] as Array<[string, string]>,
          whatsappApiKey: undefined,
          whatsappApiUrl: undefined,
          upiId: undefined,
          dashboardBgUrl: undefined,
        },
        backupVersion: "1.0",
        backupTimestamp: BigInt(Date.now()) * BigInt(1_000_000),
      } as BackupPayload;

      await actor.restoreFromBackup(emptyPayload);
      setResetDialogOpen(false);
      toast.success("Factory reset complete. All data has been cleared.");
    } catch (err) {
      toast.error("Factory reset failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsResetting(false);
    }
  }

  async function handleEmailBackup() {
    if (!actor) {
      toast.error("Backend not connected. Please try again.");
      return;
    }
    setIsBackingUp(true);
    try {
      const payload = await actor.createFullBackup();
      const jsonStr = JSON.stringify(
        payload,
        (_key, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      );
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const datePart = `${dd}-${mm}-${yyyy}`;
      const filename = `ShubhERP-backup-${datePart}.json`;
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      const to = encodeURIComponent(gmailAddress || "");
      const subject = encodeURIComponent(`SHUBH ERP Backup — ${datePart}`);
      const body = encodeURIComponent(
        `Backup Date: ${datePart}\nFilename: ${filename}\nPlease attach the downloaded file and send.`,
      );
      window.open(`mailto:${to}?subject=${subject}&body=${body}`, "_blank");
      await recordBackupDone();
      toast.success("Backup downloaded + email client opened", {
        description: "Attach the downloaded .json file to the email and send.",
        duration: 6000,
      });
    } catch (err) {
      toast.error("Email backup failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsBackingUp(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="backup.panel">
      {/* ── Scheduled Backup Reminder Banner ── */}
      {scheduleReminderVisible && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border-2 border-amber-400/60 bg-amber-50 text-amber-900"
          data-ocid="backup.schedule_reminder.banner"
        >
          <Bell className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Scheduled backup is due!</p>
            <p className="text-xs mt-0.5">
              Your {backupFrequency} backup reminder is active. Download and
              email your backup now.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleBackup}
              disabled={isBackingUp}
              data-ocid="backup.schedule_reminder.download_button"
              className="h-8 text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download Now
            </Button>
            <button
              type="button"
              aria-label="Dismiss reminder"
              onClick={() => setScheduleReminderVisible(false)}
              className="p-1 rounded hover:bg-amber-200/70"
            >
              <X className="h-4 w-4 text-amber-700" />
            </button>
          </div>
        </div>
      )}

      {/* ── Full Backup ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Full Backup
          </CardTitle>
          <CardDescription>
            Downloads a complete snapshot of all data — students, staff, fees,
            timetables, inventory, attendance, settings, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleBackup}
            disabled={isBackingUp || !actor}
            className="gap-2"
            data-ocid="backup.export.button"
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating Backup…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Full Backup
              </>
            )}
          </Button>

          {isBackingUp && (
            <div className="space-y-2" data-ocid="backup.export.loading_state">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                Collecting all records from the backend…
              </div>
              <Progress value={undefined} className="h-2 animate-pulse" />
            </div>
          )}

          {lastBackupInfo && !isBackingUp && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs"
              data-ocid="backup.export.success_state"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Last backup created</p>
                <p className="mt-0.5 text-green-700">{lastBackupInfo}</p>
              </div>
            </div>
          )}

          {/* Schedule info panel */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <div>
              <p className="font-medium text-foreground">
                About Scheduled Backups
              </p>
              <p className="mt-0.5 text-xs">
                Internet Computer canisters cannot run background cron jobs, so
                automatic email delivery is not possible. This page shows a
                reminder banner when your scheduled interval has passed
                (configured in Gmail Backup below). The reminder appears on each
                app load after the interval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Gmail Backup Settings ── */}
      <Card data-ocid="backup.gmail.panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Gmail Backup
          </CardTitle>
          <CardDescription>
            Configure your Gmail address and reminder frequency. Use “Email
            Backup” to download and open your email client pre-addressed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gmail-address">Gmail Address</Label>
              <Input
                id="gmail-address"
                type="email"
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                placeholder="school@gmail.com"
                data-ocid="backup.gmail.address_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="backup-freq">Reminder Frequency</Label>
              <Select
                value={backupFrequency}
                onValueChange={(v) =>
                  setBackupFrequency(v as typeof backupFrequency)
                }
              >
                <SelectTrigger
                  id="backup-freq"
                  data-ocid="backup.gmail.frequency_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never (manual only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {lastBackupTs && (
            <div
              className="flex items-center gap-2 text-xs text-muted-foreground p-2.5 rounded-lg bg-muted/30 border border-border"
              data-ocid="backup.gmail.last_backup"
            >
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Last backup recorded:{" "}
              <span className="font-medium text-foreground">
                {lastBackupTs}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleSaveGmailSettings}
              disabled={savingGmail}
              data-ocid="backup.gmail.save_button"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {savingGmail ? "Saving…" : "Save Settings"}
            </Button>
            <Button
              onClick={handleEmailBackup}
              disabled={isBackingUp}
              data-ocid="backup.gmail.email_backup_button"
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              {isBackingUp ? "Preparing…" : "Email Backup"}
            </Button>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>How it works:</strong> “Email Backup” downloads the backup
              JSON to your device and opens your email client pre-addressed to
              your Gmail. Attach the downloaded file and send. Requires an email
              client to be configured on this device.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Restore ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Restore from Backup
          </CardTitle>
          <CardDescription>
            Upload a .json backup file to preview its contents before restoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drop zone / file select */}
          {!preview && (
            <button
              type="button"
              className="w-full rounded-lg border-2 border-dashed border-border bg-muted/20 py-8 text-center cursor-pointer hover:bg-muted/40 hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="backup.import.dropzone"
            >
              <FileJson className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">
                Click to select a backup file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Accepts .json files exported from this ERP
              </p>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Select backup JSON file"
            data-ocid="backup.import.upload_button"
          />

          {restoreError && (
            <div
              className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              data-ocid="backup.restore.error_state"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{restoreError}</span>
              <button
                type="button"
                onClick={() => setRestoreError(null)}
                className="ml-auto p-0.5 rounded hover:bg-destructive/20"
                aria-label="Dismiss error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {preview && (
            <RestorePreviewPanel
              preview={preview}
              onRestore={handleRestore}
              onCancel={() => setPreview(null)}
              isRestoring={isRestoring}
            />
          )}

          {isRestoring && (
            <div
              className="space-y-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
              data-ocid="backup.restore.loading_state"
            >
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <RefreshCw className="h-4 w-4 animate-spin text-primary shrink-0" />
                <span className="truncate">
                  {restoreProgressMsg || "Restoring data…"}
                </span>
              </div>
              <Progress value={restoreProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {restoreProgress}% complete
              </p>
            </div>
          )}

          {!preview && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Merge behaviour:</strong> Restoring adds records from
                the backup. Existing records with the same ID will be
                overwritten. No existing data is deleted unless explicitly
                overwritten.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Danger Zone (admin only) ── */}
      {isAdmin && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanent, irreversible actions — admin only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Factory Reset
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wipe all records from the system. Download a backup first.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setResetDialogOpen(true)}
                data-ocid="backup.factory_reset.button"
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Factory Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Restore Success Modal ── */}
      {restoreResult && (
        <RestoreSuccessModal
          open={!!restoreResult}
          onClose={() => {
            setRestoreResult(null);
            setFailedPayload(null);
          }}
          result={restoreResult}
          hasFailedRecords={
            !!failedPayload && Number(restoreResult.failCount) > 0
          }
          onRetryFailed={() => {
            setRestoreResult(null);
            if (failedPayload) {
              handleRestore(failedPayload);
            }
          }}
        />
      )}

      {/* ── Factory Reset Dialog ── */}
      <FactoryResetDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleFactoryReset}
        isResetting={isResetting}
      />
    </div>
  );
}
