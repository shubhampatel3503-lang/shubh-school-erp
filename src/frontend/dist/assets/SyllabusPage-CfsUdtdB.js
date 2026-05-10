import { d as useAppStore, m as useSubjects, y as useUpdateChapterProgress, w as useCreateChapter, x as useDeleteChapter, r as reactExports, v as useChapters, C as CLASS_ORDER, i as CLASS_LABELS, j as jsxRuntimeExports, e as Button, G as GraduationCap, S as Skeleton, B as BookOpen, aq as FileText, F as ue, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input, k as DialogFooter, l as LoaderCircle, dp as useGetSyllabusContent, dq as useGenerateQAFromContent, dr as useSaveChapterQA, ds as useSubmitChapterForApprovalV2, dt as useApproveChapterV2, du as useRejectChapterV2, dv as CircleHelp, t as Badge, P as MessageSquare, O as ScrollArea, dw as usePendingApprovalChapters, aw as ChevronRight } from "./index-pMBTUEbj.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Check } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { A as ArrowLeft } from "./arrow-left-DYhYtdC7.js";
import { S as Sparkles } from "./sparkles-u5rnlKDb.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import "./index-Nv6ob_Pe.js";
function ApprovalBadge({ status }) {
  const cfg = {
    Draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
    Pending: { label: "Pending Approval", cls: "bg-amber-100 text-amber-800" },
    Approved: { label: "Published", cls: "bg-green-100 text-green-800" },
    Rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" }
  };
  const c = cfg[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${c.cls}`,
      children: [
        status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
        status === "Rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
        status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
        c.label
      ]
    }
  );
}
function Breadcrumb({
  parts,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap", children: parts.map((part, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
    i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3 shrink-0" }),
    i < parts.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          (_a = part.onClick) == null ? void 0 : _a.call(part);
          onNavigate(part.level);
        },
        className: "hover:text-foreground hover:underline transition-colors",
        children: part.label
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: part.label })
  ] }, part.level)) });
}
function QADisplay({ pairs }) {
  if (pairs.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground",
        "data-ocid": "syllabus.qa_empty_state",
        children: "No Q&A generated yet."
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: pairs.map((qa, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5", children: "Q" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
        i + 1,
        ". ",
        qa.question
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-muted/40 border border-border px-3 py-2 ml-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 size-5 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center mt-0.5", children: "A" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80", children: qa.answer })
    ] })
  ] }, qa.id)) });
}
function QAEditor({
  qa,
  onChange,
  idx
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-lg border border-border bg-card p-3 space-y-2",
      "data-ocid": `syllabus.qa_item.${idx}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 shrink-0 size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center", children: idx }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: qa.question,
              onChange: (e) => onChange({ ...qa, question: e.target.value }),
              className: "text-sm",
              "data-ocid": `syllabus.qa_question_input.${idx}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Answer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: qa.answer,
              onChange: (e) => onChange({ ...qa, answer: e.target.value }),
              rows: 2,
              className: "text-sm resize-none",
              "data-ocid": `syllabus.qa_answer_textarea.${idx}`
            }
          )
        ] })
      ] })
    }
  );
}
function ChapterDetailPanel({
  chapter,
  role,
  onBack,
  breadcrumbParts
}) {
  const { data: savedContent, isLoading: contentLoading } = useGetSyllabusContent(chapter.id);
  const generateQA = useGenerateQAFromContent();
  const saveQA = useSaveChapterQA();
  const submitForApproval = useSubmitChapterForApprovalV2();
  const approveChapter = useApproveChapterV2();
  const rejectChapter = useRejectChapterV2();
  const isAdmin = role === "Admin";
  const isPrincipal = isAdmin;
  const isTeacher = role === "Teacher" || isAdmin;
  const isStudent = role === "Student" || role === "Parent";
  const status = (savedContent == null ? void 0 : savedContent.status) ?? "Draft";
  const isApproved = status === "Approved";
  const isPending = status === "Pending";
  const [contentText, setContentText] = reactExports.useState("");
  const [contentSaving, setContentSaving] = reactExports.useState(false);
  const [questionsText, setQuestionsText] = reactExports.useState("");
  const [questionsSaving, setQuestionsSaving] = reactExports.useState(false);
  const [qaPairs, setQaPairs] = reactExports.useState([]);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [showRejectDialog, setShowRejectDialog] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!savedContent) return;
    setContentText(savedContent.contentText ?? "");
    setQuestionsText((savedContent.userProvidedQuestions ?? []).join("\n"));
    setQaPairs(
      (savedContent.qaPairs ?? []).map((q, i) => ({
        id: `qa-${String(i)}`,
        question: q.question,
        answer: q.answer
      }))
    );
  }, [savedContent]);
  const userQuestions = reactExports.useMemo(
    () => questionsText.split("\n").map((q) => q.trim()).filter(Boolean),
    [questionsText]
  );
  const canGenerate = contentText.trim().length > 0 && userQuestions.length > 0 && !isApproved;
  function buildPayload() {
    return {
      chapterId: chapter.id,
      contentText,
      bookQuestions: questionsText,
      userProvidedQuestions: userQuestions,
      qaPairs,
      status: (savedContent == null ? void 0 : savedContent.status) ?? "Draft",
      rejectionReason: (savedContent == null ? void 0 : savedContent.rejectionReason) ?? "",
      submittedAt: (savedContent == null ? void 0 : savedContent.submittedAt) ?? null,
      approvedAt: (savedContent == null ? void 0 : savedContent.approvedAt) ?? null
    };
  }
  function handleSaveContent() {
    setContentSaving(true);
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        ue.success("Chapter content saved.");
        setContentSaving(false);
      },
      onError: (e) => {
        ue.error(e.message);
        setContentSaving(false);
      }
    });
  }
  function handleSaveQuestions() {
    setQuestionsSaving(true);
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        ue.success("Questions saved.");
        setQuestionsSaving(false);
      },
      onError: (e) => {
        ue.error(e.message);
        setQuestionsSaving(false);
      }
    });
  }
  function handleGenerateQA() {
    if (!canGenerate) {
      ue.error("Please save both Chapter Content and Questions first.");
      return;
    }
    generateQA.mutate(
      { contentText, userQuestions },
      {
        onSuccess: (pairs) => {
          setQaPairs(pairs);
          const count = pairs.length;
          ue.success(
            `Generated ${count} Q&A pair${count !== 1 ? "s" : ""}.`
          );
        },
        onError: (e) => ue.error(e.message)
      }
    );
  }
  function handleSaveQA() {
    saveQA.mutate(buildPayload(), {
      onSuccess: () => ue.success("Q&A saved successfully."),
      onError: (e) => ue.error(e.message)
    });
  }
  function handleSubmit() {
    if (!contentText.trim()) {
      ue.error("Please save chapter content before submitting.");
      return;
    }
    if (userQuestions.length === 0) {
      ue.error("Please save at least one question before submitting.");
      return;
    }
    if (qaPairs.length === 0) {
      ue.error("Please generate Q&A before submitting.");
      return;
    }
    saveQA.mutate(buildPayload(), {
      onSuccess: () => {
        submitForApproval.mutate(chapter.id, {
          onSuccess: () => ue.success("Submitted for Principal approval."),
          onError: (e) => ue.error(e.message)
        });
      }
    });
  }
  function handleApprove() {
    approveChapter.mutate(chapter.id, {
      onSuccess: () => ue.success("Chapter approved and published for students."),
      onError: (e) => ue.error(e.message)
    });
  }
  function handleReject() {
    if (!rejectReason.trim()) {
      ue.error("Please provide a rejection reason.");
      return;
    }
    rejectChapter.mutate(
      { chapterId: chapter.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectReason("");
          ue.success("Chapter rejected and sent back to teacher.");
        },
        onError: (e) => ue.error(e.message)
      }
    );
  }
  if (contentLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[400px] w-full" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", "data-ocid": "syllabus.chapter_detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, { parts: breadcrumbParts, onNavigate: () => {
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          "data-ocid": "syllabus.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold font-display text-foreground truncate", children: [
        "Ch ",
        chapter.chapterNo,
        ": ",
        chapter.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ApprovalBadge, { status })
    ] }) }),
    status === "Rejected" && (savedContent == null ? void 0 : savedContent.rejectionReason) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Rejection Reason:" }),
      " ",
      savedContent.rejectionReason
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "content", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "content",
            className: "gap-1.5 text-xs",
            "data-ocid": "syllabus.tab_content",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5" }),
              "1. Chapter Content"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "questions",
            className: "gap-1.5 text-xs",
            "data-ocid": "syllabus.tab_questions",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "size-3.5" }),
              "2. Questions from Book",
              userQuestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs px-1 py-0", children: userQuestions.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "qa",
            className: "gap-1.5 text-xs",
            "data-ocid": "syllabus.tab_qa",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3.5" }),
              "3. AI-Generated Answers",
              qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs px-1 py-0", children: qaPairs.length })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "content", className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-blue-200 bg-blue-50/40 dark:bg-blue-950/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Section 1 of 3 — Chapter Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Paste or type the full chapter text from the textbook. This is used by the AI in Section 3 to generate accurate answers for your questions."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Chapter Content from Book" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              contentText.trim().split(/\s+/).filter(Boolean).length,
              " words"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Paste or type the full chapter text from the textbook here. This will be used to generate Q&A answers.",
              value: contentText,
              onChange: (e) => setContentText(e.target.value),
              rows: 16,
              className: "resize-none text-sm font-mono",
              readOnly: isStudent || isApproved,
              "data-ocid": "syllabus.content_textarea"
            }
          ),
          isStudent && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Read-only. Content published by your teacher." })
        ] }),
        isTeacher && !isApproved && !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: handleSaveContent,
            disabled: contentSaving || saveQA.isPending,
            "data-ocid": "syllabus.save_content_button",
            children: [
              contentSaving || saveQA.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mr-1" }),
              "Save Content"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "questions", className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 px-3 py-2 text-xs text-amber-700 dark:text-amber-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Section 2 of 3 — Questions from Book" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Enter the questions that are",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "already present in the textbook" }),
          ". One question per line. The AI will generate an answer for each question (in Section 3) based on the chapter content."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Questions Already Present in Textbook" }),
          isStudent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: userQuestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
              "data-ocid": "syllabus.questions_empty_state",
              children: "No questions added yet."
            }
          ) : userQuestions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2 rounded-lg bg-muted/30 border border-border px-3 py-2",
              "data-ocid": `syllabus.question_item.${userQuestions.indexOf(q) + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 size-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: q })
              ]
            },
            `q-${q.slice(0, 20)}`
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Enter each question on a separate line:\n1. What is photosynthesis?\n2. Explain the water cycle.\n3. What are the types of soil?",
              value: questionsText,
              onChange: (e) => setQuestionsText(e.target.value),
              rows: 14,
              className: "resize-none text-sm",
              readOnly: isApproved,
              "data-ocid": "syllabus.questions_textarea"
            }
          )
        ] }),
        isTeacher && !isApproved && !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleSaveQuestions,
              disabled: questionsSaving || saveQA.isPending,
              "data-ocid": "syllabus.save_questions_button",
              children: [
                questionsSaving || saveQA.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mr-1" }),
                "Save Questions"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            userQuestions.length,
            " question",
            userQuestions.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "qa", className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-green-200 bg-green-50/40 dark:bg-green-950/20 px-3 py-2 text-xs text-green-700 dark:text-green-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Section 3 of 3 — AI-Generated Answers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "The AI reads your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Chapter Content" }),
          " and generates the best answer for each ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Question from Book" }),
          ". Displayed as alternating Q / A pairs. Teachers can edit any answer before submitting for approval."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Q&A Pairs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Q = question from book · A = AI-generated answer from chapter content" })
          ] }),
          isTeacher && !isApproved && !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: handleGenerateQA,
              disabled: !canGenerate || generateQA.isPending,
              title: !canGenerate ? "Save Content (Tab 1) and Questions (Tab 2) first" : "Generate answers for each book question",
              "data-ocid": "syllabus.generate_qa_button",
              children: [
                generateQA.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5 mr-1" }),
                "Generate Answers"
              ]
            }
          )
        ] }),
        !canGenerate && !isStudent && qaPairs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700", children: [
          "⚠️ First save ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Chapter Content (Section 1)" }),
          " and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Questions from Book (Section 2)" }),
          ", then click",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Generate Answers" }),
          " here."
        ] }),
        isStudent ? /* @__PURE__ */ jsxRuntimeExports.jsx(QADisplay, { pairs: qaPairs }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[380px] pr-1", children: qaPairs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-dashed border-border bg-muted/20 p-10 text-center",
            "data-ocid": "syllabus.qa_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-8 mx-auto text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "No Q&A yet. Click ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Generate Q&A" }),
                " after saving content and questions."
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: qaPairs.map((qa, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          QAEditor,
          {
            qa,
            idx: i + 1,
            onChange: (updated) => setQaPairs(
              (prev) => prev.map((p) => p.id === qa.id ? updated : p)
            )
          },
          qa.id
        )) }) }),
        isTeacher && !isApproved && !isStudent && qaPairs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            onClick: handleSaveQA,
            disabled: saveQA.isPending,
            "data-ocid": "syllabus.save_qa_button",
            children: [
              saveQA.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mr-1" }),
              "Save Edits"
            ]
          }
        )
      ] })
    ] }),
    !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-3 border-t border-border", children: [
      isTeacher && (status === "Draft" || status === "Rejected") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: handleSubmit,
          disabled: submitForApproval.isPending || !contentText.trim() || userQuestions.length === 0 || qaPairs.length === 0,
          "data-ocid": "syllabus.submit_button",
          children: [
            submitForApproval.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }),
            "Submit for Approval"
          ]
        }
      ),
      isPrincipal && isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            className: "bg-green-600 hover:bg-green-700 text-white",
            onClick: handleApprove,
            disabled: approveChapter.isPending,
            "data-ocid": "syllabus.approve_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 mr-1" }),
              " Approve & Publish"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            className: "text-destructive border-destructive hover:bg-destructive/10",
            onClick: () => setShowRejectDialog(true),
            "data-ocid": "syllabus.reject_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3.5 mr-1" }),
              " Reject"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showRejectDialog, onOpenChange: setShowRejectDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "z-[9999]", "data-ocid": "syllabus.reject_dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reject Chapter" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason for Rejection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Explain what needs to be corrected…",
            value: rejectReason,
            onChange: (e) => setRejectReason(e.target.value),
            rows: 3,
            "data-ocid": "syllabus.reject_reason_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => setShowRejectDialog(false),
            "data-ocid": "syllabus.reject_cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "destructive",
            onClick: handleReject,
            disabled: rejectChapter.isPending,
            "data-ocid": "syllabus.reject_confirm_button",
            children: "Reject"
          }
        )
      ] })
    ] }) })
  ] });
}
function ChapterCard({
  chapter,
  idx,
  onOpen,
  onDelete,
  role
}) {
  var _a;
  const { data: content } = useGetSyllabusContent(chapter.id);
  const status = (content == null ? void 0 : content.status) ?? "Draft";
  const qaCount = ((_a = content == null ? void 0 : content.qaPairs) == null ? void 0 : _a.length) ?? 0;
  const isAdmin = role === "Admin" || role === "Principal";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "hover:shadow-md transition-shadow",
      "data-ocid": `syllabus.chapter_card.${idx}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 shrink-0 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center", children: chapter.chapterNo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold truncate", children: chapter.title }),
            chapter.topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: [
              chapter.topics.slice(0, 3).join(" · "),
              chapter.topics.length > 3 && ` +${chapter.topics.length - 3} more`
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ApprovalBadge, { status }),
            qaCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              qaCount,
              " Q&A"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-muted rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-primary h-full rounded-full transition-all",
              style: { width: `${chapter.completionPercent}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
            chapter.completionPercent,
            "% done"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs px-2",
              onClick: onOpen,
              "data-ocid": `syllabus.open_chapter_button.${idx}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3 mr-1" }),
                role === "Student" || role === "Parent" ? "Read" : "Edit"
              ]
            }
          ),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "size-7 text-destructive hover:text-destructive",
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              "data-ocid": `syllabus.delete_chapter_button.${idx}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
function PendingApprovalsPanel({
  onOpenChapter
}) {
  const { data: pendingChapters = [], isLoading } = usePendingApprovalChapters();
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) });
  if (pendingChapters.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-dashed border-border p-8 text-center",
        "data-ocid": "syllabus.pending_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-8 mx-auto text-green-500 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No chapters pending approval." })
        ]
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "syllabus.pending_list", children: pendingChapters.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "hover:shadow-md transition-shadow cursor-pointer",
      "data-ocid": `syllabus.pending_chapter_card.${i + 1}`,
      onClick: () => onOpenChapter(
        ch,
        CLASS_LABELS[ch.classLevel] ?? ch.classLevel,
        ch.subjectName ?? ""
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 shrink-0 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold truncate", children: [
            "Ch ",
            ch.chapterNo,
            ": ",
            ch.title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            ch.subjectName ?? "",
            " ·",
            " ",
            CLASS_LABELS[ch.classLevel] ?? ch.classLevel
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-100 text-amber-800 text-xs", children: "Review" })
      ] }) })
    },
    ch.id
  )) });
}
function SyllabusPage() {
  const { currentRole: role } = useAppStore();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  useUpdateChapterProgress();
  const createChapter = useCreateChapter();
  const deleteChapter = useDeleteChapter();
  const setClassLevel = { mutate: (_a) => {
  } };
  const isPrincipal = role === "Admin" || role === "Principal";
  const isStudent = role === "Student" || role === "Parent";
  const [selectedClass, setSelectedClass] = reactExports.useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = reactExports.useState("");
  const [selectedChapter, setSelectedChapter] = reactExports.useState(null);
  const [showPendingApprovals, setShowPendingApprovals] = reactExports.useState(false);
  const [showAddChapter, setShowAddChapter] = reactExports.useState(false);
  const [chapterForm, setChapterForm] = reactExports.useState({
    title: "",
    chapterNo: "",
    topics: "",
    classLevel: ""
  });
  const classSubjects = reactExports.useMemo(() => {
    if (!selectedClass) return [];
    return subjects.filter((s) => s.classLevel === selectedClass);
  }, [subjects, selectedClass]);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(selectedSubjectId);
  const visibleChapters = reactExports.useMemo(() => {
    return chapters;
  }, [chapters]);
  const classesWithSubjects = reactExports.useMemo(() => {
    const seen = new Set(subjects.map((s) => s.classLevel));
    return CLASS_ORDER.filter((c) => seen.has(c));
  }, [subjects]);
  function handleAddChapter() {
    if (!chapterForm.title.trim()) {
      ue.error("Chapter title is required.");
      return;
    }
    const topicsArr = chapterForm.topics.split(",").map((t) => t.trim()).filter(Boolean);
    createChapter.mutate(
      {
        subjectId: selectedSubjectId,
        chapterNo: Number(chapterForm.chapterNo) || chapters.length + 1,
        title: chapterForm.title,
        topics: topicsArr
      },
      {
        onSuccess: (ch) => {
          const classLvl = chapterForm.classLevel || selectedClass || "";
          if (classLvl) {
            setClassLevel.mutate({
              chapterId: ch.id,
              classLevel: String(classLvl)
            });
          }
          ue.success("Chapter added.");
          setShowAddChapter(false);
          setChapterForm({
            title: "",
            chapterNo: "",
            topics: "",
            classLevel: ""
          });
        },
        onError: (e) => ue.error(e.message)
      }
    );
  }
  function openChapter(ch, _classLabel, _subjectName) {
    setSelectedChapter(ch);
    setShowPendingApprovals(false);
  }
  const breadcrumbParts = reactExports.useMemo(() => {
    const parts = [
      {
        label: "Syllabus",
        level: "class",
        onClick: () => {
          setSelectedClass(null);
          setSelectedSubjectId("");
          setSelectedChapter(null);
        }
      }
    ];
    if (selectedClass) {
      parts.push({
        label: CLASS_LABELS[selectedClass],
        level: "subject",
        onClick: () => {
          setSelectedSubjectId("");
          setSelectedChapter(null);
        }
      });
    }
    if (selectedSubject) {
      parts.push({
        label: selectedSubject.name,
        level: "chapter",
        onClick: () => {
          setSelectedChapter(null);
        }
      });
    }
    if (selectedChapter) {
      parts.push({
        label: `Ch ${selectedChapter.chapterNo}: ${selectedChapter.title}`,
        level: "chapter-detail"
      });
    }
    return parts;
  }, [selectedClass, selectedSubject, selectedChapter]);
  if (selectedChapter) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChapterDetailPanel,
      {
        chapter: selectedChapter,
        role: role ?? "Teacher",
        onBack: () => setSelectedChapter(null),
        breadcrumbParts
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "syllabus.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Syllabus & Q&A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Class → Subject → Chapter navigation. Teachers add content & Q&A, Principal approves, students read." })
      ] }),
      isPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: showPendingApprovals ? "default" : "outline",
          size: "sm",
          onClick: () => {
            setShowPendingApprovals((v) => !v);
            setSelectedClass(null);
            setSelectedSubjectId("");
          },
          "data-ocid": "syllabus.pending_approvals_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 mr-1" }),
            "Pending Approvals"
          ]
        }
      )
    ] }),
    showPendingApprovals && isPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card rounded-xl border border-border p-5",
        "data-ocid": "syllabus.pending_approvals_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" }),
            " Chapters Pending Approval"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PendingApprovalsPanel,
            {
              onOpenChapter: (ch) => {
                setSelectedChapter(ch);
                setShowPendingApprovals(false);
              }
            }
          )
        ]
      }
    ),
    !showPendingApprovals && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4 text-primary" }),
          " Classes"
        ] }),
        subjectsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, i)) }) : classesWithSubjects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
            "data-ocid": "syllabus.classes_empty_state",
            children: "No subjects added yet. Add subjects in Academics."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: classesWithSubjects.map((cls) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectedClass(cls);
              setSelectedSubjectId("");
              setSelectedChapter(null);
            },
            className: `w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedClass === cls ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/60 text-foreground"}`,
            "data-ocid": `syllabus.class_item.${cls}`,
            children: CLASS_LABELS[cls]
          },
          cls
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 text-primary" }),
          " Subjects"
        ] }),
        !selectedClass ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
            "data-ocid": "syllabus.no_class_selected",
            children: "Select a class to view subjects."
          }
        ) : classSubjects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
            "data-ocid": "syllabus.subjects_empty_state",
            children: [
              "No subjects for ",
              CLASS_LABELS[selectedClass],
              "."
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: classSubjects.map((subj) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelectedSubjectId(subj.id);
              setSelectedChapter(null);
            },
            className: `w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedSubjectId === subj.id ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/60 text-foreground"}`,
            "data-ocid": `syllabus.subject_item.${subj.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: subj.name }),
              subj.code && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-xs ${selectedSubjectId === subj.id ? "text-primary-foreground/70" : "text-muted-foreground"}`,
                  children: subj.code
                }
              )
            ]
          },
          subj.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-primary" }),
            " Chapters"
          ] }),
          selectedSubjectId && !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-7 text-xs",
              onClick: () => setShowAddChapter(true),
              "data-ocid": "syllabus.add_chapter_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1" }),
                " Add"
              ]
            }
          )
        ] }),
        !selectedSubjectId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
            "data-ocid": "syllabus.no_subject_selected",
            children: "Select a subject to view chapters."
          }
        ) : chaptersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) }) : visibleChapters.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-dashed border-border p-8 text-center",
            "data-ocid": "syllabus.chapters_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-8 mx-auto text-muted-foreground/40 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "No chapters yet." }),
              !isStudent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => setShowAddChapter(true),
                  "data-ocid": "syllabus.add_first_chapter_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
                    " Add Chapter"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: visibleChapters.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChapterCard,
          {
            chapter: ch,
            idx: i + 1,
            role: role ?? "Teacher",
            onOpen: () => openChapter(ch),
            onDelete: () => deleteChapter.mutate(
              { id: ch.id, subjectId: selectedSubjectId },
              { onError: (e) => ue.error(e.message) }
            )
          },
          ch.id
        )) })
      ] })
    ] }),
    selectedClass && !selectedChapter && !showPendingApprovals && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, { parts: breadcrumbParts, onNavigate: () => {
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddChapter, onOpenChange: setShowAddChapter, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "z-[9999]",
        "data-ocid": "syllabus.add_chapter_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Chapter" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Chapter No ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    value: chapterForm.chapterNo,
                    onChange: (e) => setChapterForm((f) => ({ ...f, chapterNo: e.target.value })),
                    placeholder: "e.g. 1",
                    "data-ocid": "syllabus.chapter_no_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Chapter Title ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: chapterForm.title,
                    onChange: (e) => setChapterForm((f) => ({ ...f, title: e.target.value })),
                    placeholder: "e.g. Number Systems",
                    "data-ocid": "syllabus.chapter_title_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Topics (comma-separated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: chapterForm.topics,
                  onChange: (e) => setChapterForm((f) => ({ ...f, topics: e.target.value })),
                  placeholder: "e.g. Natural Numbers, Whole Numbers, Fractions",
                  "data-ocid": "syllabus.chapter_topics_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class Level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: chapterForm.classLevel || selectedClass || "",
                  onValueChange: (v) => setChapterForm((f) => ({ ...f, classLevel: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "syllabus.chapter_class_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-60 overflow-y-auto", children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowAddChapter(false),
                "data-ocid": "syllabus.add_chapter_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleAddChapter,
                disabled: createChapter.isPending,
                "data-ocid": "syllabus.add_chapter_submit_button",
                children: [
                  createChapter.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }),
                  "Add Chapter"
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  SyllabusPage as default
};
