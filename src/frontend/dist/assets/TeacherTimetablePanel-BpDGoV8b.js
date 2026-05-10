import { am as useQuery, a3 as useActor, ao as useQueryClient, an as useMutation, ad as createActor, d as useAppStore, r as reactExports, j as jsxRuntimeExports, S as Skeleton, e as Button, l as LoaderCircle, F as ue } from "./index-pMBTUEbj.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { U as User } from "./user-C6bo2V5_.js";
function mapPeriodConfig(p) {
  return {
    periodNumber: Number(p.periodNumber),
    startTime: p.startTime,
    durationMinutes: Number(p.durationMinutes),
    isInterval: p.isInterval
  };
}
function mapTimetable(t) {
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
      endTime: e.endTime
    })),
    periodConfigs: (t.periodConfigs ?? []).map(mapPeriodConfig),
    createdAt: typeof t.createdAt === "bigint" ? Number(t.createdAt) / 1e6 : Number(t.createdAt),
    updatedAt: typeof t.updatedAt === "bigint" ? Number(t.updatedAt) / 1e6 : Number(t.updatedAt)
  };
}
function toBackendTimetable(t) {
  return {
    id: t.id,
    name: t.name,
    sessionId: t.sessionId,
    entries: t.entries.map((e) => ({
      periodNumber: BigInt(e.periodNumber),
      dayOfWeek: e.dayOfWeek,
      classLevel: e.classLevel,
      sectionName: e.sectionName,
      subjectName: e.subjectName,
      teacherName: e.teacherName,
      teacherStaffId: e.teacherStaffId,
      startTime: e.startTime,
      endTime: e.endTime
    })),
    periodConfigs: t.periodConfigs.map((p) => ({
      periodNumber: BigInt(p.periodNumber),
      startTime: p.startTime,
      durationMinutes: BigInt(p.durationMinutes),
      isInterval: p.isInterval
    })),
    createdAt: BigInt(0),
    updatedAt: BigInt(0)
  };
}
function useBackendActor() {
  return useActor(createActor);
}
function useClassTimetables(sessionId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["classTimetables", sessionId ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getClassTimetables(sessionId ?? null);
        return raw.map(mapTimetable);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1e3,
    gcTime: 15 * 60 * 1e3
  });
}
function useSchoolWideTimetable(sessionId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["schoolWideTimetable", sessionId ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getSchoolWideTimetable(sessionId ?? null);
        return raw.map(([label, tt]) => [label, mapTimetable(tt)]);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1e3
  });
}
function useUpdateClassTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      timetable
    }) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      try {
        return await actor.updateClassTimetable(
          id,
          toBackendTimetable(timetable)
        );
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to update timetable.");
      }
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["classTimetable", vars.id] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    }
  });
}
function useCopyPasteTimetableCells() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ops) => {
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
    }
  });
}
function getCurrentPeriodNumber(periodConfigs) {
  if (!periodConfigs.length) return null;
  const now = /* @__PURE__ */ new Date();
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
function getPeriodStatus(periodNumber, periodConfigs) {
  const cfg = periodConfigs.find((p) => p.periodNumber === periodNumber);
  if (!cfg) return "upcoming";
  const now = /* @__PURE__ */ new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const [h, m] = cfg.startTime.split(":").map(Number);
  const start = h * 60 + m;
  const end = start + cfg.durationMinutes;
  if (totalMinutes >= start && totalMinutes < end) return "current";
  if (totalMinutes >= end) return "past";
  return "upcoming";
}
function computeEndTime(startTime, durationMinutes) {
  const [h, m] = startTime.split(":").map(Number);
  const endMinutes = h * 60 + m + durationMinutes;
  const eh = Math.floor(endMinutes / 60) % 24;
  const em = endMinutes % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}
function buildDefaultPeriodConfigs(periodsPerDay, startTime, durationMinutes, intervalAfterPeriod = 3, intervalMinutes = 15) {
  const configs = [];
  let [h, m] = startTime.split(":").map(Number);
  let mins = h * 60 + m;
  for (let i = 1; i <= periodsPerDay; i++) {
    const sh = Math.floor(mins / 60);
    const sm = mins % 60;
    configs.push({
      periodNumber: i,
      startTime: `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}`,
      durationMinutes,
      isInterval: false
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
        label: "Break"
      });
      mins += intervalMinutes;
    }
  }
  return configs;
}
function useBatchSaveClassTimetables() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (timetables) => {
      if (!actor) throw new Error("Backend not available.");
      const result = await actor.batchSaveClassTimetables(
        timetables.map(toBackendTimetable)
      );
      return Number(result);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    }
  });
}
function useCopyPasteEntireDay() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sourceTimetableId,
      sourceDay,
      targetTimetableId,
      targetDay
    }) => {
      if (!actor) throw new Error("Backend not available.");
      return await actor.copyPasteEntireDay(
        sourceTimetableId,
        sourceDay,
        targetTimetableId,
        targetDay
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classTimetables"] });
      qc.invalidateQueries({ queryKey: ["schoolWideTimetable"] });
    }
  });
}
function useTeacherTimetables(sessionId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["teacherTimetables", sessionId ?? "all"],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      try {
        const raw = await actor.getTeacherTimetables(sessionId);
        return raw.map((t) => ({
          id: t.id,
          teacherStaffId: t.teacherStaffId,
          teacherName: t.teacherName,
          sessionId: t.sessionId,
          generatedAt: typeof t.generatedAt === "bigint" ? Number(t.generatedAt) / 1e6 : Number(t.generatedAt),
          entries: t.entries.map((e) => ({
            periodNumber: Number(e.periodNumber),
            dayOfWeek: e.dayOfWeek,
            className: e.className,
            sectionName: e.sectionName,
            subjectName: e.subjectName,
            startTime: e.startTime,
            endTime: e.endTime
          }))
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching && !!sessionId,
    staleTime: 5 * 60 * 1e3
  });
}
function useGenerateTeacherTimetable() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId) => {
      if (!actor) throw new Error("Backend not available.");
      const raw = await actor.generateTeacherTimetable(sessionId);
      return raw.map((t) => ({
        id: t.id,
        teacherStaffId: t.teacherStaffId,
        teacherName: t.teacherName,
        sessionId: t.sessionId,
        generatedAt: typeof t.generatedAt === "bigint" ? Number(t.generatedAt) / 1e6 : Number(t.generatedAt),
        entries: t.entries.map((e) => ({
          periodNumber: Number(e.periodNumber),
          dayOfWeek: e.dayOfWeek,
          className: e.className,
          sectionName: e.sectionName,
          subjectName: e.subjectName,
          startTime: e.startTime,
          endTime: e.endTime
        }))
      }));
    },
    onSuccess: (_d, sessionId) => {
      qc.invalidateQueries({ queryKey: ["teacherTimetables", sessionId] });
    }
  });
}
function useSaveTeacherTimetables() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (timetables) => {
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
          endTime: e.endTime
        }))
      }));
      return Number(await actor.saveTeacherTimetables(backendData));
    },
    onSuccess: (_d, vars) => {
      if (vars[0])
        qc.invalidateQueries({
          queryKey: ["teacherTimetables", vars[0].sessionId]
        });
    }
  });
}
function useClassLinks(classLevelTag) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["classLinks", "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getClassLinks(classLevelTag ?? null);
        return raw.map((l) => ({
          classLevel: String(l.classLevel),
          sectionName: l.sectionName,
          cctvUrl: l.cctvUrl,
          broadcastUrl: l.broadcastUrl
        }));
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 10 * 60 * 1e3
  });
}
function useSaveClassLinks() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links) => {
      if (!actor) throw new Error("Backend not available.");
      const backendLinks = links.map((l) => ({
        classLevel: l.classLevel,
        sectionName: l.sectionName,
        cctvUrl: l.cctvUrl,
        broadcastUrl: l.broadcastUrl
      }));
      return Number(await actor.saveClassLinks(backendLinks));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classLinks"] });
    }
  });
}
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat"
};
function TeacherTimetablePanel({ sessionId }) {
  const { data: savedTimetables = [], isLoading } = useTeacherTimetables(sessionId);
  const generateMut = useGenerateTeacherTimetable();
  const saveMut = useSaveTeacherTimetables();
  const activeSession = useAppStore((s) => s.currentSession);
  const [generatedTimetables, setGeneratedTimetables] = reactExports.useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = reactExports.useState(
    null
  );
  const displayTimetables = generatedTimetables ?? savedTimetables;
  async function handleGenerate() {
    var _a;
    try {
      const result = await generateMut.mutateAsync(sessionId);
      setGeneratedTimetables(result);
      if (result.length > 0) {
        setSelectedTeacherId(((_a = result[0]) == null ? void 0 : _a.teacherStaffId) ?? null);
      }
      ue.success(
        `Generated timetable for ${result.length} teacher${result.length !== 1 ? "s" : ""}.`
      );
    } catch {
      ue.error("Failed to generate teacher timetable. Please try again.");
    }
  }
  async function handleSave() {
    const toSave = generatedTimetables ?? savedTimetables;
    if (!toSave.length) return;
    try {
      await saveMut.mutateAsync(toSave);
      setGeneratedTimetables(null);
      ue.success("Teacher timetables saved successfully!");
    } catch {
      ue.error("Failed to save teacher timetables.");
    }
  }
  function handlePrintSingle() {
    window.print();
  }
  const selectedTimetable = displayTimetables.find((t) => t.teacherStaffId === selectedTeacherId) ?? displayTimetables[0];
  const allPeriods = selectedTimetable ? Array.from(
    new Set(selectedTimetable.entries.map((e) => e.periodNumber))
  ).sort((a, b) => a - b) : [];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "timetable.teacher_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Teacher-wise Timetable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auto-generated from subject assignments. No teacher double-booked." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        generatedTimetables && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "default",
            size: "sm",
            onClick: handleSave,
            disabled: saveMut.isPending,
            "data-ocid": "timetable.teacher.save_button",
            children: [
              saveMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 mr-1" }),
              "Save All"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleGenerate,
            disabled: generateMut.isPending,
            "data-ocid": "timetable.teacher.generate_button",
            children: [
              generateMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4 mr-1" }),
              generateMut.isPending ? "Generating…" : "Generate Teacher Timetable"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handlePrintSingle,
            disabled: !selectedTimetable,
            "data-ocid": "timetable.teacher.print_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
              " Print"
            ]
          }
        )
      ] })
    ] }),
    displayTimetables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center",
        "data-ocid": "timetable.teacher.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-10 mx-auto text-muted-foreground/40 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "No teacher timetables yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Click "Generate Teacher Timetable" to auto-create from subject assignments.' })
        ]
      }
    ),
    displayTimetables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 p-3 border-b border-border bg-muted/20 overflow-x-auto", children: displayTimetables.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedTeacherId(t.teacherStaffId),
          className: `px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${selectedTeacherId === t.teacherStaffId || !selectedTeacherId && t === displayTimetables[0] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
          "data-ocid": `timetable.teacher.tab.${t.teacherStaffId}`,
          children: t.teacherName
        },
        t.teacherStaffId
      )) }),
      selectedTimetable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm", children: selectedTimetable.teacherName.split(" ").slice(0, 2).map((w) => w[0]).join("") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: selectedTimetable.teacherName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              selectedTimetable.entries.length,
              " periods assigned"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs w-full min-w-[640px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold text-muted-foreground w-20 border-r border-border", children: "Day" }),
            allPeriods.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "th",
              {
                className: "px-2 py-2 text-center font-semibold text-muted-foreground min-w-[100px] border-r border-border last:border-0",
                children: [
                  "P",
                  p
                ]
              },
              p
            ))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: DAYS.map((day) => {
            const dayEntries = selectedTimetable.entries.filter(
              (e) => e.dayOfWeek === day
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-border hover:bg-muted/10",
                "data-ocid": `timetable.teacher.row.${day.toLowerCase()}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-semibold text-foreground border-r border-border", children: DAY_SHORT[day] }),
                  allPeriods.map((p) => {
                    const entry = dayEntries.find(
                      (e) => e.periodNumber === p
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-2 py-2 border-r border-border last:border-0 align-top",
                        "data-ocid": `timetable.teacher.cell.${day.toLowerCase()}.${p}`,
                        children: entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground leading-tight", children: entry.subjectName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                            entry.className,
                            entry.sectionName ? ` (${entry.sectionName})` : ""
                          ] }),
                          entry.startTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono text-muted-foreground/70", children: [
                            entry.startTime,
                            "–",
                            entry.endTime
                          ] })
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "—" })
                      },
                      p
                    );
                  })
                ]
              },
              day
            );
          }) })
        ] }) })
      ] })
    ] }),
    selectedTimetable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timetable-print-area sr-only", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-letterhead", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-school-name", children: "SHUBH SCHOOL ERP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-report-title", children: [
          "TEACHER TIMETABLE — ",
          selectedTimetable.teacherName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-session-badge", children: [
          "Session: ",
          activeSession,
          "  |  Printed:",
          " ",
          (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "print-timetable-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "row-header", children: "Day" }),
          allPeriods.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { children: [
            "P",
            p
          ] }, p))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: DAYS.map((day) => {
          const dayEntries = selectedTimetable.entries.filter(
            (e) => e.dayOfWeek === day
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "period-cell", children: day }),
            allPeriods.map((p) => {
              const entry = dayEntries.find(
                (e) => e.periodNumber === p
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-cell-subject", children: entry.subjectName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-cell-teacher", children: [
                  entry.className,
                  entry.sectionName ? ` (${entry.sectionName})` : ""
                ] }),
                entry.startTime && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: "6.5pt",
                      color: "#777",
                      marginTop: "1px"
                    },
                    children: [
                      entry.startTime,
                      "–",
                      entry.endTime
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-cell-empty", children: "—" }) }, p);
            })
          ] }, day);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-teacher-summary", children: [
        "Total periods per week: ",
        selectedTimetable.entries.length,
        " ",
        " |  Days taught:",
        " ",
        Array.from(
          new Set(selectedTimetable.entries.map((e) => e.dayOfWeek))
        ).length,
        " ",
        "of 6"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-footer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-summary-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Teacher: ",
            selectedTimetable.teacherName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Session: ",
            activeSession
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-label", children: "Principal Signature" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-signature-line" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-signature-label", children: [
            "Date:",
            " ",
            (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TeacherTimetablePanel as T,
  useCopyPasteEntireDay as a,
  useUpdateClassTimetable as b,
  useCopyPasteTimetableCells as c,
  computeEndTime as d,
  buildDefaultPeriodConfigs as e,
  useSchoolWideTimetable as f,
  getPeriodStatus as g,
  useClassLinks as h,
  getCurrentPeriodNumber as i,
  useSaveClassLinks as j,
  useClassTimetables as k,
  useBatchSaveClassTimetables as u
};
