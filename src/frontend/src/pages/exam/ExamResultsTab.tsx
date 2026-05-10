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
import { useGetExamResultsByStudent } from "@/hooks/useBackend";
import { useStudents } from "@/hooks/useBackend";
import { useSessions } from "@/hooks/useBackend";
import { CLASS_LABELS } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel } from "@/types";
import { Award, CheckCircle2, Printer, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { calcGrade } from "./MarksEntryTab";

function GradeCell({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    A1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    A2: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    B1: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    B2: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    C1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    C2: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    D: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    E: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`}
    >
      {grade}
    </span>
  );
}

export default function ExamResultsTab() {
  const currentSession = useAppStore((s) => s.currentSession);
  const [sessionId, setSessionId] = useState(currentSession);
  const [studentId, setStudentId] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const { data: sessions = [] } = useSessions();
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const { data: results = [], isLoading: loadingResults } =
    useGetExamResultsByStudent(studentId, sessionId);

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

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Exam Results
          </h2>
          <p className="text-sm text-muted-foreground">
            View student exam result cards
          </p>
        </div>
        {results.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            data-ocid="results.print_button"
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
            <SelectTrigger className="w-36" data-ocid="results.session.select">
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
              data-ocid="results.student_search.input"
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
              data-ocid="results.clear_button"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Student Header */}
      {student && (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Award size={20} className="text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{student.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {CLASS_LABELS[student.classLevel as ClassLevel] ??
                student.classLevel}{" "}
              · Adm: {student.admNo} · Session: {sessionId}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {(loadingStudents || (studentId && loadingResults)) && (
        <div className="space-y-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {/* Empty */}
      {!studentId && !searchQ && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="results.empty_state"
        >
          <Award size={32} className="mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">
            Search and select a student to view their results.
          </p>
        </div>
      )}

      {studentId && !loadingResults && results.length === 0 && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="results.no_results_state"
        >
          <p className="text-sm text-muted-foreground">
            No exam results found for this student in session {sessionId}.
          </p>
        </div>
      )}

      {/* Result Cards */}
      <div className="space-y-4 print:space-y-6">
        {results.map((result, ri) => {
          const isPassed = result.overallPassed;
          return (
            <div
              key={result.id}
              className="rounded-xl border border-border bg-card overflow-hidden print:border-black"
              data-ocid={`results.card.${ri + 1}`}
            >
              {/* Card Header */}
              <div
                className={`px-5 py-3 flex items-center justify-between border-b border-border ${isPassed ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-red-50 dark:bg-red-900/10"}`}
              >
                <div>
                  <p className="font-bold text-foreground text-sm">
                    {result.examName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Session: {result.sessionId}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Percentage</p>
                    <p className="font-bold text-foreground">
                      {result.percentage.toFixed(1)}%
                    </p>
                  </div>
                  <GradeCell grade={result.overallGrade} />
                  {isPassed ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                  <Badge
                    variant={isPassed ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {isPassed ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div className="overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                        Subject
                      </th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                        Max Marks
                      </th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                        Pass Marks
                      </th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                        Marks Obtained
                      </th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                        Grade
                      </th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjectMarks.map((sm, smi) => {
                      const { grade } = calcGrade(
                        sm.marksObtained,
                        sm.maxMarks,
                      );
                      return (
                        <tr
                          key={`${result.id}-${smi}`}
                          className="border-b border-border last:border-0"
                          data-ocid={`results.card.${ri + 1}.subject.${smi + 1}`}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground">
                            {sm.subjectName}
                          </td>
                          <td className="text-center px-3 py-2.5 text-muted-foreground">
                            {sm.maxMarks}
                          </td>
                          <td className="text-center px-3 py-2.5 text-muted-foreground">
                            {sm.passingMarks}
                          </td>
                          <td className="text-center px-3 py-2.5 font-semibold text-foreground">
                            {sm.marksObtained}
                          </td>
                          <td className="text-center px-3 py-2.5">
                            <GradeCell grade={sm.grade || grade} />
                          </td>
                          <td className="text-center px-3 py-2.5">
                            {sm.isPassed ? (
                              <span className="text-emerald-600 font-semibold text-xs">
                                Pass
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold text-xs">
                                Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/20 border-t-2 border-border">
                      <td
                        className="px-4 py-2 font-bold text-foreground"
                        colSpan={3}
                      >
                        Total
                      </td>
                      <td className="text-center px-3 py-2 font-bold text-foreground">
                        {result.totalObtained}/{result.totalMax}
                      </td>
                      <td className="text-center px-3 py-2">
                        <GradeCell grade={result.overallGrade} />
                      </td>
                      <td className="text-center px-3 py-2">
                        <Badge
                          variant={isPassed ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {isPassed ? "PASS" : "FAIL"}
                        </Badge>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {result.remarks && (
                <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
                  <span className="font-medium">Remarks:</span> {result.remarks}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
