// MyFeesPage — Student / Parent fee view with UPI QR payment
// Works for role=Student (shows own fees) and role=Parent (shows all children)
// Gracefully degrades if backend UPI functions are not yet deployed.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePaymentsByStudentAndSession,
  useSchoolInfo,
  useSettings,
  useStudents,
  useSubmitUpiPayment,
  useTotalDueByStudentAndSession,
} from "@/hooks/useBackend";
import { CLASS_LABELS, SCHOOL_MONTHS, formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { FeePayment, Student } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Phone,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildUpiString(
  upiId: string,
  schoolName: string,
  amount: number,
  ref: string,
): string {
  const am = Math.round(amount).toString();
  const tn = encodeURIComponent(`Fees ${ref}`);
  const pn = encodeURIComponent(schoolName);
  return `upi://pay?pa=${upiId}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}

function buildQrImageUrl(data: string): string {
  // Use the QR Server public API to generate QR code image
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&color=1a237e&bgcolor=ffffff&qzone=1&format=png`;
}

const SCHOOL_MONTHS_SHORT: Record<string, string> = {
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

// ─── UPI Payment section for one student ─────────────────────────────────────

interface UpiPaymentSectionProps {
  student: Student;
  balanceDue: number;
  upiId: string;
  schoolName: string;
  schoolPhone: string;
  session: string;
}

function UpiPaymentSection({
  student,
  balanceDue,
  upiId,
  schoolName,
  schoolPhone,
  session,
}: UpiPaymentSectionProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitUpiPayment = useSubmitUpiPayment();

  const ref = `${student.admNo}-${session}`;
  const hasUpi = upiId && upiId !== "school@upi" && upiId !== "";
  const upiString = hasUpi
    ? buildUpiString(upiId, schoolName, balanceDue, ref)
    : "";
  const qrUrl = upiString ? buildQrImageUrl(upiString) : "";

  async function handleSubmitUtr() {
    if (utrNumber.trim().length < 6) {
      toast.error("Please enter a valid UTR number (at least 6 digits)");
      return;
    }
    try {
      await submitUpiPayment.mutateAsync({
        studentId: student.id,
        admNo: student.admNo,
        sessionId: session,
        utrNumber: utrNumber.trim(),
        amount: balanceDue,
      });
      setSubmitted(true);
      toast.success("Payment submitted for verification!");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  }

  if (!hasUpi) {
    return (
      <div
        className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4"
        data-ocid="my-fees.upi.not_configured"
      >
        <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={22} />
        <div>
          <p className="font-semibold text-amber-900 text-sm">
            UPI Payment Not Configured
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Please contact school to pay online. UPI/QR payment will be
            available once the school configures their UPI ID.
          </p>
          {schoolPhone && (
            <a
              href={`tel:${schoolPhone}`}
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-800 underline"
              data-ocid="my-fees.school_phone.link"
            >
              <Phone size={14} /> Call School: {schoolPhone}
            </a>
          )}
        </div>
      </div>
    );
  }

  if (balanceDue <= 0) {
    return (
      <div
        className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4"
        data-ocid="my-fees.upi.all_paid"
      >
        <CheckCircle2 className="text-emerald-600 shrink-0" size={28} />
        <div>
          <p className="font-semibold text-emerald-800">All fees paid!</p>
          <p className="text-sm text-emerald-700">
            No outstanding balance for this session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 space-y-5"
      data-ocid="my-fees.upi.section"
    >
      <div className="flex items-center gap-2">
        <Smartphone className="text-primary" size={20} />
        <h3 className="font-bold text-foreground text-base">Pay Fees Online</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Scan with{" "}
        <span className="font-medium text-foreground">
          GPay, PhonePe, Paytm, or any UPI app
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* QR Code */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-48 h-48 rounded-xl border-2 border-primary/20 shadow-sm"
              data-ocid="my-fees.upi.qr_code"
              onError={(e) => {
                // Fallback if QR API fails
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-48 h-48 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
              <p className="text-xs text-muted-foreground text-center px-3">
                QR unavailable
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Scan to pay ₹{balanceDue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Manual Pay & UPI details */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="bg-muted/40 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">UPI ID</span>
              <span className="font-mono font-medium text-foreground select-all">
                {upiId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Due</span>
              <span className="font-bold text-destructive text-base">
                ₹{balanceDue.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono text-xs text-foreground">{ref}</span>
            </div>
          </div>

          {/* Mobile UPI deeplink */}
          <a
            href={upiString}
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
            data-ocid="my-fees.upi.pay_button"
          >
            <IndianRupee size={16} />
            Pay ₹{balanceDue.toLocaleString("en-IN")} via UPI App
          </a>
          <p className="text-[11px] text-muted-foreground text-center">
            (Opens GPay / PhonePe / Paytm on mobile)
          </p>
        </div>
      </div>

      {/* UTR Submission */}
      {!submitted ? (
        <div
          className="border-t border-border pt-5 space-y-3"
          data-ocid="my-fees.utr.section"
        >
          <h4 className="font-semibold text-sm text-foreground">
            Already paid? Submit transaction reference
          </h4>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              UTR / Transaction ID
            </Label>
            <Input
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter 12-digit UTR number"
              maxLength={24}
              className="font-mono"
              data-ocid="my-fees.utr.input"
            />
          </div>
          <Button
            onClick={handleSubmitUtr}
            disabled={submitUpiPayment.isPending || utrNumber.trim().length < 6}
            className="w-full"
            data-ocid="my-fees.utr.submit_button"
          >
            {submitUpiPayment.isPending
              ? "Submitting..."
              : "Submit Payment for Verification"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Admin will verify within 24 hours after submission.
          </p>
        </div>
      ) : (
        <div
          className="border-t border-border pt-5 flex items-center gap-3 bg-emerald-50 rounded-lg p-4"
          data-ocid="my-fees.utr.success_state"
        >
          <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
          <div>
            <p className="font-semibold text-emerald-800 text-sm">
              Payment submitted!
            </p>
            <p className="text-xs text-emerald-700">
              Admin will verify within 24 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fee status card for one student ─────────────────────────────────────────

interface StudentFeeCardProps {
  student: Student;
  session: string;
  upiId: string;
  schoolName: string;
  schoolPhone: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function StudentFeeCard({
  student,
  session,
  upiId,
  schoolName,
  schoolPhone,
  isExpanded,
  onToggle,
  index,
}: StudentFeeCardProps) {
  const { data: payments = [], isLoading: loadingPayments } =
    usePaymentsByStudentAndSession(student.id, session);
  const { data: totals, isLoading: loadingTotals } =
    useTotalDueByStudentAndSession(student.id, session);

  const totalFees = totals?.totalFees ?? 0;
  const totalPaid =
    totals?.totalPaid ??
    payments.reduce((s, p) => s + (p?.totalAmount ?? 0), 0);
  const balanceDue = Math.max(
    0,
    (totals?.totalDue ?? 0) > 0
      ? (totals?.totalDue ?? 0)
      : totalFees - totalPaid,
  );

  // Build paid months from payment items
  const paidMonths = new Set<string>();
  for (const p of payments) {
    for (const it of p?.items ?? []) {
      if (it?.month) paidMonths.add(it.month);
    }
  }

  const classLabel =
    CLASS_LABELS[student.classLevel as keyof typeof CLASS_LABELS] ??
    student.classLevel;

  const isLoading = loadingPayments || loadingTotals;

  return (
    <Card
      className="overflow-hidden border-border"
      data-ocid={`my-fees.student.item.${index}`}
    >
      {/* Student header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
        data-ocid={`my-fees.student.toggle.${index}`}
      >
        <CardHeader className="bg-card py-4 border-b border-border">
          <div className="flex items-center gap-4">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User size={22} className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-bold truncate">
                {student.fullName}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {classLabel} · Adm: {student.admNo} · {student.fatherName}
              </p>
            </div>
            <div className="text-right shrink-0">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p
                    className={`text-lg font-extrabold ${
                      balanceDue > 0 ? "text-destructive" : "text-emerald-600"
                    }`}
                  >
                    ₹{balanceDue.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {balanceDue > 0 ? "Balance Due" : "Paid ✓"}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <CardContent className="p-5 space-y-5 bg-background">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Fee summary bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Fees
                  </p>
                  <p className="font-bold text-foreground text-sm">
                    {formatCurrency(totalFees)}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Paid</p>
                  <p className="font-bold text-emerald-700 text-sm">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
                <div
                  className={`rounded-lg p-3 text-center ${
                    balanceDue > 0 ? "bg-red-50" : "bg-emerald-50"
                  }`}
                >
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p
                    className={`font-bold text-sm ${
                      balanceDue > 0 ? "text-destructive" : "text-emerald-700"
                    }`}
                  >
                    {balanceDue > 0 ? formatCurrency(balanceDue) : "Nil ✓"}
                  </p>
                </div>
              </div>

              {/* Month-wise status */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Month-wise Fee Status ({session})
                </p>
                <div className="flex flex-wrap gap-2">
                  {SCHOOL_MONTHS.map((m) => {
                    const isPaid = paidMonths.has(m);
                    return (
                      <span
                        key={m}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-muted/50 text-muted-foreground border border-border"
                        }`}
                        data-ocid={`my-fees.month.${m.toLowerCase()}.${index}`}
                      >
                        {isPaid ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        {SCHOOL_MONTHS_SHORT[m] ?? m}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Payment history */}
              {payments.length > 0 && (
                <div data-ocid={`my-fees.history.section.${index}`}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Payment History
                  </p>
                  <div className="space-y-2">
                    {payments.map((p: FeePayment, pi) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5 text-sm"
                        data-ocid={`my-fees.history.item.${index}.${pi + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {p.receiptNo || `Receipt ${pi + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.paymentDate?.split("-").reverse().join("/")} ·{" "}
                              {p.paymentMethod ?? "Cash"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            ₹{(p.totalAmount ?? 0).toLocaleString("en-IN")}
                          </p>
                          {(p.balance ?? 0) > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-[10px]"
                            >
                              Bal: ₹{(p.balance ?? 0).toLocaleString("en-IN")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UPI Payment */}
              <UpiPaymentSection
                student={student}
                balanceDue={balanceDue}
                upiId={upiId}
                schoolName={schoolName}
                schoolPhone={schoolPhone}
                session={session}
              />
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyFeesPage() {
  const { currentUser, currentSession } = useAppStore();
  const { data: schoolInfo } = useSchoolInfo();
  const { data: settings } = useSettings();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();

  const upiId = settings?.gpayUpiId ?? "";
  const schoolName = schoolInfo?.name ?? "SHUBH SCHOOL ERP";
  const schoolPhone = schoolInfo?.phone ?? "";

  const role = (currentUser?.role ?? "").toLowerCase();
  const isStudentOrParent = role === "student" || role === "parent";

  // Identify which students belong to this user
  // For student: match by admNo / username
  // For parent: match by mobile number matching father/mother mobile
  const myStudents: Student[] = (() => {
    if (!currentUser || !allStudents.length) return [];
    const username = (currentUser.fullName ?? "").toLowerCase().trim();
    if (role === "student") {
      // Try matching admNo or username to student
      const found = allStudents.filter(
        (s) =>
          s.admNo.toLowerCase() === username ||
          s.fullName.toLowerCase().replace(/\s+/g, "") === username,
      );
      return found.length > 0 ? found : allStudents.slice(0, 1);
    }
    if (role === "parent") {
      // Match by parent mobile (father or mother mobile matching username/mobile)
      const found = allStudents.filter(
        (s) =>
          s.fatherMobile === username ||
          s.motherMobile === username ||
          s.fatherName.toLowerCase().replace(/\s+/g, "") === username,
      );
      return found.length > 0 ? found : [];
    }
    return [];
  })();

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  function toggleCard(i: number) {
    setExpandedIndex((prev) => (prev === i ? -1 : i));
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="my-fees.page">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <IndianRupee size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              My Fees
            </h1>
            <p className="text-xs text-muted-foreground">
              Session: {currentSession} · {schoolName}
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold shrink-0">
            {currentSession}
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Loading state */}
        {loadingStudents ? (
          <div className="space-y-4" data-ocid="my-fees.loading_state">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : myStudents.length === 0 ? (
          /* Empty state */
          <div
            className="bg-card border border-dashed border-border rounded-xl py-20 text-center"
            data-ocid="my-fees.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              No student record found
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Your student record could not be found in the system. Please
              contact the school office.
            </p>
            {schoolPhone && (
              <a
                href={`tel:${schoolPhone}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                data-ocid="my-fees.contact.link"
              >
                <Phone size={15} /> {schoolPhone}
              </a>
            )}
          </div>
        ) : (
          /* Student cards */
          myStudents.map((student, i) => (
            <StudentFeeCard
              key={student.id}
              student={student}
              session={currentSession}
              upiId={upiId}
              schoolName={schoolName}
              schoolPhone={schoolPhone}
              isExpanded={expandedIndex === i}
              onToggle={() => toggleCard(i)}
              index={i + 1}
            />
          ))
        )}

        {/* Info box for non-student/parent roles viewing the page */}
        {!isStudentOrParent && (
          <div className="bg-muted/40 border border-border rounded-xl p-5 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This page is designed for student/parent logins. As an admin you
              are viewing a preview.
            </p>
            {allStudents.length > 0 && myStudents.length === 0 && (
              <StudentFeeCard
                student={allStudents[0]}
                session={currentSession}
                upiId={upiId}
                schoolName={schoolName}
                schoolPhone={schoolPhone}
                isExpanded={expandedIndex === 0}
                onToggle={() => toggleCard(0)}
                index={1}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
