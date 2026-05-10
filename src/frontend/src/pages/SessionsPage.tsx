import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Switch } from "@/components/ui/switch";
import {
  usePromoteBulkStudents,
  usePromotionPreview,
  useSessions,
} from "@/hooks/useBackend";
import { CLASS_LABELS, CLASS_ORDER, cn, generateId } from "@/lib/utils";
import { DEFAULT_SESSIONS, useAppStore } from "@/store/useAppStore";
import type { PromotionResult } from "@/types";
import type { AcademicSession, ClassLevel } from "@/types";
import {
  Archive,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Plus,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Preview data ──────────────────────────────────────────────────────────────
// Preview data removed — now fetched live from backend via usePromotionPreview

// ─── Session Card ──────────────────────────────────────────────────────────────
function SessionCard({
  session,
  onActivate,
  onArchive,
}: {
  session: AcademicSession;
  onActivate: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-all duration-200",
        session.isActive && "border-primary ring-2 ring-primary/20",
        session.isArchived && "opacity-60",
      )}
      data-ocid={`sessions.item.${session.name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              session.isActive ? "bg-primary/10" : "bg-muted/60",
            )}
          >
            <CalendarClock
              size={18}
              className={
                session.isActive ? "text-primary" : "text-muted-foreground"
              }
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-foreground text-lg">
                {session.name}
              </p>
              {session.isActive && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
              {session.isArchived && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                  Archived
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              April {session.startYear} – March {session.startYear + 1}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!session.isActive && !session.isArchived && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onActivate(session.id)}
              data-ocid={`sessions.activate.${session.name}`}
            >
              <Star size={13} className="mr-1" /> Set Active
            </Button>
          )}
          {!session.isArchived && !session.isActive && (
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setArchiveConfirm(true)}
              data-ocid={`sessions.archive_open.${session.name}`}
            >
              <Archive size={13} className="mr-1" /> Archive
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={archiveConfirm} onOpenChange={setArchiveConfirm}>
        <AlertDialogContent data-ocid="sessions.archive.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Session {session.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Archived sessions are read-only. Only the Super Admin can restore
              them. This action cannot be undone easily.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="sessions.archive.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onArchive(session.id);
                setArchiveConfirm(false);
              }}
              data-ocid="sessions.archive.confirm_button"
            >
              Yes, Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Bulk Promote Section ──────────────────────────────────────────────────────
function BulkPromote({
  activeSession: _activeSession,
}: { activeSession: AcademicSession | undefined }) {
  type Step = "select" | "preview" | "promoting" | "result";
  const { sessions } = useAppStore();
  const { data: backendSessions = [] } = useSessions();
  const allSessionNames = [
    ...new Set(
      [...backendSessions, ...sessions.map((s) => s.name)]
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a)),
    ),
  ];

  const [step, setStep] = useState<Step>("select");
  const [fromClass, setFromClass] = useState<ClassLevel>("Class9");
  const [fromSession, setFromSession] = useState(
    _activeSession?.name ?? "2024-25",
  );
  const [toSession, setToSession] = useState(_activeSession?.name ?? "2025-26");
  const [targetSection, setTargetSection] = useState("");
  const [carryBalance, setCarryBalance] = useState(true);
  const [carryDiscounts, setCarryDiscounts] = useState(true);
  const [carryTransport, setCarryTransport] = useState(true);
  const [result, setResult] = useState<PromotionResult | null>(null);

  const toClassIdx = CLASS_ORDER.indexOf(fromClass) + 1;
  const toClass =
    toClassIdx < CLASS_ORDER.length ? CLASS_ORDER[toClassIdx] : null;
  const isClass12 = fromClass === "Class12";

  const {
    data: previewItems = [],
    isLoading: previewLoading,
    refetch: refetchPreview,
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
        carryTransport,
      });
      setResult(res);
      if (res.promoted > 0)
        toast.success(`${res.promoted} student(s) promoted successfully`);
      if (res.failed > 0) toast.error(`${res.failed} student(s) failed`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Promotion failed";
      setResult({ promoted: 0, failed: previewItems.length, errors: [msg] });
      toast.error(msg);
    }
    setStep("result");
  }

  function reset() {
    setStep("select");
    setResult(null);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-1">
          Bulk Student Promotion
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Promote all students from one class &amp; session to the next class in
          a new session.
        </p>

        {/* Step 1 / 2 combined: Select + Preview */}
        {(step === "select" || step === "preview") && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>From Class</Label>
                <Select
                  value={fromClass}
                  onValueChange={(v) => {
                    setFromClass(v as ClassLevel);
                    setStep("select");
                    setResult(null);
                  }}
                >
                  <SelectTrigger data-ocid="sessions.promote.from.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_ORDER.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CLASS_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>To Class</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-border bg-muted/30">
                  {isClass12 ? (
                    <span className="text-sm font-semibold text-destructive">
                      Graduate
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {toClass ? CLASS_LABELS[toClass] : "\u2014"}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>From Session</Label>
                <Select
                  value={fromSession}
                  onValueChange={(v) => {
                    setFromSession(v);
                    setStep("select");
                  }}
                >
                  <SelectTrigger data-ocid="sessions.promote.from_session.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allSessionNames.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>To Session (Destination)</Label>
                <Select
                  value={toSession}
                  onValueChange={(v) => {
                    setToSession(v);
                    setStep("select");
                  }}
                >
                  <SelectTrigger data-ocid="sessions.promote.to_session.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allSessionNames.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Target Section (optional)</Label>
                <Input
                  placeholder="e.g. A (leave blank to keep current section)"
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  data-ocid="sessions.promote.target_section.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Carry Old Balance
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pending fees carry over to new session
                  </p>
                </div>
                <Switch
                  checked={carryBalance}
                  onCheckedChange={setCarryBalance}
                  data-ocid="sessions.promote.carry_dues.switch"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Carry Discounts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Student discounts transfer to new session
                  </p>
                </div>
                <Switch
                  checked={carryDiscounts}
                  onCheckedChange={setCarryDiscounts}
                  data-ocid="sessions.promote.carry_discounts.switch"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Carry Transport Route
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bus route assignment carries over
                  </p>
                </div>
                <Switch
                  checked={carryTransport}
                  onCheckedChange={setCarryTransport}
                  data-ocid="sessions.promote.carry_transport.switch"
                />
              </div>
            </div>

            {isClass12 && (
              <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                Class 12 students will be marked as <strong>Graduated</strong>{" "}
                (discontinued) after promotion.
              </div>
            )}

            {step === "select" && (
              <Button
                onClick={() => {
                  refetchPreview();
                  setStep("preview");
                }}
                disabled={!fromClass || !fromSession || !toSession}
                data-ocid="sessions.promote.preview_button"
              >
                Preview Students
              </Button>
            )}

            {step === "preview" && (
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
                  <div className="bg-muted/40 border-b border-border px-4 py-2.5 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {previewLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={13} className="animate-spin" /> Loading
                          preview&hellip;
                        </span>
                      ) : (
                        <>
                          {previewItems.length} student(s) from{" "}
                          {CLASS_LABELS[fromClass]}
                          {!isClass12 && toClass && (
                            <span className="text-muted-foreground">
                              {" "}
                              &rarr; {CLASS_LABELS[toClass]}
                            </span>
                          )}
                          {isClass12 && (
                            <span className="text-destructive">
                              {" "}
                              &rarr; Graduate
                            </span>
                          )}
                        </>
                      )}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {fromSession} &rarr; {toSession}
                    </span>
                  </div>
                  <div className="divide-y divide-border max-h-60 overflow-y-auto">
                    {previewItems.length === 0 && !previewLoading && (
                      <p
                        className="text-sm text-muted-foreground text-center py-6"
                        data-ocid="sessions.promote.empty_state"
                      >
                        No students found for {CLASS_LABELS[fromClass]} in{" "}
                        {fromSession}.
                      </p>
                    )}
                    {previewItems.map((s, i) => (
                      <div
                        key={s.studentId}
                        className="px-4 py-2 flex items-center justify-between"
                        data-ocid={`sessions.promote.student.${i + 1}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-muted-foreground font-mono w-16 shrink-0">
                            {s.admNo}
                          </span>
                          <span className="text-sm text-foreground truncate">
                            {s.fullName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2">
                          {s.oldBalance > 0 && (
                            <span className="text-amber-600">
                              &#8377;{s.oldBalance.toFixed(0)} due
                            </span>
                          )}
                          {s.discountCount > 0 && (
                            <span className="text-primary">
                              {s.discountCount} disc
                            </span>
                          )}
                          {!isClass12 && toClass && (
                            <>
                              <ArrowRight size={11} />
                              <span className="font-medium text-primary">
                                {CLASS_LABELS[toClass]}
                              </span>
                            </>
                          )}
                          {isClass12 && (
                            <span className="text-destructive font-medium">
                              Graduate
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("select")}
                    data-ocid="sessions.promote.back_button"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={executePromotion}
                    disabled={previewItems.length === 0 || previewLoading}
                    data-ocid="sessions.promote.execute_button"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    Confirm &amp; Promote {previewItems.length} Students
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: In Progress */}
        {step === "promoting" && (
          <div
            className="flex flex-col items-center gap-4 py-8"
            data-ocid="sessions.promote.loading_state"
          >
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">
              Promoting students&hellip; please wait
            </p>
            <p className="text-xs text-muted-foreground">
              {CLASS_LABELS[fromClass]} &rarr;{" "}
              {isClass12
                ? "Graduated"
                : toClass
                  ? CLASS_LABELS[toClass]
                  : "\u2014"}
            </p>
            <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === "result" && result !== null && (
          <div className="space-y-4" data-ocid="sessions.promote.result">
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center dark:bg-emerald-900/20">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  {result.promoted}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                  Students promoted
                </p>
              </div>
              {result.failed > 0 && (
                <div className="flex-1 rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">
                    {result.failed}
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">Failed</p>
                </div>
              )}
            </div>
            {result.errors.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-32 overflow-y-auto space-y-1">
                <p className="text-xs font-semibold text-destructive mb-1">
                  Errors:
                </p>
                {result.errors.map((e) => (
                  <p key={e.slice(0, 60)} className="text-xs text-destructive">
                    {e}
                  </p>
                ))}
              </div>
            )}
            {result.promoted > 0 && (
              <div
                className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                data-ocid="sessions.promote.success_state"
              >
                <CheckCircle2 size={16} />
                <span>
                  Promotion complete! {result.promoted} students moved from{" "}
                  {CLASS_LABELS[fromClass]} ({fromSession}) &rarr;{" "}
                  {isClass12
                    ? "Graduated"
                    : toClass
                      ? `${CLASS_LABELS[toClass]} (${toSession})`
                      : toSession}
                  .
                </span>
              </div>
            )}
            <Button
              onClick={reset}
              variant="outline"
              data-ocid="sessions.promote.done_button"
            >
              Promote Another Class
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const { sessions, setSessions, currentSession, setSession } = useAppStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });

  // Ensure default sessions are always present (merge if missing)
  const allSessions = (() => {
    const existingNames = new Set(sessions.map((s) => s.name));
    const missing = DEFAULT_SESSIONS.filter((s) => !existingNames.has(s.name));
    return missing.length > 0 ? [...sessions, ...missing] : sessions;
  })();

  const activeSession = allSessions.find((s) => s.isActive);

  function activateSession(id: string) {
    const updated = allSessions.map((s) => ({ ...s, isActive: s.id === id }));
    setSessions(updated);
    const activated = updated.find((s) => s.id === id);
    if (activated) setSession(activated.name);
  }

  function archiveSession(id: string) {
    setSessions(
      allSessions.map((s) => (s.id === id ? { ...s, isArchived: true } : s)),
    );
  }

  function createSession() {
    if (!form.name) return;
    const newSess: AcademicSession = {
      id: generateId(),
      name: form.name,
      startYear: Number(form.name.split("-")[0]) || new Date().getFullYear(),
      isActive: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    setSessions([...allSessions, newSess]);
    setCreateOpen(false);
    setForm({ name: "", startDate: "", endDate: "" });
  }

  const sorted = [...allSessions].sort((a, b) => b.startYear - a.startYear);

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="sessions.page">
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarClock className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Sessions
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage academic sessions · Active:{" "}
                <span className="text-primary font-semibold">
                  {activeSession?.name ?? "None"}
                </span>{" "}
                · Viewing:{" "}
                <span className="text-foreground font-semibold">
                  {currentSession}
                </span>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            data-ocid="sessions.create_button"
          >
            <Plus size={14} className="mr-1.5" /> New Session
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background">
        <div className="p-6 space-y-8">
          {/* Info banner for archived sessions */}
          <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Historical Data:
            </span>{" "}
            Sessions from 2019-20 onwards are preserved. Archived sessions are
            read-only — you can view student details and fee records for any
            past session.
          </div>

          {/* Session List */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-foreground">
              All Sessions
            </h2>
            <div className="grid gap-3">
              {sorted.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  onActivate={activateSession}
                  onArchive={archiveSession}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Bulk Promote */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-foreground">
              Bulk Student Promotion
            </h2>
            <BulkPromote activeSession={activeSession} />
          </div>
        </div>
      </div>

      {/* Create Session Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-ocid="sessions.create.dialog">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Session Name (YYYY-YY format)</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. 2026-27"
                data-ocid="sessions.create.name.input"
              />
              <p className="text-xs text-muted-foreground">
                Use format like 2026-27 for the academic year
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  data-ocid="sessions.create.start.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  data-ocid="sessions.create.end.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              data-ocid="sessions.create.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={createSession}
              disabled={!form.name}
              data-ocid="sessions.create.submit_button"
            >
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
