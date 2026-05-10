import Map              "mo:core/Map";
import List             "mo:core/List";
import Time             "mo:core/Time";
import Float            "mo:core/Float";
import ExamResultsTypes "../types/exam-results";
import ExamResultsLib   "../lib/exam-results";

/// Enhanced exam results mixin.
/// Provides exam configuration CRUD, per-student marks entry with grade
/// calculation, and academic-performance report generation.
mixin (
  examConfigs    : Map.Map<Text, ExamResultsTypes.ExamConfig>,
  examResultsV2  : Map.Map<Text, ExamResultsTypes.ExamResultV2>,
  nextExamResultId : { var value : Nat },
) {

  func genExamId() : Text {
    let id = nextExamResultId.value;
    nextExamResultId.value += 1;
    id.toText()
  };

  // ── Exam Configuration ─────────────────────────────────────────────────────

  public shared func saveExamConfig(
    examName          : Text,
    sessionId         : Text,
    classId           : Text,
    subjectConfigs    : [ExamResultsTypes.ExamSubjectConfig],
    includeInCombined : Bool,
    weightage         : Float,
  ) : async ExamResultsTypes.ExamConfig {
    // Upsert: find existing config for same name+session+class or create new
    let existing = examConfigs.values()
      |> List.fromIter<ExamResultsTypes.ExamConfig>(_)
      |> _.find(func(c : ExamResultsTypes.ExamConfig) : Bool {
          c.examName == examName and c.sessionId == sessionId and c.classId == classId
        });
    let id = switch (existing) {
      case (?c) c.id;
      case null genExamId();
    };
    let cfg : ExamResultsTypes.ExamConfig = {
      id; examName; sessionId; classId; subjectConfigs;
      includeInCombined; weightage; createdAt = Time.now();
    };
    examConfigs.add(id, cfg);
    cfg
  };

  public query func getExamConfigs(sessionId : Text, classId : Text) : async [ExamResultsTypes.ExamConfig] {
    examConfigs.values()
      |> List.fromIter<ExamResultsTypes.ExamConfig>(_)
      |> _.filter(func(c : ExamResultsTypes.ExamConfig) : Bool {
          c.sessionId == sessionId and c.classId == classId
        })
      |> _.toArray()
  };

  public query func getAllExamConfigs(sessionId : Text) : async [ExamResultsTypes.ExamConfig] {
    examConfigs.values()
      |> List.fromIter<ExamResultsTypes.ExamConfig>(_)
      |> _.filter(func(c : ExamResultsTypes.ExamConfig) : Bool { c.sessionId == sessionId })
      |> _.toArray()
  };

  public shared func deleteExamConfig(id : Text) : async () {
    examConfigs.remove(id)
  };

  // ── Grade helper (exposed as public query) ─────────────────────────────────

  public query func calculateGrade(marksObtained : Float, maxMarks : Float) : async Text {
    ExamResultsLib.calculateGrade(marksObtained, maxMarks)
  };

  // ── Marks Entry ──────────────────────────────────────────────────────────

  /// Save exam marks for a student in an exam, computing grades automatically.
  /// `rawMarks` each element: (subjectId, subjectName, marksObtained, maxMarks, passingMarks)
  public shared func saveExamMarks(
    examConfigId : Text,
    sessionId    : Text,
    classId      : Text,
    studentId    : Text,
    rawMarks     : [{ subjectId : Text; subjectName : Text; marksObtained : Float; maxMarks : Float; passingMarks : Float }],
    rank         : ?Nat,
    remarks      : ?Text,
  ) : async { #ok : ExamResultsTypes.ExamResultV2; #err : Text } {
    // Look up exam name from config
    let examName = switch (examConfigs.get(examConfigId)) {
      case (?cfg) cfg.examName;
      case null   { return #err("Exam configuration not found: " # examConfigId) };
    };

    // Validate marks against configured maxMarks
    let configSubjects = switch (examConfigs.get(examConfigId)) {
      case (?cfg) cfg.subjectConfigs;
      case null   [];
    };
    for (raw in rawMarks.values()) {
      let cfgOpt = configSubjects.find(func(sc : ExamResultsTypes.ExamSubjectConfig) : Bool {
        sc.subjectId == raw.subjectId
      });
      switch (cfgOpt) {
        case (?cfg) {
          if (raw.marksObtained > cfg.maxMarks) {
            return #err("Marks exceed max for subject " # raw.subjectId #
              ": obtained " # raw.marksObtained.toText() #
              " > max " # cfg.maxMarks.toText());
          };
        };
        case null {}; // subject not in config — allow but use provided max
      };
    };

    let rawList : [ExamResultsLib.RawMark] = rawMarks.map(
      func(r : { subjectId : Text; subjectName : Text; marksObtained : Float; maxMarks : Float; passingMarks : Float }) : ExamResultsLib.RawMark = {
        subjectId     = r.subjectId;
        subjectName   = r.subjectName;
        marksObtained = r.marksObtained;
        maxMarks      = r.maxMarks;
        passingMarks  = r.passingMarks;
      }
    );

    let subjectMarks = ExamResultsLib.buildSubjectMarks(rawList);
    let totalObtained = ExamResultsLib.totalObtained(subjectMarks);
    let totalMax      = ExamResultsLib.totalMax(subjectMarks);
    let percentage    = ExamResultsLib.overallPercentage(subjectMarks);
    let overallGrade  = ExamResultsLib.calculateGrade(totalObtained, totalMax);
    let overallPassed = ExamResultsLib.overallPassed(subjectMarks);

    // Upsert: one result per student per examConfig
    let existingId : ?Text = do {
      let found = examResultsV2.values()
        |> List.fromIter<ExamResultsTypes.ExamResultV2>(_)
        |> _.find(func(r : ExamResultsTypes.ExamResultV2) : Bool {
            r.examConfigId == examConfigId and r.studentId == studentId
          });
      switch (found) { case (?r) ?r.id; case null null };
    };
    let id = switch (existingId) { case (?eid) eid; case null genExamId() };

    let result : ExamResultsTypes.ExamResultV2 = {
      id; examConfigId; examName; sessionId; classId; studentId;
      subjectMarks; totalObtained; totalMax; percentage;
      overallGrade; overallPassed; rank; remarks;
      savedAt = Time.now();
    };
    examResultsV2.add(id, result);
    #ok(result)
  };

  // ── Queries ───────────────────────────────────────────────────────────────

  public query func getExamResultsByStudent(
    studentId : Text,
    sessionId : Text,
  ) : async [ExamResultsTypes.ExamResultV2] {
    examResultsV2.values()
      |> List.fromIter<ExamResultsTypes.ExamResultV2>(_)
      |> _.filter(func(r : ExamResultsTypes.ExamResultV2) : Bool {
          r.studentId == studentId and r.sessionId == sessionId
        })
      |> _.toArray()
  };

  public query func getExamResultsByExam(
    examConfigId : Text,
  ) : async [ExamResultsTypes.ExamResultV2] {
    examResultsV2.values()
      |> List.fromIter<ExamResultsTypes.ExamResultV2>(_)
      |> _.filter(func(r : ExamResultsTypes.ExamResultV2) : Bool { r.examConfigId == examConfigId })
      |> _.toArray()
  };

  public query func getExamResultsByClass(
    classId   : Text,
    sessionId : Text,
    examConfigId : Text,
  ) : async [ExamResultsTypes.ExamResultV2] {
    examResultsV2.values()
      |> List.fromIter<ExamResultsTypes.ExamResultV2>(_)
      |> _.filter(func(r : ExamResultsTypes.ExamResultV2) : Bool {
          r.classId == classId and r.sessionId == sessionId and r.examConfigId == examConfigId
        })
      |> _.toArray()
  };

  public query func getAcademicPerformanceReport(
    studentId : Text,
    sessionId : Text,
  ) : async ExamResultsTypes.AcademicPerformanceReport {
    let results = examResultsV2.values()
      |> List.fromIter<ExamResultsTypes.ExamResultV2>(_)
      |> _.filter(func(r : ExamResultsTypes.ExamResultV2) : Bool {
          r.studentId == studentId and r.sessionId == sessionId
        })
      |> _.toArray();
    let configs = examConfigs.values()
      |> List.fromIter<ExamResultsTypes.ExamConfig>(_)
      |> _.filter(func(c : ExamResultsTypes.ExamConfig) : Bool { c.sessionId == sessionId })
      |> _.toArray();
    ExamResultsLib.buildReport(studentId, sessionId, results, configs)
  };

  public shared func deleteExamResult(id : Text) : async () {
    examResultsV2.remove(id)
  };

}
