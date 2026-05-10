// ─── FaceAttendancePage ────────────────────────────────────────────────────
// Full face attendance page:
//  - Tab 1: Take Attendance (camera + real-time recognition + live list)
//  - Tab 2: Enroll Students (manage face enrollments backed by Motoko)

import EnrollFaceDialog from "@/components/attendance/EnrollFaceDialog";
import FaceRecognitionCamera from "@/components/attendance/FaceRecognitionCamera";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoutes, useSections, useStudents } from "@/hooks/useBackend";
import {
  useDescriptorLoader,
  useEnrollStudentFace,
  useFaceApiModels,
  useGetFaceEnrolledStudents,
  useMarkFaceAttendance,
  useRevokeStudentFace,
} from "@/hooks/useFaceRecognition";
import type { RecognitionMatch } from "@/hooks/useFaceRecognition";
import {
  CLASS_ORDER,
  formatDate,
  getClassLabel,
  getInitials,
} from "@/lib/utils";
import type { ClassLevel, Student } from "@/types";
import { ScanFace, Search, UserCheck, Users, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

interface MarkedEntry {
  studentId: string;
  admNo: string;
  studentName: string;
  fatherName: string;
  classLevel: string;
  section: string;
  routeName: string;
  photoUrl: string;
  time: string;
  confidence: number;
}

// ─── Take Attendance Tab ────────────────────────────────────────────────────
function TakeAttendanceTab() {
  const { data: allStudents = [], isLoading: studentsLoading } = useStudents();
  const { data: allSections = [] } = useSections();
  const { data: enrolledStudents = [], isLoading: enrollLoading } =
    useGetFaceEnrolledStudents();
  const markMutation = useMarkFaceAttendance();

  // Model loading
  const {
    status: modelStatus,
    error: modelError,
    load: loadModels,
  } = useFaceApiModels();

  // Auto-load models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Class + Section filter
  const availableClasses = CLASS_ORDER.filter((cl) =>
    allStudents.some((s) => s.classLevel === cl),
  );
  const [classLevel, setClassLevel] = useState<ClassLevel>(
    availableClasses[0] ?? "Class1",
  );
  const [sectionId, setSectionId] = useState("");

  const sections = allSections.filter((s) => s.classLevel === classLevel);
  useEffect(() => {
    if (sections.length > 0 && !sectionId) setSectionId(sections[0].id);
  }, [sections, sectionId]);

  const studentsInClass = allStudents.filter(
    (s) =>
      s.classLevel === classLevel &&
      s.sectionId === sectionId &&
      !s.isDiscontinued,
  );

  // Build student name map for descriptor loading
  const sectionName = sections.find((s) => s.id === sectionId)?.name ?? "A";
  const { data: routes = [] } = useRoutes();
  // biome-ignore lint/correctness/useExhaustiveDependencies: routes is stable reference
  const studentNameMap = useMemo(() => {
    const map = new Map<
      string,
      import("@/hooks/useFaceRecognition").StudentInfo
    >();
    for (const s of allStudents) {
      const sec = allSections.find((sec) => sec.id === s.sectionId);
      const route = routes.find((r) => r.id === s.transportRouteId);
      map.set(s.id, {
        name: s.fullName,
        admNo: s.admNo,
        fatherName: s.fatherName,
        classLevel: s.classLevel,
        section: sec?.name ?? "A",
        routeName: route?.name ?? "",
        photoUrl: s.photoUrl,
      });
    }
    return map;
  }, [allStudents, allSections]);

  // Descriptor loading
  const {
    descriptors,
    loading: descriptorLoading,
    progress,
    load: loadDescriptors,
  } = useDescriptorLoader(enrolledStudents, studentNameMap);

  // Load descriptors once models are ready and enrolled students are fetched
  useEffect(() => {
    if (
      modelStatus === "ready" &&
      enrolledStudents.length > 0 &&
      descriptors.length === 0
    ) {
      loadDescriptors();
    }
  }, [
    modelStatus,
    enrolledStudents.length,
    descriptors.length,
    loadDescriptors,
  ]);

  // Marked attendance (session-keyed by today)
  const todayKey = `face_att_marked_${todayISO()}`;
  const [markedEntries, setMarkedEntries] = useState<MarkedEntry[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(todayKey) ?? "[]",
      ) as MarkedEntry[];
    } catch {
      return [];
    }
  });

  const handleMarkPresent = useCallback(
    async (match: RecognitionMatch) => {
      if (markedEntries.some((e) => e.studentId === match.studentId)) {
        toast.info(`${match.studentName} is already marked present.`);
        return;
      }
      const time = nowTime();
      const entry: MarkedEntry = {
        studentId: match.studentId,
        admNo: match.admNo,
        studentName: match.studentName,
        fatherName: match.fatherName,
        classLevel: match.classLevel,
        section: match.section,
        routeName: match.routeName,
        photoUrl: match.photoUrl,
        time,
        confidence: match.confidence,
      };
      const updated = [...markedEntries, entry];
      setMarkedEntries(updated);
      localStorage.setItem(todayKey, JSON.stringify(updated));
      toast.success(`${match.studentName} marked Present`);
      // Save to backend
      try {
        await markMutation.mutateAsync({
          studentId: match.studentId,
          studentName: match.studentName,
          classLevel: match.classLevel,
          section: match.section,
          confidence: match.confidence,
        });
      } catch {
        // already saved locally; backend failure is non-fatal
      }
    },
    [markedEntries, markMutation, todayKey],
  );

  if (studentsLoading || enrollLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="face.take_attendance_tab">
      {/* Class/Section selector */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fa-class"
                className="text-xs font-medium text-muted-foreground"
              >
                Class
              </label>
              <Select
                value={classLevel}
                onValueChange={(v) => {
                  const cl = v as ClassLevel;
                  setClassLevel(cl);
                  const secs = allSections.filter((s) => s.classLevel === cl);
                  setSectionId(secs[0]?.id ?? "");
                }}
              >
                <SelectTrigger
                  id="fa-class"
                  className="w-36"
                  data-ocid="face.class_select"
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
                htmlFor="fa-section"
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
                  id="fa-section"
                  className="w-28"
                  data-ocid="face.section_select"
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
            <div className="ml-auto flex items-end gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {
                  markedEntries.filter(
                    (e) =>
                      e.classLevel === classLevel && e.section === sectionName,
                  ).length
                }{" "}
                marked today
              </span>
              <span className="text-muted-foreground">
                / {studentsInClass.length} in class
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera + recognition + live list */}
      <FaceRecognitionCamera
        students={studentsInClass}
        descriptors={descriptors}
        descriptorLoading={descriptorLoading}
        descriptorProgress={progress}
        modelStatus={modelStatus}
        modelError={modelError}
        onRetryModels={loadModels}
        onMarkPresent={handleMarkPresent}
        markedEntries={markedEntries.filter(
          (e) => e.classLevel === classLevel && e.section === sectionName,
        )}
        enrolledCount={enrolledStudents.length}
        enrolledLoading={enrollLoading}
      />
    </div>
  );
}

// ─── Enroll Students Tab ───────────────────────────────────────────────────
function EnrollStudentsTab() {
  const { data: allStudents = [], isLoading } = useStudents();
  const { data: enrolledStudents = [] } = useGetFaceEnrolledStudents();
  const enrollMutation = useEnrollStudentFace();
  const revokeMutation = useRevokeStudentFace();

  const [search, setSearch] = useState("");
  const [enrollingStudent, setEnrollingStudent] = useState<Student | null>(
    null,
  );

  const enrolledIds = useMemo(
    () => new Set(enrolledStudents.map((e) => e.studentId)),
    [enrolledStudents],
  );

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

  const _handleEnroll = async (photoUrl: string) => {
    if (!enrollingStudent) return;
    await enrollMutation.mutateAsync({
      studentId: enrollingStudent.id,
      admNo: enrollingStudent.admNo,
      enrolledBy: "Admin",
      photoUrl,
      descriptorJson: "[]", // descriptor computed client-side; backend stores for reference
    });
  };

  const handleRevoke = async (student: Student) => {
    try {
      await revokeMutation.mutateAsync(student.id);
      toast.success(`Face enrollment removed for ${student.fullName}`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to revoke enrollment",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="face.enroll_section">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-emerald-700">
              {enrolledCount}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-amber-700">
              {activeStudents.length - enrolledCount}
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

      {/* Student list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
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
                            <Badge className="gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100">
                              <UserCheck className="w-3 h-3" />
                              Enrolled
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-muted-foreground"
                            >
                              Not Enrolled
                            </Badge>
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
                                onClick={() => handleRevoke(student)}
                                disabled={revokeMutation.isPending}
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

      {/* Enroll dialog */}
      <AnimatePresence>
        {enrollingStudent && (
          <EnrollFaceDialog
            key={enrollingStudent.id}
            student={enrollingStudent}
            isEnrolled={enrolledIds.has(enrollingStudent.id)}
            onClose={() => setEnrollingStudent(null)}
            onEnrolled={() => setEnrollingStudent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function FaceAttendancePage() {
  return (
    <div className="space-y-4" data-ocid="face_attendance.page">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
          <ScanFace className="w-5 h-5 text-violet-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Face Attendance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Auto-recognition with face-api.js •{" "}
            {formatDate(new Date().toISOString().split("T")[0])}
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="take"
        className="space-y-4"
        data-ocid="face_attendance.tabs"
      >
        <TabsList className="h-auto gap-1 p-1">
          <TabsTrigger
            value="take"
            className="gap-1.5"
            data-ocid="face_attendance.take_tab"
          >
            <ScanFace className="w-3.5 h-3.5" />
            Take Attendance
          </TabsTrigger>
          <TabsTrigger
            value="enroll"
            className="gap-1.5"
            data-ocid="face_attendance.enroll_tab"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Enroll Students
          </TabsTrigger>
        </TabsList>
        <TabsContent value="take">
          <TakeAttendanceTab />
        </TabsContent>
        <TabsContent value="enroll">
          <EnrollStudentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
