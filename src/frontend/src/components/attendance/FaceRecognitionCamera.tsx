// ─── FaceRecognitionCamera ───────────────────────────────────────────────────
// Auto-starts camera on mount, continuously recognizes enrolled faces every
// 500ms, and shows a large full-screen popup with all student details on match.

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EnrolledDescriptor,
  ModelStatus,
  RecognitionMatch,
} from "@/hooks/useFaceRecognition";
import { useRecognitionLoop } from "@/hooks/useFaceRecognition";
import { getClassLabel, getInitials } from "@/lib/utils";
import type { ClassLevel, Student } from "@/types";
import {
  AlertTriangle,
  Bus,
  Camera,
  CheckCircle,
  Loader2,
  RefreshCw,
  ScanFace,
  UserCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface MarkedEntry {
  studentId: string;
  admNo: string;
  studentName: string;
  classLevel: string;
  section: string;
  routeName: string;
  photoUrl: string;
  time: string;
  confidence: number;
}

interface Props {
  students: Student[];
  descriptors: EnrolledDescriptor[];
  descriptorLoading: boolean;
  descriptorProgress: number;
  modelStatus: ModelStatus;
  modelError: string | null;
  onRetryModels: () => void;
  onMarkPresent: (match: RecognitionMatch) => void;
  markedEntries: MarkedEntry[];
  /** Total enrolled students count from backend (used to avoid false "no enrolled" message) */
  enrolledCount?: number;
  /** True when enrolled students list is still loading from backend */
  enrolledLoading?: boolean;
}

// ─── Large Attendance Popup (reused by QR + all device tabs) ─────────────────
export interface AttendancePopupProps {
  match: RecognitionMatch;
  onClose: () => void;
  deviceLabel?: string;
}

export function AttendancePopup({
  match,
  onClose,
  deviceLabel = "Face",
}: AttendancePopupProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, background: "rgba(0,0,0,0.82)" }}
      data-ocid="attendance.popup"
      onClick={onClose}
      onKeyUp={(e) => e.key === "Escape" && onClose()}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="bg-card rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden border-4 border-emerald-500"
        data-ocid="attendance.popup_card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green header */}
        <div className="bg-emerald-500 px-5 py-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-base tracking-wide">
            Attendance Marked ✓
          </span>
          <span className="ml-auto text-emerald-100 text-xs font-medium">
            {deviceLabel}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col items-center gap-3">
          {/* Photo 150×150 */}
          <div className="relative">
            {match.photoUrl ? (
              <img
                src={match.photoUrl}
                alt={match.studentName}
                className="w-[150px] h-[150px] rounded-2xl object-cover border-4 border-emerald-400 shadow-lg"
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-2xl bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center">
                <span className="text-5xl font-bold text-emerald-700">
                  {getInitials(match.studentName)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Name + Adm No */}
          <div className="w-full text-center space-y-1">
            <p
              className="text-2xl font-bold text-emerald-600 leading-tight"
              data-ocid="attendance.popup_name"
            >
              {match.studentName}
            </p>
            <p
              className="text-sm font-bold text-foreground tracking-wider"
              data-ocid="attendance.popup_admno"
            >
              ADM: {match.admNo}
            </p>
          </div>

          {/* Detail grid */}
          <div className="w-full grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                Father
              </p>
              <p className="font-semibold text-foreground text-xs truncate">
                {match.fatherName || "—"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                Class
              </p>
              <p className="font-semibold text-foreground text-xs">
                {getClassLabel(match.classLevel as ClassLevel)} —{" "}
                {match.section}
              </p>
            </div>
            {match.routeName && (
              <div className="col-span-2 bg-sky-50 border border-sky-200 rounded-xl p-2.5 flex items-center gap-2">
                <Bus className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-sky-700 uppercase tracking-wide">
                    Route
                  </p>
                  <p className="font-semibold text-sky-800 text-xs">
                    {match.routeName}
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{match.timestamp}</p>
          <p className="text-[10px] text-muted-foreground italic">
            Tap anywhere to dismiss
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Camera Component ───────────────────────────────────────────────────
export default function FaceRecognitionCamera({
  students,
  descriptors,
  descriptorLoading,
  descriptorProgress,
  modelStatus,
  modelError,
  onRetryModels,
  onMarkPresent,
  markedEntries,
  enrolledCount = 0,
  enrolledLoading = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camStatus, setCamStatus] = useState<
    "idle" | "loading" | "active" | "denied" | "error"
  >("idle");
  const [pendingMatch, setPendingMatch] = useState<RecognitionMatch | null>(
    null,
  );
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [manualStudentId, setManualStudentId] = useState("");
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markedIds = useMemo(
    () => new Set(markedEntries.map((e) => e.studentId)),
    [markedEntries],
  );

  // Camera lifecycle
  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
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
    for (const t of streamRef.current?.getTracks() ?? []) t.stop();
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamStatus("idle");
    setRecognitionActive(false);
  }, []);

  // Auto-start on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [startCamera, stopCamera]);

  // Enable recognition loop when camera + models + descriptors ready
  useEffect(() => {
    setRecognitionActive(
      camStatus === "active" &&
        modelStatus === "ready" &&
        descriptors.length > 0 &&
        !descriptorLoading,
    );
  }, [camStatus, modelStatus, descriptors.length, descriptorLoading]);

  const handleRecognitionMatch = useCallback(
    (match: RecognitionMatch) => {
      if (markedIds.has(match.studentId)) return;
      if (pendingMatch) return; // one popup at a time
      onMarkPresent(match);
      setPendingMatch(match);
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3000);
    },
    [markedIds, pendingMatch, onMarkPresent],
  );

  useRecognitionLoop(
    videoRef,
    descriptors,
    markedIds,
    recognitionActive,
    handleRecognitionMatch,
  );

  const handleManualMark = () => {
    if (!manualStudentId) return;
    const student = students.find((s) => s.id === manualStudentId);
    if (!student) return;
    const now = new Date();
    const timestamp = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const match: RecognitionMatch = {
      studentId: student.id,
      admNo: student.admNo,
      studentName: student.fullName,
      fatherName: student.fatherName,
      classLevel: student.classLevel as string,
      section: student.sectionId,
      routeName: "",
      photoUrl: student.photoUrl,
      confidence: 1,
      timestamp,
    };
    onMarkPresent(match);
    setPendingMatch(match);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => setPendingMatch(null), 3000);
    setManualStudentId("");
  };

  const unmarkedStudents = students.filter((s) => !markedIds.has(s.id));

  return (
    <div className="space-y-4">
      {/* Status bars */}
      {(modelStatus === "loading" || descriptorLoading) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {modelStatus === "loading"
            ? "Loading face recognition models…"
            : `Computing face descriptors… ${descriptorProgress}%`}
        </div>
      )}
      {modelStatus === "error" && (
        <div
          className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs"
          data-ocid="face.model_error_state"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {modelError ?? "Failed to load face recognition models"}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs border-red-300 text-red-700"
            onClick={onRetryModels}
            data-ocid="face.model_retry_button"
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Retry
          </Button>
        </div>
      )}
      {modelStatus === "ready" &&
        descriptors.length === 0 &&
        !descriptorLoading &&
        !enrolledLoading &&
        enrolledCount === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            No enrolled students found. Enroll students first using the "Enroll
            Students" tab.
          </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Camera + controls */}
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              data-ocid="face.camera_feed"
            />
            {camStatus === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-white text-sm">Starting camera…</p>
              </div>
            )}
            {camStatus === "denied" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3">
                <Camera className="w-10 h-10 text-red-400" />
                <p className="text-white text-sm text-center">
                  Camera permission denied.
                  <br />
                  Allow access in browser settings and refresh.
                </p>
              </div>
            )}
            {camStatus === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 gap-3">
                <Camera className="w-10 h-10 text-red-400" />
                <p className="text-white text-sm text-center">
                  Camera not available.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-white border-white"
                  onClick={startCamera}
                  data-ocid="face.camera_retry_button"
                >
                  Retry
                </Button>
              </div>
            )}
            {camStatus === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3">
                <Camera className="w-10 h-10 text-muted-foreground" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-white border-white"
                  onClick={startCamera}
                  data-ocid="face.camera_start_button"
                >
                  Start Camera
                </Button>
              </div>
            )}
            {/* Scan frame overlay */}
            {camStatus === "active" && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-violet-400 rounded-tl" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-violet-400 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-violet-400 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-violet-400 rounded-br" />
                {recognitionActive && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-xs font-medium">
                      Auto-scanning…
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${camStatus === "active" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`}
              />
              <span className="text-muted-foreground">
                {camStatus === "active" ? "Camera active" : "Camera off"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <ScanFace className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-muted-foreground">
                {descriptors.length} faces enrolled
              </span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-auto h-7 px-2.5 text-xs gap-1"
              onClick={camStatus === "active" ? stopCamera : startCamera}
              data-ocid="face.camera_toggle_button"
            >
              <Camera className="w-3 h-3" />
              {camStatus === "active" ? "Stop" : "Start"} Camera
            </Button>
          </div>

          {/* Manual fallback */}
          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Manual Fallback
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-4">
              <div className="flex gap-2">
                <Select
                  value={manualStudentId}
                  onValueChange={setManualStudentId}
                >
                  <SelectTrigger
                    className="flex-1 text-sm"
                    data-ocid="face.manual_student_select"
                  >
                    <SelectValue placeholder="Select student to mark manually…" />
                  </SelectTrigger>
                  <SelectContent>
                    {unmarkedStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.admNo} — {s.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleManualMark}
                  disabled={!manualStudentId}
                  className="gap-1.5 shrink-0"
                  data-ocid="face.manual_mark_button"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance list */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 pt-4 px-4 shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Today's Attendance
              <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {markedEntries.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            {markedEntries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                data-ocid="face.attendance_list_empty_state"
              >
                <ScanFace className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs text-center px-4">
                  No students marked yet.
                  <br />
                  Camera will auto-detect enrolled faces.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-border">
                  {markedEntries.map((entry, i) => (
                    <motion.div
                      key={entry.studentId}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2.5 px-4 py-2.5"
                      data-ocid={`face.attendance_entry.${i + 1}`}
                    >
                      {entry.photoUrl ? (
                        <img
                          src={entry.photoUrl}
                          alt={entry.studentName}
                          className="w-9 h-9 rounded-full object-cover border-2 border-emerald-300 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                          {getInitials(entry.studentName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {entry.studentName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {entry.admNo} •{" "}
                          {getClassLabel(entry.classLevel as ClassLevel)} •{" "}
                          {entry.time}
                        </p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
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
            deviceLabel="Face Recognition"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
