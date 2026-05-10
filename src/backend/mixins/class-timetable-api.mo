import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import ClassTimetableLib "../lib/class-timetable";
import ClassTimetableTypes "../types/class-timetable";

/// Class Timetable mixin — wizard-based timetable generation with conflict detection.
/// State slices injected:
///   classTimetables    — storage for class timetables
///   classTtGenId       — id counter
///   teacherTimetables  — storage for auto-generated teacher timetables
///   classLinksStore    — per-class CCTV/broadcast link storage
mixin (
  classTimetables   : Map.Map<Text, ClassTimetableTypes.ClassTimetable>,
  classTtGenId      : { var value : Nat },
  teacherTimetables : Map.Map<Text, ClassTimetableTypes.TeacherTimetable>,
  classLinksStore   : Map.Map<Text, ClassTimetableTypes.ClassLinks>
) {

  func nextClassTtId() : Text {
    let id = classTtGenId.value;
    classTtGenId.value += 1;
    "CTT-" # id.toText()
  };

  /// Create a new class timetable.
  public shared func createClassTimetable(
    timetable : ClassTimetableTypes.ClassTimetable
  ) : async ClassTimetableTypes.ClassTimetable {
    ClassTimetableLib.create(classTimetables, nextClassTtId, timetable)
  };

  /// Return all class timetables, optionally filtered by sessionId.
  public query func getClassTimetables(sessionId : ?Text) : async [ClassTimetableTypes.ClassTimetable] {
    ClassTimetableLib.getAll(classTimetables, sessionId)
  };

  /// Return a specific class timetable by id.
  public query func getClassTimetableById(id : Text) : async ?ClassTimetableTypes.ClassTimetable {
    ClassTimetableLib.getById(classTimetables, id)
  };

  /// Update a class timetable. Returns true if found.
  public shared func updateClassTimetable(
    id        : Text,
    timetable : ClassTimetableTypes.ClassTimetable
  ) : async Bool {
    ClassTimetableLib.update(classTimetables, id, timetable)
  };

  /// Delete a class timetable. Returns true if found.
  public shared func deleteClassTimetable(id : Text) : async Bool {
    ClassTimetableLib.delete(classTimetables, id)
  };

  /// Auto-generate a class timetable from caller-supplied data.
  /// assignments: [(teacherId, classLevelTag, ?sectionId, subjectId)]
  ///   classLevelTag is the debug_show representation of ClassLevel (e.g. "#Class1")
  /// staffData:   [(staffId, fullName)]
  /// subjectData: [(subjectId, subjectName)]
  public shared func generateClassTimetable(
    params      : ClassTimetableTypes.GenerateTimetableParams,
    assignments : [(Text, Text, ?Text, Text)],  // (teacherId, classLevelTag, ?sectionId, subjectId)
    staffData   : [(Text, Text)],               // (staffId, fullName)
    subjectData : [(Text, Text)]                // (subjectId, subjectName)
  ) : async ClassTimetableTypes.ClassTimetable {
    let staffMap   = Map.fromArray(staffData);
    let subjectMap = Map.fromArray(subjectData);
    let entries    = ClassTimetableLib.generateTimetable(params, assignments, staffMap, subjectMap);
    let newTimetable : ClassTimetableTypes.ClassTimetable = {
      id        = "";
      sessionId = params.sessionId;
      name      = params.name;
      entries;
      periodConfigs = params.periodConfigs;
      createdAt = 0;
      updatedAt = 0;
    };
    ClassTimetableLib.create(classTimetables, nextClassTtId, newTimetable)
  };

  /// Batch copy-paste cells across timetables.
  /// Each CellCopyOp identifies a source cell and a target cell by timetable id,
  /// day, and period.  Returns the number of cells successfully pasted.
  public shared func copyPasteTimetableCells(
    ops : [ClassTimetableTypes.CellCopyOp]
  ) : async Nat {
    ClassTimetableLib.copyCells(classTimetables, ops)
  };

  /// Return all class timetables as (id, timetable) pairs for the school-wide dashboard.
  /// Optionally filter by sessionId.
  public query func getSchoolWideTimetable(
    sessionId : ?Text
  ) : async [(Text, ClassTimetableTypes.ClassTimetable)] {
    ClassTimetableLib.getSchoolWide(classTimetables, sessionId)
  };

  /// Batch-save (upsert) multiple class timetables in one call.
  /// Returns the count of timetables persisted.
  public shared func batchSaveClassTimetables(
    timetables : [ClassTimetableTypes.ClassTimetable]
  ) : async Nat {
    ClassTimetableLib.batchSave(classTimetables, nextClassTtId, timetables)
  };

  /// Copy all period entries from (sourceTimetableId, sourceDay) to (targetTimetableId, targetDay).
  /// Existing entries on targetDay are cleared before pasting.
  public shared func copyPasteEntireDay(
    sourceTimetableId : Text,
    sourceDay         : Text,
    targetTimetableId : Text,
    targetDay         : Text
  ) : async Bool {
    ClassTimetableLib.copyEntireDay(classTimetables, sourceTimetableId, sourceDay, targetTimetableId, targetDay)
  };

  /// Auto-generate teacher-wise timetables from all class timetables in a session.
  /// The generated timetables are saved to stable storage and returned.
  public shared func generateTeacherTimetable(
    sessionId : Text
  ) : async [ClassTimetableTypes.TeacherTimetable] {
    let generated = ClassTimetableLib.buildTeacherTimetables(classTimetables, sessionId);
    // Save / overwrite each teacher timetable
    for (tt in generated.values()) {
      teacherTimetables.add(tt.id, tt)
    };
    generated
  };

  /// Fetch saved teacher timetables for a session.
  public query func getTeacherTimetables(
    sessionId : Text
  ) : async [ClassTimetableTypes.TeacherTimetable] {
    teacherTimetables.values()
      |> List.fromIter<ClassTimetableTypes.TeacherTimetable>(_)
      |> _.filter(func(t : ClassTimetableTypes.TeacherTimetable) : Bool { t.sessionId == sessionId })
      |> _.toArray()
  };

  /// Explicitly save a set of teacher timetables (e.g. after manual edits).
  public shared func saveTeacherTimetables(
    timetables : [ClassTimetableTypes.TeacherTimetable]
  ) : async Nat {
    let now = Time.now();
    var count : Nat = 0;
    for (tt in timetables.values()) {
      let record = if (tt.generatedAt == 0) { { tt with generatedAt = now } } else { tt };
      teacherTimetables.add(record.id, record);
      count += 1;
    };
    count
  };

  /// Save (upsert) per-class CCTV and digital broadcast links.
  public shared func saveClassLinks(
    links : [ClassTimetableTypes.ClassLinks]
  ) : async Nat {
    var count : Nat = 0;
    for (l in links.values()) {
      let key = l.classLevel # "##" # l.sectionName;
      classLinksStore.add(key, l);
      count += 1;
    };
    count
  };

  /// Retrieve all class links, optionally filtered by classLevel tag.
  public query func getClassLinks(
    classLevelTag : ?Text
  ) : async [ClassTimetableTypes.ClassLinks] {
    let all = classLinksStore.values()
      |> List.fromIter<ClassTimetableTypes.ClassLinks>(_);
    switch (classLevelTag) {
      case (?tag) all.filter(func(l : ClassTimetableTypes.ClassLinks) : Bool { l.classLevel == tag }).toArray();
      case null   all.toArray();
    }
  };

};
