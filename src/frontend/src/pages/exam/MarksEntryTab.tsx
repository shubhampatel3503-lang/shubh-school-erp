import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExamConfigsByClass, useSaveExamMarks } from "@/hooks/useBackend";
import { useStudents } from "@/hooks/useBackend";
import { CLASS_LABELS, CLASS_ORDER } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel } from "@/types";
import { CheckCircle2, ClipboardList, Loader2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// 8-point grading scale (CBSE)
export function calcGrade(
  obtained: number,
  max: number,
): { grade: string; label: string } {
  if (max <= 0) return { grade: "—", label: "" };
  const pct = (obtained / max) * 100;
  if (pct >= 91) return { grade: "A1", label: "Outstanding" };
  if (pct >= 81) return { grade: "A2", label: "Excellent" };
  if (pct >= 71) return { grade: "B1", label: "Very Good" };
  if (pct >= 61) return { grade: "B2", label: "Good" };
  if (pct >= 51) return { grade: "C1", label: "Average" };
  if (pct >= 41) return { grade: "C2", label: "Satisfactory" };
  if (pct >= 33) return { grade: "D", label: "Needs Improvement" };
  return { grade: "E", label: "Fail" };
}

function GradeBadge({ obtained, max }: { obtained: number; max: number }) {
  const { grade } = calcGrade(obtained, max);
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
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${colorMap[grade] ?? "bg-muted text-muted-foreground"}`}
    >
      {grade}
    </span>
  );
}

// marks[studentId][subjectId]
type MarksState = Record<string, Record<string, number>>;

export default function MarksEntryTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const [classId, setClassId] = useState<ClassLevel>("Class10");
  const [examConfigId, setExamConfigId] = useState("");

  const { data: configs = [], isLoading: loadingConfigs } =
    useGetExamConfigsByClass(sessionId, classId);
  const { data: allStudents = [], isLoading: loadingStudents } = useStudents();
  const saveMutation = useSaveExamMarks();

  const students = useMemo(
    () =>
      allStudents.filter(
        (s) =>
          s.classLevel === classId &&
          s.sessionId === sessionId &&
          !s.isDiscontinued,
      ),
    [allStudents, classId, sessionId],
  );

  const selectedConfig = configs.find((c) => c.id === examConfigId);
  const [marks, setMarks] = useState<MarksState>({});
  const [saving, setSaving] = useState(false);

  function getMarks(studentId: string, subjectId: string): number {
    return marks[studentId]?.[subjectId] ?? 0;
  }

  function setMark(studentId: string, subjectId: string, val: number) {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] ?? {}), [subjectId]: val },
    }));
  }

  async function handleSaveAll() {
    if (!selectedConfig) return;
    setSaving(true);
    let successCount = 0;
    let failCount = 0;
    for (const student of students) {
      const rawMarks = selectedConfig.subjectConfigs.map((sc) => ({
        subjectId: sc.subjectId,
        subjectName: sc.subjectName,
        marksObtained: getMarks(student.id, sc.subjectId),
        maxMarks: sc.maxMarks,
        passingMarks: sc.passingMarks,
      }));
      try {
        await saveMutation.mutateAsync({
          examConfigId: selectedConfig.id,
          sessionId,
          classId,
          studentId: student.id,
          rawMarks,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }
    setSaving(false);
    if (failCount === 0)
      toast.success(`Marks saved for ${successCount} students!`);
    else toast.warning(`Saved ${successCount}, failed ${failCount}.`);
  }

  const isLoading = loadingConfigs || loadingStudents;

  return (
    <div className="p-6 space-y-5 max-w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Marks Entry
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter marks per student — grades computed in real-time
          </p>
        </div>
        {selectedConfig && students.length > 0 && (
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            data-ocid="marks.save_all_button"
          >
            {saving ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <Save size={14} className="mr-1.5" />
            )}
            Save All Marks
          </Button>
        )}
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Class</p>
          <Select
            value={classId}
            onValueChange={(v) => {
              setClassId(v as ClassLevel);
              setExamConfigId("");
            }}
          >
            <SelectTrigger className="w-40" data-ocid="marks.class.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {CLASS_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  {CLASS_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Exam</p>
          <Select value={examConfigId} onValueChange={setExamConfigId}>
            <SelectTrigger className="w-52" data-ocid="marks.exam.select">
              <SelectValue placeholder="Select exam…" />
            </SelectTrigger>
            <SelectContent>
              {loadingConfigs ? (
                <SelectItem value="__loading__" disabled>
                  Loading…
                </SelectItem>
              ) : configs.length === 0 ? (
                <SelectItem value="__none__" disabled>
                  No exams configured
                </SelectItem>
              ) : (
                configs.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.examName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty / loading states */}
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!isLoading && !examConfigId && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="marks.empty_state"
        >
          <ClipboardList
            size={32}
            className="mx-auto text-muted-foreground/40 mb-2"
          />
          <p className="text-sm text-muted-foreground">
            Select a class and exam to enter marks.
          </p>
        </div>
      )}

      {!isLoading && examConfigId && !selectedConfig && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Exam config not found.
          </p>
        </div>
      )}

      {!isLoading && selectedConfig && students.length === 0 && (
        <div
          className="rounded-xl border border-border bg-card p-8 text-center"
          data-ocid="marks.no_students_state"
        >
          <p className="text-sm text-muted-foreground">
            No active students found in {CLASS_LABELS[classId]} for session{" "}
            {sessionId}.
          </p>
        </div>
      )}

      {/* Marks Grid */}
      {!isLoading && selectedConfig && students.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-auto">
          <table
            className="w-full text-sm border-collapse"
            style={{
              minWidth: `${selectedConfig.subjectConfigs.length * 140 + 220}px`,
            }}
          >
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left px-3 py-3 font-semibold text-muted-foreground whitespace-nowrap sticky left-0 bg-muted/40 z-10">
                  #
                </th>
                <th className="text-left px-3 py-3 font-semibold text-foreground whitespace-nowrap sticky left-8 bg-muted/40 z-10 min-w-[160px]">
                  Student
                </th>
                {selectedConfig.subjectConfigs.map((sc) => (
                  <th
                    key={sc.subjectId}
                    className="text-center px-2 py-3 font-semibold text-foreground whitespace-nowrap min-w-[130px]"
                  >
                    <div>{sc.subjectName}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      Max {sc.maxMarks} | Pass {sc.passingMarks}
                    </div>
                  </th>
                ))}
                <th className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[100px]">
                  Total
                </th>
                <th className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap min-w-[80px]">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, si) => {
                const totalObtained = selectedConfig.subjectConfigs.reduce(
                  (sum, sc) => sum + getMarks(student.id, sc.subjectId),
                  0,
                );
                const totalMax = selectedConfig.subjectConfigs.reduce(
                  (sum, sc) => sum + sc.maxMarks,
                  0,
                );
                const { grade } = calcGrade(totalObtained, totalMax);
                return (
                  <tr
                    key={student.id}
                    className={`border-b border-border last:border-0 ${si % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                    data-ocid={`marks.row.${si + 1}`}
                  >
                    <td className="px-3 py-2 text-xs text-muted-foreground sticky left-0 bg-inherit z-[5]">
                      {si + 1}
                    </td>
                    <td className="px-3 py-2 sticky left-8 bg-inherit z-[5]">
                      <p className="font-medium text-foreground text-xs">
                        {student.fullName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {student.admNo}
                      </p>
                    </td>
                    {selectedConfig.subjectConfigs.map((sc, ci) => {
                      const val = getMarks(student.id, sc.subjectId);
                      return (
                        <td
                          key={sc.subjectId}
                          className="px-2 py-1.5 text-center"
                        >
                          <div className="flex items-center gap-1 justify-center">
                            <Input
                              type="number"
                              min={0}
                              max={sc.maxMarks}
                              value={val === 0 ? "" : val}
                              onChange={(e) => {
                                const n = Math.min(
                                  sc.maxMarks,
                                  Math.max(0, Number(e.target.value) || 0),
                                );
                                setMark(student.id, sc.subjectId, n);
                              }}
                              className="h-7 w-16 text-center text-xs"
                              placeholder="0"
                              data-ocid={`marks.cell.${si + 1}.${ci + 1}`}
                            />
                            <GradeBadge obtained={val} max={sc.maxMarks} />
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center">
                      <span className="font-semibold text-sm">
                        {totalObtained}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        /{totalMax}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`font-bold text-sm ${grade === "E" ? "text-destructive" : grade.startsWith("A") ? "text-emerald-600" : "text-foreground"}`}
                      >
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
