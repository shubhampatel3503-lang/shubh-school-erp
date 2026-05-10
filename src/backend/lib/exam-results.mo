import List   "mo:core/List";
import Map    "mo:core/Map";
import Float  "mo:core/Float";
import ExamResultsTypes "../types/exam-results";

/// Domain logic for enhanced exam results: grade calculation, marks validation,
/// result persistence helpers, and academic-performance report generation.
module {

  // ── Grade Calculation ──────────────────────────────────────────────────────

  /// Calculate Indian 8-point grade scale from percentage.
  /// A1 91-100 | A2 81-90 | B1 71-80 | B2 61-70 | C1 51-60 | C2 41-50 | D 33-40 | E <33
  public func calculateGrade(marksObtained : Float, maxMarks : Float) : Text {
    if (maxMarks <= 0.0) { return "N/A" };
    let pct = (marksObtained / maxMarks) * 100.0;
    if (pct >= 91.0)      { "A1" }
    else if (pct >= 81.0) { "A2" }
    else if (pct >= 71.0) { "B1" }
    else if (pct >= 61.0) { "B2" }
    else if (pct >= 51.0) { "C1" }
    else if (pct >= 41.0) { "C2" }
    else if (pct >= 33.0) { "D" }
    else                  { "E" }
  };

  public func isPassed(marksObtained : Float, passingMarks : Float) : Bool {
    marksObtained >= passingMarks
  };

  // ── Subject marks builder ────────────────────────────────────────────────

  public type RawMark = {
    subjectId    : Text;
    subjectName  : Text;
    marksObtained: Float;
    maxMarks     : Float;
    passingMarks : Float;
  };

  /// Build SubjectMarkEntry array from raw marks, computing grade + pass/fail.
  public func buildSubjectMarks(raw : [RawMark]) : [ExamResultsTypes.SubjectMarkEntry] {
    raw.map(func(r : RawMark) : ExamResultsTypes.SubjectMarkEntry {
      let grade   = calculateGrade(r.marksObtained, r.maxMarks);
      let passed  = isPassed(r.marksObtained, r.passingMarks);
      {
        subjectId     = r.subjectId;
        subjectName   = r.subjectName;
        marksObtained = r.marksObtained;
        maxMarks      = r.maxMarks;
        passingMarks  = r.passingMarks;
        grade;
        isPassed      = passed;
      }
    })
  };

  // ── Aggregate helpers ─────────────────────────────────────────────────────

  public func totalObtained(marks : [ExamResultsTypes.SubjectMarkEntry]) : Float {
    marks.foldLeft(0.0, func(acc, m) = acc + m.marksObtained)
  };

  public func totalMax(marks : [ExamResultsTypes.SubjectMarkEntry]) : Float {
    marks.foldLeft(0.0, func(acc, m) = acc + m.maxMarks)
  };

  public func overallPercentage(marks : [ExamResultsTypes.SubjectMarkEntry]) : Float {
    let tMax = totalMax(marks);
    if (tMax <= 0.0) { 0.0 } else { (totalObtained(marks) / tMax) * 100.0 }
  };

  /// Overall pass/fail: student must pass EVERY subject.
  public func overallPassed(marks : [ExamResultsTypes.SubjectMarkEntry]) : Bool {
    if (marks.size() == 0) { return false };
    marks.all(func(m : ExamResultsTypes.SubjectMarkEntry) : Bool { m.isPassed })
  };

  // ── Academic performance report ────────────────────────────────────────────

  /// Build academic performance report from all exam results for a student.
  public func buildReport(
    studentId   : Text,
    sessionId   : Text,
    results     : [ExamResultsTypes.ExamResultV2],
    configs     : [ExamResultsTypes.ExamConfig],
  ) : ExamResultsTypes.AcademicPerformanceReport {
    // Build summaries for each result that belongs to this student+session
    let summaries = List.empty<ExamResultsTypes.ExamSummary>();
    for (r in results.values()) {
      if (r.studentId == studentId and r.sessionId == sessionId) {
        summaries.add({
          examConfigId  = r.examConfigId;
          examName      = r.examName;
          subjectMarks  = r.subjectMarks;
          percentage    = r.percentage;
          overallGrade  = r.overallGrade;
          overallPassed = r.overallPassed;
        });
      };
    };

    let summaryArr = summaries.toArray();

    // Combined percentage: weighted if configs specify weightage, else simple average
    let combinedPct : Float = if (summaryArr.size() == 0) {
      0.0
    } else {
      // Look up which exam configs are included in combined report
      let includedSummaries = summaryArr.filter(func(s : ExamResultsTypes.ExamSummary) : Bool {
        configs.find(func(c : ExamResultsTypes.ExamConfig) : Bool {
          c.id == s.examConfigId and c.includeInCombined
        }) != null
      });
      if (includedSummaries.size() == 0) {
        // Fallback: average all
        let sum = summaryArr.foldLeft(0.0, func(acc, s) = acc + s.percentage);
        sum / summaryArr.size().toFloat()
      } else {
        let sum = includedSummaries.foldLeft(0.0, func(acc, s) = acc + s.percentage);
        sum / includedSummaries.size().toFloat()
      }
    };

    let combinedGrade = if (summaryArr.size() == 0) { "N/A" } else {
      calculateGrade(combinedPct, 100.0)
    };
    let allPassed = summaryArr.all(func(s : ExamResultsTypes.ExamSummary) : Bool { s.overallPassed });

    {
      studentId;
      sessionId;
      examSummaries      = summaryArr;
      combinedPercentage = combinedPct;
      combinedGrade;
      overallPassed      = allPassed;
    }
  };

}
