import { a3 as useActor, r as reactExports, j as jsxRuntimeExports, a4 as CreditCard, a5 as useStudents, a6 as useRoutes, e as Button, Z as getInitials, a7 as getClassLabel, a8 as useSections, C as CLASS_ORDER, I as Input, U as Users, a9 as motion, aa as LogOut, a0 as formatDate, l as LoaderCircle, X, F as ue, ab as downloadCSV, ac as __vitePreload, ad as createActor } from "./index-pMBTUEbj.js";
import { U as UserCheck, A as AnimatePresence, a as AttendancePopup, u as useFaceApiModels, b as useGetFaceEnrolledStudents, c as useDescriptorLoader, F as FaceRecognitionCamera, d as useEnrollStudentFace, e as useRevokeStudentFace } from "./FaceRecognitionCamera-DQcxiDMy.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { S as Settings2 } from "./settings-2-CEQY6662.js";
import { S as ScanFace } from "./scan-face-CGhu3Srl.js";
import { Q as QrCode } from "./qr-code-DNnozSRw.js";
import { F as Fingerprint } from "./fingerprint-BPTexPY7.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-DUIdHMSc.js";
import { C as Camera } from "./camera-owTlFa42.js";
import { C as CircleCheckBig } from "./circle-check-big-DCQRnxmS.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { L as LogIn } from "./log-in-BmE0y2mz.js";
import { D as Download } from "./download-BHLO7mQe.js";
import "./triangle-alert-Ai_hY88N.js";
import "./refresh-cw-BgXF1ld8.js";
import "./calendar-CAegGMND.js";
import "./index-Nv6ob_Pe.js";
function buildMatchFromStudent(student, routeName) {
  const now = /* @__PURE__ */ new Date();
  const timestamp = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  return {
    studentId: student.id,
    admNo: student.admNo,
    studentName: student.fullName,
    fatherName: student.fatherName,
    classLevel: student.classLevel,
    section: student.sectionId,
    routeName,
    photoUrl: student.photoUrl,
    confidence: 1,
    timestamp
  };
}
const DEVICE_CONFIG = {
  Face: {
    label: "Face Attendance",
    icon: ScanFace,
    color: "text-violet-700",
    bg: "bg-violet-50",
    tab: "face"
  },
  RFID: {
    label: "RFID Attendance",
    icon: CreditCard,
    color: "text-sky-700",
    bg: "bg-sky-50",
    tab: "rfid"
  },
  ESSLBiometric: {
    label: "ESSL Biometric",
    icon: Fingerprint,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    tab: "essl"
  },
  QR: {
    label: "QR Scanner",
    icon: QrCode,
    color: "text-amber-700",
    bg: "bg-amber-50",
    tab: "qr"
  }
};
function QRScannerTab() {
  const { data: allStudents = [] } = useStudents();
  const { data: routes = [] } = useRoutes();
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const scanIntervalRef = reactExports.useRef(null);
  const popupTimerRef = reactExports.useRef(null);
  const [camStatus, setCamStatus] = reactExports.useState("idle");
  const [lastError, setLastError] = reactExports.useState(null);
  const [pendingMatch, setPendingMatch] = reactExports.useState(
    null
  );
  const [markedEntries, setMarkedEntries] = reactExports.useState([]);
  const markedIds = reactExports.useMemo(
    () => new Set(markedEntries.map((e) => e.studentId)),
    [markedEntries]
  );
  const getRouteName = reactExports.useCallback(
    (student) => {
      var _a;
      if (!student.transportRouteId) return "";
      return ((_a = routes.find((r) => r.id === student.transportRouteId)) == null ? void 0 : _a.name) ?? "";
    },
    [routes]
  );
  const startCamera = reactExports.useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    setLastError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
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
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    for (const t of ((_a = streamRef.current) == null ? void 0 : _a.getTracks()) ?? []) t.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamStatus("idle");
  }, []);
  reactExports.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [startCamera, stopCamera]);
  reactExports.useEffect(() => {
    if (camStatus !== "active") return;
    const scanFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;
      const w = video.videoWidth || 320;
      const h = video.videoHeight || 240;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      try {
        const BarcodeDetector = window.BarcodeDetector;
        if (!BarcodeDetector) {
          setLastError(
            "QR scanning requires Chrome or Edge. Use manual entry instead."
          );
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          return;
        }
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const codes = await detector.detect(canvas);
        if (!codes.length) return;
        const admNo = codes[0].rawValue.trim();
        const student = allStudents.find(
          (s) => s.admNo === admNo && !s.isDiscontinued
        );
        if (!student) {
          setLastError(`Admission no. "${admNo}" not found`);
          setTimeout(() => setLastError(null), 2500);
          return;
        }
        if (markedIds.has(student.id)) return;
        const routeName = getRouteName(student);
        const match = buildMatchFromStudent(student, routeName);
        setMarkedEntries((prev) => [...prev, match]);
        setPendingMatch(match);
        setLastError(null);
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
        popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3e3);
        ue.success(`${student.fullName} marked via QR`);
      } catch {
      }
    };
    scanIntervalRef.current = setInterval(scanFrame, 600);
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [camStatus, allStudents, markedIds, getRouteName]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "attendance.qr_section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-5 h-5 text-amber-700" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "QR Scanner Attendance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Point camera at student QR code — attendance marks automatically" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full", children: [
        markedEntries.length,
        " marked"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-black aspect-video", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              autoPlay: true,
              playsInline: true,
              muted: true,
              className: "w-full h-full object-cover",
              "data-ocid": "attendance.qr_camera_feed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" }),
          camStatus === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: "Starting camera…" })
          ] }),
          camStatus === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-10 h-10 text-red-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm text-center", children: "Camera permission denied." })
          ] }),
          camStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-10 h-10 text-red-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "text-white border-white",
                onClick: startCamera,
                "data-ocid": "attendance.qr_camera_retry_button",
                children: "Retry"
              }
            )
          ] }),
          camStatus === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-10 h-10 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "text-white border-white",
                onClick: startCamera,
                "data-ocid": "attendance.qr_start_camera_button",
                children: "Start Camera"
              }
            )
          ] }),
          camStatus === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-[20%] border-2 border-amber-400/70 rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[20%] left-[20%] w-5 h-5 border-t-3 border-l-3 border-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[20%] right-[20%] w-5 h-5 border-t-3 border-r-3 border-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[20%] left-[20%] w-5 h-5 border-b-3 border-l-3 border-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[20%] right-[20%] w-5 h-5 border-b-3 border-r-3 border-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 rounded-full px-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-medium", children: "Scanning for QR…" })
            ] })
          ] }),
          lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-full", children: lastError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-2 h-2 rounded-full ${camStatus === "active" ? "bg-amber-500 animate-pulse" : "bg-muted-foreground"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: camStatus === "active" ? "Scanning active" : "Camera off" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "ml-auto h-7 px-2.5 text-xs gap-1",
              onClick: camStatus === "active" ? stopCamera : startCamera,
              "data-ocid": "attendance.qr_camera_toggle_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3 h-3" }),
                camStatus === "active" ? "Stop" : "Start",
                " Camera"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-3 pb-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "How QR codes work:" }),
          " ",
          "Print the student's QR (from Student Profile → Print QR) showing their Admission Number. When scanned, attendance is marked instantly with the large popup notification."
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-4 h-4 text-amber-600" }),
          "QR Attendance Today",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full", children: markedEntries.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: markedEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
            "data-ocid": "attendance.qr_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-8 h-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center px-4", children: [
                "No QR scans yet.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Show a student QR code to the camera."
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-[400px] overflow-y-auto", children: markedEntries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2.5 px-4 py-2.5",
            "data-ocid": `attendance.qr_entry.${i + 1}`,
            children: [
              entry.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: entry.photoUrl,
                  alt: entry.studentName,
                  className: "w-9 h-9 rounded-full object-cover border-2 border-amber-300 shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0", children: getInitials(entry.studentName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: entry.studentName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  entry.admNo,
                  " •",
                  " ",
                  getClassLabel(entry.classLevel)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-emerald-600 shrink-0" })
            ]
          },
          entry.studentId
        )) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: pendingMatch && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttendancePopup,
      {
        match: pendingMatch,
        onClose: () => setPendingMatch(null),
        deviceLabel: "QR Scanner"
      }
    ) })
  ] });
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
function dayOfWeek(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "long" });
}
function lsKey(device, date) {
  return `device_att_${device}_${date}`;
}
function loadRecords(device, date) {
  try {
    const raw = localStorage.getItem(lsKey(device, date));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveRecords(device, date, recs) {
  localStorage.setItem(lsKey(device, date), JSON.stringify(recs));
}
function StatusBadge({
  status
}) {
  if (!status) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" });
  const variants = {
    Present: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Absent: "bg-red-100 text-red-800 border-red-200",
    "Half Day": "bg-amber-100 text-amber-800 border-amber-200"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[status] ?? ""}`,
      children: status
    }
  );
}
function useCameraStream(active) {
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const [status, setStatus] = reactExports.useState("idle");
  const startCamera = reactExports.useCallback(async () => {
    if (streamRef.current) return;
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (err) {
      const e = err;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);
  const stopCamera = reactExports.useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
  }, []);
  reactExports.useEffect(() => {
    if (active) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [active, startCamera, stopCamera]);
  const capture = reactExports.useCallback(() => {
    const video = videoRef.current;
    if (!video || status !== "active") return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  }, [status]);
  return { videoRef, status, startCamera, stopCamera, capture };
}
function EnrollModal({ student, onClose, onEnrolled }) {
  const [mode, setMode] = reactExports.useState("profile");
  const [capturedPhoto, setCapturedPhoto] = reactExports.useState(null);
  const { videoRef, status, startCamera, stopCamera, capture } = useCameraStream(mode === "camera" && !capturedPhoto);
  const handleCapture = () => {
    const dataUrl = capture();
    if (dataUrl) {
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };
  const handleConfirmEnroll = async () => {
    const photo = mode === "profile" ? student.photoUrl : capturedPhoto ?? "";
    if (!photo) {
      ue.error(
        "No photo available. Please capture a photo or add a profile photo."
      );
      return;
    }
    let descriptorJson = "";
    try {
      const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = photo;
      await new Promise((res) => {
        img.onload = () => res();
        img.onerror = () => res();
      });
      const det = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (det == null ? void 0 : det.descriptor) {
        descriptorJson = JSON.stringify(Array.from(det.descriptor));
      }
    } catch {
    }
    const rec = {
      studentId: student.id,
      admNo: student.admNo,
      studentName: student.fullName,
      enrolledBy: "Admin",
      photoUrl: photo,
      descriptorJson,
      date: todayISO()
    };
    onEnrolled(rec);
    ue.success(`${student.fullName} enrolled successfully`);
    onClose();
  };
  mode === "profile" ? student.photoUrl : capturedPhoto;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
      "data-ocid": "face.enroll_modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          className: "bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Enroll Face" }),
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
                  onClick: onClose,
                  "data-ocid": "face.enroll_modal_close_button",
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
                  onClick: () => {
                    setMode("profile");
                    stopCamera();
                    setCapturedPhoto(null);
                  },
                  className: "flex-1 text-xs",
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
                  onClick: () => {
                    setMode("camera");
                    setCapturedPhoto(null);
                  },
                  className: "flex-1 text-xs",
                  "data-ocid": "face.enroll_capture_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5 mr-1" }),
                    "Capture New Photo"
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: mode === "profile" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3", children: student.photoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                'Use "Capture New Photo" instead.'
              ] })
            ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-3", children: capturedPhoto ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
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
                  },
                  className: "absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center",
                  "aria-label": "Retake photo",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
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
                status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-sm animate-pulse", children: "Starting camera…" }) }),
                status === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8 text-red-400 mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-xs text-center", children: [
                    "Camera permission denied.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Please allow camera access in browser settings."
                  ] })
                ] }),
                status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-xs text-center", children: [
                    "Camera not available.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "Try again or use profile photo."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "mt-2 text-white border-white",
                      onClick: startCamera,
                      children: "Retry"
                    }
                  )
                ] })
              ] }),
              status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: handleCapture,
                  className: "mt-2 w-full gap-1.5",
                  "data-ocid": "face.enroll_snapshot_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                    "Take Snapshot"
                  ]
                }
              )
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: onClose,
                  "data-ocid": "face.enroll_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  className: "flex-1",
                  disabled: mode === "camera" && !capturedPhoto,
                  onClick: handleConfirmEnroll,
                  "data-ocid": "face.enroll_confirm_button",
                  children: "Confirm Enroll"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function FaceEnrollTab() {
  const { data: allStudents = [] } = useStudents();
  const {
    data: enrolledFaces = [],
    isLoading: enrolledLoading,
    refetch: refetchEnrolled
  } = useGetFaceEnrolledStudents();
  const { mutateAsync: enrollFaceBackend } = useEnrollStudentFace();
  const { mutateAsync: revokeFaceBackend } = useRevokeStudentFace();
  const [enrollingStudent, setEnrollingStudent] = reactExports.useState(
    null
  );
  const [search, setSearch] = reactExports.useState("");
  const [bulkProgress, setBulkProgress] = reactExports.useState({ active: false, current: 0, total: 0, failed: 0 });
  const enrolledIds = reactExports.useMemo(
    () => new Set(enrolledFaces.map((e) => e.studentId)),
    [enrolledFaces]
  );
  const handleEnrolled = async (rec) => {
    try {
      await enrollFaceBackend({
        studentId: rec.studentId,
        admNo: rec.admNo,
        enrolledBy: rec.enrolledBy,
        photoUrl: rec.photoUrl,
        descriptorJson: rec.descriptorJson
      });
      await refetchEnrolled();
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Enrollment save failed");
    }
  };
  const handleRevoke = async (studentId) => {
    try {
      await revokeFaceBackend(studentId);
      await refetchEnrolled();
      ue.success("Face enrollment removed");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Revoke failed");
    }
  };
  const handleBulkAutoEnroll = async () => {
    const faceapi = await __vitePreload(() => import("./face-api.esm-DrfIR0ne.js"), true ? [] : void 0);
    const unenrolled = activeStudents.filter(
      (s) => !enrolledIds.has(s.id) && s.photoUrl
    );
    if (unenrolled.length === 0) {
      ue.info("All students with profile photos are already enrolled.");
      return;
    }
    setBulkProgress({
      active: true,
      current: 0,
      total: unenrolled.length,
      failed: 0
    });
    let failed = 0;
    for (let i = 0; i < unenrolled.length; i++) {
      const student = unenrolled[i];
      setBulkProgress((p) => ({ ...p, current: i + 1 }));
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = student.photoUrl;
        await new Promise((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error("img load failed"));
          setTimeout(() => rej(new Error("timeout")), 8e3);
        });
        const det = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        const descriptorJson = (det == null ? void 0 : det.descriptor) ? JSON.stringify(Array.from(det.descriptor)) : "";
        if (!descriptorJson) {
          failed++;
          continue;
        }
        await enrollFaceBackend({
          studentId: student.id,
          admNo: student.admNo,
          enrolledBy: "Admin (Auto)",
          photoUrl: student.photoUrl,
          descriptorJson
        });
      } catch {
        failed++;
      }
    }
    await refetchEnrolled();
    setBulkProgress((p) => ({ ...p, active: false, failed }));
    ue.success(
      `Bulk enrollment complete. ${unenrolled.length - failed} enrolled, ${failed} failed (no face detected).`
    );
  };
  const activeStudents = allStudents.filter((s) => !s.isDiscontinued);
  const filtered = search.trim() ? activeStudents.filter(
    (s) => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
  ) : activeStudents;
  const enrolledCount = activeStudents.filter(
    (s) => enrolledIds.has(s.id)
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "face.enroll_section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-emerald-700", children: enrolledLoading ? "…" : enrolledCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Enrolled" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-amber-700", children: enrolledLoading ? "…" : activeStudents.length - enrolledCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Not Enrolled" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: activeStudents.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total Students" })
      ] }) })
    ] }),
    activeStudents.filter((s) => !enrolledIds.has(s.id) && s.photoUrl).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-violet-200 bg-violet-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: bulkProgress.active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-violet-700 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-violet-800", children: [
          "Enrolling student ",
          bulkProgress.current,
          " of",
          " ",
          bulkProgress.total,
          "…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 rounded-full bg-violet-200 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-violet-600 rounded-full transition-all",
            style: {
              width: `${bulkProgress.current / bulkProgress.total * 100}%`
            }
          }
        ) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-violet-800", children: "Auto-Enroll from Profile Photos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-violet-700 mt-0.5", children: [
          activeStudents.filter(
            (s) => !enrolledIds.has(s.id) && s.photoUrl
          ).length,
          " ",
          "students have profile photos but are not enrolled"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "gap-1.5 bg-violet-600 hover:bg-violet-700 text-white shrink-0",
          onClick: handleBulkAutoEnroll,
          "data-ocid": "face.bulk_enroll_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-3.5 h-3.5" }),
            "Auto-Enroll All"
          ]
        }
      )
    ] }) }) }),
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: enrolledLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-10 gap-2 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Loading enrollment data…" })
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: isEnrolled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3 h-3" }),
                "Enrolled"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border", children: student.photoUrl ? "Not Enrolled" : "No Photo" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-7 px-2.5 text-xs gap-1",
                    onClick: () => setEnrollingStudent(student),
                    disabled: !student.photoUrl,
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
                    onClick: () => handleRevoke(student.id),
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
      EnrollModal,
      {
        student: enrollingStudent,
        onClose: () => setEnrollingStudent(null),
        onEnrolled: handleEnrolled
      }
    ) })
  ] });
}
function FaceAttendanceRecordTab() {
  const { data: allStudents = [] } = useStudents();
  const { data: routes = [] } = useRoutes();
  const {
    status: modelStatus,
    error: modelError,
    load: loadModels
  } = useFaceApiModels();
  const { data: enrolledFaces = [], isLoading: enrolledLoading } = useGetFaceEnrolledStudents();
  const studentInfoMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of allStudents) {
      const route = routes.find((r) => r.id === s.transportRouteId);
      map.set(s.id, {
        name: s.fullName,
        admNo: s.admNo,
        fatherName: s.fatherName,
        classLevel: s.classLevel,
        section: s.sectionId,
        routeName: (route == null ? void 0 : route.name) ?? "",
        photoUrl: s.photoUrl
      });
    }
    for (const e of enrolledFaces) {
      if (!map.has(e.studentId) && e.admNo) {
        const match = allStudents.find((s) => s.admNo === e.admNo);
        if (match) {
          const route = routes.find((r) => r.id === match.transportRouteId);
          map.set(e.studentId, {
            name: match.fullName,
            admNo: match.admNo,
            fatherName: match.fatherName,
            classLevel: match.classLevel,
            section: match.sectionId,
            routeName: (route == null ? void 0 : route.name) ?? "",
            photoUrl: match.photoUrl || e.photoUrl
          });
        }
      }
    }
    return map;
  }, [allStudents, routes, enrolledFaces]);
  const {
    descriptors,
    loading: descriptorLoading,
    progress: descriptorProgress,
    load: loadDescriptors
  } = useDescriptorLoader(enrolledFaces, studentInfoMap);
  reactExports.useEffect(() => {
    loadModels();
  }, [loadModels]);
  reactExports.useEffect(() => {
    if (modelStatus === "ready" && enrolledFaces.length > 0) {
      loadDescriptors();
    }
  }, [modelStatus, enrolledFaces.length, loadDescriptors]);
  const [markedEntries, setMarkedEntries] = reactExports.useState([]);
  const handleMarkPresent = reactExports.useCallback(
    (match) => {
      if (markedEntries.some((e) => e.studentId === match.studentId)) return;
      const now = /* @__PURE__ */ new Date();
      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      setMarkedEntries((prev) => [
        ...prev,
        {
          studentId: match.studentId,
          admNo: match.admNo,
          studentName: match.studentName,
          classLevel: match.classLevel,
          section: match.section,
          routeName: match.routeName,
          photoUrl: match.photoUrl,
          time,
          confidence: match.confidence
        }
      ]);
    },
    [markedEntries]
  );
  const activeStudents = allStudents.filter((s) => !s.isDiscontinued);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FaceRecognitionCamera,
    {
      students: activeStudents,
      descriptors,
      descriptorLoading,
      descriptorProgress,
      modelStatus,
      modelError,
      onRetryModels: loadModels,
      onMarkPresent: handleMarkPresent,
      markedEntries,
      enrolledCount: enrolledFaces.length,
      enrolledLoading
    }
  );
}
function FaceTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "record", className: "space-y-4", "data-ocid": "face.sub_tabs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-auto gap-1 p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsTrigger,
        {
          value: "record",
          className: "gap-1.5",
          "data-ocid": "face.record_tab",
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
          "data-ocid": "face.enroll_tab",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
            "Enroll Students"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "record", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaceAttendanceRecordTab, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "enroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollTab, {}) })
  ] });
}
function DeviceAttendanceTab({ device }) {
  var _a;
  const cfg = DEVICE_CONFIG[device];
  const DeviceIcon = cfg.icon;
  const { data: allStudents = [] } = useStudents();
  const { data: allSections = [] } = useSections();
  const availableClasses = CLASS_ORDER.filter(
    (cl) => allStudents.some((s) => s.classLevel === cl)
  );
  const [date, setDate] = reactExports.useState(todayISO());
  const [classLevel, setClassLevel] = reactExports.useState(
    availableClasses[0] ?? "Class1"
  );
  const [sectionId, setSectionId] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [records, setRecords] = reactExports.useState([]);
  const [flashId, setFlashId] = reactExports.useState(null);
  const sections = allSections.filter((s) => s.classLevel === classLevel);
  const sectionsRef = reactExports.useRef(sections);
  sectionsRef.current = sections;
  const sectionsLen = sections.length;
  reactExports.useEffect(() => {
    const secs = sectionsRef.current;
    if (secs.length > 0 && !sectionId) {
      setSectionId(secs[0].id);
    }
  }, [sectionsLen, sectionId]);
  reactExports.useEffect(() => {
    setRecords(loadRecords(device, date));
  }, [device, date]);
  const handleClassChange = (val) => {
    var _a2;
    const cl = val;
    setClassLevel(cl);
    const secs = allSections.filter((s) => s.classLevel === cl);
    setSectionId(((_a2 = secs[0]) == null ? void 0 : _a2.id) ?? "");
  };
  const students = allStudents.filter(
    (s) => s.classLevel === classLevel && s.sectionId === sectionId && !s.isDiscontinued
  );
  const sectionName = ((_a = sections.find((s) => s.id === sectionId)) == null ? void 0 : _a.name) ?? "A";
  const filtered = search.trim() ? students.filter(
    (s) => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
  ) : students;
  function getRecord(studentId) {
    return records.find((r) => r.studentId === studentId);
  }
  function markIn(student) {
    const existing = getRecord(student.id);
    if (existing) return;
    const newRec = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      classLevel: student.classLevel,
      section: sectionName,
      admNo: student.admNo,
      deviceType: device,
      inTime: nowTime(),
      outTime: null,
      date,
      status: "Present"
    };
    const updated = [...records, newRec];
    setRecords(updated);
    saveRecords(device, date, updated);
    setFlashId(student.id);
    setTimeout(() => setFlashId(null), 1200);
    ue.success(`${student.fullName} marked IN`);
  }
  function markOut(student) {
    const existing = getRecord(student.id);
    if (!existing || existing.outTime) return;
    const outTime = nowTime();
    let status = "Present";
    if (existing.inTime) {
      const [ih, im] = existing.inTime.split(":").map(Number);
      const [oh, om] = outTime.split(":").map(Number);
      const diff = oh * 60 + om - (ih * 60 + im);
      if (diff < 240) status = "Half Day";
    }
    const updated = records.map(
      (r) => r.studentId === student.id ? { ...r, outTime, status } : r
    );
    setRecords(updated);
    saveRecords(device, date, updated);
    setFlashId(`${student.id}_out`);
    setTimeout(() => setFlashId(null), 1200);
    ue.success(`${student.fullName} marked OUT`);
  }
  const presentCount = records.filter((r) => r.status === "Present").length;
  const halfDayCount = records.filter((r) => r.status === "Half Day").length;
  const totalStudents = students.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon, { className: `w-5 h-5 ${cfg.color}` })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: cfg.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Track IN / OUT times with ",
          cfg.label
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-700 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 inline-block" }),
          presentCount,
          " Present"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-700 font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 inline-block" }),
          halfDayCount,
          " Half Day"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "/ ",
          totalStudents,
          " Total"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DateInput,
        {
          label: "Date",
          value: date,
          onChange: setDate,
          "data-ocid": `attendance.${cfg.tab}_date_input`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: `${cfg.tab}-class`,
            className: "text-xs font-medium text-muted-foreground",
            children: "Class"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classLevel, onValueChange: handleClassChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              id: `${cfg.tab}-class`,
              className: "w-36",
              "data-ocid": `attendance.${cfg.tab}_class_select`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: availableClasses.map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cl, children: getClassLabel(cl) }, cl)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: `${cfg.tab}-section`,
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
                  id: `${cfg.tab}-section`,
                  className: "w-28",
                  "data-ocid": `attendance.${cfg.tab}_section_select`,
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: `${cfg.tab}-search`,
            className: "text-xs font-medium text-muted-foreground",
            children: "Search Student"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `${cfg.tab}-search`,
              placeholder: "Name or Adm No…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-8 text-sm",
              "data-ocid": `attendance.${cfg.tab}_search_input`
            }
          )
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
        "data-ocid": `attendance.${cfg.tab}_empty_state`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 mb-2 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No students found." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
        "Roll No",
        "Student Name",
        "IN Time",
        "OUT Time",
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
        const rec = getRecord(student.id);
        const isFlashIn = flashId === student.id;
        const isFlashOut = flashId === `${student.id}_out`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.tr,
          {
            initial: { opacity: 0, x: -8 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: i * 0.03 },
            className: [
              "border-b border-border last:border-0 transition-colors",
              isFlashIn ? "bg-emerald-50" : isFlashOut ? "bg-sky-50" : "hover:bg-muted/20"
            ].join(" "),
            "data-ocid": `attendance.${cfg.tab}_student_row.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground tabular-nums", children: student.admNo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0", children: getInitials(student.fullName) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[140px]", children: student.fullName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums", children: (rec == null ? void 0 : rec.inTime) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-700 font-semibold text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3.5 h-3.5" }),
                rec.inTime
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums", children: (rec == null ? void 0 : rec.outTime) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-red-700 font-semibold text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
                rec.outTime
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: (rec == null ? void 0 : rec.status) ?? null }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    disabled: !!(rec == null ? void 0 : rec.inTime),
                    onClick: () => markIn(student),
                    className: "h-7 px-2.5 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 disabled:opacity-40",
                    "data-ocid": `attendance.${cfg.tab}_mark_in_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3 h-3" }),
                      "IN"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    disabled: !(rec == null ? void 0 : rec.inTime) || !!(rec == null ? void 0 : rec.outTime),
                    onClick: () => markOut(student),
                    className: "h-7 px-2.5 text-xs gap-1 text-red-700 border-red-300 hover:bg-red-50 disabled:opacity-40",
                    "data-ocid": `attendance.${cfg.tab}_mark_out_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3 h-3" }),
                      "OUT"
                    ]
                  }
                )
              ] }) })
            ]
          },
          student.id
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: records.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon, { className: `w-4 h-4 ${cfg.color}` }),
            "Today's Records — ",
            formatDate(date),
            " (",
            records.length,
            " ",
            "entries)"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
              "Roll No",
              "Student Name",
              "Class",
              "Section",
              "IN Time",
              "OUT Time",
              "Status"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-left px-4 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: records.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 hover:bg-muted/20",
                "data-ocid": `attendance.${cfg.tab}_record_row.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 tabular-nums text-muted-foreground text-xs", children: rec.admNo }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-medium", children: rec.studentName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: getClassLabel(rec.classLevel) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: rec.section }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 tabular-nums text-emerald-700 font-semibold text-xs", children: rec.inTime ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 tabular-nums text-red-700 font-semibold text-xs", children: rec.outTime ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: rec.status }) })
                ]
              },
              rec.id
            )) })
          ] }) }) })
        ] })
      }
    ) })
  ] });
}
function buildSummaryRecords(fromDate, toDate, filterClass, filterSection, filterDevice) {
  const allRecords = [];
  const allDeviceTypes = [
    "Face",
    "RFID",
    "ESSLBiometric",
    "QR"
  ];
  for (const device of allDeviceTypes) {
    const key = `device_att_${device}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(key)) continue;
      const dateStr = k.replace(key, "");
      if (dateStr < fromDate || dateStr > toDate) continue;
      try {
        const recs = JSON.parse(
          localStorage.getItem(k) ?? "[]"
        );
        allRecords.push(...recs);
      } catch {
      }
    }
  }
  return allRecords.filter((r) => {
    if (filterClass !== "All" && r.classLevel !== filterClass) return false;
    if (filterSection !== "All" && r.section !== filterSection) return false;
    if (filterDevice !== "All" && r.deviceType !== filterDevice) return false;
    return true;
  });
}
function AttendanceSummaryTab() {
  const [fromDate, setFromDate] = reactExports.useState(`${(/* @__PURE__ */ new Date()).getFullYear()}-04-01`);
  const [toDate, setToDate] = reactExports.useState(todayISO());
  const [filterClass, setFilterClass] = reactExports.useState("All");
  const [filterSection, setFilterSection] = reactExports.useState("All");
  const [filterDevice, setFilterDevice] = reactExports.useState(
    "All"
  );
  const [exportSuccess, setExportSuccess] = reactExports.useState(false);
  const allRecords = reactExports.useMemo(
    () => buildSummaryRecords(
      fromDate,
      toDate,
      filterClass,
      filterSection,
      filterDevice
    ),
    [fromDate, toDate, filterClass, filterSection, filterDevice]
  );
  const sections = filterClass !== "All" ? [
    ...new Set(
      allRecords.filter((r) => r.classLevel === filterClass).map((r) => r.section)
    )
  ] : [];
  const presentCount = allRecords.filter((r) => r.status === "Present").length;
  const halfDayCount = allRecords.filter((r) => r.status === "Half Day").length;
  const handleExport = () => {
    const rows = allRecords.map((r) => {
      var _a;
      return {
        Date: formatDate(r.date),
        Day: dayOfWeek(r.date),
        "Roll No": r.admNo,
        "Student Name": r.studentName,
        Class: getClassLabel(r.classLevel),
        Section: r.section,
        "IN Time": r.inTime ?? "",
        "OUT Time": r.outTime ?? "",
        "Device Type": ((_a = DEVICE_CONFIG[r.deviceType]) == null ? void 0 : _a.label) ?? r.deviceType,
        Status: r.status
      };
    });
    downloadCSV(rows, `attendance-report-${toDate}.csv`);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3e3);
    ue.success("Attendance report exported successfully");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
      {
        label: "Present Records",
        value: presentCount,
        color: "text-emerald-700"
      },
      {
        label: "Half Day Records",
        value: halfDayCount,
        color: "text-amber-700"
      },
      {
        label: "Total Records",
        value: allRecords.length,
        color: "text-primary"
      }
    ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${color}`, children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
    ] }) }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DateInput,
        {
          label: "From",
          value: fromDate,
          onChange: setFromDate,
          "data-ocid": "attendance.summary_from_date"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DateInput,
        {
          label: "To",
          value: toDate,
          onChange: setToDate,
          "data-ocid": "attendance.summary_to_date"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "summary-class",
            className: "text-xs font-medium text-muted-foreground",
            children: "Class"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filterClass,
            onValueChange: (v) => {
              setFilterClass(v);
              setFilterSection("All");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "summary-class",
                  className: "w-36",
                  "data-ocid": "attendance.summary_class_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Classes" }),
                CLASS_ORDER.map((cl) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cl, children: getClassLabel(cl) }, cl))
              ] })
            ]
          }
        )
      ] }),
      filterClass !== "All" && sections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "summary-section",
            className: "text-xs font-medium text-muted-foreground",
            children: "Section"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSection, onValueChange: setFilterSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              id: "summary-section",
              className: "w-28",
              "data-ocid": "attendance.summary_section_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All" }),
            sections.map((sec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: sec, children: [
              "Section ",
              sec
            ] }, sec))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "summary-device",
            className: "text-xs font-medium text-muted-foreground",
            children: "Device"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filterDevice,
            onValueChange: (v) => setFilterDevice(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "summary-device",
                  className: "w-40",
                  "data-ocid": "attendance.summary_device_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Devices" }),
                ["Face", "RFID", "ESSLBiometric", "QR"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: DEVICE_CONFIG[d].label }, d))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: exportSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.span,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0 },
            className: "flex items-center gap-1.5 text-emerald-700 text-sm font-medium",
            "data-ocid": "attendance.export_success_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
              " Exported!"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleExport,
            "data-ocid": "attendance.export_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "w-3.5 h-3.5" }),
              "Export Excel"
            ]
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 text-primary" }),
        "Attendance Records (",
        allRecords.length,
        " rows)"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            className: "w-full text-sm",
            "data-ocid": "attendance.summary_table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
                "Date",
                "Day",
                "Roll No",
                "Student Name",
                "Class",
                "Section",
                "IN Time",
                "OUT Time",
                "Device",
                "Status"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap",
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allRecords.map((rec, i) => {
                var _a, _b, _c;
                const DeviceIcon = ((_a = DEVICE_CONFIG[rec.deviceType]) == null ? void 0 : _a.icon) ?? ScanFace;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
                    "data-ocid": `attendance.summary_row.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums text-muted-foreground text-xs whitespace-nowrap", children: formatDate(rec.date) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs", children: dayOfWeek(rec.date).slice(0, 3) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums text-muted-foreground text-xs", children: rec.admNo }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium whitespace-nowrap", children: rec.studentName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground whitespace-nowrap", children: getClassLabel(rec.classLevel) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: rec.section }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums text-emerald-700 font-semibold text-xs", children: rec.inTime ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 tabular-nums text-red-700 font-semibold text-xs", children: rec.outTime ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `inline-flex items-center gap-1 text-xs font-medium ${((_b = DEVICE_CONFIG[rec.deviceType]) == null ? void 0 : _b.color) ?? ""}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon, { className: "w-3.5 h-3.5" }),
                            ((_c = DEVICE_CONFIG[rec.deviceType]) == null ? void 0 : _c.label) ?? rec.deviceType
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: rec.status }) })
                    ]
                  },
                  `${rec.id}-${i}`
                );
              }) })
            ]
          }
        ),
        allRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-10 text-muted-foreground",
            "data-ocid": "attendance.summary_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No attendance records for the selected filters." })
            ]
          }
        )
      ] }) })
    ] })
  ] });
}
function AttendancePage() {
  const { actor } = useActor(createActor);
  const [attSettings, setAttSettings] = reactExports.useState({
    face: true,
    rfid: true,
    essl: true,
    qr: true
  });
  const [settingsLoaded, setSettingsLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    async function load() {
      if (!actor) return;
      try {
        const s = await actor.getAttendanceSettings();
        setAttSettings({ face: s.face, rfid: s.rfid, essl: s.essl, qr: s.qr });
      } catch {
      } finally {
        setSettingsLoaded(true);
      }
    }
    load();
  }, [actor]);
  const activeSystems = [
    attSettings.face && "face",
    attSettings.qr && "qr",
    attSettings.rfid && "rfid",
    attSettings.essl && "essl"
  ].filter(Boolean);
  const defaultTab = activeSystems[0] ?? "summary";
  if (!settingsLoaded && !actor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "attendance.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 bg-muted/40 rounded animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-full bg-muted/40 rounded animate-pulse" })
    ] });
  }
  const allInactive = activeSystems.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "attendance.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Attendance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Face, QR Scanner, RFID & ESSL Biometric — all in one place" })
    ] }) }),
    allInactive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 gap-4 rounded-xl border-2 border-dashed border-border bg-muted/20",
        "data-ocid": "attendance.all_inactive.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-12 h-12 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No attendance systems enabled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
              "Go to ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Settings → Attendance" }),
              " to enable at least one attendance method."
            ] })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        defaultValue: defaultTab,
        className: "space-y-4",
        "data-ocid": "attendance.tabs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex flex-wrap h-auto gap-1 p-1", children: [
            attSettings.face && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "face",
                className: "gap-1.5",
                "data-ocid": "attendance.face_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScanFace, { className: "w-3.5 h-3.5" }),
                  "Face"
                ]
              }
            ),
            attSettings.qr && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "qr",
                className: "gap-1.5",
                "data-ocid": "attendance.qr_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-3.5 h-3.5" }),
                  "QR Scanner"
                ]
              }
            ),
            attSettings.rfid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "rfid",
                className: "gap-1.5",
                "data-ocid": "attendance.rfid_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3.5 h-3.5" }),
                  "RFID"
                ]
              }
            ),
            attSettings.essl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "essl",
                className: "gap-1.5",
                "data-ocid": "attendance.essl_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "w-3.5 h-3.5" }),
                  "ESSL Biometric"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "summary",
                className: "gap-1.5",
                "data-ocid": "attendance.summary_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "w-3.5 h-3.5" }),
                  "Summary & Export"
                ]
              }
            )
          ] }),
          attSettings.face && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "face", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaceTab, {}) }),
          attSettings.qr && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "qr", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRScannerTab, {}) }),
          attSettings.rfid && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rfid", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceAttendanceTab, { device: "RFID" }) }),
          attSettings.essl && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "essl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceAttendanceTab, { device: "ESSLBiometric" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AttendanceSummaryTab, {}) })
        ]
      }
    )
  ] });
}
export {
  AttendancePage as default
};
