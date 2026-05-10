// ─── useFaceRecognition — face-api.js integration ────────────────────────────
// Loads TinyFaceDetector + FaceRecognitionNet models from jsDelivr CDN,
// computes face descriptors for enrolled students, and continuously matches
// camera frames against the enrolled set.

import { createActor } from "@/backend";
import type { backendInterface } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── CDN base for face-api.js models ─────────────────────────────────────────
const MODEL_BASE =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";

export type ModelStatus = "idle" | "loading" | "ready" | "error";

export interface EnrolledDescriptor {
  studentId: string;
  admNo: string;
  studentName: string;
  fatherName: string;
  classLevel: string;
  section: string;
  routeName: string;
  photoUrl: string;
  descriptor: Float32Array;
}

export interface RecognitionMatch {
  studentId: string;
  admNo: string;
  studentName: string;
  fatherName: string;
  classLevel: string;
  section: string;
  routeName: string;
  photoUrl: string;
  confidence: number; // 0–1, higher = better match
  timestamp: string;
}

// ─── Singleton model-load promise so we only load once ───────────────────────
let modelLoadPromise: Promise<void> | null = null;
let modelsLoaded = false;

async function ensureModelsLoaded(): Promise<void> {
  if (modelsLoaded) return;
  if (modelLoadPromise) return modelLoadPromise;
  modelLoadPromise = (async () => {
    const faceapi = await import("@vladmandic/face-api");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE),
    ]);
    modelsLoaded = true;
  })();
  return modelLoadPromise;
}

/** Load image from URL into an HTMLImageElement safely */
async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/** Compute a 128-float face descriptor from an image URL */
async function computeDescriptor(
  photoUrl: string,
): Promise<Float32Array | null> {
  try {
    const faceapi = await import("@vladmandic/face-api");
    const img = await loadImage(photoUrl);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection?.descriptor ?? null;
  } catch {
    return null;
  }
}

// ─── Model loader hook ────────────────────────────────────────────────────────
export function useFaceApiModels() {
  const [status, setStatus] = useState<ModelStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      await ensureModelsLoaded();
      setStatus("ready");
    } catch (e) {
      modelsLoaded = false;
      modelLoadPromise = null;
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to load face recognition models";
      setError(msg);
      setStatus("error");
    }
  }, []);

  return { status, error, load };
}

// ─── Backend hooks for face enrollment ───────────────────────────────────────

function useBackendActor() {
  return useActor<backendInterface>(createActor);
}

export interface FaceEnrolledStudent {
  studentId: string;
  admNo: string;
  photoUrl: string;
  descriptorJson: string;
  enrolledBy: string;
  faceEnrolled: boolean;
}

export function useGetFaceEnrolledStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FaceEnrolledStudent[]>({
    queryKey: ["faceEnrolledStudents"],
    queryFn: async (): Promise<FaceEnrolledStudent[]> => {
      if (!actor) return [];
      try {
        const raw = await actor.getFaceEnrolledStudents();
        return raw
          .filter((r) => r.faceEnrolled && r.descriptorJson)
          .map((r) => ({
            studentId: r.studentId,
            admNo: r.admNo,
            photoUrl: r.photoUrl ?? "",
            descriptorJson: r.descriptorJson ?? "",
            enrolledBy: r.enrolledBy,
            faceEnrolled: r.faceEnrolled,
          }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000, // 1 min — refresh after enrollment
    refetchOnWindowFocus: true,
  });
}

export function useEnrollStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      admNo,
      enrolledBy,
      photoUrl,
      descriptorJson,
    }: {
      studentId: string;
      admNo: string;
      enrolledBy: string;
      photoUrl: string;
      descriptorJson: string;
    }) => {
      if (!actor) throw new Error("Backend not available.");
      const today = new Date().toISOString().split("T")[0];
      const result = await actor.enrollStudentFace(
        studentId,
        admNo,
        enrolledBy,
        photoUrl || null,
        descriptorJson,
        today,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] }),
  });
}

export function useRevokeStudentFace() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: string) => {
      if (!actor) throw new Error("Backend not available.");
      const result = await actor.revokeStudentFaceEnrollment(studentId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["faceEnrolledStudents"] }),
  });
}

export function useMarkFaceAttendance() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      studentId,
      studentName,
      classLevel,
      section,
      confidence,
    }: {
      studentId: string;
      studentName: string;
      classLevel: string;
      section: string;
      confidence: number;
    }) => {
      const today = new Date().toISOString().split("T")[0];
      const time = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      if (!actor) {
        // Fallback: store locally
        const key = `face_att_backend_${today}`;
        const existing = JSON.parse(
          localStorage.getItem(key) ?? "[]",
        ) as Array<{
          studentId: string;
          time: string;
        }>;
        existing.push({ studentId, time });
        localStorage.setItem(key, JSON.stringify(existing));
        return;
      }
      try {
        const result = await actor.markFaceAttendance(
          studentId,
          studentName,
          classLevel,
          section,
          today,
          time,
          confidence,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
      } catch (e) {
        throw e instanceof Error ? e : new Error("Failed to mark attendance");
      }
    },
  });
}

// ─── Descriptor loader ────────────────────────────────────────────────────────
export interface StudentInfo {
  name: string;
  admNo: string;
  fatherName: string;
  classLevel: string;
  section: string;
  routeName: string;
  photoUrl: string;
}

export function useDescriptorLoader(
  enrolledStudents: FaceEnrolledStudent[],
  studentInfoMap: Map<string, StudentInfo>,
) {
  const [descriptors, setDescriptors] = useState<EnrolledDescriptor[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = useCallback(async () => {
    if (!enrolledStudents.length) return;
    setLoading(true);
    setProgress(0);
    const results: EnrolledDescriptor[] = [];
    for (let i = 0; i < enrolledStudents.length; i++) {
      const { studentId, photoUrl, descriptorJson } = enrolledStudents[i];
      let descriptor: Float32Array | null = null;

      // Fast path: use stored JSON descriptor (no image loading needed)
      if (descriptorJson) {
        try {
          const arr = JSON.parse(descriptorJson) as number[];
          if (Array.isArray(arr) && arr.length === 128) {
            descriptor = new Float32Array(arr);
          }
        } catch {
          // fall through to photo-based computation
        }
      }

      // Slow path: compute from photo URL
      if (!descriptor && photoUrl) {
        descriptor = await computeDescriptor(photoUrl);
      }

      if (descriptor) {
        const info = studentInfoMap.get(studentId);
        results.push({
          studentId,
          admNo: info?.admNo ?? "",
          studentName: info?.name ?? studentId,
          fatherName: info?.fatherName ?? "",
          classLevel: info?.classLevel ?? "",
          section: info?.section ?? "",
          routeName: info?.routeName ?? "",
          photoUrl: info?.photoUrl ?? photoUrl,
          descriptor,
        });
      }
      setProgress(Math.round(((i + 1) / enrolledStudents.length) * 100));
    }
    setDescriptors(results);
    setLoading(false);
  }, [enrolledStudents, studentInfoMap]);

  return { descriptors, loading, progress, load };
}

// ─── Real-time recognition loop ───────────────────────────────────────────────
export function useRecognitionLoop(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  descriptors: EnrolledDescriptor[],
  markedIds: Set<string>,
  active: boolean,
  onMatch: (match: RecognitionMatch) => void,
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processingRef = useRef(false);

  const runOnce = useCallback(async () => {
    if (processingRef.current) return;
    if (!videoRef.current || descriptors.length === 0) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;
    processingRef.current = true;
    try {
      const faceapi = await import("@vladmandic/face-api");
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) return;
      const unmatched = descriptors.filter((d) => !markedIds.has(d.studentId));
      if (unmatched.length === 0) return;
      const matcher = new faceapi.FaceMatcher(
        unmatched.map(
          (d) =>
            new faceapi.LabeledFaceDescriptors(d.studentId, [d.descriptor]),
        ),
        0.55, // max distance threshold
      );
      const best = matcher.findBestMatch(detection.descriptor);
      if (best.label !== "unknown") {
        const confidence = Math.max(0, 1 - best.distance);
        const enrolled = descriptors.find((d) => d.studentId === best.label);
        if (enrolled) {
          const now = new Date();
          const timestamp = now.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          onMatch({
            studentId: enrolled.studentId,
            admNo: enrolled.admNo,
            studentName: enrolled.studentName,
            fatherName: enrolled.fatherName,
            classLevel: enrolled.classLevel,
            section: enrolled.section,
            routeName: enrolled.routeName,
            photoUrl: enrolled.photoUrl,
            confidence,
            timestamp,
          });
        }
      }
    } catch {
      // silently ignore frame-level errors
    } finally {
      processingRef.current = false;
    }
  }, [videoRef, descriptors, markedIds, onMatch]);

  useEffect(() => {
    if (!active || descriptors.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(runOnce, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, descriptors, runOnce]);
}
