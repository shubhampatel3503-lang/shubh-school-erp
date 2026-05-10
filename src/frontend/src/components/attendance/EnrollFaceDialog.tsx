// ─── EnrollFaceDialog ─────────────────────────────────────────────────────────
// Modal for enrolling a student's face. Uses their profile photo by default;
// optionally lets admin capture a new photo from camera.

import { Button } from "@/components/ui/button";
import { useEnrollStudentFace } from "@/hooks/useFaceRecognition";
import type { Student } from "@/types";
import { Camera, Loader2, UserCheck, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Descriptor computation helper ───────────────────────────────────────────
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

async function computeFaceDescriptor(
  photoUrl: string,
): Promise<Float32Array | null> {
  try {
    const faceapi = await import("@vladmandic/face-api");
    const source = photoUrl.startsWith("data:")
      ? await (async () => {
          const img = new Image();
          img.src = photoUrl;
          await new Promise<void>((r) => {
            img.onload = () => r();
          });
          return img;
        })()
      : await loadImage(photoUrl);
    const detection = await faceapi
      .detectSingleFace(source, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection?.descriptor ?? null;
  } catch {
    return null;
  }
}

interface Props {
  student: Student;
  isEnrolled: boolean;
  onClose: () => void;
  /** Called after successful backend enrollment */
  onEnrolled?: () => void;
}

export default function EnrollFaceDialog({
  student,
  isEnrolled,
  onClose,
  onEnrolled,
}: Props) {
  const [mode, setMode] = useState<"profile" | "camera">("profile");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [camStatus, setCamStatus] = useState<
    "idle" | "loading" | "active" | "denied" | "error"
  >("idle");
  const [saving, setSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { mutateAsync: enrollFace } = useEnrollStudentFace();

  const startCamera = useCallback(async () => {
    if (streamRef.current) return;
    setCamStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
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
      toast.error("No photo available. Use a profile photo or capture one.");
      return;
    }
    setSaving(true);
    try {
      // Compute face descriptor from the chosen photo
      let descriptorJson = "";
      const descriptor = await computeFaceDescriptor(photoUrl);
      if (descriptor) {
        descriptorJson = JSON.stringify(Array.from(descriptor));
      } else {
        // Store empty descriptor — enrollment still works but won't auto-match
        toast.warning(
          "No face detected in photo. Enrolled anyway — auto-recognition may not work.",
        );
      }

      await enrollFace({
        studentId: student.id,
        admNo: student.admNo,
        enrolledBy: "Admin",
        photoUrl,
        descriptorJson,
      });

      toast.success(`${student.fullName} enrolled successfully`);
      stopCamera();
      onEnrolled?.();
      onClose();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Enrollment failed. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 10010 }}
        data-ocid="face.enroll_dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                {isEnrolled ? "Re-Enroll Face" : "Enroll Face"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {student.fullName} · {student.admNo}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-ocid="face.enroll_close_button"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mode toggle */}
          <div className="px-5 pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "profile" ? "default" : "outline"}
                className="flex-1 text-xs"
                onClick={handleSwitchToProfile}
                data-ocid="face.enroll_use_profile_button"
              >
                Use Profile Photo
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "camera" ? "default" : "outline"}
                className="flex-1 text-xs gap-1"
                onClick={handleSwitchToCamera}
                data-ocid="face.enroll_capture_button"
              >
                <Camera className="w-3.5 h-3.5" />
                Capture Photo
              </Button>
            </div>
          </div>

          {/* Photo area */}
          <div className="px-5 py-4 flex flex-col items-center">
            {mode === "profile" ? (
              student.photoUrl ? (
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
                    Use "Capture Photo" instead.
                  </p>
                </div>
              )
            ) : capturedPhoto ? (
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
                    startCamera();
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Retake"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-full">
                <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {camStatus === "loading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {camStatus === "denied" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 gap-2">
                      <Camera className="w-7 h-7 text-red-400" />
                      <p className="text-white text-xs text-center">
                        Camera permission denied.
                      </p>
                    </div>
                  )}
                  {camStatus === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 gap-2">
                      <p className="text-white text-xs text-center">
                        Camera unavailable.
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-white border-white"
                        onClick={startCamera}
                      >
                        Retry
                      </Button>
                    </div>
                  )}
                </div>
                {camStatus === "active" && (
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2 w-full gap-1.5"
                    onClick={handleCapture}
                    data-ocid="face.enroll_snapshot_button"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Take Snapshot
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Saving indicator */}
          {saving && (
            <div className="px-5 pb-2 flex items-center gap-2 text-xs text-amber-700">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Computing face descriptor…
            </div>
          )}

          {/* Footer */}
          <div className="px-5 pb-5 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={saving}
              data-ocid="face.enroll_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 gap-1.5"
              disabled={
                saving ||
                (mode === "camera" && !capturedPhoto) ||
                (mode === "profile" && !student.photoUrl)
              }
              onClick={handleConfirm}
              data-ocid="face.enroll_confirm_button"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              {isEnrolled ? "Re-Enroll" : "Enroll"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
