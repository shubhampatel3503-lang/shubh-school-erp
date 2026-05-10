import Map "mo:core/Map";
import SmartExamLib "../lib/smart-exam";
import SmartExamTypes "../types/smart-exam";

/// Smart Exam Timetable mixin — AI-generated timetable with drag-and-drop subject reordering.
/// State slices injected: smartExamTimetables, nextSmartExamId.
mixin (
  smartExamTimetables : Map.Map<Nat, SmartExamTypes.SmartExamTimetable>,
  nextSmartExamId     : { var value : Nat }
) {

  /// Create a new smart exam timetable and return its id.
  public shared func createSmartExamTimetable(
    timetable : SmartExamTypes.SmartExamTimetable
  ) : async Nat {
    SmartExamLib.create(smartExamTimetables, nextSmartExamId, timetable)
  };

  /// Return all smart exam timetables, optionally filtered by sessionId.
  public query func getSmartExamTimetables(sessionId : ?Text) : async [SmartExamTypes.SmartExamTimetable] {
    SmartExamLib.getAll(smartExamTimetables, sessionId)
  };

  /// Return a specific timetable by id.
  public query func getSmartExamTimetableById(id : Nat) : async ?SmartExamTypes.SmartExamTimetable {
    SmartExamLib.getById(smartExamTimetables, id)
  };

  /// Update an existing timetable (e.g. after subject reorder or save). Returns true if found.
  public shared func updateSmartExamTimetable(
    id        : Nat,
    timetable : SmartExamTypes.SmartExamTimetable
  ) : async Bool {
    SmartExamLib.update(smartExamTimetables, id, timetable)
  };

  /// Delete a smart exam timetable. Returns true if found.
  public shared func deleteSmartExamTimetable(id : Nat) : async Bool {
    SmartExamLib.delete(smartExamTimetables, id)
  };

  /// Generate a smart exam schedule from the given parameters.
  /// Returns an array of SmartTimetableEntry sorted by date then class order.
  public query func generateSmartExamSchedule(
    params : SmartExamTypes.GenerateScheduleParams
  ) : async [SmartExamTypes.SmartTimetableEntry] {
    SmartExamLib.generateSchedule(params)
  };

};
