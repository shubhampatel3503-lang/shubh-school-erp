import { createActor } from "@/backend";
import FaceRecognitionCamera, {
  AttendancePopup,
} from "@/components/attendance/FaceRecognitionCamera";
import DateInput from "@/components/shared/DateInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoutes, useSections, useStudents } from "@/hooks/useBackend";
import {
  useDescriptorLoader,
  useEnrollStudentFace,
  useFaceApiModels,
  useGetFaceEnrolledStudents,
  useRevokeStudentFace,
} from "@/hooks/useFaceRecognition";
import type { RecognitionMatch } from "@/hooks/useFaceRecognition";
import {
  CLASS_ORDER,
  downloadCSV,
  formatDate,
  getClassLabel,
  getInitials,
} from "@/lib/utils";
import type { ClassLevel, DeviceAttendanceRecord, Student } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Camera,
  CheckCircle,
  CreditCard,
  Download,
  FileSpreadsheet,
  Fingerprint,
  Loader2,
  LogIn,
  LogOut,
  QrCode,
  ScanFace,
  Search,
  Settings2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
// Extend local device type to include QR for summary display
type AllDeviceType = "Face" | "RFID" | "ESSLBiometric" | "QR";

interface FaceEnrollmentRecord {
  studentId: string;
  admNo: string;
  studentName: string;
  enrolledBy: string;
  photoUrl: string;
  descriptorJson: string;
  date: string;
}

// Helper to build a RecognitionMatch from a student object
function buildMatchFromStudent(
  student: Student,
  routeName: string,
): RecognitionMatch {
  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return {
    studentId: student.id,
    admNo: student.admNo,
    studentName: student.fullName,
    fatherName: student.fatherName,
    classLevel: student.classLevel as string,
    section: student.sectionId,
    routeName,
    photoUrl: student.photoUrl,
    confidence: 1,
    timestamp,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEVICE_CONFIG: Record<
  AllDeviceType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    tab: string;
  }
> = {
  Face: {
    label: "Face Attendance",
    icon: ScanFace,
    color: "text-violet-700",
    bg: "bg-violet-50",
    tab: "face",
  },
  RFID: {
    label: "RFID Attendance",
    icon: CreditCard,
    color: "text-sky-700",
    bg: "bg-sky-50",
    tab: "rfid",
  },
  ESSLBiometric: {
    label: "ESSL Biometric",
    icon: Fingerprint,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    tab: "essl",
  },
  QR: {
    label: "QR Scanner",
    icon: QrCode,
    color: "text-amber-700",
    bg: "bg-amber-50",
    tab: "qr",
  },
};

type AttendanceDevice = "Face" | "RFID" | "ESSLBiometric";

// ─── QR Scanner Tab ───────────────────────────────────────────────────────────
function QRScannerTab() {
  const { data: allStudents = [] } = useStudents();
  const { data: routes = [] } = useRoutes();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [camStatus, setCamStatus] = useState<
    "idle" | "loading" | "active" | "denied" | "error"
  >("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [pendingMatch, setPendingMatch] = useState<RecognitionMatch | null>(
    null,
  );
  const [markedEntries, setMarkedEntries] = useState<RecognitionMatch[]>([]);
  const markedIds = useMemo(
    () => new Set(markedEntries.map((e) => e.studentId)),
    [markedEntries],
  );

  const getRouteName = useCallback(
    (student: Student) => {
      if (!student.transportRouteId) return "";
      return routes.find((r) => r.id === student.transportRouteId)?.name ?? "";
    },
    [routes],
  );

  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    setLastError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamStatus("active");
    } catch (err) {
      const e = err as DOMException;
      setCamStatus(
        e.name === "NotAllowedError" || e.name === "PermissionDeniedError"
          ? "denied"
          : "error",
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    for (const t of streamRef.current?.getTracks() ?? []) t.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamStatus("idle");
  }, []);

  // Auto-start on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [startCamera, stopCamera]);

  // Scan QR from camera frames when active
  useEffect(() => {
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
        // Use native BarcodeDetector API (Chrome/Android)
        type BD = {
          detect: (src: HTMLCanvasElement) => Promise<{ rawValue: string }[]>;
        };
        const BarcodeDetector = (
          window as unknown as {
            BarcodeDetector?: { new (opts: { formats: string[] }): BD };
          }
        ).BarcodeDetector;
        if (!BarcodeDetector) {
          setLastError(
            "QR scanning requires Chrome or Edge. Use manual entry instead.",
          );
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          return;
        }
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        const codes = await detector.detect(canvas);
        if (!codes.length) return;
        const admNo = codes[0].rawValue.trim();
        const student = allStudents.find(
          (s) => s.admNo === admNo && !s.isDiscontinued,
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
        popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3000);
        toast.success(`${student.fullName} marked via QR`);
      } catch {
        // decode failure — silent
      }
    };
    scanIntervalRef.current = setInterval(scanFrame, 600);
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [camStatus, allStudents, markedIds, getRouteName]);

  return (
    <div className="space-y-4" data-ocid="attendance.qr_section">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <QrCode className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            QR Scanner Attendance
          </h2>
          <p className="text-xs text-muted-foreground">
            Point camera at student QR code — attendance marks automatically
          </p>
        </div>
        <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
          {markedEntries.length} marked
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Camera */}
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              data-ocid="attendance.qr_camera_feed"
            />
            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {camStatus === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">Starting camera…</p>
              </div>
            )}
            {camStatus === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3">
                <Camera className="w-10 h-10 text-red-400" />
                <p className="text-white text-sm text-center">
                  Camera permission denied.
                </p>
              </div>
            )}
            {camStatus === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3">
                <Camera className="w-10 h-10 text-red-400" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-white border-white"
                  onClick={startCamera}
                  data-ocid="attendance.qr_camera_retry_button"
                >
                  Retry
                </Button>
              </div>
            )}
            {camStatus === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3">
                <QrCode className="w-10 h-10 text-muted-foreground" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-white border-white"
                  onClick={startCamera}
                  data-ocid="attendance.qr_start_camera_button"
                >
                  Start Camera
                </Button>
              </div>
            )}

            {/* QR scan bracket overlay */}
            {camStatus === "active" && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-[20%] border-2 border-amber-400/70 rounded-lg" />
                <div className="absolute top-[20%] left-[20%] w-5 h-5 border-t-3 border-l-3 border-amber-400" />
                <div className="absolute top-[20%] right-[20%] w-5 h-5 border-t-3 border-r-3 border-amber-400" />
                <div className="absolute bottom-[20%] left-[20%] w-5 h-5 border-b-3 border-l-3 border-amber-400" />
                <div className="absolute bottom-[20%] right-[20%] w-5 h-5 border-b-3 border-r-3 border-amber-400" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 rounded-full px-3 py-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-white text-xs font-medium">
                    Scanning for QR…
                  </span>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {lastError && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-full">
                {lastError}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${camStatus === "active" ? "bg-amber-500 animate-pulse" : "bg-muted-foreground"}`}
              />
              <span className="text-muted-foreground">
                {camStatus === "active" ? "Scanning active" : "Camera off"}
              </span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-auto h-7 px-2.5 text-xs gap-1"
              onClick={camStatus === "active" ? stopCamera : startCamera}
              data-ocid="attendance.qr_camera_toggle_button"
            >
              <Camera className="w-3 h-3" />
              {camStatus === "active" ? "Stop" : "Start"} Camera
            </Button>
          </div>

          <Card>
            <CardContent className="pt-3 pb-3 px-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  How QR codes work:
                </span>{" "}
                Print the student's QR (from Student Profile → Print QR) showing
                their Admission Number. When scanned, attendance is marked
                instantly with the large popup notification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marked list */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-600" />
              QR Attendance Today
              <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {markedEntries.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {markedEntries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                data-ocid="attendance.qr_empty_state"
              >
                <QrCode className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs text-center px-4">
                  No QR scans yet.
                  <br />
                  Show a student QR code to the camera.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {markedEntries.map((entry, i) => (
                  <div
                    key={entry.studentId}
                    className="flex items-center gap-2.5 px-4 py-2.5"
                    data-ocid={`attendance.qr_entry.${i + 1}`}
                  >
                    {entry.photoUrl ? (
                      <img
                        src={entry.photoUrl}
                        alt={entry.studentName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-amber-300 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                        {getInitials(entry.studentName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {entry.studentName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {entry.admNo} •{" "}
                        {getClassLabel(entry.classLevel as ClassLevel)}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Large attendance popup */}
      <AnimatePresence>
        {pendingMatch && (
          <AttendancePopup
            match={pendingMatch}
            onClose={() => setPendingMatch(null)}
            deviceLabel="QR Scanner"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function nowTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function dayOfWeek(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { weekday: "long" });
}

// ─── Local storage key per device ─────────────────────────────────────────────
function lsKey(device: AttendanceDevice, date: string): string {
  return `device_att_${device}_${date}`;
}

function loadRecords(
  device: AttendanceDevice,
  date: string,
): DeviceAttendanceRecord[] {
  try {
    const raw = localStorage.getItem(lsKey(device, date));
    return raw ? (JSON.parse(raw) as DeviceAttendanceRecord[]) : [];
  } catch {
    return [];
  }
}

function saveRecords(
  device: AttendanceDevice,
  date: string,
  recs: DeviceAttendanceRecord[],
): void {
  localStorage.setItem(lsKey(device, date), JSON.stringify(recs));
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({
  status,
}: { status: DeviceAttendanceRecord["status"] | null }) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  const variants: Record<string, string> = {
    Present: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Absent: "bg-red-100 text-red-800 border-red-200",
    "Half Day": "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
        variants[status] ?? ""
      }`}
    >
      {status}
    </span>
  );
}

// ─── Camera hook ──────────────────────────────────────────────────────────────
function useCameraStream(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "active" | "denied" | "error"
  >("idle");

  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("active");
    } catch (err) {
      const e = err as DOMException;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (active) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [active, startCamera, stopCamera]);

  const capture = useCallback((): string | null => {
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

// ─── Enrollment Modal ─────────────────────────────────────────────────────────
interface EnrollModalProps {
  student: Student;
  onClose: () => void;
  onEnrolled: (rec: FaceEnrollmentRecord) => void;
}

function EnrollModal({ student, onClose, onEnrolled }: EnrollModalProps) {
  const [mode, setMode] = useState<"profile" | "camera">("profile");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { videoRef, status, startCamera, stopCamera, capture } =
    useCameraStream(mode === "camera" && !capturedPhoto);

  const handleCapture = () => {
    const dataUrl = capture();
    if (dataUrl) {
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  // Handle enrollment confirmation — compute descriptor then save to backend
  const handleConfirmEnroll = async () => {
    const photo = mode === "profile" ? student.photoUrl : (capturedPhoto ?? "");
    if (!photo) {
      toast.error(
        "No photo available. Please capture a photo or add a profile photo.",
      );
      return;
    }

    // Compute face descriptor
    let descriptorJson = "";
    try {
      const faceapi = await import("@vladmandic/face-api");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = photo;
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.onerror = () => res();
      });
      const det = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (det?.descriptor) {
        descriptorJson = JSON.stringify(Array.from(det.descriptor));
      }
    } catch {
      // descriptor stays empty — enrollment still works
    }

    const rec: FaceEnrollmentRecord = {
      studentId: student.id,
      admNo: student.admNo,
      studentName: student.fullName,
      enrolledBy: "Admin",
      photoUrl: photo,
      descriptorJson,
      date: todayISO(),
    };
    onEnrolled(rec);
    toast.success(`${student.fullName} enrolled successfully`);
    onClose();
  };

  const _selectedPhoto = mode === "profile" ? student.photoUrl : capturedPhoto;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      data-ocid="face.enroll_modal"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Enroll Face</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {student.fullName} · {student.admNo}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-ocid="face.enroll_modal_close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode selector */}
        <div className="px-5 pt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "profile" ? "default" : "outline"}
              onClick={() => {
                setMode("profile");
                stopCamera();
                setCapturedPhoto(null);
              }}
              className="flex-1 text-xs"
              data-ocid="face.enroll_use_profile_button"
            >
              Use Profile Photo
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "camera" ? "default" : "outline"}
              onClick={() => {
                setMode("camera");
                setCapturedPhoto(null);
              }}
              className="flex-1 text-xs"
              data-ocid="face.enroll_capture_button"
            >
              <Camera className="w-3.5 h-3.5 mr-1" />
              Capture New Photo
            </Button>
          </div>
        </div>

        {/* Photo area */}
        <div className="px-5 py-4">
          {mode === "profile" ? (
            <div className="flex flex-col items-center gap-3">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-40 h-40 rounded-xl object-cover border-2 border-border"
                />
              ) : (
                <div className="w-40 h-40 rounded-xl bg-muted flex flex-col items-center justify-center border-2 border-dashed border-border text-muted-foreground gap-2">
                  <Users className="w-8 h-8 opacity-40" />
                  <p className="text-xs text-center px-4">
                    No profile photo.
                    <br />
                    Use "Capture New Photo" instead.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {capturedPhoto ? (
                <div className="relative">
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    className="w-40 h-40 rounded-xl object-cover border-2 border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedPhoto(null);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label="Retake photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="relative w-full">
                  <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {status === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <span className="text-white text-sm animate-pulse">
                          Starting camera…
                        </span>
                      </div>
                    )}
                    {status === "denied" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
                        <Camera className="w-8 h-8 text-red-400 mb-2" />
                        <p className="text-white text-xs text-center">
                          Camera permission denied.
                          <br />
                          Please allow camera access in browser settings.
                        </p>
                      </div>
                    )}
                    {status === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
                        <p className="text-white text-xs text-center">
                          Camera not available.
                          <br />
                          Try again or use profile photo.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="mt-2 text-white border-white"
                          onClick={startCamera}
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                  {status === "active" && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCapture}
                      className="mt-2 w-full gap-1.5"
                      data-ocid="face.enroll_snapshot_button"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Take Snapshot
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="face.enroll_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={mode === "camera" && !capturedPhoto}
            onClick={handleConfirmEnroll}
            data-ocid="face.enroll_confirm_button"
          >
            Confirm Enroll
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Face Enrollment Tab ──────────────────────────────────────────────────────
function FaceEnrollTab() {
  const { data: allStudents = [] } = useStudents();
  // ── Backend enrollment data ──────────────────────────────────────────────
  const {
    data: enrolledFaces = [],
    isLoading: enrolledLoading,
    refetch: refetchEnrolled,
  } = useGetFaceEnrolledStudents();
  const { mutateAsync: enrollFaceBackend } = useEnrollStudentFace();
  const { mutateAsync: revokeFaceBackend } = useRevokeStudentFace();

  const [enrollingStudent, setEnrollingStudent] = useState<Student | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [bulkProgress, setBulkProgress] = useState<{
    active: boolean;
    current: number;
    total: number;
    failed: number;
  }>({ active: false, current: 0, total: 0, failed: 0 });

  const enrolledIds = useMemo(
    () => new Set(enrolledFaces.map((e) => e.studentId)),
    [enrolledFaces],
  );

  // ── Per-student backend enroll from EnrollModal ──────────────────────────
  const handleEnrolled = async (rec: FaceEnrollmentRecord) => {
    try {
      await enrollFaceBackend({
        studentId: rec.studentId,
        admNo: rec.admNo,
        enrolledBy: rec.enrolledBy,
        photoUrl: rec.photoUrl,
        descriptorJson: rec.descriptorJson,
      });
      await refetchEnrolled();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Enrollment save failed");
    }
  };

  const handleRevoke = async (studentId: string) => {
    try {
      await revokeFaceBackend(studentId);
      await refetchEnrolled();
      toast.success("Face enrollment removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Revoke failed");
    }
  };

  // ── Bulk auto-enroll all students with profile photos ────────────────────
  const handleBulkAutoEnroll = async () => {
    const faceapi = await import("@vladmandic/face-api");
    const unenrolled = activeStudents.filter(
      (s) => !enrolledIds.has(s.id) && s.photoUrl,
    );
    if (unenrolled.length === 0) {
      toast.info("All students with profile photos are already enrolled.");
      return;
    }
    setBulkProgress({
      active: true,
      current: 0,
      total: unenrolled.length,
      failed: 0,
    });
    let failed = 0;
    for (let i = 0; i < unenrolled.length; i++) {
      const student = unenrolled[i];
      setBulkProgress((p) => ({ ...p, current: i + 1 }));
      try {
        // Load and compute descriptor from profile photo
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = student.photoUrl;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error("img load failed"));
          setTimeout(() => rej(new Error("timeout")), 8000);
        });
        const det = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        const descriptorJson = det?.descriptor
          ? JSON.stringify(Array.from(det.descriptor))
          : "";
        if (!descriptorJson) {
          failed++;
          continue;
        }
        await enrollFaceBackend({
          studentId: student.id,
          admNo: student.admNo,
          enrolledBy: "Admin (Auto)",
          photoUrl: student.photoUrl,
          descriptorJson,
        });
      } catch {
        failed++;
      }
    }
    await refetchEnrolled();
    setBulkProgress((p) => ({ ...p, active: false, failed }));
    toast.success(
      `Bulk enrollment complete. ${unenrolled.length - failed} enrolled, ${failed} failed (no face detected).`,
    );
  };

  const activeStudents = allStudents.filter((s) => !s.isDiscontinued);
  const filtered = search.trim()
    ? activeStudents.filter(
        (s) =>
          s.fullName.toLowerCase().includes(search.toLowerCase()) ||
          s.admNo.includes(search),
      )
    : activeStudents;

  const enrolledCount = activeStudents.filter((s) =>
    enrolledIds.has(s.id),
  ).length;

  return (
    <div className="space-y-4" data-ocid="face.enroll_section">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-emerald-700">
              {enrolledLoading ? "…" : enrolledCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-amber-700">
              {enrolledLoading ? "…" : activeStudents.length - enrolledCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Not Enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-primary">
              {activeStudents.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total Students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk auto-enroll */}
      {activeStudents.filter((s) => !enrolledIds.has(s.id) && s.photoUrl)
        .length > 0 && (
        <Card className="border-violet-200 bg-violet-50/50">
          <CardContent className="pt-4 pb-4">
            {bulkProgress.active ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-violet-700 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-violet-800">
                    Enrolling student {bulkProgress.current} of{" "}
                    {bulkProgress.total}…
                  </p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-violet-200 overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all"
                      style={{
                        width: `${(bulkProgress.current / bulkProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-violet-800">
                    Auto-Enroll from Profile Photos
                  </p>
                  <p className="text-xs text-violet-700 mt-0.5">
                    {
                      activeStudents.filter(
                        (s) => !enrolledIds.has(s.id) && s.photoUrl,
                      ).length
                    }{" "}
                    students have profile photos but are not enrolled
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white shrink-0"
                  onClick={handleBulkAutoEnroll}
                  data-ocid="face.bulk_enroll_button"
                >
                  <ScanFace className="w-3.5 h-3.5" />
                  Auto-Enroll All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or admission number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm"
              data-ocid="face.enroll_search_input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Student enrollment list */}
      <Card>
        <CardContent className="p-0">
          {enrolledLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading enrollment data…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center py-10 text-muted-foreground"
              data-ocid="face.enroll_empty_state"
            >
              <Users className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "Adm No",
                      "Student Name",
                      "Class",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, i) => {
                    const isEnrolled = enrolledIds.has(student.id);
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        data-ocid={`face.enroll_student_row.${i + 1}`}
                      >
                        <td className="px-4 py-2.5 text-muted-foreground text-xs tabular-nums">
                          {student.admNo}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt={student.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {getInitials(student.fullName)}
                              </div>
                            )}
                            <span className="font-medium text-foreground truncate max-w-[160px]">
                              {student.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">
                          {getClassLabel(student.classLevel)}
                        </td>
                        <td className="px-4 py-2.5">
                          {isEnrolled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <UserCheck className="w-3 h-3" />
                              Enrolled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                              {student.photoUrl ? "Not Enrolled" : "No Photo"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-xs gap-1"
                              onClick={() => setEnrollingStudent(student)}
                              disabled={!student.photoUrl}
                              data-ocid={`face.enroll_button.${i + 1}`}
                            >
                              <ScanFace className="w-3 h-3" />
                              {isEnrolled ? "Re-Enroll" : "Enroll"}
                            </Button>
                            {isEnrolled && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-xs text-red-700 border-red-300 hover:bg-red-50"
                                onClick={() => handleRevoke(student.id)}
                                data-ocid={`face.revoke_button.${i + 1}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollment modal */}
      <AnimatePresence>
        {enrollingStudent && (
          <EnrollModal
            student={enrollingStudent}
            onClose={() => setEnrollingStudent(null)}
            onEnrolled={handleEnrolled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Face Attendance Recording Tab (with camera) ───────────────────────────────
function FaceAttendanceRecordTab() {
  const { data: allStudents = [] } = useStudents();
  const { data: routes = [] } = useRoutes();

  // Face-api model loading
  const {
    status: modelStatus,
    error: modelError,
    load: loadModels,
  } = useFaceApiModels();
  // Backend enrolled faces
  const { data: enrolledFaces = [], isLoading: enrolledLoading } =
    useGetFaceEnrolledStudents();

  // Build studentInfoMap with all needed fields
  const studentInfoMap = useMemo(() => {
    const map = new Map<
      string,
      import("@/hooks/useFaceRecognition").StudentInfo
    >();
    for (const s of allStudents) {
      const route = routes.find((r) => r.id === s.transportRouteId);
      map.set(s.id, {
        name: s.fullName,
        admNo: s.admNo,
        fatherName: s.fatherName,
        classLevel: s.classLevel as string,
        section: s.sectionId,
        routeName: route?.name ?? "",
        photoUrl: s.photoUrl,
      });
    }
    // Also include enrolled students from backend whose admNo/photo we can infer
    for (const e of enrolledFaces) {
      if (!map.has(e.studentId) && e.admNo) {
        const match = allStudents.find((s) => s.admNo === e.admNo);
        if (match) {
          const route = routes.find((r) => r.id === match.transportRouteId);
          map.set(e.studentId, {
            name: match.fullName,
            admNo: match.admNo,
            fatherName: match.fatherName,
            classLevel: match.classLevel as string,
            section: match.sectionId,
            routeName: route?.name ?? "",
            photoUrl: match.photoUrl || e.photoUrl,
          });
        }
      }
    }
    return map;
  }, [allStudents, routes, enrolledFaces]);

  // Descriptor loader
  const {
    descriptors,
    loading: descriptorLoading,
    progress: descriptorProgress,
    load: loadDescriptors,
  } = useDescriptorLoader(enrolledFaces, studentInfoMap);

  // Load models on mount, then descriptors when models ready
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (modelStatus === "ready" && enrolledFaces.length > 0) {
      loadDescriptors();
    }
  }, [modelStatus, enrolledFaces.length, loadDescriptors]);

  // Marked attendance entries stored locally
  const [markedEntries, setMarkedEntries] = useState<
    import("@/components/attendance/FaceRecognitionCamera").MarkedEntry[]
  >([]);

  const handleMarkPresent = useCallback(
    (match: import("@/hooks/useFaceRecognition").RecognitionMatch) => {
      if (markedEntries.some((e) => e.studentId === match.studentId)) return;
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
          confidence: match.confidence,
        },
      ]);
    },
    [markedEntries],
  );

  const activeStudents = allStudents.filter((s) => !s.isDiscontinued);

  return (
    <FaceRecognitionCamera
      students={activeStudents}
      descriptors={descriptors}
      descriptorLoading={descriptorLoading}
      descriptorProgress={descriptorProgress}
      modelStatus={modelStatus}
      modelError={modelError}
      onRetryModels={loadModels}
      onMarkPresent={handleMarkPresent}
      markedEntries={markedEntries}
      enrolledCount={enrolledFaces.length}
      enrolledLoading={enrolledLoading}
    />
  );
}

// ─── Face Tab wrapper (sub-tabs) ──────────────────────────────────────────────
function FaceTab() {
  return (
    <Tabs defaultValue="record" className="space-y-4" data-ocid="face.sub_tabs">
      <TabsList className="h-auto gap-1 p-1">
        <TabsTrigger
          value="record"
          className="gap-1.5"
          data-ocid="face.record_tab"
        >
          <ScanFace className="w-3.5 h-3.5" />
          Take Attendance
        </TabsTrigger>
        <TabsTrigger
          value="enroll"
          className="gap-1.5"
          data-ocid="face.enroll_tab"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Enroll Students
        </TabsTrigger>
      </TabsList>
      <TabsContent value="record">
        <FaceAttendanceRecordTab />
      </TabsContent>
      <TabsContent value="enroll">
        <FaceEnrollTab />
      </TabsContent>
    </Tabs>
  );
}

// ─── Generic Device Tab (RFID, ESSL) ─────────────────────────────────────────
function DeviceAttendanceTab({ device }: { device: AttendanceDevice }) {
  const cfg = DEVICE_CONFIG[device];
  const DeviceIcon = cfg.icon;

  const { data: allStudents = [] } = useStudents();
  const { data: allSections = [] } = useSections();

  const availableClasses = CLASS_ORDER.filter((cl) =>
    allStudents.some((s) => s.classLevel === cl),
  );

  const [date, setDate] = useState(todayISO());
  const [classLevel, setClassLevel] = useState<ClassLevel>(
    availableClasses[0] ?? "Class1",
  );
  const [sectionId, setSectionId] = useState("");
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<DeviceAttendanceRecord[]>([]);
  const [flashId, setFlashId] = useState<string | null>(null);

  const sections = allSections.filter((s) => s.classLevel === classLevel);

  // Stable ref to avoid re-creating the dependency every render
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const sectionsLen = sections.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: sectionsRef.current holds latest sections; using length as stable primitive trigger
  useEffect(() => {
    const secs = sectionsRef.current;
    if (secs.length > 0 && !sectionId) {
      setSectionId(secs[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionsLen, sectionId]);

  useEffect(() => {
    setRecords(loadRecords(device, date));
  }, [device, date]);

  const handleClassChange = (val: string) => {
    const cl = val as ClassLevel;
    setClassLevel(cl);
    const secs = allSections.filter((s) => s.classLevel === cl);
    setSectionId(secs[0]?.id ?? "");
  };

  const students = allStudents.filter(
    (s) =>
      s.classLevel === classLevel &&
      s.sectionId === sectionId &&
      !s.isDiscontinued,
  );
  const sectionName = sections.find((s) => s.id === sectionId)?.name ?? "A";

  const filtered = search.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(search.toLowerCase()) ||
          s.admNo.includes(search),
      )
    : students;

  function getRecord(studentId: string): DeviceAttendanceRecord | undefined {
    return records.find((r) => r.studentId === studentId);
  }

  function markIn(student: Student) {
    const existing = getRecord(student.id);
    if (existing) return;
    const newRec: DeviceAttendanceRecord = {
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
      status: "Present",
    };
    const updated = [...records, newRec];
    setRecords(updated);
    saveRecords(device, date, updated);
    setFlashId(student.id);
    setTimeout(() => setFlashId(null), 1200);
    toast.success(`${student.fullName} marked IN`);
  }

  function markOut(student: Student) {
    const existing = getRecord(student.id);
    if (!existing || existing.outTime) return;
    const outTime = nowTime();
    let status: DeviceAttendanceRecord["status"] = "Present";
    if (existing.inTime) {
      const [ih, im] = existing.inTime.split(":").map(Number);
      const [oh, om] = outTime.split(":").map(Number);
      const diff = oh * 60 + om - (ih * 60 + im);
      if (diff < 240) status = "Half Day";
    }
    const updated = records.map((r) =>
      r.studentId === student.id ? { ...r, outTime, status } : r,
    );
    setRecords(updated);
    saveRecords(device, date, updated);
    setFlashId(`${student.id}_out`);
    setTimeout(() => setFlashId(null), 1200);
    toast.success(`${student.fullName} marked OUT`);
  }

  const presentCount = records.filter((r) => r.status === "Present").length;
  const halfDayCount = records.filter((r) => r.status === "Half Day").length;
  const totalStudents = students.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}
        >
          <DeviceIcon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {cfg.label}
          </h2>
          <p className="text-xs text-muted-foreground">
            Track IN / OUT times with {cfg.label}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {presentCount} Present
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {halfDayCount} Half Day
          </span>
          <span className="text-muted-foreground">/ {totalStudents} Total</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap gap-3 items-end">
            <DateInput
              label="Date"
              value={date}
              onChange={setDate}
              data-ocid={`attendance.${cfg.tab}_date_input`}
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${cfg.tab}-class`}
                className="text-xs font-medium text-muted-foreground"
              >
                Class
              </label>
              <Select value={classLevel} onValueChange={handleClassChange}>
                <SelectTrigger
                  id={`${cfg.tab}-class`}
                  className="w-36"
                  data-ocid={`attendance.${cfg.tab}_class_select`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cl) => (
                    <SelectItem key={cl} value={cl}>
                      {getClassLabel(cl)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`${cfg.tab}-section`}
                className="text-xs font-medium text-muted-foreground"
              >
                Section
              </label>
              <Select
                value={sectionId}
                onValueChange={setSectionId}
                disabled={sections.length <= 1}
              >
                <SelectTrigger
                  id={`${cfg.tab}-section`}
                  className="w-28"
                  data-ocid={`attendance.${cfg.tab}_section_select`}
                >
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id}>
                      Section {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label
                htmlFor={`${cfg.tab}-search`}
                className="text-xs font-medium text-muted-foreground"
              >
                Search Student
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id={`${cfg.tab}-search`}
                  placeholder="Name or Adm No…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-sm"
                  data-ocid={`attendance.${cfg.tab}_search_input`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List + Mark IN/OUT */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              data-ocid={`attendance.${cfg.tab}_empty_state`}
            >
              <Users className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "Roll No",
                      "Student Name",
                      "IN Time",
                      "OUT Time",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, i) => {
                    const rec = getRecord(student.id);
                    const isFlashIn = flashId === student.id;
                    const isFlashOut = flashId === `${student.id}_out`;
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={[
                          "border-b border-border last:border-0 transition-colors",
                          isFlashIn
                            ? "bg-emerald-50"
                            : isFlashOut
                              ? "bg-sky-50"
                              : "hover:bg-muted/20",
                        ].join(" ")}
                        data-ocid={`attendance.${cfg.tab}_student_row.${i + 1}`}
                      >
                        <td className="px-4 py-2.5 text-muted-foreground tabular-nums">
                          {student.admNo}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                              {getInitials(student.fullName)}
                            </div>
                            <span className="font-medium text-foreground truncate max-w-[140px]">
                              {student.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {rec?.inTime ? (
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                              <LogIn className="w-3.5 h-3.5" />
                              {rec.inTime}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {rec?.outTime ? (
                            <span className="flex items-center gap-1 text-red-700 font-semibold text-xs">
                              <LogOut className="w-3.5 h-3.5" />
                              {rec.outTime}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={rec?.status ?? null} />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!!rec?.inTime}
                              onClick={() => markIn(student)}
                              className="h-7 px-2.5 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 disabled:opacity-40"
                              data-ocid={`attendance.${cfg.tab}_mark_in_button.${i + 1}`}
                            >
                              <LogIn className="w-3 h-3" />
                              IN
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!rec?.inTime || !!rec?.outTime}
                              onClick={() => markOut(student)}
                              className="h-7 px-2.5 text-xs gap-1 text-red-700 border-red-300 hover:bg-red-50 disabled:opacity-40"
                              data-ocid={`attendance.${cfg.tab}_mark_out_button.${i + 1}`}
                            >
                              <LogOut className="w-3 h-3" />
                              OUT
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Records */}
      <AnimatePresence>
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <DeviceIcon className={`w-4 h-4 ${cfg.color}`} />
                  Today's Records — {formatDate(date)} ({records.length}{" "}
                  entries)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {[
                          "Roll No",
                          "Student Name",
                          "Class",
                          "Section",
                          "IN Time",
                          "OUT Time",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((rec, i) => (
                        <tr
                          key={rec.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20"
                          data-ocid={`attendance.${cfg.tab}_record_row.${i + 1}`}
                        >
                          <td className="px-4 py-2 tabular-nums text-muted-foreground text-xs">
                            {rec.admNo}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {rec.studentName}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {getClassLabel(rec.classLevel)}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {rec.section}
                          </td>
                          <td className="px-4 py-2 tabular-nums text-emerald-700 font-semibold text-xs">
                            {rec.inTime ?? "—"}
                          </td>
                          <td className="px-4 py-2 tabular-nums text-red-700 font-semibold text-xs">
                            {rec.outTime ?? "—"}
                          </td>
                          <td className="px-4 py-2">
                            <StatusBadge status={rec.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Summary Tab ──────────────────────────────────────────────────────────────
function buildSummaryRecords(
  fromDate: string,
  toDate: string,
  filterClass: ClassLevel | "All",
  filterSection: string,
  filterDevice: AllDeviceType | "All",
): DeviceAttendanceRecord[] {
  const allRecords: DeviceAttendanceRecord[] = [];
  const allDeviceTypes: AllDeviceType[] = [
    "Face",
    "RFID",
    "ESSLBiometric",
    "QR",
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
          localStorage.getItem(k) ?? "[]",
        ) as DeviceAttendanceRecord[];
        allRecords.push(...recs);
      } catch {
        // ignore
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
  const [fromDate, setFromDate] = useState(`${new Date().getFullYear()}-04-01`);
  const [toDate, setToDate] = useState(todayISO());
  const [filterClass, setFilterClass] = useState<ClassLevel | "All">("All");
  const [filterSection, setFilterSection] = useState("All");
  const [filterDevice, setFilterDevice] = useState<AllDeviceType | "All">(
    "All",
  );
  const [exportSuccess, setExportSuccess] = useState(false);

  const allRecords = useMemo(
    () =>
      buildSummaryRecords(
        fromDate,
        toDate,
        filterClass,
        filterSection,
        filterDevice,
      ),
    [fromDate, toDate, filterClass, filterSection, filterDevice],
  );

  const sections =
    filterClass !== "All"
      ? [
          ...new Set(
            allRecords
              .filter((r) => r.classLevel === filterClass)
              .map((r) => r.section),
          ),
        ]
      : [];

  const presentCount = allRecords.filter((r) => r.status === "Present").length;
  const halfDayCount = allRecords.filter((r) => r.status === "Half Day").length;

  const handleExport = () => {
    const rows = allRecords.map((r) => ({
      Date: formatDate(r.date),
      Day: dayOfWeek(r.date),
      "Roll No": r.admNo,
      "Student Name": r.studentName,
      Class: getClassLabel(r.classLevel),
      Section: r.section,
      "IN Time": r.inTime ?? "",
      "OUT Time": r.outTime ?? "",
      "Device Type": DEVICE_CONFIG[r.deviceType]?.label ?? r.deviceType,
      Status: r.status,
    }));
    downloadCSV(rows, `attendance-report-${toDate}.csv`);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
    toast.success("Attendance report exported successfully");
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Present Records",
            value: presentCount,
            color: "text-emerald-700",
          },
          {
            label: "Half Day Records",
            value: halfDayCount,
            color: "text-amber-700",
          },
          {
            label: "Total Records",
            value: allRecords.length,
            color: "text-primary",
          },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-3">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap gap-3 items-end">
            <DateInput
              label="From"
              value={fromDate}
              onChange={setFromDate}
              data-ocid="attendance.summary_from_date"
            />
            <DateInput
              label="To"
              value={toDate}
              onChange={setToDate}
              data-ocid="attendance.summary_to_date"
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="summary-class"
                className="text-xs font-medium text-muted-foreground"
              >
                Class
              </label>
              <Select
                value={filterClass}
                onValueChange={(v) => {
                  setFilterClass(v as ClassLevel | "All");
                  setFilterSection("All");
                }}
              >
                <SelectTrigger
                  id="summary-class"
                  className="w-36"
                  data-ocid="attendance.summary_class_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {CLASS_ORDER.map((cl) => (
                    <SelectItem key={cl} value={cl}>
                      {getClassLabel(cl)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterClass !== "All" && sections.length > 0 && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="summary-section"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Section
                </label>
                <Select value={filterSection} onValueChange={setFilterSection}>
                  <SelectTrigger
                    id="summary-section"
                    className="w-28"
                    data-ocid="attendance.summary_section_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        Section {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="summary-device"
                className="text-xs font-medium text-muted-foreground"
              >
                Device
              </label>
              <Select
                value={filterDevice}
                onValueChange={(v) =>
                  setFilterDevice(v as AllDeviceType | "All")
                }
              >
                <SelectTrigger
                  id="summary-device"
                  className="w-40"
                  data-ocid="attendance.summary_device_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Devices</SelectItem>
                  {(
                    ["Face", "RFID", "ESSLBiometric", "QR"] as AllDeviceType[]
                  ).map((d) => (
                    <SelectItem key={d} value={d}>
                      {DEVICE_CONFIG[d].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-end gap-2">
              <AnimatePresence>
                {exportSuccess && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-emerald-700 text-sm font-medium"
                    data-ocid="attendance.export_success_state"
                  >
                    <CheckCircle className="w-4 h-4" /> Exported!
                  </motion.span>
                )}
              </AnimatePresence>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExport}
                data-ocid="attendance.export_button"
                className="gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full data table */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Attendance Records ({allRecords.length} rows)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="attendance.summary_table"
            >
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {[
                    "Date",
                    "Day",
                    "Roll No",
                    "Student Name",
                    "Class",
                    "Section",
                    "IN Time",
                    "OUT Time",
                    "Device",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allRecords.map((rec, i) => {
                  const DeviceIcon =
                    DEVICE_CONFIG[rec.deviceType]?.icon ?? ScanFace;
                  return (
                    <tr
                      key={`${rec.id}-${i}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      data-ocid={`attendance.summary_row.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 tabular-nums text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(rec.date)}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-xs">
                        {dayOfWeek(rec.date).slice(0, 3)}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-muted-foreground text-xs">
                        {rec.admNo}
                      </td>
                      <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                        {rec.studentName}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                        {getClassLabel(rec.classLevel)}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {rec.section}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-emerald-700 font-semibold text-xs">
                        {rec.inTime ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-red-700 font-semibold text-xs">
                        {rec.outTime ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${DEVICE_CONFIG[rec.deviceType]?.color ?? ""}`}
                        >
                          <DeviceIcon className="w-3.5 h-3.5" />
                          {DEVICE_CONFIG[rec.deviceType]?.label ??
                            rec.deviceType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={rec.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {allRecords.length === 0 && (
              <div
                className="flex flex-col items-center py-10 text-muted-foreground"
                data-ocid="attendance.summary_empty_state"
              >
                <Users className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">
                  No attendance records for the selected filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AttendancePage() {
  const { actor } = useActor(createActor);
  const [attSettings, setAttSettings] = useState({
    face: true,
    rfid: true,
    essl: true,
    qr: true,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      if (!actor) return;
      try {
        const s = await actor.getAttendanceSettings();
        setAttSettings({ face: s.face, rfid: s.rfid, essl: s.essl, qr: s.qr });
      } catch {
        // Keep all enabled as fallback
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
    attSettings.essl && "essl",
  ].filter(Boolean) as string[];

  // Default to first active tab
  const defaultTab = activeSystems[0] ?? "summary";

  // Show loading only briefly; if settings not loaded yet show skeleton
  if (!settingsLoaded && !actor) {
    return (
      <div className="space-y-4" data-ocid="attendance.page">
        <div className="h-8 w-48 bg-muted/40 rounded animate-pulse" />
        <div className="h-12 w-full bg-muted/40 rounded animate-pulse" />
      </div>
    );
  }

  const allInactive = activeSystems.length === 0;

  return (
    <div className="space-y-4" data-ocid="attendance.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Face, QR Scanner, RFID &amp; ESSL Biometric — all in one place
          </p>
        </div>
      </div>

      {allInactive ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl border-2 border-dashed border-border bg-muted/20"
          data-ocid="attendance.all_inactive.empty_state"
        >
          <Settings2 className="w-12 h-12 text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-semibold text-foreground">
              No attendance systems enabled
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to <strong>Settings → Attendance</strong> to enable at least
              one attendance method.
            </p>
          </div>
        </div>
      ) : (
        <Tabs
          defaultValue={defaultTab}
          className="space-y-4"
          data-ocid="attendance.tabs"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            {attSettings.face && (
              <TabsTrigger
                value="face"
                className="gap-1.5"
                data-ocid="attendance.face_tab"
              >
                <ScanFace className="w-3.5 h-3.5" />
                Face
              </TabsTrigger>
            )}
            {attSettings.qr && (
              <TabsTrigger
                value="qr"
                className="gap-1.5"
                data-ocid="attendance.qr_tab"
              >
                <QrCode className="w-3.5 h-3.5" />
                QR Scanner
              </TabsTrigger>
            )}
            {attSettings.rfid && (
              <TabsTrigger
                value="rfid"
                className="gap-1.5"
                data-ocid="attendance.rfid_tab"
              >
                <CreditCard className="w-3.5 h-3.5" />
                RFID
              </TabsTrigger>
            )}
            {attSettings.essl && (
              <TabsTrigger
                value="essl"
                className="gap-1.5"
                data-ocid="attendance.essl_tab"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                ESSL Biometric
              </TabsTrigger>
            )}
            <TabsTrigger
              value="summary"
              className="gap-1.5"
              data-ocid="attendance.summary_tab"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Summary &amp; Export
            </TabsTrigger>
          </TabsList>

          {attSettings.face && (
            <TabsContent value="face">
              <FaceTab />
            </TabsContent>
          )}
          {attSettings.qr && (
            <TabsContent value="qr">
              <QRScannerTab />
            </TabsContent>
          )}
          {attSettings.rfid && (
            <TabsContent value="rfid">
              <DeviceAttendanceTab device="RFID" />
            </TabsContent>
          )}
          {attSettings.essl && (
            <TabsContent value="essl">
              <DeviceAttendanceTab device="ESSLBiometric" />
            </TabsContent>
          )}
          <TabsContent value="summary">
            <AttendanceSummaryTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
