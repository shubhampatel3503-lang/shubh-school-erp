import { ClassTimetableGrid } from "@/components/timetable/ClassTimetableGrid";
import { PeriodConfigPanel } from "@/components/timetable/PeriodConfigPanel";
import { SchoolWideTimetable } from "@/components/timetable/SchoolWideTimetable";
import { TeacherTimetablePanel } from "@/components/timetable/TeacherTimetablePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ClassTimetableData,
  type CopiedCell,
  useClassTimetables,
} from "@/hooks/useTimetable";
import { useAppStore } from "@/store/useAppStore";
import {
  Calendar,
  Clipboard,
  Clock,
  Copy,
  GraduationCap,
  LayoutGrid,
  Settings2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Class-to-label mapping
const CLASS_LABELS: Record<string, string> = {
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

function getTimetableLabel(tt: ClassTimetableData): string {
  // Try to get from first entry
  const first = tt.entries[0];
  if (first) {
    const cl = CLASS_LABELS[first.classLevel] ?? first.classLevel;
    return `${cl} ${first.sectionName ? `- ${first.sectionName}` : ""}`.trim();
  }
  return tt.name || tt.id.slice(0, 8);
}

export default function TimetablePage() {
  const activeSession = useAppStore((s) => s.currentSession);
  const { data: timetables = [], isLoading } =
    useClassTimetables(activeSession);
  const [selectedId, setSelectedId] = useState<string>("");
  const [localTimetable, setLocalTimetable] =
    useState<ClassTimetableData | null>(null);
  const [copiedCell, setCopiedCell] = useState<CopiedCell | null>(null);
  const [activeTab, setActiveTab] = useState<
    "class" | "school" | "teacher" | "config"
  >("class");

  // Select first timetable when data loads
  useEffect(() => {
    if (timetables.length && !selectedId) {
      setSelectedId(timetables[0].id);
    }
  }, [timetables, selectedId]);

  // Sync local copy when selection changes
  useEffect(() => {
    const found = timetables.find((t) => t.id === selectedId) ?? null;
    setLocalTimetable(found);
  }, [selectedId, timetables]);

  // Clear copy on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCopiedCell(null);
        toast.info("Copy cancelled.");
      }
      // Ctrl+C on selected cell handled inside ClassTimetableGrid
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const selectedTimetable =
    localTimetable ?? timetables.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6 p-6" data-ocid="timetable.page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Class-wise and school-wide schedule • Live period highlighting
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {copiedCell && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setCopiedCell(null)}
              data-ocid="timetable.copy_status_badge"
            >
              <Copy className="h-3 w-3" />
              Copied: {copiedCell.subjectName}
              <span className="text-muted-foreground text-[10px] ml-1">
                ✕ clear
              </span>
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Session: {activeSession ?? "2025-26"}
          </Badge>
        </div>
      </div>

      {/* Main tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "class" | "school" | "teacher" | "config")
        }
      >
        <TabsList data-ocid="timetable.tabs">
          <TabsTrigger value="class" data-ocid="timetable.class_tab">
            <GraduationCap className="h-4 w-4 mr-1.5" />
            Class-wise
          </TabsTrigger>
          <TabsTrigger value="school" data-ocid="timetable.school_tab">
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            School-wide
          </TabsTrigger>
          <TabsTrigger value="teacher" data-ocid="timetable.teacher_tab">
            <Users className="h-4 w-4 mr-1.5" />
            Teacher-wise
          </TabsTrigger>
          <TabsTrigger
            value="config"
            disabled={!selectedTimetable}
            data-ocid="timetable.config_tab"
          >
            <Settings2 className="h-4 w-4 mr-1.5" />
            Period Config
          </TabsTrigger>
        </TabsList>

        {/* ── Class-wise tab ───────────────────────────────────────────── */}
        <TabsContent value="class" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <CardTitle className="text-base">Class Timetable</CardTitle>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  {/* Copy toolbar buttons */}
                  {!copiedCell ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info(
                          "Hover a cell and click the Copy icon, or right-click a cell.",
                        )
                      }
                      data-ocid="timetable.copy_help_button"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Cell
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setCopiedCell(null)}
                        data-ocid="timetable.clear_copy_button"
                      >
                        ✕ Clear Copy
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        <Clipboard className="h-3 w-3 mr-1" />
                        Click any cell to paste
                      </Badge>
                    </>
                  )}

                  {/* Class selector */}
                  {isLoading ? (
                    <Skeleton className="h-9 w-44" />
                  ) : (
                    <Select value={selectedId} onValueChange={setSelectedId}>
                      <SelectTrigger
                        className="w-44"
                        data-ocid="timetable.class_select"
                      >
                        <SelectValue placeholder="Select class…" />
                      </SelectTrigger>
                      <SelectContent style={{ zIndex: 9999 }}>
                        {timetables.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No timetables yet
                          </SelectItem>
                        ) : (
                          timetables.map((tt) => (
                            <SelectItem key={tt.id} value={tt.id}>
                              {getTimetableLabel(tt)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : !selectedTimetable ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-ocid="timetable.empty_state"
                >
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-muted-foreground font-medium">
                    No timetable selected
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a class from the dropdown above, or generate a
                    timetable from the Academics module.
                  </p>
                </div>
              ) : (
                <ClassTimetableGrid
                  timetable={selectedTimetable}
                  onTimetableChange={(updated) => {
                    setLocalTimetable(updated);
                  }}
                  copiedCell={copiedCell}
                  onCopy={(cell) => setCopiedCell(cell)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── School-wide tab ──────────────────────────────────────────── */}
        <TabsContent value="school" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">School-wide Timetable</CardTitle>
              <p className="text-xs text-muted-foreground">
                All classes side by side • Periods as rows, classes as columns •
                Live period highlighted in green
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <SchoolWideTimetable sessionId={activeSession} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Teacher-wise tab ─────────────────────────────────────────────── */}
        <TabsContent value="teacher" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Teacher-wise Timetable
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Auto-generated from class timetables • Print individual teacher
                schedules
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <TeacherTimetablePanel sessionId={activeSession ?? "2025-26"} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Period config tab ────────────────────────────────────────── */}
        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Period Configuration</CardTitle>
              <p className="text-xs text-muted-foreground">
                Configure individual period durations and break intervals for{" "}
                <span className="font-medium text-foreground">
                  {selectedTimetable
                    ? getTimetableLabel(selectedTimetable)
                    : "the selected class"}
                </span>
                .
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {selectedTimetable ? (
                <PeriodConfigPanel
                  timetable={selectedTimetable}
                  onTimetableChange={(updated) => {
                    setLocalTimetable(updated);
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Select a class timetable first from the Class-wise tab.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
