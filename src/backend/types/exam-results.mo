module {

  /// One subject's marks entry in an exam result.
  public type SubjectMarkEntry = {
    subjectId      : Text;
    subjectName    : Text;
    marksObtained  : Float;
    maxMarks       : Float;
    passingMarks   : Float;
    grade          : Text;
    isPassed       : Bool;
  };

  /// Full exam result for a student in one exam — replaces legacy ExamResult.
  public type ExamResultV2 = {
    id              : Text;
    examConfigId    : Text;   // references ExamConfig.id
    examName        : Text;
    sessionId       : Text;
    classId         : Text;   // classLevel as Text (e.g. "Class5")
    studentId       : Text;
    subjectMarks    : [SubjectMarkEntry];
    totalObtained   : Float;
    totalMax        : Float;
    percentage      : Float;
    overallGrade    : Text;
    overallPassed   : Bool;
    rank            : ?Nat;
    remarks         : ?Text;
    savedAt         : Int;
  };

  /// Per-subject configuration for an exam in a class.
  public type ExamSubjectConfig = {
    subjectId    : Text;
    subjectName  : Text;
    maxMarks     : Float;
    passingMarks : Float;
  };

  /// Exam configuration record (Quarterly / Half Yearly / Annual etc.).
  public type ExamConfig = {
    id                   : Text;
    examName             : Text;  // e.g. "Quarterly", "Half Yearly", "Annual"
    sessionId            : Text;
    classId              : Text;  // classLevel as Text
    subjectConfigs       : [ExamSubjectConfig];
    includeInCombined    : Bool;  // whether this exam counts in year-end combined report
    weightage            : Float; // 0.0-1.0 portion in combined score; 0.0 means equal weight
    createdAt            : Int;
  };

  /// Year-end academic performance report for one student.
  public type ExamSummary = {
    examConfigId  : Text;
    examName      : Text;
    subjectMarks  : [SubjectMarkEntry];
    percentage    : Float;
    overallGrade  : Text;
    overallPassed : Bool;
  };

  public type AcademicPerformanceReport = {
    studentId     : Text;
    sessionId     : Text;
    examSummaries : [ExamSummary];
    combinedPercentage : Float;
    combinedGrade      : Text;
    overallPassed      : Bool;
  };

}
