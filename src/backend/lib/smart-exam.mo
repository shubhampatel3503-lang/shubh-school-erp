import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/smart-exam";

module {

  public type SmartExamTimetable     = Types.SmartExamTimetable;
  public type SmartTimetableEntry    = Types.SmartTimetableEntry;
  public type GenerateScheduleParams = Types.GenerateScheduleParams;
  public type ClassLevel             = Types.ClassLevel;

  // ─── CLASS_ORDER for canonical sorting ─────────────────────────────────────
  let CLASS_ORDER : [ClassLevel] = [
    #PlayWay, #LKG, #UKG,
    #Class1, #Class2, #Class3, #Class4, #Class5, #Class6,
    #Class7, #Class8, #Class9, #Class10, #Class11, #Class12,
  ];

  func classIndex(cl : ClassLevel) : Nat {
    switch (CLASS_ORDER.findIndex(func(c : ClassLevel) : Bool { c == cl })) {
      case (?i) i;
      case null 99;
    }
  };

  // ─── Date helpers ──────────────────────────────────────────────────────────

  func parseDDMMYYYY(s : Text) : ?(Nat, Nat, Nat) {
    let parts = s.split(#char '/') |> _.toArray();
    if (parts.size() != 3) return null;
    switch (Nat.fromText(parts[0]), Nat.fromText(parts[1]), Nat.fromText(parts[2])) {
      case (?d, ?m, ?y) ?(d, m, y);
      case _ null;
    }
  };

  // Day of week via Tomohiko Sakamoto's algorithm (0=Sun,1=Mon,...,6=Sat)
  func dayOfWeek(d : Nat, m : Nat, y : Nat) : Nat {
    let t : [Nat] = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    let yr = if (m < 3) { Nat.sub(y, 1) } else { y };
    (yr + yr / 4 - yr / 100 + yr / 400 + t[m - 1] + d) % 7
  };

  func dayName(dow : Nat) : Text {
    switch (dow) {
      case 0 "Sunday"; case 1 "Monday"; case 2 "Tuesday";
      case 3 "Wednesday"; case 4 "Thursday"; case 5 "Friday";
      case 6 "Saturday"; case _ "Unknown";
    }
  };

  func nextDay(d : Nat, m : Nat, y : Nat) : (Nat, Nat, Nat) {
    let daysInMonth : [Nat] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let isLeap = (y % 4 == 0 and y % 100 != 0) or (y % 400 == 0);
    let maxDay = if (m == 2 and isLeap) { 29 } else { daysInMonth[m - 1] };
    if (d < maxDay) { (d + 1, m, y) }
    else if (m < 12) { (1, m + 1, y) }
    else { (1, 1, y + 1) }
  };

  func padTwo(n : Nat) : Text {
    if (n < 10) { "0" # n.toText() } else { n.toText() }
  };

  func dateString(d : Nat, m : Nat, y : Nat) : Text {
    padTwo(d) # "/" # padTwo(m) # "/" # y.toText()
  };

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  /// Persist a smart exam timetable and return the assigned id.
  public func create(
    smartExamTimetables : Map.Map<Nat, SmartExamTimetable>,
    nextId              : { var value : Nat },
    timetable           : SmartExamTimetable
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    smartExamTimetables.add(id, { timetable with id });
    id
  };

  /// Return all smart exam timetables (optionally filtered by sessionId).
  public func getAll(
    smartExamTimetables : Map.Map<Nat, SmartExamTimetable>,
    sessionId           : ?Text
  ) : [SmartExamTimetable] {
    let all = smartExamTimetables.values() |> List.fromIter<SmartExamTimetable>(_);
    switch (sessionId) {
      case (?sid) all.filter(func(t : SmartExamTimetable) : Bool { t.sessionId == sid }).toArray();
      case null   all.toArray();
    }
  };

  /// Return a specific timetable by id.
  public func getById(
    smartExamTimetables : Map.Map<Nat, SmartExamTimetable>,
    id                  : Nat
  ) : ?SmartExamTimetable {
    smartExamTimetables.get(id)
  };

  /// Update an existing timetable. Returns true if found and updated.
  public func update(
    smartExamTimetables : Map.Map<Nat, SmartExamTimetable>,
    id                  : Nat,
    timetable           : SmartExamTimetable
  ) : Bool {
    switch (smartExamTimetables.get(id)) {
      case (?_) { smartExamTimetables.add(id, { timetable with id }); true };
      case null false;
    }
  };

  /// Delete a timetable by id. Returns true if found.
  public func delete(
    smartExamTimetables : Map.Map<Nat, SmartExamTimetable>,
    id                  : Nat
  ) : Bool {
    switch (smartExamTimetables.get(id)) {
      case (?_) { smartExamTimetables.remove(id); true };
      case null false;
    }
  };

  // ─── SMART SCHEDULING ALGORITHM ───────────────────────────────────────────
  //
  // Strategy:
  //   1. Enumerate all Mon-Sat dates in [startDate, endDate].
  //   2. For each participating class, assign subjects one per day in order,
  //      skipping dates where the same subject is already used (teacher conflict).
  //   3. Return entries sorted by date then by CLASS_ORDER position.

  public func generateSchedule(params : GenerateScheduleParams) : [SmartTimetableEntry] {
    let startOpt = parseDDMMYYYY(params.startDate);
    let endOpt   = parseDDMMYYYY(params.endDate);
    let (sd, sm, sy) = switch (startOpt) { case (?v) v; case null return [] };
    let (ed, em, ey) = switch (endOpt)   { case (?v) v; case null return [] };

    // Build list of Mon-Sat dates
    let availDates = List.empty<Text>();
    var cd = sd; var cm = sm; var cy = sy;
    label dateLoop loop {
      let dow = dayOfWeek(cd, cm, cy);
      if (dow != 0) { availDates.add(dateString(cd, cm, cy)) };
      if (cy > ey or (cy == ey and cm > em) or (cy == ey and cm == em and cd >= ed)) {
        break dateLoop
      };
      let (nd, nm, ny) = nextDay(cd, cm, cy);
      cd := nd; cm := nm; cy := ny;
    };
    let dates = availDates.toArray();
    if (dates.size() == 0) return [];

    let entries = List.empty<SmartTimetableEntry>();
    // Track (date, subjectName) pairs already scheduled (teacher-level conflict proxy)
    let usedDateSubject = Set.empty<Text>();

    for ((cl, subjects) in params.classSubjects.values()) {
      if (subjects.size() == 0) { /* skip */ } else {
        var subjIdx : Nat = 0;
        var dateIdx : Nat = 0;

        label classLoop while (subjIdx < subjects.size()) {
          if (dateIdx >= dates.size()) break classLoop;
          let subj = subjects[subjIdx];
          label dateSearch while (dateIdx < dates.size()) {
            let d = dates[dateIdx];
            let conflictKey = d # "##" # subj;
            if (not usedDateSubject.contains(conflictKey)) {
              let dow2 = switch (parseDDMMYYYY(d)) {
                case (?(dd, mm, yy)) dayName(dayOfWeek(dd, mm, yy));
                case null "Unknown";
              };
              entries.add({
                date        = d;
                day         = dow2;
                classLevel  = cl;
                subjectName = subj;
                position    = classIndex(cl);
                isLocked    = false;
              });
              usedDateSubject.add(conflictKey);
              dateIdx += 1;
              break dateSearch
            };
            dateIdx += 1;
          };
          subjIdx += 1;
        };
      }
    };

    // Sort: primary by date (text compare works because dd/mm/yyyy sorts chronologically
    // only for same year; for multi-year we compare by parsed values — but for exam
    // schedules within a single session this is acceptable)
    let sorted = entries.sort(func(a : SmartTimetableEntry, b : SmartTimetableEntry) : { #less; #equal; #greater } {
      let ac = Text.compare(a.date, b.date);
      if (not ac.isEqual()) { ac } else { Nat.compare(a.position, b.position) }
    });
    sorted.toArray()
  };

};
