import type { CellCopyOp } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ClassTimetableData,
  type CopiedCell,
  type TimetableEntry,
  type TimetablePeriodConfig,
  computeEndTime,
  getPeriodStatus,
  useCopyPasteTimetableCells,
  useUpdateClassTimetable,
} from "@/hooks/useTimetable";
import {
  CheckCheck,
  Clipboard,
  Copy,
  Edit3,
  Printer,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface EditCellState {
  dayOfWeek: string;
  periodNumber: number;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  startTime: string;
  endTime: string;
}

interface Props {
  timetable: ClassTimetableData;
  onTimetableChange?: (updated: ClassTimetableData) => void;
  copiedCell: CopiedCell | null;
  onCopy: (cell: CopiedCell) => void;
  readOnly?: boolean;
}

export function ClassTimetableGrid({
  timetable,
  onTimetableChange,
  copiedCell,
  onCopy,
  readOnly = false,
}: Props) {
  const updateTimetable = useUpdateClassTimetable();
  const copyPaste = useCopyPasteTimetableCells();
  const [editCell, setEditCell] = useState<EditCellState | null>(null);
  const [pasteTarget, setPasteTarget] = useState<{
    day: string;
    period: number;
  } | null>(null);
  const [_currentPeriod, setCurrentPeriod] = useState<number | null>(null);
  const [_tick, setTick] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const activeSession = useAppStore((s) => s.currentSession);
  // Track focused cell for keyboard Ctrl+C
  const [focusedCell, setFocusedCell] = useState<{
    day: string;
    period: number;
  } | null>(null);

  // Live clock — refresh every 60 seconds
  useEffect(() => {
    const refresh = () => {
      setTick((t) => t + 1);
    };
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  // Compute current period from tick
  useEffect(() => {
    if (!timetable.periodConfigs.length) {
      setCurrentPeriod(null);
      return;
    }
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    let found: number | null = null;
    for (const cfg of timetable.periodConfigs) {
      if (cfg.isInterval) continue;
      const [h, m] = cfg.startTime.split(":").map(Number);
      const start = h * 60 + m;
      const end = start + cfg.durationMinutes;
      if (mins >= start && mins < end) {
        found = cfg.periodNumber;
        break;
      }
    }
    setCurrentPeriod(found);
  }, [timetable.periodConfigs]);

  const getEntry = useCallback(
    (day: string, period: number): TimetableEntry | undefined =>
      timetable.entries.find(
        (e) => e.dayOfWeek === day && e.periodNumber === period,
      ),
    [timetable.entries],
  );

  const getPeriodCfg = useCallback(
    (period: number): TimetablePeriodConfig | undefined =>
      timetable.periodConfigs.find((p) => p.periodNumber === period),
    [timetable.periodConfigs],
  );

  const cellStatus = (period: number): "current" | "past" | "upcoming" =>
    timetable.periodConfigs.length
      ? getPeriodStatus(period, timetable.periodConfigs)
      : "upcoming";

  const handleCopyCell = useCallback(
    (day: string, period: number) => {
      const entry = getEntry(day, period);
      if (!entry) {
        toast.info("Cell is empty — nothing to copy.");
        return;
      }
      onCopy({
        timetableId: timetable.id,
        dayOfWeek: day,
        periodNumber: period,
        subjectName: entry.subjectName,
        teacherName: entry.teacherName,
        teacherStaffId: entry.teacherStaffId,
        classLevel: entry.classLevel,
        sectionName: entry.sectionName,
      });
      toast.success(`Copied: ${entry.subjectName} (${entry.teacherName})`);
    },
    [timetable, onCopy, getEntry],
  );

  const handlePaste = useCallback(
    async (day: string, period: number) => {
      if (!copiedCell) return;
      const cfg = getPeriodCfg(period);
      const ops: CellCopyOp[] = [
        {
          source: {
            classId: copiedCell.timetableId,
            dayOfWeek: copiedCell.dayOfWeek,
            periodNumber: BigInt(copiedCell.periodNumber),
          },
          target: {
            classId: timetable.id,
            dayOfWeek: day,
            periodNumber: BigInt(period),
          },
        },
      ];
      try {
        await copyPaste.mutateAsync(ops);
        // Also update local state optimistically
        const newEntry: TimetableEntry = {
          ...copiedCell,
          dayOfWeek: day,
          periodNumber: period,
          startTime: cfg?.startTime ?? "",
          endTime: cfg
            ? computeEndTime(cfg.startTime, cfg.durationMinutes)
            : "",
        };
        const filtered = timetable.entries.filter(
          (e) => !(e.dayOfWeek === day && e.periodNumber === period),
        );
        onTimetableChange?.({
          ...timetable,
          entries: [...filtered, newEntry],
        });
        toast.success(`Pasted: ${copiedCell.subjectName} → ${day} P${period}`);
        setPasteTarget(null);
      } catch {
        toast.error("Failed to paste. Please try again.");
      }
    },
    [copiedCell, timetable, copyPaste, onTimetableChange, getPeriodCfg],
  );

  // Keyboard copy (Ctrl+C on focused cell) and paste (Ctrl+V on paste target)
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (readOnly) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && focusedCell) {
        e.preventDefault();
        handleCopyCell(focusedCell.day, focusedCell.period);
      }
      const pasteDestination = pasteTarget ?? focusedCell;
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "v" &&
        copiedCell &&
        pasteDestination
      ) {
        e.preventDefault();
        handlePaste(pasteDestination.day, pasteDestination.period);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [
    copiedCell,
    pasteTarget,
    focusedCell,
    readOnly,
    handleCopyCell,
    handlePaste,
  ]);

  const handleEditSave = async () => {
    if (!editCell) return;
    const cfg = getPeriodCfg(editCell.periodNumber);
    const newEntry: TimetableEntry = {
      periodNumber: editCell.periodNumber,
      dayOfWeek: editCell.dayOfWeek,
      classLevel: timetable.entries[0]?.classLevel ?? "",
      sectionName: timetable.entries[0]?.sectionName ?? "",
      subjectName: editCell.subjectName,
      teacherName: editCell.teacherName,
      teacherStaffId: editCell.teacherStaffId,
      startTime: cfg?.startTime ?? editCell.startTime,
      endTime: cfg
        ? computeEndTime(cfg.startTime, cfg.durationMinutes)
        : editCell.endTime,
    };
    const updated: ClassTimetableData = {
      ...timetable,
      entries: [
        ...timetable.entries.filter(
          (e) =>
            !(
              e.dayOfWeek === editCell.dayOfWeek &&
              e.periodNumber === editCell.periodNumber
            ),
        ),
        newEntry,
      ],
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated,
      });
      onTimetableChange?.(updated);
      setEditCell(null);
      toast.success("Cell updated.");
    } catch {
      toast.error("Failed to save cell.");
    }
  };

  const handleClearCell = async (day: string, period: number) => {
    const updated: ClassTimetableData = {
      ...timetable,
      entries: timetable.entries.filter(
        (e) => !(e.dayOfWeek === day && e.periodNumber === period),
      ),
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated,
      });
      onTimetableChange?.(updated);
      toast.success("Cell cleared.");
    } catch {
      toast.error("Failed to clear cell.");
    }
  };

  // Derive class label for print header
  const classLabel = (() => {
    const first = timetable.entries[0];
    if (!first) return timetable.name || "";
    const CLASS_LABELS: Record<string, string> = {
      PlayWay: "Play Way",
      LKG: "LKG",
      UKG: "UKG",
      Class1: "Class 1",
      Class2: "Class 2",
      Class3: "Class 3",
      Class4: "Class 4",
      Class5: "Class 5",
      Class6: "Class 6",
      Class7: "Class 7",
      Class8: "Class 8",
      Class9: "Class 9",
      Class10: "Class 10",
      Class11: "Class 11",
      Class12: "Class 12",
    };
    const cl = CLASS_LABELS[first.classLevel] ?? first.classLevel;
    return `${cl}${first.sectionName ? ` — Section ${first.sectionName}` : ""}`;
  })();

  const handlePrint = () => {
    window.print();
  };

  // Build period list (including intervals)
  const periods = timetable.periodConfigs.length
    ? timetable.periodConfigs
    : Array.from(
        { length: 8 },
        (_, i) =>
          ({
            periodNumber: i + 1,
            startTime: "",
            durationMinutes: 45,
            isInterval: false,
          }) as TimetablePeriodConfig,
      );

  return (
    <div className="overflow-x-auto" ref={gridRef}>
      {/* Print button in toolbar */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <div className="flex-1">
            {copiedCell ? (
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 text-xs"
              >
                <CheckCheck className="h-3 w-3" />
                Copied: {copiedCell.subjectName} ({copiedCell.teacherName})
                <span className="text-muted-foreground">
                  — Ctrl+V or click cell to paste
                </span>
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                Right-click or hover a cell to copy • Ctrl+V to paste
              </span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handlePrint}
            data-ocid="timetable.class.print_button"
            className="gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
        </div>
      )}

      {/* ── Visible grid ─────────────────────────────────────────────────── */}
      <table className="min-w-full border-collapse text-sm select-none">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-card border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-28">
              Period
            </th>
            {DAYS.map((d) => (
              <th
                key={d}
                className="border border-border px-3 py-2 text-center text-xs font-semibold text-foreground min-w-[130px]"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((cfg) => {
            if (cfg.isInterval) {
              return (
                <tr key={`interval-${cfg.periodNumber}`}>
                  <td className="sticky left-0 z-10 bg-muted/40 border border-border px-3 py-1 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1">
                      <span>🍽</span>
                      <span>{cfg.label ?? "Break"}</span>
                      {cfg.startTime && (
                        <span className="text-muted-foreground/60">
                          {cfg.startTime}
                        </span>
                      )}
                    </div>
                  </td>
                  {DAYS.map((d) => (
                    <td
                      key={d}
                      className="bg-muted/20 border border-border text-center text-xs text-muted-foreground"
                    >
                      —
                    </td>
                  ))}
                </tr>
              );
            }

            const status = cellStatus(cfg.periodNumber);
            const rowBg =
              status === "current"
                ? "bg-green-50 dark:bg-green-950/30"
                : status === "past"
                  ? "bg-muted/30"
                  : "";

            return (
              <tr key={cfg.periodNumber} className={rowBg}>
                {/* Period label */}
                <td
                  className={`sticky left-0 z-10 border border-border px-3 py-2 min-w-[7rem] ${
                    status === "current"
                      ? "bg-green-100 dark:bg-green-900/40"
                      : status === "past"
                        ? "bg-muted/50"
                        : "bg-card"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold ${
                          status === "current"
                            ? "text-green-700 dark:text-green-400"
                            : status === "past"
                              ? "text-muted-foreground"
                              : "text-foreground"
                        }`}
                      >
                        P{cfg.periodNumber}
                      </span>
                      {status === "current" && (
                        <Badge className="text-[10px] px-1 py-0 bg-green-500 text-white border-0">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    {cfg.startTime && (
                      <span className="text-[10px] text-muted-foreground">
                        {cfg.startTime}–
                        {computeEndTime(cfg.startTime, cfg.durationMinutes)}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {cfg.durationMinutes}m
                    </span>
                  </div>
                </td>

                {/* Day cells */}
                {DAYS.map((day) => {
                  const entry = getEntry(day, cfg.periodNumber);
                  const isPasteTarget =
                    pasteTarget?.day === day &&
                    pasteTarget?.period === cfg.periodNumber;

                  return (
                    <td
                      key={day}
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          e.currentTarget.click();
                      }}
                      data-ocid={`timetable.cell.${day.toLowerCase()}.${cfg.periodNumber}`}
                      // biome-ignore lint/a11y/noNoninteractiveTabindex: timetable cells are interactive — clickable, copyable, pasteable
                      tabIndex={0}
                      onFocus={() =>
                        setFocusedCell({ day, period: cfg.periodNumber })
                      }
                      onBlur={() => setFocusedCell(null)}
                      className={`border border-border px-2 py-1.5 align-top cursor-pointer group relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        focusedCell?.day === day &&
                        focusedCell?.period === cfg.periodNumber
                          ? "ring-2 ring-primary/60"
                          : isPasteTarget
                            ? "ring-2 ring-primary ring-offset-1"
                            : copiedCell
                              ? "hover:bg-primary/5"
                              : "hover:bg-accent/30"
                      }`}
                      onMouseEnter={() => {
                        if (copiedCell)
                          setPasteTarget({ day, period: cfg.periodNumber });
                      }}
                      onMouseLeave={() => {
                        if (copiedCell) setPasteTarget(null);
                      }}
                      onClick={() => {
                        if (readOnly) return;
                        if (copiedCell) {
                          handlePaste(day, cfg.periodNumber);
                        } else if (entry) {
                          setEditCell({
                            dayOfWeek: day,
                            periodNumber: cfg.periodNumber,
                            subjectName: entry.subjectName,
                            teacherName: entry.teacherName,
                            teacherStaffId: entry.teacherStaffId,
                            startTime: entry.startTime,
                            endTime: entry.endTime,
                          });
                        }
                      }}
                      onContextMenu={(e) => {
                        if (readOnly) return;
                        e.preventDefault();
                        handleCopyCell(day, cfg.periodNumber);
                      }}
                    >
                      {entry ? (
                        <div className="space-y-0.5">
                          <div className="font-medium text-xs text-foreground leading-tight truncate">
                            {entry.subjectName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {entry.teacherName}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground/40 italic">
                          {copiedCell ? "Paste here" : "Empty"}
                        </div>
                      )}

                      {/* Hover actions */}
                      {!readOnly && !copiedCell && (
                        <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                          <button
                            type="button"
                            aria-label="Copy cell"
                            className="p-0.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCell(day, cfg.periodNumber);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {entry && (
                            <>
                              <button
                                type="button"
                                aria-label="Edit cell"
                                className="p-0.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditCell({
                                    dayOfWeek: day,
                                    periodNumber: cfg.periodNumber,
                                    subjectName: entry.subjectName,
                                    teacherName: entry.teacherName,
                                    teacherStaffId: entry.teacherStaffId,
                                    startTime: entry.startTime,
                                    endTime: entry.endTime,
                                  });
                                }}
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                aria-label="Clear cell"
                                className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearCell(day, cfg.periodNumber);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Hidden print area ────────────────────────────────────────────── */}
      <div
        ref={printAreaRef}
        className="timetable-print-area sr-only"
        aria-hidden="true"
      >
        {/* Letterhead */}
        <div className="print-letterhead">
          <div>
            <div className="print-school-name">SHUBH SCHOOL ERP</div>
            <div className="print-report-title">
              CLASS TIMETABLE — {classLabel}
            </div>
            <div className="print-session-badge">
              Session: {activeSession} &nbsp;|&nbsp; Printed:{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Timetable table: Days as columns, Periods as rows */}
        <table className="print-timetable-table">
          <thead>
            <tr>
              <th className="row-header">Period / Day</th>
              {DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((cfg) => {
              if (cfg.isInterval) {
                return (
                  <tr key={`interval-${cfg.periodNumber}`}>
                    <td className="period-cell">
                      {cfg.label ?? "Break"}
                      {cfg.startTime ? ` — ${cfg.startTime}` : ""}
                    </td>
                    {DAYS.map((d) => (
                      <td key={d} className="interval-cell">
                        —
                      </td>
                    ))}
                  </tr>
                );
              }
              const status = cellStatus(cfg.periodNumber);
              return (
                <tr
                  key={cfg.periodNumber}
                  className={status === "current" ? "current-period" : ""}
                >
                  <td className="period-cell">
                    <div>P{cfg.periodNumber}</div>
                    {cfg.startTime && (
                      <div
                        style={{
                          fontWeight: 400,
                          fontSize: "7pt",
                          color: "#555",
                        }}
                      >
                        {cfg.startTime}–
                        {computeEndTime(cfg.startTime, cfg.durationMinutes)}
                      </div>
                    )}
                    <div
                      style={{
                        fontWeight: 400,
                        fontSize: "6.5pt",
                        color: "#777",
                      }}
                    >
                      {cfg.durationMinutes}m
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const entry = getEntry(day, cfg.periodNumber);
                    return (
                      <td key={day}>
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

        {/* Footer */}
        <div className="print-footer">
          <div className="print-summary-info">
            <div>
              Total Periods: {periods.filter((p) => !p.isInterval).length} per
              day
            </div>
            <div>Days: Monday – Saturday</div>
          </div>
          <div className="print-signature-block">
            <div className="print-signature-line" />
            <div className="print-signature-label">Principal Signature</div>
          </div>
          <div className="print-signature-block">
            <div className="print-signature-line" />
            <div className="print-signature-label">
              Date:{" "}
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit cell dialog */}
      {editCell && (
        <Dialog open onOpenChange={(o) => !o && setEditCell(null)}>
          <DialogContent style={{ zIndex: 9999 }} className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                Edit — {editCell.dayOfWeek} Period {editCell.periodNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1">
              <div>
                <Label htmlFor="subjectName">Subject</Label>
                <Input
                  id="subjectName"
                  value={editCell.subjectName}
                  onChange={(e) =>
                    setEditCell({ ...editCell, subjectName: e.target.value })
                  }
                  data-ocid="timetable.edit_subject_input"
                />
              </div>
              <div>
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  value={editCell.teacherName}
                  onChange={(e) =>
                    setEditCell({ ...editCell, teacherName: e.target.value })
                  }
                  data-ocid="timetable.edit_teacher_input"
                />
              </div>
              <div>
                <Label htmlFor="teacherStaffId">Teacher Staff ID</Label>
                <Input
                  id="teacherStaffId"
                  value={editCell.teacherStaffId}
                  onChange={(e) =>
                    setEditCell({ ...editCell, teacherStaffId: e.target.value })
                  }
                  data-ocid="timetable.edit_staffid_input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleEditSave}
                  disabled={updateTimetable.isPending}
                  data-ocid="timetable.edit_save_button"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditCell(null)}
                  data-ocid="timetable.edit_cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
