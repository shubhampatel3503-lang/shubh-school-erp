import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveChapterV2,
  useChapters,
  useCreateChapter,
  useDeleteChapter,
  useGenerateQAFromContent,
  useGetSyllabusContent,
  usePendingApprovalChapters,
  useRejectChapterV2,
  useSaveChapterQA,
  useSetChapterClassLevel,
  useSubjects,
  useSubmitChapterForApprovalV2,
  useUpdateChapterProgress,
} from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import type {
  ClassLevel,
  SyllabusApprovalStatus,
  SyllabusChapter,
  SyllabusQAPair,
} from "@/types";
import { CLASS_LABELS, CLASS_ORDER } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavLevel = "class" | "subject" | "chapter" | "chapter-detail";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ApprovalBadge({ status }: { status: SyllabusApprovalStatus }) {
  const cfg: Record<SyllabusApprovalStatus, { label: string; cls: string }> = {
    Draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
    Pending: { label: "Pending Approval", cls: "bg-amber-100 text-amber-800" },
    Approved: { label: "Published", cls: "bg-green-100 text-green-800" },
    Rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  };
  const c = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.cls}`}
    >
      {status === "Approved" && <CheckCircle2 className="size-3" />}
      {status === "Rejected" && <XCircle className="size-3" />}
      {status === "Pending" && <Clock className="size-3" />}
      {c.label}
    </span>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({
  parts,
  onNavigate,
}: {
  parts: { label: string; level: NavLevel; onClick?: () => void }[];
  onNavigate: (level: NavLevel) => void;
}) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
      {parts.map((part, i) => (
        <span key={part.level} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3 shrink-0" />}
          {i < parts.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                part.onClick?.();
                onNavigate(part.level);
              }}
              className="hover:text-foreground hover:underline transition-colors"
            >
              {part.label}
            </button>
          ) : (
            <span className="text-foreground font-medium">{part.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Q&A Display (read-only alternating) ─────────────────────────────────────
function QADisplay({ pairs }: { pairs: SyllabusQAPair[] }) {
  if (pairs.length === 0)
    return (
      <div
        className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground"
        data-ocid="syllabus.qa_empty_state"
      >
        No Q&A generated yet.
      </div>
    );
  return (
    <div className="space-y-3">
      {pairs.map((qa, i) => (
        <div key={qa.id} className="space-y-1">
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
            <span className="shrink-0 size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
              Q
            </span>
            <p className="text-sm font-medium text-foreground">
              {i + 1}. {qa.question}
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-muted/40 border border-border px-3 py-2 ml-4">
            <span className="shrink-0 size-5 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center mt-0.5">
              A
            </span>
            <p className="text-sm text-foreground/80">{qa.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Q&A Editor ──────────────────────────────────────────────────────────────
function QAEditor({
  qa,
  onChange,
  idx,
}: {
  qa: SyllabusQAPair;
  onChange: (updated: SyllabusQAPair) => void;
  idx: number;
}) {
  return (
    <div
      className="rounded-lg border border-border bg-card p-3 space-y-2"
      data-ocid={`syllabus.qa_item.${idx}`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-1 shrink-0 size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {idx}
        </span>
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Question</Label>
          <Input
            value={qa.question}
            onChange={(e) => onChange({ ...qa, question: e.target.value })}
            className="text-sm"
            data-ocid={`syllabus.qa_question_input.${idx}`}
          />
          <Label className="text-xs text-muted-foreground">Answer</Label>
          <Textarea
            value={qa.answer}
            onChange={(e) => onChange({ ...qa, answer: e.target.value })}
            rows={2}
            className="text-sm resize-none"
            data-ocid={`syllabus.qa_answer_textarea.${idx}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Chapter Detail Panel ─────────────────────────────────────────────────────
function ChapterDetailPanel({
  chapter,
  role,
  onBack,
  breadcrumbParts,
}: {
  chapter: SyllabusChapter;
  role: string;
  onBack: () => void;
  breadcrumbParts: { label: string; level: NavLevel; onClick?: () => void }[];
}) {
  const { data: savedContent, isLoading: contentLoading } =
    useGetSyllabusContent(chapter.id);
  const generateQA = useGenerateQAFromContent();
  const saveQA = useSaveChapterQA();
  const submitForApproval = useSubmitChapterForApprovalV2();
  const approveChapter = useApproveChapterV2();
  const rejectChapter = useRejectChapterV2();

  const isAdmin = role === "Admin";
  const isPrincipal = isAdmin;
  const isTeacher = role === "Teacher" || isAdmin;
  const isStudent = role === "Student" || role === "Parent";

  const status: SyllabusApprovalStatus =
    (savedContent?.status as SyllabusApprovalStatus) ?? "Draft";
  const isApproved = status === "Approved";
  const isPending = status === "Pending";

  // Tab 1: Content
  const [contentText, setContentText] = useState("");
  const [contentSaving, setContentSaving] = useState(false);

  // Tab 2: Questions from book
  const [questionsText, setQuestionsText] = useState("");
  const [questionsSaving, setQuestionsSaving] = useState(false);

  // Tab 3: Q&A pairs (AI-generated + editable)
  const [qaPairs, setQaPairs] = useState<SyllabusQAPair[]>([]);

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Sync from backend data
  useEffect(() => {
    if (!savedContent) return;
    setContentText(savedContent.contentText ?? "");
    setQuestionsText((savedContent.userProvidedQuestions ?? []).join("\n"));
    setQaPairs(
      (savedContent.qaPairs ?? []).map((q, i) => ({
        id: `qa-${String(i)}`,
        question: q.question,
        answer: q.answer,
      })),
    );
  }, [savedContent]);

  const userQuestions = useMemo(
    () =>
      questionsText
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean),
    [questionsText],
  );

  // Generate is only enabled when content + questions are present and chapter not approved
  const canGenerate =
    contentText.trim().length > 0 && userQuestions.length > 0 && !isApproved;

  function buildPayload(): import("@/types").SyllabusContent {
    return {
      chapterId: chapter.id,
      contentText,
      bookQuestions: questionsText,
      userProvidedQuestions: userQuestions,
      qaPairs,
      status: (savedContent?.status ?? "Draft") as SyllabusApprovalStatus,
      rejectionReason: savedContent?.rejectionReason ?? "",
      submittedAt: savedContent?.submittedAt ?? null,
      approvedAt: savedContent?.approvedAt ?? null,
    };
  }

  function handleSaveContent() {
    setContentSaving(true);
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        toast.success("Chapter content saved.");
        setContentSaving(false);
      },
      onError: (e) => {
        toast.error(e.message);
        setContentSaving(false);
      },
    });
  }

  function handleSaveQuestions() {
    setQuestionsSaving(true);
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        toast.success("Questions saved.");
        setQuestionsSaving(false);
      },
      onError: (e) => {
        toast.error(e.message);
        setQuestionsSaving(false);
      },
    });
  }

  function handleGenerateQA() {
    if (!canGenerate) {
      toast.error("Please save both Chapter Content and Questions first.");
      return;
    }
    // generateQAFromContent: AI generates ANSWERS ONLY for user-provided questions
    generateQA.mutate(
      { contentText, userQuestions },
      {
        onSuccess: (pairs) => {
          setQaPairs(pairs);
          const count = pairs.length;
          toast.success(
            `Generated ${count} Q&A pair${count !== 1 ? "s" : ""}.`,
          );
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function handleSaveQA() {
    saveQA.mutate(buildPayload(), {
      onSuccess: () => toast.success("Q&A saved successfully."),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleSubmit() {
    if (!contentText.trim()) {
      toast.error("Please save chapter content before submitting.");
      return;
    }
    if (userQuestions.length === 0) {
      toast.error("Please save at least one question before submitting.");
      return;
    }
    if (qaPairs.length === 0) {
      toast.error("Please generate Q&A before submitting.");
      return;
    }
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        submitForApproval.mutate(chapter.id, {
          onSuccess: () => toast.success("Submitted for Principal approval."),
          onError: (e) => toast.error(e.message),
        });
      },
    });
  }

  function handleApprove() {
    approveChapter.mutate(chapter.id, {
      onSuccess: () =>
        toast.success("Chapter approved and published for students."),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleReject() {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    rejectChapter.mutate(
      { chapterId: chapter.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectReason("");
          toast.success("Chapter rejected and sent back to teacher.");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  if (contentLoading) {
    return (
      <div className="p-6 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" data-ocid="syllabus.chapter_detail_panel">
      <Breadcrumb parts={breadcrumbParts} onNavigate={() => {}} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            data-ocid="syllabus.back_button"
          >
            <ArrowLeft className="size-4 mr-1" /> Back
          </Button>
          <BookOpen className="size-5 shrink-0 text-primary" />
          <h2 className="text-lg font-semibold font-display text-foreground truncate">
            Ch {chapter.chapterNo}: {chapter.title}
          </h2>
          <ApprovalBadge status={status} />
        </div>
      </div>

      {/* Rejection reason */}
      {status === "Rejected" && savedContent?.rejectionReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="font-semibold">Rejection Reason:</span>{" "}
          {savedContent.rejectionReason}
        </div>
      )}

      {/* 3-Tab Layout */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger
            value="content"
            className="gap-1.5 text-xs"
            data-ocid="syllabus.tab_content"
          >
            <FileText className="size-3.5" />
            1. Chapter Content
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="gap-1.5 text-xs"
            data-ocid="syllabus.tab_questions"
          >
            <HelpCircle className="size-3.5" />
            2. Questions from Book
            {userQuestions.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
                {userQuestions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            className="gap-1.5 text-xs"
            data-ocid="syllabus.tab_qa"
          >
            <MessageSquare className="size-3.5" />
            3. AI-Generated Answers
            {qaPairs.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
                {qaPairs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Chapter Content ── teacher pastes full chapter text from textbook */}
        <TabsContent value="content" className="space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50/40 dark:bg-blue-950/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
            <strong>Section 1 of 3 — Chapter Content</strong>
            <br />
            Paste or type the full chapter text from the textbook. This is used
            by the AI in Section 3 to generate accurate answers for your
            questions.
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                Chapter Content from Book
              </Label>
              <span className="text-xs text-muted-foreground">
                {contentText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <Textarea
              placeholder="Paste or type the full chapter text from the textbook here. This will be used to generate Q&A answers."
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={16}
              className="resize-none text-sm font-mono"
              readOnly={isStudent || isApproved}
              data-ocid="syllabus.content_textarea"
            />
            {isStudent && (
              <p className="text-xs text-muted-foreground italic">
                Read-only. Content published by your teacher.
              </p>
            )}
          </div>
          {isTeacher && !isApproved && !isStudent && (
            <Button
              type="button"
              size="sm"
              onClick={handleSaveContent}
              disabled={contentSaving || saveQA.isPending}
              data-ocid="syllabus.save_content_button"
            >
              {contentSaving || saveQA.isPending ? (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="size-3.5 mr-1" />
              )}
              Save Content
            </Button>
          )}
        </TabsContent>

        {/* ── Tab 2: Questions from Book ── these are questions already present in the textbook */}
        <TabsContent value="questions" className="space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            <strong>Section 2 of 3 — Questions from Book</strong>
            <br />
            Enter the questions that are{" "}
            <em>already present in the textbook</em>. One question per line. The
            AI will generate an answer for each question (in Section 3) based on
            the chapter content.
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">
              Questions Already Present in Textbook
            </Label>
            {isStudent ? (
              <div className="space-y-2">
                {userQuestions.length === 0 ? (
                  <div
                    className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
                    data-ocid="syllabus.questions_empty_state"
                  >
                    No questions added yet.
                  </div>
                ) : (
                  userQuestions.map((q, i) => (
                    <div
                      key={`q-${q.slice(0, 20)}`}
                      className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border px-3 py-2"
                      data-ocid={`syllabus.question_item.${userQuestions.indexOf(q) + 1}`}
                    >
                      <span className="shrink-0 size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground">{q}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <Textarea
                placeholder={
                  "Enter each question on a separate line:\n1. What is photosynthesis?\n2. Explain the water cycle.\n3. What are the types of soil?"
                }
                value={questionsText}
                onChange={(e) => setQuestionsText(e.target.value)}
                rows={14}
                className="resize-none text-sm"
                readOnly={isApproved}
                data-ocid="syllabus.questions_textarea"
              />
            )}
          </div>
          {isTeacher && !isApproved && !isStudent && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleSaveQuestions}
                disabled={questionsSaving || saveQA.isPending}
                data-ocid="syllabus.save_questions_button"
              >
                {questionsSaving || saveQA.isPending ? (
                  <Loader2 className="size-3.5 mr-1 animate-spin" />
                ) : (
                  <Check className="size-3.5 mr-1" />
                )}
                Save Questions
              </Button>
              <span className="text-xs text-muted-foreground">
                {userQuestions.length} question
                {userQuestions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 3: AI-Generated Answers ── Q (from book) + A (AI-generated from content) */}
        <TabsContent value="qa" className="space-y-3">
          <div className="rounded-lg border border-green-200 bg-green-50/40 dark:bg-green-950/20 px-3 py-2 text-xs text-green-700 dark:text-green-300">
            <strong>Section 3 of 3 — AI-Generated Answers</strong>
            <br />
            The AI reads your <em>Chapter Content</em> and generates the best
            answer for each <em>Question from Book</em>. Displayed as
            alternating Q / A pairs. Teachers can edit any answer before
            submitting for approval.
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-semibold">Q&amp;A Pairs</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Q = question from book · A = AI-generated answer from chapter
                content
              </p>
            </div>
            {isTeacher && !isApproved && !isStudent && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateQA}
                disabled={!canGenerate || generateQA.isPending}
                title={
                  !canGenerate
                    ? "Save Content (Tab 1) and Questions (Tab 2) first"
                    : "Generate answers for each book question"
                }
                data-ocid="syllabus.generate_qa_button"
              >
                {generateQA.isPending ? (
                  <Loader2 className="size-3.5 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5 mr-1" />
                )}
                Generate Answers
              </Button>
            )}
          </div>

          {!canGenerate && !isStudent && qaPairs.length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              ⚠️ First save <strong>Chapter Content (Section 1)</strong> and{" "}
              <strong>Questions from Book (Section 2)</strong>, then click{" "}
              <strong>Generate Answers</strong> here.
            </div>
          )}

          {isStudent ? (
            <QADisplay pairs={qaPairs} />
          ) : (
            <ScrollArea className="h-[380px] pr-1">
              {qaPairs.length === 0 ? (
                <div
                  className="rounded-lg border border-dashed border-border bg-muted/20 p-10 text-center"
                  data-ocid="syllabus.qa_empty_state"
                >
                  <Sparkles className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No Q&A yet. Click <strong>Generate Q&A</strong> after saving
                    content and questions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {qaPairs.map((qa, i) => (
                    <QAEditor
                      key={qa.id}
                      qa={qa}
                      idx={i + 1}
                      onChange={(updated) =>
                        setQaPairs((prev) =>
                          prev.map((p) => (p.id === qa.id ? updated : p)),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          )}

          {isTeacher && !isApproved && !isStudent && qaPairs.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSaveQA}
              disabled={saveQA.isPending}
              data-ocid="syllabus.save_qa_button"
            >
              {saveQA.isPending ? (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="size-3.5 mr-1" />
              )}
              Save Edits
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {!isStudent && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
          {isTeacher && (status === "Draft" || status === "Rejected") && (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={
                submitForApproval.isPending ||
                !contentText.trim() ||
                userQuestions.length === 0 ||
                qaPairs.length === 0
              }
              data-ocid="syllabus.submit_button"
            >
              {submitForApproval.isPending && (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              )}
              Submit for Approval
            </Button>
          )}
          {isPrincipal && isPending && (
            <>
              <Button
                type="button"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={approveChapter.isPending}
                data-ocid="syllabus.approve_button"
              >
                <CheckCircle2 className="size-3.5 mr-1" /> Approve & Publish
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => setShowRejectDialog(true)}
                data-ocid="syllabus.reject_button"
              >
                <XCircle className="size-3.5 mr-1" /> Reject
              </Button>
            </>
          )}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="z-[9999]" data-ocid="syllabus.reject_dialog">
          <DialogHeader>
            <DialogTitle>Reject Chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label>Reason for Rejection</Label>
            <Textarea
              placeholder="Explain what needs to be corrected…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              data-ocid="syllabus.reject_reason_textarea"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              data-ocid="syllabus.reject_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={rejectChapter.isPending}
              data-ocid="syllabus.reject_confirm_button"
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Chapter Card ─────────────────────────────────────────────────────────────
function ChapterCard({
  chapter,
  idx,
  onOpen,
  onDelete,
  role,
}: {
  chapter: SyllabusChapter;
  idx: number;
  onOpen: () => void;
  onDelete: () => void;
  role: string;
}) {
  const { data: content } = useGetSyllabusContent(chapter.id);
  const status: SyllabusApprovalStatus =
    (content?.status as SyllabusApprovalStatus) ?? "Draft";
  const qaCount = content?.qaPairs?.length ?? 0;
  const isAdmin = role === "Admin" || role === "Principal";

  return (
    <Card
      className="hover:shadow-md transition-shadow"
      data-ocid={`syllabus.chapter_card.${idx}`}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-3">
          <div className="size-8 shrink-0 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
            {chapter.chapterNo}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold truncate">
              {chapter.title}
            </CardTitle>
            {chapter.topics.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {chapter.topics.slice(0, 3).join(" · ")}
                {chapter.topics.length > 3 &&
                  ` +${chapter.topics.length - 3} more`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ApprovalBadge status={status} />
            {qaCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {qaCount} Q&A
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${chapter.completionPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {chapter.completionPercent}% done
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            onClick={onOpen}
            data-ocid={`syllabus.open_chapter_button.${idx}`}
          >
            <Pencil className="size-3 mr-1" />
            {role === "Student" || role === "Parent" ? "Read" : "Edit"}
          </Button>
          {isAdmin && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              data-ocid={`syllabus.delete_chapter_button.${idx}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pending Approvals Panel ──────────────────────────────────────────────────
function PendingApprovalsPanel({
  onOpenChapter,
}: {
  onOpenChapter: (
    chapter: SyllabusChapter,
    classLabel: string,
    subjectName: string,
  ) => void;
}) {
  const { data: pendingChapters = [], isLoading } =
    usePendingApprovalChapters();

  if (isLoading)
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );

  if (pendingChapters.length === 0)
    return (
      <div
        className="rounded-lg border border-dashed border-border p-8 text-center"
        data-ocid="syllabus.pending_empty_state"
      >
        <CheckCircle2 className="size-8 mx-auto text-green-500 mb-2" />
        <p className="text-sm text-muted-foreground">
          No chapters pending approval.
        </p>
      </div>
    );

  return (
    <div className="space-y-2" data-ocid="syllabus.pending_list">
      {pendingChapters.map((ch, i) => (
        <Card
          key={ch.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          data-ocid={`syllabus.pending_chapter_card.${i + 1}`}
          onClick={() =>
            onOpenChapter(
              ch,
              CLASS_LABELS[ch.classLevel as ClassLevel] ?? ch.classLevel,
              ch.subjectName ?? "",
            )
          }
        >
          <CardContent className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  Ch {ch.chapterNo}: {ch.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ch.subjectName ?? ""} ·{" "}
                  {CLASS_LABELS[ch.classLevel as ClassLevel] ?? ch.classLevel}
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 text-xs">
                Review
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SyllabusPage() {
  const { currentRole: role } = useAppStore();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const _updateProgress = useUpdateChapterProgress();
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();
  const setClassLevel = { mutate: (_a: unknown) => {} };

  const isPrincipal = role === "Admin" || (role as string) === "Principal";
  const isStudent = role === "Student" || role === "Parent";

  // Navigation state
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapter, setSelectedChapter] =
    useState<SyllabusChapter | null>(null);
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);

  // Add chapter dialog
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    chapterNo: "",
    topics: "",
    classLevel: "",
  });

  // Filter subjects by selected class
  const classSubjects = useMemo(() => {
    if (!selectedClass) return [];
    return subjects.filter((s) => s.classLevel === selectedClass);
  }, [subjects, selectedClass]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const { data: chapters = [], isLoading: chaptersLoading } =
    useChapters(selectedSubjectId);

  // Filter chapters for student: only approved
  const visibleChapters = useMemo(() => {
    return chapters; // filtering by approval done in ChapterCard for students
  }, [chapters]);

  // Classes that have subjects
  const classesWithSubjects = useMemo(() => {
    const seen = new Set(subjects.map((s) => s.classLevel));
    return CLASS_ORDER.filter((c) => seen.has(c));
  }, [subjects]);

  function handleAddChapter() {
    if (!chapterForm.title.trim()) {
      toast.error("Chapter title is required.");
      return;
    }
    const topicsArr = chapterForm.topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    createChapter.mutate(
      {
        subjectId: selectedSubjectId,
        chapterNo: Number(chapterForm.chapterNo) || chapters.length + 1,
        title: chapterForm.title,
        topics: topicsArr,
      },
      {
        onSuccess: (ch) => {
          // Set class level on new chapter
          const classLvl = chapterForm.classLevel || selectedClass || "";
          if (classLvl) {
            setClassLevel.mutate({
              chapterId: ch.id,
              classLevel: String(classLvl),
            });
          }
          toast.success("Chapter added.");
          setShowAddChapter(false);
          setChapterForm({
            title: "",
            chapterNo: "",
            topics: "",
            classLevel: "",
          });
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  // Navigate to chapter detail
  function openChapter(
    ch: SyllabusChapter,
    _classLabel?: string,
    _subjectName?: string,
  ) {
    setSelectedChapter(ch);
    setShowPendingApprovals(false);
  }

  // Breadcrumb context
  const breadcrumbParts = useMemo(() => {
    const parts: { label: string; level: NavLevel; onClick?: () => void }[] = [
      {
        label: "Syllabus",
        level: "class",
        onClick: () => {
          setSelectedClass(null);
          setSelectedSubjectId("");
          setSelectedChapter(null);
        },
      },
    ];
    if (selectedClass) {
      parts.push({
        label: CLASS_LABELS[selectedClass],
        level: "subject",
        onClick: () => {
          setSelectedSubjectId("");
          setSelectedChapter(null);
        },
      });
    }
    if (selectedSubject) {
      parts.push({
        label: selectedSubject.name,
        level: "chapter",
        onClick: () => {
          setSelectedChapter(null);
        },
      });
    }
    if (selectedChapter) {
      parts.push({
        label: `Ch ${selectedChapter.chapterNo}: ${selectedChapter.title}`,
        level: "chapter-detail",
      });
    }
    return parts;
  }, [selectedClass, selectedSubject, selectedChapter]);

  // ── Render: Chapter Detail ──
  if (selectedChapter) {
    return (
      <ChapterDetailPanel
        chapter={selectedChapter}
        role={role ?? "Teacher"}
        onBack={() => setSelectedChapter(null)}
        breadcrumbParts={breadcrumbParts}
      />
    );
  }

  return (
    <div className="p-6 space-y-6" data-ocid="syllabus.page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Syllabus &amp; Q&amp;A
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Class → Subject → Chapter navigation. Teachers add content & Q&A,
            Principal approves, students read.
          </p>
        </div>
        {isPrincipal && (
          <Button
            variant={showPendingApprovals ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowPendingApprovals((v) => !v);
              setSelectedClass(null);
              setSelectedSubjectId("");
            }}
            data-ocid="syllabus.pending_approvals_button"
          >
            <Clock className="size-4 mr-1" />
            Pending Approvals
          </Button>
        )}
      </div>

      {/* Pending Approvals panel */}
      {showPendingApprovals && isPrincipal && (
        <div
          className="bg-card rounded-xl border border-border p-5"
          data-ocid="syllabus.pending_approvals_panel"
        >
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Clock className="size-4 text-amber-500" /> Chapters Pending
            Approval
          </h2>
          <PendingApprovalsPanel
            onOpenChapter={(ch) => {
              setSelectedChapter(ch);
              setShowPendingApprovals(false);
            }}
          />
        </div>
      )}

      {/* 3-Level Navigation */}
      {!showPendingApprovals && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Level 1: Class List */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <GraduationCap className="size-4 text-primary" /> Classes
            </h2>
            {subjectsLoading ? (
              <div className="space-y-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : classesWithSubjects.length === 0 ? (
              <div
                className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
                data-ocid="syllabus.classes_empty_state"
              >
                No subjects added yet. Add subjects in Academics.
              </div>
            ) : (
              <div className="space-y-1">
                {classesWithSubjects.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setSelectedClass(cls);
                      setSelectedSubjectId("");
                      setSelectedChapter(null);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedClass === cls
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                    data-ocid={`syllabus.class_item.${cls}`}
                  >
                    {CLASS_LABELS[cls]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level 2: Subject List */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary" /> Subjects
            </h2>
            {!selectedClass ? (
              <div
                className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
                data-ocid="syllabus.no_class_selected"
              >
                Select a class to view subjects.
              </div>
            ) : classSubjects.length === 0 ? (
              <div
                className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
                data-ocid="syllabus.subjects_empty_state"
              >
                No subjects for {CLASS_LABELS[selectedClass]}.
              </div>
            ) : (
              <div className="space-y-1">
                {classSubjects.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      setSelectedChapter(null);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedSubjectId === subj.id
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                    data-ocid={`syllabus.subject_item.${subj.id}`}
                  >
                    <div className="font-medium truncate">{subj.name}</div>
                    {subj.code && (
                      <div
                        className={`text-xs ${
                          selectedSubjectId === subj.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {subj.code}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Level 3: Chapter List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="size-4 text-primary" /> Chapters
              </h2>
              {selectedSubjectId && !isStudent && (
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowAddChapter(true)}
                  data-ocid="syllabus.add_chapter_button"
                >
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              )}
            </div>

            {!selectedSubjectId ? (
              <div
                className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
                data-ocid="syllabus.no_subject_selected"
              >
                Select a subject to view chapters.
              </div>
            ) : chaptersLoading ? (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : visibleChapters.length === 0 ? (
              <div
                className="rounded-lg border border-dashed border-border p-8 text-center"
                data-ocid="syllabus.chapters_empty_state"
              >
                <BookOpen className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No chapters yet.
                </p>
                {!isStudent && (
                  <Button
                    size="sm"
                    onClick={() => setShowAddChapter(true)}
                    data-ocid="syllabus.add_first_chapter_button"
                  >
                    <Plus className="size-4 mr-1" /> Add Chapter
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {visibleChapters.map((ch, i) => (
                  <ChapterCard
                    key={ch.id}
                    chapter={ch}
                    idx={i + 1}
                    role={role ?? "Teacher"}
                    onOpen={() => openChapter(ch)}
                    onDelete={() =>
                      deleteChapter.mutate(
                        { id: ch.id, subjectId: selectedSubjectId },
                        { onError: (e) => toast.error(e.message) },
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb (visible when a class is selected) */}
      {selectedClass && !selectedChapter && !showPendingApprovals && (
        <div className="text-xs text-muted-foreground pt-2">
          <Breadcrumb parts={breadcrumbParts} onNavigate={() => {}} />
        </div>
      )}

      {/* Add Chapter Dialog */}
      <Dialog open={showAddChapter} onOpenChange={setShowAddChapter}>
        <DialogContent
          className="z-[9999]"
          data-ocid="syllabus.add_chapter_dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Chapter No <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={chapterForm.chapterNo}
                  onChange={(e) =>
                    setChapterForm((f) => ({ ...f, chapterNo: e.target.value }))
                  }
                  placeholder="e.g. 1"
                  data-ocid="syllabus.chapter_no_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Chapter Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={chapterForm.title}
                  onChange={(e) =>
                    setChapterForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Number Systems"
                  data-ocid="syllabus.chapter_title_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Topics (comma-separated)</Label>
              <Input
                value={chapterForm.topics}
                onChange={(e) =>
                  setChapterForm((f) => ({ ...f, topics: e.target.value }))
                }
                placeholder="e.g. Natural Numbers, Whole Numbers, Fractions"
                data-ocid="syllabus.chapter_topics_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Class Level</Label>
              <Select
                value={chapterForm.classLevel || selectedClass || ""}
                onValueChange={(v) =>
                  setChapterForm((f) => ({ ...f, classLevel: v }))
                }
              >
                <SelectTrigger data-ocid="syllabus.chapter_class_select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
                  {CLASS_ORDER.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddChapter(false)}
              data-ocid="syllabus.add_chapter_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddChapter}
              disabled={createChapter.isPending}
              data-ocid="syllabus.add_chapter_submit_button"
            >
              {createChapter.isPending && (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              )}
              Add Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
