// ─── Timetable hooks — class timetable + school-wide view ───────────────────
import { createActor } from "@/backend";
import type {
  ClassTimetable as BackendClassTimetable,
  PeriodConfig as BackendPeriodConfig,
  TimetableCellRef as BackendTimetableCellRef,
  CellCopyOp,
} from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Frontend types ───────────────────────────────────────────────────────────
export interface TimetablePeriodConfig {
  periodNumber: number;
  startTime: string;
  durationMinutes: number;
  isInterval: boolean;
  label?: string;
}

export interface TimetableEntry {
  periodNumber: number;
  dayOfWeek: string;
  classLevel: string;
  sectionName: string;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  startTime: string;
  endTime: string;
}

export interface ClassTimetableData {
  id: string;
  name: string;
  sessionId: string;
  entries: TimetableEntry[];
  periodConfigs: TimetablePeriodConfig[];
  createdAt: number;
  updatedAt: number;
}

export interface CopiedCell {
  timetableId: string;
  dayOfWeek: string;
  periodNumber: number;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  classLevel: string;
  sectionName: string;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────
function mapPeriodConfig(p: BackendPeriodConfig): TimetablePeriodConfig {
  return {
    periodNumber: Number(p.periodNumber),
    startTime: p.startTime,
    durationMinutes: Number(p.durationMinutes),
    isInterval: p.isInterval,
  };
}

function mapTimetable(t: BackendClassTimetable): ClassTimetableData {
  return {
    id: t.id,
    name: t.name,
    sessionId: t.sessionId,
    entries: t.entries.map((e) => ({
      periodNumber: Number(e.periodNumber),
      dayOfWeek: e.dayOfWeek,
      classLevel: String(e.classLevel),
      sectionName: e.sectionName,
      subjectName: e.subjectName,
      teacherName: e.teacherName,
      teacherStaffId: e.teacherStaffId,
      startTime: e.startTime,
      endTime: e.endTime,
    })),
    periodConfigs: (t.periodConfigs ?? []).map(mapPeriodConfig),
    createdAt:
      typeof t.createdAt === "bigint"
        ? Number(t.createdAt) / 1_000_000
        : Number(t.createdAt),
    updatedAt:
      typeof t.updatedAt === "bigint"
        ? Number(t.updatedAt) / 1_000_000
        : Number(t.updatedAt),
  };
}

function toBackendTimetable(t: ClassTimetableData): BackendClassTimetable {
  return {
    id: t.id,
    name: t.name,
    sessionId: t.sessionId,
    entries: t.entries.map((e) => ({
      periodNumber: BigInt(e.periodNumber),
      dayOfWeek: e.dayOfWeek,
      classLevel: e.classLevel as unknown as import("@/types").ClassLevel,
      sectionName: e.sectionName,
      subjectName: e.subjectName,
      teacherName: e.teacherName,
      teacherStaffId: e.teacherStaffId,
      startTime: e.startTime,
      endTime: e.endTime,
    })),
    periodConfigs: t.periodConfigs.map((p) => ({
      periodNumber: BigInt(p.periodNumber),
      startTime: p.startTime,
      durationMinutes: BigInt(p.durationMinutes),
      isInterval: p.isInterval,
    })),
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useBackendActor() {
  return useActor<import("@/backend.d").backendInterface>(createActor);
}

export function useClassTimetables(sessionId?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ClassTimetableData[]>({
    queryKey: ["classTimetables", sessionId ?? "all"],
    queryFn: async (): Promise<ClassTimetableData[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getClassTimetables(sessionId ?? null);
        return raw.map(mapTimetable);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useClassTimetableById(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ClassTimetableData | null>({
    queryKey: ["classTimetable", id],
    queryFn: async (): Promise<ClassTimetableData | null> => {
      if (!actor || !id) return null;
      try {
        const raw = await actor.getClassTimetableById(id);
        return raw ? mapTimetable(raw) : null;
      } catch {
        return null;
      }
    },
    enabled: !!id && !isFetching,
  });
}

export function useSchoolWideTimetable(sessionId?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Array<[string, ClassTimetableData]>>({
    queryKey: ["schoolWideTimetable", sessionId ?? "all"],
    queryFn: async (): Promise<Array<[string, ClassTimetableData]>> => {
      if (!actor) return [];
      try {
        const raw = await actor.getSchoolWideTimetable(sessionId ?? null);
        return raw.map(([label, tt]) => [label, mapTimetable(tt)]);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
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
      timetable: ClassTimetableData;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        return await actor.updateClassTimetable(
          id,
          toBackendTimetable(timetable),
        );
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to update timetable.");
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["classTimetable", vars.id] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    },
  });
}

export function useCopyPasteTimetableCells() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ops: CellCopyOp[]): Promise<number> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        const count = await actor.copyPasteTimetableCells(ops);
        return Number(count);
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to copy-paste cells.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    },
  });
}

export function useDeleteClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        return await actor.deleteClassTimetable(id);
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to delete timetable.");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["classTimetables"] }),
  });
}

// ─── Live period helpers ──────────────────────────────────────────────────────

/** Returns the index (0-based) of the period currently active based on system clock. */
export function getCurrentPeriodNumber(
  periodConfigs: TimetablePeriodConfig[],
): number | null {
  if (!periodConfigs.length) return null;
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  for (const cfg of periodConfigs) {
    if (cfg.isInterval) continue;
    const [h, m] = cfg.startTime.split(":").map(Number);
    const start = h * 60 + m;
    const end = start + cfg.durationMinutes;
    if (totalMinutes >= start && totalMinutes < end) {
      return cfg.periodNumber;
    }
  }
  return null;
}

/** Returns "past" | "current" | "upcoming" for a given period number. */
export function getPeriodStatus(
  periodNumber: number,
  periodConfigs: TimetablePeriodConfig[],
): "past" | "current" | "upcoming" {
  const cfg = periodConfigs.find((p) => p.periodNumber === periodNumber);
  if (!cfg) return "upcoming";
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const [h, m] = cfg.startTime.split(":").map(Number);
  const start = h * 60 + m;
  const end = start + cfg.durationMinutes;
  if (totalMinutes >= start && totalMinutes < end) return "current";
  if (totalMinutes >= end) return "past";
  return "upcoming";
}

/** Compute end time string from start time + duration */
export function computeEndTime(
  startTime: string,
  durationMinutes: number,
): string {
  const [h, m] = startTime.split(":").map(Number);
  const endMinutes = h * 60 + m + durationMinutes;
  const eh = Math.floor(endMinutes / 60) % 24;
  const em = endMinutes % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

/** Generate default period configs from start time, periods per day, and duration. */
export function buildDefaultPeriodConfigs(
  periodsPerDay: number,
  startTime: string,
  durationMinutes: number,
  intervalAfterPeriod = 3,
  intervalMinutes = 15,
): TimetablePeriodConfig[] {
  const configs: TimetablePeriodConfig[] = [];
  let [h, m] = startTime.split(":").map(Number);
  let mins = h * 60 + m;
  for (let i = 1; i <= periodsPerDay; i++) {
    const sh = Math.floor(mins / 60);
    const sm = mins % 60;
    configs.push({
      periodNumber: i,
      startTime: `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}`,
      durationMinutes,
      isInterval: false,
    });
    mins += durationMinutes;
    if (i === intervalAfterPeriod && i < periodsPerDay) {
      const ih = Math.floor(mins / 60);
      const im = mins % 60;
      configs.push({
        periodNumber: i + 0.5,
        startTime: `${String(ih).padStart(2, "0")}:${String(im).padStart(2, "0")}`,
        durationMinutes: intervalMinutes,
        isInterval: true,
        label: "Break",
      });
      mins += intervalMinutes;
    }
  }
  return configs;
}

export type { CellCopyOp, BackendTimetableCellRef as TimetableCellRef };

// ─── Teacher Timetable types ──────────────────────────────────────────────────
export interface TeacherTimetableEntry {
  periodNumber: number;
  dayOfWeek: string;
  className: string;
  sectionName: string;
  subjectName: string;
  startTime: string;
  endTime: string;
}

export interface TeacherTimetable {
  id: string;
  teacherStaffId: string;
  teacherName: string;
  sessionId: string;
  generatedAt: number;
  entries: TeacherTimetableEntry[];
}

export interface ClassLinks {
  classLevel: string;
  sectionName: string;
  cctvUrl: string;
  broadcastUrl: string;
}

// ─── Batch save class timetables ──────────────────────────────────────────────
export function useBatchSaveClassTimetables() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (timetables: ClassTimetableData[]): Promise<number> => {
      if (!actor) throw new Error("Backend not available.");
      const result = await actor.batchSaveClassTimetables(
        timetables.map(toBackendTimetable),
      );
      return Number(result);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    },
  });
}

// ─── Copy-paste entire day ────────────────────────────────────────────────────
export function useCopyPasteEntireDay() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sourceTimetableId,
      sourceDay,
      targetTimetableId,
      targetDay,
    }: {
      sourceTimetableId: string;
      sourceDay: string;
      targetTimetableId: string;
      targetDay: string;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Backend not available.");
      return await actor.copyPasteEntireDay(
        sourceTimetableId,
        sourceDay,
        targetTimetableId,
        targetDay,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    },
  });
}

// ─── Teacher timetable hooks ──────────────────────────────────────────────────
export function useTeacherTimetables(sessionId?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TeacherTimetable[]>({
    queryKey: ["teacherTimetables", sessionId ?? "all"],
    queryFn: async (): Promise<TeacherTimetable[]> => {
      if (!actor || !sessionId) return [];
      try {
        const raw = await actor.getTeacherTimetables(sessionId);
        return raw.map((t) => ({
          id: t.id,
          teacherStaffId: t.teacherStaffId,
          teacherName: t.teacherName,
          sessionId: t.sessionId,
          generatedAt:
            typeof t.generatedAt === "bigint"
              ? Number(t.generatedAt) / 1_000_000
              : Number(t.generatedAt),
          entries: t.entries.map((e) => ({
            periodNumber: Number(e.periodNumber),
            dayOfWeek: e.dayOfWeek,
            className: e.className,
            sectionName: e.sectionName,
            subjectName: e.subjectName,
            startTime: e.startTime,
            endTime: e.endTime,
          })),
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching && !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenerateTeacherTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string): Promise<TeacherTimetable[]> => {
      if (!actor) throw new Error("Backend not available.");
      const raw = await actor.generateTeacherTimetable(sessionId);
      return raw.map((t) => ({
        id: t.id,
        teacherStaffId: t.teacherStaffId,
        teacherName: t.teacherName,
        sessionId: t.sessionId,
        generatedAt:
          typeof t.generatedAt === "bigint"
            ? Number(t.generatedAt) / 1_000_000
            : Number(t.generatedAt),
        entries: t.entries.map((e) => ({
          periodNumber: Number(e.periodNumber),
          dayOfWeek: e.dayOfWeek,
          className: e.className,
          sectionName: e.sectionName,
          subjectName: e.subjectName,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
      }));
    },
    onSuccess: (_d, sessionId) => {
      qc.invalidateQueries({ queryKey: ["teacherTimetables", sessionId] });
    },
  });
}

export function useSaveTeacherTimetables() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (timetables: TeacherTimetable[]): Promise<number> => {
      if (!actor) throw new Error("Backend not available.");
      const backendData = timetables.map((t) => ({
        id: t.id,
        teacherStaffId: t.teacherStaffId,
        teacherName: t.teacherName,
        sessionId: t.sessionId,
        generatedAt: BigInt(0),
        entries: t.entries.map((e) => ({
          periodNumber: BigInt(e.periodNumber),
          dayOfWeek: e.dayOfWeek,
          className: e.className,
          sectionName: e.sectionName,
          subjectName: e.subjectName,
          startTime: e.startTime,
          endTime: e.endTime,
        })),
      }));
      return Number(await actor.saveTeacherTimetables(backendData));
    },
    onSuccess: (_d, vars) => {
      if (vars[0])
        qc.invalidateQueries({
          queryKey: ["teacherTimetables", vars[0].sessionId],
        });
    },
  });
}

// ─── Class links hooks ────────────────────────────────────────────────────────
export function useClassLinks(classLevelTag?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ClassLinks[]>({
    queryKey: ["classLinks", classLevelTag ?? "all"],
    queryFn: async (): Promise<ClassLinks[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getClassLinks(classLevelTag ?? null);
        return raw.map((l) => ({
          classLevel: String(l.classLevel),
          sectionName: l.sectionName,
          cctvUrl: l.cctvUrl,
          broadcastUrl: l.broadcastUrl,
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSaveClassLinks() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links: ClassLinks[]): Promise<number> => {
      if (!actor) throw new Error("Backend not available.");
      const backendLinks = links.map((l) => ({
        classLevel: l.classLevel as unknown as import("@/types").ClassLevel,
        sectionName: l.sectionName,
        cctvUrl: l.cctvUrl,
        broadcastUrl: l.broadcastUrl,
      }));
      return Number(await actor.saveClassLinks(backendLinks));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classLinks"] });
    },
  });
}
