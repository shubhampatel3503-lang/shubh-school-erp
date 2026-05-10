import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/class-timetable";

module {

  public type ClassTimetable          = Types.ClassTimetable;
  public type ClassTimetableEntry     = Types.ClassTimetableEntry;
  public type ClassLevel              = Types.ClassLevel;
  public type GenerateTimetableParams = Types.GenerateTimetableParams;
  public type PeriodConfig            = Types.PeriodConfig;
  public type CellCopyOp              = Types.CellCopyOp;
  public type TeacherTimetableEntry   = Types.TeacherTimetableEntry;
  public type TeacherTimetable        = Types.TeacherTimetable;

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  public func create(
    classTimetables : Map.Map<Text, ClassTimetable>,
    genId           : () -> Text,
    timetable       : ClassTimetable
  ) : ClassTimetable {
    let id  = genId();
    let now = Time.now();
    let t   = { timetable with id; createdAt = now; updatedAt = now };
    classTimetables.add(id, t);
    t
  };

  public func getAll(
    classTimetables : Map.Map<Text, ClassTimetable>,
    sessionId       : ?Text
  ) : [ClassTimetable] {
    let all = classTimetables.values() |> List.fromIter<ClassTimetable>(_);
    switch (sessionId) {
      case (?sid) all.filter(func(t : ClassTimetable) : Bool { t.sessionId == sid }).toArray();
      case null   all.toArray();
    }
  };

  public func getById(
    classTimetables : Map.Map<Text, ClassTimetable>,
    id              : Text
  ) : ?ClassTimetable {
    classTimetables.get(id)
  };

  public func update(
    classTimetables : Map.Map<Text, ClassTimetable>,
    id              : Text,
    timetable       : ClassTimetable
  ) : Bool {
    switch (classTimetables.get(id)) {
      case (?existing) {
        classTimetables.add(id, { timetable with id; createdAt = existing.createdAt; updatedAt = Time.now() });
        true
      };
      case null false;
    }
  };

  public func delete(
    classTimetables : Map.Map<Text, ClassTimetable>,
    id              : Text
  ) : Bool {
    switch (classTimetables.get(id)) {
      case (?_) { classTimetables.remove(id); true };
      case null false;
    }
  };

  // ─── SCHOOL-WIDE VIEW ─────────────────────────────────────────────────────
  //
  // Returns all timetables as a flat array.  The frontend maps classId → ClassTimetable.

  public func getSchoolWide(
    classTimetables : Map.Map<Text, ClassTimetable>,
    sessionId       : ?Text
  ) : [(Text, ClassTimetable)] {
    let all = classTimetables.entries() |> List.fromIter<(Text, ClassTimetable)>(_);
    switch (sessionId) {
      case (?sid) all.filter(func(pair : (Text, ClassTimetable)) : Bool { pair.1.sessionId == sid }).toArray();
      case null   all.toArray();
    }
  };

  // ─── COPY / PASTE CELLS ──────────────────────────────────────────────────
  //
  // For each CellCopyOp, finds the entry in the SOURCE timetable matching
  // (source.dayOfWeek, source.periodNumber), then upserts it into the TARGET
  // timetable at (target.dayOfWeek, target.periodNumber) — teacher, subject,
  // startTime and endTime are copied; classLevel and sectionName come from the
  // target timetable's existing entries (or the source entry itself if the target
  // cell is new).
  //
  // Returns the number of cells successfully pasted.

  public func copyCells(
    classTimetables : Map.Map<Text, ClassTimetable>,
    ops             : [CellCopyOp]
  ) : Nat {
    var pasted : Nat = 0;
    for (op in ops.values()) {
      switch (classTimetables.get(op.source.classId), classTimetables.get(op.target.classId)) {
        case (?srcTT, ?tgtTT) {
          // Find source entry
          let srcEntryOpt = srcTT.entries.find(func(e : ClassTimetableEntry) : Bool {
            e.dayOfWeek == op.source.dayOfWeek and e.periodNumber == op.source.periodNumber
          });
          switch (srcEntryOpt) {
            case (?srcEntry) {
              // Build new entries list for target timetable:
              // replace existing target cell (same day+period) or append
              let newEntry : ClassTimetableEntry = {
                periodNumber   = op.target.periodNumber;
                dayOfWeek      = op.target.dayOfWeek;
                classLevel     = tgtTT.entries.find(func(e : ClassTimetableEntry) : Bool {
                                   e.dayOfWeek == op.target.dayOfWeek and
                                   e.periodNumber == op.target.periodNumber
                                 }) |> (switch _ { case (?e) e.classLevel; case null srcEntry.classLevel });
                sectionName    = tgtTT.entries.find(func(e : ClassTimetableEntry) : Bool {
                                   e.dayOfWeek == op.target.dayOfWeek and
                                   e.periodNumber == op.target.periodNumber
                                 }) |> (switch _ { case (?e) e.sectionName; case null srcEntry.sectionName });
                subjectName    = srcEntry.subjectName;
                teacherName    = srcEntry.teacherName;
                teacherStaffId = srcEntry.teacherStaffId;
                startTime      = srcEntry.startTime;
                endTime        = srcEntry.endTime;
              };
              // Filter out any existing entry at target cell, then append
              let filtered = tgtTT.entries.filter(func(e : ClassTimetableEntry) : Bool {
                not (e.dayOfWeek == op.target.dayOfWeek and e.periodNumber == op.target.periodNumber)
              });
              let updatedEntries = filtered.concat([newEntry]);
              classTimetables.add(op.target.classId, {
                tgtTT with
                entries   = updatedEntries;
                updatedAt = Time.now();
              });
              pasted += 1;
            };
            case null {};
          };
        };
        case _ {};
      };
    };
    pasted
  };

  // ─── AUTO-GENERATION ──────────────────────────────────────────────────────
  //
  // assignments: [(teacherId, classLevelTag, ?sectionId, subjectId)]
  //   classLevelTag = debug_show(classLevel), e.g. "#Class1"
  // staffMap:   Map<staffId, fullName>
  // subjectMap: Map<subjectId, subjectName>
  //
  // For each (day, period, classSectionSlot) the algorithm picks an assignment
  // that avoids:
  //   a) Same teacher in same day+period (teacher-level conflict)
  //   b) Same subject for the same class+section on the same day (class conflict)
  //
  // Period start/end times are taken from params.periodConfigs when provided;
  // otherwise params.periodStartTimes / periodEndTimes are used.

  public func generateTimetable(
    params      : GenerateTimetableParams,
    assignments : [(Text, Text, ?Text, Text)],  // (teacherId, classLevelTag, ?sectionId, subjectId)
    staffMap    : Map.Map<Text, Text>,           // staffId → fullName
    subjectMap  : Map.Map<Text, Text>            // subjectId → subjectName
  ) : [ClassTimetableEntry] {
    let entries = List.empty<ClassTimetableEntry>();

    // Resolve per-period start/end times from periodConfigs or legacy arrays
    let configs : [PeriodConfig] = switch (params.periodConfigs) { case (?pc) pc; case null [] };
    let resolveTime = func(period : Nat, useStart : Bool) : Text {
      if (configs.size() > 0) {
        switch (configs.find(func(pc : PeriodConfig) : Bool { pc.periodNumber == period })) {
          case (?pc) pc.startTime;
          case null "";
        }
      } else if (useStart) {
        if (period <= params.periodStartTimes.size()) params.periodStartTimes[period - 1] else ""
      } else {
        if (period <= params.periodEndTimes.size()) params.periodEndTimes[period - 1] else ""
      }
    };

    // Group assignments by (classLevelTag ## sectionName)
    let classAssignments = Map.empty<Text, List.List<(Text, Text, ?Text, Text)>>();
    for (a in assignments.values()) {
      let (_teacherId, clTag, sectionIdOpt, _subjectId) = a;
      let secName = switch (sectionIdOpt) { case (?s) s; case null "A" };
      let key = clTag # "##" # secName;
      let bucket = switch (classAssignments.get(key)) {
        case (?lst) lst;
        case null {
          let l = List.empty<(Text, Text, ?Text, Text)>();
          classAssignments.add(key, l);
          l
        };
      };
      bucket.add(a);
    };

    // Conflict tracking
    let teacherUsed   = Set.empty<Text>();   // day ## period ## teacherId
    let classDaySubj  = Set.empty<Text>();   // day ## clKey ## subjectName

    for ((cl, secName) in params.classSections.values()) {
      let clKey  = debug_show(cl) # "##" # secName;
      let asgArr = switch (classAssignments.get(clKey)) {
        case (?lst) lst.toArray();
        case null   [];
      };
      if (asgArr.size() > 0) {
        var asgIdx : Nat = 0;

        for (day in params.workDays.values()) {
          for (period in Nat.range(1, params.periodsPerDay + 1)) {
            // Skip interval/break slots
            let isInterval = configs.find(
              func(pc : PeriodConfig) : Bool { pc.periodNumber == period and pc.isInterval }
            ) != null;
            if (not isInterval) {
              var tried : Nat = 0;
              label findSlot while (tried < asgArr.size()) {
                let (teacherId, _clTag, _secIdOpt, subjectId) = asgArr[asgIdx % asgArr.size()];
                switch (staffMap.get(teacherId), subjectMap.get(subjectId)) {
                  case (?tName, ?sName) {
                    let teacherKey  = day # "##" # period.toText() # "##" # teacherId;
                    let classDayKey = day # "##" # clKey # "##" # sName;
                    if (teacherUsed.contains(teacherKey) or classDaySubj.contains(classDayKey)) {
                      tried  += 1;
                      asgIdx += 1;
                    } else {
                      let startTime = resolveTime(period, true);
                      let endTime   = resolveTime(period, false);
                      entries.add({
                        periodNumber   = period;
                        dayOfWeek      = day;
                        classLevel     = cl;
                        sectionName    = secName;
                        subjectName    = sName;
                        teacherName    = tName;
                        teacherStaffId = teacherId;
                        startTime;
                        endTime;
                      });
                      teacherUsed.add(teacherKey);
                      classDaySubj.add(classDayKey);
                      asgIdx += 1;
                      break findSlot
                    }
                  };
                  case _ {
                    tried  += 1;
                    asgIdx += 1;
                  };
                };
              };
            }
          }
        };
      }
    };

    entries.toArray()
  };

  // ─── BATCH SAVE ──────────────────────────────────────────────────────────
  // Saves (upserts) each timetable independently. Returns count persisted.

  public func batchSave(
    classTimetables : Map.Map<Text, ClassTimetable>,
    genId           : () -> Text,
    timetables      : [ClassTimetable]
  ) : Nat {
    var saved : Nat = 0;
    for (t in timetables.values()) {
      let now = Time.now();
      if (t.id == "" or classTimetables.get(t.id) == null) {
        let id = if (t.id == "") { genId() } else { t.id };
        classTimetables.add(id, { t with id; createdAt = now; updatedAt = now });
      } else {
        switch (classTimetables.get(t.id)) {
          case (?existing) {
            classTimetables.add(t.id, { t with id = t.id; createdAt = existing.createdAt; updatedAt = now })
          };
          case null {};
        }
      };
      saved += 1;
    };
    saved
  };

  // ─── COPY ENTIRE DAY ─────────────────────────────────────────────────────
  // Copies all period entries from sourceTimetable/sourceDay to targetTimetable/targetDay.
  // Existing entries on targetDay are cleared first.

  public func copyEntireDay(
    classTimetables : Map.Map<Text, ClassTimetable>,
    sourceTtId      : Text,
    sourceDay       : Text,
    targetTtId      : Text,
    targetDay       : Text
  ) : Bool {
    switch (classTimetables.get(sourceTtId), classTimetables.get(targetTtId)) {
      case (?srcTT, ?tgtTT) {
        let srcEntries = srcTT.entries.filter(
          func(e : ClassTimetableEntry) : Bool { e.dayOfWeek == sourceDay }
        );
        let tgtKeepEntries = tgtTT.entries.filter(
          func(e : ClassTimetableEntry) : Bool { e.dayOfWeek != targetDay }
        );
        let pastedEntries = srcEntries.map(
          func(e : ClassTimetableEntry) : ClassTimetableEntry { { e with dayOfWeek = targetDay } }
        );
        let newEntries = tgtKeepEntries.concat(pastedEntries);
        classTimetables.add(targetTtId, { tgtTT with entries = newEntries; updatedAt = Time.now() });
        true
      };
      case _ false;
    }
  };

  // ─── GENERATE TEACHER TIMETABLES ─────────────────────────────────────────
  // Reads all ClassTimetable entries for the given session and groups them by
  // teacherStaffId to produce one TeacherTimetable per teacher.

  public func buildTeacherTimetables(
    classTimetables : Map.Map<Text, ClassTimetable>,
    sessionId       : Text
  ) : [TeacherTimetable] {
    let now = Time.now();
    let buckets = Map.empty<Text, List.List<TeacherTimetableEntry>>();
    let nameMap = Map.empty<Text, Text>(); // staffId -> teacherName
    let allTTs  = classTimetables.values()
      |> List.fromIter<ClassTimetable>(_)
      |> _.filter(func(t : ClassTimetable) : Bool { t.sessionId == sessionId });
    allTTs.forEach(func(tt : ClassTimetable) {
      for (e in tt.entries.values()) {
        if (e.teacherStaffId != "") {
          let bucket = switch (buckets.get(e.teacherStaffId)) {
            case (?lst) lst;
            case null {
              let l = List.empty<TeacherTimetableEntry>();
              buckets.add(e.teacherStaffId, l);
              l
            };
          };
          nameMap.add(e.teacherStaffId, e.teacherName);
          bucket.add({
            dayOfWeek    = e.dayOfWeek;
            periodNumber = e.periodNumber;
            className    = debug_show(e.classLevel);
            sectionName  = e.sectionName;
            subjectName  = e.subjectName;
            startTime    = e.startTime;
            endTime      = e.endTime;
          })
        }
      }
    });
    let result = List.empty<TeacherTimetable>();
    buckets.entries()
      |> List.fromIter<(Text, List.List<TeacherTimetableEntry>)>(_)
      |> _.forEach(func((staffId, lst)) {
          let tName = switch (nameMap.get(staffId)) { case (?n) n; case null "" };
          result.add({
            id             = staffId # "#" # sessionId;
            sessionId;
            teacherStaffId = staffId;
            teacherName    = tName;
            entries        = lst.toArray();
            generatedAt    = now;
          })
        });
    result.toArray()
  };
};
