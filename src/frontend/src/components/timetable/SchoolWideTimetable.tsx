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
import { Skeleton } from "@/components/ui/skeleton";
import {
  type ClassLinks,
  type ClassTimetableData,
  computeEndTime,
  getCurrentPeriodNumber,
  getPeriodStatus,
  useClassLinks,
  useSaveClassLinks,
  useSchoolWideTimetable,
} from "@/hooks/useTimetable";
import { Camera, Link2, Printer, Radio, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "@/components/timetable/timetable-print.css";
import { useAppStore } from "@/store/useAppStore";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface Props {
  sessionId?: string;
}

// ─── Class Links Dialog ──────────────────────────────────────────────────────────
function ClassLinksDialog({
  classLabel,
  classLevel,
  sectionName,
  onClose,
}: {
  classLabel: string;
  classLevel: string;
  sectionName: string;
  onClose: () => void;
}) {
  const { data: existingLinks = [] } = useClassLinks();
  const saveLinks = useSaveClassLinks();
  const [cctvUrl, setCctvUrl] = useState("");
  const [broadcastUrl, setBroadcastUrl] = useState("");

  // Pre-fill from saved data
  useEffect(() => {
    const found = existingLinks.find(
      (l) => l.classLevel === classLevel && l.sectionName === sectionName,
    );
    if (found) {
      setCctvUrl(found.cctvUrl);
      setBroadcastUrl(found.broadcastUrl);
    }
  }, [existingLinks, classLevel, sectionName]);

  async function handleSave() {
    // Build the full updated list (keep others, upsert this class)
    const others = existingLinks.filter(
      (l) => !(l.classLevel === classLevel && l.sectionName === sectionName),
    );
    const updated: ClassLinks[] = [
      ...others,
      { classLevel, sectionName, cctvUrl, broadcastUrl },
    ];
    try {
      await saveLinks.mutateAsync(updated);
      toast.success(`Links saved for ${classLabel}`);
      onClose();
    } catch {
      toast.error("Failed to save links. Please try again.");
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        style={{ zIndex: 9999 }}
        data-ocid="school-timetable.class_links_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="size-4 text-primary" />
            Class Links — {classLabel}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Camera className="size-3.5 text-muted-foreground" /> CCTV Camera
              URL
            </Label>
            <Input
              placeholder="e.g. http://192.168.1.100"
              value={cctvUrl}
              onChange={(e) => setCctvUrl(e.target.value)}
              data-ocid="school-timetable.class_links.cctv_input"
            />
            {cctvUrl && (
              <a
                href={cctvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Test link →
              </a>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Radio className="size-3.5 text-muted-foreground" /> Digital
              Broadcast / PA System URL
            </Label>
            <Input
              placeholder="e.g. http://192.168.1.200/broadcast"
              value={broadcastUrl}
              onChange={(e) => setBroadcastUrl(e.target.value)}
              data-ocid="school-timetable.class_links.broadcast_input"
            />
            {broadcastUrl && (
              <a
                href={broadcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Test link →
              </a>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="school-timetable.class_links.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveLinks.isPending}
            data-ocid="school-timetable.class_links.save_button"
          >
            {saveLinks.isPending ? (
              <Save className="size-4 mr-1 animate-pulse" />
            ) : (
              <Save className="size-4 mr-1" />
            )}
            Save Links
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main SchoolWideTimetable ─────────────────────────────────────────────────────
export function SchoolWideTimetable({ sessionId }: Props) {
  const {
    data: pairs = [],
    isLoading,
    refetch,
  } = useSchoolWideTimetable(sessionId);
  const { data: classLinks = [] } = useClassLinks();
  const activeSession = useAppStore((s) => s.currentSession);
  const [filterDay, setFilterDay] = useState<string>("today");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState(new Date());
  const [linksDialogFor, setLinksDialogFor] = useState<{
    classLabel: string;
    classLevel: string;
    sectionName: string;
  } | null>(null);

  // Live clock refresh every 60s
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  void tick;

  const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const todayDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const currentTimeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const printDateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!pairs.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        data-ocid="school-timetable.empty_state"
      >
        <div className="text-4xl mb-3">🗓</div>
        <p className="text-muted-foreground">
          No timetables found for this session.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Generate class timetables first from the Class-wise tab.
        </p>
      </div>
    );
  }

  const classLabels = pairs.map(([label]) => label);
  const allPeriodNumbers = Array.from(
    new Set(
      pairs.flatMap(([, tt]) =>
        tt.periodConfigs.length
          ? tt.periodConfigs
              .filter((p) => !p.isInterval)
              .map((p) => p.periodNumber)
          : tt.entries.map((e) => e.periodNumber),
      ),
    ),
  ).sort((a, b) => a - b);

  const refPeriodConfigs = pairs[0]?.[1]?.periodConfigs ?? [];

  const visiblePeriods =
    filterPeriod === "all"
      ? allPeriodNumbers
      : allPeriodNumbers.filter((p) => String(p) === filterPeriod);

  // Determine which days to show (screen)
  const isTodayInDays = DAYS.includes(todayName);
  const activeDays =
    filterDay === "today"
      ? isTodayInDays
        ? [todayName]
        : [DAYS[0]]
      : filterDay === "all"
        ? DAYS
        : [filterDay];

  const getEntry = (tt: ClassTimetableData, day: string, period: number) =>
    tt.entries.find((e) => e.dayOfWeek === day && e.periodNumber === period);

  const periodStatus = (period: number) =>
    refPeriodConfigs.length
      ? getPeriodStatus(period, refPeriodConfigs)
      : "upcoming";

  const getPeriodCfg = (period: number) =>
    refPeriodConfigs.find((p) => p.periodNumber === period);

  function getClassLinksFor(label: string) {
    return classLinks.find(
      (l) => label.includes(l.classLevel) && label.includes(l.sectionName),
    );
  }

  function parseLabelParts(label: string): {
    classLevel: string;
    sectionName: string;
  } {
    const pair = pairs.find(([l]) => l === label);
    if (pair) {
      const first = pair[1].entries[0];
      if (first)
        return {
          classLevel: first.classLevel,
          sectionName: first.sectionName,
        };
    }
    return { classLevel: label, sectionName: "" };
  }

  // For print we show all days
  const printDays = DAYS;

  return (
    <div className="space-y-4" data-ocid="school-timetable.panel">
      {/* Header bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {filterDay === "today" ? (
              <>
                Today —{" "}
                <span className="text-primary">
                  {todayName}, {todayDate}
                </span>
              </>
            ) : (
              "School-Wide Timetable"
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Current time: {currentTimeStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getCurrentPeriodNumber(refPeriodConfigs) !== null && (
            <Badge className="bg-green-500 text-white border-0 text-xs">
              🟢 Period {getCurrentPeriodNumber(refPeriodConfigs)} is Live
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            data-ocid="school-timetable.refresh_button"
          >
            <RefreshCw className="size-3.5 mr-1" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            data-ocid="school-timetable.print_button"
            className="gap-1.5"
          >
            <Printer className="size-3.5" /> Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filterDay} onValueChange={setFilterDay}>
          <SelectTrigger
            className="w-36"
            data-ocid="school-timetable.day_filter_select"
          >
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent style={{ zIndex: 9999 }}>
            <SelectItem value="today">📅 Today</SelectItem>
            <SelectItem value="all">All Days</SelectItem>
            {DAYS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger
            className="w-36"
            data-ocid="school-timetable.period_filter_select"
          >
            <SelectValue placeholder="All Periods" />
          </SelectTrigger>
          <SelectContent style={{ zIndex: 9999 }}>
            <SelectItem value="all">All Periods</SelectItem>
            {allPeriodNumbers.map((p) => (
              <SelectItem key={p} value={String(p)}>
                Period {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Screen grid per day ───────────────────────────────────────────── */}
      {activeDays.map((day) => (
        <div
          key={day}
          className="overflow-x-auto rounded-lg border border-border"
        >
          <div className="bg-card px-4 py-2 font-semibold text-sm border-b border-border text-foreground flex items-center gap-2">
            <span>{day}</span>
            {day === todayName && (
              <Badge className="bg-green-500 text-white border-0 text-xs py-0">
                TODAY
              </Badge>
            )}
          </div>
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="bg-muted/40">
                <th className="border border-border px-3 py-2 text-left text-muted-foreground w-24">
                  Period
                </th>
                {classLabels.map((label) => {
                  const links = getClassLinksFor(label);
                  const parts = parseLabelParts(label);
                  return (
                    <th
                      key={label}
                      className="border border-border px-2 py-2 text-center text-muted-foreground min-w-[120px]"
                    >
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <span>{label}</span>
                        {links?.cctvUrl ? (
                          <a
                            href={links.cctvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open CCTV Camera"
                            className="text-primary hover:text-primary/80"
                            data-ocid={`school-timetable.cctv_link.${label.replace(/\s+/g, "_")}`}
                          >
                            <Camera className="size-3" />
                          </a>
                        ) : null}
                        {links?.broadcastUrl ? (
                          <a
                            href={links.broadcastUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open Digital Broadcast"
                            className="text-amber-600 hover:text-amber-500"
                            data-ocid={`school-timetable.broadcast_link.${label.replace(/\s+/g, "_")}`}
                          >
                            <Radio className="size-3" />
                          </a>
                        ) : null}
                        <button
                          type="button"
                          title="Set CCTV / Broadcast links"
                          onClick={() =>
                            setLinksDialogFor({
                              classLabel: label,
                              ...parts,
                            })
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          data-ocid={`school-timetable.add_links_button.${label.replace(/\s+/g, "_")}`}
                        >
                          <Link2 className="size-3" />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visiblePeriods.map((period) => {
                const status = periodStatus(period);
                const cfg = getPeriodCfg(period);
                const rowCls =
                  status === "current"
                    ? "bg-green-50 dark:bg-green-950/30"
                    : status === "past"
                      ? "bg-muted/20"
                      : "";

                return (
                  <tr key={period} className={rowCls}>
                    <td
                      className={`border border-border px-3 py-2 font-medium ${
                        status === "current"
                          ? "text-green-700 dark:text-green-400 bg-green-100/60 dark:bg-green-900/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span>P{period}</span>
                          {status === "current" && (
                            <Badge className="text-[9px] px-1 py-0 bg-green-500 text-white border-0">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        {cfg?.startTime && (
                          <span className="text-[10px] font-normal">
                            {cfg.startTime}–
                            {computeEndTime(cfg.startTime, cfg.durationMinutes)}
                          </span>
                        )}
                      </div>
                    </td>
                    {pairs.map(([label, tt]) => {
                      const entry = getEntry(tt, day, period);
                      return (
                        <td
                          key={label}
                          className="border border-border px-2 py-1.5 align-top"
                          data-ocid={`school-timetable.cell.${day.toLowerCase()}.${period}.${label.replace(/\s+/g, "_")}`}
                        >
                          {entry ? (
                            <div className="space-y-0.5">
                              <div className="font-medium text-foreground leading-tight">
                                {entry.subjectName}
                              </div>
                              <div className="text-muted-foreground text-[10px]">
                                {entry.teacherName}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* ── Hidden print area — full weekly school-wide ───────────────────── */}
      <div className="timetable-print-area sr-only" aria-hidden="true">
        {/* Letterhead */}
        <div className="print-letterhead">
          <div>
            <div className="print-school-name">SHUBH SCHOOL ERP</div>
            <div className="print-report-title">
              SCHOOL TIMETABLE — Weekly View
            </div>
            <div className="print-session-badge">
              Session: {activeSession} &nbsp;|&nbsp; Generated: {printDateStr}
            </div>
          </div>
        </div>

        {/* One table per day */}
        {printDays.map((day) => (
          <div key={day}>
            <div className="print-day-header">
              {day}
              {day === todayName ? " ★ TODAY" : ""}
            </div>
            <table className="print-timetable-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th className="row-header">Period</th>
                  {classLabels.map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPeriodNumbers.map((period) => {
                  const status = periodStatus(period);
                  const cfg = getPeriodCfg(period);
                  return (
                    <tr
                      key={period}
                      className={status === "current" ? "current-period" : ""}
                    >
                      <td className="period-cell">
                        <div>P{period}</div>
                        {cfg?.startTime && (
                          <div
                            style={{
                              fontWeight: 400,
                              fontSize: "6.5pt",
                              color: "#555",
                            }}
                          >
                            {cfg.startTime}–
                            {computeEndTime(cfg.startTime, cfg.durationMinutes)}
                          </div>
                        )}
                      </td>
                      {pairs.map(([label, tt]) => {
                        const entry = getEntry(tt, day, period);
                        return (
                          <td key={label}>
                            {entry ? (
                              <>
                                <div className="print-cell-subject">
                                  {entry.subjectName}
                                </div>
                                <div className="print-cell-teacher">
                                  {entry.teacherName}
                                </div>
                              </>
                            ) : (
                              <span className="print-cell-empty">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Footer */}
        <div className="print-footer">
          <div className="print-summary-info">
            <div>Total Classes: {classLabels.length}</div>
            <div>Total Periods: {allPeriodNumbers.length} per day</div>
            <div>Session: {activeSession}</div>
          </div>
          <div className="print-signature-block">
            <div className="print-signature-line" />
            <div className="print-signature-label">Principal Signature</div>
          </div>
          <div className="print-signature-block">
            <div className="print-signature-line" />
            <div className="print-signature-label">Date: {printDateStr}</div>
          </div>
        </div>
      </div>

      {linksDialogFor && (
        <ClassLinksDialog
          classLabel={linksDialogFor.classLabel}
          classLevel={linksDialogFor.classLevel}
          sectionName={linksDialogFor.sectionName}
          onClose={() => setLinksDialogFor(null)}
        />
      )}
    </div>
  );
}
