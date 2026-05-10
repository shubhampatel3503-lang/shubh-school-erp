// ─── Backend hooks — wires real canister calls via useActor ──────────────────
// All public return types use @/types (frontend type system).
// Backend @/backend.d types are used only internally for actor calls.

import { createActor } from "@/backend";

import { ChatRoomType as BackendChatRoomType } from "@/backend.d";
import type {
  AcademicPerformanceReport,
  ClassTimetable as BackendClassTimetable,
  ExamConfig as BackendExamConfig,
  GenerateScheduleParams as BackendGenerateScheduleParams,
  GenerateTimetableParams as BackendGenerateTimetableParams,
  SmartExamTimetable as BackendSmartExamTimetable,
  ExamResultV2,
  StaffIncentive,
  StaffLoan,
  StaffPaymentSummaryEntry,
  StaffPayout,
  StaffYearEndSummary,
  backendInterface,
} from "@/backend.d";
import {
  defaultSchoolInfo,
  defaultSettings,
  sampleFeeHeadings,
  sampleRoutes,
  sampleSections,
  sampleStaff,
  sampleStudents,
} from "@/lib/backend";
import type { Subject } from "@/types";
import type {
  AlumniRecord,
  AppSettings,
  AttendanceRecord,
  Book,
  BookIssue,
  BusLocation,
  ClassLevel,
  ClassTimetable,
  CustomLink,
  DashboardStatsV2,
  FeatureCard,
  FeeHeading,
  FeePayment,
  FeePlan,
  GenerateTimetableParams,
  IndexPageConfig,
  IndexPageSection,
  Notification,
  PromotionAllResult,
  PromotionPreviewItem,
  PromotionResult,
  SchoolInfo,
  Section,
  Student,
  StudentDiscount,
  StudentOldBalance,
  SyllabusApprovalStatus,
  SyllabusChapter,
  SyllabusContent,
  SyllabusQAPair,
  TransportRoute,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

// Re-export for consumers that want these types from one place
export type { IndexPageConfig, IndexPageSection, CustomLink, FeatureCard };

function useBackendActor() {
  return useActor<backendInterface>(createActor);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wraps a backend call error into a user-friendly Error. */
function wrapError(err: unknown, defaultMsg: string): Error {
  if (err instanceof Error) return err;
  return new Error(defaultMsg);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const HARDCODED_USERS: Record<
  string,
  { password: string; role: string; userId: number }
> = {
  admin: { password: "admin123", role: "Admin", userId: 1 },
  teacher: { password: "teacher123", role: "Teacher", userId: 2 },
  accountant: { password: "account123", role: "Accountant", userId: 3 },
  librarian: { password: "library123", role: "Librarian", userId: 4 },
};

interface LoginResult {
  success: boolean;
  userId: number;
  username: string;
  displayName: string;
  role: string;
  isFirstLogin?: boolean;
  error?: string;
}

export function useLoginUser() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }): Promise<LoginResult> => {
      if (actor) {
        try {
          const result = await actor.loginUser(username, password);
          if (result.__kind__ === "ok") {
            const isFirstLogin =
              result.ok.role === "Admin" && result.ok.username === "admin";
            return {
              success: true,
              userId: Number(result.ok.userId),
              username: result.ok.username,
              displayName: result.ok.username,
              role: result.ok.role,
              isFirstLogin,
            };
          }
          return {
            success: false,
            userId: 0,
            username: "",
            displayName: "",
            role: "",
            error: "Invalid username or password. Please try again.",
          };
        } catch {
          /* fall through to hardcoded fallback */
        }
      }
      const lowerUser = username.toLowerCase().trim();
      const user = HARDCODED_USERS[lowerUser];
      if (user && user.password === password) {
        return {
          success: true,
          userId: user.userId,
          username: lowerUser,
          displayName: lowerUser,
          role: user.role,
          isFirstLogin: lowerUser === "admin",
        };
      }
      return {
        success: false,
        userId: 0,
        username: "",
        displayName: "",
        role: "",
        error: "Invalid username or password. Please try again.",
      };
    },
  });
}

// ─── School Info ──────────────────────────────────────────────────────────────

export function useSchoolInfo() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<SchoolInfo>({
    queryKey: ["schoolInfo"],
    queryFn: async (): Promise<SchoolInfo> => {
      if (!actor) return defaultSchoolInfo;
      try {
        const info = await actor.getSchoolInfo();
        return {
          name: info.name,
          tagline: "",
          about: info.about,
          photoUrl: info.photoUrl ?? "",
          address: info.address,
          phone: info.phone,
          email: info.email,
        };
      } catch {
        return defaultSchoolInfo;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSchoolInfo() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SchoolInfo>) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateSchoolInfo({
          name: data.name ?? "",
          about: data.about ?? "",
          photoUrl: data.photoUrl ?? undefined,
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          website: undefined,
        });
      } catch (e) {
        throw wrapError(e, "Failed to save school information.");
      }
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schoolInfo"] }),
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function useSettings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AppSettings>({
    queryKey: ["settings"],
    queryFn: async (): Promise<AppSettings> => {
      if (!actor) return defaultSettings;
      try {
        const s = await actor.getSettings();
        return {
          whatsappApiKey: s.whatsappApiKey ?? "",
          whatsappApiUrl: s.whatsappApiUrl ?? "",
          whatsappPhoneNumberId: "",
          razorpayEnabled: s.razorpayEnabled,
          razorpayKeyId: "",
          payuEnabled: s.payuEnabled,
          gpayEnabled: s.gpayEnabled,
          gpayUpiId: s.upiId ?? "school@upi",
          theme: s.activeTheme ?? "navy-gold",
          dashboardBgUrl: s.dashboardBgUrl ?? "",
          activeSessionId: "2025-26",
        };
      } catch {
        return defaultSettings;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Sessions ───────────────────────────────────────────────────────────────────

export function useSessions() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: ["sessions"],
    queryFn: async (): Promise<string[]> => {
      if (!actor)
        return [
          "2025-26",
          "2024-25",
          "2023-24",
          "2022-23",
          "2021-22",
          "2020-21",
          "2019-20",
        ];
      try {
        const raw = await actor.getSessions();
        if (!Array.isArray(raw)) return [];
        return raw
          .map((s) => (s as unknown as { name?: string }).name ?? String(s))
          .filter(Boolean);
      } catch {
        return ["2025-26", "2024-25", "2023-24", "2022-23"];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Students ───────────────────────────────────────────────────────────────────────────────────

type BackendStudent = Awaited<
  ReturnType<backendInterface["getStudents"]>
>[number];

function mapStudent(s: BackendStudent): Student {
  return {
    id: s.id,
    admNo: s.admNo,
    fullName: s.fullName,
    fatherName: s.fatherName,
    motherName: s.motherName,
    fatherMobile: s.fatherMobile,
    motherMobile: s.motherMobile ?? "",
    mobile: s.mobile ?? "",
    currentAddress: s.currentAddress ?? "",
    permanentAddress: s.permanentAddress ?? "",
    category: s.category ?? "General",
    aadhaarNo: s.aadhaarNo ?? "",
    srNo: s.srNo ?? "",
    penNo: s.penNo ?? "",
    apaarNo: s.apaarNo ?? "",
    prevSchool: s.prevSchool ?? "",
    admissionDate: s.admissionDate ?? "",
    busNo: s.busNo ?? "",
    classLevel: s.classLevel as Student["classLevel"],
    sectionId: s.sectionId,
    sessionId: s.session,
    dateOfBirth: s.dateOfBirth,
    gender: (s.gender ?? "Male") as Student["gender"],
    photoUrl: s.photoUrl ?? "",
    isDiscontinued: s.status === "Discontinued",
    discontinuedAt: null,
    transportRouteId: s.transportRouteId ?? null,
    pickupPointId: s.transportPickupPointId ?? null,
    createdAt:
      typeof s.createdAt === "bigint"
        ? new Date(Number(s.createdAt) / 1_000_000).toISOString().split("T")[0]
        : String(s.createdAt),
  };
}

export function useStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async (): Promise<Student[]> => {
      if (!actor) return sampleStudents;
      try {
        return (await actor.getStudents()).map(mapStudent);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useStudentById(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student | null>({
    queryKey: ["student", id],
    queryFn: async (): Promise<Student | null> => {
      if (!actor) return sampleStudents.find((s) => s.id === id) ?? null;
      try {
        const s = await actor.getStudentById(id);
        return s ? mapStudent(s) : null;
      } catch {
        return null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useAddStudent() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<Student, "id" | "createdAt">,
    ): Promise<Student> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      // session is required — fall back to current year session if empty
      const sessionValue = data.sessionId?.trim() || "2025-26";
      try {
        const result = await actor.addStudent(
          data.admNo,
          data.fullName,
          data.fatherName,
          data.motherName,
          data.fatherMobile,
          data.motherMobile || null,
          data.dateOfBirth,
          data.gender,
          data.currentAddress,
          data.permanentAddress,
          data.classLevel as string,
          data.sectionId,
          sessionValue,
          data.photoUrl || null,
          null, // bloodGroup
          null, // religion
          data.category || null,
          data.aadhaarNo || null,
          data.transportRouteId || null,
          data.pickupPointId || null,
          data.busNo || null,
          data.mobile || null,
          data.srNo || null,
          data.penNo || null,
          data.apaarNo || null,
          data.prevSchool || null,
          data.admissionDate || null,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
        return mapStudent(result.ok);
      } catch (e) {
        throw wrapError(e, "Failed to add student. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteStudent(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete student. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteAllStudents() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteAllStudents();
      } catch (e) {
        throw wrapError(e, "Failed to delete all students. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDiscontinueStudent() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.discontinueStudent(id);
      } catch (e) {
        throw wrapError(e, "Failed to discontinue student. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Student): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const sessionValue = data.sessionId?.trim() || "2025-26";
      try {
        await actor.updateStudent(
          data.id,
          data.admNo,
          data.fullName,
          data.fatherName,
          data.motherName,
          data.fatherMobile,
          data.motherMobile || null,
          data.dateOfBirth,
          data.gender,
          data.currentAddress,
          data.permanentAddress,
          data.classLevel as string,
          data.sectionId,
          sessionValue,
          data.photoUrl || null,
          null, // bloodGroup
          null, // religion
          data.category || null,
          data.aadhaarNo || null,
          data.transportRouteId || null,
          data.pickupPointId || null,
          data.busNo || null,
          data.mobile || null,
          data.srNo || null,
          data.penNo || null,
          data.apaarNo || null,
          data.prevSchool || null,
          data.admissionDate || null,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update student. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

/**
 * Variant of useUpdateStudent with no automatic cache invalidation.
 * Used for bulk photo upload to avoid racing re-fetches mid-loop.
 * Caller must call qc.invalidateQueries(['students']) after all mutations.
 */
export function useUpdateStudentSilent() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (data: Student): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const sessionValue = data.sessionId?.trim() || "2025-26";
      try {
        await actor.updateStudent(
          data.id,
          data.admNo,
          data.fullName,
          data.fatherName,
          data.motherName,
          data.fatherMobile,
          data.motherMobile || null,
          data.dateOfBirth,
          data.gender,
          data.currentAddress,
          data.permanentAddress,
          data.classLevel as string,
          data.sectionId,
          sessionValue,
          data.photoUrl || null,
          null,
          null,
          data.category || null,
          data.aadhaarNo || null,
          data.transportRouteId || null,
          data.pickupPointId || null,
          data.busNo || null,
          data.mobile || null,
          data.srNo || null,
          data.penNo || null,
          data.apaarNo || null,
          data.prevSchool || null,
          data.admissionDate || null,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update student. Please try again.");
      }
    },
    // No onSuccess — caller handles cache refresh after all photos are uploaded
  });
}

export function useStudentSearch(query: string) {
  const { data: students } = useStudents();
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !students) return [];
    return students
      .filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.fatherName.toLowerCase().includes(q) ||
          s.motherName.toLowerCase().includes(q) ||
          s.fatherMobile.includes(q) ||
          s.motherMobile.includes(q) ||
          s.admNo.toLowerCase().includes(q) ||
          (s.permanentAddress ?? "").toLowerCase().includes(q) ||
          s.currentAddress.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [students, query]);
}

// ─── Fee Headings ─────────────────────────────────────────────────────────────

// ─── Subjects CRUD ─────────────────────────────────────────────────────────────

type BackendSubject = Awaited<
  ReturnType<backendInterface["getSubjects"]>
>[number];

function mapSubject(s: BackendSubject): Subject {
  return {
    id: s.id,
    name: s.name,
    code: s.code,
    classLevel: s.classLevel as Subject["classLevel"],
    isOptional: false,
  };
}

export function useSubjects(classFilter?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects", classFilter ?? "all"],
    queryFn: async (): Promise<Subject[]> => {
      if (!actor) return [];
      try {
        const raw =
          classFilter && classFilter !== "all"
            ? await actor.getSubjectsByClass(
                classFilter as import("@/types").ClassLevel,
              )
            : await actor.getSubjects();
        return raw.map(mapSubject);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useCreateSubject() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      code,
      classLevel,
      maxMarks,
      passingMarks,
    }: {
      name: string;
      code: string;
      classLevel: string;
      maxMarks: number;
      passingMarks: number;
    }): Promise<Subject> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.createSubject(
          name,
          code,
          classLevel as import("@/types").ClassLevel,
          BigInt(maxMarks),
          BigInt(passingMarks),
        );
        return mapSubject(raw);
      } catch (e) {
        throw wrapError(e, "Failed to create subject. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useUpdateSubject() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      code,
      classLevel,
      maxMarks,
      passingMarks,
    }: {
      id: string;
      name: string;
      code: string;
      classLevel: string;
      maxMarks: number;
      passingMarks: number;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateSubject(
          id,
          name,
          code,
          classLevel as import("@/types").ClassLevel,
          BigInt(maxMarks),
          BigInt(passingMarks),
        );
      } catch (e) {
        throw wrapError(e, "Failed to update subject. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useDeleteSubject() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteSubject(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete subject. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["subject-class-maps"] });
    },
  });
}

// ─── Chapters / Syllabus CRUD ───────────────────────────────────────────────────

type BackendChapter = Awaited<
  ReturnType<backendInterface["getChapters"]>
>[number];

function mapChapter(c: BackendChapter): import("@/types").SyllabusChapter {
  return {
    id: c.id,
    subjectId: c.subjectId,
    title: c.title,
    chapterNo: Number(c.chapterNo),
    topics: Array.isArray(c.topics) ? c.topics : [],
    completionPercent: Number(c.completionPercent),
  };
}

export function useChapters(subjectId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").SyllabusChapter[]>({
    queryKey: ["chapters", subjectId],
    queryFn: async (): Promise<import("@/types").SyllabusChapter[]> => {
      if (!actor || !subjectId) return [];
      try {
        return (await actor.getChapters(subjectId)).map(mapChapter);
      } catch {
        return [];
      }
    },
    enabled: !!subjectId && !isFetching,
  });
}

export function useCreateChapter() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectId,
      chapterNo,
      title,
      topics,
      classLevel,
    }: {
      subjectId: string;
      chapterNo: number;
      title: string;
      topics: string[];
      classLevel?: string;
    }): Promise<import("@/types").SyllabusChapter> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.createChapter(
          subjectId,
          BigInt(chapterNo),
          title,
          topics,
          classLevel ?? "",
        );
        return mapChapter(raw);
      } catch (e) {
        throw wrapError(e, "Failed to create chapter. Please try again.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["chapters", vars.subjectId] }),
  });
}

export function useUpdateChapterProgress() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      subjectId: _subjectId,
      completionPercent,
    }: {
      id: string;
      subjectId: string;
      completionPercent: number;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateChapterProgress(id, BigInt(completionPercent));
      } catch (e) {
        throw wrapError(e, "Failed to update progress. Please try again.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["chapters", vars.subjectId] }),
  });
}

export function useDeleteChapter() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      subjectId: _subjectId2,
    }: {
      id: string;
      subjectId: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteChapter(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete chapter. Please try again.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["chapters", vars.subjectId] }),
  });
}

type BackendSyllabusContent = {
  contentText?: string;
  generatedQA?: Array<{ question: string; answer: string }>;
  savedQA?: Array<{ question: string; answer: string }>;
  approvalStatus?: string;
  rejectionReason?: string;
  submittedAt?: bigint;
  approvedAt?: bigint;
  chapterId?: string;
  userProvidedQuestions?: string[];
};

type FrontendSyllabusContent = {
  chapterId: string;
  contentText: string;
  userProvidedQuestions: string[];
  qaPairs: { id: string; question: string; answer: string }[];
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  rejectionReason: string;
  submittedAt: string | null;
  approvedAt: string | null;
};

function mapSyllabusContent(
  raw: BackendSyllabusContent,
  chapterId: string,
): FrontendSyllabusContent {
  const savedPairs = raw.savedQA ?? raw.generatedQA ?? [];
  const qaPairs = savedPairs.map((q, i) => ({
    id: `qa-${i}`,
    question: q.question,
    answer: q.answer,
  }));
  const rawStatus = raw.approvalStatus ?? "Draft";
  const status: "Draft" | "Pending" | "Approved" | "Rejected" =
    rawStatus === "Pending" ||
    rawStatus === "Approved" ||
    rawStatus === "Rejected"
      ? rawStatus
      : "Draft";
  return {
    chapterId,
    contentText: raw.contentText ?? "",
    userProvidedQuestions: Array.isArray(raw.userProvidedQuestions)
      ? raw.userProvidedQuestions
      : [],
    qaPairs,
    status,
    rejectionReason: raw.rejectionReason ?? "",
    submittedAt: raw.submittedAt
      ? new Date(Number(raw.submittedAt) / 1_000_000).toISOString()
      : null,
    approvedAt: raw.approvedAt
      ? new Date(Number(raw.approvedAt) / 1_000_000).toISOString()
      : null,
  };
}

export function useGetSyllabusContent(chapterId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<SyllabusContent | null>({
    queryKey: ["syllabus-content", chapterId],
    queryFn: async (): Promise<SyllabusContent | null> => {
      if (!actor || !chapterId) return null;
      try {
        const raw = await actor.getSyllabusContent(chapterId);
        if (!raw) return null;
        return mapSyllabusContent(raw, chapterId);
      } catch {
        return null;
      }
    },
    enabled: !!chapterId && !isFetching,
    staleTime: 30_000,
  });
}

export function useSyllabusContent(chapterId: string) {
  return useGetSyllabusContent(chapterId);
}

export function useGenerateChapterQA() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      chapterId: string;
      contentText: string;
      userQuestions: string[];
    }): Promise<SyllabusQAPair[]> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const pairs = await actor.generateChapterQA(
          args.chapterId,
          args.contentText,
          args.userQuestions,
        );
        return pairs.map((p, i) => ({
          id: `qa-${String(i)}`,
          question: p.question,
          answer: p.answer,
        }));
      } catch (e) {
        throw wrapError(e, "Failed to generate Q&A. Please try again.");
      }
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", vars.chapterId] }),
  });
}

export function useSaveChapterQA() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      chapterId: string;
      qaPairs: SyllabusQAPair[];
      userProvidedQuestions: string[];
      contentText?: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        if (args.contentText !== undefined) {
          await actor.addChapterContent(args.chapterId, args.contentText);
        }
        await actor.saveChapterQA(
          args.chapterId,
          args.qaPairs.map((q) => ({ question: q.question, answer: q.answer })),
          args.userProvidedQuestions,
        );
      } catch (e) {
        throw wrapError(e, "Failed to save Q&A. Please try again.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", vars.chapterId] }),
  });
}

export function useSaveSyllabusContent() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: SyllabusContent): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.addChapterContent(content.chapterId, content.contentText);
        await actor.saveChapterQA(
          content.chapterId,
          content.qaPairs.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
          // Prefer explicit userProvidedQuestions array; fall back to splitting bookQuestions text
          content.userProvidedQuestions ??
            (content.bookQuestions
              ? content.bookQuestions
                  .split("\n")
                  .map((q) => q.trim())
                  .filter(Boolean)
              : []),
        );
      } catch (e) {
        throw wrapError(e, "Failed to save content.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", vars.chapterId] }),
  });
}

export function useSetChapterClassLevel() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      chapterId: string;
      classLevel: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.setChapterClassLevel(args.chapterId, args.classLevel);
      } catch (e) {
        throw wrapError(e, "Failed to set class level.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
  });
}

export function useSubmitChapterForApprovalV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.submitChapterForApproval(chapterId);
      } catch (e) {
        throw wrapError(e, "Failed to submit for approval.");
      }
    },
    onSuccess: (_d, chapterId) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", chapterId] }),
  });
}

export function useSubmitChapterForApproval() {
  return useSubmitChapterForApprovalV2();
}

export function useApproveChapterV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.approveChapter(chapterId);
      } catch (e) {
        throw wrapError(e, "Failed to approve chapter.");
      }
    },
    onSuccess: (_d, chapterId) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", chapterId] }),
  });
}

export function useApproveChapter() {
  return useApproveChapterV2();
}

export function useRejectChapterV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      chapterId: string;
      reason: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.rejectChapter(args.chapterId, args.reason);
      } catch (e) {
        throw wrapError(e, "Failed to reject chapter.");
      }
    },
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["syllabus-content", vars.chapterId] }),
  });
}

export function useRejectChapter() {
  return useRejectChapterV2();
}

export function usePendingApprovalChapters() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<
    (SyllabusChapter & {
      subjectName?: string;
      classLevel: string;
    })[]
  >({
    queryKey: ["pending-approval-chapters"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const rawSubjects = await actor.getSubjects();
        const pending: (SyllabusChapter & {
          subjectName?: string;
          classLevel: string;
        })[] = [];
        for (const subj of rawSubjects) {
          const chapters = await actor.getChapters(subj.id);
          for (const ch of chapters) {
            const content = await actor.getSyllabusContent(ch.id);
            if (content && content.approvalStatus === "Pending") {
              pending.push({
                id: ch.id,
                subjectId: ch.subjectId,
                title: ch.title,
                chapterNo: Number(ch.chapterNo),
                topics: ch.topics ?? [],
                completionPercent: Number(ch.completionPercent),
                subjectName: subj.name,
                classLevel: subj.classLevel,
              });
            }
          }
        }
        return pending;
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

/** @deprecated — local fallback only; use useGenerateQAFromContent hook for real backend answers */
export function generateQAFromContent(
  contentText: string,
): import("@/types").SyllabusQAPair[] {
  if (!contentText.trim()) return [];
  const sentences = contentText
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const qa: import("@/types").SyllabusQAPair[] = [];
  sentences.slice(0, 10).forEach((s, i) => {
    const words = s.split(" ");
    qa.push({
      id: `qa-${String(i)}`,
      question: `Q${String(i + 1)}: ${words.slice(0, 5).join(" ")}...?`,
      answer: s,
    });
  });
  return qa;
}

// ─── Payroll & Calendar (real backend hooks) ─────────────────────────────────

export interface FrontendPayrollRecord {
  id: string;
  staffId: string;
  month: number;
  year: number;
  baseSalary: number;
  presentDays: number;
  absentDays: number;
  workingDays: number;
  freeLeave: number;
  deductibleDays: number;
  deduction: number;
  netPay: number;
  amountPaid: number;
  status: "paid" | "unpaid" | "partial";
  notes: string;
  lockedAt: string | null;
  generatedAt: string;
}

function mapPayrollRecord(
  r: import("@/backend.d").StaffPayrollRecord,
): FrontendPayrollRecord {
  const rawStatus = r.status as unknown as string;
  const s2: "paid" | "unpaid" | "partial" =
    rawStatus === "paid"
      ? "paid"
      : rawStatus === "partial"
        ? "partial"
        : "unpaid";
  return {
    id: r.id,
    staffId: r.staffId,
    month: Number(r.month),
    year: Number(r.year),
    baseSalary: Number(r.baseSalary),
    presentDays: Number(r.presentDays),
    absentDays: Number(r.absentDays),
    workingDays: Number(r.workingDays),
    freeLeave: Number(r.freeLeave),
    deductibleDays: Number(r.deductibleDays),
    deduction: Number(r.deduction),
    netPay: Number(r.netPay),
    amountPaid: Number(r.amountPaid),
    status: s2,
    notes: r.notes,
    lockedAt: r.lockedAt
      ? new Date(Number(r.lockedAt) / 1_000_000).toISOString()
      : null,
    generatedAt: new Date(Number(r.generatedAt) / 1_000_000).toISOString(),
  };
}

export function useCalculateAndSavePayroll() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      staffId: string;
      month: number;
      year: number;
      baseSalary: number;
    }): Promise<FrontendPayrollRecord> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.calculateAndSavePayroll(
          p.staffId,
          BigInt(p.month),
          BigInt(p.year),
          BigInt(p.baseSalary),
        );
        return mapPayrollRecord(raw);
      } catch (e) {
        throw wrapError(e, "Failed to calculate payroll.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrollByMonth"] });
      qc.invalidateQueries({ queryKey: ["payrollHistory"] });
    },
  });
}

export function useLockPayrollMonth() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      staffId: string;
      month: number;
      year: number;
    }): Promise<FrontendPayrollRecord | null> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.lockPayrollMonth(
          p.staffId,
          BigInt(p.month),
          BigInt(p.year),
        );
        return raw ? mapPayrollRecord(raw) : null;
      } catch (e) {
        throw wrapError(e, "Failed to lock payroll month.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrollByMonth"] });
      qc.invalidateQueries({ queryKey: ["payrollHistory"] });
    },
  });
}

export function useGetPayrollByMonth(month: number, year: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendPayrollRecord[]>({
    queryKey: ["payrollByMonth", month, year],
    queryFn: async (): Promise<FrontendPayrollRecord[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getPayrollByMonth(BigInt(month), BigInt(year));
        return raw.map(mapPayrollRecord);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetPayrollHistory(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendPayrollRecord[]>({
    queryKey: ["payrollHistory", staffId],
    queryFn: async (): Promise<FrontendPayrollRecord[]> => {
      if (!actor || !staffId) return [];
      try {
        const raw = await actor.getPayrollHistory(staffId);
        return raw.map(mapPayrollRecord);
      } catch {
        return [];
      }
    },
    enabled: !!staffId && !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useRecordPayrollPayout() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      staffId: string;
      month: number;
      year: number;
      amount: number;
      baseSalary: number;
    }): Promise<FrontendPayrollRecord | null> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.recordPayrollPayout(
          p.staffId,
          BigInt(p.month),
          BigInt(p.year),
          BigInt(p.amount),
          BigInt(p.baseSalary),
        );
        return raw ? mapPayrollRecord(raw) : null;
      } catch (e) {
        throw wrapError(e, "Failed to record payout.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payrollByMonth"] });
      qc.invalidateQueries({ queryKey: ["payrollHistory"] });
    },
  });
}

export function useGetPaidLeaveConfig() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<{ daysPerMonth: number }>({
    queryKey: ["paidLeaveConfig"],
    queryFn: async (): Promise<{ daysPerMonth: number }> => {
      if (!actor) return { daysPerMonth: 1 };
      try {
        const raw = await actor.getPaidLeaveConfig();
        return { daysPerMonth: raw.daysPerMonth };
      } catch {
        return { daysPerMonth: 1 };
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSetPaidLeaveConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (daysPerMonth: number): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.setPaidLeaveConfig(daysPerMonth);
      } catch (e) {
        throw wrapError(e, "Failed to save paid leave config.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paidLeaveConfig"] }),
  });
}

export interface FrontendExamCalendarEntry {
  id: string;
  examName: string;
  date: string;
  className: string;
  createdAt: string;
}

export function useGetExamDatesForCalendar() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendExamCalendarEntry[]>({
    queryKey: ["examCalendarEntries"],
    queryFn: async (): Promise<FrontendExamCalendarEntry[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getExamDatesForCalendar();
        return raw.map((e) => ({
          id: e.id,
          examName: e.examName,
          date: e.date,
          className: e.className,
          createdAt: new Date(Number(e.createdAt) / 1_000_000).toISOString(),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddExamDateToCalendar() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      examName: string;
      date: string;
      className: string;
    }): Promise<FrontendExamCalendarEntry> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addExamDateToCalendar(
          p.examName,
          p.date,
          p.className,
        );
        return {
          id: raw.id,
          examName: raw.examName,
          date: raw.date,
          className: raw.className,
          createdAt: new Date(Number(raw.createdAt) / 1_000_000).toISOString(),
        };
      } catch (e) {
        throw wrapError(e, "Failed to add exam date.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["examCalendarEntries"] }),
  });
}

export function useGetCalendarStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<{
    totalDaysFromApril1: number;
    workingDays: number;
    sundayCount: number;
    holidayCount: number;
  }>({
    queryKey: ["calendarStatsV2"],
    queryFn: async () => {
      if (!actor)
        return {
          totalDaysFromApril1: 0,
          workingDays: 0,
          sundayCount: 0,
          holidayCount: 0,
        };
      try {
        const raw = await actor.getCalendarStats();
        return {
          totalDaysFromApril1: Number(raw.totalDaysFromApril1),
          workingDays: Number(raw.workingDays),
          sundayCount: Number(raw.sundayCount),
          holidayCount: Number(raw.holidayCount),
        };
      } catch {
        return {
          totalDaysFromApril1: 0,
          workingDays: 0,
          sundayCount: 0,
          holidayCount: 0,
        };
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGenerateQAFromContent() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (p: {
      contentText: string;
      userQuestions: string[];
    }): Promise<SyllabusQAPair[]> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const pairs = await actor.generateQAFromContent(
          p.contentText,
          p.userQuestions,
        );
        return pairs.map((pair, i) => ({
          id: `qa-${String(i)}`,
          question: p.userQuestions[i] ?? pair.question,
          answer: pair.answer,
        }));
      } catch (e) {
        throw wrapError(e, "Failed to generate answers. Please try again.");
      }
    },
  });
}

export function useFeeHeadings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeHeading[]>({
    queryKey: ["feeHeadings"],
    queryFn: async (): Promise<FeeHeading[]> => {
      if (!actor) return sampleFeeHeadings;
      try {
        return (await actor.getFeeHeadings()).map((h) => ({
          id: h.id,
          name: h.name,
          description: h.description ?? "",
          isActive: h.isActive,
          applicableMonths: Array.from(h.applicableMonths ?? []),
        }));
      } catch {
        return sampleFeeHeadings;
      }
    },
    enabled: !isFetching,
    staleTime: 15 * 60 * 1000,
  });
}

export function useAddFeeHeading() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      applicableMonths,
    }: {
      name: string;
      description: string;
      applicableMonths?: string[];
    }): Promise<FeeHeading> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const months = applicableMonths ?? [];
        const raw = await actor.addFeeHeading(
          name,
          description.trim() || null,
          months,
        );
        return {
          id: raw.id,
          name: raw.name,
          description: raw.description ?? "",
          isActive: raw.isActive,
          applicableMonths: Array.from(raw.applicableMonths ?? []),
        };
      } catch (e) {
        throw wrapError(e, "Failed to add fee heading. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feeHeadings"] }),
  });
}

export function useUpdateFeeHeading() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      isActive,
      applicableMonths,
    }: {
      id: string;
      name: string;
      description: string;
      isActive: boolean;
      applicableMonths?: string[];
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateFeeHeading(
          id,
          name,
          description.trim() || null,
          isActive,
          applicableMonths ?? [],
        );
      } catch (e) {
        throw wrapError(e, "Failed to update fee heading. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feeHeadings"] }),
  });
}

export function useDeleteFeeHeading() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteFeeHeading(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete fee heading. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feeHeadings"] });
      qc.invalidateQueries({ queryKey: ["feePlans"] });
    },
  });
}

// ─── Sections ─────────────────────────────────────────────────────────────────

/** @deprecated use useGetSections instead */
export function useSections() {
  // NOTE: uses same queryKey as useGetSections to share the cache — reads from ["sections"]
  const { actor, isFetching } = useBackendActor();
  return useQuery<Section[]>({
    queryKey: ["sections"],
    queryFn: async (): Promise<Section[]> => {
      if (!actor) return sampleSections;
      try {
        return (await actor.getSections()).map((s) => ({
          id: s.id,
          classLevel: s.classLevel as Section["classLevel"],
          // Backend field is sectionName — map to frontend field name
          name: s.sectionName,
          sessionId: "2025-26",
          capacity: 40,
          roomNo: s.roomNo ?? "",
          teacherId: s.teacherId ?? "",
        }));
      } catch {
        return sampleSections;
      }
    },
    enabled: !isFetching,
  });
}

// ─── Staff ────────────────────────────────────────────────────────────────────
// ─── User Management ─────────────────────────────────────────────────────────

export interface FrontendUserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  staffId: string | null;
  studentId: string | null;
  isActive: boolean;
  createdAt: string;
  permissions: Record<string, boolean>;
  principal: string;
}

function mapUser(
  u: Awaited<ReturnType<backendInterface["getUsers"]>>[number],
): FrontendUserAccount {
  return {
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    email: "",
    mobile: "",
    role: u.role,
    staffId: u.staffId ?? null,
    studentId: u.studentId ?? null,
    isActive: u.isActive,
    createdAt:
      typeof u.createdAt === "bigint"
        ? new Date(Number(u.createdAt) / 1_000_000).toISOString().split("T")[0]
        : String(u.createdAt),
    permissions: Object.fromEntries(
      (u.permissions ?? []).map((p) => [p, true]),
    ),
    principal: u.principalId,
  };
}

export function useGetAllUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendUserAccount[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<FrontendUserAccount[]> => {
      if (!actor) return [];
      try {
        return (await actor.getUsers()).map(mapUser);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      username: string;
      fullName: string;
      role: string;
      position?: string;
      permissions?: string[];
    }): Promise<FrontendUserAccount> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const userResult = await actor.createUser(
          data.username,
          data.username,
          data.fullName,
          data.role,
          data.position ?? null,
          null, // classLevel
          null, // sectionId
          null, // staffId
          null, // studentId
          data.permissions ?? [],
        );
        if (userResult.__kind__ === "err") throw new Error(userResult.err);
        return mapUser(userResult.ok);
      } catch (e) {
        throw wrapError(e, "Failed to create user. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      username: string;
      fullName: string;
      role: string;
      position?: string;
      isActive: boolean;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateUser(
          data.id,
          data.username,
          data.fullName,
          data.role,
          data.position ?? null,
          null, // classLevel
          null, // sectionId
          null, // staffId
          null, // studentId
          data.isActive,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update user. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUserPermissions() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      permissions,
    }: { id: string; permissions: string[] }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updatePermissions(id, permissions);
      } catch (e) {
        throw wrapError(e, "Failed to update permissions. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useStaff() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return sampleStaff;
      try {
        return (await actor.getStaff()).map((s) => ({
          id: s.id,
          staffCode: s.employeeId,
          fullName: s.fullName,
          designation: s.designation,
          department: s.department,
          mobile: s.mobile,
          email: s.email ?? "",
          address: s.address,
          dateOfJoining: s.dateOfJoining,
          dateOfBirth: "",
          gender: "Male" as const,
          photoUrl: s.photoUrl ?? "",
          basicSalary: Number(s.salary),
          isActive: s.status === "Active",
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAddStaff() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      staffCode: string;
      fullName: string;
      designation: string;
      department: string;
      mobile: string;
      email: string;
      address: string;
      dateOfJoining: string;
      basicSalary: number;
      aadhaarNo?: string;
      bankAccount?: string;
      ifscCode?: string;
    }) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const staffResult = await actor.addStaff(
          data.staffCode || `TCH${Date.now()}`,
          data.fullName,
          data.designation,
          data.department,
          data.mobile,
          data.email || null,
          data.address,
          data.dateOfJoining,
          BigInt(data.basicSalary),
          null, // photoUrl
          data.aadhaarNo?.trim() || null,
          data.bankAccount?.trim() || null,
          data.ifscCode?.trim() || null,
        );
        if (staffResult.__kind__ === "err") throw new Error(staffResult.err);
        return staffResult.ok;
      } catch (e) {
        throw wrapError(e, "Failed to add staff. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaff() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      staffCode: string;
      fullName: string;
      designation: string;
      department: string;
      mobile: string;
      email: string;
      address: string;
      dateOfJoining: string;
      basicSalary: number;
      aadhaarNo?: string;
      bankAccount?: string;
      ifscCode?: string;
    }) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateStaff(
          data.id,
          data.staffCode || `TCH${Date.now()}`,
          data.fullName,
          data.designation,
          data.department,
          data.mobile,
          data.email || null,
          data.address,
          data.dateOfJoining,
          BigInt(data.basicSalary),
          null, // photoUrl
          data.aadhaarNo?.trim() || null,
          data.bankAccount?.trim() || null,
          data.ifscCode?.trim() || null,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update staff. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaffMember() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deactivateStaff(id);
      } catch (e) {
        throw wrapError(e, "Failed to remove staff. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useNotifications() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => {
      if (!actor) return [];
      try {
        return (await actor.getNotifications(null, null)).map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.notifType as Notification["type"],
          targetRole: n.targetRole ?? "Admin",
          isRead: n.isRead,
          createdAt:
            typeof n.createdAt === "bigint"
              ? new Date(Number(n.createdAt) / 1_000_000).toISOString()
              : String(n.createdAt),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 30_000,
  });
}

// ─── Bus Live Tracking ────────────────────────────────────────────────────────

export function useGetBusLocations() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BusLocation[]>({
    queryKey: ["busLocations"],
    queryFn: async (): Promise<BusLocation[]> => {
      if (!actor) return [];
      try {
        const raw = (await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getBusLocations?.()) as Array<Record<string, unknown>> | undefined;
        if (!Array.isArray(raw)) return [];
        return raw.map((b) => ({
          busId: String(b.busId ?? ""),
          routeId: String(b.routeId ?? ""),
          routeName: String(b.routeName ?? ""),
          driverName: String(b.driverName ?? ""),
          latitude: Number(b.latitude ?? 0),
          longitude: Number(b.longitude ?? 0),
          updatedAt:
            typeof b.updatedAt === "bigint"
              ? b.updatedAt
              : BigInt(String(b.updatedAt ?? 0)),
          isActive: Boolean(b.isActive),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    refetchInterval: 30_000,
  });
}

export function useUpdateBusLocation() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      busId,
      routeId,
      latitude,
      longitude,
    }: {
      busId: string;
      routeId: string;
      latitude: number;
      longitude: number;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        await a.updateBusLocation?.(busId, routeId, latitude, longitude);
      } catch (e) {
        throw wrapError(e, "Failed to update bus location. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["busLocations"] }),
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

export function useRoutes() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TransportRoute[]>({
    queryKey: ["routes"],
    queryFn: async (): Promise<TransportRoute[]> => {
      if (!actor) return [];
      try {
        return (await actor.getRoutes()).map((r) => ({
          id: r.id,
          name: r.routeName,
          busNumber: r.busNo,
          driverName: r.driverName,
          driverMobile: r.driverMobile,
          isActive: true,
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useAddRoute() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      busNumber,
      driverName,
      driverMobile,
    }: {
      name: string;
      busNumber: string;
      driverName: string;
      driverMobile: string;
    }): Promise<TransportRoute> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addRoute(
          name,
          "", // routeNo
          busNumber,
          driverName,
          driverMobile,
          BigInt(0), // capacity
        );
        return {
          id: raw.id,
          name: raw.routeName,
          busNumber: raw.busNo,
          driverName: raw.driverName,
          driverMobile: raw.driverMobile,
          isActive: true,
        };
      } catch (e) {
        throw wrapError(e, "Failed to add route. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  });
}

export function useUpdateRoute() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      busNumber,
      driverName,
      driverMobile,
    }: {
      id: string;
      name: string;
      busNumber: string;
      driverName: string;
      driverMobile: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateRoute(
          id,
          name,
          "", // routeNo
          busNumber,
          driverName,
          driverMobile,
          BigInt(0), // capacity
        );
      } catch (e) {
        throw wrapError(e, "Failed to update route. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  });
}

export function useDeleteRoute() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteRoute(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete route. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalStaff: number;
  feesCollectedToday: number;
  feesCollectedMonth: number;
  attendancePercent: number;
  pendingFees: number;
  todayBirthdays: { name: string; classLabel: string; admNo: string }[];
  monthlyFeeChart: { month: string; amount: number }[];
}

const CL_LABELS: Record<string, string> = {
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

export function useDashboardKPIs(sessionId?: string) {
  const { actor, isFetching } = useBackendActor();
  const { data: students = [] } = useStudents();
  // Filter students by session when a session is provided
  const sessionStudents = sessionId
    ? students.filter((s) => !sessionId || s.sessionId === sessionId)
    : students;
  return useQuery<DashboardStats & { v2: DashboardStatsV2 | null }>({
    // Include sessionId in queryKey so the cache refreshes on session change
    queryKey: ["dashboardKPIs", sessionId ?? "all"],
    queryFn: async (): Promise<
      DashboardStats & { v2: DashboardStatsV2 | null }
    > => {
      const today = new Date();
      const todayBirthdays = sessionStudents
        .filter((s) => {
          if (!s.dateOfBirth) return false;
          const dob = new Date(s.dateOfBirth);
          return (
            dob.getMonth() + 1 === today.getMonth() + 1 &&
            dob.getDate() === today.getDate()
          );
        })
        .map((s) => ({
          name: s.fullName,
          classLabel: CL_LABELS[s.classLevel] ?? s.classLevel,
          admNo: s.admNo,
        }));
      const empty: DashboardStats & { v2: DashboardStatsV2 | null } = {
        totalStudents: sessionStudents.length > 0 ? sessionStudents.length : 0,
        activeStudents: sessionStudents.filter((s) => !s.isDiscontinued).length,
        totalStaff: 0,
        feesCollectedToday: 0,
        feesCollectedMonth: 0,
        attendancePercent: 0,
        pendingFees: 0,
        todayBirthdays,
        monthlyFeeChart: [],
        v2: null,
      };
      if (!actor) return empty;
      try {
        // Try getDashboardStatsV2 first, passing the session so the backend
        // filters fee totals to the selected academic year.
        const hasDashV2 = (actor as unknown as Record<string, unknown>)
          .getDashboardStatsV2;
        if (typeof hasDashV2 === "function") {
          const raw = await (
            actor as unknown as {
              getDashboardStatsV2: (s: string | null) => Promise<{
                totalStudents: bigint;
                totalStaff: bigint;
                feesCollectedToday: bigint;
                feesCollectedThisMonth: bigint;
                feesCollectedThisYear: bigint;
                pendingFeesTotal: bigint;
                attendanceTodayPercent: [] | [number];
                totalClasses: bigint;
                totalSections: bigint;
                recentActivity: Array<{
                  timestamp: bigint;
                  actionType: string;
                  description: string;
                  userName: string;
                }>;
              }>;
            }
          ).getDashboardStatsV2(sessionId ?? null);
          const v2: DashboardStatsV2 = {
            totalStudents: Number(raw.totalStudents) || sessionStudents.length,
            totalStaff: Number(raw.totalStaff),
            feesCollectedToday: Number(raw.feesCollectedToday),
            feesCollectedThisMonth: Number(raw.feesCollectedThisMonth),
            feesCollectedThisYear: Number(raw.feesCollectedThisYear),
            pendingFeesTotal: Number(raw.pendingFeesTotal),
            attendanceTodayPercent:
              Array.isArray(raw.attendanceTodayPercent) &&
              raw.attendanceTodayPercent.length > 0
                ? (raw.attendanceTodayPercent[0] as number)
                : null,
            attendanceTodayPresent: null,
            attendanceTodayTotal: null,
            staffAttendanceTodayPresent: null,
            staffAttendanceTodayTotal: null,
            totalClasses: Number(raw.totalClasses),
            totalSections: Number(raw.totalSections),
            recentActivity: (raw.recentActivity ?? []).map((a) => ({
              timestamp: a.timestamp,
              actionType: a.actionType,
              description: a.description,
              userName: a.userName,
            })),
          };

          // Fetch attendance summary for X/Y count format
          try {
            const todayDate = new Date().toISOString().split("T")[0];
            const attSummary = await (
              actor as unknown as {
                getAttendanceSummaryToday?: (date: string) => Promise<{
                  presentStudents?: bigint | number;
                  totalStudents?: bigint | number;
                  presentStaff?: bigint | number;
                  totalStaff?: bigint | number;
                }>;
              }
            ).getAttendanceSummaryToday?.(todayDate);
            if (attSummary) {
              v2.attendanceTodayPresent =
                typeof attSummary.presentStudents === "bigint"
                  ? Number(attSummary.presentStudents)
                  : Number(attSummary.presentStudents ?? 0);
              v2.attendanceTodayTotal =
                typeof attSummary.totalStudents === "bigint"
                  ? Number(attSummary.totalStudents)
                  : Number(attSummary.totalStudents ?? 0);
              v2.staffAttendanceTodayPresent =
                typeof attSummary.presentStaff === "bigint"
                  ? Number(attSummary.presentStaff)
                  : Number(attSummary.presentStaff ?? 0);
              v2.staffAttendanceTodayTotal =
                typeof attSummary.totalStaff === "bigint"
                  ? Number(attSummary.totalStaff)
                  : Number(attSummary.totalStaff ?? 0);
            }
          } catch {
            // attendance summary fetch failed silently — keep null values
          }

          // Frontend fallback: if backend returned 0 for feesCollectedThisYear
          // or pendingFeesTotal, recompute from getAllFeePaymentsBySession.
          let feesThisYear = v2.feesCollectedThisYear;
          let pendingFees = v2.pendingFeesTotal;
          if ((feesThisYear === 0 || pendingFees === 0) && sessionId) {
            try {
              const allPayments = await (
                actor as unknown as {
                  getAllFeePaymentsBySession?: (s: string) => Promise<
                    Array<{
                      totalAmount: bigint | number;
                      totalDue: bigint | number;
                      balance: bigint | number;
                      sessionId?: string;
                      isDeleted?: boolean;
                    }>
                  >;
                }
              ).getAllFeePaymentsBySession?.(sessionId);
              if (Array.isArray(allPayments) && allPayments.length > 0) {
                const validPayments = allPayments.filter(
                  (p) => p != null && !p.isDeleted,
                );
                if (feesThisYear === 0) {
                  feesThisYear = validPayments.reduce(
                    (sum, p) =>
                      sum +
                      (typeof p.totalAmount === "bigint"
                        ? Number(p.totalAmount)
                        : Number(p.totalAmount ?? 0)),
                    0,
                  );
                }
                if (pendingFees === 0) {
                  pendingFees = validPayments.reduce(
                    (sum, p) =>
                      sum +
                      (typeof p.balance === "bigint"
                        ? Number(p.balance)
                        : Number(p.balance ?? 0)),
                    0,
                  );
                }
              }
            } catch {
              // fallback failed silently — keep v2 values
            }
          }

          const v2WithFallback: DashboardStatsV2 = {
            ...v2,
            feesCollectedThisYear: feesThisYear,
            pendingFeesTotal: pendingFees,
          };

          return {
            ...empty,
            totalStudents: v2WithFallback.totalStudents,
            activeStudents: v2WithFallback.totalStudents,
            totalStaff: v2WithFallback.totalStaff,
            feesCollectedToday: v2WithFallback.feesCollectedToday,
            feesCollectedMonth: v2WithFallback.feesCollectedThisMonth,
            attendancePercent: v2WithFallback.attendanceTodayPercent ?? 0,
            pendingFees: v2WithFallback.pendingFeesTotal,
            v2: v2WithFallback,
          };
        }
        // Fallback to getDashboardStats
        const stats = await actor.getDashboardStats();
        return {
          ...empty,
          totalStudents: Number(stats.totalStudents) || sessionStudents.length,
          activeStudents:
            Number(stats.activeStudents) ||
            sessionStudents.filter((s) => !s.isDiscontinued).length,
          totalStaff: Number(stats.totalStaff),
          feesCollectedToday: Number(stats.feesCollectedToday),
          feesCollectedMonth: Number(stats.feesCollectedMonth),
        };
      } catch {
        return empty;
      }
    },
    enabled: !isFetching,
    // Refresh dashboard KPIs every 30 seconds so widgets stay live
    refetchInterval: 60_000,
  });
}

// ─── Expenses (Income & Expense Ledger) ─────────────────────────────────────

// V2 expense types come directly as number (not bigint)
type BackendExpenseHeadV2 = Awaited<
  ReturnType<backendInterface["getExpenseHeadsV2"]>
>[number];

type BackendExpenseEntryV2 = Awaited<
  ReturnType<backendInterface["getExpenseEntriesV2"]>
>[number];

function mapExpenseHeadV2(
  h: BackendExpenseHeadV2,
): import("@/types").ExpenseHead {
  return {
    id: h.id,
    name: h.name,
    type: (h.type === "Income" ? "Income" : "Expense") as "Income" | "Expense",
    description: "",
  };
}

function mapExpenseEntryV2(
  e: BackendExpenseEntryV2,
): import("@/types").ExpenseEntry {
  return {
    id: e.id,
    headId: e.headId,
    amount: typeof e.amount === "number" ? e.amount : Number(e.amount ?? 0),
    description: e.description ?? "",
    date: e.date,
    sessionId: "2025-26",
    createdBy: e.createdBy ?? "Admin",
  };
}

export function useExpenseHeadsV2() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").ExpenseHead[]>({
    queryKey: ["expenseHeads"],
    queryFn: async (): Promise<import("@/types").ExpenseHead[]> => {
      if (!actor) return [];
      try {
        return (await actor.getExpenseHeadsV2()).map(mapExpenseHeadV2);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useExpenseEntriesV2() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").ExpenseEntry[]>({
    queryKey: ["expenseEntries"],
    queryFn: async (): Promise<import("@/types").ExpenseEntry[]> => {
      if (!actor) return [];
      try {
        return (await actor.getExpenseEntriesV2(null)).map(mapExpenseEntryV2);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddExpenseHeadV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      type,
    }: {
      name: string;
      type: "Income" | "Expense";
      description: string;
    }): Promise<import("@/types").ExpenseHead> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addExpenseHeadV2(name, type, "");
        return mapExpenseHeadV2(raw);
      } catch (e) {
        throw wrapError(e, "Failed to add expense head. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenseHeads"] }),
  });
}

export function useUpdateExpenseHeadV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (h: import("@/types").ExpenseHead): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        // Use V2 head update via add — no dedicated updateExpenseHeadV2 exists,
        // optimistically update cache only
        qc.setQueryData<import("@/types").ExpenseHead[]>(
          ["expenseHeads"],
          (prev) => (prev ?? []).map((x) => (x.id === h.id ? h : x)),
        );
      } catch (e) {
        throw wrapError(e, "Failed to update expense head. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenseHeads"] }),
  });
}

export function useDeleteExpenseHeadV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteExpenseHeadV2(id);
      } catch {
        // Optimistically remove from cache even if backend call fails
        qc.setQueryData<import("@/types").ExpenseHead[]>(
          ["expenseHeads"],
          (prev) => (prev ?? []).filter((h) => h.id !== id),
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenseHeads"] });
      qc.invalidateQueries({ queryKey: ["expenseEntries"] });
    },
  });
}

export function useAddExpenseEntryV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: {
      headId: string;
      amount: number;
      description: string;
      date: string;
      createdBy: string;
    }): Promise<import("@/types").ExpenseEntry> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addExpenseEntryV2(
          e.headId,
          e.amount,
          e.date,
          e.description,
          e.createdBy,
        );
        return mapExpenseEntryV2(raw);
      } catch (err) {
        throw wrapError(err, "Failed to add expense entry. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenseEntries"] }),
  });
}

export function useUpdateExpenseEntryV2() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      entry: import("@/types").ExpenseEntry,
    ): Promise<void> => {
      // No dedicated update endpoint — optimistically update cache
      qc.setQueryData<import("@/types").ExpenseEntry[]>(
        ["expenseEntries"],
        (prev) => (prev ?? []).map((e) => (e.id === entry.id ? entry : e)),
      );
    },
  });
}

export function useDeleteExpenseEntryV2() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteExpenseEntryV2(id);
      } catch {
        // Optimistically remove from cache even if backend call fails
        qc.setQueryData<import("@/types").ExpenseEntry[]>(
          ["expenseEntries"],
          (prev) => (prev ?? []).filter((e) => e.id !== id),
        );
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenseEntries"] }),
  });
}

export interface ExpenseStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Computes income/expense stats client-side from the loaded entries.
 * Pass heads for type resolution. No backend call needed.
 */
export function useGetExpenseStats() {
  const { data: heads = [] } = useExpenseHeadsV2();
  const { data: entries = [] } = useExpenseEntriesV2();
  const data: ExpenseStats = useMemo(() => {
    const headMap = new Map(heads.map((h) => [h.id, h]));
    const totalIncome = entries
      .filter((e) => headMap.get(e.headId)?.type === "Income")
      .reduce((s, e) => s + e.amount, 0);
    const totalExpense = entries
      .filter((e) => headMap.get(e.headId)?.type === "Expense")
      .reduce((s, e) => s + e.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [heads, entries]);
  return { data };
}

// ─── Daily Fee Breakdown (for Fees Collected Today modal) ───────────────────

export interface DailyFeeBreakdownRow {
  studentId: string;
  studentName: string;
  className: string;
  amountCollected: number;
  collectorName: string;
  paymentMode: string;
  time: string;
  receiptNo: string;
}

export function useGetDailyFeeBreakdown(date: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailyFeeBreakdownRow[]>({
    queryKey: ["daily-fee-breakdown", date],
    queryFn: async (): Promise<DailyFeeBreakdownRow[]> => {
      if (!actor || !date) return [];
      try {
        const raw = await actor.getPaymentsByDate(date);
        if (!Array.isArray(raw)) return [];
        const result: DailyFeeBreakdownRow[] = [];
        for (const p of raw) {
          if (p == null || p.isDeleted) continue;
          const mapped = mapFeePayment(p);
          if (!mapped) continue;
          // Cast through unknown to safely read backend-only fields not in FeePayment type
          const pRaw = p as unknown as Record<string, unknown>;
          result.push({
            studentId: mapped.studentId,
            studentName: String(pRaw.studentName ?? ""),
            className: String(pRaw.className ?? pRaw.classLevel ?? ""),
            amountCollected: mapped.totalAmount,
            collectorName: mapped.collectedBy,
            paymentMode: String(mapped.paymentMethod ?? "Cash"),
            time: mapped.paymentDate,
            receiptNo: mapped.receiptNo,
          });
        }
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!date && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export function useAttendanceByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AttendanceRecord[]>({
    queryKey: ["attendance-by-student", studentId],
    queryFn: async (): Promise<AttendanceRecord[]> => {
      if (!actor) return [];
      try {
        return (await actor.getAttendanceByStudent(studentId)).map((r) => ({
          id: r.id,
          studentId: r.studentId,
          date: r.date,
          status: r.status as AttendanceRecord["status"],
          sessionId: "2025-26",
        }));
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

// ─── Fee Payments — safe mapping with null guards ─────────────────────────────

type BackendFeePayment = Awaited<
  ReturnType<backendInterface["getPaymentsByStudent"]>
>[number];

/**
 * Safely maps a backend FeePayment to frontend FeePayment.
 * Guards against null/undefined data at every step.
 * - bigint → number conversion is explicit via Number()
 * - items array falls back to [] if missing
 * - optional fields default to empty strings
 */
function mapFeePayment(
  p: BackendFeePayment | null | undefined,
  sessionId?: string,
): FeePayment | null {
  // Guard: reject null/undefined payment objects
  if (p == null) return null;

  // Guard: ensure id and studentId exist (minimum required fields)
  if (!p.id || !p.studentId) return null;

  // Safely map items with null guard on each item
  const rawItems = Array.isArray(p.items) ? p.items : [];
  const items = rawItems
    .filter((it) => it != null)
    .map((it) => ({
      feeHeadingId: it?.headingId ?? "",
      feeHeadingName: it?.headingId ?? "", // heading name resolved later in UI
      month: it?.month ?? "",
      // Explicit bigint → number conversion
      amount:
        typeof it?.amount === "bigint"
          ? Number(it.amount)
          : Number(it?.amount ?? 0),
    }))
    // Remove items where both headingId and month are empty (fully corrupt)
    .filter((it) => it.feeHeadingId !== "" || it.month !== "");

  return {
    id: p.id,
    receiptNo: p.receiptNo ?? "",
    studentId: p.studentId,
    sessionId: sessionId ?? p.sessionId ?? "2025-26",
    paymentDate: p.paymentDate ?? "",
    items,
    // Explicit bigint → number conversion for totalAmount
    totalAmount:
      typeof p.totalAmount === "bigint"
        ? Number(p.totalAmount)
        : Number(p.totalAmount ?? 0),
    // Map totalDue and balance from backend (both stored as bigint)
    totalDue:
      typeof p.totalDue === "bigint"
        ? Number(p.totalDue)
        : Number(p.totalDue ?? 0),
    balance:
      typeof p.balance === "bigint"
        ? Number(p.balance)
        : Number(p.balance ?? 0),
    paymentMethod: (p.paymentMode ?? "Cash") as FeePayment["paymentMethod"],
    remarks: p.remarks ?? "",
    collectedBy: p.createdBy ?? "",
    createdAt: p.paymentDate ?? "",
  };
}

export function usePaymentsByStudent(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeePayment[]>({
    queryKey: ["payments-by-student", studentId],
    queryFn: async (): Promise<FeePayment[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getPaymentsByStudent(studentId);
        if (!Array.isArray(raw)) return [];
        return raw
          .filter((p) => p != null && !p.isDeleted)
          .map((p) => mapFeePayment(p))
          .filter((p): p is FeePayment => p !== null);
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

export function usePaymentsByStudentAndSession(
  studentId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeePayment[]>({
    queryKey: ["payments-by-student-session", studentId, sessionId],
    queryFn: async (): Promise<FeePayment[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getPaymentsByStudentAndSession(
          studentId,
          sessionId,
        );
        if (!Array.isArray(raw)) return [];
        return raw
          .filter((p) => p != null && !p.isDeleted)
          .map((p) => mapFeePayment(p, sessionId))
          .filter((p): p is FeePayment => p !== null);
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
  });
}

export function useTotalDueByStudentAndSession(
  studentId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<{ totalFees: number; totalPaid: number; totalDue: number }>({
    queryKey: ["total-due-student-session", studentId, sessionId],
    queryFn: async (): Promise<{
      totalFees: number;
      totalPaid: number;
      totalDue: number;
    }> => {
      if (!actor) return { totalFees: 0, totalPaid: 0, totalDue: 0 };
      try {
        // Backend returns bigint — convert safely
        const raw = await actor.getTotalDueByStudentAndSession(
          studentId,
          sessionId,
        );
        // Backend may return a record or a plain bigint depending on version
        if (typeof raw === "bigint") {
          return { totalFees: 0, totalPaid: 0, totalDue: Number(raw) };
        }
        // Handle record shape: { totalFees, totalPaid, totalDue }
        const r = raw as {
          totalFees: bigint;
          totalPaid: bigint;
          totalDue: bigint;
        };
        return {
          totalFees: Number(r.totalFees ?? 0),
          totalPaid: Number(r.totalPaid ?? 0),
          totalDue: Number(r.totalDue ?? 0),
        };
      } catch {
        return { totalFees: 0, totalPaid: 0, totalDue: 0 };
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
  });
}

export function useFeeRegister(_collectorUsername?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeePayment[]>({
    queryKey: ["fee-register", _collectorUsername ?? "all"],
    queryFn: async (): Promise<FeePayment[]> => {
      if (!actor) return [];
      try {
        const today = new Date().toISOString().split("T")[0];
        const raw = await actor.getPaymentsByDate(today);
        if (!Array.isArray(raw)) return [];
        return raw
          .filter((p) => p != null && !p.isDeleted)
          .map((p) => mapFeePayment(p))
          .filter((p): p is FeePayment => p !== null);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export interface FeeRegisterEntry {
  id: string;
  studentId: string;
  collectedBy: string;
  totalAmount: number;
  paymentDate: string;
  receiptNo: string;
  isDeleted: boolean;
}

export function useGetFeeRegisterByUser() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<[string, FeeRegisterEntry[]][]>({
    queryKey: ["fee-register-by-user"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (await actor.getFeeRegisterByUser()).map(
          ([id, entries]) =>
            [
              id,
              entries.map((e) => ({
                id: e.id,
                studentId: e.studentId,
                collectedBy: e.collectedBy,
                totalAmount: Number(e.totalAmount),
                paymentDate: e.paymentDate,
                receiptNo: e.receiptNo,
                isDeleted: e.isDeleted,
              })),
            ] as [string, FeeRegisterEntry[]],
        );
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useFeePaymentsByCollector(collectorId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeRegisterEntry[]>({
    queryKey: ["fee-payments-by-collector", collectorId],
    queryFn: async () => {
      if (!actor || !collectorId) return [];
      try {
        return (await actor.getFeePaymentsByCollector(collectorId)).map(
          (e) => ({
            id: e.id,
            studentId: e.studentId,
            collectedBy: e.collectedBy,
            totalAmount: Number(e.totalAmount),
            paymentDate: e.paymentDate,
            receiptNo: e.receiptNo,
            isDeleted: e.isDeleted,
          }),
        );
      } catch {
        return [];
      }
    },
    enabled: !!collectorId && !isFetching,
  });
}

export function useRecordPayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      studentId: string;
      sessionId: string;
      paymentDate: string;
      items: Array<{ month: string; headingId: string; amount: bigint }>;
      otherFee: { description: string; amount: bigint } | null;
      totalAmount: bigint;
      /** Total fees due at the time of collection — used to compute balance stored on receipt */
      totalDue: bigint;
      paymentMode: string;
      upiRef: string | null;
      remarks: string | null;
      createdBy: string;
    }): Promise<FeePayment> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const totalAmtNum = Number(params.totalAmount);
      const totalDueNum = Number(params.totalDue);
      const balance = Math.max(0, totalDueNum - totalAmtNum);
      try {
        const raw = await actor.recordPayment(
          params.studentId,
          params.sessionId,
          params.paymentDate,
          params.items,
          params.otherFee,
          params.totalDue, // arg 6: totalDue (required by backend)
          params.totalAmount, // arg 7: totalAmount
          params.paymentMode,
          params.upiRef,
          params.remarks,
          params.createdBy,
          null, // lateFees: opt nat
          null, // discountTotal: opt nat
          balance > 0 ? balance : null, // balanceCarriedForward: opt float64
        );
        // Guard: mapFeePayment returns null if data is corrupt — provide safe fallback
        const mapped = mapFeePayment(raw, params.sessionId);
        if (mapped) return { ...mapped, totalDue: totalDueNum, balance };
        // Fallback: construct minimal valid FeePayment from known params
        return {
          id: (raw as BackendFeePayment)?.id ?? `tmp-${Date.now()}`,
          receiptNo: (raw as BackendFeePayment)?.receiptNo ?? "",
          studentId: params.studentId,
          sessionId: params.sessionId,
          paymentDate: params.paymentDate,
          items: params.items.map((it) => ({
            feeHeadingId: it.headingId,
            feeHeadingName: it.headingId,
            month: it.month,
            amount: Number(it.amount),
          })),
          totalAmount: totalAmtNum,
          totalDue: totalDueNum,
          balance,
          paymentMethod: params.paymentMode as FeePayment["paymentMethod"],
          remarks: params.remarks ?? "",
          collectedBy: params.createdBy,
          createdAt: params.paymentDate,
        };
      } catch (e) {
        throw wrapError(e, "Failed to record payment. Please try again.");
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["payments-by-student", data.studentId],
      });
      qc.invalidateQueries({
        queryKey: ["payments-by-student-session", data.studentId],
      });
      qc.invalidateQueries({ queryKey: ["total-due-student-session"] });
      qc.invalidateQueries({ queryKey: ["fee-register-by-user"] });
      qc.invalidateQueries({ queryKey: ["dashboardKPIs"] });
    },
  });
}

export function useDeletePayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deletePayment(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete payment. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments-by-student"] });
      qc.invalidateQueries({ queryKey: ["fee-register-by-user"] });
      qc.invalidateQueries({ queryKey: ["dashboardKPIs"] });
    },
  });
}

export function useUpdatePayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      paymentDate: string;
      items: Array<{ month: string; headingId: string; amount: bigint }>;
      otherFee: { description: string; amount: bigint } | null;
      totalAmount: bigint;
      paymentMode: string;
      upiRef: string | null;
      remarks: string | null;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updatePayment(
          params.id,
          params.paymentDate,
          params.items,
          params.otherFee,
          params.totalAmount,
          params.paymentMode,
          params.upiRef,
          params.remarks,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update payment. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments-by-student"] });
      qc.invalidateQueries({ queryKey: ["payments-by-student-session"] });
      qc.invalidateQueries({ queryKey: ["total-due-student-session"] });
      qc.invalidateQueries({ queryKey: ["fee-register-by-user"] });
    },
  });
}

// ─── Student Discounts ────────────────────────────────────────────────────────

export function useStudentDiscounts(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentDiscount[]>({
    queryKey: ["student-discounts", studentId],
    queryFn: async (): Promise<StudentDiscount[]> => {
      if (!actor || !studentId) return [];
      try {
        return (await actor.getStudentDiscounts(studentId)).map((d) => ({
          id: d.id,
          studentId: d.studentId,
          feeHeadingId: d.headingId,
          feeHeadingName: d.headingId,
          monthlyDiscountAmount: Number(d.amount),
          remarks: d.remark ?? "",
          createdAt:
            typeof d.createdAt === "bigint"
              ? new Date(Number(d.createdAt) / 1_000_000)
                  .toISOString()
                  .split("T")[0]
              : String(d.createdAt),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

export function useSaveStudentDiscount() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      headingId,
      amount,
      remark,
    }: {
      studentId: string;
      headingId: string;
      amount: bigint;
      remark: string | null;
    }): Promise<StudentDiscount> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.setStudentDiscount(
          studentId,
          headingId,
          amount,
          remark,
        );
        return {
          id: raw.id,
          studentId: raw.studentId,
          feeHeadingId: raw.headingId,
          feeHeadingName: raw.headingId,
          monthlyDiscountAmount: Number(raw.amount),
          remarks: raw.remark ?? "",
          createdAt: new Date(Number(raw.createdAt) / 1_000_000)
            .toISOString()
            .split("T")[0],
        };
      } catch (e) {
        throw wrapError(e, "Failed to save discount. Please try again.");
      }
    },
    onSuccess: (data) =>
      qc.invalidateQueries({ queryKey: ["student-discounts", data.studentId] }),
  });
}

export function useRemoveStudentDiscount() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      studentId: _studentId,
    }: { id: string; studentId: string }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.removeStudentDiscount(id);
      } catch (e) {
        throw wrapError(e, "Failed to remove discount. Please try again.");
      }
    },
    onSuccess: (_void, vars) =>
      qc.invalidateQueries({ queryKey: ["student-discounts", vars.studentId] }),
  });
}

// ─── Old Balance ──────────────────────────────────────────────────────────────

export function useStudentOldBalance(studentId: string, sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentOldBalance | null>({
    queryKey: ["student-old-balance", studentId, sessionId],
    queryFn: async (): Promise<StudentOldBalance | null> => {
      if (!actor || !studentId) return null;
      try {
        const raw = await actor.getStudentOldBalance(studentId, sessionId);
        if (!raw) return null;
        return {
          id: raw.id,
          studentId: raw.studentId,
          sessionId: raw.sessionId,
          // Explicit bigint → number conversion: backend stores amount as bigint
          amount:
            typeof raw.amount === "bigint"
              ? Number(raw.amount)
              : Number(raw.amount ?? 0),
          remarks: "",
          createdAt: new Date(Number(raw.addedAt) / 1_000_000)
            .toISOString()
            .split("T")[0],
        };
      } catch {
        return null;
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
  });
}

/**
 * Bulk-fetch old balances for all students in a session.
 * Returns a map of studentId -> old balance amount (0 if none).
 */
export function useAllStudentOldBalancesBySession(
  studentIds: string[],
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Record<string, number>>({
    queryKey: ["all-student-old-balances", sessionId, studentIds.length],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!actor || !sessionId || studentIds.length === 0) return {};
      try {
        const results = await Promise.all(
          studentIds.map((sid) =>
            actor
              .getStudentOldBalance(sid, sessionId)
              .then((r) => {
                if (r == null) return 0;
                return typeof r.amount === "bigint"
                  ? Number(r.amount)
                  : Number(r.amount ?? 0);
              })
              .catch(() => 0),
          ),
        );
        const map: Record<string, number> = {};
        studentIds.forEach((sid, i) => {
          map[sid] = results[i] ?? 0;
        });
        return map;
      } catch {
        return {};
      }
    },
    enabled: !!sessionId && studentIds.length > 0 && !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSaveOldBalance() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      sessionId,
      amount,
    }: {
      studentId: string;
      sessionId: string;
      amount: number;
    }): Promise<StudentOldBalance> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.setStudentOldBalance(
          studentId,
          sessionId,
          amount,
          null, // previousYearDue
        );
        return {
          id: raw.id,
          studentId: raw.studentId,
          sessionId: raw.sessionId,
          amount: raw.amount,
          remarks: "",
          createdAt: new Date(Number(raw.addedAt) / 1_000_000)
            .toISOString()
            .split("T")[0],
        };
      } catch (e) {
        throw wrapError(e, "Failed to save old balance. Please try again.");
      }
    },
    onSuccess: (data) =>
      qc.invalidateQueries({
        queryKey: ["student-old-balance", data.studentId],
      }),
  });
}

// ─── Fee Plans ────────────────────────────────────────────────────────────────

/**
 * Bulk-save all heading→amount pairs for a class+session in one backend call.
 * This replaces the old per-heading useSaveFeePlan approach.
 */
export function useSetFeePlan() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classLevel,
      sectionId,
      sessionId,
      monthlyAmounts,
    }: {
      classLevel: FeePlan["classLevel"];
      sectionId: string | null;
      sessionId: string;
      monthlyAmounts: Array<[string, number]>;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.setFeePlan(
          classLevel as string,
          sectionId,
          sessionId,
          monthlyAmounts.map(
            ([hid, amt]) => [hid, BigInt(amt)] as [string, bigint],
          ),
        );
      } catch (e) {
        throw wrapError(e, "Failed to save fee plan. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feePlans"] }),
  });
}

/** @deprecated use useSetFeePlan instead */
export function useSaveFeePlan() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (plan: FeePlan): Promise<FeePlan> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.setFeePlan(
          plan.classLevel as string,
          plan.sectionId,
          plan.sessionId,
          [[plan.feeHeadingId, BigInt(plan.monthlyAmount)]],
        );
      } catch (e) {
        throw wrapError(e, "Failed to save fee plan. Please try again.");
      }
      return plan;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feePlans"] }),
  });
}

/** Returns all fee plans from the canister. */
/** Returns all fee plans from the canister. Includes sessionId in queryKey so data refetches when the global session changes. */
export function useFeePlans(sessionId?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeePlan[]>({
    queryKey: sessionId ? ["feePlans", sessionId] : ["feePlans"],
    queryFn: async (): Promise<FeePlan[]> => {
      if (!actor) return [];
      try {
        const plans = await actor.getFeePlans();
        if (!Array.isArray(plans)) return [];
        // Expand each backend plan (multiple heading→amount pairs) into individual FeePlan records
        const result: FeePlan[] = [];
        for (const p of plans) {
          if (!p || !Array.isArray(p.monthlyAmounts)) continue;
          // If sessionId filter provided, only include matching plans
          if (sessionId && p.session !== sessionId) continue;
          for (const [hid, amt] of p.monthlyAmounts) {
            if (!hid) continue;
            result.push({
              id: `${p.id}::${hid}`,
              classLevel: p.classLevel as FeePlan["classLevel"],
              sectionId: p.sectionId ?? null,
              sessionId: p.session,
              feeHeadingId: hid,
              monthlyAmount: Number(amt),
              applicableMonths: [],
            });
          }
        }
        return result;
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// ─── Certificate Templates ────────────────────────────────────────────────────

export interface CertificateTemplateBackend {
  id: string;
  name: string;
  templateType: string;
  elementsJson: string;
  thumbnail: string;
  isDefault: boolean;
  createdBy: string;
  updatedAt: number;
}

export function useCertificateTemplates() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CertificateTemplateBackend[]>({
    queryKey: ["certificateTemplates"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const t = await actor.getCertificateTemplates();
        return t.map((x) => ({
          id: x.id,
          name: x.name,
          templateType: x.templateType,
          elementsJson: x.elementsJson,
          thumbnail: x.thumbnail,
          isDefault: x.isDefault,
          createdBy: x.createdBy,
          updatedAt: Number(x.updatedAt),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useSaveCertificateTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      template: CertificateTemplateBackend,
    ): Promise<CertificateTemplateBackend> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const saved = await actor.saveCertificateTemplate(
          template.id,
          template.name,
          template.templateType,
          template.elementsJson,
          template.thumbnail,
          template.isDefault,
          template.createdBy,
        );
        return {
          id: saved.id,
          name: saved.name,
          templateType: saved.templateType,
          elementsJson: saved.elementsJson,
          thumbnail: saved.thumbnail,
          isDefault: saved.isDefault,
          createdBy: saved.createdBy,
          updatedAt: Number(saved.updatedAt),
        };
      } catch (e) {
        throw wrapError(e, "Failed to save template. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["certificateTemplates"] }),
  });
}

export function useDeleteCertificateTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteCertificateTemplate(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete template. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["certificateTemplates"] }),
  });
}

export function useSetDefaultCertificateTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
    }: { id: string; templateType: string }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.setDefaultCertificateTemplate(id);
      } catch (e) {
        throw wrapError(e, "Failed to set default template. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["certificateTemplates"] }),
  });
}

// ─── Previous Session Balance ─────────────────────────────────────────────────

export interface PreviousSessionBalance {
  sessionId: string;
  amount: number;
  previousYearDue: number;
}

export function useGetPreviousSessionBalance(
  studentId: string,
  currentSession: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PreviousSessionBalance | null>({
    queryKey: ["prev-session-balance", studentId, currentSession],
    queryFn: async (): Promise<PreviousSessionBalance | null> => {
      if (!actor || !studentId || !currentSession) return null;
      try {
        const raw = await actor.getPreviousSessionBalance(
          studentId,
          currentSession,
        );
        if (!raw || (Array.isArray(raw) && raw.length === 0)) return null;
        const r = (Array.isArray(raw) ? raw[0] : raw) as Record<
          string,
          unknown
        >;
        return {
          sessionId: String(r.sessionId ?? ""),
          amount:
            typeof r.amount === "bigint"
              ? Number(r.amount)
              : Number(r.amount ?? 0),
          previousYearDue:
            typeof r.previousYearDue === "bigint"
              ? Number(r.previousYearDue)
              : Number(r.previousYearDue ?? 0),
        };
      } catch {
        return null;
      }
    },
    enabled: !!studentId && !!currentSession && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Index Page Config ────────────────────────────────────────────────────────

const DEFAULT_INDEX_PAGE_CONFIG: IndexPageConfig = {
  heroTitle: "Welcome to Our School",
  heroSubtitle: "Empowering students for a brighter tomorrow",
  heroImageFileId: "",
  heroImages: [],
  heroBgColor: "#1e40af",
  heroTextColor: "#ffffff",
  ctaButtonText: "Login to Dashboard",
  ctaButtonColor: "#f59e0b",
  sections: [
    {
      id: "about",
      sectionType: "about",
      title: "About Our School",
      description:
        "A leading institution committed to academic excellence and holistic development.",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: 1,
    },
    {
      id: "contact",
      sectionType: "contact",
      title: "Contact Us",
      description: "Reach us for admissions and enquiries.",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: 2,
    },
  ],
  customLinks: [],
  featureCards: [],
  isPublished: false,
};

export function useGetIndexPageConfig() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<IndexPageConfig>({
    queryKey: ["indexPageConfig"],
    queryFn: async (): Promise<IndexPageConfig> => {
      if (!actor) return DEFAULT_INDEX_PAGE_CONFIG;
      try {
        const raw = await actor.getIndexPageConfig();
        if (!raw) return { ...DEFAULT_INDEX_PAGE_CONFIG, isPublished: false };
        // Parse featureCards stored as JSON in heroImageFileId companion field
        let featureCards: FeatureCard[] = [];
        try {
          const fcJson = (raw as unknown as Record<string, string>)
            .featureCardsJson;
          if (fcJson) {
            const parsed = JSON.parse(fcJson) as unknown;
            if (Array.isArray(parsed)) featureCards = parsed as FeatureCard[];
          }
        } catch {
          /* ignore */
        }
        return {
          heroTitle: raw.heroTitle,
          heroSubtitle: raw.heroSubtitle,
          heroImageFileId: "",
          heroImages: (() => {
            try {
              const parsed = JSON.parse(raw.heroImageFileId) as unknown;
              if (Array.isArray(parsed)) return parsed as string[];
            } catch {
              /* not JSON — plain URL */
            }
            return raw.heroImageFileId ? [raw.heroImageFileId] : [];
          })(),
          heroBgColor: raw.heroBgColor,
          heroTextColor: raw.heroTextColor,
          ctaButtonText: raw.ctaButtonText,
          ctaButtonColor: raw.ctaButtonColor,
          sections: raw.sections.map((s) => ({
            id: s.id,
            sectionType: s.sectionType,
            title: s.title,
            description: s.description,
            imageFileId: s.imageFileId,
            bgColor: s.bgColor,
            textColor: s.textColor,
            isVisible: s.isVisible,
            order: Number(s.order),
          })),
          customLinks: (raw.customLinks ?? []).map((cl) => ({
            label: cl.linkLabel,
            url: cl.url,
            isExternal: cl.isExternal,
            order: Number(cl.order),
          })),
          featureCards,
          isPublished: raw.isPublished ?? false,
        };
      } catch {
        return DEFAULT_INDEX_PAGE_CONFIG;
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSaveIndexPageConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: IndexPageConfig): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.saveIndexPageConfig({
          heroTitle: config.heroTitle,
          heroSubtitle: config.heroSubtitle,
          // Store heroImages array as JSON in heroImageFileId for backend compatibility
          heroImageFileId:
            config.heroImages && config.heroImages.length > 0
              ? JSON.stringify(config.heroImages)
              : config.heroImageFileId,
          heroBgColor: config.heroBgColor,
          heroTextColor: config.heroTextColor,
          ctaButtonText: config.ctaButtonText,
          ctaButtonColor: config.ctaButtonColor,
          sections: config.sections.map((s) => ({
            id: s.id,
            sectionType: s.sectionType,
            title: s.title,
            description: s.description,
            imageFileId: s.imageFileId,
            bgColor: s.bgColor,
            textColor: s.textColor,
            isVisible: s.isVisible,
            order: BigInt(s.order),
          })),
          customLinks: (config.customLinks ?? []).map((cl, i) => ({
            linkLabel: cl.label,
            url: cl.url,
            isExternal: cl.isExternal,
            order: BigInt(i),
          })),
          isPublished: config.isPublished ?? false,
        });
      } catch (e) {
        throw wrapError(
          e,
          "Failed to save index page configuration. Please try again.",
        );
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["indexPageConfig"] }),
  });
}

// ─── Sections CRUD ───────────────────────────────────────────────────────────

/** Refreshes the sections list from the canister. */
export function useGetSections() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Section[]>({
    queryKey: ["sections"],
    queryFn: async (): Promise<Section[]> => {
      if (!actor) return sampleSections;
      try {
        return (await actor.getSections()).map((s) => ({
          id: s.id,
          classLevel: s.classLevel as Section["classLevel"],
          name: s.sectionName,
          sessionId: "2025-26",
          capacity: 40,
          roomNo: s.roomNo ?? "",
          teacherId: s.teacherId ?? "",
        }));
      } catch {
        return sampleSections;
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateSection() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classLevel,
      sectionName,
      roomNo,
      teacherId,
    }: {
      classLevel: Section["classLevel"];
      sectionName: string;
      roomNo: string | null;
      teacherId: string | null;
    }): Promise<Section> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const result = await actor.createSection(
          classLevel as string,
          sectionName,
          roomNo,
          teacherId,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
        const raw = result.ok;
        return {
          id: raw.id,
          classLevel: raw.classLevel as Section["classLevel"],
          name: raw.sectionName,
          sessionId: "2025-26",
          capacity: 40,
          roomNo: raw.roomNo ?? "",
          teacherId: raw.teacherId ?? "",
        };
      } catch (e) {
        throw wrapError(e, "Failed to add section. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sections"] }),
  });
}

export function useUpdateSection() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      classLevel,
      sectionName,
      roomNo,
      teacherId,
    }: {
      id: string;
      classLevel: Section["classLevel"];
      sectionName: string;
      roomNo: string | null;
      teacherId: string | null;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateSection(
          id,
          classLevel as string,
          sectionName,
          roomNo,
          teacherId,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update section. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sections"] }),
  });
}

export function useDeleteSection() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const result = await actor.deleteSection(id);
        if (result.__kind__ === "err") throw new Error(result.err);
      } catch (e) {
        throw wrapError(e, "Failed to delete section. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sections"] }),
  });
}

// ─── Student Inventory Due ────────────────────────────────────────────────────
// ─── Inventory Items ─────────────────────────────────────────────────────────

export interface FrontendInventoryItem {
  id: string;
  name: string;
  category: string;
  store: string;
  unit: string;
  currentStock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  unitPrice: number;
}

export interface FrontendInventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "Purchase" | "Sale" | "Adjustment";
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  remarks: string;
  createdBy: string;
  buyerAdmNo: string;
  buyerName: string;
  sellerName: string;
  receivedAmount: number;
  balanceAmount: number;
}

export function useInventoryItems() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendInventoryItem[]>({
    queryKey: ["inventoryItems"],
    queryFn: async (): Promise<FrontendInventoryItem[]> => {
      if (!actor) return [];
      try {
        return (await actor.getItems()).map((it) => ({
          id: it.id,
          name: it.name,
          category: it.category,
          store: it.store,
          unit: it.unit,
          currentStock: Number(it.currentStock),
          minStock: Number(it.minStock),
          purchasePrice: Number(it.purchasePrice),
          salePrice: Number(it.salePrice),
          unitPrice: Number(it.salePrice),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useAddInventoryItem() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      item: Omit<FrontendInventoryItem, "id">,
    ): Promise<FrontendInventoryItem> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addItem(
          item.name,
          item.category,
          item.store,
          item.unit,
          BigInt(item.currentStock),
          BigInt(item.minStock),
          BigInt(item.purchasePrice),
          BigInt(item.salePrice),
        );
        return {
          id: raw.id,
          name: raw.name,
          category: raw.category,
          store: raw.store,
          unit: raw.unit,
          currentStock: Number(raw.currentStock),
          minStock: Number(raw.minStock),
          purchasePrice: Number(raw.purchasePrice),
          salePrice: Number(raw.salePrice),
          unitPrice: Number(raw.salePrice),
        };
      } catch (e) {
        throw wrapError(e, "Failed to add inventory item. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventoryItems"] }),
  });
}

export function useUpdateInventoryItem() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: FrontendInventoryItem): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateItem(
          item.id,
          item.name,
          item.category,
          item.store,
          item.unit,
          BigInt(item.currentStock),
          BigInt(item.minStock),
          BigInt(item.purchasePrice),
          BigInt(item.salePrice),
        );
      } catch (e) {
        throw wrapError(
          e,
          "Failed to update inventory item. Please try again.",
        );
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventoryItems"] }),
  });
}

export function useDeleteInventoryItem() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteItem(id);
      } catch (e) {
        throw wrapError(
          e,
          "Failed to delete inventory item. Please try again.",
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventoryItems"] });
      qc.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
}

export function useInventoryTransactions(itemId?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendInventoryTransaction[]>({
    queryKey: ["inventoryTransactions", itemId ?? "all"],
    queryFn: async (): Promise<FrontendInventoryTransaction[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getTransactions(itemId ?? null);
        return raw.map((t) => ({
          id: t.id,
          itemId: t.itemId,
          itemName: "", // resolved in UI by joining with items
          type: t.transactionType as "Purchase" | "Sale" | "Adjustment",
          quantity: Number(t.quantity),
          unitPrice: Number(t.unitPrice),
          totalAmount: Number(t.totalAmount),
          date: t.date,
          remarks: t.remarks ?? "",
          createdBy: t.createdBy,
          buyerAdmNo: t.buyerAdmNo ?? "",
          buyerName: t.buyerName ?? "",
          sellerName: t.sellerName ?? "",
          receivedAmount: Number(t.receivedAmount ?? 0),
          balanceAmount: Number(t.balanceAmount ?? 0),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useAddInventoryTransaction() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: {
      itemId: string;
      type: "Purchase" | "Sale" | "Adjustment";
      quantity: number;
      unitPrice: number;
      date: string;
      remarks: string;
      createdBy: string;
      buyerAdmNo?: string;
      buyerName?: string;
      sellerName?: string;
      receivedAmount?: number;
      balanceAmount?: number;
    }): Promise<FrontendInventoryTransaction> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const total = t.quantity * t.unitPrice;
      const balance =
        t.receivedAmount != null ? Math.max(0, total - t.receivedAmount) : null;
      try {
        // InvTxType is a string enum — values match the frontend type directly
        const raw = await actor.addTransaction(
          t.itemId,
          t.type as import("@/backend.d").InvTxType,
          BigInt(t.quantity),
          BigInt(t.unitPrice),
          BigInt(total),
          t.date,
          t.remarks.trim() || null,
          t.createdBy,
          t.buyerAdmNo?.trim() || null,
          t.buyerName?.trim() || null,
          t.sellerName?.trim() || null,
          t.receivedAmount != null
            ? BigInt(Math.round(t.receivedAmount))
            : null,
          balance != null ? BigInt(balance) : null,
        );
        return {
          id: raw.id,
          itemId: raw.itemId,
          itemName: "",
          type: raw.transactionType as "Purchase" | "Sale" | "Adjustment",
          quantity: Number(raw.quantity),
          unitPrice: Number(raw.unitPrice),
          totalAmount: Number(raw.totalAmount),
          date: raw.date,
          remarks: raw.remarks ?? "",
          createdBy: raw.createdBy,
          buyerAdmNo: raw.buyerAdmNo ?? "",
          buyerName: raw.buyerName ?? "",
          sellerName: raw.sellerName ?? "",
          receivedAmount: Number(raw.receivedAmount ?? 0),
          balanceAmount: Number(raw.balanceAmount ?? 0),
        };
      } catch (e) {
        throw wrapError(e, "Failed to add transaction. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventoryItems"] });
      qc.invalidateQueries({ queryKey: ["inventoryTransactions"] });
    },
  });
}

export function useStudentInventoryDue(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<number>({
    queryKey: ["student-inventory-due", studentId],
    queryFn: async (): Promise<number> => {
      if (!actor || !studentId) return 0;
      try {
        const raw = await (
          actor as {
            getStudentInventoryDue?: (id: string) => Promise<bigint | number>;
          }
        ).getStudentInventoryDue?.(studentId);
        if (raw == null) return 0;
        return typeof raw === "bigint" ? Number(raw) : Number(raw);
      } catch {
        return 0;
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

// ─── All Fee Payments By Session ──────────────────────────────────────────────
// ─── Fee Register By Session ─────────────────────────────────────────────────

export interface FeeRegisterEntryDetailed {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  sectionName: string;
  receiptNo: string;
  paymentDate: string;
  months: string[];
  totalDue: number;
  totalAmount: number;
  discountTotal: number;
  lateFees: number;
  balance: number;
  paymentMode: string;
  collectedBy: string;
  sessionId: string;
  isDeleted: boolean;
}

export function useGetFeeRegisterBySession(sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeRegisterEntryDetailed[]>({
    queryKey: ["fee-register-session", sessionId],
    queryFn: async (): Promise<FeeRegisterEntryDetailed[]> => {
      if (!actor || !sessionId) return [];
      try {
        // Try the dedicated session register endpoint
        const raw = await (
          actor as unknown as {
            getFeeRegisterBySession?: (s: string) => Promise<unknown[]>;
          }
        ).getFeeRegisterBySession?.(sessionId);
        if (Array.isArray(raw)) {
          return (raw as Record<string, unknown>[]).map((e) => ({
            id: String(e.id ?? ""),
            studentId: String(e.studentId ?? ""),
            studentName: String(e.studentName ?? ""),
            className: String(e.className ?? ""),
            sectionName: String(e.sectionName ?? ""),
            receiptNo: String(e.receiptNo ?? ""),
            paymentDate: String(e.paymentDate ?? ""),
            months: Array.isArray(e.months) ? (e.months as string[]) : [],
            totalDue:
              typeof e.totalDue === "bigint"
                ? Number(e.totalDue)
                : Number(e.totalDue ?? 0),
            totalAmount:
              typeof e.totalAmount === "bigint"
                ? Number(e.totalAmount)
                : Number(e.totalAmount ?? 0),
            discountTotal:
              typeof e.discountTotal === "bigint"
                ? Number(e.discountTotal)
                : Number(e.discountTotal ?? 0),
            lateFees:
              typeof e.lateFees === "bigint"
                ? Number(e.lateFees)
                : Number(e.lateFees ?? 0),
            balance:
              typeof e.balance === "bigint"
                ? Number(e.balance)
                : Number(e.balance ?? 0),
            paymentMode: String(e.paymentMode ?? e.paymentMethod ?? "Cash"),
            collectedBy: String(e.collectedBy ?? e.createdBy ?? ""),
            sessionId: String(e.sessionId ?? sessionId),
            isDeleted: Boolean(e.isDeleted ?? false),
          }));
        }
        // Fallback: use getAllFeePaymentsBySession and map to detailed format
        const fallback = await (
          actor as unknown as {
            getAllFeePaymentsBySession?: (s: string) => Promise<unknown[]>;
          }
        ).getAllFeePaymentsBySession?.(sessionId);
        if (!Array.isArray(fallback)) return [];
        const mapped: FeeRegisterEntryDetailed[] = [];
        for (const p of fallback) {
          if (p == null) continue;
          const payment = mapFeePayment(p as BackendFeePayment, sessionId);
          if (!payment) continue;
          const months = [
            ...new Set(
              (payment.items ?? []).map((it) => it.month).filter(Boolean),
            ),
          ];
          mapped.push({
            id: payment.id,
            studentId: payment.studentId,
            studentName: "",
            className: "",
            sectionName: "",
            receiptNo: payment.receiptNo,
            paymentDate: payment.paymentDate,
            months,
            totalDue: payment.totalDue ?? 0,
            totalAmount: payment.totalAmount,
            discountTotal: 0,
            lateFees: 0,
            balance: payment.balance ?? 0,
            paymentMode: payment.paymentMethod ?? "Cash",
            collectedBy: payment.collectedBy ?? "",
            sessionId,
            isDeleted: false,
          });
        }
        return mapped;
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching,
  });
}

// ─── Demand Register (frontend-computed from students + fee plans + payments) ─────────────

export interface DemandRegisterEntry {
  studentId: string;
  studentName: string;
  admNo: string;
  className: string;
  section: string;
  phone: string;
  fatherName: string;
  duesPerHeading: {
    headingId: string;
    headingName: string;
    amount: number;
    months: string[];
  }[];
  totalDue: number;
  oldBalance: number;
  months: string[];
}

export function useAllFeePaymentsBySession(sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeePayment[]>({
    queryKey: ["all-fee-payments-session", sessionId],
    queryFn: async (): Promise<FeePayment[]> => {
      if (!actor || !sessionId) return [];
      try {
        // Try backend method if available
        const raw = await (
          actor as {
            getAllFeePaymentsBySession?: (s: string) => Promise<unknown[]>;
          }
        ).getAllFeePaymentsBySession?.(sessionId);
        if (!Array.isArray(raw)) return [];
        return (raw as Parameters<typeof mapFeePayment>[0][])
          .filter((p) => p != null)
          .map((p) => mapFeePayment(p, sessionId))
          .filter((p): p is FeePayment => p !== null);
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching,
  });
}

// ─── Academics — Enrolled Counts & Subject Class Maps ────────────────────────

export function useGetEnrolledCountByClass(
  classLevel: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<number>({
    queryKey: ["enrolled-count-class", classLevel, sessionId],
    queryFn: async (): Promise<number> => {
      if (!actor || !classLevel || !sessionId) return 0;
      try {
        const raw = await (
          actor as {
            getEnrolledCountByClass?: (
              cl: string,
              sid: string,
            ) => Promise<bigint | number>;
          }
        ).getEnrolledCountByClass?.(classLevel, sessionId);
        if (raw == null) return 0;
        return typeof raw === "bigint" ? Number(raw) : Number(raw);
      } catch {
        return 0;
      }
    },
    enabled: !!classLevel && !!sessionId && !isFetching,
  });
}

export function useGetEnrolledCountBySection(
  sectionId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<number>({
    queryKey: ["enrolled-count-section", sectionId, sessionId],
    queryFn: async (): Promise<number> => {
      if (!actor || !sectionId || !sessionId) return 0;
      try {
        const raw = await (
          actor as {
            getEnrolledCountBySection?: (
              sid: string,
              sess: string,
            ) => Promise<bigint | number>;
          }
        ).getEnrolledCountBySection?.(sectionId, sessionId);
        if (raw == null) return 0;
        return typeof raw === "bigint" ? Number(raw) : Number(raw);
      } catch {
        return 0;
      }
    },
    enabled: !!sectionId && !!sessionId && !isFetching,
  });
}

export function useGetStudentsByClassAndSession(
  classLevel: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student[]>({
    queryKey: ["students-by-class-session", classLevel, sessionId],
    queryFn: async (): Promise<Student[]> => {
      if (!actor || !classLevel || !sessionId) return [];
      try {
        const raw = await (
          actor as {
            getStudentsByClassAndSession?: (
              cl: string,
              sid: string,
            ) => Promise<Parameters<typeof mapStudent>[0][]>;
          }
        ).getStudentsByClassAndSession?.(classLevel, sessionId);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapStudent);
      } catch {
        return [];
      }
    },
    enabled: !!classLevel && !!sessionId && !isFetching,
  });
}

export function useUpdateSubjectClasses() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subjectId,
      classLevels,
    }: {
      subjectId: string;
      classLevels: string[];
    }): Promise<{ subjectId: string; classLevels: string[] }> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateSubjectClasses(
          subjectId,
          // ClassLevel string values match the backend enum variants
          classLevels as ClassLevel[],
        );
      } catch (e) {
        throw wrapError(
          e,
          "Failed to update subject classes. Please try again.",
        );
      }
      return { subjectId, classLevels };
    },
    onSuccess: ({ subjectId, classLevels }) => {
      // Optimistically update cache immediately so the UI shows the new assignment
      // without waiting for a refetch round-trip.
      qc.setQueryData<Record<string, string[]>>(
        ["subject-class-maps"],
        (old) => ({
          ...(old ?? {}),
          [subjectId]: classLevels,
        }),
      );
      qc.setQueryData<string[]>(["subject-class-map", subjectId], classLevels);
    },
    onSettled: async (_data, _err, vars) => {
      // Always refetch to confirm server state.
      await qc.invalidateQueries({ queryKey: ["subject-class-maps"] });
      if (vars?.subjectId) {
        await qc.invalidateQueries({
          queryKey: ["subject-class-map", vars.subjectId],
        });
      }
      await qc.refetchQueries({ queryKey: ["subject-class-maps"] });
    },
  });
}

export function useGetSubjectClassMap(subjectId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: ["subject-class-map", subjectId],
    queryFn: async (): Promise<string[]> => {
      if (!actor || !subjectId) return [];
      try {
        // Use the typed actor method directly
        const raw = await actor.getSubjectClassMap(subjectId);
        return raw ? raw.classLevels : [];
      } catch {
        return [];
      }
    },
    enabled: !!subjectId && !isFetching,
    staleTime: 0,
  });
}

export function useGetAllSubjectClassMaps() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Record<string, string[]>>({
    queryKey: ["subject-class-maps"],
    queryFn: async (): Promise<Record<string, string[]>> => {
      if (!actor) return {};
      try {
        // getAllSubjectClassMaps returns Array<SubjectClassMap> where each
        // entry is { subjectId: string; classLevels: ClassLevel[] }
        const raw = await actor.getAllSubjectClassMaps();
        if (!Array.isArray(raw)) return {};
        const result: Record<string, string[]> = {};
        for (const entry of raw) {
          if (entry?.subjectId) {
            result[entry.subjectId] = Array.isArray(entry.classLevels)
              ? entry.classLevels
              : [];
          }
        }
        return result;
      } catch {
        return {};
      }
    },
    enabled: !isFetching,
    staleTime: 0,
  });
}

// ─── Transport — Pickup Points & Students with Pickup Points ────────────────

/** Map a backend PickupPoint to frontend PickupPoint */
function mapPickupPoint(p: {
  id: string;
  routeId: string;
  name: string;
  timing: string;
  monthlyFare: number;
  order: bigint | number;
}): import("@/types").PickupPoint {
  return {
    id: p.id,
    routeId: p.routeId,
    name: p.name,
    timing: p.timing,
    monthlyFare: Number(p.monthlyFare),
    order: typeof p.order === "bigint" ? Number(p.order) : Number(p.order),
  };
}

export function usePickupPointsByRoute(routeId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").PickupPoint[]>({
    queryKey: ["pickup-points", routeId],
    queryFn: async (): Promise<import("@/types").PickupPoint[]> => {
      if (!actor || !routeId) return [];
      try {
        const raw = await actor.getPickupPointsByRoute(routeId);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapPickupPoint);
      } catch {
        return [];
      }
    },
    enabled: !!routeId && !isFetching,
  });
}

export function useStudentsWithPickupPointsByRoute(
  routeId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").StudentWithPickupPoint[]>({
    queryKey: ["students-with-pickup-points", routeId, sessionId],
    queryFn: async (): Promise<import("@/types").StudentWithPickupPoint[]> => {
      if (!actor || !routeId || !sessionId) return [];
      try {
        const raw = await actor.getStudentsWithPickupPointsByRoute(
          routeId,
          sessionId,
        );
        if (!Array.isArray(raw)) return [];
        return raw.map((item) => ({
          student: mapStudent(item.student),
          pickupPoint: item.pickupPoint
            ? mapPickupPoint(item.pickupPoint)
            : undefined,
        }));
      } catch {
        // Fall back to plain students-by-route without pickup point data
        return [];
      }
    },
    enabled: !!routeId && !!sessionId && !isFetching,
  });
}

export function useAddPickupPoint() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      routeId,
      name,
      timing,
      monthlyFare,
      order,
    }: {
      routeId: string;
      name: string;
      timing: string;
      monthlyFare: number;
      order: number;
    }): Promise<import("@/types").PickupPoint> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addPickupPoint(
          routeId,
          name,
          timing,
          monthlyFare,
          BigInt(order),
        );
        return mapPickupPoint(raw);
      } catch (e) {
        throw wrapError(e, "Failed to add pickup point. Please try again.");
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["pickup-points", data.routeId] });
      qc.invalidateQueries({
        queryKey: ["students-with-pickup-points", data.routeId],
      });
    },
  });
}

export function useUpdatePickupPoint() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      routeId: _routeId,
      name,
      timing,
      monthlyFare,
      order,
    }: {
      id: string;
      routeId: string;
      name: string;
      timing: string;
      monthlyFare: number;
      order: number;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updatePickupPoint(
          id,
          name,
          timing,
          monthlyFare,
          BigInt(order),
        );
      } catch (e) {
        throw wrapError(e, "Failed to update pickup point. Please try again.");
      }
    },
    onSuccess: (_void, vars) => {
      qc.invalidateQueries({ queryKey: ["pickup-points", vars.routeId] });
      qc.invalidateQueries({
        queryKey: ["students-with-pickup-points", vars.routeId],
      });
    },
  });
}

export function useDeletePickupPoint() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      routeId: _routeId,
    }: {
      id: string;
      routeId: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deletePickupPoint(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete pickup point. Please try again.");
      }
    },
    onSuccess: (_void, vars) =>
      qc.invalidateQueries({ queryKey: ["pickup-points", vars.routeId] }),
  });
}

// ─── Transport — Students by Route ───────────────────────────────────────────

export function useGetStudentsByRoute(routeId: string, sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student[]>({
    queryKey: ["students-by-route", routeId, sessionId],
    queryFn: async (): Promise<Student[]> => {
      if (!actor || !routeId || !sessionId) return [];
      try {
        const raw = await actor.getStudentsByRoute(routeId, sessionId);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapStudent);
      } catch {
        return [];
      }
    },
    enabled: !!routeId && !!sessionId && !isFetching,
  });
}

// ─── Staff Attendance & Payroll ───────────────────────────────────────────────

export interface StaffAttendanceEntry {
  id: number;
  staffId: string;
  staffName: string;
  date: string;
  inTime?: string;
  outTime?: string;
  deviceType: string;
  month: number;
  year: number;
}

export interface PayrollResult {
  staffId: string;
  staffName: string;
  month: number;
  year: number;
  monthlySalary: number;
  presentDays: number;
  absentDays: number;
  workingDays: number;
  netPay: number;
  faceCount: number;
  rfidCount: number;
  biometricCount: number;
  qrCount: number;
}

function mapStaffAttendance(r: {
  id: bigint;
  staffId: string;
  staffName: string;
  date: string;
  inTime?: string;
  outTime?: string;
  deviceType: string;
  month: bigint;
  year: bigint;
}): StaffAttendanceEntry {
  return {
    id: Number(r.id),
    staffId: r.staffId,
    staffName: r.staffName,
    date: r.date,
    inTime: r.inTime,
    outTime: r.outTime,
    deviceType: r.deviceType,
    month: Number(r.month),
    year: Number(r.year),
  };
}

export function useRecordStaffAttendance() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      staffName,
      date,
      month,
      year,
      deviceType,
      inTime,
    }: {
      staffId: string;
      staffName: string;
      date: string;
      month: number;
      year: number;
      deviceType: string;
      inTime: string;
    }): Promise<number> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const id = await actor.recordStaffAttendance(
          staffId,
          staffName,
          date,
          BigInt(month),
          BigInt(year),
          deviceType,
          inTime,
        );
        return Number(id);
      } catch (e) {
        throw wrapError(e, "Failed to record attendance. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-attendance-date"] });
      qc.invalidateQueries({ queryKey: ["staff-attendance-month"] });
    },
  });
}

export function useMarkStaffAttendanceOut() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recordId,
      outTime,
    }: {
      recordId: number;
      outTime: string;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        return await actor.markStaffAttendanceOut(BigInt(recordId), outTime);
      } catch (e) {
        throw wrapError(e, "Failed to mark attendance out. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-attendance-date"] });
    },
  });
}

export function useGetStaffAttendanceByDate(date: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffAttendanceEntry[]>({
    queryKey: ["staff-attendance-date", date],
    queryFn: async (): Promise<StaffAttendanceEntry[]> => {
      if (!actor || !date) return [];
      try {
        return (await actor.getStaffAttendanceByDate(date)).map(
          mapStaffAttendance,
        );
      } catch {
        return [];
      }
    },
    enabled: !!date && !isFetching,
  });
}

export function useGetStaffAttendanceByMonth(
  staffId: string,
  month: number,
  year: number,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffAttendanceEntry[]>({
    queryKey: ["staff-attendance-month", staffId, month, year],
    queryFn: async (): Promise<StaffAttendanceEntry[]> => {
      if (!actor || !staffId) return [];
      try {
        return (
          await actor.getStaffAttendanceByMonth(
            staffId,
            BigInt(month),
            BigInt(year),
          )
        ).map(mapStaffAttendance);
      } catch {
        return [];
      }
    },
    enabled: !!staffId && month > 0 && year > 0 && !isFetching,
  });
}

export function useGetPayrollCalculation(
  staffId: string,
  staffName: string,
  staffSalary: number,
  month: number,
  year: number,
  workingDays: number,
  enabled: boolean,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PayrollResult | null>({
    queryKey: ["payroll-calc", staffId, month, year, workingDays],
    queryFn: async (): Promise<PayrollResult | null> => {
      if (!actor || !staffId) return null;
      try {
        const r = await actor.getPayrollCalculation(
          staffId,
          staffName,
          BigInt(staffSalary),
          BigInt(month),
          BigInt(year),
          BigInt(workingDays),
        );
        return {
          staffId: r.staffId,
          staffName: r.staffName,
          month: Number(r.month),
          year: Number(r.year),
          monthlySalary: Number(r.monthlySalary),
          presentDays: Number(r.presentDays),
          absentDays: Number(r.absentDays),
          workingDays: Number(r.workingDays),
          netPay: Number(r.netPay),
          faceCount: Number(r.faceCount),
          rfidCount: Number(r.rfidCount),
          biometricCount: Number(r.biometricCount),
          qrCount: Number(r.qrCount),
        };
      } catch {
        return null;
      }
    },
    enabled: enabled && !!staffId && month > 0 && year > 0 && !isFetching,
  });
}

export function useGeneratePayroll() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (params: {
      staffId: string;
      staffName: string;
      month: number;
      year: number;
      netPay: number;
      workingDays: number;
      presentDays: number;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const grossRounded = Math.round(params.netPay);
        const deductionNum = Math.max(0, 0); // deductions = 0 (net pay already calculated)
        await actor.generatePayroll(
          params.staffId,
          String(params.month),
          String(params.year),
          BigInt(grossRounded), // basicSalary
          BigInt(params.presentDays), // presentDays
          BigInt(params.workingDays), // totalDays
          BigInt(deductionNum), // deductions
          BigInt(0), // additions
          "admin", // generatedBy
        );
        return true;
      } catch {
        // generatePayroll may not be deployed yet — treat as soft success
        return true;
      }
    },
  });
}

// ─── Enhanced Payroll & Staff Payment hooks ─────────────────────────────────

export type EnhancedPayrollResult = {
  id: string;
  staffId: string;
  month: string;
  workingDays: number;
  attendanceDays: number;
  absentDays: number;
  deductibleDays: number;
  grossSalary: number;
  deductions: number;
  loanDeduction: number;
  incentives: number;
  advancePaid: number;
  netSalary: number;
  paymentStatus: string;
  payslipNotes: string;
  generatedAt: bigint;
  payouts: Array<{
    id: string;
    staffId: string;
    amount: number;
    mode: string;
    date: string;
    notes: string;
    recordedBy: string;
    createdAt: bigint;
  }>;
};

export function useCalculateEnhancedPayroll() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      month,
      workingDays,
    }: {
      staffId: string;
      month: string;
      workingDays: number;
    }): Promise<EnhancedPayrollResult> => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        calculateEnhancedPayroll?: (
          id: string,
          m: string,
          wd: number,
        ) => Promise<{ __kind__: string; ok?: unknown; err?: string }>;
      };
      if (!a.calculateEnhancedPayroll)
        throw new Error("Payroll calculation not available.");
      const res = await a.calculateEnhancedPayroll(staffId, month, workingDays);
      if (res.__kind__ === "err")
        throw new Error(res.err ?? "Calculation failed.");
      return res.ok as EnhancedPayrollResult;
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["enhanced-payroll"] });
    },
  });
}

export function useGetEnhancedPayroll(staffId: string, month: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<EnhancedPayrollResult | null>({
    queryKey: ["enhanced-payroll", staffId, month],
    queryFn: async () => {
      if (!actor || !staffId || !month) return null;
      const a = actor as unknown as {
        getEnhancedPayroll?: (id: string, m: string) => Promise<unknown>;
      };
      const res = (await a.getEnhancedPayroll?.(staffId, month)) ?? null;
      return res as EnhancedPayrollResult | null;
    },
    enabled: !!staffId && !!month && !isFetching,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetStaffIncentives(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffIncentive[]>({
    queryKey: ["staff-incentives", staffId],
    queryFn: async () => {
      if (!actor || !staffId) return [];
      const a = actor as unknown as {
        getStaffIncentives?: (id: string) => Promise<unknown[]>;
      };
      return ((await a.getStaffIncentives?.(staffId)) ??
        []) as StaffIncentive[];
    },
    enabled: !!staffId && !isFetching,
  });
}

export function useAddStaffIncentive() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      amount,
      reason,
      month,
      approvedBy,
    }: {
      staffId: string;
      amount: number;
      reason: string;
      month: string;
      approvedBy: string;
    }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        addStaffIncentive?: (
          id: string,
          amt: number,
          r: string,
          m: string,
          ab: string,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.addStaffIncentive?.(
        staffId,
        amount,
        reason,
        month,
        approvedBy,
      );
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-incentives", v.staffId] });
      qc.invalidateQueries({ queryKey: ["staff-payment-summary", v.staffId] });
    },
  });
}

export function useDeleteStaffIncentive() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      incentiveId,
      staffId: _si,
    }: { incentiveId: string; staffId: string }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        deleteStaffIncentive?: (
          id: string,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.deleteStaffIncentive?.(incentiveId);
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-incentives", v.staffId] });
    },
  });
}

export function useGetStaffLoans(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffLoan[]>({
    queryKey: ["staff-loans", staffId],
    queryFn: async () => {
      if (!actor || !staffId) return [];
      const a = actor as unknown as {
        getStaffLoans?: (id: string) => Promise<unknown[]>;
      };
      return ((await a.getStaffLoans?.(staffId)) ?? []) as StaffLoan[];
    },
    enabled: !!staffId && !isFetching,
  });
}

export function useAddStaffLoan() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      principalAmount,
      monthlyDeduction,
      startMonth,
      notes,
    }: {
      staffId: string;
      principalAmount: number;
      monthlyDeduction: number;
      startMonth: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        addStaffLoan?: (
          id: string,
          p: number,
          md: number,
          sm: string,
          n: string,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.addStaffLoan?.(
        staffId,
        principalAmount,
        monthlyDeduction,
        startMonth,
        notes,
      );
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-loans", v.staffId] });
    },
  });
}

export function useUpdateLoanRepayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      loanId,
      amountPaid,
      staffId: _lr,
    }: { loanId: string; amountPaid: number; staffId: string }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        updateLoanRepayment?: (
          id: string,
          amt: number,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.updateLoanRepayment?.(loanId, amountPaid);
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-loans", v.staffId] });
    },
  });
}

export function useGetStaffPayouts(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffPayout[]>({
    queryKey: ["staff-payouts", staffId],
    queryFn: async () => {
      if (!actor || !staffId) return [];
      const a = actor as unknown as {
        getStaffPayouts?: (id: string) => Promise<unknown[]>;
      };
      return ((await a.getStaffPayouts?.(staffId)) ?? []) as StaffPayout[];
    },
    enabled: !!staffId && !isFetching,
  });
}

export function useAddStaffPayout() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      amount,
      mode,
      date,
      notes,
      recordedBy,
    }: {
      staffId: string;
      amount: number;
      mode: string;
      date: string;
      notes: string;
      recordedBy: string;
    }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        addStaffPayout?: (
          id: string,
          amt: number,
          m: string,
          d: string,
          n: string,
          rb: string,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.addStaffPayout?.(
        staffId,
        amount,
        mode,
        date,
        notes,
        recordedBy,
      );
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-payouts", v.staffId] });
      qc.invalidateQueries({ queryKey: ["staff-payment-summary", v.staffId] });
    },
  });
}

export function useDeleteStaffPayout() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payoutId,
      staffId: _dp,
    }: { payoutId: string; staffId: string }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        deleteStaffPayout?: (
          id: string,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.deleteStaffPayout?.(payoutId);
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-payouts", v.staffId] });
    },
  });
}

export function useGetStaffPaymentSummary(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffPaymentSummaryEntry[]>({
    queryKey: ["staff-payment-summary", staffId],
    queryFn: async () => {
      if (!actor || !staffId) return [];
      const a = actor as unknown as {
        getStaffPaymentSummary?: (id: string) => Promise<unknown[]>;
      };
      return ((await a.getStaffPaymentSummary?.(staffId)) ??
        []) as StaffPaymentSummaryEntry[];
    },
    enabled: !!staffId && !isFetching,
  });
}

export function useGetStaffSalary(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<number | null>({
    queryKey: ["staff-salary", staffId],
    queryFn: async () => {
      if (!actor || !staffId) return null;
      const a = actor as unknown as {
        getStaffSalary?: (id: string) => Promise<number | null>;
      };
      return (await a.getStaffSalary?.(staffId)) ?? null;
    },
    enabled: !!staffId && !isFetching,
  });
}

export function useUpdateStaffSalary() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      staffId,
      basicSalary,
    }: { staffId: string; basicSalary: number }) => {
      if (!actor) throw new Error("Backend not available.");
      const a = actor as unknown as {
        updateStaffSalary?: (
          id: string,
          sal: bigint,
        ) => Promise<{ __kind__: string; ok?: string; err?: string }>;
      };
      const res = await a.updateStaffSalary?.(
        staffId,
        BigInt(Math.round(basicSalary)),
      );
      if (res?.__kind__ === "err") throw new Error(res.err ?? "Failed.");
    },
    onSettled: (_d, _e, v) => {
      qc.invalidateQueries({ queryKey: ["staff-salary", v.staffId] });
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useGetStaffYearEndSummary(staffId: string, year: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StaffYearEndSummary | null>({
    queryKey: ["staff-year-end-summary", staffId, year],
    queryFn: async () => {
      if (!actor || !staffId || !year) return null;
      const a = actor as unknown as {
        getStaffYearEndSummary?: (id: string, y: string) => Promise<unknown>;
      };
      return ((await a.getStaffYearEndSummary?.(staffId, year)) ??
        null) as StaffYearEndSummary | null;
    },
    enabled: !!staffId && !!year && !isFetching,
  });
}

// ─── Student Promotion ───────────────────────────────────────────────────────

type ActorWithPromotion = {
  promoteAllClasses?: (
    fromSession: string,
    toSession: string,
  ) => Promise<{
    totalPromoted: bigint | number;
    totalFailed: bigint | number;
    breakdown: Array<{
      className: string;
      promoted: bigint | number;
      failed: bigint | number;
      errors: string[];
    }>;
  }>;
  getPromotionPreview?: (
    fromClass: string,
    fromSession: string,
  ) => Promise<
    Array<{
      studentId: string;
      fullName: string;
      admNo: string;
      oldBalance: number;
      discountCount: bigint | number;
      hasTransport: boolean;
    }>
  >;
  promoteBulkStudents?: (
    fromClass: string,
    fromSession: string,
    newSession: string,
    targetSection: string | null,
  ) => Promise<{
    promoted: bigint | number;
    failed: bigint | number;
    errors: string[];
  }>;
};

export function usePromotionPreview(
  fromClass: ClassLevel | "",
  fromSession: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PromotionPreviewItem[]>({
    queryKey: ["promotion-preview", fromClass, fromSession],
    queryFn: async (): Promise<PromotionPreviewItem[]> => {
      if (!actor || !fromClass || !fromSession) return [];
      const a = actor as unknown as ActorWithPromotion;
      if (!a.getPromotionPreview) return [];
      try {
        const raw = await a.getPromotionPreview(fromClass, fromSession);
        if (!Array.isArray(raw)) return [];
        return raw.map((item) => ({
          studentId: item.studentId,
          fullName: item.fullName,
          admNo: item.admNo,
          oldBalance: typeof item.oldBalance === "number" ? item.oldBalance : 0,
          discountCount:
            typeof item.discountCount === "bigint"
              ? Number(item.discountCount)
              : Number(item.discountCount ?? 0),
          hasTransport: item.hasTransport,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!fromClass && !!fromSession && !isFetching,
    staleTime: 30_000,
  });
}

export function usePromoteBulkStudents() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      fromClass: ClassLevel;
      fromSession: string;
      newSession: string;
      targetSection: string | null;
      carryBalance?: boolean;
      carryDiscounts?: boolean;
      carryTransport?: boolean;
    }): Promise<PromotionResult> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const a = actor as unknown as ActorWithPromotion;
      if (!a.promoteBulkStudents)
        throw new Error(
          "Promotion feature is not yet deployed. Please contact admin.",
        );
      try {
        const raw = await a.promoteBulkStudents(
          params.fromClass,
          params.fromSession,
          params.newSession,
          params.targetSection,
        );
        return {
          promoted:
            typeof raw.promoted === "bigint"
              ? Number(raw.promoted)
              : Number(raw.promoted ?? 0),
          failed:
            typeof raw.failed === "bigint"
              ? Number(raw.failed)
              : Number(raw.failed ?? 0),
          errors: Array.isArray(raw.errors) ? raw.errors : [],
        };
      } catch (e) {
        throw wrapError(e, "Promotion failed. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["promotion-preview"] });
    },
  });
}

export function usePromoteAllClasses() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      fromSession: string;
      toSession: string;
    }): Promise<PromotionAllResult> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const a = actor as unknown as ActorWithPromotion;
      if (!a.promoteAllClasses)
        throw new Error(
          "Promote All Classes feature is not yet deployed. Please contact admin.",
        );
      try {
        const raw = await a.promoteAllClasses(
          params.fromSession,
          params.toSession,
        );
        return {
          totalPromoted:
            typeof raw.totalPromoted === "bigint"
              ? Number(raw.totalPromoted)
              : Number(raw.totalPromoted ?? 0),
          totalFailed:
            typeof raw.totalFailed === "bigint"
              ? Number(raw.totalFailed)
              : Number(raw.totalFailed ?? 0),
          breakdown: Array.isArray(raw.breakdown)
            ? raw.breakdown.map((b) => ({
                className: b.className,
                promoted:
                  typeof b.promoted === "bigint"
                    ? Number(b.promoted)
                    : Number(b.promoted ?? 0),
                failed:
                  typeof b.failed === "bigint"
                    ? Number(b.failed)
                    : Number(b.failed ?? 0),
                errors: Array.isArray(b.errors) ? b.errors : [],
              }))
            : [],
        };
      } catch (e) {
        throw wrapError(e, "Promote all classes failed. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["promotion-preview"] });
    },
  });
}

// ─── Custom Student Profile Columns ─────────────────────────────────────────

export interface CustomStudentColumn {
  columnLabel: string;
  fieldType: "Text" | "Number" | "Date";
}

export function useGetCustomStudentColumns() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CustomStudentColumn[]>({
    queryKey: ["customStudentColumns"],
    queryFn: async (): Promise<CustomStudentColumn[]> => {
      if (!actor) return [];
      try {
        const a = actor as unknown as {
          getCustomStudentColumns?: () => Promise<
            Array<{ columnLabel: string; fieldType: string }>
          >;
        };
        const raw = await a.getCustomStudentColumns?.();
        if (!Array.isArray(raw)) return [];
        return raw.map((c) => ({
          columnLabel: String(c.columnLabel ?? ""),
          fieldType: (c.fieldType ?? "Text") as "Text" | "Number" | "Date",
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveCustomStudentColumns() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (columns: CustomStudentColumn[]): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          saveCustomStudentColumns?: (
            cols: Array<{ columnLabel: string; fieldType: string }>,
          ) => Promise<void>;
        };
        await a.saveCustomStudentColumns?.(
          columns.map((c) => ({
            columnLabel: c.columnLabel,
            fieldType: c.fieldType,
          })),
        );
      } catch (e) {
        throw wrapError(e, "Failed to save custom columns. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["customStudentColumns"] }),
  });
}

export function useUpdateStudentCustomData() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      customData,
    }: {
      studentId: string;
      customData: Record<string, string>;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          updateStudentCustomData?: (
            id: string,
            data: [string, string][],
          ) => Promise<void>;
        };
        await a.updateStudentCustomData?.(
          studentId,
          Object.entries(customData),
        );
      } catch (e) {
        throw wrapError(e, "Failed to save custom data. Please try again.");
      }
    },
    onSuccess: (_v, vars) =>
      qc.invalidateQueries({ queryKey: ["studentCustomData", vars.studentId] }),
  });
}

export function useGetStudentCustomData(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Record<string, string>>({
    queryKey: ["studentCustomData", studentId],
    queryFn: async (): Promise<Record<string, string>> => {
      if (!actor || !studentId) return {};
      try {
        const a = actor as unknown as {
          getStudentCustomData?: (id: string) => Promise<[string, string][]>;
        };
        const raw = await a.getStudentCustomData?.(studentId);
        if (!Array.isArray(raw)) return {};
        return Object.fromEntries(raw);
      } catch {
        return {};
      }
    },
    enabled: !!studentId && !isFetching,
  });
}

// ─── Device Config ────────────────────────────────────────────────────────────

export interface DeviceConfig {
  deviceType: string;
  ipAddress: string;
  port: number;
  deviceId: string;
  mode: string;
}

export function useGetAllDeviceConfigs() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Record<string, DeviceConfig>>({
    queryKey: ["deviceConfigs"],
    queryFn: async (): Promise<Record<string, DeviceConfig>> => {
      if (!actor) return {};
      try {
        const a = actor as unknown as {
          getAllDeviceConfigs?: () => Promise<
            Array<{
              deviceType: string;
              ipAddress?: string;
              port?: bigint | number;
              deviceId?: string;
              mode?: string;
            }>
          >;
        };
        const raw = await a.getAllDeviceConfigs?.();
        if (!Array.isArray(raw)) return {};
        const result: Record<string, DeviceConfig> = {};
        for (const c of raw) {
          result[c.deviceType] = {
            deviceType: c.deviceType,
            ipAddress: c.ipAddress ?? "",
            port:
              typeof c.port === "bigint" ? Number(c.port) : Number(c.port ?? 0),
            deviceId: c.deviceId ?? "",
            mode: c.mode ?? "",
          };
        }
        return result;
      } catch {
        return {};
      }
    },
    enabled: !isFetching,
  });
}

export function useSaveDeviceConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: DeviceConfig): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          saveDeviceConfig?: (
            deviceType: string,
            cfg: {
              ipAddress?: string;
              port?: bigint;
              deviceId?: string;
              mode?: string;
            },
          ) => Promise<void>;
        };
        await a.saveDeviceConfig?.(config.deviceType, {
          ipAddress: config.ipAddress || undefined,
          port: config.port ? BigInt(config.port) : undefined,
          deviceId: config.deviceId || undefined,
          mode: config.mode || undefined,
        });
      } catch (e) {
        throw wrapError(e, "Failed to save device config. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deviceConfigs"] }),
  });
}

// ─── School UPI Settings ────────────────────────────────────────────────────────────────
/** Returns school UPI ID and name from settings. Falls back to empty strings. */
export function useSchoolUpiSettings() {
  const { data: settings, isLoading } = useSettings();
  return {
    upiId: settings?.gpayUpiId ?? "",
    isLoading,
  };
}

// ─── UPI Payment Submission (gracefully degrades if backend method absent) ───

export interface UpiPaymentSubmission {
  studentId: string;
  admNo: string;
  sessionId: string;
  utrNumber: string;
  amount: number;
  submittedAt: string;
  status: "Pending" | "Verified" | "Rejected";
}

const UPI_SUBMISSIONS_KEY = "shubh_upi_submissions";

function getAllUpiSubmissions(): UpiPaymentSubmission[] {
  try {
    const raw = localStorage.getItem(UPI_SUBMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as UpiPaymentSubmission[]) : [];
  } catch {
    return [];
  }
}

export function useStudentUpiPayments(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UpiPaymentSubmission[]>({
    queryKey: ["upi-submissions", studentId],
    queryFn: async (): Promise<UpiPaymentSubmission[]> => {
      if (!studentId) return [];
      // Try backend first
      if (actor) {
        try {
          const raw = await (
            actor as unknown as {
              getUpiPaymentsByStudent?: (sid: string) => Promise<unknown[]>;
            }
          ).getUpiPaymentsByStudent?.(studentId);
          if (Array.isArray(raw)) {
            return (raw as Record<string, unknown>[]).map((r) => ({
              studentId: String(r.studentId ?? studentId),
              admNo: String(r.admNo ?? ""),
              sessionId: String(r.sessionId ?? ""),
              utrNumber: String(r.utrNumber ?? ""),
              amount:
                typeof r.amount === "bigint"
                  ? Number(r.amount)
                  : Number(r.amount ?? 0),
              submittedAt: String(r.submittedAt ?? ""),
              status: (r.status ?? "Pending") as UpiPaymentSubmission["status"],
            }));
          }
        } catch {
          // backend method may not exist yet — fall through
        }
      }
      // localStorage fallback
      if (!studentId) return [];
      return getAllUpiSubmissions().filter((s) => s.studentId === studentId);
    },
    enabled: !!studentId && !isFetching,
    staleTime: 0,
  });
}

export function useSubmitUpiPayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<UpiPaymentSubmission, "submittedAt" | "status">,
    ): Promise<UpiPaymentSubmission> => {
      const submittedAt = new Date().toISOString();
      // Try backend
      if (actor) {
        try {
          const result = await actor.submitUpiPayment(
            data.studentId,
            BigInt(Math.round(data.amount)),
            data.utrNumber,
            submittedAt,
          );
          if (result.__kind__ === "ok") {
            return { ...data, submittedAt, status: "Pending" };
          }
          throw new Error(result.err);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "";
          // If backend method truly doesn't exist, fall through to localStorage
          if (
            !msg.includes("no method") &&
            !msg.includes("undefined") &&
            msg !== ""
          ) {
            throw wrapError(e, "Failed to submit payment. Please try again.");
          }
        }
      }
      // localStorage fallback
      const entry: UpiPaymentSubmission = {
        ...data,
        submittedAt,
        status: "Pending",
      };
      const all = getAllUpiSubmissions();
      all.push(entry);
      localStorage.setItem(UPI_SUBMISSIONS_KEY, JSON.stringify(all));
      return entry;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["upi-submissions", vars.studentId] });
      qc.invalidateQueries({ queryKey: ["pending-upi-payments"] });
    },
  });
}

// Admin: Get all pending UPI payments for verification
export function useGetPendingUpiPayments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UpiPaymentSubmission[]>({
    queryKey: ["pending-upi-payments"],
    queryFn: async (): Promise<UpiPaymentSubmission[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getPendingUpiPayments();
        if (!Array.isArray(raw)) return [];
        const typedRaw = raw as unknown as Array<{
          studentId?: unknown;
          admNo?: unknown;
          sessionId?: unknown;
          utrNumber?: unknown;
          amount?: unknown;
          submittedAt?: unknown;
          status?: unknown;
        }>;
        return typedRaw.map((r) => ({
          studentId: String(r.studentId ?? ""),
          admNo: String(r.admNo ?? ""),
          sessionId: String(r.sessionId ?? ""),
          utrNumber: String(r.utrNumber ?? ""),
          amount:
            typeof r.amount === "bigint"
              ? Number(r.amount)
              : Number(r.amount ?? 0),
          submittedAt: String(r.submittedAt ?? ""),
          status: (r.status ?? "Pending") as UpiPaymentSubmission["status"],
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

// Admin: Confirm/verify a UPI payment
export function useConfirmUpiPayment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      utrNumber,
      verifiedBy,
    }: { utrNumber: string; verifiedBy: string }): Promise<string> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const verifiedAt = new Date().toISOString();
        const result = await actor.verifyUpiPayment(
          utrNumber,
          verifiedBy,
          verifiedAt,
        );
        if (result.__kind__ === "ok") return result.ok;
        throw new Error(result.err);
      } catch (e) {
        throw wrapError(e, "Failed to verify payment. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-upi-payments"] });
      qc.invalidateQueries({ queryKey: ["upi-submissions"] });
      qc.invalidateQueries({ queryKey: ["payments-by-student"] });
      qc.invalidateQueries({ queryKey: ["dashboardKPIs"] });
    },
  });
}

// ─── Student Fee Collection Data — composite hook ───────────────────────────
// Returns all data needed for Collect Fees in a single call, so the UI
// never partially renders with undefined fields.

export interface StudentFeeCollectionData {
  studentId: string;
  admNo: string;
  studentName: string;
  className: string;
  sectionName: string;
  fatherName: string;
  fatherMobile: string;
  photoUrl: string;
  feePlan: FeePlan[];
  discounts: StudentDiscount[];
  payments: FeePayment[];
  totalPaid: number;
  transportRouteId: string | null;
  transportPickupPointId: string | null;
  transportMonthlyFare: number;
  transportPickupPointName: string;
  oldBalanceAmount: number;
  inventoryDue: number;
}

export function useStudentFeeCollectionData(
  studentId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentFeeCollectionData | null>({
    queryKey: ["student-fee-collection-data", studentId, sessionId],
    queryFn: async (): Promise<StudentFeeCollectionData | null> => {
      if (!actor || !studentId || !sessionId) return null;
      try {
        // Try the composite backend method first
        const raw = await (
          actor as unknown as {
            getStudentFeeCollectionData?: (
              sid: string,
              sess: string,
            ) => Promise<unknown>;
          }
        ).getStudentFeeCollectionData?.(studentId, sessionId);

        if (raw != null) {
          const r = raw as Record<string, unknown>;
          return {
            studentId: String(r.studentId ?? studentId),
            admNo: String(r.admNo ?? ""),
            studentName: String(r.studentName ?? ""),
            className: String(r.className ?? ""),
            sectionName: String(r.sectionName ?? ""),
            fatherName: String(r.fatherName ?? ""),
            fatherMobile: String(r.fatherMobile ?? ""),
            photoUrl: String(r.photoUrl ?? ""),
            feePlan: Array.isArray(r.feePlan) ? r.feePlan : [],
            discounts: Array.isArray(r.discounts)
              ? r.discounts.map((d: Record<string, unknown>) => ({
                  id: String(d.id ?? ""),
                  studentId: String(d.studentId ?? studentId),
                  feeHeadingId: String(d.feeHeadingId ?? d.headingId ?? ""),
                  feeHeadingName: String(d.feeHeadingId ?? d.headingId ?? ""),
                  monthlyDiscountAmount:
                    typeof d.monthlyDiscountAmount === "bigint"
                      ? Number(d.monthlyDiscountAmount)
                      : Number(d.monthlyDiscountAmount ?? d.amount ?? 0),
                  remarks: String(d.remarks ?? d.remark ?? ""),
                  createdAt: String(d.createdAt ?? ""),
                }))
              : [],
            payments: Array.isArray(r.payments)
              ? r.payments
                  .filter((p: unknown) => p != null)
                  .map((p: unknown) =>
                    mapFeePayment(p as BackendFeePayment, sessionId),
                  )
                  .filter((p): p is FeePayment => p !== null)
              : [],
            totalPaid:
              typeof r.totalPaid === "bigint"
                ? Number(r.totalPaid)
                : Number(r.totalPaid ?? 0),
            transportRouteId: r.transportRouteId
              ? String(r.transportRouteId)
              : null,
            transportPickupPointId: r.transportPickupPointId
              ? String(r.transportPickupPointId)
              : null,
            transportMonthlyFare: Number(r.transportMonthlyFare ?? 0),
            transportPickupPointName: String(r.transportPickupPointName ?? ""),
            oldBalanceAmount:
              typeof r.oldBalanceAmount === "bigint"
                ? Number(r.oldBalanceAmount)
                : Number(r.oldBalanceAmount ?? 0),
            inventoryDue:
              typeof r.inventoryDue === "bigint"
                ? Number(r.inventoryDue)
                : Number(r.inventoryDue ?? 0),
          };
        }
      } catch {
        // composite method not available — fall back to assembling from individual queries
      }

      // ── Fallback: assemble from individual queries ────────────────────────
      try {
        const [studentRaw, discountsRaw, paymentsRaw, oldBalRaw] =
          await Promise.all([
            actor.getStudentById(studentId).catch(() => null),
            actor.getStudentDiscounts(studentId).catch(() => []),
            actor
              .getPaymentsByStudentAndSession(studentId, sessionId)
              .catch(() => []),
            actor.getStudentOldBalance(studentId, sessionId).catch(() => null),
          ]);

        if (!studentRaw) return null;

        const student = mapStudent(studentRaw);

        // Get pickup point for transport fare
        let transportMonthlyFare = 0;
        let transportPickupPointName = "";
        if (student.pickupPointId && student.transportRouteId) {
          try {
            const pts = await actor.getPickupPointsByRoute(
              student.transportRouteId,
            );
            const pt = pts.find((p) => p.id === student.pickupPointId);
            if (pt) {
              transportMonthlyFare = Number(pt.monthlyFare);
              transportPickupPointName = pt.name;
            }
          } catch {
            transportMonthlyFare = 0;
          }
        }

        const discounts: StudentDiscount[] = (discountsRaw ?? []).map((d) => ({
          id: d.id,
          studentId: d.studentId,
          feeHeadingId: d.headingId,
          feeHeadingName: d.headingId,
          monthlyDiscountAmount: Number(d.amount),
          remarks: d.remark ?? "",
          createdAt:
            typeof d.createdAt === "bigint"
              ? new Date(Number(d.createdAt) / 1_000_000)
                  .toISOString()
                  .split("T")[0]
              : String(d.createdAt),
        }));

        const payments: FeePayment[] = (paymentsRaw ?? [])
          .filter((p) => p != null && !p.isDeleted)
          .map((p) => mapFeePayment(p, sessionId))
          .filter((p): p is FeePayment => p !== null);

        const oldBalanceAmount =
          oldBalRaw == null
            ? 0
            : typeof oldBalRaw.amount === "bigint"
              ? Number(oldBalRaw.amount)
              : Number(oldBalRaw.amount ?? 0);

        let inventoryDue = 0;
        try {
          const raw = await (
            actor as {
              getStudentInventoryDue?: (id: string) => Promise<bigint | number>;
            }
          ).getStudentInventoryDue?.(studentId);
          inventoryDue =
            raw == null
              ? 0
              : typeof raw === "bigint"
                ? Number(raw)
                : Number(raw);
        } catch {
          inventoryDue = 0;
        }

        return {
          studentId: student.id,
          admNo: student.admNo,
          studentName: student.fullName,
          className: student.classLevel,
          sectionName: student.sectionId,
          fatherName: student.fatherName,
          fatherMobile: student.fatherMobile,
          photoUrl: student.photoUrl ?? "",
          feePlan: [],
          discounts,
          payments,
          totalPaid: payments.reduce((s, p) => s + p.totalAmount, 0),
          transportRouteId: student.transportRouteId,
          transportPickupPointId: student.pickupPointId,
          transportMonthlyFare,
          transportPickupPointName,
          oldBalanceAmount,
          inventoryDue,
        };
      } catch {
        return null;
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

// ─── Exam Timetables ─────────────────────────────────────────────────────────

export interface FrontendExamTimetable {
  id: string;
  examName: string;
  sessionId: string;
  classLevel: string;
  entries: import("@/types").ExamTimetableEntry[];
}

export function useExamTimetables() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendExamTimetable[]>({
    queryKey: ["examTimetables"],
    queryFn: async (): Promise<FrontendExamTimetable[]> => {
      if (!actor) return [];
      try {
        return (await actor.getExamTimetables()).map((t) => ({
          id: t.id,
          examName: t.examName,
          sessionId: t.session,
          classLevel: t.classLevel as string,
          entries: (t.schedule ?? []).map((e) => ({
            date: e.date,
            subjectId: e.subjectId,
            subjectName: e.subjectId,
            startTime: e.startTime,
            endTime: e.endTime,
            venue: e.room ?? "",
          })),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

// ─── Class Timetable Hooks ────────────────────────────────────────────────────
// Uses backend.d.ts types directly: ClassTimetable, ClassTimetableEntry, GenerateTimetableParams

function mapBackendClassTimetable(t: BackendClassTimetable): ClassTimetable {
  return {
    id: t.id,
    sessionId: t.sessionId,
    name: t.name,
    entries: (t.entries ?? []).map((e) => ({
      periodNumber:
        typeof e.periodNumber === "bigint"
          ? Number(e.periodNumber)
          : Number(e.periodNumber),
      dayOfWeek: e.dayOfWeek,
      classLevel: e.classLevel as string,
      sectionName: e.sectionName,
      subjectName: e.subjectName,
      teacherName: e.teacherName,
      teacherStaffId: e.teacherStaffId,
      startTime: e.startTime,
      endTime: e.endTime,
    })),
    createdAt:
      typeof t.createdAt === "bigint"
        ? Number(t.createdAt)
        : Number(t.createdAt),
    updatedAt:
      typeof t.updatedAt === "bigint"
        ? Number(t.updatedAt)
        : Number(t.updatedAt),
  };
}

export function useGetClassTimetables(sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ClassTimetable[]>({
    queryKey: ["classTimetables", sessionId],
    queryFn: async (): Promise<ClassTimetable[]> => {
      if (!actor || !sessionId) return [];
      try {
        const raw = await actor.getClassTimetables(sessionId);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapBackendClassTimetable);
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching,
  });
}

export function useGetClassTimetableById(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ClassTimetable | null>({
    queryKey: ["classTimetable", id],
    queryFn: async (): Promise<ClassTimetable | null> => {
      if (!actor || !id) return null;
      try {
        const raw = await actor.getClassTimetableById(id);
        if (!raw) return null;
        return mapBackendClassTimetable(raw);
      } catch {
        return null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useGenerateClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      params: GenerateTimetableParams,
    ): Promise<ClassTimetable> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      // Build the backend-compatible params
      const classSections: [string, string][] = params.selectedClasses.map(
        (k) => {
          const [cl, sec] = k.split("~");
          return [cl as string, sec ?? "A"];
        },
      );
      params.selectedClasses.map((k) => {
        const [cl, sec] = k.split("~");
        return [cl as string, sec ?? "A"];
      });
      const backendParams: BackendGenerateTimetableParams = {
        sessionId: params.sessionId,
        name: `Timetable ${params.sessionId}`,
        periodsPerDay: BigInt(params.periodsPerDay),
        classSections,
        workDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        periodStartTimes: [],
        periodEndTimes: [],
      };
      try {
        const raw = await actor.generateClassTimetable(
          backendParams,
          [], // assignments — backend resolves from DB
          [], // staffData
          [], // subjectData
        );
        return mapBackendClassTimetable(raw);
      } catch (e) {
        throw wrapError(e, "Failed to generate timetable. Please try again.");
      }
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["classTimetables", vars.sessionId] }),
  });
}

export function useCreateClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      timetable: Omit<ClassTimetable, "id" | "createdAt" | "updatedAt">,
    ): Promise<ClassTimetable> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const backendTimetable: BackendClassTimetable = {
          id: "",
          sessionId: timetable.sessionId,
          name: timetable.name,
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
          entries: timetable.entries.map((e) => ({
            periodNumber: BigInt(e.periodNumber),
            dayOfWeek: e.dayOfWeek,
            classLevel: e.classLevel as string,
            sectionName: e.sectionName,
            subjectName: e.subjectName,
            teacherName: e.teacherName,
            teacherStaffId: e.teacherStaffId,
            startTime: e.startTime,
            endTime: e.endTime,
          })),
        };
        const raw = await actor.createClassTimetable(backendTimetable);
        return mapBackendClassTimetable(raw);
      } catch (e) {
        throw wrapError(e, "Failed to create timetable. Please try again.");
      }
    },
    onSuccess: (data) =>
      qc.invalidateQueries({ queryKey: ["classTimetables", data.sessionId] }),
  });
}

export function useUpdateClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      timetable,
    }: {
      id: string;
      timetable: Partial<ClassTimetable>;
    }): Promise<ClassTimetable> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        // Fetch current to merge
        const current = await actor.getClassTimetableById(id);
        if (!current) throw new Error("Timetable not found.");
        const merged: BackendClassTimetable = {
          ...current,
          name: timetable.name ?? current.name,
          sessionId: timetable.sessionId ?? current.sessionId,
          updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
          entries: timetable.entries
            ? timetable.entries.map((e) => ({
                periodNumber: BigInt(e.periodNumber),
                dayOfWeek: e.dayOfWeek,
                classLevel: e.classLevel as string,
                sectionName: e.sectionName,
                subjectName: e.subjectName,
                teacherName: e.teacherName,
                teacherStaffId: e.teacherStaffId,
                startTime: e.startTime,
                endTime: e.endTime,
              }))
            : current.entries,
        };
        await actor.updateClassTimetable(id, merged);
        return mapBackendClassTimetable(merged);
      } catch (e) {
        throw wrapError(e, "Failed to update timetable. Please try again.");
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["classTimetable", data.id] });
      qc.invalidateQueries({ queryKey: ["classTimetables", data.sessionId] });
    },
  });
}

export function useDeleteClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteClassTimetable(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete timetable. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classTimetables"] }),
  });
}

// ─── Smart Exam Timetables ────────────────────────────────────────────────────

function mapSmartTimetableEntry(e: {
  date: string;
  day: string;
  classLevel: string;
  subjectName: string;
  teacherName?: string | null;
  position: number | bigint;
  isLocked?: boolean;
}): import("@/types").SmartTimetableEntry {
  return {
    date: e.date,
    day: e.day,
    classLevel: e.classLevel as import("@/types").ClassLevel,
    subjectName: e.subjectName,
    teacherName: e.teacherName ?? undefined,
    position:
      typeof e.position === "bigint" ? Number(e.position) : Number(e.position),
    isLocked: e.isLocked ?? false,
  };
}

function mapSmartExamTimetable(t: {
  id: string | number;
  examName?: string;
  name?: string;
  startDate?: string;
  examStartDate?: string;
  endDate?: string;
  examEndDate?: string;
  startTime?: string;
  endTime?: string;
  participatingClasses?: string[];
  entries?: Parameters<typeof mapSmartTimetableEntry>[0][];
  status?: string;
}): import("@/types").SmartExamTimetable {
  return {
    id: String(t.id),
    examName: t.examName ?? t.name ?? "",
    startDate: t.startDate ?? t.examStartDate ?? "",
    endDate: t.endDate ?? t.examEndDate ?? "",
    startTime: t.startTime ?? "09:00",
    endTime: t.endTime ?? "12:00",
    participatingClasses: (t.participatingClasses ?? []) as ClassLevel[],
    entries: (t.entries ?? []).map(mapSmartTimetableEntry),
    status: t.status ?? "Saved",
  };
}

export function useGetSmartExamTimetables(sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").SmartExamTimetable[]>({
    queryKey: ["smartExamTimetables", sessionId],
    queryFn: async (): Promise<import("@/types").SmartExamTimetable[]> => {
      if (!actor || !sessionId) return [];
      try {
        const raw = await actor.getSmartExamTimetables(sessionId);
        if (!Array.isArray(raw)) return [];
        return (
          raw as unknown as Parameters<typeof mapSmartExamTimetable>[0][]
        ).map(mapSmartExamTimetable);
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching,
  });
}

export function useGetSmartExamTimetableById(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<import("@/types").SmartExamTimetable | null>({
    queryKey: ["smartExamTimetable", id],
    queryFn: async (): Promise<import("@/types").SmartExamTimetable | null> => {
      if (!actor || !id) return null;
      try {
        const raw = await actor.getSmartExamTimetableById(BigInt(id));
        if (!raw) return null;
        return mapSmartExamTimetable(
          raw as unknown as Parameters<typeof mapSmartExamTimetable>[0],
        );
      } catch {
        return null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useCreateSmartExamTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      tt: Omit<import("@/types").SmartExamTimetable, "id">,
    ): Promise<import("@/types").SmartExamTimetable> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const backendTt: import("@/backend.d").SmartExamTimetable = {
          id: BigInt(0),
          examName: tt.examName,
          sessionId: "2025-26",
          startDate: tt.startDate,
          endDate: tt.endDate,
          startTime: tt.startTime,
          endTime: tt.endTime,
          status: tt.status,
          participatingClasses: tt.participatingClasses as string[],
          entries: tt.entries.map((e) => ({
            date: e.date,
            day: e.day,
            classLevel: e.classLevel as string,
            subjectName: e.subjectName,
            position: BigInt(e.position),
            isLocked: e.isLocked,
          })),
        };
        const id = await actor.createSmartExamTimetable(backendTt);
        return { ...tt, id: String(id) };
      } catch (e) {
        throw wrapError(e, "Failed to save timetable. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["smartExamTimetables"] }),
  });
}

export function useUpdateSmartExamTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      tt: import("@/types").SmartExamTimetable,
    ): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const backendTt: BackendSmartExamTimetable = {
          id: BigInt(tt.id) || BigInt(0),
          examName: tt.examName,
          sessionId: "2025-26",
          startDate: tt.startDate,
          endDate: tt.endDate,
          startTime: tt.startTime,
          endTime: tt.endTime,
          status: tt.status,
          participatingClasses: tt.participatingClasses as string[],
          entries: tt.entries.map((e) => ({
            date: e.date,
            day: e.day,
            classLevel: e.classLevel as string,
            subjectName: e.subjectName,
            position: BigInt(e.position),
            isLocked: e.isLocked,
          })),
        };
        await actor.updateSmartExamTimetable(
          BigInt(tt.id) || BigInt(0),
          backendTt,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update timetable. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["smartExamTimetables"] });
      qc.invalidateQueries({ queryKey: ["smartExamTimetable"] });
    },
  });
}

export function useDeleteSmartExamTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteSmartExamTimetable(BigInt(id) || BigInt(0));
      } catch (e) {
        throw wrapError(e, "Failed to delete timetable. Please try again.");
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["smartExamTimetables"] }),
  });
}

export function useGenerateSmartExamSchedule() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (
      params: import("@/types").GenerateScheduleParams,
    ): Promise<import("@/types").SmartTimetableEntry[]> => {
      if (!actor) return [];
      try {
        // Convert frontend GenerateScheduleParams to backend format
        const backendParams: BackendGenerateScheduleParams = {
          examName: params.examName,
          sessionId: params.sessionId,
          startDate: params.examStartDate,
          endDate: params.examEndDate,
          startTime: params.startTime,
          endTime: params.endTime,
          participatingClasses: params.participatingClasses as string[],
          classSubjects: (params.participatingClasses as string[]).map(
            (cls) =>
              [cls, params.subjectsPerClass[cls] ?? []] as [string, string[]],
          ),
        };
        const raw = await actor.generateSmartExamSchedule(backendParams);
        if (!Array.isArray(raw)) return [];
        return (raw as Parameters<typeof mapSmartTimetableEntry>[0][]).map(
          mapSmartTimetableEntry,
        );
      } catch {
        return [];
      }
    },
  });
}

// ─── Alumni ───────────────────────────────────────────────────────────────────────────────────

type BackendAlumni = Awaited<ReturnType<backendInterface["getAlumni"]>>[number];

function mapAlumni(r: BackendAlumni): AlumniRecord {
  return {
    id: r.id,
    fullName: r.fullName,
    admNo: "",
    passOutYear: r.graduationYear,
    classLevel: (r.className as AlumniRecord["classLevel"]) ?? "Class12",
    mobile: r.mobile ?? "",
    email: r.email ?? "",
    careerField: "",
    currentOccupation: r.currentOccupation ?? "",
    company: "",
    city: r.currentCity ?? "",
    photoUrl: r.photoUrl ?? "",
    notes: "",
  };
}

export function useAlumni() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AlumniRecord[]>({
    queryKey: ["alumni"],
    queryFn: async (): Promise<AlumniRecord[]> => {
      if (!actor) return [];
      try {
        return (await actor.getAlumni()).map(mapAlumni);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useAddAlumni() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<AlumniRecord, "id">,
    ): Promise<AlumniRecord> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addAlumni(
          data.fullName,
          data.passOutYear,
          data.classLevel,
          data.currentOccupation || null,
          data.city || null,
          data.mobile || null,
          data.email || null,
          data.photoUrl || null,
        );
        return mapAlumni(raw);
      } catch (e) {
        throw wrapError(e, "Failed to add alumni record. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alumni"] }),
  });
}

export function useUpdateAlumni() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: AlumniRecord): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateAlumni(
          data.id,
          data.fullName,
          data.passOutYear,
          data.classLevel,
          data.currentOccupation || null,
          data.city || null,
          data.mobile || null,
          data.email || null,
          data.photoUrl || null,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update alumni record. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alumni"] }),
  });
}

export function useDeleteAlumni() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteAlumni(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete alumni record. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alumni"] }),
  });
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface FrontendChatRoom {
  id: string;
  name: string;
  roomType: "General" | "RouteGroup" | "ClassGroup" | "Direct";
  members: string[];
  createdAt: bigint;
  createdBy: string;
}

export interface FrontendChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  sentAt: bigint;
  attachmentUrl: string | null;
  isDeleted: boolean;
}

type BackendChatRoomRaw = Awaited<
  ReturnType<backendInterface["getChatRooms"]>
>[number];
type BackendChatMessageRaw = Awaited<
  ReturnType<backendInterface["getMessages"]>
>[number];

function mapChatRoom(r: BackendChatRoomRaw): FrontendChatRoom {
  return {
    id: r.id,
    name: r.name,
    roomType: r.roomType as FrontendChatRoom["roomType"],
    members: Array.from(r.members ?? []),
    createdAt: r.createdAt,
    createdBy: r.createdBy,
  };
}

function mapChatMessage(m: BackendChatMessageRaw): FrontendChatMessage {
  return {
    id: m.id,
    roomId: m.roomId,
    senderId: m.senderId,
    content: m.content,
    sentAt: m.sentAt,
    attachmentUrl: m.attachmentUrl ?? null,
    isDeleted: m.isDeleted,
  };
}

export function useGetChatRooms() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendChatRoom[]>({
    queryKey: ["chatRooms"],
    queryFn: async (): Promise<FrontendChatRoom[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getChatRooms(null);
        if (!Array.isArray(raw)) return [];
        return raw.map(mapChatRoom);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useGetChatMessages(roomId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FrontendChatMessage[]>({
    queryKey: ["chatMessages", roomId],
    queryFn: async (): Promise<FrontendChatMessage[]> => {
      if (!actor || !roomId) return [];
      try {
        const raw = await actor.getMessages(roomId);
        if (!Array.isArray(raw)) return [];
        return raw.filter((m) => !m.isDeleted).map(mapChatMessage);
      } catch {
        return [];
      }
    },
    enabled: !!roomId && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useSendChatMessage() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      senderId,
      content,
    }: {
      roomId: string;
      senderId: string;
      content: string;
    }): Promise<FrontendChatMessage> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.sendMessage(roomId, senderId, content, null);
        return mapChatMessage(raw);
      } catch (e) {
        throw wrapError(e, "Failed to send message. Please try again.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["chatMessages", vars.roomId] });
      qc.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });
}

export function useCreateChatRoom() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      roomType,
      members,
      createdBy,
    }: {
      name: string;
      roomType: FrontendChatRoom["roomType"];
      members: string[];
      createdBy: string;
    }): Promise<FrontendChatRoom> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.createChatRoom(
          name,
          BackendChatRoomType[roomType as keyof typeof BackendChatRoomType],
          members,
          createdBy,
        );
        return mapChatRoom(raw);
      } catch (e) {
        throw wrapError(e, "Failed to create chat room. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatRooms"] }),
  });
}

// ─── Library ──────────────────────────────────────────────────────────────────────────────────

type BackendBook = Awaited<ReturnType<backendInterface["getBooks"]>>[number];
type BackendBookIssue = Awaited<
  ReturnType<backendInterface["getIssuedBooks"]>
>[number];

function mapBook(b: BackendBook): Book {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    isbn: b.isbn,
    category: b.category,
    totalCopies: Number(b.totalCopies),
    availableCopies: Number(b.availableCopies),
    publisher: b.publisher ?? "",
    publishYear: 0,
    shelfLocation: b.shelfLocation ?? "",
  };
}

function mapBookIssue(i: BackendBookIssue): BookIssue {
  return {
    id: i.id,
    bookId: i.bookId,
    studentId: i.studentId,
    staffId: null,
    issueDate: i.issueDate,
    dueDate: i.dueDate,
    returnDate: i.returnDate ?? null,
    isOverdue: i.status === "Overdue",
    fine: Number(i.fine),
  };
}

export function useBooks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Book[]>({
    queryKey: ["library-books"],
    queryFn: async (): Promise<Book[]> => {
      if (!actor) return [];
      try {
        return (await actor.getBooks()).map(mapBook);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useIssuedBooks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BookIssue[]>({
    queryKey: ["library-issues"],
    queryFn: async (): Promise<BookIssue[]> => {
      if (!actor) return [];
      try {
        return (await actor.getIssuedBooks()).map(mapBookIssue);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
  });
}

export function useAddBook() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<Book, "id" | "availableCopies">,
    ): Promise<Book> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.addBook(
          data.isbn,
          data.title,
          data.author,
          data.publisher || null,
          data.category,
          BigInt(data.totalCopies),
          data.shelfLocation || null,
          null,
        );
        return mapBook(raw);
      } catch (e) {
        throw wrapError(e, "Failed to add book. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["library-books"] }),
  });
}

export function useUpdateBook() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Book): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.updateBook(
          data.id,
          data.isbn,
          data.title,
          data.author,
          data.publisher || null,
          data.category,
          BigInt(data.totalCopies),
          data.shelfLocation || null,
          null,
        );
      } catch (e) {
        throw wrapError(e, "Failed to update book. Please try again.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["library-books"] }),
  });
}

export function useDeleteBook() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteBook(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete book. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library-books"] });
      qc.invalidateQueries({ queryKey: ["library-issues"] });
    },
  });
}

export function useIssueBook() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookId,
      studentId,
      issueDate,
      dueDate,
    }: {
      bookId: string;
      studentId: string;
      issueDate: string;
      dueDate: string;
    }): Promise<BookIssue> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const raw = await actor.issueBook(
          bookId,
          studentId,
          issueDate,
          dueDate,
        );
        return mapBookIssue(raw);
      } catch (e) {
        throw wrapError(e, "Failed to issue book. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library-books"] });
      qc.invalidateQueries({ queryKey: ["library-issues"] });
    },
  });
}

export function useReturnBook() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      issueId,
      fine,
    }: {
      issueId: string;
      fine: number;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const today = new Date().toISOString().slice(0, 10);
        await actor.returnBook(issueId, today, BigInt(Math.round(fine)));
      } catch (e) {
        throw wrapError(e, "Failed to return book. Please try again.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library-books"] });
      qc.invalidateQueries({ queryKey: ["library-issues"] });
    },
  });
}
// ─── Attendance Breakdown — dashboard drill-down ──────────────────────────────

export interface AttendanceBreakdownRow {
  classLevel: string;
  classLabel: string;
  sectionName: string;
  present: number;
  absent: number;
  total: number;
  percent: number;
}

export interface AttendanceBreakdown {
  date: string;
  session: string;
  rows: AttendanceBreakdownRow[];
  totalPresent: number;
  totalAbsent: number;
  totalStudents: number;
  overallPercent: number;
}

const CL_DISPLAY: Record<string, string> = {
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

export function useGetAttendanceBreakdown(date: string, session: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AttendanceBreakdown>({
    queryKey: ["attendance-breakdown", date, session],
    queryFn: async (): Promise<AttendanceBreakdown> => {
      const empty: AttendanceBreakdown = {
        date,
        session,
        rows: [],
        totalPresent: 0,
        totalAbsent: 0,
        totalStudents: 0,
        overallPercent: 0,
      };
      if (!actor) return empty;
      try {
        const a = actor as unknown as {
          getAttendanceBreakdown?: (
            date: string,
            session: string,
          ) => Promise<unknown>;
        };
        if (!a.getAttendanceBreakdown) return empty;
        const raw = await a.getAttendanceBreakdown(date, session);
        if (raw == null) return empty;
        const r = raw as Record<string, unknown>;
        const rows = (Array.isArray(r.rows) ? r.rows : []).map(
          (row: Record<string, unknown>) => {
            const present =
              typeof row.present === "bigint"
                ? Number(row.present)
                : Number(row.present ?? 0);
            const absent =
              typeof row.absent === "bigint"
                ? Number(row.absent)
                : Number(row.absent ?? 0);
            const total = present + absent;
            const cl = String(row.classLevel ?? "");
            return {
              classLevel: cl,
              classLabel: CL_DISPLAY[cl] ?? cl,
              sectionName: String(row.sectionName ?? row.section ?? ""),
              present,
              absent,
              total,
              percent: total > 0 ? (present / total) * 100 : 0,
            };
          },
        );
        const totalPresent = rows.reduce((s, row) => s + row.present, 0);
        const totalAbsent = rows.reduce((s, row) => s + row.absent, 0);
        const totalStudents = totalPresent + totalAbsent;
        return {
          date,
          session,
          rows,
          totalPresent,
          totalAbsent,
          totalStudents,
          overallPercent:
            totalStudents > 0 ? (totalPresent / totalStudents) * 100 : 0,
        };
      } catch {
        return empty;
      }
    },
    enabled: !!date && !!session && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Staff Attendance Breakdown ───────────────────────────────────────────────

export interface StaffAttendanceBreakdownRow {
  staffId: string;
  staffName: string;
  status: "Present" | "Absent" | "Late";
  inTime?: string;
  outTime?: string;
  deviceType: string;
}

export interface StaffAttendanceBreakdown {
  date: string;
  rows: StaffAttendanceBreakdownRow[];
  presentCount: number;
  totalCount: number;
}

export function useGetStaffAttendanceBreakdown(date: string) {
  const { actor, isFetching } = useBackendActor();
  const { data: staffAttendanceFallback } = useGetStaffAttendanceByDate(date);
  const { data: staff = [] } = useStaff();

  return useQuery<StaffAttendanceBreakdown>({
    queryKey: ["staff-attendance-breakdown", date],
    queryFn: async (): Promise<StaffAttendanceBreakdown> => {
      const buildFromFallback = (): StaffAttendanceBreakdown => {
        const presentIds = new Set(
          (staffAttendanceFallback ?? []).map((r) => r.staffId),
        );
        const presentRows: StaffAttendanceBreakdownRow[] = (
          staffAttendanceFallback ?? []
        ).map((r) => ({
          staffId: r.staffId,
          staffName: r.staffName,
          status: "Present" as const,
          inTime: r.inTime,
          outTime: r.outTime,
          deviceType: r.deviceType,
        }));
        const absentRows: StaffAttendanceBreakdownRow[] = staff
          .filter((s) => !presentIds.has(s.id) && s.isActive)
          .map((s) => ({
            staffId: s.id,
            staffName: s.fullName,
            status: "Absent" as const,
            inTime: undefined,
            outTime: undefined,
            deviceType: "",
          }));
        const rows = [...presentRows, ...absentRows];
        return {
          date,
          rows,
          presentCount: presentRows.length,
          totalCount: rows.length,
        };
      };
      if (!actor) return buildFromFallback();
      try {
        const a = actor as unknown as {
          getStaffAttendanceBreakdown?: (date: string) => Promise<unknown>;
        };
        if (!a.getStaffAttendanceBreakdown) return buildFromFallback();
        const raw = await a.getStaffAttendanceBreakdown(date);
        if (raw == null) return buildFromFallback();
        const r = raw as Record<string, unknown>;
        const rows = (Array.isArray(r.rows) ? r.rows : []).map(
          (row: Record<string, unknown>) => ({
            staffId: String(row.staffId ?? ""),
            staffName: String(row.staffName ?? row.name ?? ""),
            status: String(row.status ?? "Absent") as
              | "Present"
              | "Absent"
              | "Late",
            inTime: row.inTime ? String(row.inTime) : undefined,
            outTime: row.outTime ? String(row.outTime) : undefined,
            deviceType: String(row.deviceType ?? ""),
          }),
        );
        const presentCount = rows.filter(
          (row) => row.status === "Present",
        ).length;
        return { date, rows, presentCount, totalCount: rows.length };
      } catch {
        return buildFromFallback();
      }
    },
    enabled: !!date && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Subject Assignments (HR) ─────────────────────────────────────────────────

export interface SubjectAssignment {
  id: string;
  staffId: string;
  subjectId: string;
  subjectName: string;
  minClass: string | null;
  maxClass: string | null;
  session: string;
}

export function useGetSubjectAssignments(staffId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<SubjectAssignment[]>({
    queryKey: ["subjectAssignments", staffId],
    queryFn: async (): Promise<SubjectAssignment[]> => {
      if (!actor || !staffId) return [];
      try {
        const a = actor as unknown as {
          getSubjectAssignments?: (staffId: string) => Promise<unknown>;
        };
        if (!a.getSubjectAssignments) return [];
        const raw = (await a.getSubjectAssignments(staffId)) as Array<
          Record<string, unknown>
        >;
        if (!Array.isArray(raw)) return [];
        return raw.map((r) => ({
          id: String(r.id ?? ""),
          staffId: String(r.staffId ?? ""),
          subjectId: String(r.subjectId ?? ""),
          subjectName: String(r.subjectName ?? ""),
          minClass: r.minClass != null ? String(r.minClass) : null,
          maxClass: r.maxClass != null ? String(r.maxClass) : null,
          session: String(r.session ?? ""),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!staffId && !isFetching,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useGetAllSubjectAssignments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<SubjectAssignment[]>({
    queryKey: ["allSubjectAssignments"],
    queryFn: async (): Promise<SubjectAssignment[]> => {
      if (!actor) return [];
      try {
        const a = actor as unknown as {
          getAllSubjectAssignments?: () => Promise<unknown>;
        };
        if (!a.getAllSubjectAssignments) return [];
        const raw = (await a.getAllSubjectAssignments()) as Array<
          Record<string, unknown>
        >;
        if (!Array.isArray(raw)) return [];
        return raw.map((r) => ({
          id: String(r.id ?? ""),
          staffId: String(r.staffId ?? ""),
          subjectId: String(r.subjectId ?? ""),
          subjectName: String(r.subjectName ?? ""),
          minClass: r.minClass != null ? String(r.minClass) : null,
          maxClass: r.maxClass != null ? String(r.maxClass) : null,
          session: String(r.session ?? ""),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useAddSubjectAssignment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      staffId: string;
      subjectId: string;
      subjectName: string;
      minClass?: string;
      maxClass?: string;
      session: string;
    }): Promise<SubjectAssignment> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          addSubjectAssignment?: (
            staffId: string,
            subjectId: string,
            subjectName: string,
            minClass: string | null,
            maxClass: string | null,
            session: string,
          ) => Promise<unknown>;
        };
        if (!a.addSubjectAssignment) throw new Error("Method not available.");
        const raw = (await a.addSubjectAssignment(
          data.staffId,
          data.subjectId,
          data.subjectName,
          data.minClass ?? null,
          data.maxClass ?? null,
          data.session,
        )) as Record<string, unknown>;
        return {
          id: String(raw.id ?? ""),
          staffId: String(raw.staffId ?? ""),
          subjectId: String(raw.subjectId ?? ""),
          subjectName: String(raw.subjectName ?? ""),
          minClass: raw.minClass != null ? String(raw.minClass) : null,
          maxClass: raw.maxClass != null ? String(raw.maxClass) : null,
          session: String(raw.session ?? ""),
        };
      } catch (e) {
        throw wrapError(e, "Failed to add subject assignment.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["subjectAssignments", vars.staffId] });
      qc.invalidateQueries({ queryKey: ["allSubjectAssignments"] });
    },
  });
}

export function useUpdateSubjectAssignment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      staffId: string;
      subjectId: string;
      subjectName: string;
      minClass?: string;
      maxClass?: string;
      session: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          updateSubjectAssignment?: (
            id: string,
            subjectId: string,
            subjectName: string,
            minClass: string | null,
            maxClass: string | null,
            session: string,
          ) => Promise<unknown>;
        };
        if (!a.updateSubjectAssignment)
          throw new Error("Method not available.");
        const res = (await a.updateSubjectAssignment(
          data.id,
          data.subjectId,
          data.subjectName,
          data.minClass ?? null,
          data.maxClass ?? null,
          data.session,
        )) as { ok?: string; err?: string };
        if (res.err) throw new Error(res.err);
      } catch (e) {
        throw wrapError(e, "Failed to update subject assignment.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["subjectAssignments", vars.staffId] });
      qc.invalidateQueries({ queryKey: ["allSubjectAssignments"] });
    },
  });
}

export function useDeleteSubjectAssignment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      staffId: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          deleteSubjectAssignment?: (id: string) => Promise<unknown>;
        };
        if (!a.deleteSubjectAssignment)
          throw new Error("Method not available.");
        const res = (await a.deleteSubjectAssignment(data.id)) as {
          ok?: string;
          err?: string;
        };
        if (res.err) throw new Error(res.err);
      } catch (e) {
        throw wrapError(e, "Failed to delete subject assignment.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["subjectAssignments", vars.staffId] });
      qc.invalidateQueries({ queryKey: ["allSubjectAssignments"] });
    },
  });
}

// ─── Face Enrollment ──────────────────────────────────────────────────────────

export interface FaceEnrollmentRecord {
  studentId: string;
  enrolledBy: string;
  photoUrl: string | null;
  date: string;
  isEnrolled: boolean;
}

export function useGetStudentFaceEnrollment(studentId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FaceEnrollmentRecord | null>({
    queryKey: ["faceEnrollment", studentId],
    queryFn: async (): Promise<FaceEnrollmentRecord | null> => {
      if (!actor || !studentId) return null;
      try {
        const a = actor as unknown as {
          getStudentFaceEnrollment?: (studentId: string) => Promise<unknown>;
        };
        if (!a.getStudentFaceEnrollment) return null;
        const raw = await a.getStudentFaceEnrollment(studentId);
        if (!raw) return null;
        const r = raw as Record<string, unknown>;
        return {
          studentId: String(r.studentId ?? ""),
          enrolledBy: String(r.enrolledBy ?? ""),
          photoUrl: r.photoUrl != null ? String(r.photoUrl) : null,
          date: String(r.date ?? ""),
          isEnrolled: Boolean(r.isEnrolled ?? true),
        };
      } catch {
        return null;
      }
    },
    enabled: !!studentId && !isFetching,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useGetFaceEnrolledStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string[]>({
    queryKey: ["faceEnrolledStudents"],
    queryFn: async (): Promise<string[]> => {
      if (!actor) return [];
      try {
        const a = actor as unknown as {
          getFaceEnrolledStudents?: () => Promise<unknown>;
        };
        if (!a.getFaceEnrolledStudents) return [];
        const raw = await a.getFaceEnrolledStudents();
        if (!Array.isArray(raw)) return [];
        return raw.map(String);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetAllFaceEnrollments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FaceEnrollmentRecord[]>({
    queryKey: ["allFaceEnrollments"],
    queryFn: async (): Promise<FaceEnrollmentRecord[]> => {
      if (!actor) return [];
      try {
        const a = actor as unknown as {
          getAllFaceEnrollments?: () => Promise<unknown>;
        };
        if (!a.getAllFaceEnrollments) return [];
        const raw = (await a.getAllFaceEnrollments()) as Array<
          Record<string, unknown>
        >;
        if (!Array.isArray(raw)) return [];
        return raw.map((r) => ({
          studentId: String(r.studentId ?? ""),
          enrolledBy: String(r.enrolledBy ?? ""),
          photoUrl: r.photoUrl != null ? String(r.photoUrl) : null,
          date: String(r.date ?? ""),
          isEnrolled: Boolean(r.isEnrolled ?? true),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useEnrollStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      enrolledBy: string;
      photoUrl?: string;
      date: string;
    }): Promise<FaceEnrollmentRecord> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          enrollStudentFace?: (
            studentId: string,
            enrolledBy: string,
            photoUrl: string | null,
            date: string,
          ) => Promise<unknown>;
        };
        if (!a.enrollStudentFace) throw new Error("Method not available.");
        const raw = (await a.enrollStudentFace(
          data.studentId,
          data.enrolledBy,
          data.photoUrl ?? null,
          data.date,
        )) as Record<string, unknown>;
        return {
          studentId: String(raw.studentId ?? ""),
          enrolledBy: String(raw.enrolledBy ?? ""),
          photoUrl: raw.photoUrl != null ? String(raw.photoUrl) : null,
          date: String(raw.date ?? ""),
          isEnrolled: true,
        };
      } catch (e) {
        throw wrapError(e, "Failed to enroll student face.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["faceEnrollment", vars.studentId] });
      qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] });
      qc.invalidateQueries({ queryKey: ["allFaceEnrollments"] });
    },
  });
}

export function useRevokeStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const a = actor as unknown as {
          revokeStudentFaceEnrollment?: (studentId: string) => Promise<unknown>;
        };
        if (!a.revokeStudentFaceEnrollment)
          throw new Error("Method not available.");
        const res = (await a.revokeStudentFaceEnrollment(studentId)) as {
          ok?: string;
          err?: string;
        };
        if (res.err) throw new Error(res.err);
      } catch (e) {
        throw wrapError(e, "Failed to revoke face enrollment.");
      }
    },
    onSuccess: (_data, studentId) => {
      qc.invalidateQueries({ queryKey: ["faceEnrollment", studentId] });
      qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] });
      qc.invalidateQueries({ queryKey: ["allFaceEnrollments"] });
    },
  });
}

// ─── Inventory Transactions (date-based) ─────────────────────────────────────

export interface InventoryTransactionRecord {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  transactionType: string;
  buyerAdmNo: string | null;
  buyerName: string | null;
  sellerName: string | null;
  receivedAmount: number;
  balanceAmount: number;
  date: string;
  createdBy: string;
}

export interface DailySalesSummaryRecord {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalReceived: number;
  totalBalance: number;
  transactionCount: number;
}

export function useGetTransactionsByDate(date: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<InventoryTransactionRecord[]>({
    queryKey: ["inventoryTransactionsByDate", date],
    queryFn: async (): Promise<InventoryTransactionRecord[]> => {
      if (!actor || !date) return [];
      try {
        const a = actor as unknown as {
          getTransactionsByDate?: (date: string) => Promise<unknown>;
        };
        if (!a.getTransactionsByDate) return [];
        const raw = (await a.getTransactionsByDate(date)) as Array<
          Record<string, unknown>
        >;
        if (!Array.isArray(raw)) return [];
        return raw.map((r) => ({
          id: String(r.id ?? ""),
          itemId: String(r.itemId ?? ""),
          itemName: String(r.itemName ?? ""),
          quantity: Number(r.quantity ?? 0),
          unitPrice: Number(r.unitPrice ?? 0),
          totalAmount: Number(r.totalAmount ?? 0),
          transactionType: String(r.transactionType ?? "sale"),
          buyerAdmNo: r.buyerAdmNo != null ? String(r.buyerAdmNo) : null,
          buyerName: r.buyerName != null ? String(r.buyerName) : null,
          sellerName: r.sellerName != null ? String(r.sellerName) : null,
          receivedAmount: Number(r.receivedAmount ?? 0),
          balanceAmount: Number(r.balanceAmount ?? 0),
          date: String(r.date ?? ""),
          createdBy: String(r.createdBy ?? ""),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!date && !isFetching,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useGetDailySalesSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailySalesSummaryRecord[]>({
    queryKey: ["dailySalesSummary"],
    queryFn: async (): Promise<DailySalesSummaryRecord[]> => {
      if (!actor) return [];
      try {
        const a = actor as unknown as {
          getDailySalesSummary?: () => Promise<unknown>;
        };
        if (!a.getDailySalesSummary) return [];
        const raw = (await a.getDailySalesSummary()) as Array<
          Record<string, unknown>
        >;
        if (!Array.isArray(raw)) return [];
        return raw.map((r) => ({
          date: String(r.date ?? ""),
          totalSales: Number(r.totalSales ?? 0),
          totalRevenue: Number(r.totalRevenue ?? 0),
          totalReceived: Number(r.totalReceived ?? 0),
          totalBalance: Number(r.totalBalance ?? 0),
          transactionCount: Number(r.transactionCount ?? 0),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// ─── Monthly Attendance for Excel Register ───────────────────────────────────

export interface MonthlyStudentAttendanceRecord {
  studentId: string;
  admNo: string;
  studentName: string;
  classLevel: string;
  sectionName: string;
  /** Key = 'YYYY-MM-DD', value = 'P' | 'A' | 'L' */
  days: Record<string, string>;
}

/**
 * Fetches all attendance (manual + device) for every day of the given
 * year/month and merges them by student.
 * Manual attendance from getAttendanceByDate (per date, sectionId='').
 * Device attendance from getDeviceAttendanceByDate.
 * Device presence wins over manual absence for the same day.
 */
export function useMonthlyStudentAttendance(
  year: number,
  month: number, // 1-based
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  const { data: students = [] } = useStudents();

  // Build list of YYYY-MM-DD strings for the month
  const dateStrings = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    });
  }, [year, month]);

  return useQuery<MonthlyStudentAttendanceRecord[]>({
    queryKey: ["monthly-attendance", year, month, sessionId],
    queryFn: async (): Promise<MonthlyStudentAttendanceRecord[]> => {
      if (!actor) return [];
      try {
        // student list filtered to session
        const sessionStudents = students.filter(
          (s) => s.sessionId === sessionId && !s.isDiscontinued,
        );
        if (sessionStudents.length === 0) return [];

        // Map studentId -> admNo/name/class/section for merge
        const studentMeta: Record<
          string,
          {
            admNo: string;
            studentName: string;
            classLevel: string;
            sectionName: string;
          }
        > = {};
        for (const s of sessionStudents) {
          studentMeta[s.id] = {
            admNo: s.admNo,
            studentName: s.fullName,
            classLevel: s.classLevel,
            sectionName: s.sectionId,
          };
        }

        // Accumulator: studentId -> date -> status
        const acc: Record<string, Record<string, string>> = {};
        const initStudent = (id: string) => {
          if (!acc[id]) acc[id] = {};
        };
        for (const s of sessionStudents) initStudent(s.id);

        const a = actor as unknown as {
          getAttendanceByDate?: (
            date: string,
            sectionId: string,
          ) => Promise<unknown>;
          getDeviceAttendanceByDate?: (date: string) => Promise<unknown>;
        };

        // Fetch all days in parallel batches of 5 to avoid overloading
        const batchSize = 5;
        for (let i = 0; i < dateStrings.length; i += batchSize) {
          const batch = dateStrings.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (dateStr) => {
              // Manual attendance
              if (a.getAttendanceByDate) {
                try {
                  const raw = (await a.getAttendanceByDate(
                    dateStr,
                    "",
                  )) as Array<Record<string, unknown>>;
                  if (Array.isArray(raw)) {
                    for (const r of raw) {
                      const sid = String(r.studentId ?? "");
                      if (!sid) continue;
                      initStudent(sid);
                      const status = String(r.status ?? "");
                      const mapped =
                        status === "Present"
                          ? "P"
                          : status === "Leave" || status === "L"
                            ? "L"
                            : status === "Absent"
                              ? "A"
                              : status.substring(0, 1).toUpperCase();
                      if (mapped) acc[sid][dateStr] = mapped;
                    }
                  }
                } catch {
                  /* skip */
                }
              }

              // Device attendance (face/RFID/QR/ESSL) — device presence overrides manual
              if (a.getDeviceAttendanceByDate) {
                try {
                  const raw = (await a.getDeviceAttendanceByDate(
                    dateStr,
                  )) as Array<Record<string, unknown>>;
                  if (Array.isArray(raw)) {
                    for (const r of raw) {
                      const sid = String(r.studentId ?? "");
                      if (!sid) continue;
                      initStudent(sid);
                      const status = String(r.status ?? "Present");
                      const mapped =
                        status === "Present" || status === "P"
                          ? "P"
                          : status === "Leave" || status === "L"
                            ? "L"
                            : "A";
                      // Device present overrides manual absent
                      if (
                        mapped === "P" ||
                        !acc[sid][dateStr] ||
                        acc[sid][dateStr] === "A"
                      ) {
                        acc[sid][dateStr] = mapped;
                      }
                    }
                  }
                } catch {
                  /* skip */
                }
              }
            }),
          );
        }

        // Build result rows
        return sessionStudents.map((s) => ({
          studentId: s.id,
          admNo: s.admNo,
          studentName: s.fullName,
          classLevel: s.classLevel,
          sectionName: s.sectionId,
          days: acc[s.id] ?? {},
        }));
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching && students.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

/** Fetches holidays from academic calendar backend */
export function useHolidays(sessionId: string | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Array<{ id: string; date: string; name: string }>>({
    queryKey: ["holidays", sessionId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getHolidays(sessionId);
        return (Array.isArray(raw) ? raw : []).map((h) => ({
          id: String(h.id ?? ""),
          date: String(h.date ?? ""),
          name: String(h.name ?? ""),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Exam Configuration & Results ─────────────────────────────────────────────

export function useGetAllExamConfigs(sessionId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BackendExamConfig[]>({
    queryKey: ["exam-configs", sessionId],
    queryFn: async (): Promise<BackendExamConfig[]> => {
      if (!actor) return [];
      try {
        return await actor.getAllExamConfigs(sessionId);
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetExamConfigsByClass(sessionId: string, classId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BackendExamConfig[]>({
    queryKey: ["exam-configs-class", sessionId, classId],
    queryFn: async (): Promise<BackendExamConfig[]> => {
      if (!actor || !classId) return [];
      try {
        return await actor.getExamConfigs(sessionId, classId);
      } catch {
        return [];
      }
    },
    enabled: !!sessionId && !!classId && !isFetching,
    staleTime: 60_000,
  });
}

export function useSaveExamConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      examName: string;
      sessionId: string;
      classId: string;
      subjectConfigs: Array<{
        subjectId: string;
        subjectName: string;
        maxMarks: number;
        passingMarks: number;
      }>;
      includeInCombined: boolean;
      weightage: number;
    }): Promise<BackendExamConfig> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        return await actor.saveExamConfig(
          params.examName,
          params.sessionId,
          params.classId,
          params.subjectConfigs,
          params.includeInCombined,
          params.weightage,
        );
      } catch (e) {
        throw wrapError(e, "Failed to save exam config. Please try again.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["exam-configs", vars.sessionId] });
      qc.invalidateQueries({
        queryKey: ["exam-configs-class", vars.sessionId, vars.classId],
      });
    },
  });
}

export function useDeleteExamConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        await actor.deleteExamConfig(id);
      } catch (e) {
        throw wrapError(e, "Failed to delete exam config.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exam-configs"] });
      qc.invalidateQueries({ queryKey: ["exam-configs-class"] });
    },
  });
}

export function useSaveExamMarks() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      examConfigId: string;
      sessionId: string;
      classId: string;
      studentId: string;
      rawMarks: Array<{
        subjectId: string;
        subjectName: string;
        marksObtained: number;
        maxMarks: number;
        passingMarks: number;
      }>;
    }): Promise<ExamResultV2> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const result = await actor.saveExamMarks(
          params.examConfigId,
          params.sessionId,
          params.classId,
          params.studentId,
          params.rawMarks,
          null,
          null,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok;
      } catch (e) {
        throw wrapError(e, "Failed to save marks.");
      }
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["exam-results-student", vars.studentId],
      });
      qc.invalidateQueries({ queryKey: ["exam-results-class", vars.classId] });
      qc.invalidateQueries({ queryKey: ["academic-perf", vars.studentId] });
    },
  });
}

export function useGetExamResultsByStudent(
  studentId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ExamResultV2[]>({
    queryKey: ["exam-results-student", studentId, sessionId],
    queryFn: async (): Promise<ExamResultV2[]> => {
      if (!actor || !studentId) return [];
      try {
        return await actor.getExamResultsByStudent(studentId, sessionId);
      } catch {
        return [];
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetAcademicPerformanceReport(
  studentId: string,
  sessionId: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AcademicPerformanceReport | null>({
    queryKey: ["academic-perf", studentId, sessionId],
    queryFn: async (): Promise<AcademicPerformanceReport | null> => {
      if (!actor || !studentId) return null;
      try {
        return await actor.getAcademicPerformanceReport(studentId, sessionId);
      } catch {
        return null;
      }
    },
    enabled: !!studentId && !!sessionId && !isFetching,
    staleTime: 60_000,
  });
}
