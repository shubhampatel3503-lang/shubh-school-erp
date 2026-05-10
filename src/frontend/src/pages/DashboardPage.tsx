import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDashboardKPIs,
  useGetAttendanceBreakdown,
  useGetDailyFeeBreakdown,
  useGetStaffAttendanceBreakdown,
  useNotifications,
  useSections,
  useStudentSearch,
  useStudents,
} from "@/hooks/useBackend";
import { CLASS_LABELS } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  BookOpen,
  Briefcase,
  Cake,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  IndianRupee,
  Layers,
  Phone,
  Plus,
  Search,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── INR formatter (Indian number system: 1,23,456) ──────────────────────────
// Helper type for staff rows that may have a mobile field
interface StaffRowWithMobile {
  mobile?: string;
}
function formatINR(amount: number): string {
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

// ─── Fees Collected Today Modal ──────────────────────────────────────────────
function FeesTodayModal({
  date,
  totalAmount,
  onClose,
}: {
  date: string;
  totalAmount: number;
  onClose: () => void;
}) {
  const { data: rows = [], isLoading } = useGetDailyFeeBreakdown(date);

  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;

  // Compute total from rows (in case backend v2 total differs)
  const computedTotal = rows.reduce((sum, r) => sum + r.amountCollected, 0);
  const displayTotal = computedTotal > 0 ? computedTotal : totalAmount;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      data-ocid="fees_today_modal.dialog"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-bold font-display text-foreground">
              Fees Collected Today
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayDate} &middot; Total:{" "}
              <span className="font-semibold text-emerald-600">
                {formatINR(displayTotal)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors"
            aria-label="Close"
            data-ocid="fees_today_modal.close_button"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 p-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Loading fee collections…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Student
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Class
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Collector
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Mode
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="fees_today_modal.empty_state"
                    >
                      No fee collections recorded today.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr
                      key={`${row.receiptNo}-${i}`}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`fees_today_modal.row.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 font-medium">
                        {row.studentName || row.studentId}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.className || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-emerald-600">
                        {formatINR(row.amountCollected)}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.collectorName || "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {row.paymentMode}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {row.receiptNo || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot className="border-t-2 border-border bg-muted/50 sticky bottom-0">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-2.5 font-semibold text-sm"
                    >
                      Total ({rows.length} transaction
                      {rows.length !== 1 ? "s" : ""})
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">
                      {formatINR(displayTotal)}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            data-ocid="fees_today_modal.close_button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Breakdown Modal ───────────────────────────────────────────────
function AttendanceBreakdownModal({
  date,
  session,
  onClose,
  onDetails,
}: {
  date: string;
  session: string;
  onClose: () => void;
  onDetails: () => void;
}) {
  const { data, isLoading } = useGetAttendanceBreakdown(date, session);
  const { data: allStudents = [] } = useStudents();
  const { data: sections = [] } = useSections();
  const [drillRow, setDrillRow] = useState<{
    classLevel: string;
    classLabel: string;
    sectionName: string;
  } | null>(null);

  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;

  // Students for drill-down row
  // Map sectionName ("A", "B") → sectionId for the drillRow's class
  const drillSectionId = drillRow
    ? (sections.find(
        (sec) =>
          sec.classLevel === drillRow.classLevel &&
          sec.name === drillRow.sectionName,
      )?.id ?? null)
    : null;

  const drillStudents = drillRow
    ? allStudents.filter(
        (s) =>
          s.classLevel === drillRow.classLevel &&
          (!drillSectionId || s.sectionId === drillSectionId) &&
          !s.isDiscontinued,
      )
    : [];

  if (drillRow) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
        data-ocid="attendance_drill.dialog"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setDrillRow(null)}
          onKeyDown={(e) => e.key === "Escape" && setDrillRow(null)}
          aria-hidden="true"
          role="presentation"
        />
        <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <div>
              <h2 className="text-base font-bold font-display text-foreground">
                {drillRow.classLabel} — Section {drillRow.sectionName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {displayDate} &middot; Click student to call
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrillRow(null)}
              className="size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors"
              aria-label="Back to summary"
              data-ocid="attendance_drill.close_button"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="overflow-auto flex-1 p-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Adm No
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Father
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Mobile
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {drillStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      No students found.
                    </td>
                  </tr>
                ) : (
                  drillStudents.map((s, i) => (
                    <tr
                      key={s.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`attendance_drill.student.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                        {s.admNo}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{s.fullName}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-sm">
                        {s.fatherName}
                      </td>
                      <td className="px-4 py-2.5">
                        {s.fatherMobile ? (
                          <a
                            href={`tel:${s.fatherMobile}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            data-ocid={`attendance_drill.call_button.${i + 1}`}
                          >
                            <Phone className="size-3" />
                            {s.fatherMobile}
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end p-4 border-t border-border shrink-0">
            <button
              type="button"
              onClick={() => setDrillRow(null)}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              data-ocid="attendance_drill.back_button"
            >
              Back to Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      data-ocid="attendance_modal.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-bold font-display text-foreground">
              Today's Attendance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayDate} &middot; Session {session} &middot; Click a row to
              see students
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors"
            aria-label="Close"
            data-ocid="attendance_modal.close_button"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-auto flex-1 p-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Loading attendance data…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Class
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Section
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Present
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Absent
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Total
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.rows ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="attendance_modal.empty_state"
                    >
                      No attendance data for today.
                    </td>
                  </tr>
                ) : (
                  (data?.rows ?? []).map((row, i) => {
                    const pct = row.percent;
                    const pctColor =
                      pct >= 75
                        ? "text-emerald-600"
                        : pct >= 50
                          ? "text-amber-600"
                          : "text-red-500";
                    return (
                      <tr
                        key={`${row.classLevel}-${row.sectionName}`}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        tabIndex={0}
                        onClick={() =>
                          setDrillRow({
                            classLevel: row.classLevel,
                            classLabel: row.classLabel,
                            sectionName: row.sectionName,
                          })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          setDrillRow({
                            classLevel: row.classLevel,
                            classLabel: row.classLabel,
                            sectionName: row.sectionName,
                          })
                        }
                        data-ocid={`attendance_modal.row.${i + 1}`}
                      >
                        <td className="px-4 py-2.5 font-medium">
                          {row.classLabel}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {row.sectionName}
                        </td>
                        <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">
                          {row.present}
                        </td>
                        <td className="px-4 py-2.5 text-right text-red-500 font-medium">
                          {row.absent}
                        </td>
                        <td className="px-4 py-2.5 text-right">{row.total}</td>
                        <td
                          className={`px-4 py-2.5 text-right font-semibold ${pctColor}`}
                        >
                          {pct.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {(data?.rows ?? []).length > 0 && (
                <tfoot className="border-t-2 border-border bg-muted/50 sticky bottom-0">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-2.5 font-semibold text-sm"
                    >
                      Total
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-bold">
                      {data?.totalPresent}
                    </td>
                    <td className="px-4 py-2.5 text-right text-red-500 font-bold">
                      {data?.totalAbsent}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold">
                      {data?.totalStudents}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-bold ${
                        (data?.overallPercent ?? 0) >= 75
                          ? "text-emerald-600"
                          : (data?.overallPercent ?? 0) >= 50
                            ? "text-amber-600"
                            : "text-red-500"
                      }`}
                    >
                      {(data?.overallPercent ?? 0).toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/40 transition-colors"
            data-ocid="attendance_modal.cancel_button"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onDetails}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            data-ocid="attendance_modal.details_button"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Staff Attendance Breakdown Modal ─────────────────────────────────────────
function StaffAttendanceModal({
  date,
  onClose,
  onDetails,
}: {
  date: string;
  onClose: () => void;
  onDetails: () => void;
}) {
  const { data, isLoading } = useGetStaffAttendanceBreakdown(date);

  const dd = date.split("-");
  const displayDate = dd.length === 3 ? `${dd[2]}/${dd[1]}/${dd[0]}` : date;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      data-ocid="staff_modal.dialog"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-bold font-display text-foreground">
              Staff Attendance
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayDate} &middot; {data?.presentCount ?? 0}/
              {data?.totalCount ?? 0} Present
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full hover:bg-muted/60 flex items-center justify-center transition-colors"
            aria-label="Close"
            data-ocid="staff_modal.close_button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-auto flex-1 p-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Loading…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    In Time
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Out Time
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Call
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.rows ?? []).length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                      data-ocid="staff_modal.empty_state"
                    >
                      No staff attendance data for today.
                    </td>
                  </tr>
                ) : (
                  (data?.rows ?? []).map((row, i) => (
                    <tr
                      key={row.staffId}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`staff_modal.row.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 font-medium">
                        {row.staffName}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            row.status === "Present"
                              ? "bg-emerald-100 text-emerald-700"
                              : row.status === "Late"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.status === "Present" ? (
                            <CheckCircle2 className="size-3" />
                          ) : (
                            <XCircle className="size-3" />
                          )}
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.inTime ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.outTime ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        {(row as StaffRowWithMobile).mobile ? (
                          <a
                            href={`tel:${(row as StaffRowWithMobile).mobile}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                            data-ocid={`staff_modal.call_button.${i + 1}`}
                          >
                            <Phone className="size-3" />
                            {(row as StaffRowWithMobile).mobile}
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted/40 transition-colors"
            data-ocid="staff_modal.cancel_button"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onDetails}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            data-ocid="staff_modal.details_button"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Student Search Bar ────────────────────────────────────────────────────────
function StudentSearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = useStudentSearch(debouncedQuery);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setOpen(debouncedQuery.length > 0);
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl"
      data-ocid="dashboard.search_bar"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students by name, mobile, village, father or mother name…"
          className="pl-9 pr-9 h-11 text-sm bg-card border-border shadow-sm"
          data-ocid="dashboard.student_search.input"
          onFocus={() => debouncedQuery.length > 0 && setOpen(true)}
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
            data-ocid="dashboard.student_search.clear_button"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          className="absolute top-full mt-1.5 w-full z-dropdown bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          data-ocid="dashboard.student_search.popover"
        >
          {results.length === 0 ? (
            <div
              className="px-4 py-6 text-center text-sm text-muted-foreground"
              data-ocid="dashboard.student_search.empty_state"
            >
              No students found for "{debouncedQuery}"
            </div>
          ) : (
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {results.map((s, i) => (
                <Link
                  key={s.id}
                  to="/students"
                  onClick={() => setOpen(false)}
                  data-ocid={`dashboard.student_search.item.${i + 1}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                      {s.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {s.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        #{s.admNo} · {CLASS_LABELS[s.classLevel]} · Father:{" "}
                        {s.fatherName}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Session Selector ─────────────────────────────────────────────────────────
function SessionSelector() {
  const { currentSession, sessions, setSession } = useAppStore();
  const sortedSessions = [...sessions].sort(
    (a, b) => b.startYear - a.startYear,
  );

  return (
    <div
      className="flex items-center gap-2"
      data-ocid="dashboard.session_selector"
    >
      <span className="text-xs text-muted-foreground hidden sm:block">
        Session:
      </span>
      <Select value={currentSession} onValueChange={setSession}>
        <SelectTrigger
          className="h-9 w-[140px] text-sm border-primary/40 bg-primary/5 text-primary font-semibold focus:ring-primary/30"
          data-ocid="dashboard.session_selector.select"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[200]">
          {sortedSessions.map((s) => (
            <SelectItem key={s.id} value={s.name}>
              <div className="flex items-center gap-2">
                {s.name === currentSession ? (
                  <span className="size-2 rounded-full bg-primary shrink-0" />
                ) : s.isActive ? (
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/30 shrink-0" />
                )}
                <span
                  className={
                    s.name === currentSession
                      ? "font-semibold text-primary"
                      : ""
                  }
                >
                  {s.name}
                </span>
                {s.isArchived && (
                  <span className="text-[10px] text-muted-foreground">
                    (Archived)
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { currentSession } = useAppStore();
  // Pass currentSession so KPIs filter by the selected academic year.
  // The queryKey inside useDashboardKPIs includes sessionId, so data
  // refreshes automatically whenever the session selector changes.
  const { data: kpis, isLoading } = useDashboardKPIs(currentSession);
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  const [showAttModal, setShowAttModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showFeesTodayModal, setShowFeesTodayModal] = useState(false);

  const todayISO = new Date().toISOString().split("T")[0];

  const v2 = kpis?.v2 ?? null;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6" data-ocid="dashboard.loading_state">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  const pendingAmt = v2?.pendingFeesTotal ?? kpis?.pendingFees ?? 0;
  const attendancePct =
    v2?.attendanceTodayPercent ?? kpis?.attendancePercent ?? null;

  // X/Y format for attendance cards
  const attPresent = v2?.attendanceTodayPresent ?? null;
  const attTotal = v2?.attendanceTodayTotal ?? null;
  const attDisplayValue =
    attPresent != null && attTotal != null && attTotal > 0
      ? `${attPresent} / ${attTotal}`
      : attendancePct != null
        ? `${attendancePct.toFixed(1)}%`
        : "—";

  const staffPresent = v2?.staffAttendanceTodayPresent ?? null;
  const staffTotal = v2?.staffAttendanceTodayTotal ?? null;
  const staffTotalCount = v2?.totalStaff ?? kpis?.totalStaff ?? 0;
  const staffDisplayValue =
    staffPresent != null && staffTotal != null && staffTotal > 0
      ? `${staffPresent} / ${staffTotal}`
      : staffTotalCount.toLocaleString("en-IN");

  const kpiCards: Array<{
    title: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    ocid: string;
    highlight: boolean;
    clickable?: string;
  }> = [
    {
      title: "Total Students",
      value: (v2?.totalStudents ?? kpis?.totalStudents ?? 0).toLocaleString(
        "en-IN",
      ),
      sub: v2
        ? `${v2.totalClasses} classes · ${v2.totalSections} sections`
        : undefined,
      icon: Users,
      ocid: "dashboard.students_kpi",
      highlight: false,
    },
    {
      title: "Staff Attendance",
      value: staffDisplayValue,
      sub:
        staffPresent != null
          ? "Present / Total · Click for details"
          : "Click to see attendance",
      icon: Briefcase,
      ocid: "dashboard.staff_kpi",
      highlight: false,
      clickable: "staff",
    },
    {
      title: "Fees Collected Today",
      value: formatINR(v2?.feesCollectedToday ?? kpis?.feesCollectedToday ?? 0),
      sub: `This month: ${formatINR(v2?.feesCollectedThisMonth ?? kpis?.feesCollectedMonth ?? 0)}`,
      icon: IndianRupee,
      ocid: "dashboard.fees_today_kpi",
      highlight: false,
      clickable: "feesToday",
    },
    {
      title: "Fees This Year",
      value: formatINR(v2?.feesCollectedThisYear ?? 0),
      sub: `Session ${currentSession}`,
      icon: TrendingUp,
      ocid: "dashboard.fees_year_kpi",
      highlight: false,
    },
    {
      title: "Pending Fees",
      value: formatINR(pendingAmt),
      sub: pendingAmt > 0 ? "Outstanding dues" : "No pending dues",
      icon: AlertCircle,
      ocid: "dashboard.pending_fees_kpi",
      highlight: pendingAmt > 0,
    },
    {
      title: "Today's Attendance",
      value: attDisplayValue,
      sub:
        attPresent != null
          ? "Present / Total · Click for breakdown"
          : attendancePct != null
            ? "Click to see breakdown"
            : "No data yet today",
      icon: ClipboardCheck,
      ocid: "dashboard.attendance_kpi",
      highlight: false,
      clickable: "attendance",
    },
    {
      title: "Classes",
      value: (v2?.totalClasses ?? 0).toLocaleString("en-IN"),
      sub: `${v2?.totalSections ?? 0} sections total`,
      icon: BookOpen,
      ocid: "dashboard.classes_kpi",
      highlight: false,
    },
    {
      title: "Sessions",
      value: currentSession,
      sub: "Active academic session",
      icon: Layers,
      ocid: "dashboard.session_kpi",
      highlight: false,
    },
  ];

  // Recent activity from v2 (last 10)
  const recentActivity = (v2?.recentActivity ?? []).slice(0, 10);

  function formatActivityTime(ts: bigint): string {
    const ms = Number(ts) / 1_000_000;
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const HH = String(d.getHours()).padStart(2, "0");
    const MM = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  }

  const activityBadgeColor: Record<string, string> = {
    Payment: "border-green-500 text-green-600 bg-green-50",
    Student: "border-blue-500 text-blue-600 bg-blue-50",
    Attendance: "border-yellow-500 text-yellow-700 bg-yellow-50",
    Staff: "border-purple-500 text-purple-600 bg-purple-50",
    Fee: "border-orange-500 text-orange-600 bg-orange-50",
    Exam: "border-pink-500 text-pink-600 bg-pink-50",
    Transport: "border-cyan-500 text-cyan-600 bg-cyan-50",
  };

  function getBadgeColor(actionType: string): string {
    for (const [key, cls] of Object.entries(activityBadgeColor)) {
      if (actionType.toLowerCase().includes(key.toLowerCase())) return cls;
    }
    return "border-border text-muted-foreground bg-muted/40";
  }

  return (
    <div
      className="p-4 sm:p-6 space-y-6 animate-fade-in"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Data for session{" "}
            <span className="font-semibold text-foreground">
              {currentSession}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SessionSelector />
          <Link to="/students">
            <Button size="sm" data-ocid="dashboard.add_student_button">
              <Plus className="size-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Student Search */}
      <div data-ocid="dashboard.search_section">
        <StudentSearchBar />
      </div>

      {/* KPI Cards — 8 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.ocid}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                className={`card-metric ${
                  card.highlight
                    ? "border-orange-400 bg-orange-50/60 dark:bg-orange-950/20"
                    : ""
                } ${
                  card.clickable
                    ? "cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
                    : ""
                }`}
                data-ocid={card.ocid}
                onClick={
                  card.clickable === "attendance"
                    ? () => setShowAttModal(true)
                    : card.clickable === "staff"
                      ? () => setShowStaffModal(true)
                      : card.clickable === "feesToday"
                        ? () => setShowFeesTodayModal(true)
                        : undefined
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        {card.title}
                      </p>
                      <p
                        className={`text-xl font-bold font-display mt-1 truncate ${
                          card.highlight ? "text-orange-600" : "text-foreground"
                        }`}
                      >
                        {card.value}
                      </p>
                      {card.sub && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {card.sub}
                        </p>
                      )}
                    </div>
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                        card.highlight
                          ? "bg-orange-100 dark:bg-orange-900/40"
                          : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`size-4 ${
                          card.highlight ? "text-orange-500" : "text-primary"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Bar Chart */}
        <Card
          className="lg:col-span-2 border border-border"
          data-ocid="dashboard.fee_chart"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <IndianRupee className="size-4 text-accent" />
              Fee Collection — Monthly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={kpis?.monthlyFeeChart ?? []}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => [formatINR(value), "Fees"]}
                  contentStyle={{
                    backgroundColor: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="oklch(var(--accent))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          {/* Today's Birthdays */}
          <Card
            className="border border-border"
            data-ocid="dashboard.birthdays_card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display flex items-center gap-2">
                <Cake className="size-4 text-accent" />
                Today's Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(kpis?.todayBirthdays ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No birthdays today.
                </p>
              ) : (
                (kpis?.todayBirthdays ?? []).map((b, i) => (
                  <div
                    key={b.admNo}
                    className="flex items-center gap-3 py-1.5 border-b border-border last:border-0"
                    data-ocid={`dashboard.birthday.item.${i + 1}`}
                  >
                    <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
                      🎂
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {b.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.classLabel} · #{b.admNo}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card
            className="border border-border"
            data-ocid="dashboard.notifications_card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display flex items-center gap-2">
                <AlertCircle className="size-4 text-primary" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(notifications ?? []).length === 0 ? (
                <p
                  className="text-xs text-muted-foreground"
                  data-ocid="dashboard.notifications.empty_state"
                >
                  No announcements yet.
                </p>
              ) : (
                (notifications ?? []).slice(0, 3).map((n, i) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2 py-1.5 border-b border-border last:border-0"
                    data-ocid={`dashboard.notification.item.${i + 1}`}
                  >
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 mt-0.5 ${!n.isRead ? "border-accent text-accent" : ""}`}
                    >
                      {n.type}
                    </Badge>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        data-ocid="dashboard.quick_actions"
      >
        {[
          { label: "Collect Fee", href: "/fees", icon: IndianRupee },
          {
            label: "Mark Attendance",
            href: "/attendance",
            icon: ClipboardCheck,
          },
          { label: "Add Student", href: "/students", icon: Users },
          { label: "View Reports", href: "/reports", icon: TrendingUp },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2 font-medium"
                data-ocid={`dashboard.quick_action.${i + 1}`}
              >
                <Icon className="size-5 text-primary" />
                <span className="text-xs">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Fees Today Modal */}
      {showFeesTodayModal && (
        <FeesTodayModal
          date={todayISO}
          totalAmount={v2?.feesCollectedToday ?? kpis?.feesCollectedToday ?? 0}
          onClose={() => setShowFeesTodayModal(false)}
        />
      )}

      {/* Attendance Breakdown Modals */}
      {showAttModal && (
        <AttendanceBreakdownModal
          date={todayISO}
          session={currentSession}
          onClose={() => setShowAttModal(false)}
          onDetails={() => {
            setShowAttModal(false);
            navigate({ to: "/attendance-report" });
          }}
        />
      )}
      {showStaffModal && (
        <StaffAttendanceModal
          date={todayISO}
          onClose={() => setShowStaffModal(false)}
          onDetails={() => {
            setShowStaffModal(false);
            navigate({ to: "/staff-attendance-report" });
          }}
        />
      )}

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card
          className="border border-border"
          data-ocid="dashboard.recent_activity"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Recent Activity
              <Badge
                variant="secondary"
                className="ml-auto text-xs font-normal"
              >
                Last 10 actions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-8 text-center"
                data-ocid="dashboard.recent_activity.empty_state"
              >
                <Activity className="size-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Actions like fee payments, student additions, and attendance
                  marks will appear here.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-px bg-border"
                  aria-hidden
                />
                <div
                  className="space-y-4"
                  data-ocid="dashboard.recent_activity.list"
                >
                  {recentActivity.map((entry, i) => (
                    <div
                      key={`${Number(entry.timestamp)}-${i}`}
                      className="relative flex items-start gap-4 pl-8"
                      data-ocid={`dashboard.recent_activity.item.${i + 1}`}
                    >
                      {/* Dot */}
                      <span className="absolute left-0 top-1.5 size-[10px] rounded-full bg-primary/60 border-2 border-background ring-1 ring-primary/30" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 shrink-0 ${getBadgeColor(entry.actionType)}`}
                          >
                            {entry.actionType}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {formatActivityTime(entry.timestamp)}
                          </span>
                          {entry.userName && (
                            <span className="text-[11px] text-muted-foreground">
                              · {entry.userName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground mt-0.5 leading-snug">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
