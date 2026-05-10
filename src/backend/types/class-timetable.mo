module {

  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12;
  };

  public type ClassTimetableEntry = {
    periodNumber  : Nat;
    dayOfWeek     : Text;   // "Monday" .. "Saturday"
    classLevel    : ClassLevel;
    sectionName   : Text;
    subjectName   : Text;
    teacherName   : Text;
    teacherStaffId : Text;
    startTime     : Text;
    endTime       : Text;
  };

  /// Per-period configuration.  isInterval = true means this slot is a break/recess.
  public type PeriodConfig = {
    periodNumber    : Nat;
    durationMinutes : Nat;
    startTime       : Text;  // "HH:MM"
    isInterval      : Bool;
  };

  public type ClassTimetable = {
    id            : Text;
    sessionId     : Text;
    name          : Text;
    entries       : [ClassTimetableEntry];
    /// Optional per-period duration/start configs.  Null/empty = uniform periods.
    /// Stored as optional for backward compatibility with records saved before this field existed.
    periodConfigs : ?[PeriodConfig];
    createdAt     : Int;
    updatedAt     : Int;
  };

  /// A single copy-paste cell reference.
  public type TimetableCellRef = {
    classId      : Text;   // timetable id
    dayOfWeek    : Text;
    periodNumber : Nat;
  };

  /// One copy/paste operation: source cell copied to target cell.
  public type CellCopyOp = {
    source : TimetableCellRef;
    target : TimetableCellRef;
  };

  /// A teacher-wise timetable entry (one period in one class).
  public type TeacherTimetableEntry = {
    dayOfWeek    : Text;
    periodNumber : Nat;
    className    : Text;  // human-readable e.g. "Class 5"
    sectionName  : Text;
    subjectName  : Text;
    startTime    : Text;
    endTime      : Text;
  };

  /// Teacher-wise aggregated timetable generated from class timetables.
  public type TeacherTimetable = {
    id            : Text;
    sessionId     : Text;
    teacherStaffId : Text;
    teacherName   : Text;
    entries       : [TeacherTimetableEntry];
    generatedAt   : Int;
  };

  /// Per-class CCTV and digital broadcast hyperlinks.
  public type ClassLinks = {
    classLevel   : Text;   // debug_show of ClassLevel e.g. "#Class5"
    sectionName  : Text;
    cctvUrl      : Text;
    broadcastUrl : Text;
  };

  /// Parameters for auto-generating a class timetable.
  public type GenerateTimetableParams = {
    sessionId    : Text;
    name         : Text;
    // Classes/sections to include, e.g. [(#Class1, "A"), (#Class1, "B")]
    classSections : [(ClassLevel, Text)];
    periodsPerDay : Nat;
    // Work days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    workDays     : [Text];
    periodStartTimes : [Text];   // length == periodsPerDay, e.g. ["08:00","08:45",...]
    periodEndTimes   : [Text];   // same length
    /// Optional per-period configs (may be empty; overrides start/end times when present)
    periodConfigs    : ?[PeriodConfig];
  };

};
