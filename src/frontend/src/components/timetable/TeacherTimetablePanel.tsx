import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type TeacherTimetable,
  useGenerateTeacherTimetable,
  useSaveTeacherTimetables,
  useTeacherTimetables,
} from "@/hooks/useTimetable";
import { Loader2, Printer, RefreshCw, Save, User } from "lucide-react";
import { useState } from "react";
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
const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

interface Props {
  sessionId: string;
}

export function TeacherTimetablePanel({ sessionId }: Props) {
  const { data: savedTimetables = [], isLoading } =
    useTeacherTimetables(sessionId);
  const generateMut = useGenerateTeacherTimetable();
  const saveMut = useSaveTeacherTimetables();
  const activeSession = useAppStore((s) => s.currentSession);
  const [generatedTimetables, setGeneratedTimetables] = useState<
    TeacherTimetable[] | null
  >(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null,
  );

  const displayTimetables = generatedTimetables ?? savedTimetables;

  async function handleGenerate() {
    try {
      const result = await generateMut.mutateAsync(sessionId);
      setGeneratedTimetables(result);
      if (result.length > 0) {
        setSelectedTeacherId(result[0]?.teacherStaffId ?? null);
      }
      toast.success(
        `Generated timetable for ${result.length} teacher${result.length !== 1 ? "s" : ""}.`,
      );
    } catch {
      toast.error("Failed to generate teacher timetable. Please try again.");
    }
  }

  async function handleSave() {
    const toSave = generatedTimetables ?? savedTimetables;
    if (!toSave.length) return;
    try {
      await saveMut.mutateAsync(toSave);
      setGeneratedTimetables(null);
      toast.success("Teacher timetables saved successfully!");
    } catch {
      toast.error("Failed to save teacher timetables.");
    }
  }

  function handlePrintSingle() {
    window.print();
  }

  const selectedTimetable =
    displayTimetables.find((t) => t.teacherStaffId === selectedTeacherId) ??
    displayTimetables[0];

  // Collect all unique period numbers across all entries
  const allPeriods = selectedTimetable
    ? Array.from(
        new Set(selectedTimetable.entries.map((e) => e.periodNumber)),
      ).sort((a, b) => a - b)
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="timetable.teacher_panel">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Teacher-wise Timetable
          </p>
          <p className="text-xs text-muted-foreground">
            Auto-generated from subject assignments. No teacher double-booked.
          </p>
        </div>
        <div className="flex gap-2">
          {generatedTimetables && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={saveMut.isPending}
              data-ocid="timetable.teacher.save_button"
            >
              {saveMut.isPending ? (
                <Loader2 className="size-4 mr-1 animate-spin" />
              ) : (
                <Save className="size-4 mr-1" />
              )}
              Save All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={generateMut.isPending}
            data-ocid="timetable.teacher.generate_button"
          >
            {generateMut.isPending ? (
              <Loader2 className="size-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="size-4 mr-1" />
            )}
            {generateMut.isPending
              ? "Generating…"
              : "Generate Teacher Timetable"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSingle}
            disabled={!selectedTimetable}
            data-ocid="timetable.teacher.print_button"
            className="gap-1.5"
          >
            <Printer className="size-4" /> Print
          </Button>
        </div>
      </div>

      {displayTimetables.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center"
          data-ocid="timetable.teacher.empty_state"
        >
          <User className="size-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            No teacher timetables yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Generate Teacher Timetable" to auto-create from subject
            assignments.
          </p>
        </div>
      )}

      {displayTimetables.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Teacher selector tabs */}
          <div className="flex flex-wrap gap-1 p-3 border-b border-border bg-muted/20 overflow-x-auto">
            {displayTimetables.map((t) => (
              <button
                key={t.teacherStaffId}
                type="button"
                onClick={() => setSelectedTeacherId(t.teacherStaffId)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedTeacherId === t.teacherStaffId ||
                  (!selectedTeacherId && t === displayTimetables[0])
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
                data-ocid={`timetable.teacher.tab.${t.teacherStaffId}`}
              >
                {t.teacherName}
              </button>
            ))}
          </div>

          {selectedTimetable && (
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {selectedTimetable.teacherName
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedTimetable.teacherName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTimetable.entries.length} periods assigned
                  </p>
                </div>
              </div>

              {/* Grid: days × periods */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="text-xs w-full min-w-[640px]">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-20 border-r border-border">
                        Day
                      </th>
                      {allPeriods.map((p) => (
                        <th
                          key={p}
                          className="px-2 py-2 text-center font-semibold text-muted-foreground min-w-[100px] border-r border-border last:border-0"
                        >
                          P{p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => {
                      const dayEntries = selectedTimetable.entries.filter(
                        (e) => e.dayOfWeek === day,
                      );
                      return (
                        <tr
                          key={day}
                          className="border-t border-border hover:bg-muted/10"
                          data-ocid={`timetable.teacher.row.${day.toLowerCase()}`}
                        >
                          <td className="px-3 py-2.5 font-semibold text-foreground border-r border-border">
                            {DAY_SHORT[day]}
                          </td>
                          {allPeriods.map((p) => {
                            const entry = dayEntries.find(
                              (e) => e.periodNumber === p,
                            );
                            return (
                              <td
                                key={p}
                                className="px-2 py-2 border-r border-border last:border-0 align-top"
                                data-ocid={`timetable.teacher.cell.${day.toLowerCase()}.${p}`}
                              >
                                {entry ? (
                                  <div className="space-y-0.5">
                                    <div className="font-medium text-foreground leading-tight">
                                      {entry.subjectName}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      {entry.className}
                                      {entry.sectionName
                                        ? ` (${entry.sectionName})`
                                        : ""}
                                    </div>
                                    {entry.startTime && (
                                      <div className="text-[10px] font-mono text-muted-foreground/70">
                                        {entry.startTime}–{entry.endTime}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/30">
                                    —
                                  </span>
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
            </div>
          )}
        </div>
      )}

      {/* ── Hidden print area — only visible during window.print() ───────── */}
      {selectedTimetable && (
        <div className="timetable-print-area sr-only" aria-hidden="true">
          {/* Letterhead */}
          <div className="print-letterhead">
            <div>
              <div className="print-school-name">SHUBH SCHOOL ERP</div>
              <div className="print-report-title">
                TEACHER TIMETABLE — {selectedTimetable.teacherName}
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

          {/* Table: Days as rows, Periods as columns */}
          <table className="print-timetable-table">
            <thead>
              <tr>
                <th className="row-header">Day</th>
                {allPeriods.map((p) => (
                  <th key={p}>P{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => {
                const dayEntries = selectedTimetable.entries.filter(
                  (e) => e.dayOfWeek === day,
                );
                return (
                  <tr key={day}>
                    <td className="period-cell">{day}</td>
                    {allPeriods.map((p) => {
                      const entry = dayEntries.find(
                        (e) => e.periodNumber === p,
                      );
                      return (
                        <td key={p}>
                          {entry ? (
                            <>
                              <div className="print-cell-subject">
                                {entry.subjectName}
                              </div>
                              <div className="print-cell-teacher">
                                {entry.className}
                                {entry.sectionName
                                  ? ` (${entry.sectionName})`
                                  : ""}
                              </div>
                              {entry.startTime && (
                                <div
                                  style={{
                                    fontSize: "6.5pt",
                                    color: "#777",
                                    marginTop: "1px",
                                  }}
                                >
                                  {entry.startTime}–{entry.endTime}
                                </div>
                              )}
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

          {/* Teacher summary */}
          <div className="print-teacher-summary">
            Total periods per week: {selectedTimetable.entries.length}{" "}
            &nbsp;|&nbsp; Days taught:{" "}
            {
              Array.from(
                new Set(selectedTimetable.entries.map((e) => e.dayOfWeek)),
              ).length
            }{" "}
            of 6
          </div>

          {/* Footer */}
          <div className="print-footer">
            <div className="print-summary-info">
              <div>Teacher: {selectedTimetable.teacherName}</div>
              <div>Session: {activeSession}</div>
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
      )}
    </div>
  );
}
