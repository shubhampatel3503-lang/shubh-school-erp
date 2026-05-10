import { r as reactExports, j as jsxRuntimeExports, a9 as motion, e as Button, X, U as Users, l as LoaderCircle, F as ue, ac as __vitePreload, a0 as formatDate, a5 as useStudents, a8 as useSections, C as CLASS_ORDER, a6 as useRoutes, S as Skeleton, a7 as getClassLabel, I as Input, Z as getInitials, t as Badge } from "./index-pMBTUEbj.js";
import { d as useEnrollStudentFace, A as AnimatePresence, U as UserCheck, b as useGetFaceEnrolledStudents, f as useMarkFaceAttendance, u as useFaceApiModels, c as useDescriptorLoader, F as FaceRecognitionCamera, e as useRevokeStudentFace } from "./FaceRecognitionCamera-DQcxiDMy.js";
import { C as Camera } from "./camera-owTlFa42.js";
import { C as Card, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { S as ScanFace } from "./scan-face-CGhu3Srl.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import "./triangle-alert-Ai_hY88N.js";
import "./refresh-cw-BgXF1ld8.js";
import "./circle-check-big-DCQRnxmS.js";
import "./index-Nv6ob_Pe.js";
async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
async function computeFaceDescriptor(photoUrl) {
  try {
    const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
    const source = photoUrl.startsWith("data:") ? await (async () => {
      const img = new Image();
      img.src = photoUrl;
      await new Promise((r) => {
        img.onload = () => r();
      });
      return img;
    })() : await loadImage(photoUrl);
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    return (detection == null ? void 0 : detection.descriptor) ?? null;
  } catch {
    return null;
  }
}
function EnrollFaceDialog({
  student,
  isEnrolled,
  onClose,
  onEnrolled
}) {
  const [mode, setMode] = reactExports.useState("profile");
  const [capturedPhoto, setCapturedPhoto] = reactExports.useState(null);
  const [camStatus, setCamStatus] = reactExports.useState("idle");
  const [saving, setSaving] = reactExports.useState(false);
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const { mutateAsync: enrollFace } = useEnrollStudentFace();
  const startCamera = reactExports.useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStatus("active");
    } catch (err) {
      const e = err;
      setCamStatus(
        e.name === "NotAllowedError" || e.name === "PermissionDeniedError" ? "denied" : "error"
      );
    }
  }, []);
  const stopCamera = reactExports.useCallback(() => {
    var _a;
    for (const t of ((_a = streamRef.current) == null ? void 0 : _a.getTracks()) ?? []) t.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamStatus("idle");
  }, []);
  const handleSwitchToCamera = async () => {
    setMode("camera");
    setCapturedPhoto(null);
    await startCamera();
  };
  const handleSwitchToProfile = () => {
    stopCamera();
    setMode("profile");
    setCapturedPhoto(null);
  };
  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || camStatus !== "active") return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedPhoto(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
  };
  const handleConfirm = async () => {
    const photoUrl = mode === "profile" ? student.photoUrl : capturedPhoto;
    if (!photoUrl) {
      ue.error("No photo available. Use a profile photo or capture one.");
      return;
    }
    setSaving(true);
    try {
      let descriptorJson = "";
      const descriptor = await computeFaceDescriptor(photoUrl);
      if (descriptor) {
        descriptorJson = JSON.stringify(Array.from(descriptor));
      } else {
        ue.warning(
          "No face detected in photo. Enrolled anyway — auto-recognition may not work."
        );
      }
      await enrollFace({
        studentId: student.id,
        admNo: student.admNo,
        enrolledBy: "Admin",
        photoUrl,
        descriptorJson
      });
      ue.success(`${student.fullName} enrolled successfully`);
      stopCamera();
      onEnrolled == null ? void 0 : onEnrolled();
      onClose();
    } catch (e) {
      ue.error(
        e instanceof Error ? e.message : "Enrollment failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleClose = () => {
    stopCamera();
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
      style: { zIndex: 10010 },
      "data-ocid": "face.enroll_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          className: "bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: isEnrolled ? "Re-Enroll Face" : "Enroll Face" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  student.fullName,
                  " · ",
                  student.admNo
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  onClick: handleClose,
                  "data-ocid": "face.enroll_close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: mode === "profile" ? "default" : "outline",
                  className: "flex-1 text-xs",
                  onClick: handleSwitchToProfile,
                  "data-ocid": "face.enroll_use_profile_button",
                  children: "Use Profile Photo"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: mode === "camera" ? "default" : "outline",
                  className: "flex-1 text-xs gap-1",
                  onClick: handleSwitchToCamera,
                  "data-ocid": "face.enroll_capture_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                    "Capture Photo"
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 flex flex-col items-center", children: mode === "profile" ? student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: student.photoUrl,
                alt: student.fullName,
                className: "w-40 h-40 rounded-xl object-cover border-2 border-border"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-40 h-40 rounded-xl bg-muted flex flex-col items-center justify-center border-2 border-dashed border-border text-muted-foreground gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center px-4", children: [
                "No profile photo.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                'Use "Capture Photo" instead.'
              ] })
            ] }) : capturedPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: capturedPhoto,
                  alt: "Captured",
                  className: "w-40 h-40 rounded-xl object-cover border-2 border-emerald-400"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setCapturedPhoto(null);
                    startCamera();
                  },
                  className: "absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center",
                  "aria-label": "Retake",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden bg-black aspect-video relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "video",
                  {
                    ref: videoRef,
                    autoPlay: true,
                    playsInline: true,
                    muted: true,
                    className: "w-full h-full object-cover"
                  }
                ),
                camStatus === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-white animate-spin" }) }),
                camStatus === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-7 h-7 text-red-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-xs text-center", children: "Camera permission denied." })
                ] }),
                camStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-xs text-center", children: "Camera unavailable." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "text-white border-white",
                      onClick: startCamera,
                      children: "Retry"
                    }
                  )
                ] })
              ] }),
              camStatus === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "mt-2 w-full gap-1.5",
                  onClick: handleCapture,
                  "data-ocid": "face.enroll_snapshot_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                    "Take Snapshot"
                  ]
                }
              )
            ] }) }),
            saving && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-2 flex items-center gap-2 text-xs text-amber-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
              "Computing face descriptor…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: handleClose,
                  disabled: saving,
                  "data-ocid": "face.enroll_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  className: "flex-1 gap-1.5",
                  disabled: saving || mode === "camera" && !capturedPhoto || mode === "profile" && !student.photoUrl,
                  onClick: handleConfirm,
                  "data-ocid": "face.enroll_confirm_button",
                  children: [
                    saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4" }),
                    isEnrolled ? "Re-Enroll" : "Enroll"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function nowTime() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
function TakeAttendanceTab() {
  var _a;
  const { data: allStudents = [], isLoading: studentsLoading } = useStudents();
  const { data: allSections = [] } = useSections();
  const { data: enrolledStudents = [], isLoading: enrollLoading } = useGetFaceEnrolledStudents();
  const markMutation = useMarkFaceAttendance();
  const {
    status: modelStatus,
    error: modelError,
    load: loadModels
  } = useFaceApiModels();
  reactExports.useEffect(() => {
    loadModels();
  }, [loadModels]);
  const availableClasses = CLASS_ORDER.filter(
    (cl) => allStudents.some((s) => s.classLevel === cl)
  );
  const [classLevel, setClassLevel] = reactExports.useState(
    availableClasses[0] ?? "Class1"
  );
  const [sectionId, setSectionId] = reactExports.useState("");
  const sections = allSections.filter((s) => s.classLevel === classLevel);
  reactExports.useEffect(() => {
    if (sections.length > 0 && !sectionId) setSectionId(sections[0].id);
  }, [sections, sectionId]);
  const studentsInClass = allStudents.filter(
    (s) => s.classLevel === classLevel && s.sectionId === sectionId && !s.isDiscontinued
  );
  const sectionName = ((_a = sections.find((s) => s.id === sectionId)) == null ? void 0 : _a.name) ?? "A";
  const { data: routes = [] } = useRoutes();
  const studentNameMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of allStudents) {
      const sec = allSections.find((sec2) => sec2.id === s.sectionId);
      const route = routes.find((r) => r.id === s.transportRouteId);
      map.set(s.id, {
        name: s.fullName,
        admNo: s.admNo,
        fatherName: s.fatherName,
        classLevel: s.classLevel,
        section: (sec == null ? void 0 : sec.name) ?? "A",
        routeName: (route == null ? void 0 : route.name) ?? "",
        photoUrl: s.photoUrl
      });
    }
    return map;
  }, [allStudents, allSections]);
  const {
    descriptors,
    loading: descriptorLoading,
    progress,
    load: loadDescriptors
  } = useDescriptorLoader(enrolledStudents, studentNameMap);
  reactExports.useEffect(() => {
    if (modelStatus === "ready" && enrolledStudents.length > 0 && descriptors.length === 0) {
      loadDescriptors();
    }
  }, [
    modelStatus,
    enrolledStudents.length,
    descriptors.length,
    loadDescriptors
  ]);
  const todayKey = `face_att_marked_${todayISO()}`;
  const [markedEntries, setMarkedEntries] = reactExports.useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(todayKey) ?? "[]"
      );
    } catch {
      return [];
    }
  });
  const handleMarkPresent = reactExports.useCallback(
    async (match) => {
      if (markedEntries.some((e) => e.studentId === match.studentId)) {
        ue.info(`${match.studentName} is already marked present.`);
        return;
      }
      const time = nowTime();
      const entry = {
        studentId: match.studentId,
        admNo: match.admNo,
        studentName: match.studentName,
        fatherName: match.fatherName,
        classLevel: match.classLevel,
        section: match.section,
        routeName: match.routeName,
        photoUrl: match.photoUrl,
        time,
        confidence: match.confidence
      };
      const updated = [...markedEntries, entry];
      setMarkedEntries(updated);
      localStorage.setItem(todayKey, JSON.stringify(updated));
      ue.success(`${match.studentName} marked Present`);
      try {
        await markMutation.mutateAsync({
          studentId: match.studentId,
          studentName: match.studentName,
          classLevel: match.classLevel,
          section: match.section,
          confidence: match.confidence
        });
      } catch {
      }
    },
    [markedEntries, markMutation, todayKey]
  );
  if (studentsLoading || enrollLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "face.take_attendance_tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "fa-class",
            className: "text-xs font-medium text-muted-foreground",
            children: "Class"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: classLevel,
            onValueChange: (v) => {
              var _a2;
              const cl = v;
              setClassLevel(cl);
              const secs = allSections.filter((s) => s.classLevel === cl);
              setSectionId(((_a2 = secs[0]) == null ? void 0 : _a2.id) ?? "");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "fa-class",
                  className: "w-36",
                  "data-ocid": "face.class_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: availableClasses.map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cl, children: getClassLabel(cl) }, cl)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "fa-section",
            className: "text-xs font-medium text-muted-foreground",
            children: "Section"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: sectionId,
            onValueChange: setSectionId,
            disabled: sections.length <= 1,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "fa-section",
                  className: "w-28",
                  "data-ocid": "face.section_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Section" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sections.map((sec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: sec.id, children: [
                "Section ",
                sec.name
              ] }, sec.id)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-end gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-700 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
          markedEntries.filter(
            (e) => e.classLevel === classLevel && e.section === sectionName
          ).length,
          " ",
          "marked today"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "/ ",
          studentsInClass.length,
          " in class"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FaceRecognitionCamera,
      {
        students: studentsInClass,
        descriptors,
        descriptorLoading,
        descriptorProgress: progress,
        modelStatus,
        modelError,
        onRetryModels: loadModels,
        onMarkPresent: handleMarkPresent,
        markedEntries: markedEntries.filter(
          (e) => e.classLevel === classLevel && e.section === sectionName
        ),
        enrolledCount: enrolledStudents.length,
        enrolledLoading: enrollLoading
      }
    )
  ] });
}
function EnrollStudentsTab() {
  const { data: allStudents = [], isLoading } = useStudents();
  const { data: enrolledStudents = [] } = useGetFaceEnrolledStudents();
  useEnrollStudentFace();
  const revokeMutation = useRevokeStudentFace();
  const [search, setSearch] = reactExports.useState("");
  const [enrollingStudent, setEnrollingStudent] = reactExports.useState(
    null
  );
  const enrolledIds = reactExports.useMemo(
    () => new Set(enrolledStudents.map((e) => e.studentId)),
    [enrolledStudents]
  );
  const activeStudents = allStudents.filter((s) => !s.isDiscontinued);
  const filtered = search.trim() ? activeStudents.filter(
    (s) => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
  ) : activeStudents;
  const enrolledCount = activeStudents.filter(
    (s) => enrolledIds.has(s.id)
  ).length;
  const handleRevoke = async (student) => {
    try {
      await revokeMutation.mutateAsync(student.id);
      ue.success(`Face enrollment removed for ${student.fullName}`);
    } catch (e) {
      ue.error(
        e instanceof Error ? e.message : "Failed to revoke enrollment"
      );
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "face.enroll_section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-emerald-700", children: enrolledCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Enrolled" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-amber-700", children: activeStudents.length - enrolledCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Not Enrolled" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: activeStudents.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total Students" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by name or admission number…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-8 text-sm",
          "data-ocid": "face.enroll_search_input"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-10 text-muted-foreground",
        "data-ocid": "face.enroll_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 mb-2 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No students found." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
        "Adm No",
        "Student Name",
        "Class",
        "Status",
        "Action"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((student, i) => {
        const isEnrolled = enrolledIds.has(student.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            "data-ocid": `face.enroll_student_row.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs tabular-nums", children: student.admNo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: student.photoUrl,
                    alt: student.fullName,
                    className: "w-8 h-8 rounded-full object-cover border border-border"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary", children: getInitials(student.fullName) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[160px]", children: student.fullName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs", children: getClassLabel(student.classLevel) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: isEnrolled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3 h-3" }),
                "Enrolled"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-muted-foreground",
                  children: "Not Enrolled"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-7 px-2.5 text-xs gap-1",
                    onClick: () => setEnrollingStudent(student),
                    "data-ocid": `face.enroll_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-3 h-3" }),
                      isEnrolled ? "Re-Enroll" : "Enroll"
                    ]
                  }
                ),
                isEnrolled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-7 px-2.5 text-xs text-red-700 border-red-300 hover:bg-red-50",
                    onClick: () => handleRevoke(student),
                    disabled: revokeMutation.isPending,
                    "data-ocid": `face.revoke_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                  }
                )
              ] }) })
            ]
          },
          student.id
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: enrollingStudent && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnrollFaceDialog,
      {
        student: enrollingStudent,
        isEnrolled: enrolledIds.has(enrollingStudent.id),
        onClose: () => setEnrollingStudent(null),
        onEnrolled: () => setEnrollingStudent(null)
      },
      enrollingStudent.id
    ) })
  ] });
}
function FaceAttendancePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "face_attendance.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-5 h-5 text-violet-700" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Face Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Auto-recognition with face-api.js •",
          " ",
          formatDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0])
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        defaultValue: "take",
        className: "space-y-4",
        "data-ocid": "face_attendance.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-auto gap-1 p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "take",
                className: "gap-1.5",
                "data-ocid": "face_attendance.take_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-3.5 h-3.5" }),
                  "Take Attendance"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "enroll",
                className: "gap-1.5",
                "data-ocid": "face_attendance.enroll_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
                  "Enroll Students"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "take", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TakeAttendanceTab, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "enroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EnrollStudentsTab, {}) })
        ]
      }
    )
  ] });
}
export {
  FaceAttendancePage as default
};
