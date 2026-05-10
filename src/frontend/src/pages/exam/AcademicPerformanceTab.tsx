import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAcademicPerformanceReport } from "@/hooks/useBackend";
import { useSessions, useStudents } from "@/hooks/useBackend";
import { CLASS_LABELS } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel } from "@/types";
import { BarChart2, CheckCircle2, Printer, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { calcGrade } from "./MarksEntryTab";

function GradeCell({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    A1: "bg-emerald-100 text-emerald-800",
    A2: "bg-green-100 text-green-800",
    B1: "bg-blue-100 text-blue-800",
    B2: "bg-sky-100 text-sky-800",
    C1: "bg-yellow-100 text-yellow-800",
    C2: "bg-amber-100 text-amber-800",
    D: "bg-orange-100 text-orange-800",
    E: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`}
    >
      {grade}
    </span>
  );
}

export default function AcademicPerformanceTab() {
  const currentSession = useAppStore((s) => s.currentSession);
  const [sessionId, setSessionId] = useState(currentSession);
  const [studentId, setStudentId] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const { data: sessions = [] } = useSessions();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: report, isLoading: loadingReport } =
    useGetAcademicPerformanceReport(studentId, sessionId);

  const student = allStudents.find((s) => s.id === studentId);

  const filteredStudents = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return allStudents.slice(0, 50);
    return allStudents
      .filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.admNo.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [allStudents, searchQ]);

  // Collect all unique subject names across all exams
  const allSubjects = useMemo(() => {
    if (!report) return [];
    const seen = new Set<string>();
    const names: string[] = [];
    for (const exam of report.examSummaries) {
      for (const sm of exam.subjectMarks) {
        if (!seen.has(sm.subjectName)) {
          seen.add(sm.subjectName);
          names.push(sm.subjectName);
        }
      }
    }
    return names;
  }, [report]);

  return (
    <div className="p-6 space-y-5 max-w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Academic Performance Report
          </h2>
          <p className="text-sm text-muted-foreground">
            Year-end combined report across all exams
          </p>
        </div>
        {report && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            data-ocid="academic.print_button"
          >
            <Printer size={14} className="mr-1.5" /> Print
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Session</p>
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger className="w-36" data-ocid="academic.session.select">
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
        <div className="space-y-1 flex-1 min-w-[200px]">
          <p className="text-xs text-muted-foreground font-medium">Student</p>
          <div className="relative">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Search by name or admission no…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              data-ocid="academic.student_search.input"
            />
            {searchQ && filteredStudents.length > 0 && !studentId && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-md max-h-60 overflow-auto">
                {filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center justify-between"
                    onClick={() => {
                      setStudentId(s.id);
                      setSearchQ(s.fullName);
                    }}
                  >
                    <span>{s.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.admNo} ·{" "}
                      {CLASS_LABELS[s.classLevel as ClassLevel] ?? s.classLevel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {studentId && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStudentId("");
                setSearchQ("");
              }}
              data-ocid="academic.clear_button"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Student Summary */}
      {student && report && (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BarChart2 size={20} className="text-primary" />
              )}
            </div>
            <div>
              <p className="font-bold text-foreground">{student.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {CLASS_LABELS[student.classLevel as ClassLevel] ??
                  student.classLevel}{" "}
                · Adm: {student.admNo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Overall %</p>
              <p className="font-bold text-foreground text-lg">
                {report.combinedPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Grade</p>
              <p className="font-bold text-foreground text-lg">
                {report.combinedGrade}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Session</p>
              <p className="font-semibold text-sm text-foreground">
                {sessionId}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {report.overallPassed ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <Badge variant="default">PASS</Badge>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-500" />
                  <Badge variant="destructive">FAIL</Badge>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {(loadingStudents || (studentId && loadingReport)) && (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {/* Empty */}
      {!studentId && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="academic.empty_state"
        >
          <BarChart2
            size={32}
            className="mx-auto text-muted-foreground/40 mb-2"
          />
          <p className="text-sm text-muted-foreground">
            Search and select a student to view their academic performance
            report.
          </p>
        </div>
      )}

      {studentId && !loadingReport && !report && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="academic.no_report_state"
        >
          <p className="text-sm text-muted-foreground">
            No academic performance data found for session {sessionId}.
          </p>
        </div>
      )}

      {studentId &&
        !loadingReport &&
        report &&
        report.examSummaries.length === 0 && (
          <div
            className="rounded-xl border border-border bg-card p-8 text-center"
            data-ocid="academic.no_exams_state"
          >
            <p className="text-sm text-muted-foreground">
              No exams found in the report. Enter marks first via the Marks
              Entry tab.
            </p>
          </div>
        )}

      {/* Combined Performance Table */}
      {report && report.examSummaries.length > 0 && (
        <div
          className="rounded-xl border border-border bg-card overflow-hidden print:border-black"
          data-ocid="academic.report.table"
        >
          <div className="bg-card border-b border-border px-5 py-3">
            <p className="font-bold text-foreground font-display">
              Academic Performance — Session {sessionId}
            </p>
            {student && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {student.fullName} ·{" "}
                {CLASS_LABELS[student.classLevel as ClassLevel] ??
                  student.classLevel}{" "}
                · Adm: {student.admNo}
              </p>
            )}
          </div>
          <div className="overflow-auto">
            <table
              className="w-full text-sm border-collapse"
              style={{
                minWidth: `${report.examSummaries.length * 120 + 180}px`,
              }}
            >
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground sticky left-0 bg-muted/30 z-10">
                    Subject
                  </th>
                  {report.examSummaries.map((exam) => (
                    <th
                      key={exam.examConfigId}
                      className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[110px]"
                    >
                      {exam.examName}
                    </th>
                  ))}
                  <th className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[100px]">
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {allSubjects.map((subjectName, si) => {
                  const allMarks = report.examSummaries.map((exam) => {
                    const sm = exam.subjectMarks.find(
                      (s) => s.subjectName === subjectName,
                    );
                    return sm ?? null;
                  });
                  // Final = average of obtained/max across exams that have this subject
                  const validMarks = allMarks.filter(Boolean);
                  const finalObtained = validMarks.reduce(
                    (sum, sm) => sum + (sm?.marksObtained ?? 0),
                    0,
                  );
                  const finalMax = validMarks.reduce(
                    (sum, sm) => sum + (sm?.maxMarks ?? 0),
                    0,
                  );
                  const { grade: finalGrade } = calcGrade(
                    finalObtained,
                    finalMax,
                  );

                  return (
                    <tr
                      key={subjectName}
                      className={`border-b border-border last:border-0 ${si % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                      data-ocid={`academic.subject.${si + 1}`}
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground sticky left-0 bg-inherit z-[5]">
                        {subjectName}
                      </td>
                      {allMarks.map((sm, ei) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: exam columns are ordered and stable
                        <td key={ei} className="text-center px-3 py-2">
                          {sm ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="font-semibold text-foreground">
                                {sm.marksObtained}/{sm.maxMarks}
                              </span>
                              <GradeCell
                                grade={
                                  sm.grade ||
                                  calcGrade(sm.marksObtained, sm.maxMarks).grade
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">
                              —
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="text-center px-3 py-2">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-foreground">
                            {finalObtained}/{finalMax}
                          </span>
                          <GradeCell grade={finalGrade} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/20 border-t-2 border-border">
                  <td className="px-4 py-2.5 font-bold text-foreground sticky left-0 bg-muted/20 z-[5]">
                    Overall
                  </td>
                  {report.examSummaries.map((exam) => {
                    const { grade } = calcGrade(
                      exam.subjectMarks.reduce(
                        (s, m) => s + m.marksObtained,
                        0,
                      ),
                      exam.subjectMarks.reduce((s, m) => s + m.maxMarks, 0),
                    );
                    return (
                      <td
                        key={exam.examConfigId}
                        className="text-center px-3 py-2.5"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-sm text-foreground">
                            {exam.percentage.toFixed(1)}%
                          </span>
                          <GradeCell grade={exam.overallGrade || grade} />
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-center px-3 py-2.5">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-foreground">
                        {report.combinedPercentage.toFixed(1)}%
                      </span>
                      <GradeCell grade={report.combinedGrade} />
                      {report.overallPassed ? (
                        <Badge variant="default" className="text-xs">
                          PASS
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          FAIL
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
