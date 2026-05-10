import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useDeleteExamConfig,
  useGetAllExamConfigs,
  useSaveExamConfig,
} from "@/hooks/useBackend";
import { CLASS_LABELS, CLASS_ORDER, generateId } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel } from "@/types";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EXAM_PRESETS = [
  "Quarterly",
  "Half Yearly",
  "Annual",
  "Unit Test",
  "Pre-Board",
];

interface SubjectDraft {
  id: string;
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  passingMarks: number;
}

interface ExamDraft {
  id: string;
  examName: string;
  classId: ClassLevel;
  subjects: SubjectDraft[];
  includeInCombined: boolean;
  weightage: number;
}

function blankSubject(): SubjectDraft {
  return {
    id: generateId(),
    subjectId: generateId(),
    subjectName: "",
    maxMarks: 100,
    passingMarks: 33,
  };
}

function blankDraft(classId: ClassLevel = "Class10"): ExamDraft {
  return {
    id: generateId(),
    examName: "",
    classId,
    subjects: [blankSubject()],
    includeInCombined: true,
    weightage: 100,
  };
}

export default function ExamConfigTab() {
  const sessionId = useAppStore((s) => s.currentSession);
  const { data: configs = [], isLoading } = useGetAllExamConfigs(sessionId);
  const saveMutation = useSaveExamConfig();
  const deleteMutation = useDeleteExamConfig();

  const [draft, setDraft] = useState<ExamDraft | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function openNew() {
    setDraft(blankDraft("Class10"));
  }

  function addSubject() {
    if (!draft) return;
    setDraft((d) =>
      d ? { ...d, subjects: [...d.subjects, blankSubject()] } : d,
    );
  }

  function removeSubject(id: string) {
    if (!draft) return;
    setDraft((d) =>
      d ? { ...d, subjects: d.subjects.filter((s) => s.id !== id) } : d,
    );
  }

  function updateSubject(
    id: string,
    field: keyof SubjectDraft,
    value: string | number,
  ) {
    if (!draft) return;
    setDraft((d) =>
      d
        ? {
            ...d,
            subjects: d.subjects.map((s) =>
              s.id === id ? { ...s, [field]: value } : s,
            ),
          }
        : d,
    );
  }

  async function handleSave() {
    if (!draft) return;
    if (!draft.examName.trim()) {
      toast.error("Enter an exam name.");
      return;
    }
    if (draft.subjects.length === 0) {
      toast.error("Add at least one subject.");
      return;
    }
    if (draft.subjects.some((s) => !s.subjectName.trim())) {
      toast.error("All subjects need a name.");
      return;
    }
    try {
      await saveMutation.mutateAsync({
        examName: draft.examName,
        sessionId,
        classId: draft.classId,
        subjectConfigs: draft.subjects.map((s) => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          maxMarks: s.maxMarks,
          passingMarks: s.passingMarks,
        })),
        includeInCombined: draft.includeInCombined,
        weightage: draft.weightage,
      });
      toast.success("Exam configuration saved!");
      setDraft(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save.");
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Exam Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Define exam names, classes, and subject marks
          </p>
        </div>
        <Button size="sm" onClick={openNew} data-ocid="exam.config.add_button">
          <Plus size={14} className="mr-1.5" /> New Exam Config
        </Button>
      </div>

      {/* New / Edit Form */}
      {draft && (
        <div
          className="rounded-xl border border-primary/40 bg-card p-5 space-y-4"
          data-ocid="exam.config.form"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground text-sm font-display">
              New Exam Configuration
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setDraft(null)}
              data-ocid="exam.config.cancel_button"
            >
              <X size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Exam Name <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={draft.examName}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, examName: e.target.value } : d,
                    )
                  }
                  placeholder="e.g. Quarterly Exam"
                  data-ocid="exam.config.name.input"
                />
                <Select
                  onValueChange={(v) =>
                    setDraft((d) => (d ? { ...d, examName: v } : d))
                  }
                >
                  <SelectTrigger
                    className="w-36 shrink-0"
                    data-ocid="exam.config.preset.select"
                  >
                    <SelectValue placeholder="Presets" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_PRESETS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Class <span className="text-destructive">*</span>
              </Label>
              <Select
                value={draft.classId}
                onValueChange={(v) =>
                  setDraft((d) => (d ? { ...d, classId: v as ClassLevel } : d))
                }
              >
                <SelectTrigger data-ocid="exam.config.class.select">
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
            <div className="space-y-1.5">
              <Label>Weightage (%)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={draft.weightage}
                onChange={(e) =>
                  setDraft((d) =>
                    d ? { ...d, weightage: Number(e.target.value) } : d,
                  )
                }
                data-ocid="exam.config.weightage.input"
              />
            </div>
            <div className="flex items-end gap-2">
              <label
                className="flex items-center gap-2 cursor-pointer text-sm text-foreground"
                data-ocid="exam.config.combined.checkbox"
              >
                <input
                  type="checkbox"
                  checked={draft.includeInCombined}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, includeInCombined: e.target.checked } : d,
                    )
                  }
                  className="accent-primary"
                />
                Include in Academic Performance Report
              </label>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Subjects &amp; Marks</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={addSubject}
                data-ocid="exam.config.add_subject_button"
              >
                <Plus size={13} className="mr-1" /> Add Subject
              </Button>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                      Subject Name
                    </th>
                    <th className="text-center px-3 py-2 font-medium text-muted-foreground w-28">
                      Max Marks
                    </th>
                    <th className="text-center px-3 py-2 font-medium text-muted-foreground w-28">
                      Pass Marks
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {draft.subjects.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-b border-border last:border-0"
                      data-ocid={`exam.config.subject.row.${i + 1}`}
                    >
                      <td className="px-3 py-2">
                        <Input
                          value={s.subjectName}
                          onChange={(e) =>
                            updateSubject(s.id, "subjectName", e.target.value)
                          }
                          placeholder="e.g. Mathematics"
                          className="h-7 text-xs"
                          data-ocid={`exam.config.subject.name.${i + 1}`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={1}
                          value={s.maxMarks}
                          onChange={(e) =>
                            updateSubject(
                              s.id,
                              "maxMarks",
                              Number(e.target.value),
                            )
                          }
                          className="h-7 text-xs text-center"
                          data-ocid={`exam.config.subject.maxmarks.${i + 1}`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min={0}
                          value={s.passingMarks}
                          onChange={(e) =>
                            updateSubject(
                              s.id,
                              "passingMarks",
                              Number(e.target.value),
                            )
                          }
                          className="h-7 text-xs text-center"
                          data-ocid={`exam.config.subject.passmarks.${i + 1}`}
                        />
                      </td>
                      <td className="px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-destructive hover:text-destructive"
                          onClick={() => removeSubject(s.id)}
                          data-ocid={`exam.config.subject.delete.${i + 1}`}
                        >
                          <X size={11} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-ocid="exam.config.save_button"
          >
            {saveMutation.isPending ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <Save size={14} className="mr-1.5" />
            )}
            Save Configuration
          </Button>
        </div>
      )}

      {/* Saved Configs */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/30 border-b border-border px-5 py-3 flex items-center justify-between">
          <p className="font-semibold text-foreground font-display text-sm">
            Saved Exam Configurations
          </p>
          <Badge variant="secondary">{configs.length}</Badge>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : configs.length === 0 ? (
          <div className="p-8 text-center" data-ocid="exam.config.empty_state">
            <BookOpen
              size={32}
              className="mx-auto text-muted-foreground/40 mb-2"
            />
            <p className="text-sm text-muted-foreground">
              No exam configs yet. Create one above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {configs.map((cfg, i) => (
              <div key={cfg.id} data-ocid={`exam.config.item.${i + 1}`}>
                <button
                  type="button"
                  className="w-full px-5 py-3 flex items-center justify-between gap-4 hover:bg-muted/10 cursor-pointer text-left"
                  onClick={() =>
                    setExpandedId(expandedId === cfg.id ? null : cfg.id)
                  }
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={15} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {cfg.examName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CLASS_LABELS[cfg.classId as ClassLevel] ?? cfg.classId}{" "}
                        · {cfg.subjectConfigs.length} subjects · Session{" "}
                        {cfg.sessionId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {cfg.includeInCombined && (
                      <Badge variant="outline" className="text-xs">
                        Combined
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation
                          .mutateAsync(cfg.id)
                          .then(() => toast.success("Deleted."))
                          .catch(() => toast.error("Delete failed."));
                      }}
                      data-ocid={`exam.config.delete.${i + 1}`}
                    >
                      <Trash2 size={13} />
                    </Button>
                    {expandedId === cfg.id ? (
                      <ChevronUp size={14} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                </button>
                {expandedId === cfg.id && (
                  <div className="px-5 pb-4">
                    <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                            Subject
                          </th>
                          <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                            Max Marks
                          </th>
                          <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                            Pass Marks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cfg.subjectConfigs.map((sc) => (
                          <tr
                            key={sc.subjectId}
                            className="border-t border-border"
                          >
                            <td className="px-3 py-1.5">{sc.subjectName}</td>
                            <td className="text-center px-3 py-1.5">
                              {sc.maxMarks}
                            </td>
                            <td className="text-center px-3 py-1.5">
                              {sc.passingMarks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
